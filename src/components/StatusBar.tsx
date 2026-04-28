type StatusBarProps = {
  block?: string;
  latency?: string;
  node?: string;
  user?: string;
};

export function StatusBar({
  block = '19,482,901',
  latency = '142 ms',
  node = 'reth.local · synced',
  user = 'jsmith@stevens.edu',
}: StatusBarProps) {
  return (
    <div
      style={{
        height: 28,
        background: '#1E2329',
        borderTop: '1px solid #1A1F25',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 14,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: '#949594',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, background: '#5B8C3E' }} />
        {node}
      </span>
      <span style={{ flexShrink: 0 }}>·</span>
      <span style={{ flexShrink: 0 }}>block {block}</span>
      <span style={{ flexShrink: 0 }}>·</span>
      <span style={{ flexShrink: 0 }}>last query {latency}</span>
      <span style={{ marginLeft: 'auto', flexShrink: 0 }}>{user}</span>
      <span style={{ flexShrink: 0 }}>·</span>
      <span style={{ fontStyle: 'italic', color: '#5C636C', flexShrink: 0 }}>Per Aspera Ad Astra</span>
    </div>
  );
}
