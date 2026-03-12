import parseUrl from "parse-url";

// https://core.telegram.org/api/links
const RESERVED_USERNAMES = new Set([
  "www",
  "addemoji",
  "addlist",
  "addstickers",
  "addtheme",
  "auth",
  "boost",
  "confirmphone",
  "contact",
  "giftcode",
  "invoice",
  "joinchat",
  "login",
  "m",
  "nft",
  "proxy",
  "setlanguage",
  "share",
  "socks",
  "web",
  "a",
  "k",
  "z",
]);

// https://core.telegram.org/api/links
const TELEGRAM_DOMAINS = new Set(["t.me", "telegram.me", "telegram.dog"]);

// https://telegram.org/faq#q-what-can-i-use-as-my-username
// https://gist.github.com/Laiteux/bc6895e8e3dcfe7ffaa91cf2c1077031
//
// (?=.{4,32}$) --> Must contain between 4 and 32 characters long.
// (?!.*__)     --> Must not contain two or more consecutive underscores.
// ^[a-zA-Z]    --> Must start with a letter.
// [\w]         --> Middle characters must be letters, digits, or underscores.
// [a-zA-Z\d]$  --> Must end with a letter or digit.
const RE_VALID_USERNAME = /^(?=.{4,32}$)(?!.*__)[a-zA-Z][\w]*[a-zA-Z\d]$/;

/**
 * Retrieve username from url.
 *
 * Returns the username if it is a valid Telegram username.
 * Otherwise, returns nothing.
 */
function getUsernameFromUrl(url: string): string | undefined {
  const parsedUrl = parseUrl(url, true);
  const domainParts = parsedUrl.resource.split(".");

  if (domainParts.length > 3) {
    return;
  }
  // Should not have query.
  if (Object.keys(parsedUrl.query).length > 0) {
    return;
  }

  let domain: string;
  let maybeUsername: string;

  // https://username.t.me
  if (domainParts.length === 3) {
    maybeUsername = domainParts[0];
    domain = domainParts.slice(-2).join(".");
    // Only "t.me" is a valid domain.
    // For example, "https://quadratz.telegram.me" and "https://quadratz.telegram.dog"
    // Are not valid.
    if (domain !== "t.me") {
      return;
    }
    // Should not have any path.
    // For example, "https://quadratz.telegram.me/sendMessage" is not valid.
    if (parsedUrl.pathname !== "/") {
      return;
    }
  }
  // https://t.me/username
  else {
    // Remove the leading slash. pathname always starts with a "/".
    maybeUsername = parsedUrl.pathname.slice(1);
    domain = domainParts.join(".");
  }

  // Check whether this is a valid Telegram username.
  if (
    !RESERVED_USERNAMES.has(maybeUsername) &&
    TELEGRAM_DOMAINS.has(domain) &&
    RE_VALID_USERNAME.test(maybeUsername)
  ) {
    return maybeUsername;
  }

  // It is not a valid username, return nothing.
}

export { getUsernameFromUrl };
