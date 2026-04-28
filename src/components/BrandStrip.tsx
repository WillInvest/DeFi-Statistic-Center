import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type NavItem = 'Query' | 'Mempool' | 'Research' | 'News & Sentiment' | 'Trading';

type BrandStripProps = {
  activeNav?: NavItem;
};

const NAV_TO_PATH: Partial<Record<NavItem, string>> = {
  Query: '/workbench',
  Mempool: '/mempool',
};

type NodeStatus = {
  status: 'live' | 'syncing' | 'unknown';
  localTip: number | null;
  globalTip: number | null;
  localTs: number | null;
  blocksBehind: number | null;
};

const POLL_MS = 12_000;

function formatBlock(n: number | null): string {
  if (n == null) return '—';
  return n.toLocaleString();
}

function useNodeStatus(): NodeStatus {
  const [state, setState] = useState<NodeStatus>({
    status: 'unknown',
    localTip: null,
    globalTip: null,
    localTs: null,
    blocksBehind: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const r = await fetch('/api/node');
        if (!r.ok) throw new Error(`node HTTP ${r.status}`);
        const data = (await r.json()) as NodeStatus;
        if (!cancelled) setState(data);
      } catch {
        if (!cancelled) {
          setState((s) => ({ ...s, status: 'unknown' }));
        }
      }
    }
    void tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return state;
}

export function BrandStrip({ activeNav = 'Query' }: BrandStripProps) {
  const items: NavItem[] = ['Query', 'Mempool', 'Research', 'News & Sentiment', 'Trading'];
  const node = useNodeStatus();

  const badgeText = node.status === 'live' ? 'LIVE' : node.status === 'syncing' ? 'SYNCING' : '—';
  const badgeClass =
    node.status === 'live'
      ? 'brand-strip__live-badge brand-strip__live-badge--live'
      : node.status === 'syncing'
        ? 'brand-strip__live-badge brand-strip__live-badge--syncing'
        : 'brand-strip__live-badge brand-strip__live-badge--unknown';

  const lagLabel =
    node.status === 'syncing' && node.blocksBehind != null
      ? ` · ${node.blocksBehind.toLocaleString()} blocks behind RETH`
      : '';

  return (
    <div className="brand-strip">
      <Link to="/" className="brand-strip__wordmark wordmark" aria-label="DSC Home">
        DSC
      </Link>
      <div className="brand-strip__divider" />
      <nav className="brand-strip__nav">
        {items.map((x) => {
          const path = NAV_TO_PATH[x];
          if (!path) {
            return (
              <span
                key={x}
                className="brand-strip__nav-link brand-strip__nav-link--todo"
                title="Coming soon"
                aria-disabled="true"
              >
                {x}
                <span className="brand-strip__nav-todo">TODO</span>
              </span>
            );
          }
          return (
            <Link
              key={x}
              to={path}
              className={`brand-strip__nav-link${x === activeNav ? ' brand-strip__nav-link--active' : ''}`}
            >
              {x}
            </Link>
          );
        })}
      </nav>
      <div className="brand-strip__right">
        <span
          className={badgeClass}
          title={`Local ingest ${formatBlock(node.localTip)} · RETH head ${formatBlock(node.globalTip)}${lagLabel}`}
        >
          {badgeText}
        </span>
        <span className="brand-strip__block">
          block {formatBlock(node.localTip)}
          {node.globalTip != null && (
            <>
              {' '}
              <span className="brand-strip__block-sep">/</span>{' '}
              <span className="brand-strip__block-global">{formatBlock(node.globalTip)}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
