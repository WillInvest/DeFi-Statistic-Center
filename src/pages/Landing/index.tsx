import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const HERO_VIDEO =
  'https://assets.stevens.edu/mviowpldu823/5LkHIMp8z2Rumo4A44zg1r/d478cdc681558a3bd48185988224ad39/Home_Page_F24_v4.mp4';

/**
 * Interactive demo (Arcade, Supademo, etc.): paste the iframe `src` from their Share → Embed flow.
 * Build with e.g. `VITE_AGENTIC_DEMO_EMBED_URL=https://demo.arcade.software/...` (see `public/README-demo-video.md`).
 */
const DEMO_EMBED_URL = (import.meta.env.VITE_AGENTIC_DEMO_EMBED_URL as string | undefined)?.trim() ?? '';

/**
 * Self-hosted product demo (optional, used when `DEMO_EMBED_URL` is empty). Add under `web/public/`.
 * Optional poster: `demo-agentic-query-poster.jpg`. See `public/README-demo-video.md`.
 */
const DEMO_VIDEO_MP4 = '/demo-agentic-query.mp4';
const DEMO_VIDEO_POSTER = '/demo-agentic-query-poster.jpg';

const STATS = [
  { value: '14', label: 'Chains indexed', sub: 'L1 + L2' },
  { value: '2.1B+', label: 'Transactions', sub: 'and counting' },
  { value: '<200ms', label: 'Median query', sub: 'p50 latency' },
  { value: '100%', label: 'Open data', sub: 'no API keys' },
];

const AGENTIC_BENEFITS = [
  {
    title: 'Natural language → SQL',
    desc: 'Describe the slice of on-chain data you care about; the assistant drafts runnable SQL you can edit before you execute.',
  },
  {
    title: 'Schema-aware context',
    desc: 'Suggestions are grounded in DSC’s normalized tables—fewer hallucinated column names, faster iteration than starting from a blank editor.',
  },
  {
    title: 'You stay in control',
    desc: 'Review every statement in the console. Save, permalink, and export results the same way as hand-written queries.',
  },
];

const FEATURES = [
  {
    num: '01',
    title: 'Agentic + SQL console',
    desc: 'Pair conversational exploration with a full SQL editor and visual builder—swap, lending, and liquidity events across major protocols, queryable in one place.',
    link: '/workbench',
  },
  {
    num: '02',
    title: 'Live Mempool',
    desc: 'Watch Ethereum transactions before they confirm. Fee distribution heatmaps, real-time gas tracking, and tx-type filtering powered by a local RETH node. Built for MEV research and gas-market analysis.',
    link: '/mempool',
  },
  {
    num: '03',
    title: 'Reproducible Research',
    desc: 'Save queries, share permalinks, and export to CSV or Parquet. Every result is timestamped to a block number so analyses are reproducible across sessions.',
    link: '/workbench',
  },
];

const PROTOCOLS = [
  'Uniswap v3', 'Curve', 'Balancer', 'Aave v3',
  'Compound', 'Maker', 'Lido', 'Rocket Pool',
  'Yearn', 'Convex', 'Frax', 'Euler',
];

function AgenticDemoEmbed() {
  return (
    <figure className="agentic-demo" id="demo">
      <div className="agentic-demo__frame">
        <div className="agentic-demo__chrome" aria-hidden="true">
          <span className="agentic-demo__dot" />
          <span className="agentic-demo__dot" />
          <span className="agentic-demo__dot" />
          <span className="agentic-demo__chrome-title">DSC Query · Interactive walkthrough</span>
        </div>
        <div className="agentic-demo__ratio agentic-demo__ratio--embed">
          <iframe
            className="agentic-demo__iframe"
            src={DEMO_EMBED_URL}
            title="DSC agentic query — interactive demo"
            loading="lazy"
            allow="clipboard-write; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
      <DemoHighlights />
    </figure>
  );
}

function DemoHighlights() {
  return (
    <figcaption className="agentic-demo__caption">
      <span>Ask in plain English</span>
      <span>Inspect generated SQL</span>
      <span>Run and export results</span>
    </figcaption>
  );
}

function AgenticDemoVideo() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  if (DEMO_EMBED_URL) {
    return <AgenticDemoEmbed />;
  }

  return (
    <figure className="agentic-demo" id="demo">
      <div className="agentic-demo__frame">
        <div className="agentic-demo__chrome" aria-hidden="true">
          <span className="agentic-demo__dot" />
          <span className="agentic-demo__dot" />
          <span className="agentic-demo__dot" />
          <span className="agentic-demo__chrome-title">DSC Query · Agentic walkthrough</span>
        </div>
        <div className="agentic-demo__ratio">
          {status !== 'ready' && (
            <div
              className={`agentic-demo__placeholder${status === 'loading' ? ' agentic-demo__placeholder--loading' : ''}`}
            >
              <div className="agentic-demo__placeholder-inner">
                <div className="agentic-demo__play-ring" aria-hidden="true">
                  <svg className="agentic-demo__play-icon" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="9,6 20,12 9,18" />
                  </svg>
                </div>
                <span className="agentic-demo__cta-pill">Product walkthrough</span>
                <p className="agentic-demo__placeholder-lead">
                  {status === 'loading'
                    ? 'Loading the agentic query demo…'
                    : 'Demo video is temporarily unavailable.'}
                </p>
                <p className="agentic-demo__placeholder-hint">
                  Watch how DSC turns a research question into schema-aware SQL and reproducible results.
                </p>
              </div>
            </div>
          )}
          <video
            className={`agentic-demo__video${status === 'ready' ? ' agentic-demo__video--visible' : ''}${status === 'error' ? ' agentic-demo__video--gone' : ''}`}
            controls
            playsInline
            preload="metadata"
            poster={DEMO_VIDEO_POSTER}
            onLoadedData={() => setStatus('ready')}
            onError={() => setStatus('error')}
            aria-label="DSC agentic query product demo"
          >
            <source src={DEMO_VIDEO_MP4} type="video/mp4" />
          </video>
        </div>
        <div className="agentic-demo__status" aria-hidden="true">
          <span className={`agentic-demo__status-pill${status === 'ready' ? ' agentic-demo__status-pill--ready' : ''}`}>
            {status === 'ready' ? 'Demo ready' : status === 'loading' ? 'Loading demo' : 'Fallback shown'}
          </span>
          <span className="agentic-demo__status-copy">No signup. No wallet. Just queryable research data.</span>
        </div>
      </div>
      <DemoHighlights />
    </figure>
  );
}

export function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const src = document.createElement('source');
    src.type = 'video/mp4';
    src.src = HERO_VIDEO;
    v.appendChild(src);
    v.load();
    v.play().catch(() => {});
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div className="landing">
      <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
        {/* Top utility strip — charcoal, thin, like stevens.edu */}
        <div className="topbar-utility">
          <div className="topbar-utility__inner">
            <span className="topbar-utility__name">Stevens Institute of Technology</span>
            <span className="topbar-utility__spacer" />
            <a className="topbar-utility__link" href="https://www.stevens.edu" target="_blank" rel="noopener">stevens.edu</a>
          </div>
        </div>
        {/* Main bar — white, with the Stevens flag hanging down on the left */}
        <div className="topbar-main">
          <div className="topbar-inner">
            <Link to="/" className="brand" aria-label="DSC Home">
              <span className="brand-flag-wrap" aria-hidden="true">
                <img
                  src="/stevens-flag.svg"
                  alt="Stevens Institute of Technology"
                  className="brand-flag"
                  draggable={false}
                />
              </span>
              <div className="brand-text">
                <span className="b1">DeFi Statistics Center</span>
                <span className="b2">Open data for academic research</span>
              </div>
            </Link>
            <nav className="nav" aria-label="Primary">
              <Link to="/workbench">Query</Link>
              <Link to="/mempool">Mempool</Link>
              <a href="#research">Research</a>
              <Link to="/workbench" className="nav-cta">Open Console</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-poster" aria-hidden="true" />
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        <div className="hero-content hero-content--centered">
          <h1 className="hero-title">
            DeFi Statistics Center
          </h1>

          <p className="hero-tagline">
            <span className="accent">Agentic Queries</span>
            <span className="for"> for the </span>
            programmable economy.
          </p>

          <p className="hero-sub">Open data for academic research</p>
          <p className="hero-attribution">— Stevens Institute of Technology —</p>

          <div className="hero-ctas" role="group" aria-label="Primary actions">
            <Link to="/workbench" className="cta-btn">
              <span className="cta-num">/ 01</span>
              <span className="cta-label">Try agentic query</span>
              <span className="cta-desc">Natural language in the Query console</span>
              <span className="cta-arrow">→</span>
            </Link>
            <Link to="/workbench" className="cta-btn">
              <span className="cta-num">/ 02</span>
              <span className="cta-label">SQL &amp; builder</span>
              <span className="cta-desc">Raw SQL and visual query builder</span>
              <span className="cta-arrow">→</span>
            </Link>
            <Link to="/mempool" className="cta-btn">
              <span className="cta-num">/ 03</span>
              <span className="cta-label">Live Mempool</span>
              <span className="cta-desc">Watch transactions before they confirm</span>
              <span className="cta-arrow">→</span>
            </Link>
            <a href="#demo" className="cta-btn">
              <span className="cta-num">/ 04</span>
              <span className="cta-label">Watch demo</span>
              <span className="cta-desc">Recorded agentic query walkthrough</span>
              <span className="cta-arrow">→</span>
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="ticker tabular">
            <span className="pos">
              ETH<b>$3,842<span style={{ color: 'var(--pos)' }}>+1.24%</span></b>
            </span>
            <span className="neg">
              BTC<b>$67,219<span style={{ color: '#E25A6E' }}>−0.61%</span></b>
            </span>
            <span>GAS<b>22 gwei</b></span>
            <span>BLOCK<b>20,418,772</b></span>
            <span>TPS<b>14.8</b></span>
          </div>
          <div className="video-controls">
            <span style={{ marginRight: 8 }}>Hero reel · Stevens</span>
            <button
              className="play-pause-btn"
              onClick={togglePlay}
              aria-label={paused ? 'Play video' : 'Pause video'}
              type="button"
            >
              {paused ? (
                <svg viewBox="0 0 12 12">
                  <polygon points="2,1 11,6 2,11" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12">
                  <rect x="2" y="1" width="3" height="10" />
                  <rect x="7" y="1" width="3" height="10" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="stats-bar">
        {STATS.map((s) => (
          <div key={s.label} className="stats-bar__item">
            <div className="stats-bar__value">{s.value}</div>
            <div className="stats-bar__label">{s.label}</div>
            <div className="stats-bar__sub">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ── Agentic query + demo video ── */}
      <section className="agentic" id="agentic" aria-labelledby="agentic-heading">
        <div className="agentic__inner">
          <div className="agentic__header">
            <div className="agentic__eyebrow">Agentic query</div>
            <h2 className="agentic__title" id="agentic-heading">
              From question to SQL—without losing the paper trail.
            </h2>
            <p className="agentic__subtitle">
              The assistant proposes statements grounded in DSC’s published schema. You review,
              refine, and run—so exploration stays fast without giving up transparency or academic
              rigor.
            </p>
          </div>

          <ul className="agentic__benefits">
            {AGENTIC_BENEFITS.map((b) => (
              <li key={b.title} className="agentic__benefit">
                <h3 className="agentic__benefit-title">{b.title}</h3>
                <p className="agentic__benefit-desc">{b.desc}</p>
              </li>
            ))}
          </ul>

          <AgenticDemoVideo />

          <div className="agentic__footer-cta">
            <Link to="/workbench" className="btn btn-primary btn-lg">
              Open the console
            </Link>
            <a href="#research" className="btn btn-ghost btn-lg">
              Platform overview
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features" id="research">
        <div className="features__inner">
          <div className="features__header">
            <div className="features__eyebrow">Platform</div>
            <h2 className="features__title">Built for the academic community.</h2>
            <p className="features__subtitle">
              DSC is a data-exploration console for students, faculty, and visiting researchers
              studying decentralized finance — structured, queryable on-chain data, paired with
              an agentic assistant that drafts SQL grounded in a published schema.
            </p>
          </div>

          <div className="features__grid">
            {FEATURES.map((f) => (
              <Link key={f.num} to={f.link} className="feature-card">
                <span className="feature-card__num">/ {f.num}</span>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
                <span className="feature-card__link">
                  Explore <span className="feature-card__arrow">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Protocols / Data ── */}
      <section className="protocols" id="data">
        <div className="protocols__inner">
          <div className="protocols__eyebrow">Coverage</div>
          <h2 className="protocols__title">12 protocols. 14 chains. Growing.</h2>
          <p className="protocols__desc">
            Indexed, normalized, and queryable via SQL. Each protocol's events
            are decoded into typed tables — no raw log parsing required.
          </p>
          <div className="protocols__grid">
            {PROTOCOLS.map((p) => (
              <div key={p} className="protocol-tag">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / CTA ── */}
      <section className="about" id="about">
        <div className="about__inner">
          <div className="about__main">
            <div className="about__eyebrow">Stevens Institute of Technology</div>
            <h2 className="about__title">
              Open infrastructure for <span className="about__accent">on-chain</span> research.
            </h2>
            <p className="about__desc">
              DSC is an internal research tool developed at Stevens' School of Business.
              Free for students, faculty, and academic collaborators.
              All data is open — no API keys, no rate limits.
            </p>
            <div className="about__ctas">
              <Link to="/workbench" className="btn btn-primary btn-lg">Open Console</Link>
              <a href="https://www.stevens.edu" className="btn btn-ghost btn-lg" target="_blank" rel="noopener">
                Stevens.edu
              </a>
            </div>
          </div>
          <div className="about__visual">
            <span className="about__coin-wrap">
              <img
                src="/dsc-logo.png"
                alt="DSC"
                className="about__coin"
                draggable={false}
              />
              <span className="about__coin-shine" aria-hidden="true" />
              <span className="about__coin-sparkles" aria-hidden="true">
                <span className="spk spk--1" />
                <span className="spk spk--2" />
                <span className="spk spk--3" />
                <span className="spk spk--4" />
                <span className="spk spk--5" />
                <span className="spk spk--6" />
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <span className="site-footer__wordmark">DSC</span>
            <span className="site-footer__sub">DeFi Statistics Center</span>
          </div>
          <div className="site-footer__links">
            <Link to="/workbench">Query</Link>
            <a href="#demo">Demo</a>
            <Link to="/mempool">Mempool</Link>
            <a href="https://www.stevens.edu" target="_blank" rel="noopener">Stevens.edu</a>
          </div>
          <div className="site-footer__motto">Per Aspera Ad Astra</div>
        </div>
      </footer>
    </div>
  );
}
