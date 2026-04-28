# Landing page product demo

The **#demo** block on the home page can show either an **interactive click-through** (Arcade, Supademo, etc.) or a **self-hosted MP4**.

## Option A — Arcade or Supademo (recommended for SaaS-style tours)

Both products record flows on your app and give you an **embed URL** (iframe `src`) from **Share → Website / Embed**.

1. Build your tour in [Arcade](https://arcade.software) or [Supademo](https://supademo.com).
2. Copy the embed **iframe URL** (the `src="…"` value only — not the whole HTML tag).
3. At build time, set:

   ```bash
   VITE_AGENTIC_DEMO_EMBED_URL="https://demo.arcade.software/…"
   ```

   Example for local dev, create `web/.env.local` (gitignored by default) with that line.

4. Rebuild / deploy the web app. The landing page renders a responsive **16:9 iframe** in the demo section.

**Content-Security-Policy:** If your hosting adds a strict CSP, allow the vendor’s iframe origins (Arcade documents `https://app.arcade.software` and `https://demo.arcade.software`; Supademo uses their embed host — check their docs when you go live).

## Option B — Self-hosted video (no third party)

1. Export your recording as **MP4** (H.264 + AAC is widely supported).
2. Place it at **`web/public/demo-agentic-query.mp4`** (served as `/demo-agentic-query.mp4`).
3. Optional: **`web/public/demo-agentic-query-poster.jpg`** for the thumbnail before play.

Leave **`VITE_AGENTIC_DEMO_EMBED_URL` unset** so the page uses `<video controls playsInline>`. Until the MP4 exists, visitors see a placeholder with these instructions.

## Priority

If **`VITE_AGENTIC_DEMO_EMBED_URL`** is non-empty, the **iframe** is shown and the MP4 slot is skipped.
