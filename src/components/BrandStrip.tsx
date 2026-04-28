import { Link } from 'react-router-dom';

type NavItem = 'Query' | 'Mempool' | 'Saved' | 'Docs';

type BrandStripProps = {
  activeNav?: NavItem;
  block?: string;
};

const NAV_TO_PATH: Record<NavItem, string> = {
  Query: '/workbench',
  Mempool: '/mempool',
  Saved: '/workbench',
  Docs: '/workbench',
};

export function BrandStrip({ activeNav = 'Query', block = '19,482,901' }: BrandStripProps) {
  const items: NavItem[] = ['Query', 'Mempool', 'Saved', 'Docs'];
  return (
    <div className="brand-strip">
      <Link to="/" className="brand-strip__wordmark wordmark" aria-label="DSC Home">
        DSC
      </Link>
      <div className="brand-strip__divider" />
      <nav className="brand-strip__nav">
        {items.map((x) => (
          <Link
            key={x}
            to={NAV_TO_PATH[x]}
            className={`brand-strip__nav-link${x === activeNav ? ' brand-strip__nav-link--active' : ''}`}
          >
            {x}
          </Link>
        ))}
      </nav>
      <div className="brand-strip__right">
        <span className="brand-strip__live-badge">LIVE</span>
        <span className="brand-strip__block">block {block}</span>
        <div className="brand-strip__avatar">JS</div>
      </div>
    </div>
  );
}
