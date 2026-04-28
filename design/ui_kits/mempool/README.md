# DSC Mempool — UI Kit

Live Ethereum mempool view from the local RETH node. Top brand strip + 3-section layout: gas/block summary header, pending-tx grid (mempool.space-style fee buckets), and live tx-list (Blocknative-style dense table).

## Files
- `index.html` — interactive demo (auto-ticking sample data)
- `MempoolHeader.jsx` — gas + block summary cards
- `FeeGrid.jsx` — pending-tx fee bucket grid
- `TxList.jsx` — live tx-list table

Shares `BrandStrip.jsx` and `StatusBar.jsx` aesthetic from the workbench kit; both are inlined here for portability.
