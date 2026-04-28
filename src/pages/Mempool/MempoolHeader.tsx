import type { ReactNode } from 'react';

type MempoolHeaderProps = {
  block: number;
  gas: number;
  baseFee: number;
  pending: number;
  gasTrend: string;
};

type StatProps = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: string;
};

function Stat({ label, value, sub, accent }: StatProps) {
  return (
    <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #1A1F25', minWidth: 0 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: '0.02em',
          color: accent || '#FFFFFF',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#949594' }}>{sub}</div>
      )}
    </div>
  );
}

export function MempoolHeader({ block, gas, baseFee, pending, gasTrend }: MempoolHeaderProps) {
  return (
    <div style={{ display: 'flex', background: '#363D45', borderBottom: '1px solid #1A1F25' }}>
      <Stat label="Block" value={block.toLocaleString()} sub="mainnet · 12s ago" />
      <Stat label="Base fee" value={`${baseFee} gwei`} sub={gasTrend} />
      <Stat label="Median gas" value={`${gas} gwei`} sub="fast · 1 block" />
      <Stat label="Pending" value={pending.toLocaleString()} sub="in mempool" />
      <Stat label="Node" value="RETH" sub="reth.local · synced" accent="#7FB05A" />
    </div>
  );
}
