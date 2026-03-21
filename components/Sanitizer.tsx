"use client";

import { useState } from "react";
import { sanitize } from "@/lib/sanitize";
import CopyButton from "./CopyButton";

const SAMPLE_CONFIG = JSON.stringify(
  {
    mcpServers: {
      anthropic: {
        command: "npx",
        args: ["-y", "@anthropic/mcp-server"],
        env: {
          ANTHROPIC_API_KEY: "sk-ant-api03-realKeyHere123456789abcdef",
        },
      },
      openai: {
        command: "npx",
        args: ["-y", "@openai/mcp-server"],
        env: {
          OPENAI_API_KEY: "sk-proj-abc123def456ghi789",
        },
      },
      github: {
        command: "npx",
        args: ["-y", "@github/mcp-server"],
        env: {
          GITHUB_TOKEN: "ghp_1234567890abcdef1234567890abcdef12345678",
        },
      },
      whatsapp: {
        command: "npx",
        args: ["-y", "@whatsapp/mcp-server"],
        peerId: "+14155551234",
      },
    },
    globalSettings: {
      model: "claude-sonnet-4-20250514",
      temperature: 0.7,
      bearerAuth: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    },
  },
  null,
  2
);

export default function Sanitizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [secretsFound, setSecretsFound] = useState(0);
  const [error, setError] = useState("");

  const handleSanitize = (text: string) => {
    setInput(text);
    setError("");
    setOutput("");
    setSecretsFound(0);

    if (!text.trim()) return;

    try {
      const result = sanitize(text);
      setOutput(JSON.stringify(result.output, null, 2));
      setSecretsFound(result.secretsFound);
    } catch {
      setError("Invalid JSON — please paste a valid openclaw.json");
    }
  };

  const loadSample = () => {
    handleSanitize(SAMPLE_CONFIG);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={loadSample}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#E8404A] hover:text-white"
        >
          Load Sample
        </button>
        <CopyButton text={output} />
        {secretsFound > 0 && (
          <span className="rounded-full bg-[#E8404A]/15 px-3 py-1 text-sm font-medium text-[#E8404A]">
            {secretsFound} secret{secretsFound !== 1 ? "s" : ""} detected and
            masked
          </span>
        )}
        {error && (
          <span className="text-sm text-red-400">{error}</span>
        )}
      </div>

      {/* Split panes */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Paste your config
          </label>
          <textarea
            value={input}
            onChange={(e) => handleSanitize(e.target.value)}
            placeholder='Paste your openclaw.json here...'
            className="h-[60vh] w-full resize-none rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-gray-200 placeholder-gray-600 focus:border-[#E8404A] focus:outline-none focus:ring-1 focus:ring-[#E8404A]"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Sanitized result
          </label>
          <pre className="h-[60vh] overflow-auto rounded-lg border border-gray-800 bg-gray-900 p-4 font-mono text-sm text-green-400">
            {output || "Sanitized output will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
