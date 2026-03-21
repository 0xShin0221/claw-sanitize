const SENSITIVE_KEY_PATTERN =
  /key|token|secret|password|auth|apiKey|api_key|bearer|credential/i;

const SECRET_PREFIX_PATTERNS = [
  /^sk-ant-/,       // Anthropic
  /^sk-/,           // OpenAI
  /^Bearer\s+/,     // Bearer tokens
  /^ghp_/,          // GitHub personal tokens
  /^gho_/,          // GitHub OAuth tokens
  /^ghs_/,          // GitHub server tokens
  /^github_pat_/,   // GitHub fine-grained PATs
  /^xoxb-/,         // Slack bot tokens
  /^xoxp-/,         // Slack user tokens
  /^bot\d+:/,       // Telegram bot tokens
  /^AIzaSy/,        // Google API keys
  /^ya29\./,        // Google OAuth tokens
];

const PHONE_PEER_ID_PATTERN = /^\+\d{7,}/;

function maskValue(value: string): string {
  if (value.length <= 4) return "***REDACTED***";
  return value.slice(0, 4) + "***REDACTED***";
}

function isSensitiveValue(value: string): boolean {
  return SECRET_PREFIX_PATTERNS.some((p) => p.test(value));
}

function isPhonePeerId(key: string, value: string): boolean {
  return /peerId/i.test(key) && PHONE_PEER_ID_PATTERN.test(value);
}

export interface SanitizeResult {
  output: unknown;
  secretsFound: number;
}

function walkAndSanitize(
  obj: unknown,
  parentKey: string,
  counter: { count: number }
): unknown {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item, i) => walkAndSanitize(item, parentKey, counter));
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (typeof value === "string") {
        if (
          SENSITIVE_KEY_PATTERN.test(key) ||
          isSensitiveValue(value) ||
          isPhonePeerId(key, value)
        ) {
          result[key] = maskValue(value);
          counter.count++;
        } else {
          result[key] = value;
        }
      } else {
        result[key] = walkAndSanitize(value, key, counter);
      }
    }
    return result;
  }

  return obj;
}

export function sanitize(input: string): SanitizeResult {
  const parsed = JSON.parse(input);
  const counter = { count: 0 };
  const output = walkAndSanitize(parsed, "", counter);
  return { output, secretsFound: counter.count };
}
