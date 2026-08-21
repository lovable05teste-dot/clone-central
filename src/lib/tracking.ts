import { getUtmQuery } from "./utm";

// Utmify event helper — safely fires an event through whichever
// interface the Utmify pixel script exposes, without altering any
// existing button logic.
export function utmifyTrack(
  name: "PageView" | "ViewContent" | "InitiateCheckout" | (string & {}),
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    utmify?: {
      track?: (n: string, p?: Record<string, unknown>) => void;
      trackEvent?: (n: string, p?: Record<string, unknown>) => void;
    };
    utmifyTrack?: (n: string, p?: Record<string, unknown>) => void;
    dataLayer?: Array<Record<string, unknown>>;
  };
  try { w.utmify?.track?.(name, params); } catch { /* noop */ }
  try { w.utmify?.trackEvent?.(name, params); } catch { /* noop */ }
  try { w.utmifyTrack?.(name, params); } catch { /* noop */ }
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: name, ...(params ?? {}) });
  } catch { /* noop */ }
}

export const CHECKOUT_URL = "https://go.invictuspay.app.br/gpn09mwxri";

// ── InitiateCheckout (IC) ─────────────────────────────────────────────
// Marca o status IC na Utmify de forma isolada, com try/catch,
// validação e log de confirmação. Nunca bloqueia o fluxo de checkout.
let pendingInitiateCheckout: Promise<boolean> | null = null;
let initiateCheckoutConfirmed = false;

type UtmifyWindow = Window & {
  pixelId?: string;
  utmify?: {
    track?: (n: string, p?: Record<string, unknown>) => void;
    trackEvent?: (n: string, p?: Record<string, unknown>) => void;
  };
  utmifyTrack?: (n: string, p?: Record<string, unknown>) => void;
  dataLayer?: Array<Record<string, unknown>>;
  __ic_sent?: boolean;
  __utmify_ic_status?: Record<string, unknown>;
};

function readStoredLead(): Record<string, unknown> {
  try {
    const raw = window.localStorage.getItem("lead");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function getCookieByName(...names: string[]) {
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const cookie of cookies) {
    const [name, ...parts] = cookie.trim().split("=");
    if (names.includes(name)) return decodeURIComponent(parts.join("="));
  }
  return undefined;
}

function getParam(name: string) {
  try {
    return new URLSearchParams(window.location.search).get(name) ?? undefined;
  } catch {
    return undefined;
  }
}

function buildUtmifyLead(w: UtmifyWindow): Record<string, unknown> {
  const storedLead = readStoredLead();
  const pixelId = typeof w.pixelId === "string" ? w.pixelId : storedLead.pixelId;

  if (!pixelId) {
    throw new Error("pixelId da Utmify não encontrado");
  }

  const utmQuery = getUtmQuery();

  return {
    ...storedLead,
    pixelId,
    userAgent: navigator.userAgent,
    parameters: window.location.search || (utmQuery ? `?${utmQuery}` : ""),
    fbc: storedLead.fbc ?? getCookieByName("_fbc", "fbc"),
    fbp: storedLead.fbp ?? getCookieByName("_fbp", "fbp"),
    gclid: storedLead.gclid ?? getParam("gclid"),
    gbraid: storedLead.gbraid ?? getParam("gbraid"),
    wbraid: storedLead.wbraid ?? getParam("wbraid"),
    ttclid: storedLead.ttclid ?? getParam("ttclid"),
    tbclid: storedLead.tbclid ?? getParam("tbclid"),
  };
}

function buildUtmifyEvent() {
  const { protocol, hostname, pathname } = window.location;
  return {
    sourceUrl: `${protocol}//${hostname}${pathname}`.replace(/\/+$/, ""),
    pageTitle: document.title.trim() || null,
  };
}

async function postInitiateCheckoutToUtmify(params?: Record<string, unknown>): Promise<boolean> {
  const w = window as UtmifyWindow;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);

  try {
    const body = {
      type: "InitiateCheckout",
      lead: buildUtmifyLead(w),
      event: buildUtmifyEvent(),
      metadata: {
        event_name: "InitiateCheckout",
        status: "IC",
        ...(params ?? {}),
      },
    };

    const response = await fetch("https://tracking.utmify.com.br/tracking/v1/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Utmify IC respondeu HTTP ${response.status}`);
    }

    const result = await response.json().catch(() => null);
    const leadId = result?.lead?._id;
    const eventId = result?.event?._id;

    if (!leadId || !eventId) {
      throw new Error("Utmify IC sem confirmação de lead/evento");
    }

    try {
      window.localStorage.setItem("lead", JSON.stringify(result.lead));
    } catch {
      // O IC já foi validado; falha ao cachear o lead não deve bloquear o checkout.
    }

    w.__ic_sent = true;
    w.__utmify_ic_status = { success: true, leadId, eventId, at: Date.now() };
    console.log("[IC] InitiateCheckout registrado com sucesso", { leadId, eventId });
    return true;
  } catch (error) {
    w.__ic_sent = false;
    w.__utmify_ic_status = { success: false, error: String(error), at: Date.now() };
    console.error("[IC] falha ao registrar InitiateCheckout na Utmify:", error);
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function trackInitiateCheckout(params?: Record<string, unknown>): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (initiateCheckoutConfirmed) return Promise.resolve(true);
  if (pendingInitiateCheckout) return pendingInitiateCheckout;

  pendingInitiateCheckout = postInitiateCheckoutToUtmify(params).then((ok) => {
    initiateCheckoutConfirmed = ok;
    if (!ok) pendingInitiateCheckout = null;
    return ok;
  });

  return pendingInitiateCheckout;
}

export function trackInitiateCheckoutFallback(params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    utmify?: {
      track?: (n: string, p?: Record<string, unknown>) => void;
      trackEvent?: (n: string, p?: Record<string, unknown>) => void;
    };
    utmifyTrack?: (n: string, p?: Record<string, unknown>) => void;
    dataLayer?: Array<Record<string, unknown>>;
    __ic_sent?: boolean;
  };

  const payload = { event_name: "InitiateCheckout", status: "IC", ...(params ?? {}) };

  try {
    if (typeof w.utmify?.track === "function") {
      w.utmify.track("InitiateCheckout", payload);
    }
  } catch (e) {
    console.error("[IC] utmify.track falhou:", e);
  }

  try {
    if (typeof w.utmify?.trackEvent === "function") {
      w.utmify.trackEvent("InitiateCheckout", payload);
    }
  } catch (e) {
    console.error("[IC] utmify.trackEvent falhou:", e);
  }

  try {
    if (typeof w.utmifyTrack === "function") {
      w.utmifyTrack("InitiateCheckout", payload);
    }
  } catch (e) {
    console.error("[IC] utmifyTrack falhou:", e);
  }

  // Fallback: dataLayer (sempre empurrado, mesmo se o pixel já respondeu)
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "InitiateCheckout", ...payload });
  } catch (e) {
    console.error("[IC] dataLayer push falhou:", e);
  }

  // Marca uma flag de checkout para o pixel da Utmify (intercepta cliques)
  try {
    localStorage.setItem("utmify_ic", JSON.stringify({ at: Date.now(), ...payload }));
  } catch {}
}
