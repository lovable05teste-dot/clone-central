const KEY = "tracking_utm";

const TRACK_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "xcod",
  "sck",
  "src",
  "fbclid",
  "gclid",
  "gbraid",
  "wbraid",
  "ttclid",
  "tbclid",
];

let memoryUtm = "";

function readStore(): string {
  try {
    return localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || memoryUtm || "";
  } catch {
    return memoryUtm || "";
  }
}

function writeStore(qs: string) {
  memoryUtm = qs;
  try { localStorage.setItem(KEY, qs); } catch {}
  try { sessionStorage.setItem(KEY, qs); } catch {}
}

/** Captura e mescla os parâmetros de rastreamento da URL atual no localStorage. */
export function captureUtms(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = new URLSearchParams(readStore());
    const current = new URLSearchParams(window.location.search);
    let changed = false;
    current.forEach((value, key) => {
      if (!value) return;
      if (TRACK_KEYS.includes(key) || key.startsWith("utm_")) {
        stored.set(key, value);
        changed = true;
      }
    });
    const qs = stored.toString();
    if (changed) writeStore(qs);
    else if (qs) memoryUtm = qs;
    return qs;
  } catch {
    return memoryUtm;
  }
}

/** Query string persistida (sem "?"). */
export function getUtmQuery(): string {
  if (typeof window === "undefined") return "";
  try {
    // Sempre reprocessa a URL atual — garante que UTMs novas entrem no funil.
    const merged = captureUtms();
    return merged || readStore() || window.location.search.replace(/^\?/, "");
  } catch {
    return memoryUtm;
  }
}

/** Caminho interno com as UTMs anexadas. */
export function withUtms(path: string): string {
  const qs = getUtmQuery();
  if (!qs) return path;
  return path + (path.includes("?") ? "&" : "?") + qs;
}

/** Parâmetros de rastreamento como objeto. */
export function getUtmParams(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    new URLSearchParams(getUtmQuery()).forEach((v, k) => {
      out[k] = v;
    });
  } catch {}
  return out;
}
