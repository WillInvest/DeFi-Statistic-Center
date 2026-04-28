type StatusBarProps = {
  block?: string;
  latency?: string;
  node?: string;
  user?: string;
};

export function StatusBar({
  block = '19,482,901',
  latency = '142 ms',
  node = 'reth.local · synced',
  user = 'jsmith@stevens.edu',
}: StatusBarProps) {
  return (
    <div className="status-bar">
      <span className="status-bar__item status-bar__item--node">
        <span className="status-bar__dot" />
        {node}
      </span>
      <span className="status-bar__sep">·</span>
      <span className="status-bar__item">block {block}</span>
      <span className="status-bar__sep">·</span>
      <span className="status-bar__item">last query {latency}</span>
      <span className="status-bar__right">{user}</span>
      <span className="status-bar__sep">·</span>
      <span className="status-bar__motto">Per Aspera Ad Astra</span>
    </div>
  );
}
