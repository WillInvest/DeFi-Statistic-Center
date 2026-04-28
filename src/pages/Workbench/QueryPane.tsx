import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  buildSql,
  findTable,
  OPS,
  type Filter,
  type Op,
  type OrderBy,
  type QueryState,
  type Schema,
} from '../../lib/schema';
import { nlToQuery, type NlResult } from '../../lib/nl';
import { getSchemaGuide } from './schemaGuide';
import { SqlEditor } from './sql/SqlEditor';
import { formatSQL } from './sql/format';

function prettyTableName(raw: string): string {
  return raw.replace(/_events$/, '');
}

type QueryPaneProps = {
  schemas: Schema[];
  query: QueryState;
  onQueryChange: (q: QueryState) => void;
  onRun: () => void;
  onRunSql?: (sql: string) => void;
  lastResultMeta?: { rows: number; ms: number } | null;
  dataSource: 'live' | 'mock';
  onCollapse?: () => void;
  schemaCollapsed?: boolean;
  onExpandSchema?: () => void;
};

let nextId = 1;
const newId = () => `f${nextId++}`;

export function QueryPane({
  schemas,
  query,
  onQueryChange,
  onRun,
  onRunSql,
  lastResultMeta,
  dataSource,
  onCollapse,
  schemaCollapsed,
  onExpandSchema,
}: QueryPaneProps) {
  const tableDef = findTable(query.schema, query.table);
  const allColumns = tableDef?.columns ?? [];

  const handleSelectChange = (col: string, checked: boolean) => {
    const set = new Set(query.selectColumns);
    if (checked) set.add(col);
    else set.delete(col);
    const updated: QueryState = {
      ...query,
      selectColumns: allColumns.map((c) => c.name).filter((n) => set.has(n)),
      groupBy: query.groupBy.filter((g) => set.has(g) || allColumns.find((c) => c.name === g)),
      orderBy: query.orderBy.filter((o) => allColumns.find((c) => c.name === o.column)),
    };
    onQueryChange(updated);
  };

  const setSchemaTable = (schema: string, table: string) => {
    const t = findTable(schema, table);
    onQueryChange({
      ...query,
      schema,
      table,
      selectColumns: t ? t.columns.slice(0, 4).map((c) => c.name) : [],
      filters: [],
      groupBy: [],
      orderBy: [],
    });
  };

  return (
    <div className="query-pane">
      <div className="pane-header">
        {schemaCollapsed && onExpandSchema && (
          <button
            className="pane-expand-btn"
            onClick={onExpandSchema}
            aria-label="Expand schema panel"
            title="Show Schema"
          >
            ▸
          </button>
        )}
        <span className="pane-header__title">Query</span>
        <span className="pane-header__meta">
          {lastResultMeta
            ? `${lastResultMeta.ms.toFixed(1)} ms · ${lastResultMeta.rows.toLocaleString()} rows`
            : ''}
        </span>
        <button
          className="btn btn-run btn-sm"
          onClick={onRun}
          style={{ whiteSpace: 'nowrap', minWidth: 90 }}
        >
          Run ⌘↵
        </button>
        {onCollapse && (
          <button
            className="pane-collapse-btn"
            onClick={onCollapse}
            aria-label="Collapse query panel"
            title="Collapse"
          >
            ◂
          </button>
        )}
      </div>

      <div className="query-pane__body">
        <div className="query-pane__builder">
          <BuilderForm
            schemas={schemas}
            query={query}
            allColumns={allColumns}
            onSchemaTable={setSchemaTable}
            onSelectChange={handleSelectChange}
            onChange={onQueryChange}
          />
        </div>
        <NlChat onRunSql={onRunSql} />
      </div>
    </div>
  );
}

function BuilderForm({
  schemas,
  query,
  allColumns,
  onSchemaTable,
  onSelectChange,
  onChange,
}: {
  schemas: Schema[];
  query: QueryState;
  allColumns: { name: string; type: string }[];
  onSchemaTable: (schema: string, table: string) => void;
  onSelectChange: (col: string, checked: boolean) => void;
  onChange: (q: QueryState) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState<null | 'select' | 'group'>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const tablesInSchema = schemas.find((s) => s.name === query.schema)?.tables ?? [];
  const selectableForGroup = query.selectColumns.length ? query.selectColumns : allColumns.map((c) => c.name);

  const addFilter = () => {
    const first = allColumns[0]?.name ?? '';
    const f: Filter = { id: newId(), column: first, op: '=', value: '' };
    onChange({ ...query, filters: [...query.filters, f] });
  };
  const updateFilter = (id: string, patch: Partial<Filter>) =>
    onChange({ ...query, filters: query.filters.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  const removeFilter = (id: string) =>
    onChange({ ...query, filters: query.filters.filter((f) => f.id !== id) });

  const addOrder = () => {
    const remaining = selectableForGroup.find((c) => !query.orderBy.find((o) => o.column === c));
    if (!remaining) return;
    const o: OrderBy = { id: newId(), column: remaining, direction: 'DESC' };
    onChange({ ...query, orderBy: [...query.orderBy, o] });
  };
  const updateOrder = (id: string, patch: Partial<OrderBy>) =>
    onChange({ ...query, orderBy: query.orderBy.map((o) => (o.id === id ? { ...o, ...patch } : o)) });
  const removeOrder = (id: string) =>
    onChange({ ...query, orderBy: query.orderBy.filter((o) => o.id !== id) });

  const addGroupBy = (col: string) => {
    if (query.groupBy.includes(col)) return;
    onChange({ ...query, groupBy: [...query.groupBy, col] });
    setPickerOpen(null);
  };
  const removeGroupBy = (col: string) =>
    onChange({ ...query, groupBy: query.groupBy.filter((c) => c !== col) });

  const availableForSelect = allColumns.filter((c) => !query.selectColumns.includes(c.name));
  const availableForGroup = selectableForGroup.filter((c) => !query.groupBy.includes(c));

  return (
    <div
      className="builder"
      onClick={(e) => {
        if (pickerRef.current && !pickerRef.current.contains(e.target as Node))
          setPickerOpen(null);
      }}
    >
      <div className="builder__grid">
        {/* Protocol */}
        <Eyebrow>Protocol</Eyebrow>
        <div className="builder__row">
          <select
            className="select select--data"
            value={query.schema}
            onChange={(e) => {
              const s = e.target.value;
              const firstTable = schemas.find((sc) => sc.name === s)?.tables[0]?.name ?? '';
              onSchemaTable(s, firstTable);
            }}
          >
            {schemas.map((s) => (
              <option key={s.name} value={s.name}>{getSchemaGuide(s.name).displayName}</option>
            ))}
          </select>
        </div>

        {/* Events */}
        <Eyebrow>Events</Eyebrow>
        <div className="builder__row">
          <select
            className="select select--data"
            value={query.table}
            onChange={(e) => onSchemaTable(query.schema, e.target.value)}
          >
            {tablesInSchema.map((t) => (
              <option key={t.name} value={t.name}>{prettyTableName(t.name)}</option>
            ))}
          </select>
        </div>

        {/* Select columns */}
        <Eyebrow>Select</Eyebrow>
        <div
          className="builder__chips"
          ref={(el) => { if (pickerOpen === 'select') pickerRef.current = el; }}
        >
          {query.selectColumns.map((c) => (
            <Chip key={c} label={c} onRemove={() => onSelectChange(c, false)} accent="gold" />
          ))}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPickerOpen((p) => (p === 'select' ? null : 'select'));
              }}
              disabled={availableForSelect.length === 0}
            >
              + Add column
            </button>
            {pickerOpen === 'select' && availableForSelect.length > 0 && (
              <Picker
                items={[
                  {
                    value: '__ALL__',
                    label: 'All columns',
                    hint: `${availableForSelect.length}`,
                  },
                  ...availableForSelect.map((c) => ({ value: c.name, hint: c.type })),
                ]}
                onPick={(v) => {
                  if (v === '__ALL__') {
                    for (const c of availableForSelect) onSelectChange(c.name, true);
                  } else {
                    onSelectChange(v, true);
                  }
                  setPickerOpen(null);
                }}
              />
            )}
          </div>
        </div>

        {/* Where */}
        <Eyebrow>Where</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {query.filters.map((f) => (
            <div key={f.id} className="builder__row" style={{ flexWrap: 'wrap' }}>
              <select
                className="select"
                value={f.column}
                onChange={(e) => updateFilter(f.id, { column: e.target.value })}
              >
                {allColumns.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <select
                className="select"
                value={f.op}
                onChange={(e) => updateFilter(f.id, { op: e.target.value as Op })}
                style={{ width: 70 }}
              >
                {OPS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <input
                className="input"
                value={f.value}
                onChange={(e) => updateFilter(f.id, { value: e.target.value })}
                placeholder="value"
                style={{ width: 200, fontFamily: 'var(--font-mono)' }}
              />
              <button
                className="btn btn-ghost btn-sm"
                type="button"
                onClick={() => removeFilter(f.id)}
                aria-label="Remove filter"
              >
                ×
              </button>
            </div>
          ))}
          <div>
            <button className="btn btn-ghost btn-sm" type="button" onClick={addFilter}>
              + Filter
            </button>
          </div>
        </div>

        {/* Group by */}
        <Eyebrow>Group by</Eyebrow>
        <div
          className="builder__chips"
          ref={(el) => { if (pickerOpen === 'group') pickerRef.current = el; }}
        >
          {query.groupBy.map((c) => (
            <Chip key={c} label={c} onRemove={() => removeGroupBy(c)} accent="charcoal" />
          ))}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              disabled={availableForGroup.length === 0}
              onClick={(e) => {
                e.stopPropagation();
                setPickerOpen((p) => (p === 'group' ? null : 'group'));
              }}
            >
              + Group
            </button>
            {pickerOpen === 'group' && availableForGroup.length > 0 && (
              <Picker
                items={availableForGroup.map((c) => ({ value: c }))}
                onPick={(v) => addGroupBy(v)}
              />
            )}
          </div>
        </div>

        {/* Order by */}
        <Eyebrow>Order by</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {query.orderBy.map((o) => {
            const used = new Set(query.orderBy.map((x) => x.column).filter((c) => c !== o.column));
            const options = selectableForGroup.filter((c) => !used.has(c));
            return (
              <div key={o.id} className="builder__row">
                <select
                  className="select"
                  value={o.column}
                  onChange={(e) => updateOrder(o.id, { column: e.target.value })}
                  style={{ width: 200 }}
                >
                  {options.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  className="select"
                  value={o.direction}
                  onChange={(e) => updateOrder(o.id, { direction: e.target.value as 'ASC' | 'DESC' })}
                  style={{ width: 80 }}
                >
                  <option>DESC</option>
                  <option>ASC</option>
                </select>
                <button
                  className="btn btn-ghost btn-sm"
                  type="button"
                  onClick={() => removeOrder(o.id)}
                  aria-label="Remove order"
                >
                  ×
                </button>
              </div>
            );
          })}
          <div>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              onClick={addOrder}
              disabled={query.orderBy.length >= selectableForGroup.length}
            >
              + Order
            </button>
          </div>
        </div>

        {/* Limit */}
        <Eyebrow>Limit</Eyebrow>
        <input
          className="input"
          type="number"
          min={0}
          max={10000}
          value={query.limit}
          onChange={(e) =>
            onChange({ ...query, limit: Math.max(0, Math.min(10000, Number(e.target.value) || 0)) })
          }
          style={{ width: 110, fontFamily: 'var(--font-mono)' }}
        />
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow" style={{ color: 'var(--fg-muted)', paddingTop: 6 }}>
      {children}
    </span>
  );
}

function Chip({ label, onRemove, accent }: { label: string; onRemove: () => void; accent: 'gold' | 'charcoal' }) {
  return (
    <span className={`badge chip badge-${accent === 'gold' ? 'gold' : 'gray'}`}>
      <span>{label}</span>
      <button type="button" onClick={onRemove} className="chip__remove" aria-label={`Remove ${label}`}>
        ×
      </button>
    </span>
  );
}

function Picker({
  items,
  onPick,
}: {
  items: { value: string; label?: string; hint?: string }[];
  onPick: (v: string) => void;
}) {
  return (
    <div className="picker" onClick={(e) => e.stopPropagation()}>
      {items.map((it) => (
        <div
          key={it.value}
          onClick={() => onPick(it.value)}
          className={`picker__item${it.value === '__ALL__' ? ' picker__item--all' : ''}`}
        >
          <span>{it.label ?? it.value}</span>
          {it.hint && <span className="picker__hint">{it.hint}</span>}
        </div>
      ))}
    </div>
  );
}

function SqlPreview({ sql }: { sql: string }) {
  const KEYWORDS = useMemo(
    () => new Set([
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'AS',
      'NOT', 'IN', 'LIKE', 'SUM', 'COUNT', 'AVG', 'MIN', 'MAX', 'DESC', 'ASC',
      'BETWEEN', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'CASE',
      'WHEN', 'THEN', 'ELSE', 'END', 'HAVING', 'WITH', 'DISTINCT',
    ]),
    [],
  );
  const lines = sql.split('\n');
  return (
    <div className="sql-preview">
      <div className="sql-preview__header">
        <span className="eyebrow" style={{ color: 'var(--fg-muted)' }}>Generated SQL</span>
        <span className="sql-preview__label">live · read-only</span>
      </div>
      <pre className="sql-preview__code">
        {lines.map((ln, i) => (
          <div key={i}>{tokenize(ln, KEYWORDS)}</div>
        ))}
      </pre>
    </div>
  );
}

type ChatMsg = { role: 'user' | 'assistant'; text: string; sql?: string };

function NlChat({ onRunSql }: { onRunSql?: (sql: string) => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const send = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;
    setInput('');
    const userMsg: ChatMsg = { role: 'user', text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const result = await nlToQuery(prompt);
      if ('error' in result) {
        setMessages((prev) => [...prev, { role: 'assistant', text: result.error }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: '', sql: formatSQL(result.sql) }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', text: String(e) }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }
  }, [input, loading]);

  const runSql = useCallback(async (sql: string, msgIdx: number) => {
    try {
      await onRunSql?.(sql);
    } catch (qe) {
      const msg = qe instanceof Error ? qe.message : String(qe);
      setMessages((prev) => {
        const next = [...prev];
        const insertAt = msgIdx + 1;
        next.splice(insertAt, 0, { role: 'assistant', text: `Query error: ${msg}` });
        return next;
      });
    }
  }, [onRunSql]);

  return (
    <div className="nl-chat">
      <div className="nl-chat__header">
        <span className="pane-header__title">Agent Query</span>
        <span className="nl-chat__badge">MiniMax M2.7</span>
      </div>
      {messages.length === 0 && (
        <div className="nl-chat__hint">
          Describe the data you want in plain English. A SQL query will be generated for you to review and run.
        </div>
      )}
      {messages.length > 0 && (
        <div className="nl-chat__messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`nl-chat__msg nl-chat__msg--${m.role}`}>
              {m.role === 'user' ? (
                <span className="nl-chat__user-text">{m.text}</span>
              ) : (
                <>
                  {m.text && <span>{m.text}</span>}
                  {m.sql && (
                    <div className="nl-chat__sql-wrap">
                      <SqlEditor
                        value={m.sql}
                        onChange={(next) =>
                          setMessages((prev) =>
                            prev.map((mm, j) => (j === i ? { ...mm, sql: next } : mm))
                          )
                        }
                        onRun={() => void runSql(m.sql!, i)}
                      />
                      <button
                        className="btn btn-run btn-sm nl-chat__run-btn"
                        onClick={() => void runSql(m.sql!, i)}
                      >
                        Run ▶
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          {loading && (
            <div className="nl-chat__msg nl-chat__msg--assistant">
              <span className="nl-chat__thinking">Thinking…</span>
            </div>
          )}
        </div>
      )}
      <div className="nl-chat__input-row">
        <input
          className="input nl-chat__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); } }}
          placeholder="e.g. &quot;top 10 WETH swaps by amount&quot;"
          disabled={loading}
        />
        <button
          className="btn btn-run btn-sm"
          onClick={() => void send()}
          disabled={loading || !input.trim()}
          style={{ whiteSpace: 'nowrap' }}
        >
          {loading ? '…' : '→'}
        </button>
      </div>
    </div>
  );
}

function tokenize(line: string, kws: Set<string>): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /('[^']*')|(\b[A-Z]+\b)|(\b\w+\b)|(\s+)|([^\w\s])/g;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(line)) !== null) {
    const tok = m[0];
    if (m[1]) out.push(<span key={key++} style={{ color: 'var(--syn-string)' }}>{tok}</span>);
    else if (m[2] && kws.has(m[2]))
      out.push(<span key={key++} style={{ color: '#E25A6E', fontWeight: 600 }}>{tok}</span>);
    else if (m[3]) out.push(<span key={key++} style={{ color: 'var(--fg)' }}>{tok}</span>);
    else if (m[4]) out.push(tok);
    else out.push(<span key={key++} style={{ color: 'var(--hairline-light)' }}>{tok}</span>);
  }
  return out.length ? out : [' '];
}
