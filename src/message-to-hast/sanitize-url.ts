import { sanitizeUri } from "micromark-util-sanitize-uri";

const RE_SAFE_PROTOCOL = /^(ftps?|https?|ircs?|mailto|sms|tel|tg|tonsite|xmpp)$/i;

/** Sanitize URL. */
function sanitizeUrl(url: string): string {
  return sanitizeUri(url, RE_SAFE_PROTOCOL);
}

export { sanitizeUrl };
