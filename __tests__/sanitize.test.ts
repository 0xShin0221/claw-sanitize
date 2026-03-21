import { sanitize } from "../lib/sanitize";

describe("sanitize", () => {
  it("masks fields with sensitive key names", () => {
    const input = JSON.stringify({
      apiKey: "sk-ant-abc123secret",
      username: "alice",
    });
    const { output, secretsFound } = sanitize(input);
    expect((output as any).apiKey).toBe("sk-a***REDACTED***");
    expect((output as any).username).toBe("alice");
    expect(secretsFound).toBe(1);
  });

  it("masks values with known secret prefixes regardless of key name", () => {
    const input = JSON.stringify({
      myField: "ghp_abc123456789",
      other: "normal value",
    });
    const { output, secretsFound } = sanitize(input);
    expect((output as any).myField).toBe("ghp_***REDACTED***");
    expect((output as any).other).toBe("normal value");
    expect(secretsFound).toBe(1);
  });

  it("masks phone numbers in peerIds", () => {
    const input = JSON.stringify({
      peerId: "+12345678901",
      name: "WhatsApp",
    });
    const { output, secretsFound } = sanitize(input);
    expect((output as any).peerId).toBe("+123***REDACTED***");
    expect(secretsFound).toBe(1);
  });

  it("handles nested objects and arrays", () => {
    const input = JSON.stringify({
      providers: [
        { name: "Anthropic", api_key: "sk-ant-deep-nested-key" },
        { name: "OpenAI", token: "sk-openai-token-here" },
      ],
    });
    const { output, secretsFound } = sanitize(input);
    const providers = (output as any).providers;
    expect(providers[0].api_key).toBe("sk-a***REDACTED***");
    expect(providers[0].name).toBe("Anthropic");
    expect(providers[1].token).toBe("sk-o***REDACTED***");
    expect(secretsFound).toBe(2);
  });

  it("preserves JSON structure with no secrets", () => {
    const input = JSON.stringify({
      model: "claude-3",
      temperature: 0.7,
      enabled: true,
    });
    const { output, secretsFound } = sanitize(input);
    expect(output).toEqual({ model: "claude-3", temperature: 0.7, enabled: true });
    expect(secretsFound).toBe(0);
  });

  it("masks short secret values fully", () => {
    const input = JSON.stringify({ password: "abc" });
    const { output, secretsFound } = sanitize(input);
    expect((output as any).password).toBe("***REDACTED***");
    expect(secretsFound).toBe(1);
  });

  it("masks Bearer tokens", () => {
    const input = JSON.stringify({ header: "Bearer eyJhbGciOiJIUzI1NiJ9" });
    const { output, secretsFound } = sanitize(input);
    expect((output as any).header).toBe("Bear***REDACTED***");
    expect(secretsFound).toBe(1);
  });
});
