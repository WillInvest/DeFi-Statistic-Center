# DSC Query — UI Kit

Three-pane query UI: schema tree (left) · query editor (middle, with SQL / Builder / Chat tabs) · results table + chart (right). Top brand strip + footer status bar.

## Files
- `index.html` — interactive demo, full window
- `BrandStrip.jsx` — top maroon bar with wordmark + nav + live status
- `SchemaTree.jsx` — schema tree (left pane)
- `QueryPane.jsx` — middle pane with SQL / Builder / Chat tab switcher
- `ResultsPane.jsx` — right pane: results table + chart toggle
- `StatusBar.jsx` — footer status bar
- `Buttons.jsx`, `Badges.jsx` — primitives

## Constraints
- Stevens dark-only theme. `border-radius: 0` everywhere.
- Saira Extra Condensed (uppercase) for chrome; Bitter for body; JetBrains Mono for SQL/data.
- Maroon keywords on the SQL editor are tinted `#E25A6E` for AA contrast on `#1E2329`.
- 28 px row height in tables and schema (Bloomberg density).
