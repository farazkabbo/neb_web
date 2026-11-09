"use client";

import { useState } from "react";

/**
 * "Email me the link" (docs/LAUNCH.md): for downloading on another computer, or hearing when
 * the Mac version is ready. Optional, and never in the way of the download.
 */
export function EmailMeTheLink({ source, label }: { source: "download" | "download_mac"; label: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "sending" | "sent" | "error"; text?: string }>({
    kind: "idle",
  });

  return (
    <form
      className="dl-email"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        setState({ kind: "sending" });
        const company = (event.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value;
        const response = await fetch("/api/download-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source, company }),
        }).catch(() => null);
        const body = (await response?.json().catch(() => null)) as { error?: string } | null;
        setState(
          response?.ok
            ? { kind: "sent", text: "Sent. Check your inbox." }
            : { kind: "error", text: body?.error ?? "That didn't go through. Try again?" },
        );
      }}
    >
      <label htmlFor="dl-email">{label}</label>
      <div className="row">
        <input
          id="dl-email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* A field people never see; bots fill it in. */}
        <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
        <button className="btn" type="submit" disabled={state.kind === "sending" || !email}>
          {state.kind === "sending" ? "Sending…" : "Email me"}
        </button>
      </div>
      {state.text && (
        <p role="status" className={state.kind === "error" ? "err-line" : "legal-meta"}>
          {state.text}
        </p>
      )}
    </form>
  );
}
