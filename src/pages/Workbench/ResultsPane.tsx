import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fmtNum, fmtUsd } from '../../lib/format';
import { findTable, type MockRow } from '../../lib/schema';

export type ResultsView = 'Table' | 'Chart';

type ResultsPaneProps = {
  view: ResultsView;
  onViewChange: (v: ResultsView) => void;
  schema: string;
  table: string;
  columns: string[];
  rows: MockRow[];
  rowCount: number;
  ms: number;
  hasRun: boolean;
  querying?: boolean;
  dataSource: 'live' | 'mock';
  schemaCollapsed?: boolean;
  queryCollapsed?: boolean;
  onExpandSchema?: () => void;
  onExpandQuery?: () => void;
};

export function ResultsPane({
  view,
  onViewChange,
  schema,
  table,
  columns,
  rows,
  rowCount,
  ms,
  hasRun,
  querying,
  dataSource,
  schemaCollapsed,
  queryCollapsed,
  onExpandSchema,
  onExpandQuery,
}: ResultsPaneProps) {
  const views: ResultsView[] = ['Table'];

  const exportCsv = useCallback(() => {
    if (!columns.length || !rows.length) return;
    const escape = (v: unknown) => {
      const s = v == null ? '' : String(v);
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };
    const header = columns.map(escape).join(',');
    const body = rows.map((r) => columns.map((c) => escape(r[c])).join(',')).join('\n');
    const blob = new Blob([header + '\n' + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema}_${table}_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [columns, rows, schema, table]);

  return (
    <div className="results-pane">
      <div className="pane-header pane-header--light">
        {queryCollapsed && (
          <div className="pane-expand-group">
            {schemaCollapsed && onExpandSchema && (
              <button
                className="pane-expand-btn pane-expand-btn--light"
                onClick={onExpandSchema}
                title="Show Schema"
              >
                ▸ Schema
              </button>
            )}
            {onExpandQuery && (
              <button
                className="pane-expand-btn pane-expand-btn--light"
                onClick={onExpandQuery}
                title="Show Query"
              >
                ▸ Query
              </button>
            )}
          </div>
        )}
        <span className="pane-header__title">Results</span>
        <span className="pane-header__meta">
          {hasRun
            ? `${rowCount.toLocaleString()} rows · ${ms.toFixed(1)} ms · ${schema}.${table}`
            : 'Waiting for query…'}
        </span>
        <div className="toggle-group toggle-group--light" style={{ marginLeft: 'auto' }}>
          {views.map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`toggle-group__item${view === v ? ' toggle-group__item--active' : ''}`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--charcoal)', borderColor: 'var(--border-on-light)' }}
          onClick={exportCsv}
          disabled={!hasRun || rows.length === 0}
        >
          Export CSV
        </button>
      </div>
      <div className="results-pane__body">
        {querying ? (
          <GotLoader label="Querying the realm…" />
        ) : !hasRun ? (
          <GotLoader
            label="Try asking the Agent Query"
            phrases={AGENT_QUERY_HINTS}
            byline="↑ Type a question like this in the Agent Query chat"
          />
        ) : rows.length === 0 ? (
          <EmptyState />
        ) : view === 'Table' ? (
          <ResultsTable schema={schema} table={table} columns={columns} rows={rows} />
        ) : (
          <ResultsChart schema={schema} table={table} columns={columns} rows={rows} />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="results-pane__empty">
      No rows. Adjust the query and run again.
    </div>
  );
}

type GotCharacter = { name: string; img: string; quotes: string[] };

const GOT_CHARACTERS: GotCharacter[] = [
  {
    name: 'Tyrion Lannister', img: '/tyrion.png',
    quotes: [
      'I drink and I know things.',
      'A mind needs books as a sword needs a whetstone, if it is to keep its edge.',
      'Never forget what you are. Wear it like armor, and it can never be used to hurt you.',
      'Death is so final, yet life is full of possibilities.',
      'I have a tender spot in my heart for cripples, bastards, and broken things.',
      'Once you\'ve accepted your flaws, no one can use them against you.',
    ],
  },
  {
    name: 'Cersei Lannister', img: '/cersei.png',
    quotes: [
      'When you play the game of thrones, you win or you die.',
      'I choose violence.',
      'Everyone who isn\'t us is an enemy.',
      'The only way to keep your people loyal is to make certain they fear you more than they do the enemy.',
      'Everywhere in the world, they hurt little girls.',
    ],
  },
  {
    name: 'The Hound', img: '/hound.png',
    quotes: [
      'Lots of people name their swords. Lots of cunts.',
      'If any man dies with a clean sword, I\'ll rape his corpse.',
      'You\'re a talker. Listening to talkers makes me thirsty.',
      'The world is built by killers. So you\'d better get used to looking at them.',
      'I understand that if any more words come pouring out your mouth, I\'m going to have to eat every chicken in this room.',
    ],
  },
  {
    name: 'Arya Stark', img: '/arya.png',
    quotes: [
      'A girl is Arya Stark of Winterfell. And I\'m going home.',
      'Leave one wolf alive and the sheep are never safe.',
      'Not today.',
      'Anyone can be killed.',
      'The lone wolf dies, but the pack survives.',
    ],
  },
  {
    name: 'Daenerys Targaryen', img: '/daenerys.png',
    quotes: [
      'I\'m not going to stop the wheel. I\'m going to break the wheel.',
      'Dracarys.',
      'All men must die, but we are not men.',
      'I am the blood of the dragon. I must be strong.',
      'Fire cannot kill a dragon.',
    ],
  },
  {
    name: 'Jon Snow', img: '/jon.png',
    quotes: [
      'The North remembers.',
      'There is only one war that matters. The Great War. And it is here.',
      'I\'m not going to swear an oath I can\'t uphold.',
      'Sometimes there is no happy choice, only one less grievous than the others.',
      'The true enemy won\'t wait out the storm. He brings the storm.',
    ],
  },
  {
    name: 'Ygritte', img: '/ygritte.png',
    quotes: [
      'You know nothing, Jon Snow.',
      'Is that a palace? It\'s not much of a palace.',
      'If we die, we die. But first we\'ll live.',
    ],
  },
  {
    name: 'Catelyn Stark', img: '/catelyn.png',
    quotes: [
      'If you lose, your father dies, your sisters die, we all die.',
      'I wonder if the old gods agree with you. I wonder if they\'re watching.',
      'It often comforts me to think that even in war\'s darkest days, in most places in the world, absolutely nothing is happening.',
    ],
  },
  {
    name: 'Samwell Tarly', img: '/samwell.png',
    quotes: [
      'I\'m not nothing anymore.',
      'I read it in a book.',
      'That\'s what I do. I read. And I know things.',
      'I always wanted to be a wizard.',
    ],
  },
  {
    name: 'Petyr Baelish', img: '/baelish.png',
    quotes: [
      'Chaos isn\'t a pit. Chaos is a ladder.',
      'A man with no motive is a man no one suspects.',
      'Knowledge is power.',
      'Fight every battle, everywhere, always, in your mind.',
    ],
  },
  {
    name: 'Brienne of Tarth', img: '/brienne.png',
    quotes: [
      'I swore an oath to keep you safe.',
      'All my life men like you have sneered at me. And all my life I\'ve been knocking men like you into the dust.',
      'I don\'t serve your brother. I serve Lady Catelyn.',
    ],
  },
  {
    name: 'Melisandre', img: '/melisandre.png',
    quotes: [
      'The night is dark and full of terrors.',
      'Death by fire is the purest death.',
      'I pray for a glimpse of the light that leads us all.',
    ],
  },
  {
    name: 'Theon Greyjoy', img: '/theon.png',
    quotes: [
      'My real father lost his head at King\'s Landing.',
      'I always wanted to do the right thing.',
      'What is dead may never die, but rises again harder and stronger.',
    ],
  },
  {
    name: 'Jorah Mormont', img: '/jorah.png',
    quotes: [
      'There is a beast in every man and it stirs when you put a sword in his hand.',
      'You have a good claim, a title, a birthright. But you have something more than that — you may cover it up and deny it, but you have a gentle heart.',
      'No one can survive in this world without help.',
    ],
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Hints shown in the waiting state. Each is a research-flavored question
// that maps onto tables actually in the warehouse — uniswap_v3 / curve /
// balancer_v2 swaps and pools, aave_v2/v3 / compound_v3 / morpho / spark
// borrows/supplies/liquidations, ethereum blocks/transactions, bridges,
// tokens. Designed to enlighten the user about what they could ask the
// Agent Query chat, grounded in real columns.
const AGENT_QUERY_HINTS = [
  'Top 10 Uniswap V3 pools by amount_usd in the last 24 hours.',
  'How does liquidity migrate across fee_tiers in Uniswap V3 over time?',
  'Which Aave V3 reserves had the most liquidations this month?',
  'Distribution of health_factor at the moment of Aave V3 liquidation.',
  'Compare amount_usd flow across uniswap_v3.swaps, curve.exchanges, and balancer_v2.swaps.',
  'Which Curve pools see the largest amount_usd exchanges during stablecoin depegs?',
  'Aave V3 borrows: stable vs variable rate_mode trends across reserves.',
  'Largest Balancer V2 swaps by amount_usd today, by pool_id.',
  'Which Uniswap V3 mints concentrate liquidity in the tightest tick ranges?',
  'Cross-protocol supply vs borrow ratio per reserve (Aave V2/V3, Compound V3, Spark).',
  'Bridge transfer volume per token over the past 7 days.',
  'Wallets that appear as both sender and recipient in uniswap_v3.swaps — wash-trade signal?',
  'Daily transaction count and gas use from ethereum.blocks.',
  'Morpho vs underlying Aave V3: borrow APY spread per reserve.',
];

function GotLoader({
  label = 'Querying the realm…',
  phrases,
  byline,
}: {
  label?: string;
  /** When provided, the typewriter cycles through these strings instead
   *  of the on-screen character's GoT quotes (used in the waiting state
   *  to suggest example agent-query questions). */
  phrases?: string[];
  /** Override the line under the typed text. Defaults to "— {char.name}". */
  byline?: string;
}) {
  const [char, setChar] = useState(() => pickRandom(GOT_CHARACTERS));
  const [quote, setQuote] = useState(() =>
    phrases && phrases.length > 0 ? pickRandom(phrases) : pickRandom(char.quotes),
  );
  const [displayed, setDisplayed] = useState('');
  const [charIdx, setCharIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const c = pickRandom(GOT_CHARACTERS);
    setChar(c);
    setQuote(phrases && phrases.length > 0 ? pickRandom(phrases) : pickRandom(c.quotes));
    setCharIdx(0);
    setDisplayed('');
    // Re-seed when the phrases set changes (idle ↔ querying mode toggle).
  }, [phrases]);

  useEffect(() => {
    if (charIdx >= quote.length) {
      const timeout = setTimeout(() => {
        const nextChar = pickRandom(GOT_CHARACTERS);
        setChar(nextChar);
        setQuote(phrases && phrases.length > 0 ? pickRandom(phrases) : pickRandom(nextChar.quotes));
        setCharIdx(0);
        setDisplayed('');
      }, 3500);
      return () => clearTimeout(timeout);
    }
    intervalRef.current = setInterval(() => {
      setCharIdx((prev) => {
        const next = prev + 1;
        setDisplayed(quote.slice(0, next));
        return next;
      });
    }, 65);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [quote, charIdx >= quote.length, phrases]);

  return (
    <div className="got-loader">
      <img src={char.img} alt={char.name} className="got-loader__img" key={char.name} />
      <div className="got-loader__content">
        <div className="got-loader__label">{label}</div>
        <div className="got-loader__quote">
          &ldquo;{displayed}<span className="got-loader__cursor">|</span>&rdquo;
        </div>
        <div className="got-loader__char">{byline ?? `— ${char.name}`}</div>
      </div>
    </div>
  );
}

function fmtCell(value: string | number | boolean | undefined, type: string): string {
  if (value === undefined || value === null) return '';
  if (type === 'address' || type === 'hash') return String(value);
  if (type === 'numeric') {
    const v = Number(value);
    if (!Number.isFinite(v)) return String(value);
    return v >= 100_000 || (v < 0.01 && v > 0)
      ? fmtUsd(v).replace('$', '')
      : v.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  if (type === 'int') return fmtNum(Number(value));
  return String(value);
}

function ResultsTable({
  schema,
  table,
  columns,
  rows,
}: {
  schema: string;
  table: string;
  columns: string[];
  rows: MockRow[];
}) {
  const tDef = findTable(schema, table);
  const colMeta = useMemo(
    () =>
      columns.map((name) => ({
        name,
        type: tDef?.columns.find((c) => c.name === name)?.type ?? 'text',
      })),
    [columns, tDef],
  );

  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      <table className="tbl" style={{ minWidth: 600 }}>
        <thead>
          <tr>
            {colMeta.map((c) => (
              <th
                key={c.name}
                style={{
                  textAlign: c.type === 'numeric' || c.type === 'int' ? 'right' : 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {colMeta.map((c) => {
                const isNum = c.type === 'numeric' || c.type === 'int';
                const isMono = c.type === 'address' || c.type === 'hash' || c.type === 'timestamp';
                return (
                  <td
                    key={c.name}
                    className={isNum ? 'num' : ''}
                    style={{
                      textAlign: isNum ? 'right' : 'left',
                      fontFamily: isMono ? 'var(--font-mono)' : undefined,
                      fontSize: isMono ? 12 : undefined,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fmtCell(r[c.name] as string | number | boolean | undefined, c.type)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function isNumericValue(v: unknown): boolean {
  if (typeof v === 'number') return true;
  if (typeof v === 'string' && v !== '' && !isNaN(Number(v))) return true;
  return false;
}

function ResultsChart({
  schema,
  table,
  columns,
  rows,
}: {
  schema: string;
  table: string;
  columns: string[];
  rows: MockRow[];
}) {
  const tDef = findTable(schema, table);

  const colTypes = useMemo(() => {
    return columns.map((name) => {
      const schemaDef = tDef?.columns.find((c) => c.name === name)?.type;
      if (schemaDef === 'numeric' || schemaDef === 'int') return { name, numeric: true };
      const sample = rows.slice(0, 10);
      const allNum = sample.length > 0 && sample.every((r) => r[name] == null || isNumericValue(r[name]));
      return { name, numeric: allNum };
    });
  }, [columns, rows, tDef]);

  const numericCol = colTypes.find((c) => c.numeric)?.name;
  const labelCol = colTypes.find((c) => !c.numeric)?.name ?? columns[0];

  if (!numericCol)
    return (
      <div className="results-pane__empty">
        Chart needs at least one numeric column in the results.
      </div>
    );

  const values = rows.map((r) => Number(r[numericCol]) || 0);
  const max = Math.max(...values, 1);
  const displayRows = rows.slice(0, 50);

  return (
    <div className="results-chart">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span className="results-chart__title">{numericCol} by {labelCol}</span>
        <span className="results-chart__subtitle">{schema}.{table}</span>
        <span className="results-chart__legend">
          <span className="results-chart__swatch" />
          {numericCol}
        </span>
      </div>
      <div className="results-chart__bars">
        {displayRows.map((r, i) => {
          const v = Number(r[numericCol]) || 0;
          return (
            <div key={i} className="results-chart__bar" title={`${r[labelCol]}: ${v.toLocaleString()}`}>
              <div className="results-chart__bar-fill" style={{ height: `${(v / max) * 100}%` }} />
            </div>
          );
        })}
      </div>
      <div className="results-chart__labels">
        {displayRows.map((r, i) => (
          <div key={i} className="results-chart__label" title={String(r[labelCol])}>
            {String(r[labelCol] ?? '').length > 8
              ? '…' + String(r[labelCol]).slice(-6)
              : String(r[labelCol] ?? '')}
          </div>
        ))}
      </div>
    </div>
  );
}
