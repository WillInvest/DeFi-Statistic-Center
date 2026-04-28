import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrandStrip } from '../../components/BrandStrip';
import { StatusBar } from '../../components/StatusBar';
import { SchemaTree } from './SchemaTree';
import { QueryPane } from './QueryPane';
import { ResultsPane, type ResultsView } from './ResultsPane';
import {
  buildSql,
  defaultQueryFromSchemas,
  executeMock,
  executeQuery,
  fetchSchemas,
  findTable,
  MOCK_SCHEMAS,
  resetSchemasToMock,
  setSchemas,
  type MockRow,
  type QueryState,
  type Schema,
} from '../../lib/schema';
import './Workbench.css';

function orderByForTable(tDef: { columns: { name: string }[] }) {
  const cols = tDef.columns.map((c) => c.name);
  const col =
    cols.find((c) => c === 'block') ??
    cols.find((c) => c === 'block_number') ??
    cols[0];
  return col ? [{ id: 'sb', column: col, direction: 'DESC' as const }] : [];
}

export function Workbench() {
  const [schemas, setSchemaList] = useState<Schema[]>(() => [...MOCK_SCHEMAS]);
  const [query, setQuery] = useState<QueryState>(() => defaultQueryFromSchemas(MOCK_SCHEMAS));
  const [view, setView] = useState<ResultsView>('Table');
  const [schemaOpen, setSchemaOpen] = useState(true);
  const [queryOpen, setQueryOpen] = useState(true);
  const [dataSource, setDataSource] = useState<'live' | 'mock'>('mock');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [querying, setQuerying] = useState(false);
  const [executed, setExecuted] = useState<{
    columns: string[];
    rows: MockRow[];
    rowCount: number;
    ms: number;
    schema: string;
    table: string;
  } | null>(null);

  useEffect(() => {
    // Load schemas only — do NOT auto-execute. Results pane stays at the
    // "Waiting for query…" empty state until the user explicitly runs.
    let cancelled = false;
    (async () => {
      try {
        const s = await fetchSchemas();
        if (cancelled) return;
        setSchemas(s);
        setSchemaList(s);
        setQuery(defaultQueryFromSchemas(s));
        setDataSource('live');
        setLoadError(null);
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        resetSchemasToMock();
        setSchemaList([...MOCK_SCHEMAS]);
        setQuery(defaultQueryFromSchemas(MOCK_SCHEMAS));
        setDataSource('mock');
        setLoadError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onRun = useCallback(async () => {
    setQuerying(true);
    try {
      if (dataSource === 'live') {
        const result = await executeQuery(buildSql(query));
        setExecuted({ ...result, schema: query.schema, table: query.table });
      } else {
        const r = executeMock(query);
        setExecuted({ ...r, schema: query.schema, table: query.table });
      }
    } catch (e) {
      console.error(e);
      setLoadError(e instanceof Error ? e.message : String(e));
    } finally {
      setQuerying(false);
    }
  }, [query, dataSource]);

  const onRunSql = useCallback(async (sql: string) => {
    setQuerying(true);
    try {
      const result = await executeQuery(sql);
      setExecuted({ ...result, schema: query.schema, table: query.table });
      setDataSource('live');
      setLoadError(null);
    } finally {
      setQuerying(false);
    }
  }, [query.schema, query.table]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        void onRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRun]);

  const onSidebarSelect = useCallback(
    (schema: string, table: string) => {
      if (!schema || !table) return;
      if (schema === query.schema && table === query.table) return;
      const tDef = findTable(schema, table);
      if (!tDef) return;
      setQuery({
        schema,
        table,
        selectColumns: tDef.columns.slice(0, 4).map((c) => c.name),
        filters: [],
        groupBy: [],
        orderBy: orderByForTable(tDef),
        limit: 100,
      });
    },
    [query.schema, query.table],
  );

  const lastResultMeta = useMemo(
    () => (executed ? { rows: executed.rowCount, ms: executed.ms } : null),
    [executed],
  );

  const cols =
    schemaOpen && queryOpen
      ? '280px minmax(0, 1fr) minmax(0, 1fr)'
      : schemaOpen && !queryOpen
        ? '280px minmax(0, 1fr)'
        : !schemaOpen && queryOpen
          ? 'minmax(0, 1fr) minmax(0, 1fr)'
          : 'minmax(0, 1fr)';

  return (
    <div
      className="workbench"
      data-screen-label="Query"
    >
      <BrandStrip activeNav="Query" />
      <div className="workbench__body" style={{ gridTemplateColumns: cols }}>
        {schemaOpen && (
          <SchemaTree
            schemas={schemas}
            selected={{ schema: query.schema, table: query.table }}
            onSelect={onSidebarSelect}
            onCollapse={() => setSchemaOpen(false)}
          />
        )}
        {queryOpen && (
          <QueryPane
            schemas={schemas}
            query={query}
            onQueryChange={setQuery}
            onRun={() => void onRun()}
            onRunSql={(sql) => void onRunSql(sql)}
            lastResultMeta={lastResultMeta}
            dataSource={dataSource}
            onCollapse={() => setQueryOpen(false)}
            schemaCollapsed={!schemaOpen}
            onExpandSchema={() => setSchemaOpen(true)}
          />
        )}
        <ResultsPane
          view={view}
          onViewChange={setView}
          schema={executed?.schema ?? query.schema}
          table={executed?.table ?? query.table}
          columns={executed?.columns ?? []}
          rows={executed?.rows ?? []}
          rowCount={executed?.rowCount ?? 0}
          ms={executed?.ms ?? 0}
          hasRun={!!executed}
          querying={querying}
          dataSource={dataSource}
          schemaCollapsed={!schemaOpen}
          queryCollapsed={!queryOpen}
          onExpandSchema={() => setSchemaOpen(true)}
          onExpandQuery={() => setQueryOpen(true)}
        />
      </div>
      <StatusBar />
    </div>
  );
}
