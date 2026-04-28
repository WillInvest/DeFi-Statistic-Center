type MempoolHeaderProps = {
  block: number;
  gas: number;
  baseFee: number;
  pending: number;
  gasTrend: string;
};

type StatProps = {
  label: string;
  value: string;
  sub: string;
  green?: boolean;
};

function Stat({ label, value, sub, green }: StatProps) {
  return (
    <div className="mempool-stat">
      <div className="mempool-stat__label">{label}</div>
      <div className={`mempool-stat__value${green ? ' mempool-stat__value--green' : ''}`}>
        {value}
      </div>
      <div className="mempool-stat__sub">{sub}</div>
    </div>
  );
}

export function MempoolHeader({ block, gas, baseFee, pending, gasTrend }: MempoolHeaderProps) {
  return (
    <div className="mempool-header">
      <Stat label="Block" value={block.toLocaleString()} sub="mainnet · 12s ago" />
      <Stat label="Base fee" value={`${baseFee} gwei`} sub={gasTrend} />
      <Stat label="Median gas" value={`${gas} gwei`} sub="fast · 1 block" />
      <Stat label="Pending" value={pending.toLocaleString()} sub="in mempool" />
      <Stat label="Node" value="RETH" sub="reth.local · synced" green />
    </div>
  );
}
