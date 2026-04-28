const SCHEMA = [
  { name: 'uniswap_v3', tables: [
    { name: 'swaps',       cols: 12, columns: [['block_number','int'],['pool','address'],['sender','address'],['amount0','numeric'],['amount1','numeric'],['amount_usd','numeric']] },
    { name: 'mints',       cols: 9 },
    { name: 'burns',       cols: 9 },
    { name: 'pools',       cols: 14, columns: [['pool_address','address'],['fee_tier','int'],['token0','address'],['token1','address'],['liquidity','numeric'],['tick','int']] },
    { name: 'positions',   cols: 11 },
  ]},
  { name: 'curve', tables: [
    { name: 'exchanges', cols: 8 },
    { name: 'liquidity', cols: 7 },
  ]},
  { name: 'aave_v3', tables: [
    { name: 'borrows', cols: 10 },
    { name: 'supplies', cols: 10 },
    { name: 'liquidations', cols: 12 },
  ]},
  { name: 'balancer_v2', tables: [
    { name: 'swaps', cols: 11 },
    { name: 'pools', cols: 13 },
  ]},
];

function SchemaTree({ selected = 'uniswap_v3.pools', onSelect = () => {} }) {
  const [expanded, setExpanded] = React.useState({ 'uniswap_v3': true });
  const [hover, setHover] = React.useState(null);

  const toggle = (k) => setExpanded(e => ({ ...e, [k]: !e[k] }));

  return (
    <div style={{ width: 280, background: 'var(--charcoal)', borderRight: '1px solid #1A1F25',
                  display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #1A1F25',
                    display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                       letterSpacing: '0.18em', textTransform: 'uppercase', color: '#949594' }}>Schema</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#949594', whiteSpace: 'nowrap' }}>4 schemas</span>
      </div>
      {/* Search */}
      <div style={{ padding: 10, borderBottom: '1px solid #1A1F25' }}>
        <input className="input" placeholder="Search schema…" style={{ width: '100%' }} />
      </div>
      {/* Tree */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {SCHEMA.map(schema => {
          const open = expanded[schema.name];
          return (
            <div key={schema.name}>
              <div onClick={() => toggle(schema.name)}
                   onMouseEnter={() => setHover(schema.name)} onMouseLeave={() => setHover(null)}
                   style={{ height: 28, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8,
                            borderLeft: '3px solid transparent', cursor: 'pointer',
                            background: hover === schema.name ? 'rgba(163,38,56,0.18)' : 'transparent',
                            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E4E5E6' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#949594' }}>{open ? '▾' : '▸'}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{schema.name}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11,
                               color: '#949594', fontWeight: 400, letterSpacing: 0, textTransform: 'none', whiteSpace: 'nowrap' }}>{schema.tables.length}</span>
              </div>
              {open && schema.tables.map(t => {
                const key = `${schema.name}.${t.name}`;
                const isSelected = selected === key;
                const isHover = hover === key;
                return (
                  <React.Fragment key={key}>
                    <div onClick={() => onSelect(key)}
                         onMouseEnter={() => setHover(key)} onMouseLeave={() => setHover(null)}
                         style={{ height: 28, padding: '0 14px 0 24px', display: 'flex', alignItems: 'center', gap: 8,
                                  borderLeft: isSelected ? '3px solid #EBC73B' : '3px solid transparent',
                                  background: (isSelected || isHover) ? 'rgba(163,38,56,0.18)' : 'transparent',
                                  cursor: 'pointer',
                                  fontFamily: 'var(--font-body)', fontSize: 13,
                                  fontWeight: isSelected ? 600 : 400, color: '#E4E5E6' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: isSelected ? '#EBC73B' : '#949594' }}>
                        {isSelected && t.columns ? '▾' : '▸'}
                      </span>
                      <span style={{ whiteSpace: 'nowrap' }}>{t.name}</span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#949594', whiteSpace: 'nowrap' }}>{t.cols} cols</span>
                    </div>
                    {isSelected && t.columns && t.columns.map(([c, type]) => (
                      <div key={c} style={{ height: 24, padding: '0 14px 0 50px', display: 'flex', alignItems: 'center',
                                            gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#E4E5E6' }}>
                        <span>{c}</span>
                        <span style={{ marginLeft: 'auto', color: '#949594' }}>{type}</span>
                      </div>
                    ))}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid #1A1F25',
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: '#949594', whiteSpace: 'nowrap' }}>
        Local RETH · synced
      </div>
    </div>
  );
}

window.SchemaTree = SchemaTree;
