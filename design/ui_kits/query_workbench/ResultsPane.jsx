const SAMPLE_ROWS = [
  { block: 19482901, pool: 'USDC / WETH · 0.05%',  vol: 4182901.42, swaps: 1284, status: 'CONFIRMED' },
  { block: 19482900, pool: 'DAI / USDC · 0.01%',   vol: 1902418.10, swaps:  812, status: 'CONFIRMED' },
  { block: 19482899, pool: 'WBTC / WETH · 0.30%',  vol:  842019.88, swaps:  204, status: 'REVERTED'  },
  { block: 19482898, pool: 'USDT / WETH · 0.05%',  vol: 3201884.00, swaps:  982, status: 'CONFIRMED' },
  { block: 19482897, pool: 'USDC / DAI · 0.01%',   vol: 1184022.91, swaps:  541, status: 'CONFIRMED' },
  { block: 19482896, pool: 'WETH / LINK · 0.30%',  vol:  421094.55, swaps:  142, status: 'CONFIRMED' },
  { block: 19482895, pool: 'USDC / WETH · 0.05%',  vol: 5108821.74, swaps: 1503, status: 'CONFIRMED' },
  { block: 19482894, pool: 'WBTC / USDC · 0.05%',  vol: 1902482.10, swaps:  389, status: 'CONFIRMED' },
];

const fmtUsd = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtNum = n => n.toLocaleString('en-US');

function ResultsTable() {
  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      <table className="tbl" style={{ minWidth: 600 }}>
        <thead><tr>
          <th style={{ width: 110 }}>Block</th>
          <th>Pool</th>
          <th style={{ textAlign: 'right', width: 140 }}>Volume USD</th>
          <th style={{ textAlign: 'right', width: 80 }}>Swaps</th>
          <th style={{ width: 130 }}>Status</th>
        </tr></thead>
        <tbody>
          {SAMPLE_ROWS.map(r => (
            <tr key={r.block}>
              <td className="num">{fmtNum(r.block)}</td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.pool}</td>
              <td className="num" style={{ textAlign: 'right' }}>{fmtUsd(r.vol)}</td>
              <td className="num" style={{ textAlign: 'right' }}>{fmtNum(r.swaps)}</td>
              <td>
                <span className="badge" style={{ color: r.status === 'CONFIRMED' ? '#5B8C3E' : '#A32638' }}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultsChart() {
  // Simple bar chart, single series (maroon)
  const max = Math.max(...SAMPLE_ROWS.map(r => r.vol));
  return (
    <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                       letterSpacing: '0.1em', textTransform: 'uppercase', color: '#363D45' }}>Volume USD by Block</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#5B6168' }}>uniswap_v3.swaps</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                       fontFamily: 'var(--font-body)', fontSize: 12, color: '#363D45' }}>
          <span style={{ width: 10, height: 10, background: '#A32638' }} />vol_usd
        </span>
      </div>
      <div style={{ flex: 1, marginTop: 16, display: 'flex', alignItems: 'flex-end', gap: 12,
                    paddingBottom: 24, borderLeft: '1px solid #BFC1C3', borderBottom: '1px solid #BFC1C3',
                    paddingLeft: 12, position: 'relative' }}>
        {SAMPLE_ROWS.map(r => (
          <div key={r.block} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: '100%', height: `${(r.vol / max) * 100}%`, background: '#A32638' }} />
            <div style={{ position: 'absolute', bottom: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5B6168',
                          transform: 'translateY(0)' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, paddingLeft: 12 }}>
        {SAMPLE_ROWS.map(r => (
          <div key={r.block} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)',
                                       fontSize: 10, color: '#5B6168' }}>
            …{String(r.block).slice(-3)}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsPane({ view = 'Table', onViewChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%',
                  background: 'var(--off-white)', minWidth: 0 }}>
      <div style={{ height: 36, background: '#FFFFFE', borderBottom: '1px solid #BFC1C3',
                    display: 'flex', alignItems: 'center', padding: '0 14px', gap: 14, whiteSpace: 'nowrap', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                       letterSpacing: '0.18em', textTransform: 'uppercase', color: '#363D45', whiteSpace: 'nowrap' }}>RESULTS</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#5B6168', whiteSpace: 'nowrap' }}>1,284 rows · 142 ms</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 0, border: '1px solid #BFC1C3' }}>
          {['Table', 'Chart'].map(v => (
            <div key={v} onClick={() => onViewChange(v)}
                 style={{ padding: '0 12px', height: 24, display: 'flex', alignItems: 'center',
                          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          background: view === v ? '#363D45' : 'transparent',
                          color: view === v ? '#fff' : '#363D45', cursor: 'pointer' }}>
              {v}
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ color: '#363D45', borderColor: '#BFC1C3' }}>Export CSV</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {view === 'Table' ? <ResultsTable /> : <ResultsChart />}
      </div>
    </div>
  );
}

window.ResultsPane = ResultsPane;
