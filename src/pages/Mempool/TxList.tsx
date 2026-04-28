export type TxType = 'SWAP' | 'ADD LIQ' | 'REMOVE LIQ' | 'XFER' | 'CONTRACT';
export type TxStatus = 'PENDING' | 'CONFIRMED' | 'REVERTED';
export type TxFilter = 'ALL' | TxType;

export type Tx = {
  hash: string;
  type: TxType;
  from: string;
  to: string;
  value: string;
  gas: number;
  fee: string;
  status: TxStatus;
  age: string;
};

type TxListProps = {
  rows: Tx[];
  filter: TxFilter;
  onFilter: (f: TxFilter) => void;
};

export function TxList({ rows, filter, onFilter }: TxListProps) {
  const filters: TxFilter[] = ['ALL', 'SWAP', 'ADD LIQ', 'REMOVE LIQ', 'XFER', 'CONTRACT'];
  const typeColor = (t: TxType): string =>
    ({
      SWAP: '#E25A6E',
      'ADD LIQ': '#EBC73B',
      'REMOVE LIQ': '#7FB05A',
      XFER: '#949594',
      CONTRACT: '#C9CACB',
    }[t] || '#E4E5E6');

  return (
    <div
      style={{
        background: '#1E2329',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {/* Header / filters */}
      <div
        style={{
          height: 36,
          background: '#1E2329',
          borderBottom: '1px solid #1A1F25',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 14,
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
        >
          Live tx
        </span>
        <span className="badge badge-solid-maroon" style={{ animation: 'none' }}>
          LIVE
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 0, border: '1px solid #444B54' }}>
          {filters.map((f) => (
            <div
              key={f}
              onClick={() => onFilter(f)}
              style={{
                padding: '0 10px',
                height: 22,
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                background: filter === f ? '#A32638' : 'transparent',
                color: filter === f ? '#fff' : '#E4E5E6',
                cursor: 'pointer',
                borderRight: '1px solid #444B54',
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
      {/* Table header */}
      <div
        style={{
          height: 28,
          padding: '0 14px',
          display: 'grid',
          gridTemplateColumns: '90px 1fr 110px 80px 80px 110px 70px',
          alignItems: 'center',
          gap: 12,
          background: '#363D45',
          whiteSpace: 'nowrap',
          borderBottom: '2px solid #A32638',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#E4E5E6',
        }}
      >
        <span>TYPE</span>
        <span>FROM → TO</span>
        <span style={{ textAlign: 'right' }}>VALUE</span>
        <span style={{ textAlign: 'right' }}>GAS</span>
        <span style={{ textAlign: 'right' }}>FEE ETH</span>
        <span>STATUS</span>
        <span style={{ textAlign: 'right' }}>AGE</span>
      </div>
      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {rows.map((r, i) => (
          <div
            key={r.hash}
            style={{
              height: 28,
              padding: '0 14px',
              display: 'grid',
              gridTemplateColumns: '90px 1fr 110px 80px 80px 110px 70px',
              alignItems: 'center',
              gap: 12,
              borderBottom: '1px solid #1A1F25',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: '#E4E5E6',
              whiteSpace: 'nowrap',
              background: i === 0 ? 'rgba(163,38,56,0.08)' : 'transparent',
            }}
          >
            <span
              style={{
                color: typeColor(r.type),
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: 11,
                whiteSpace: 'nowrap',
              }}
            >
              {r.type}
            </span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.from} → {r.to}
            </span>
            <span className="num" style={{ textAlign: 'right' }}>
              {r.value} ETH
            </span>
            <span className="num" style={{ textAlign: 'right' }}>
              {r.gas} gwei
            </span>
            <span className="num" style={{ textAlign: 'right' }}>
              {r.fee}
            </span>
            <span>
              {r.status === 'PENDING' ? (
                <span
                  className="badge"
                  style={{ background: '#EBC73B', color: '#000', borderColor: 'transparent' }}
                >
                  PENDING
                </span>
              ) : r.status === 'CONFIRMED' ? (
                <span className="badge" style={{ color: '#7FB05A' }}>
                  CONFIRMED
                </span>
              ) : (
                <span className="badge" style={{ color: '#E25A6E' }}>
                  {r.status}
                </span>
              )}
            </span>
            <span className="num" style={{ textAlign: 'right', color: '#949594' }}>
              {r.age}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
