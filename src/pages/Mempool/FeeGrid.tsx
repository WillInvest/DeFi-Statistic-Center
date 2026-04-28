export type FeeBucket = {
  range: string;
  count: number;
  eta: string;
};

type FeeGridProps = { buckets: FeeBucket[] };

// Fee bucket grid — mempool.space-inspired but Stevens palette.
// Buckets sorted by gas-price descending; tile size scales with tx count.
export function FeeGrid({ buckets }: FeeGridProps) {
  return (
    <div
      style={{
        background: '#1E2329',
        padding: 16,
        borderRight: '1px solid #1A1F25',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            paddingRight: 4,
          }}
        >
          Pending · by fee
        </span>
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#949594', whiteSpace: 'nowrap' }}
        >
          {buckets.reduce((a, b) => a + b.count, 0).toLocaleString()} tx
        </span>
      </div>
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '1fr',
          gap: 4,
          minHeight: 0,
        }}
      >
        {buckets.map((b, i) => {
          // Top bucket = maroon, then charcoal-light, then gold for the speculative tail
          const palette = ['#A32638', '#5A3038', '#444B54', '#3A4048', '#EBC73B'];
          const bg = i === buckets.length - 1 ? '#EBC73B' : palette[Math.min(i, palette.length - 2)];
          const fg = bg === '#EBC73B' ? '#000' : '#FFFFFF';
          return (
            <div
              key={i}
              style={{
                background: bg,
                color: fg,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 0,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                }}
              >
                {b.range}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: '0.02em',
                    lineHeight: 1,
                  }}
                >
                  {b.count.toLocaleString()}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginTop: 4, opacity: 0.85 }}>
                  ~{b.eta}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#949594', fontStyle: 'italic' }}>
        Source: local RETH txpool · refresh 2s
      </div>
    </div>
  );
}
