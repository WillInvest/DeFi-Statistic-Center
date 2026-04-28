export type FeeBucket = {
  range: string;
  count: number;
  eta: string;
};

type FeeGridProps = { buckets: FeeBucket[] };

const PALETTE = ['#A32638', '#5A3038', '#444B54', '#3A4048'];
const TAIL_COLOR = '#EBC73B';

export function FeeGrid({ buckets }: FeeGridProps) {
  return (
    <div className="fee-grid">
      <div className="fee-grid__header">
        <span className="fee-grid__title">Pending · by fee</span>
        <span className="fee-grid__count">
          {buckets.reduce((a, b) => a + b.count, 0).toLocaleString()} tx
        </span>
      </div>
      <div className="fee-grid__tiles">
        {buckets.map((b, i) => {
          const isLast = i === buckets.length - 1;
          const bg = isLast ? TAIL_COLOR : PALETTE[Math.min(i, PALETTE.length - 1)];
          const fg = isLast ? '#000' : '#fff';
          return (
            <div
              key={i}
              className="fee-tile"
              style={{ background: bg, color: fg }}
            >
              <div className="fee-tile__range">{b.range}</div>
              <div>
                <div className="fee-tile__count">{b.count.toLocaleString()}</div>
                <div className="fee-tile__eta">~{b.eta}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="fee-grid__source">Source: local RETH txpool · refresh 2s</div>
    </div>
  );
}
