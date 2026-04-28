import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

type NavItem = 'Workbench' | 'Mempool' | 'Saved' | 'Docs';

type BrandStripProps = {
  activeNav?: NavItem;
  block?: string;
};

// TODO: Saved + Docs route to /workbench placeholder until those pages exist.
const NAV_TO_PATH: Record<NavItem, string> = {
  Workbench: '/workbench',
  Mempool: '/mempool',
  Saved: '/workbench',
  Docs: '/workbench',
};

export function BrandStrip({ activeNav = 'Workbench', block = '19,482,901' }: BrandStripProps) {
  const items: NavItem[] = ['Workbench', 'Mempool', 'Saved', 'Docs'];
  return (
    <div
      style={{
        height: 56,
        background: '#A32638',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 20,
        borderBottom: '1px solid #000',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <Link
        to="/"
        className="wordmark"
        style={{
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          fontSize: 18,
          flexShrink: 0,
          textDecoration: 'none',
        }}
      >
        DSC
      </Link>
      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.30)', flexShrink: 0 }} />
      <nav style={{ display: 'flex', gap: 18, whiteSpace: 'nowrap', flexShrink: 0 }}>
        {items.map((x) => {
          const linkStyle: CSSProperties = {
            fontFamily: 'var(--font-display)',
            fontWeight: x === activeNav ? 700 : 600,
            fontSize: 13,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: x === activeNav ? '#fff' : 'rgba(255,255,255,0.75)',
            borderBottom: x === activeNav ? '2px solid #FFFFFF' : '2px solid transparent',
            paddingBottom: 2,
            cursor: 'pointer',
            textDecoration: 'none',
          };
          return (
            <Link key={x} to={NAV_TO_PATH[x]} style={linkStyle}>
              {x}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span className="badge" style={{ background: '#FFFFFF', color: '#A32638', borderColor: 'transparent' }}>
          LIVE
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
          block {block}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            background: '#FFFFFF',
            color: '#A32638',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          JS
        </div>
      </div>
    </div>
  );
}
