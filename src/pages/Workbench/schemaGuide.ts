/** Sidebar copy: categories, friendly names, and plain-English tooltips. */

export type SchemaCategoryId = 'exchanges' | 'lending' | 'infrastructure' | 'other';

export const SCHEMA_CATEGORY_ORDER: SchemaCategoryId[] = [
  'exchanges',
  'lending',
  'infrastructure',
  'other',
];

export const SCHEMA_CATEGORY_LABELS: Record<SchemaCategoryId, string> = {
  exchanges: 'Exchanges',
  lending: 'Lending',
  infrastructure: 'Infrastructure',
  other: 'Other',
};

export const SCHEMA_CATEGORY_DESCRIPTIONS: Record<SchemaCategoryId, string> = {
  exchanges: 'Decentralized trading protocols where users swap tokens and provide liquidity.',
  lending: 'Protocols where users supply assets to earn yield or borrow against collateral.',
  infrastructure: 'Chain state, bridges, token reference data, and project helper tables.',
  other: 'Additional or unclassified schemas from the API (custom namespaces).',
};

export type SchemaGuideEntry = {
  category: SchemaCategoryId;
  displayName: string;
  description: string;
};

const SCHEMA_GUIDE: Record<string, SchemaGuideEntry> = {
  uniswap_v3: {
    category: 'exchanges',
    displayName: 'Uniswap V3',
    description: 'Automated market maker (AMM) trades, pools, and liquidity positions on Uniswap version 3.',
  },
  curve: {
    category: 'exchanges',
    displayName: 'Curve',
    description: 'Stable-focused DEX: pool trades, liquidity adds, and removes on Curve.',
  },
  balancer_v2: {
    category: 'exchanges',
    displayName: 'Balancer V2',
    description: 'Balancer v2 vault swaps and pool metadata (weighted, stable, and other pool types).',
  },
  aave_v2: {
    category: 'lending',
    displayName: 'Aave V2',
    description: 'Lending and borrowing events from the Aave v2 money market on Ethereum.',
  },
  aave_v3: {
    category: 'lending',
    displayName: 'Aave V3',
    description: 'Supplies, borrows, and liquidations from the Aave v3 lending protocol.',
  },
  compound_v3: {
    category: 'lending',
    displayName: 'Compound V3',
    description: 'Compound (Comet) lending market: interest, collateral, and borrow activity.',
  },
  morpho: {
    category: 'lending',
    displayName: 'Morpho',
    description: 'Morpho lending optimizer: matched peer-to-peer liquidity on top of base lending pools.',
  },
  spark: {
    category: 'lending',
    displayName: 'Spark',
    description: 'Spark lending protocol (SparkLend / Maker ecosystem) supply, borrow, and liquidation data.',
  },
  ethereum: {
    category: 'infrastructure',
    displayName: 'Ethereum',
    description: 'Base Ethereum chain data: blocks, transactions, traces, or contracts as exposed in this warehouse.',
  },
  bridges: {
    category: 'infrastructure',
    displayName: 'Bridges',
    description: 'Cross-chain bridge deposits, withdrawals, and message or token flows.',
  },
  tokens: {
    category: 'infrastructure',
    displayName: 'Tokens',
    description: 'ERC-20 and other token metadata, transfers, or balances used across protocols.',
  },
  dsc: {
    category: 'infrastructure',
    displayName: 'DSC',
    description: 'DSC query–specific helper tables, views, or curated joins for this project.',
  },
};

/** Default table blurbs when not overridden per schema. */
const TABLE_GUIDE_DEFAULTS: Record<string, string> = {
  swaps: 'Individual swap or trade events: tokens in, tokens out, and amounts.',
  pools: 'Liquidity pool registry: token pairs, fees, identifiers, and pool-level stats.',
  mints: 'Liquidity added to a pool (deposits / LP mint events).',
  burns: 'Liquidity removed from a pool (withdrawals / LP burn events).',
  positions: 'Per-position or NFT position state (price range, owner, liquidity).',
  exchanges: 'Trade or exchange events inside a pool (buyer, sold and bought assets).',
  liquidity: 'Liquidity provision changes (adds, removes, or similar pool balance updates).',
  borrows: 'Loans taken from a lending pool (who borrowed, which asset, how much).',
  supplies: 'Deposits into a lending pool (collateral or interest-bearing supply).',
  liquidations: 'Forced loan closures when collateral cannot cover debt (liquidator, amounts, health).',
  repayments: 'Loan paybacks (principal and interest returned to the pool).',
  withdrawals: 'User withdrawals of supplied assets from a lending market.',
  transfers: 'Token transfer events between addresses.',
  blocks: 'Block headers and consensus metadata (number, time, gas).',
  transactions: 'Signed transactions sent on-chain (from, to, value, input data).',
  logs: 'Smart contract event logs (topics and decoded payloads).',
  contracts: 'Deployed contract bytecode and creation metadata.',
};

/** Per-schema table overrides (optional). */
const TABLE_GUIDE_BY_SCHEMA: Record<string, Record<string, string>> = {
  curve: {
    exchanges: 'Curve pool trades: which tokens were sold and bought and in what size.',
    liquidity: 'Curve pool liquidity adds and removes (provider, pool, amounts).',
  },
  balancer_v2: {
    swaps: 'Balancer vault swaps: pool id, tokens in/out, amounts, and optional fee or USD estimates.',
    pools: 'Registered Balancer pools: type, underlying tokens, fees, and liquidity or volume hints.',
  },
  aave_v3: {
    borrows: 'Aave v3 borrow draws: reserve asset, user, rate mode, and borrowed amount.',
    supplies: 'Aave v3 supply deposits: reserve, user, amount, and liquidity index snapshot.',
    liquidations: 'Undercollateralized position liquidations: collateral seized, debt repaid, liquidator.',
  },
  uniswap_v3: {
    swaps: 'Concentrated-liquidity pool swaps: price tick, sqrt price, token amounts, and pool address.',
    pools: 'Uniswap v3 pools: fee tier, token addresses, tick, liquidity, and optional TVL or volume.',
    mints: 'New liquidity added to a tick range inside a v3 pool.',
    burns: 'Liquidity removed from a tick range inside a v3 pool.',
    positions: 'NFT-bound liquidity positions: tick bounds, owner, and accrued fees.',
  },
};

const COLUMN_HINTS: Record<string, string> = {
  pool_id: 'Balancer internal pool identifier (bytes32), not the same as the pool contract address.',
  pool: 'Liquidity pool contract address involved in the event.',
  pool_address: 'Contract address of the pool.',
  sender: 'Address that initiated the transaction step (may be a router or user).',
  recipient: 'Address that receives output tokens or position proceeds.',
  owner: 'Address that controls the position, NFT, or funds.',
  amount0: 'Quantity moved for the pool’s first token (signed or unsigned depending on table).',
  amount1: 'Quantity moved for the pool’s second token.',
  amount_in: 'Input token amount for a swap.',
  amount_out: 'Output token amount for a swap.',
  amount_usd: 'Approximate notional value in US dollars at the time of the event.',
  tx_hash: 'Unique identifier of the Ethereum transaction containing this event.',
  block_number: 'Index of the block on the chain where this row was recorded.',
  block_timestamp: 'Wall-clock time (UTC) of the block.',
  block: 'Block identifier (number or hash) depending on schema.',
  token0: 'First token in the pool’s ordering (not price rank).',
  token1: 'Second token in the pool’s ordering.',
  token_in: 'Token paid into the swap.',
  token_out: 'Token received from the swap.',
  fee_tier: 'Pool fee as a fraction of trade size (e.g. 0.05% tier).',
  tick: 'Discrete price step in Uniswap v3 concentrated liquidity math.',
  sqrt_price_x96: 'Square root of price in Q64.96 fixed-point form (v3 internal state).',
  liquidity: 'Active liquidity units in the pool or position at the snapshot.',
  reserve: 'Lending market reserve / underlying asset contract.',
  user: 'End user address associated with the borrow, supply, or liquidation row.',
  on_behalf_of: 'Beneficiary the action was performed for (may differ from the transaction sender).',
  liquidator: 'Address that executed the liquidation and repaid debt.',
  health_factor: 'Risk score for a loan; below 1 usually means the position can be liquidated.',
  rate_mode: 'Interest accrual mode (e.g. stable vs variable) on Aave-style markets.',
  buyer: 'Address acquiring tokens in a Curve-style exchange event.',
  sold_id: 'Index or id of the token sold in a multi-asset pool.',
  bought_id: 'Index or id of the token bought in a multi-asset pool.',
  tokens_sold: 'Amount of the sold token.',
  tokens_bought: 'Amount of the bought token.',
  debt_to_cover: 'Debt amount the liquidator was asked to repay.',
  liquidated_collateral: 'Collateral seized from the borrower during liquidation.',
  collateral_asset: 'Token taken as collateral in the liquidation.',
  debt_asset: 'Borrowed asset being repaid in the liquidation.',
};

function titleCaseSnake(name: string): string {
  return name
    .split(/_+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function getSchemaGuide(schemaName: string): SchemaGuideEntry {
  const known = SCHEMA_GUIDE[schemaName];
  if (known) return known;
  return {
    category: 'other',
    displayName: titleCaseSnake(schemaName),
    description: 'On-chain indexed tables for this protocol or dataset.',
  };
}

export function getSchemaCategory(schemaName: string): SchemaCategoryId {
  return getSchemaGuide(schemaName).category;
}

export function getTableDescription(schemaName: string, tableName: string): string | undefined {
  return (
    TABLE_GUIDE_BY_SCHEMA[schemaName]?.[tableName] ??
    TABLE_GUIDE_DEFAULTS[tableName]
  );
}

/** Non-empty string for `title` attributes on table rows. */
export function getTableTooltip(schemaName: string, tableName: string): string {
  return (
    getTableDescription(schemaName, tableName) ??
    `Rows from ${tableName} in ${getSchemaGuide(schemaName).displayName}.`
  );
}

export function getColumnTooltip(columnName: string): string | undefined {
  return COLUMN_HINTS[columnName];
}
