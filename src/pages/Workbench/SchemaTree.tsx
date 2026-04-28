import { Fragment, useMemo, useState } from 'react';
import type { Schema, Table } from '../../lib/schema';
import {
  SCHEMA_CATEGORY_ORDER,
  SCHEMA_CATEGORY_LABELS,
  SCHEMA_CATEGORY_DESCRIPTIONS,
  getSchemaGuide,
  getTableTooltip,
  getColumnTooltip,
} from './schemaGuide';
import type { SchemaCategoryId } from './schemaGuide';

type SchemaTreeProps = {
  schemas: Schema[];
  selected: { schema: string; table: string } | null;
  onSelect: (schema: string, table: string) => void;
  onCollapse?: () => void;
};

function defaultCategoryOpen(): Record<SchemaCategoryId, boolean> {
  // Start collapsed at the category level — the user sees just the
  // top-level group headers ("Exchanges", "Lending", ...) and expands
  // them as needed. Schema-name expansion below is also empty so no
  // tables render until the user drills in.
  return { exchanges: false, lending: false, infrastructure: false, other: false };
}

export function SchemaTree({ schemas, selected, onSelect, onCollapse }: SchemaTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [categoryOpen, setCategoryOpen] = useState<Record<SchemaCategoryId, boolean>>(defaultCategoryOpen);
  const [search, setSearch] = useState('');

  const toggle = (k: string) => setExpanded((e) => ({ ...e, [k]: !e[k] }));
  const toggleCategory = (cat: SchemaCategoryId) =>
    setCategoryOpen((e) => ({ ...e, [cat]: !e[cat] }));

  const searching = !!search.trim();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return schemas;
    return schemas
      .map((s) => {
        if (s.name.toLowerCase().includes(q)) return s;
        const guide = getSchemaGuide(s.name);
        if (guide.displayName.toLowerCase().includes(q)) return s;
        const tables = s.tables.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.columns.some((c) => c.name.toLowerCase().includes(q)),
        );
        return tables.length ? { ...s, tables } : null;
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);
  }, [search, schemas]);

  const grouped = useMemo(() => {
    const byCat: Record<SchemaCategoryId, Schema[]> = {
      exchanges: [],
      lending: [],
      infrastructure: [],
      other: [],
    };
    for (const s of filtered) {
      const cat = getSchemaGuide(s.name).category;
      byCat[cat].push(s);
    }
    return SCHEMA_CATEGORY_ORDER.map((category) => ({
      category,
      schemas: byCat[category],
    })).filter((g) => g.schemas.length > 0);
  }, [filtered]);

  const isSchemaOpen = (name: string) => {
    if (searching) return true;
    return !!expanded[name];
  };

  const isCategoryOpen = (cat: SchemaCategoryId) => {
    if (searching) return true;
    return !!categoryOpen[cat];
  };

  const totalProtocols = schemas.length;
  const selectedKey = selected ? `${selected.schema}.${selected.table}` : null;

  function renderSchemaBlock(schema: Schema) {
    const meta = getSchemaGuide(schema.name);
    const open = isSchemaOpen(schema.name);
    const tableN = schema.tables.length;
    return (
      <div key={schema.name}>
        <div
          onClick={() => toggle(schema.name)}
          className="schema-row schema-row--group"
          title={meta.description}
        >
          <span className="schema-row__caret">{open ? '▾' : '▸'}</span>
          <span className="schema-row__name">{meta.displayName}</span>
          <span className="schema-row__meta">
            {tableN} table{tableN !== 1 ? 's' : ''}
          </span>
        </div>
        {open && schema.tables.map((t) => renderTable(schema.name, t))}
      </div>
    );
  }

  return (
    <div className="schema-tree">
      <div className="schema-tree__header">
        <span className="schema-tree__title">Schema</span>
        <span className="schema-tree__count">{totalProtocols} protocols</span>
        {onCollapse && (
          <button
            className="pane-collapse-btn"
            onClick={onCollapse}
            aria-label="Collapse schema panel"
            title="Collapse"
          >
            ◂
          </button>
        )}
      </div>
      <div className="schema-tree__search">
        <input
          className="input"
          placeholder="Search schema, table, column…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="schema-tree__list">
        {filtered.length === 0 && <div className="schema-tree__empty">No matches.</div>}
        {searching
          ? filtered.map((schema) => renderSchemaBlock(schema))
          : grouped.map(({ category, schemas: catSchemas }) => {
              const openCat = isCategoryOpen(category);
              const n = catSchemas.length;
              return (
                <div key={category} className="schema-tree__category">
                  <div
                    role="button"
                    tabIndex={0}
                    className="schema-tree__category-header"
                    title={SCHEMA_CATEGORY_DESCRIPTIONS[category]}
                    onClick={() => toggleCategory(category)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleCategory(category);
                      }
                    }}
                  >
                    <span className="schema-tree__category-caret">{openCat ? '▾' : '▸'}</span>
                    <span className="schema-tree__category-label">{SCHEMA_CATEGORY_LABELS[category]}</span>
                    <span className="schema-tree__category-meta">
                      {n} protocol{n !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {openCat && catSchemas.map((schema) => renderSchemaBlock(schema))}
                </div>
              );
            })}
      </div>
      <div className="schema-tree__footer">Local RETH · synced</div>
    </div>
  );

  function renderTable(schemaName: string, t: Table) {
    const key = `${schemaName}.${t.name}`;
    const isSelected = selectedKey === key;
    const tableTitle = getTableTooltip(schemaName, t.name);
    return (
      <Fragment key={key}>
        <div
          onClick={() => {
            if (isSelected) onSelect('', '');
            else onSelect(schemaName, t.name);
          }}
          className={`schema-row schema-row--table${isSelected ? ' schema-row--selected' : ''}`}
          title={tableTitle}
        >
          <span className="schema-row__caret">{isSelected ? '▾' : '▸'}</span>
          <span className="schema-row__name">{t.name}</span>
          <span className="schema-row__meta">{t.columns.length} cols</span>
        </div>
        {isSelected &&
          t.columns.map((c) => {
            const colHint = getColumnTooltip(c.name);
            return (
              <div
                key={c.name}
                className="schema-col"
                {...(colHint ? { title: colHint } : {})}
              >
                <span>{c.name}</span>
                <span className="schema-col__type">{c.type}</span>
              </div>
            );
          })}
      </Fragment>
    );
  }
}
