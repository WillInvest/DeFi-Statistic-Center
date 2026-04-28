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

const TYPE_COLOR: Record<TxType, string> = {
  SWAP: '#E25A6E',
  'ADD LIQ': '#EBC73B',
  'REMOVE LIQ': '#7FB05A',
  XFER: '#949594',
  CONTRACT: '#C9CACB',
};

export function TxList({ rows, filter, onFilter }: TxListProps) {
  const filters: TxFilter[] = ['ALL', 'SWAP', 'ADD LIQ', 'REMOVE LIQ', 'XFER', 'CONTRACT'];

  return (
    <div className="tx-list">
      <div className="tx-list__header">
        <span className="tx-list__title">Live tx</span>
        <span className="badge badge-solid-maroon">LIVE</span>
        <div className="tx-filters">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilter(f)}
              className={`tx-filter${filter === f ? ' tx-filter--active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="tx-thead">
        <span>TYPE</span>
        <span>FROM → TO</span>
        <span style={{ textAlign: 'right' }}>VALUE</span>
        <span style={{ textAlign: 'right' }}>GAS</span>
        <span style={{ textAlign: 'right' }}>FEE ETH</span>
        <span>STATUS</span>
        <span style={{ textAlign: 'right' }}>AGE</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {rows.map((r, i) => (
          <div
            key={r.hash}
            className={`tx-row${i === 0 ? ' tx-row--new' : ''}`}
          >
            <span className="tx-row__type" style={{ color: TYPE_COLOR[r.type] }}>
              {r.type}
            </span>
            <span className="tx-row__addr">{r.from} → {r.to}</span>
            <span className="num" style={{ textAlign: 'right' }}>{r.value} ETH</span>
            <span className="num" style={{ textAlign: 'right' }}>{r.gas} gwei</span>
            <span className="num" style={{ textAlign: 'right' }}>{r.fee}</span>
            <span>
              {r.status === 'PENDING' ? (
                <span className="badge badge-solid-gold">PENDING</span>
              ) : r.status === 'CONFIRMED' ? (
                <span className="badge" style={{ color: '#7FB05A' }}>CONFIRMED</span>
              ) : (
                <span className="badge" style={{ color: '#E25A6E' }}>{r.status}</span>
              )}
            </span>
            <span className="tx-row__age num">{r.age}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
