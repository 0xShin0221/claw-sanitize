import Sanitizer from "@/components/Sanitizer";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-[#E8404A]">Claw</span>Sanitize
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Mask API keys and secrets from your openclaw.json — safe to share
          publicly
        </p>
        <p className="mt-1 text-sm text-gray-600">
          100% client-side. Your config never leaves your browser.
        </p>
      </div>

      {/* Sanitizer */}
      <Sanitizer />

      {/* About */}
      <section className="mx-auto mt-12 max-w-2xl rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-200">
          Why sanitize?
        </h2>
        <p className="text-sm leading-relaxed text-gray-400">
          Sharing your openclaw.json on Reddit, GitHub, or Discord is a great
          way to show off your setup — but it often contains API keys, tokens,
          and secrets that could be exploited. ClawSanitize automatically
          detects and masks sensitive values (Anthropic, OpenAI, GitHub,
          Google, Slack, Telegram tokens, phone numbers in peer IDs, and more)
          while preserving your full config structure. Paste, sanitize, share
          — it&apos;s that simple.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        <p>
          Built by{" "}
          <a
            href="https://x.com/0xShin0221"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E8404A] hover:underline"
          >
            Shin0221
          </a>{" "}
          with AI family
        </p>
        <p className="mt-1">
          Share your setup on{" "}
          <span className="text-gray-400">ClawSetups.dev</span>{" "}
          <span className="text-gray-600">(coming soon)</span>
        </p>
        <p className="mt-1">
          <a
            href="https://github.com/digitaldatech/claw-sanitize"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#E8404A] hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
