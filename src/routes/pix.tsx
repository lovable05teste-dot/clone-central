import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createPixCharge, getPixStatus } from "@/lib/pix.functions";
import { captureUtms, getUtmQuery } from "@/lib/utm";
import QRCode from "qrcode";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/pix")({
  head: () => ({
    meta: [
      { title: "Pague via Pix" },
      { name: "description", content: "Pague sua compra via Pix para concluir." },
      { property: "og:title", content: "Pague via Pix" },
      { property: "og:description", content: "Pague sua compra via Pix para concluir." },
    ],
  }),
  component: PixPage,
});

function MoneyIcon() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00a650]">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00a650" strokeWidth="2">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <circle cx="12" cy="12" r="2.5"/>
          <circle cx="5" cy="12" r="0.6" fill="#00a650"/>
          <circle cx="19" cy="12" r="0.6" fill="#00a650"/>
        </svg>
      </span>
      <span className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#00a650] text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>
      </span>
    </div>
  );
}

function PixPage() {
  const createCharge = useServerFn(createPixCharge);
  const fetchStatus = useServerFn(getPixStatus);
  const [pixCode, setPixCode] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>("");
  const [paid, setPaid] = useState(false);
  const [priceStr, setPriceStr] = useState("61,93");
  const [address, setAddress] = useState<{
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    name?: string;
  }>({});
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("checkout_customer") : null;
        const customer = raw ? JSON.parse(raw) : {};
        setAddress(customer || {});
        const prodRaw = typeof window !== "undefined" ? localStorage.getItem("checkout_product") : null;
        const product = prodRaw ? JSON.parse(prodRaw) : {};
        const priceText: string = product?.price || "61,93";
        setPriceStr(priceText);
        const amountCents = Math.round(
          Number(String(priceText).replace(/\./g, "").replace(",", ".")) * 100
        );
        captureUtms();
        const utm = getUtmQuery();
        const doc = String(customer.cpf || customer.document || "").replace(/\D+/g, "");
        if (doc.length !== 11 && doc.length !== 14) {
          setError("CPF não informado. Volte para a etapa de dados e preencha seu CPF.");
          started.current = false;
          return;
        }
        const result = await createCharge({
          data: {
            name: customer.name || "Cliente",
            document: doc,
            email: customer.email || "",
            phone: customer.phone || customer.telefone || "",
            utm,
            amountCents: amountCents > 0 ? amountCents : 6193,
            itemTitle: product?.title || "Produto",
          },
        });
        setPixCode(result.pixCode);
        QRCode.toDataURL(result.pixCode, {
          width: 260,
          margin: 1,
          errorCorrectionLevel: "L",
        })
          .then(setQrDataUrl)
          .catch(() => setQrDataUrl(""));
        setTransactionId(result.transactionId);
        try {
          localStorage.setItem("pix_transaction_id", result.transactionId);
        } catch {}
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível gerar o Pix.");
      }
    })();
  }, [createCharge]);

  useEffect(() => {
    if (!pixCode || qrDataUrl) return;
    QRCode.toDataURL(pixCode, { width: 260, margin: 1, errorCorrectionLevel: "L" })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [pixCode, qrDataUrl]);

  useEffect(() => {
    if (!transactionId) return;
    let stopped = false;
    const interval = setInterval(async () => {
      if (stopped) return;
      try {
        const s = await fetchStatus({ data: { transactionId } });
        if (s.status === "COMPLETED") {
          stopped = true;
          clearInterval(interval);
          setPaid(true);
        }
      } catch {}
    }, 5000);
    const timeout = setTimeout(() => {
      stopped = true;
      clearInterval(interval);
    }, 15 * 60 * 1000);
    return () => {
      stopped = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [transactionId, fetchStatus]);

  const copy = async () => {
    if (!pixCode) return;
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#ededed] py-4 sm:py-6" style={{ fontFamily: "'Proxima Nova', -apple-system, Roboto, Arial, sans-serif" }}>
      <div className="mx-auto w-full max-w-[720px] px-3 sm:px-4 space-y-3 sm:space-y-4">
        <section className="bg-white rounded-lg p-4 sm:p-6 text-center">
          <div className="flex justify-center mb-3"><MoneyIcon /></div>
          <div className="text-[13px] text-gray-500">{paid ? "Pagamento confirmado!" : "Falta pouco!"}</div>
          <h1 className="text-[19px] sm:text-[22px] font-semibold text-gray-900 leading-tight mt-2">
            {paid ? (
              <>Compra concluída com sucesso.</>
            ) : (
              <>Pague R$ {priceStr} via Pix<br />para concluir sua compra</>
            )}
          </h1>

        </section>

        {!paid && (
          <section className="bg-white rounded-lg p-4 sm:p-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Instruções de pagamento</h2>
            <ol className="space-y-2 text-[15px] text-gray-800">
              <li>1. Acesse seu Internet Banking ou app de pagamentos.</li>
              <li>2. Escolha pagar via Pix.</li>
              <li>3. Cole o código abaixo.</li>
            </ol>

            <div className="my-4 min-h-[72px]">
              {pixCode ? (
                <>
                  {qrDataUrl && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={qrDataUrl}
                        alt="QR Code Pix para pagamento"
                        className="h-[220px] w-[220px] rounded-md border border-gray-200 bg-white p-2"
                      />
                    </div>
                  )}
                  <div className="rounded-md border border-gray-200 px-4 py-3 text-[13px] text-gray-700 break-all font-medium">
                    {pixCode}
                  </div>
                </>
              ) : error ? (
                <div className="text-sm text-red-600">
                  {error}
                  <a href="/endereco" className="ml-1 underline text-[#3483fa]">
                    Corrigir meus dados
                  </a>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Gerando código Pix…</div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 text-[14px] text-gray-700">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Pague e será creditado na hora.
            </div>

            <div className="mt-3 rounded-md border-l-4 border-[#3483fa] bg-[#eaf3ff] px-4 py-3 text-[14px] text-gray-800">
              Em caso de não pagamento sua compra será cancelada automaticamente.
            </div>

            <button
              onClick={copy}
              disabled={!pixCode}
              className="block w-full rounded-md bg-[#3483fa] hover:bg-[#2968c8] disabled:opacity-60 text-white text-center py-4 text-[16px] font-semibold mt-6 transition-colors"
            >
              {copied ? "Código copiado!" : "Copiar código"}
            </button>
            <button
              type="button"
              className="block w-full rounded-md border border-[#3483fa] text-[#3483fa] hover:bg-[#eaf3ff] text-center py-4 text-[16px] font-semibold mt-3 transition-colors"
            >
              Já fiz o pagamento
            </button>
          </section>
        )}

        <section className="bg-white rounded-lg p-4 sm:p-6">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-2">Endereço informado</h2>
          {address.rua || address.cep ? (
            <div className="text-[14px] text-gray-800">
              {address.name && <div className="font-medium">{address.name}</div>}
              <div>{[address.rua, address.numero, address.complemento].filter(Boolean).join(", ")}</div>
              <div className="text-gray-500">
                {[address.bairro, address.cidade, address.estado].filter(Boolean).join(" - ")}
                {address.cep ? ` · CEP ${address.cep}` : ""}
              </div>
            </div>
          ) : (
            <div className="text-[14px] text-gray-500">
              Nenhum endereço informado.{" "}
              <a href="/endereco" className="underline text-[#3483fa]">Preencher endereço</a>
            </div>
          )}
        </section>

      </div>
      <SiteFooter />
    </div>
  );
}
