function HighlightedSQL({ code }) {
  // Tokenize naively: keywords, strings, comments, numbers, identifiers
  const KEYWORDS = ['SELECT','FROM','WHERE','AND','OR','GROUP BY','ORDER BY','LIMIT','AS','NOT','IN','LIKE','SUM','COUNT','AVG','MIN','MAX','DESC','ASC','INTERVAL','NOW','BETWEEN','JOIN','LEFT','RIGHT','INNER','ON','CASE','WHEN','THEN','ELSE','END','HAVING','WITH','DISTINCT'];
  const lines = code.split('\n');
  const renderLine = (ln, i) => {
    const out = [];
    let rest = ln;
    // Comment first
    const ci = rest.indexOf('--');
    let comment = '';
    if (ci !== -1) { comment = rest.slice(ci); rest = rest.slice(0, ci); }
    // Tokenize on strings + words + symbols
    const re = /('[^']*')|(\b[A-Z_]+(?:\s+BY)?\b)|(\b\w+\b)|(\s+)|([^\w\s])/g;
    let m;
    while ((m = re.exec(rest)) !== null) {
      const [tok, str, kw, ident, ws, sym] = m;
      if (str) out.push(<span key={out.length} style={{ color: '#EBC73B' }}>{tok}</span>);
      else if (kw && KEYWORDS.includes(kw.toUpperCase())) out.push(<span key={out.length} style={{ color: '#E25A6E', fontWeight: 600 }}>{tok}</span>);
      else if (ident) out.push(<span key={out.length} style={{ color: '#E4E5E6' }}>{tok}</span>);
      else if (ws) out.push(tok);
      else out.push(<span key={out.length} style={{ color: '#C9CACB' }}>{tok}</span>);
    }
    if (comment) out.push(<span key={out.length+999} style={{ color: '#949594' }}>{comment}</span>);
    return <div key={i} style={{ minHeight: 21 }}>{out.length ? out : '\u00A0'}</div>;
  };
  return (
    <div style={{ display: 'flex', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '21px' }}>
      <div style={{ padding: '14px 10px', color: '#5C636C', textAlign: 'right', userSelect: 'none',
                    minWidth: 36, borderRight: '1px solid #1A1F25', flexShrink: 0 }}>
        {lines.map((_, i) => <div key={i} style={{ minHeight: 21 }}>{i + 1}</div>)}
      </div>
      <div style={{ padding: '14px 16px', flex: 1, overflowX: 'auto' }}>
        {lines.map(renderLine)}
      </div>
    </div>
  );
}

function BuilderView({ onGenerate }) {
  const [selSchema, setSelSchema] = React.useState('uniswap_v3');
  const [selTable, setSelTable] = React.useState('swaps');
  return (
    <div style={{ padding: 16, color: '#E4E5E6', fontFamily: 'var(--font-body)', fontSize: 13 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 12, columnGap: 14, alignItems: 'center' }}>
        <span className="eyebrow" style={{ color: '#949594' }}>Source</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="select" value={selSchema} onChange={e => setSelSchema(e.target.value)}>
            <option>uniswap_v3</option><option>curve</option><option>aave_v3</option><option>balancer_v2</option>
          </select>
          <span style={{ color: '#949594' }}>·</span>
          <select className="select" value={selTable} onChange={e => setSelTable(e.target.value)}>
            <option>swaps</option><option>pools</option><option>mints</option><option>burns</option>
          </select>
        </div>

        <span className="eyebrow" style={{ color: '#949594' }}>Select</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['block_number','SUM(amount_usd) as vol_usd'].map(c =>
            <span key={c} className="badge badge-gold" style={{ background: '#1E2329' }}>{c}</span>
          )}
          <button className="btn btn-ghost btn-sm">+ Add column</button>
        </div>

        <span className="eyebrow" style={{ color: '#949594' }}>Where</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input" defaultValue="pool" style={{ width: 110 }} />
          <select className="select" style={{ width: 60 }}><option>=</option><option>!=</option><option>&gt;</option><option>&lt;</option></select>
          <input className="input" defaultValue="0x88e6cFF…5640" style={{ width: 200, fontFamily: 'var(--font-mono)' }} />
          <button className="btn btn-ghost btn-sm">+ Filter</button>
        </div>

        <span className="eyebrow" style={{ color: '#949594' }}>Group by</span>
        <input className="input" defaultValue="block_number" style={{ width: 200 }} />

        <span className="eyebrow" style={{ color: '#949594' }}>Order by</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" defaultValue="block_number" style={{ width: 200 }} />
          <select className="select"><option>DESC</option><option>ASC</option></select>
        </div>
      </div>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #1A1F25' }}>
        <div className="eyebrow" style={{ color: '#949594', marginBottom: 8 }}>Generated SQL · live</div>
        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#E4E5E6', lineHeight: 1.6 }}>
<span style={{ color: '#E25A6E', fontWeight: 600 }}>SELECT</span> block_number, <span style={{ color: '#E25A6E', fontWeight: 600 }}>SUM</span>(amount_usd) <span style={{ color: '#E25A6E', fontWeight: 600 }}>AS</span> vol_usd{'\n'}
<span style={{ color: '#E25A6E', fontWeight: 600 }}>FROM</span>   {selSchema}.{selTable}{'\n'}
<span style={{ color: '#E25A6E', fontWeight: 600 }}>WHERE</span>  pool = <span style={{ color: '#EBC73B' }}>{`'0x88e6cFF…5640'`}</span>{'\n'}
<span style={{ color: '#E25A6E', fontWeight: 600 }}>GROUP BY</span> block_number <span style={{ color: '#E25A6E', fontWeight: 600 }}>ORDER BY</span> block_number <span style={{ color: '#E25A6E', fontWeight: 600 }}>DESC</span>;
        </pre>
      </div>
    </div>
  );
}

function ChatView() {
  return (
    <div style={{ padding: 24, color: '#E4E5E6', fontFamily: 'var(--font-body)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
                    letterSpacing: '0.04em', textTransform: 'uppercase', color: '#949594' }}>Natural-Language Query</div>
      <div style={{ marginTop: 8, fontSize: 13, color: '#949594', fontStyle: 'italic' }}>Planned. Not yet implemented.</div>
      <div style={{ marginTop: 18, width: 420, border: '1px solid #444B54', background: '#1E2329', padding: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#5C636C' }}>
          e.g. &ldquo;largest USDC/WETH swaps in the last hour&rdquo;
        </div>
      </div>
      <span className="badge badge-gray" style={{ marginTop: 18 }}>SOON</span>
    </div>
  );
}

function QueryPane({ activeMode = 'SQL', onModeChange, onRun }) {
  const SAMPLE = `SELECT block_number, SUM(amount_usd) AS vol_usd
FROM   uniswap_v3.swaps
WHERE  pool = '0x88e6cFF…5640'  -- USDC/WETH 0.05%
  AND  block_timestamp > NOW() - INTERVAL '24 hours'
GROUP BY 1
ORDER BY 1 DESC
LIMIT 100;`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%',
                  background: '#1E2329', borderRight: '1px solid #1A1F25', minWidth: 0 }}>
      {/* Tab bar */}
      <div style={{ height: 36, background: '#1E2329', borderBottom: '1px solid #1A1F25',
                    display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {['SQL', 'Builder', 'Chat'].map(m => {
          const active = m === activeMode;
          return (
            <div key={m} onClick={() => onModeChange(m)}
                 style={{ padding: '0 18px', height: 36, display: 'flex', alignItems: 'center',
                          fontFamily: 'var(--font-display)', fontWeight: active ? 700 : 600,
                          fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase',
                          color: active ? '#fff' : '#949594',
                          borderBottom: active ? '2px solid #EBC73B' : '2px solid transparent',
                          cursor: 'pointer' }}>
              {m}
              {m === 'Chat' && <span className="badge badge-gray" style={{ marginLeft: 8 }}>SOON</span>}
            </div>
          );
        })}
        <div style={{ flex: 1, borderBottom: '1px solid #1A1F25' }} />
      </div>

      {/* Query header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #1A1F25',
                    display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                       letterSpacing: '0.18em', textTransform: 'uppercase', color: '#949594', whiteSpace: 'nowrap' }}>QUERY · untitled-1</span>
        <span className="badge badge-gray" style={{ whiteSpace: 'nowrap' }}>DRAFT</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#949594', whiteSpace: 'nowrap' }}>142 ms · 1,284 rows</span>
        <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }}>Save</button>
        <button className="btn btn-run btn-sm" onClick={onRun} style={{ whiteSpace: 'nowrap', minWidth: 90 }}>Run ⌘↵</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {activeMode === 'SQL' && <HighlightedSQL code={SAMPLE} />}
        {activeMode === 'Builder' && <BuilderView />}
        {activeMode === 'Chat' && <ChatView />}
      </div>
    </div>
  );
}

window.QueryPane = QueryPane;
