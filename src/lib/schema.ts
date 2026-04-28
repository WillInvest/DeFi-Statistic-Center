// Workbench schema metadata: loaded from `GET /api/schema` when the API is
// available; `MOCK_SCHEMAS` is the offline fallback (simplified table names).

export type ColType = 'int' | 'address' | 'numeric' | 'timestamp' | 'text' | 'bool' | 'hash';

export type Column = {
  name: string;
  type: ColType;
};

export type Table = {
  name: string;
  columns: Column[];
};

export type Schema = {
  name: string;
  tables: Table[];
};

/** Offline fallback (does not match live Postgres table names). */
export const MOCK_SCHEMAS: Schema[] = [
  {
    name: 'uniswap_v3',
    tables: [
      {
        name: 'swaps',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'block_timestamp', type: 'timestamp' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'pool', type: 'address' },
          { name: 'token0', type: 'text' },
          { name: 'token1', type: 'text' },
          { name: 'fee_tier', type: 'text' },
          { name: 'sender', type: 'address' },
          { name: 'recipient', type: 'address' },
          { name: 'amount0', type: 'numeric' },
          { name: 'amount1', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
          { name: 'sqrt_price_x96', type: 'numeric' },
          { name: 'liquidity', type: 'numeric' },
          { name: 'tick', type: 'int' },
        ],
      },
      {
        name: 'pools',
        columns: [
          { name: 'pool_address', type: 'address' },
          { name: 'fee_tier', type: 'int' },
          { name: 'token0', type: 'address' },
          { name: 'token1', type: 'address' },
          { name: 'token0_symbol', type: 'text' },
          { name: 'token1_symbol', type: 'text' },
          { name: 'liquidity', type: 'numeric' },
          { name: 'tick', type: 'int' },
          { name: 'created_block', type: 'int' },
          { name: 'created_at', type: 'timestamp' },
          { name: 'tvl_usd', type: 'numeric' },
          { name: 'volume_24h_usd', type: 'numeric' },
        ],
      },
      {
        name: 'mints',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'pool', type: 'address' },
          { name: 'token0', type: 'text' },
          { name: 'token1', type: 'text' },
          { name: 'fee_tier', type: 'text' },
          { name: 'owner', type: 'address' },
          { name: 'tick_lower', type: 'int' },
          { name: 'tick_upper', type: 'int' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount0', type: 'numeric' },
          { name: 'amount1', type: 'numeric' },
        ],
      },
      {
        name: 'burns',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'pool', type: 'address' },
          { name: 'token0', type: 'text' },
          { name: 'token1', type: 'text' },
          { name: 'fee_tier', type: 'text' },
          { name: 'owner', type: 'address' },
          { name: 'tick_lower', type: 'int' },
          { name: 'tick_upper', type: 'int' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount0', type: 'numeric' },
          { name: 'amount1', type: 'numeric' },
        ],
      },
      {
        name: 'positions',
        columns: [
          { name: 'token_id', type: 'int' },
          { name: 'pool', type: 'address' },
          { name: 'owner', type: 'address' },
          { name: 'tick_lower', type: 'int' },
          { name: 'tick_upper', type: 'int' },
          { name: 'liquidity', type: 'numeric' },
          { name: 'fees_owed_0', type: 'numeric' },
          { name: 'fees_owed_1', type: 'numeric' },
          { name: 'created_block', type: 'int' },
          { name: 'closed_block', type: 'int' },
        ],
      },
    ],
  },
  {
    name: 'curve',
    tables: [
      {
        name: 'exchanges',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'block_timestamp', type: 'timestamp' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'pool', type: 'address' },
          { name: 'buyer', type: 'address' },
          { name: 'sold_id', type: 'int' },
          { name: 'bought_id', type: 'int' },
          { name: 'tokens_sold', type: 'numeric' },
          { name: 'tokens_bought', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'liquidity',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'pool', type: 'address' },
          { name: 'provider', type: 'address' },
          { name: 'kind', type: 'text' },
          { name: 'amount0', type: 'numeric' },
          { name: 'amount1', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
    ],
  },
  {
    name: 'aave_v3',
    tables: [
      {
        name: 'borrows',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'reserve', type: 'address' },
          { name: 'on_behalf_of', type: 'address' },
          { name: 'rate_mode', type: 'int' },
          { name: 'amount', type: 'numeric' },
          { name: 'borrow_rate', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'supplies',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'reserve', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'on_behalf_of', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
          { name: 'liquidity_index', type: 'numeric' },
        ],
      },
      {
        name: 'liquidations',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'collateral_asset', type: 'address' },
          { name: 'debt_asset', type: 'address' },
          { name: 'liquidator', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'debt_to_cover', type: 'numeric' },
          { name: 'liquidated_collateral', type: 'numeric' },
          { name: 'health_factor', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
    ],
  },
  {
    name: 'balancer_v2',
    tables: [
      {
        name: 'swaps',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'pool_id', type: 'hash' },
          { name: 'token_in', type: 'address' },
          { name: 'token_out', type: 'address' },
          { name: 'amount_in', type: 'numeric' },
          { name: 'amount_out', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
          { name: 'fee_usd', type: 'numeric' },
        ],
      },
      {
        name: 'pools',
        columns: [
          { name: 'pool_id', type: 'hash' },
          { name: 'pool_address', type: 'address' },
          { name: 'pool_type', type: 'text' },
          { name: 'tokens', type: 'text' },
          { name: 'swap_fee', type: 'numeric' },
          { name: 'liquidity_usd', type: 'numeric' },
          { name: 'volume_24h_usd', type: 'numeric' },
          { name: 'created_block', type: 'int' },
          { name: 'created_at', type: 'timestamp' },
        ],
      },
    ],
  },
  // ---- Lending (Aave V2, Compound V3, Morpho, Spark in addition to Aave V3) ----
  {
    name: 'aave_v2',
    tables: [
      {
        name: 'borrows',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'reserve', type: 'address' },
          { name: 'on_behalf_of', type: 'address' },
          { name: 'rate_mode', type: 'int' },
          { name: 'amount', type: 'numeric' },
          { name: 'borrow_rate', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'supplies',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'reserve', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'liquidations',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'collateral_asset', type: 'address' },
          { name: 'debt_asset', type: 'address' },
          { name: 'liquidator', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'debt_to_cover', type: 'numeric' },
          { name: 'liquidated_collateral', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
    ],
  },
  {
    name: 'compound_v3',
    tables: [
      {
        name: 'borrows',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'market', type: 'address' },
          { name: 'borrower', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'supplies',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'market', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'asset', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'liquidations',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'market', type: 'address' },
          { name: 'absorber', type: 'address' },
          { name: 'borrower', type: 'address' },
          { name: 'collateral_absorbed', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
    ],
  },
  {
    name: 'morpho',
    tables: [
      {
        name: 'borrows',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'market_id', type: 'hash' },
          { name: 'borrower', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'supplies',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'market_id', type: 'hash' },
          { name: 'user', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'liquidations',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'market_id', type: 'hash' },
          { name: 'liquidator', type: 'address' },
          { name: 'borrower', type: 'address' },
          { name: 'repaid_assets', type: 'numeric' },
          { name: 'seized_assets', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
    ],
  },
  {
    name: 'spark',
    tables: [
      {
        name: 'borrows',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'reserve', type: 'address' },
          { name: 'on_behalf_of', type: 'address' },
          { name: 'rate_mode', type: 'int' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'supplies',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'reserve', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'liquidations',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'collateral_asset', type: 'address' },
          { name: 'debt_asset', type: 'address' },
          { name: 'liquidator', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'debt_to_cover', type: 'numeric' },
          { name: 'liquidated_collateral', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
    ],
  },
  // ---- Infrastructure ----
  {
    name: 'ethereum',
    tables: [
      {
        name: 'blocks',
        columns: [
          { name: 'number', type: 'int' },
          { name: 'hash', type: 'hash' },
          { name: 'parent_hash', type: 'hash' },
          { name: 'timestamp', type: 'timestamp' },
          { name: 'miner', type: 'address' },
          { name: 'gas_used', type: 'int' },
          { name: 'gas_limit', type: 'int' },
          { name: 'base_fee_per_gas', type: 'numeric' },
        ],
      },
      {
        name: 'transactions',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'hash', type: 'hash' },
          { name: 'from_address', type: 'address' },
          { name: 'to_address', type: 'address' },
          { name: 'value', type: 'numeric' },
          { name: 'gas', type: 'int' },
          { name: 'gas_price', type: 'numeric' },
          { name: 'status', type: 'int' },
        ],
      },
      {
        name: 'logs',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'log_index', type: 'int' },
          { name: 'address', type: 'address' },
          { name: 'topic0', type: 'hash' },
          { name: 'data', type: 'text' },
        ],
      },
      {
        name: 'contracts',
        columns: [
          { name: 'address', type: 'address' },
          { name: 'creator', type: 'address' },
          { name: 'creation_block', type: 'int' },
          { name: 'creation_tx_hash', type: 'hash' },
          { name: 'bytecode_hash', type: 'hash' },
        ],
      },
    ],
  },
  {
    name: 'bridges',
    tables: [
      {
        name: 'transfers',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'bridge', type: 'text' },
          { name: 'src_chain', type: 'text' },
          { name: 'dst_chain', type: 'text' },
          { name: 'sender', type: 'address' },
          { name: 'recipient', type: 'address' },
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
    ],
  },
  {
    name: 'tokens',
    tables: [
      {
        name: 'transfers',
        columns: [
          { name: 'block_number', type: 'int' },
          { name: 'tx_hash', type: 'hash' },
          { name: 'token', type: 'address' },
          { name: 'from_address', type: 'address' },
          { name: 'to_address', type: 'address' },
          { name: 'amount', type: 'numeric' },
          { name: 'amount_usd', type: 'numeric' },
        ],
      },
      {
        name: 'metadata',
        columns: [
          { name: 'address', type: 'address' },
          { name: 'symbol', type: 'text' },
          { name: 'name', type: 'text' },
          { name: 'decimals', type: 'int' },
          { name: 'total_supply', type: 'numeric' },
        ],
      },
    ],
  },
  {
    name: 'dsc',
    tables: [
      {
        name: 'queries',
        columns: [
          { name: 'id', type: 'int' },
          { name: 'created_at', type: 'timestamp' },
          { name: 'author', type: 'text' },
          { name: 'sql', type: 'text' },
        ],
      },
    ],
  },
];

/** Active schema tree — replaced when `/api/schema` loads. */
export let SCHEMAS: Schema[] = MOCK_SCHEMAS;

export function setSchemas(next: Schema[]): void {
  SCHEMAS = next;
}

export function resetSchemasToMock(): void {
  SCHEMAS = MOCK_SCHEMAS;
}

export async function fetchSchemas(): Promise<Schema[]> {
  const r = await fetch('/api/schema');
  if (!r.ok) throw new Error((await r.text()) || `schema HTTP ${r.status}`);
  const data = (await r.json()) as { schemas: Schema[] };
  if (!Array.isArray(data.schemas)) throw new Error('Invalid /api/schema response');
  return data.schemas;
}

export type QueryResult = {
  columns: string[];
  rows: MockRow[];
  rowCount: number;
  ms: number;
};

export async function executeQuery(sql: string): Promise<QueryResult> {
  const r = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql }),
  });
  const text = await r.text();
  if (!r.ok) {
    let msg = text;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* keep text */
    }
    throw new Error(msg || `query HTTP ${r.status}`);
  }
  return JSON.parse(text) as QueryResult;
}

export function findTable(schema: string, table: string): Table | undefined {
  return SCHEMAS.find((s) => s.name === schema)?.tables.find((t) => t.name === table);
}

export function fullKey(schema: string, table: string): string {
  return `${schema}.${table}`;
}

// ---------- Mock data ----------

const POOL_LABELS = [
  'USDC / WETH · 0.05%',
  'DAI / USDC · 0.01%',
  'WBTC / WETH · 0.30%',
  'USDT / WETH · 0.05%',
  'USDC / DAI · 0.01%',
  'WETH / LINK · 0.30%',
  'WBTC / USDC · 0.05%',
  'FRAX / USDC · 0.01%',
];

const TOKEN_SYMBOLS = ['USDC', 'WETH', 'DAI', 'WBTC', 'USDT', 'LINK', 'FRAX', 'rETH', 'cbETH'];
const POOL_TYPES = ['Weighted', 'Stable', 'MetaStable', 'ComposableStable'];

function fakeAddr(seed: number): string {
  const hex = (seed * 99173 + 0x88e6c).toString(16).padStart(8, '0').slice(0, 8);
  const tail = ((seed * 7919 + 0x5640) >>> 0).toString(16).padStart(4, '0').slice(0, 4);
  return `0x${hex}…${tail}`;
}

function fakeHash(seed: number): string {
  const a = (seed * 31337).toString(16).padStart(6, '0').slice(0, 6);
  const b = ((seed * 4093 + 0x91a) >>> 0).toString(16).padStart(4, '0').slice(0, 4);
  return `0x${a}…${b}`;
}

const MOCK_BASE_BLOCK = 19482901;
const MOCK_TIME = Date.UTC(2026, 3, 27, 18, 0, 0);

export type MockRow = Record<string, string | number | boolean>;

// Deterministic mock rows for a given table — every column is filled.
export function generateRows(schema: string, table: string, n = 24): MockRow[] {
  const t = findTable(schema, table);
  if (!t) return [];
  const rows: MockRow[] = [];
  for (let i = 0; i < n; i++) {
    const row: MockRow = {};
    for (const c of t.columns) {
      row[c.name] = mockValue(c, i, schema, table);
    }
    rows.push(row);
  }
  return rows;
}

function mockValue(c: Column, i: number, schema: string, table: string): string | number {
  const seed = i + 1;
  switch (c.type) {
    case 'int': {
      if (c.name === 'block_number' || c.name === 'created_block' || c.name === 'closed_block')
        return MOCK_BASE_BLOCK - i;
      if (c.name === 'fee_tier') return [100, 500, 3000, 10000][i % 4];
      if (c.name === 'tick' || c.name === 'tick_lower' || c.name === 'tick_upper')
        return -201240 + i * 60;
      if (c.name === 'rate_mode') return (i % 2) + 1;
      if (c.name === 'sold_id' || c.name === 'bought_id') return i % 4;
      if (c.name === 'token_id') return 481200 + i;
      return i;
    }
    case 'numeric': {
      if (c.name === 'amount_usd' || c.name === 'volume_24h_usd' || c.name === 'tvl_usd' || c.name === 'liquidity_usd')
        return Math.round((4_500_000 - i * 187_300) * 100) / 100;
      if (c.name === 'amount0' || c.name === 'tokens_sold' || c.name === 'amount_in')
        return Math.round((1284.42 - i * 31.7) * 1e4) / 1e4;
      if (c.name === 'amount1' || c.name === 'tokens_bought' || c.name === 'amount_out')
        return Math.round((0.421 - i * 0.0083) * 1e6) / 1e6;
      if (c.name === 'borrow_rate') return Math.round((0.0421 + i * 0.0007) * 1e6) / 1e6;
      if (c.name === 'liquidity' || c.name === 'sqrt_price_x96')
        return Math.round((1.42e18 - i * 8.1e15) / 1e10) / 1e8;
      if (c.name === 'health_factor') return Math.round((1.04 - i * 0.011) * 1e4) / 1e4;
      if (c.name === 'swap_fee') return [0.0001, 0.0005, 0.003, 0.01][i % 4];
      if (c.name === 'fee_usd') return Math.round((420.18 - i * 7.2) * 100) / 100;
      return Math.round((1000 - i * 23) * 100) / 100;
    }
    case 'address':
      return fakeAddr(seed * (c.name.length + schema.length));
    case 'hash':
      return fakeHash(seed * (c.name.length + table.length + 3));
    case 'timestamp': {
      const ts = MOCK_TIME - i * 12_000;
      return new Date(ts).toISOString().replace('T', ' ').slice(0, 19);
    }
    case 'text': {
      if (c.name === 'token0' || c.name === 'token0_symbol') return TOKEN_SYMBOLS[i % TOKEN_SYMBOLS.length];
      if (c.name === 'token1' || c.name === 'token1_symbol') return TOKEN_SYMBOLS[(i + 3) % TOKEN_SYMBOLS.length];
      if (c.name === 'fee_tier') return ['0.01%', '0.05%', '0.3%', '1%'][i % 4];
      if (c.name === 'kind') return ['add', 'remove'][i % 2];
      if (c.name === 'pool_type') return POOL_TYPES[i % POOL_TYPES.length];
      if (c.name === 'tokens') return `${TOKEN_SYMBOLS[i % 9]}/${TOKEN_SYMBOLS[(i + 2) % 9]}`;
      return POOL_LABELS[i % POOL_LABELS.length];
    }
    case 'bool':
      return i % 3 !== 0 ? 'true' : 'false';
  }
}

// ---------- Operators / SQL formatting ----------

export const OPS = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN'] as const;
export type Op = (typeof OPS)[number];

export type Filter = {
  id: string;
  column: string;
  op: Op;
  value: string;
};

export type OrderBy = {
  id: string;
  column: string;
  direction: 'ASC' | 'DESC';
};

export type QueryState = {
  schema: string;
  table: string;
  selectColumns: string[];
  filters: Filter[];
  groupBy: string[];
  orderBy: OrderBy[];
  limit: number;
};

/** Build default query from API-shaped schemas (prefers uniswap_v3.swap_events). */
export function defaultQueryFromSchemas(schemas: Schema[]): QueryState {
  const s0 = schemas.find((s) => s.name === 'uniswap_v3') ?? schemas[0];
  if (!s0 || !s0.tables.length) {
    return {
      schema: 'uniswap_v3',
      table: 'swap_events',
      selectColumns: [],
      filters: [],
      groupBy: [],
      orderBy: [],
      limit: 100,
    };
  }
  const t0 = s0.tables.find((t) => t.name === 'swap_events') ?? s0.tables[0];
  const orderCol =
    t0.columns.find((c) => c.name === 'block')?.name ??
    t0.columns.find((c) => c.name === 'block_number')?.name ??
    t0.columns[0]?.name ??
    'block';
  const preferredSpec: [string, ...string[]][] = [
    ['block', 'block_number'],
    ['token0'],
    ['amount0'],
    ['token1'],
    ['amount1'],
    ['fee_tier'],
  ];
  const available = new Set(t0.columns.map((c) => c.name));
  const defaultCols = preferredSpec
    .map((alts) => alts.find((a) => available.has(a)))
    .filter((c): c is string => c != null);
  return {
    schema: s0.name,
    table: t0.name,
    selectColumns: defaultCols.length
      ? defaultCols
      : t0.columns.slice(0, Math.min(4, t0.columns.length)).map((c) => c.name),
    filters: [],
    groupBy: [],
    orderBy: [{ id: 'init', column: orderCol, direction: 'DESC' }],
    limit: 100,
  };
}

export function quoteValue(value: string, op: Op, type?: ColType): string {
  if (op === 'IN') return `(${value})`;
  if (type === 'numeric' || type === 'int' || type === 'bool') {
    return /^-?\d+(\.\d+)?$/.test(value.trim()) ? value.trim() : `'${value}'`;
  }
  return `'${value}'`;
}

export function buildSql(q: QueryState): string {
  const cols = q.selectColumns.length ? q.selectColumns.join(', ') : '*';
  const lines: string[] = [];
  lines.push(`SELECT ${cols}`);
  lines.push(`FROM   ${q.schema}.${q.table}`);
  if (q.filters.length) {
    const t = findTable(q.schema, q.table);
    const where = q.filters
      .map((f, i) => {
        const col = t?.columns.find((c) => c.name === f.column);
        const v = quoteValue(f.value || '', f.op, col?.type);
        return `${i === 0 ? 'WHERE  ' : '  AND  '}${f.column} ${f.op} ${v}`;
      })
      .join('\n');
    lines.push(where);
  }
  if (q.groupBy.length) lines.push(`GROUP BY ${q.groupBy.join(', ')}`);
  if (q.orderBy.length)
    lines.push(`ORDER BY ${q.orderBy.map((o) => `${o.column} ${o.direction}`).join(', ')}`);
  if (q.limit > 0) lines.push(`LIMIT ${q.limit};`);
  return lines.join('\n');
}

// Apply ORDER BY + LIMIT to mock rows; project to selected columns.
// (WHERE / GROUP BY are not interpreted in mock mode — the rows are
// generated, not from a real engine. This is enough to make RUN feel
// responsive while a real backend isn't wired yet.)
export function executeMock(q: QueryState): { columns: string[]; rows: MockRow[]; rowCount: number; ms: number } {
  const t0 = performance.now();
  const all = generateRows(q.schema, q.table, 32);
  const cols = q.selectColumns.length
    ? q.selectColumns
    : (findTable(q.schema, q.table)?.columns.map((c) => c.name) ?? []);
  let rows = all;
  if (q.orderBy.length) {
    const [primary] = q.orderBy;
    const colDef = findTable(q.schema, q.table)?.columns.find((c) => c.name === primary.column);
    const numeric = colDef?.type === 'int' || colDef?.type === 'numeric';
    rows = [...rows].sort((a, b) => {
      const av = a[primary.column];
      const bv = b[primary.column];
      const cmp = numeric ? Number(av) - Number(bv) : String(av).localeCompare(String(bv));
      return primary.direction === 'ASC' ? cmp : -cmp;
    });
  }
  if (q.limit > 0) rows = rows.slice(0, q.limit);
  // Project
  rows = rows.map((r) => Object.fromEntries(cols.map((c) => [c, r[c]])) as MockRow);
  const ms = Math.max(8, Math.round((performance.now() - t0) * 10) / 10);
  return { columns: cols, rows, rowCount: rows.length, ms };
}
