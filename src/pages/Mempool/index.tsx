import { useEffect, useState } from 'react';
import { BrandStrip } from '../../components/BrandStrip';
import { StatusBar } from '../../components/StatusBar';
import { MempoolHeader } from './MempoolHeader';
import { FeeGrid, type FeeBucket } from './FeeGrid';
import { TxList, type Tx, type TxFilter, type TxType, type TxStatus } from './TxList';

const TYPES: TxType[] = ['SWAP', 'ADD LIQ', 'REMOVE LIQ', 'XFER', 'CONTRACT'];
const ADDRS = [
  '0x4a2c…f81e',
  '0x88e6…5640',
  '0x7a25…488D',
  '0xC36C…E2A1',
  '0xb1f2…9a07',
  '0xDac1…1ec7',
  '0xa0b8…6Eb4',
  '0x6B17…2e48',
];

function rand<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

function mkHash(): string {
  return (
    '0x' +
    Math.floor(Math.random() * 16 ** 16)
      .toString(16)
      .padStart(16, '0')
      .slice(0, 4) +
    '…' +
    Math.floor(Math.random() * 16 ** 16)
      .toString(16)
      .slice(0, 4)
  );
}

function mkRow(age: number): Tx {
  const type = rand(TYPES);
  const status: TxStatus = age < 3 ? 'PENDING' : Math.random() < 0.92 ? 'CONFIRMED' : 'REVERTED';
  return {
    hash: mkHash() + Math.random(),
    type,
    from: rand(ADDRS),
    to: rand(ADDRS),
    value: (Math.random() * 5).toFixed(4),
    gas: 18 + Math.floor(Math.random() * 30),
    fee: (Math.random() * 0.02).toFixed(4),
    status,
    age: age < 1 ? '<1s' : age < 60 ? `${age}s` : `${Math.floor(age / 60)}m`,
  };
}

const INITIAL_BUCKETS: FeeBucket[] = [
  { range: '> 60 gwei', count: 24, eta: 'next block' },
  { range: '40-60 gwei', count: 142, eta: '1 block' },
  { range: '30-40 gwei', count: 581, eta: '1-2 blocks' },
  { range: '20-30 gwei', count: 1284, eta: '2-3 blocks' },
  { range: '15-20 gwei', count: 904, eta: '3-5 blocks' },
  { range: '10-15 gwei', count: 612, eta: '5-10 blocks' },
  { range: '5-10 gwei', count: 248, eta: '10+ blocks' },
  { range: '< 5 gwei', count: 89, eta: 'speculative' },
];

export function Mempool() {
  const [rows, setRows] = useState<Tx[]>(() => Array.from({ length: 18 }, (_, i) => mkRow(i)));
  const [filter, setFilter] = useState<TxFilter>('ALL');
  const [block, setBlock] = useState(19482901);
  const [pending, setPending] = useState(3884);

  useEffect(() => {
    const t = setInterval(() => {
      setRows((prev) => [mkRow(0), ...prev].slice(0, 24));
      setPending((p) => p + Math.floor(Math.random() * 10) - 5);
      if (Math.random() < 0.15) setBlock((b) => b + 1);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const visible = filter === 'ALL' ? rows : rows.filter((r) => r.type === filter);

  return (
    <div
      data-screen-label="Mempool"
      style={{
        display: 'grid',
        gridTemplateRows: '56px auto 1fr 28px',
        height: '100vh',
        background: '#1E2329',
        color: '#E4E5E6',
      }}
    >
      <BrandStrip activeNav="Mempool" block={block.toLocaleString()} />
      <MempoolHeader block={block} gas={32} baseFee={28} pending={pending} gasTrend="↑ 4 gwei · 1m" />
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', minHeight: 0 }}>
        <FeeGrid buckets={INITIAL_BUCKETS} />
        <TxList rows={visible} filter={filter} onFilter={setFilter} />
      </div>
      <StatusBar block={block.toLocaleString()} latency="2.0 s" />
    </div>
  );
}
