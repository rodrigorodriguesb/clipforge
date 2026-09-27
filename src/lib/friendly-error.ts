/**
 * Classifies low-level errors into actionable user-facing messages (pure function, unit-testable, locale-aware).
 * In frontend catch blocks, call setError(friendlyError(e, locale)) directly — never expose raw strings
 * like "Failed to fetch" or "401" to the user.
 */
import type { Locale } from "@/lib/i18n/config";

export type ErrorKind = "network" | "auth" | "ratelimit" | "server" | "unknown";

/** Classification only (makes unit-testing the classification logic easier, decoupled from copy) */
export function classifyError(e: unknown): ErrorKind {
  const raw = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  if (/failed to fetch|networkerror|econnrefused|fetch failed|network request failed|aborted|timeout|etimedout/.test(raw)) return "network";
  if (/\b401\b|\b403\b|unauthorized|forbidden|invalid.*key|api[ _-]?key|缺少.*key|key 无效/.test(raw)) return "auth";
  if (/\b429\b|rate.?limit|too many requests|限流|频繁/.test(raw)) return "ratelimit";
  if (/\b5\d\d\b|server error|internal error|bad gateway|service unavailable/.test(raw)) return "server";
  return "unknown";
}

const MESSAGES: Record<ErrorKind, Record<Locale, string>> = {
  network: { pt: "Erro de rede — verifique sua conexão e tente de novo.", zh: "网络异常——请检查网络连接后重试。", en: "Network error — check your connection and try again." },
  auth: { pt: "Chave de API inválida ou ausente — configure em Configurações.", zh: "API Key 无效或缺失——请到「设置」配置对应平台的 Key。", en: "API key invalid or missing — open Settings to configure it." },
  ratelimit: { pt: "Provedor limitou as requisições — aguarde um momento e tente de novo.", zh: "平台限流了——请稍等片刻再重试。", en: "Rate-limited by the provider — wait a moment and retry." },
  server: { pt: "Erro no serviço do provedor — tente novamente mais tarde.", zh: "平台服务异常——请稍后再试。", en: "Provider service error — please try again later." },
  unknown: { pt: "", zh: "", en: "" },
};

export function friendlyError(e: unknown, locale: Locale = "pt"): string {
  const kind = classifyError(e);
  if (kind !== "unknown") return MESSAGES[kind][locale];
  // Unknown error: preserve the raw message (still better than nothing); fall back to a generic message if empty
  const raw = e instanceof Error ? e.message : String(e ?? "");
  return raw || GENERIC[locale];
}

const GENERIC: Record<Locale, string> = {
  pt: "Algo deu errado — tente novamente.",
  zh: "出错了，请重试。",
  en: "Something went wrong — please retry.",
};
