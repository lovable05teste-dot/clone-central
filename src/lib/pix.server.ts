const DEFAULT_FORTPAY_BASE_URL = "https://api.fortpayplataforma.com.br/api/public/v1";
const LEGACY_FORTPAY_HOSTS = ["api.plataformafortpay.com.br", "plataformafortpay.com.br"];
const PHYSICAL_OFFER_HASH = "o9ybnwoyun";
const PHYSICAL_PRODUCT_HASH = "txi2kwhf0r";

export type FortpayChargeInput = {
  name: string;
  document: string;
  email: string;
  phone: string;
  utm?: string;
  amountCents?: number;
  itemTitle?: string;
};

export type FortpayChargeResult = { pixCode: string; transactionId: string };

type JsonRecord = Record<string, unknown>;

export const onlyDigits = (value: string) => (value || "").replace(/\D+/g, "");

/** Normaliza telefone BR: remove +55, zeros à esquerda e caracteres extras. */
export function normalizePhone(value: string) {
  let phone = onlyDigits(value);
  if (phone.length > 11 && phone.startsWith("55")) phone = phone.slice(2);
  while (phone.length > 11 && phone.startsWith("0")) phone = phone.slice(1);
  if (phone.length === 12 && phone.startsWith("0")) phone = phone.slice(1);
  return phone;
}

/** Converte a query string de UTMs em campos de tracking da FortPay. */
function buildTracking(utm?: string): Record<string, string> {
  const qs = (utm || "").replace(/^\?/, "");
  const params = new URLSearchParams(qs);
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = params.get(k);
      if (v && v.trim()) return v.trim();
    }
    return "";
  };

  const tracking: Record<string, string> = {
    src: get("src", "utm_source") || "direct",
    utm_source: get("utm_source", "src") || "direct",
    utm_medium: get("utm_medium") || "none",
    utm_campaign: get("utm_campaign", "campaign_name") || "none",
    utm_content: get("utm_content", "ad_name", "adset_name") || "none",
    utm_term: get("utm_term", "placement") || "none",
  };

  const sck = get("sck");
  if (sck) tracking.sck = sck;
  const xcod = get("xcod");
  if (xcod) tracking.xcod = xcod;
  if (qs) tracking.utm_query = qs;

  return tracking;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function findStringByKeys(value: unknown, keys: string[]): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findStringByKeys(item, keys);
      if (found) return found;
    }
    return undefined;
  }

  if (!isRecord(value)) return undefined;

  for (const key of keys) {
    const direct = normalizeString(value[key]);
    if (direct) return direct;
  }

  for (const nested of Object.values(value)) {
    const found = findStringByKeys(nested, keys);
    if (found) return found;
  }

  return undefined;
}

function findPixCode(value: unknown): string | undefined {
  const byKnownKey = findStringByKeys(value, [
    "pix_qr_code",
    "qr_code",
    "emv",
    "code",
    "pix_code",
    "copy_paste",
    "copia_cola",
    "pixCopiaECola",
    "payload",
  ]);
  if (byKnownKey && (byKnownKey.startsWith("000201") || byKnownKey.includes("br.gov.bcb.pix"))) {
    return byKnownKey;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findPixCode(item);
      if (found) return found;
    }
    return undefined;
  }

  if (!isRecord(value)) return undefined;

  for (const item of Object.values(value)) {
    const text = normalizeString(item);
    if (text && (text.startsWith("000201") || text.includes("br.gov.bcb.pix"))) {
      return text;
    }
    const found = findPixCode(item);
    if (found) return found;
  }

  return byKnownKey;
}

function getTransactionId(value: unknown): string | undefined {
  return findStringByKeys(value, ["hash", "transaction_hash", "transaction_id", "id", "uuid"]);
}

function normalizeBaseUrl(baseUrl?: string) {
  const rawUrl = (baseUrl || DEFAULT_FORTPAY_BASE_URL).replace(/\/+$/, "");
  try {
    const parsed = new URL(rawUrl);
    if (LEGACY_FORTPAY_HOSTS.includes(parsed.hostname)) {
      return DEFAULT_FORTPAY_BASE_URL;
    }
  } catch {
    return DEFAULT_FORTPAY_BASE_URL;
  }
  return rawUrl;
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "FortPay";
  }
}

async function fortpayFetch(path: string, init: RequestInit & { token: string; baseUrl?: string }) {
  const { token, baseUrl, ...rest } = init;
  const apiBaseUrl = normalizeBaseUrl(baseUrl);
  const url = `${apiBaseUrl}${path}${path.includes("?") ? "&" : "?"}api_token=${encodeURIComponent(token)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    return await fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(rest.headers || {}),
      },
      signal: controller.signal,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "erro de conexão";
    const isTimeout = error instanceof Error && error.name === "AbortError";
    if (isTimeout) {
      throw new Error("A FortPay demorou para responder. Tente gerar o Pix novamente.");
    }
    throw new Error(
      `Não consegui conectar na API da FortPay (${getHostname(apiBaseUrl)}). Verifique se a URL base da FortPay está ativa ou informe FORTPAY_BASE_URL com o endpoint correto. Detalhe: ${message}`
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function createFortpayPixCharge(
  input: FortpayChargeInput,
  config: { token: string; offerHash: string; productHash: string; baseUrl?: string }
): Promise<FortpayChargeResult> {
  const name = (input.name || "").trim();
  const document = onlyDigits(input.document);
  const email = (input.email || "").trim();
  const phone = normalizePhone(input.phone);

  if (!name) throw new Error("Nome é obrigatório.");
  if (document.length !== 11 && document.length !== 14) {
    throw new Error(
      "CPF/CNPJ inválido. Volte para a etapa de dados e informe seu CPF (11 dígitos)."
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Email inválido.");
  if (phone.length !== 10 && phone.length !== 11) {
    throw new Error("Telefone inválido. Informe DDD + número (ex: 11987654321).");
  }

  const amount =
    Number.isFinite(input.amountCents) && (input.amountCents ?? 0) > 0
      ? Math.round(input.amountCents as number)
      : 6193;
  const title = (input.itemTitle || "Produto").slice(0, 120);
  const tracking = buildTracking(input.utm);

  const response = await fortpayFetch("/transactions", {
    token: config.token,
    baseUrl: config.baseUrl,
    method: "POST",
    body: JSON.stringify({
      amount,
      offer_hash: PHYSICAL_OFFER_HASH,
      payment_method: "pix",
      customer: {
        name,
        email,
        phone_number: phone,
        document,
      },
      cart: [
        {
          product_hash: PHYSICAL_PRODUCT_HASH,
          title,
          price: amount,
          quantity: 1,
          operation_type: 1,
          tangible: true,
        },
      ],
      expire_in_days: 1,
      transaction_origin: "api",
      tracking,
      // Alguns endpoints da FortPay leem as UTMs também na raiz do payload.
      ...tracking,
    }),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`FortPay recusou a geração do Pix (${response.status}): ${raw.slice(0, 300)}`);
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("Resposta inválida da FortPay.");
  }

  const pixCode = findPixCode(json);
  const transactionId = getTransactionId(json);

  if (!pixCode || !transactionId) {
    throw new Error(`FortPay não retornou a chave Pix copia e cola: ${raw.slice(0, 240)}`);
  }

  return { pixCode, transactionId };
}

export async function readFortpayPixStatus(transactionId: string, token: string, baseUrl?: string) {
  try {
    const response = await fortpayFetch(`/transactions/${encodeURIComponent(transactionId)}`, {
      token,
      baseUrl,
      method: "GET",
    });
    if (!response.ok) return { status: "PENDING" };

    const json = (await response.json()) as JsonRecord;
    const raw = String(findStringByKeys(json, ["status"]) || "pending").toLowerCase();
    const status =
      raw === "paid" || raw === "approved" || raw === "completed"
        ? "COMPLETED"
        : raw === "canceled" || raw === "cancelled" || raw === "refunded"
          ? raw.toUpperCase()
          : "PENDING";

    return { status, paidAt: findStringByKeys(json, ["paid_at", "paidAt", "approved_at"]) };
  } catch {
    return { status: "PENDING" };
  }
}