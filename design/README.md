# DSC — DeFi Statistics Center · Design System

Internal research dashboard at **Stevens Institute of Technology** for querying
on-chain DeFi data (Uniswap v3, Curve, Balancer, Aave, …) via SQL editor,
visual query builder, and live Ethereum mempool view from a local RETH node.

Tone: **Bloomberg terminal × academic journal**, not a generic crypto dashboard.
Stevens-branded — maroon, gold, charcoal — dark-only, dense, hard-edged.

> *Per Aspera Ad Astra* — the institutional motto. Used sparingly, in footers
> and section markers; never as marketing flourish.

---

## Sources

This system was built from a written brief only — no codebase, Figma, or screenshots
were attached. Caveats:

- **Stevens logo**: official SVG is faculty-login-only and was not provided.
  We use a text wordmark **"DeFi Stats Center"** in Saira Extra Condensed
  until the official mark is supplied. → see `assets/wordmark.svg`.
- **Reference aesthetics** named in the brief (not assets): Dune Analytics
  three-pane layout, mempool.space grid, Blocknative tx-list density.
  No code from any of these is used or copied.
- **Fonts**: Saira Extra Condensed and Bitter are pulled from Google Fonts
  via `colors_and_type.css`. `JetBrains Mono` is used for the SQL editor;
  flag this if a different mono is preferred.

---

## Index

| File / folder              | What it is                                                     |
| -------------------------- | -------------------------------------------------------------- |
| `colors_and_type.css`      | All color, type, spacing, button, table, badge tokens + base   |
| `assets/`                  | Wordmark SVG, favicon, any brand marks                          |
| `preview/`                 | Design-system cards (colors, type, components, spacing)        |
| `ui_kits/query_workbench/` | 3-pane SQL / Builder / Chat workbench (primary product surface) |
| `ui_kits/mempool/`         | Live mempool view (second screen)                              |
| `SKILL.md`                 | Cross-compatible Claude Skill manifest                         |

---

## Content fundamentals

**Tone.** Academic, terse, instrument-like. We write like a research lab
publishing methods, not like a startup pitching a product. No exclamation
marks. No marketing adjectives ("powerful", "seamless", "blazing-fast").
No emoji.

**Voice.** Third-person and impersonal in copy ("Query the mempool",
"Returns 1,284 rows"). Second-person only in tooltips when giving a
direct instruction ("Press ⌘↵ to run"). Never first-person.

**Casing.**
- **Saira Extra Condensed is always uppercase** — display headings, section
  labels, tab labels, button labels, table column headers, badges.
- **Bitter is sentence case** — body copy, table cell values, descriptions,
  schema field names, helper text.
- Acronyms stay acronyms: `SQL`, `RPC`, `RETH`, `EVM`, `TVL`, `APY`, `LP`.
- Numbers: tabular figures, 4-digit grouping with commas (`1,284,902`),
  ETH amounts to 4 decimals (`0.0421 ETH`), gas in gwei integer (`28 gwei`),
  hashes truncated middle (`0x4a2c…f81e`).

**Copy examples.**
- Section header (Saira, upper): `SCHEMA` · `RESULTS` · `LIVE MEMPOOL`
- Button (Saira, upper): `RUN` · `EXPLAIN` · `EXPORT CSV` · `SAVE QUERY`
- Empty state (Bitter, sentence): `No results. Run a query to begin.`
- Error (Bitter, sentence, maroon): `Syntax error at line 4, column 12 — unexpected token.`
- Tooltip (Bitter, sentence): `Press ⌘↵ to run, ⌘S to save.`
- Badge (Saira, upper, very short): `LIVE` · `MAINNET` · `DRAFT` · `PENDING`

**Anti-patterns.** Don't write "🚀 Lightning-fast queries!" Write
`Query latency: 142 ms.` Don't write "We've got you covered." Write
nothing — let the data speak.

---

## Visual foundations

**Palette.** Five hues, used disciplined. Maroon (`#A32638`) is primary
identity and *also* the destructive / negative-data color — context
disambiguates. **Brand chrome (top strip, wordmark, nav) is maroon +
white only — no gold.** Gold (`#EBC73B`) is reserved as a *functional*
accent inside the app: the RUN button, the 3 px selected-schema-row
left border, the PENDING badge, and one chart series. Charcoal
(`#363D45`) and editor-bg (`#1E2329`) carry all chrome. Off-white
(`#E4E5E6`) is the only light surface, used in results tables. **No
gradients. No dark/light toggle — dark-only.**

**Type.** Two families. *Saira Extra Condensed* (700) for everything
uppercase: headings, buttons, tabs, table headers, badges, eyebrows.
*Bitter* (400/500) for everything readable: body copy, cell values,
descriptions. *JetBrains Mono* for SQL and hashes only. Bitter's
slab-serif gives the "academic journal" register the brief asks for.

**Backgrounds.** Solid color blocks. **No images, no patterns, no
textures, no gradients.** A page is a tiling of charcoal / editor-bg /
off-white rectangles separated by 1 px hairlines. Full-bleed imagery is
explicitly out of scope.

**Animation.** Effectively none. Hover state changes are instantaneous
(80 ms linear at most, only on color). No fades, no slides, no
bounces, no spring physics. The interface feels like a financial
terminal — values change, chrome does not.

**Hover states.**
- Schema rows: background fills with `--maroon-18` (translucent maroon).
- Table rows: background `#F2F2F3`.
- Buttons: darken by ~10% via explicit hex (`#8E1F31` for primary,
  `#D8B62E` for RUN). Never use `opacity` for hover.
- Links: underline appears, color stays.

**Press / active.** Buttons darken further (`#7A1A2A`, `#C2A323`). No
scale transforms, no shadow.

**Selected states.** Selected schema row: 3 px **gold** left border, no
fill change. Selected tab: 2 px gold underline + Saira weight 700.
Selected table row: 1 px maroon left border + tinted bg.

**Borders.** 1 px (`#1A1F25` on dark, `#BFC1C3` on light) for hairlines.
2 px maroon under table headers. 3 px gold for selected schema row left.
4 px gold under brand strip. **No rounded corners — `border-radius: 0`
everywhere.**

**Shadows.** None. Zero. Cards do not float; they sit on the grid.
Elevation is communicated by border-color contrast, not depth.

**Transparency / blur.** Used only for hover tints (`--maroon-18`,
`--gold-20`). No backdrop-filter, no glassmorphism.

**Layout rules.**
- Top brand strip: fixed 56 px, full-width maroon, no gold accent (white nav rule).
- Three-pane workbench: left schema 280 px fixed, middle editor flex,
  right results flex with 60/40 split between editor and results.
- Density: 28 px row height in tables and schema (Bloomberg-tight).
- Page never wider than the viewport — full-bleed dashboards.

**Cards.** Rectangles with a 1 px border, no shadow, no radius. A "card"
is a `.panel` (charcoal) or `.panel-light` (off-white). Section title
in Saira upper sits *above* the panel, not inside.

**Imagery vibe.** N/A — this product has effectively no imagery. The
charts ARE the imagery. Chart series order is fixed: maroon → charcoal
→ gold → gray, then muted variants.

---

## Iconography

**Approach.** Minimal. The aesthetic is text-and-rule, not icon-led. We
use icons only for:
1. Schema-tree row glyphs (table, column, schema, view).
2. Chart-type switcher (bar, line, area, scatter, candlestick, table).
3. Mempool tx-type indicators (swap, add liquidity, remove, transfer,
   contract creation).
4. Toolbar actions (run, save, export, copy).

**Source.** **Lucide Icons** via CDN (`https://unpkg.com/lucide@latest`),
chosen for its 1.5 px stroke and geometric squareness — matches the
hard-edge aesthetic. **This is a substitution** — Stevens has no in-house
icon set. Flag if the user prefers Heroicons (also viable) or a custom
set.

**Rendering rules.**
- Stroke width: `1.5`.
- Color: `currentColor` — icons inherit from text.
- Size: 14 px in dense rows (tables, schema), 16 px in toolbars, 18 px
  in tab labels. Never larger than 18 px outside hero contexts.
- No fills. No two-tone. No animated icons.

**Emoji.** Never. Not in copy, not in UI, not in schema names, not in
empty states.

**Unicode chars used as glyphs.** Sparingly — `↵` for return-key in
shortcuts, `↑↓` for sort indicators, `·` for separator dots, `—` for
em-dash. No `●` or `▲▼` for status (use color + Saira label instead).

**Logo.** **Missing.** Use the text wordmark (`assets/wordmark.svg`) until
the user supplies the official Stevens / DSC SVG.

---

## Quick start

```html
<link rel="stylesheet" href="colors_and_type.css">
<!-- Lucide icons (substitution — see ICONOGRAPHY) -->
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```

Use semantic classes: `.brand-strip`, `.panel`, `.panel-light`, `.btn`,
`.btn-run`, `.btn-primary`, `.tbl`, `.badge`, `.eyebrow`, `.wordmark`.
