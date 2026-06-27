/* ===========================================================================
   App — Stori Competitive Intelligence dashboard shell
   =========================================================================== */
const { useState, useEffect, useMemo, useRef } = React;

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.090 34" fill="none" style="height:26px;width:auto;display:block">
<path d="M 22.668 11.334 L 22.668 0 L 11.334 0 L 11.334 4.293 C 11.334 5.072 10.702 5.704 9.923 5.704 L 0 5.704 L 0 17 L 9.923 17 C 10.702 17 11.334 17.632 11.334 18.411 L 11.334 21.255 C 11.334 22.035 10.702 22.666 9.923 22.666 L 0 22.666 L 0 34 L 11.334 34 L 11.334 29.745 C 11.334 28.965 11.965 28.334 12.745 28.334 L 22.668 28.334 L 22.668 17 L 12.745 17 C 11.965 17 11.334 16.368 11.334 15.589 L 11.334 12.745 C 11.334 11.965 11.965 11.334 12.745 11.334 L 22.668 11.334 Z" fill="var(--stori-green)"/>
<path d="M 64.758 28.71 L 63.275 28.71 C 58.79 28.71 55.141 25.06 55.141 20.576 L 55.141 19.092 C 55.141 14.608 58.79 10.958 63.275 10.958 L 64.758 10.958 C 69.243 10.958 72.893 14.606 72.893 19.092 L 72.893 20.576 C 72.893 25.06 69.243 28.71 64.758 28.71 Z M 63.275 15.155 C 61.103 15.155 59.338 16.922 59.338 19.092 L 59.338 20.576 C 59.338 22.746 61.104 24.513 63.275 24.513 L 64.758 24.513 C 66.929 24.513 68.696 22.746 68.696 20.576 L 68.696 19.092 C 68.696 16.922 66.929 15.155 64.758 15.155 L 63.275 15.155 Z" fill="currentColor"/>
<path d="M 27.892 23.42 C 28.103 27.155 31.019 28.138 31.805 28.366 L 31.799 28.366 C 32.593 28.597 33.682 28.714 35.518 28.714 C 38.371 28.714 40.37 28.253 41.653 27.341 C 42.924 26.438 43.516 25.076 43.516 23.208 C 43.516 21.648 43.024 20.43 42.067 19.567 C 41.199 18.784 39.919 18.295 38.352 18.169 L 34.694 17.809 C 34.116 17.746 33.654 17.582 33.336 17.309 C 33.013 17.032 32.849 16.653 32.849 16.194 C 32.849 15.695 33.037 15.284 33.389 15.001 C 33.737 14.722 34.231 14.58 34.824 14.58 L 36.106 14.58 C 36.799 14.58 37.345 14.711 37.742 15.007 C 38.116 15.285 38.341 15.698 38.445 16.235 L 43.293 16.235 C 43.178 14.519 42.468 13.208 41.187 12.324 C 39.901 11.434 38.448 10.977 35.675 10.977 C 34.267 10.977 33.313 11.084 32.55 11.293 C 31.789 11.504 28.419 12.468 28.419 16.374 C 28.419 17.886 28.894 19.099 29.772 19.97 C 30.652 20.843 31.95 21.384 33.619 21.521 L 37.243 21.881 C 37.636 21.92 38.084 22.022 38.436 22.258 C 38.798 22.502 39.053 22.885 39.053 23.459 C 39.053 23.981 38.865 24.404 38.496 24.69 C 38.133 24.972 37.613 25.109 36.97 25.109 L 35.176 25.109 C 34.476 25.109 33.929 24.976 33.519 24.674 C 33.133 24.389 32.891 23.97 32.75 23.42 L 27.892 23.42 Z" fill="currentColor"/>
<path d="M 87.565 5.637 L 92.09 5.637 L 92.09 10.145 L 88.162 10.145 C 87.832 10.145 87.565 9.878 87.565 9.548 L 87.565 5.637 Z" fill="currentColor"/>
<path d="M 86.342 15.58 L 87.252 15.58 C 87.581 15.58 87.848 15.847 87.848 16.177 L 87.848 28.334 L 92.09 28.334 L 92.09 11.351 L 86.342 11.351 L 86.342 15.58 Z" fill="currentColor"/>
<path d="M 78.943 16.177 L 78.943 28.334 L 74.703 28.334 L 74.703 17.235 C 74.703 13.985 77.338 11.35 80.588 11.35 L 84.958 11.35 L 84.958 15.58 L 79.54 15.58 C 79.211 15.58 78.943 15.847 78.943 16.177 Z" fill="currentColor"/>
<path d="M 51.318 24.138 L 53.893 24.138 L 53.895 24.137 L 53.895 28.334 L 51.274 28.334 C 47.881 28.334 45.132 25.584 45.132 22.191 L 45.132 6.825 L 49.374 6.825 L 49.374 10.753 C 49.374 11.081 49.641 11.35 49.971 11.35 L 53.893 11.35 L 53.893 15.58 L 49.971 15.58 C 49.641 15.58 49.372 15.847 49.372 16.177 L 49.372 22.193 C 49.372 23.267 50.243 24.138 51.318 24.138 Z" fill="currentColor"/>
</svg>`;

const CHART_PEERS = ['stori', 'nu', 'klar', 'plata', 'didi', 'uala', 'revolut'];

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'metrics', label: 'Peer Metrics', icon: 'table' },
  { id: 'allmetrics', label: 'All Metric Trends', icon: 'line' },
  { id: 'products', label: 'Product Comparison', icon: 'table' },
  { id: 'funding', label: 'Capital Raised', icon: 'coins' },
  { id: 'debt', label: 'Debt Financings', icon: 'coins' },
  { id: 'capital', label: 'Capital Structure', icon: 'stack' },
];

function Icon({ name }) {
  const p = {
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    table: 'M3 4h18v16H3zM3 9h18M9 9v11M3 14h18',
    line: 'M3 17l5-6 4 3 7-9M3 21h18',
    bars: 'M4 20V10M10 20V4M16 20v-7M20 20V8M3 20h18',
    layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
    coins: 'M12 7c4 0 7-1.3 7-3S16 1 12 1 5 2.3 5 4s3 3 7 3zM5 4v6c0 1.7 3 3 7 3s7-1.3 7-3V4M5 10v6c0 1.7 3 3 7 3s7-1.3 7-3v-6',
    stack: 'M4 20V12M10 20V8M16 20v-5M20 20V4',
  }[name];
  const filled = name === 'grid';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={p} /></svg>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.v} className={'seg-btn' + (value === o.v ? ' active' : '')} onClick={() => onChange(o.v)}>{o.label}</button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button className={'toggle' + (on ? ' on' : '')} onClick={() => onChange(!on)}>
      <span className="toggle-track"><span className="toggle-knob" /></span>
      <span className="toggle-label">{label}</span>
    </button>
  );
}

function PeerChips({ peers, visible, onToggle, keys }) {
  return (
    <div className="peer-chips">
      {keys.map((k) => (
        <button key={k} className={'pchip' + (visible[k] ? '' : ' off')} onClick={() => onToggle(k)}>
          <span className="pchip-dot" style={{ background: peers[k].color }} />
          {peers[k].name}
        </button>
      ))}
    </div>
  );
}

function MonthRange({ months, range, onChange }) {
  return (
    <div className="mrange">
      <span className="mrange-lbl">Chart period</span>
      <select value={range[0]} onChange={(e) => onChange([Math.min(+e.target.value, range[1]), range[1]])}>
        {months.map((m, i) => <option key={i} value={i} disabled={i > range[1]}>{m}</option>)}
      </select>
      <span className="mrange-dash">→</span>
      <select value={range[1]} onChange={(e) => onChange([range[0], Math.max(+e.target.value, range[0])])}>
        {months.map((m, i) => <option key={i} value={i} disabled={i < range[0]}>{m}</option>)}
      </select>
    </div>
  );
}

function PeriodSelect({ months, value, onChange, label = 'As of' }) {
  return (
    <label className="period-select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(+e.target.value)}>
        {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
      </select>
    </label>
  );
}

function metricsAtPeriod(metrics, periodIndex) {
  return metrics.map((m) => {
    const vals = { ...m.vals };
    if (m.series) {
      Object.keys(m.series).forEach((peer) => {
        vals[peer] = m.series[peer]?.[periodIndex] ?? null;
      });
    }
    return { ...m, vals };
  });
}

function rangeGrowth(series, startIdx, endIdx) {
  const start = series?.[startIdx];
  const end = series?.[endIdx];
  if (start === null || start === undefined || end === null || end === undefined || start === 0) return null;
  return ((end / start) - 1) * 100;
}

function GrowthPanel({ data, peers, visible, months, range }) {
  const keys = CHART_PEERS.filter((k) => visible[k] && data.series && (k in data.series));
  const [startIdx, endIdx] = range;
  const periodLabel = months[startIdx] === months[endIdx] ? months[endIdx] : `${months[startIdx]} → ${months[endIdx]}`;
  return (
    <div className="yoy-panel">
      <div className="yoy-head">Selected-period Growth %</div>
      <div className="yoy-sub">{periodLabel}</div>
      <div className="yoy-list">
        {keys.map((k) => {
          const v = rangeGrowth(data.series[k], startIdx, endIdx);
          const dir = v === null ? null : v > 0 ? 'up' : 'down';
          return (
            <div className="yoy-row" key={k}>
              <span className="yoy-dot" style={{ background: peers[k].color }} />
              <span className="yoy-name">{peers[k].name}</span>
              <span className={'yoy-val ' + (dir || '')}>
                {v === null ? '—' : v.toFixed(1) + '%'}
                {dir === 'up' && <span className="arr">▲</span>}
                {dir === 'down' && <span className="arr">▼</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------- KPI CARDS --------------------------------- */
function KpiCards({ data, peers, order }) {
  const picks = data.map((m) => m.key);
  return (
    <div className="kpi-grid">
      {picks.map((key) => {
        const m = data.find((x) => x.key === key);
        const present = order.filter((k) => m.vals[k] !== null);
        const sorted = [...present].sort((a, b) => m.goodHigh ? m.vals[b] - m.vals[a] : m.vals[a] - m.vals[b]);
        const rank = sorted.indexOf('stori') + 1;
        const max = Math.max(...present.map((k) => Math.abs(m.vals[k])));
        return (
          <div className="kpi-card" key={key}>
            <div className="kpi-label">{m.label}</div>
            <div className="kpi-value">{fmtMetric(m.vals.stori, m.fmt)}</div>
            <div className={'kpi-rank' + (rank === 1 ? ' first' : '')}>
              {rank === 1 ? 'Best in class' : '#' + rank + ' of ' + present.length} <span className="kpi-rank-sub">vs peers</span>
            </div>
            <div className="kpi-bars">
              {sorted.slice(0, 5).map((k) => (
                <div className="kpi-bar-row" key={k}>
                  <span className="kpi-bar-name" style={{ color: k === 'stori' ? 'var(--stori-green-active)' : 'var(--app-text-soft)' }}>{peers[k].name}</span>
                  <span className="kpi-bar-track">
                    <span className="kpi-bar-fill" style={{ width: (Math.abs(m.vals[k]) / max * 100) + '%', background: peers[k].color, opacity: k === 'stori' ? 1 : 0.5 }} />
                  </span>
                  <span className="kpi-bar-val">{fmtMetric(m.vals[k], m.fmt)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------- TIME-SERIES SECTION ------------------------- */
function TrendSection({ ds, title, sub, defaultType, peers, months, visible, onToggle, theme, selectedEndPeriod = null }) {
  const defaultEnd = selectedEndPeriod ?? months.length - 1;
  const [type, setType] = useState(defaultType);
  const [labels, setLabels] = useState(true);
  const [range, setRange] = useState(() => [Math.max(0, defaultEnd - 11), defaultEnd]);
  useEffect(() => {
    if (selectedEndPeriod === null || selectedEndPeriod === undefined) return;
    setRange(([start]) => [Math.min(start, selectedEndPeriod), selectedEndPeriod]);
  }, [selectedEndPeriod]);
  const sliced = useMemo(() => {
    const labs = months.slice(range[0], range[1] + 1);
    const series = {};
    Object.keys(ds.series).forEach((k) => { series[k] = ds.series[k].slice(range[0], range[1] + 1); });
    return { labs, series };
  }, [range[0], range[1], ds]);

  const Chart = type === 'line' ? LineChart : ColumnChart;
  return (
    <div className="section-body">
      <div className="chart-toolbar">
        <MonthRange months={months} range={range} onChange={setRange} />
        <div className="ct-right">
          <Segmented value={type} onChange={setType} options={[{ v: 'line', label: 'Line' }, { v: 'bars', label: 'Columns' }]} />
          <Toggle on={labels} onChange={setLabels} label="Values" />
        </div>
      </div>
      <div className="chart-row">
        <div className="chart-card">
          <div className="chart-title-pill">{ds.title}</div>
          <PeerChips peers={peers} visible={visible} onToggle={onToggle} keys={CHART_PEERS} />
          <Chart data={{ series: sliced.series }} peers={peers} labels={sliced.labs} visible={visible} showLabels={labels} theme={theme} fmt={ds.fmt || 'num1'} />
        </div>
        <GrowthPanel data={ds} peers={peers} visible={visible} months={months} range={range} />
      </div>
    </div>
  );
}

function MetricTrendExplorer({ metrics, metricSeries, peers, months, visible, onToggle, theme, selectedPeriod }) {
  const available = metrics.filter((m) => metricSeries && metricSeries[m.key]);
  const [metricKey, setMetricKey] = useState(() => available[0]?.key || 'portfolio');
  const activeMetric = available.find((m) => m.key === metricKey) || available[0];
  const ds = activeMetric ? metricSeries[activeMetric.key] : null;
  if (!ds) return <div className="card">No generated metric series available.</div>;
  const defaultType = (activeMetric.chartType || ds.chartType) === 'bar' ? 'bars' : 'line';
  const allNull = Object.values(ds.series || {}).every((arr) => arr.every((v) => v === null || v === undefined));
  return (
    <>
      <div className="chart-toolbar">
        <div className="mrange">
          <span className="mrange-lbl">Metric</span>
          <select value={activeMetric.key} onChange={(e) => setMetricKey(e.target.value)}>
            {available.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </div>
      </div>
      <TrendSection key={activeMetric.key} ds={ds} defaultType={defaultType} peers={peers} months={months} visible={visible} onToggle={onToggle} theme={theme} selectedEndPeriod={selectedPeriod} />
      <p className="src-note"><strong>Chart:</strong> {(activeMetric.chartType || ds.chartType) === 'bar' ? 'Bar chart' : 'Line chart'} · <strong>Note:</strong> {ds.note}{allNull ? ' Not available from current validated source data.' : ''}</p>
    </>
  );
}

/* --------------------------- SECTION WRAPPER ----------------------------- */
function Section({ id, title, sub, children, registerRef }) {
  const ref = useRef(null);
  useEffect(() => { if (registerRef) registerRef(id, ref.current); }, []);
  return (
    <section id={'sec-' + id} ref={ref} className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

/* ================================ APP ==================================== */
function App() {
  const CI = window.CI;
  const [theme, setTheme] = useState(() => localStorage.getItem('ci_theme') || 'light');
  const [view, setView] = useState(() => localStorage.getItem('ci_view') || 'focus');
  const [active, setActive] = useState('overview');
  const [visible, setVisible] = useState(() => Object.fromEntries(CHART_PEERS.map((k) => [k, true])));
  const [highlightStori, setHighlightStori] = useState(true);
  const [heatmap, setHeatmap] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(() => Math.max(0, (window.CI?.MONTHS?.length || 1) - 1));
  const refs = useRef({});

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('ci_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('ci_view', view); }, [view]);

  const toggle = (k) => setVisible((v) => ({ ...v, [k]: !v[k] }));
  const registerRef = (id, el) => { refs.current[id] = el; };
  const scrollBody = useRef(null);

  function goTo(id) {
    setActive(id);
    if (view === 'continuous') {
      const el = refs.current[id];
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  // in continuous mode, update active nav on scroll
  useEffect(() => {
    if (view !== 'continuous') return;
    const onScroll = () => {
      let cur = NAV[0].id;
      for (const n of NAV) { const el = refs.current[n.id]; if (el && el.getBoundingClientRect().top - 110 <= 0) cur = n.id; }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll); onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [view]);

  const sectionsToShow = view === 'continuous' ? NAV.map((n) => n.id) : [active];
  const curMeta = NAV.find((n) => n.id === active);
  const selectedPeriodLabel = CI.MONTHS?.[selectedPeriod] || CI.REFRESH_STATUS?.latest_month_label || 'latest period';
  const selectedMetrics = useMemo(() => metricsAtPeriod(CI.METRICS, selectedPeriod), [CI.METRICS, selectedPeriod]);

  function renderSection(id) {
    switch (id) {
      case 'overview':
        const overviewMetrics = ['customers', 'gross_revenue', 'gross_profit', 'gross_margin', 'lending_portfolio', 'risk_adjusted_net_interest_margin', 'gross_roa', 'efficiency_ratio']
          .map((key) => selectedMetrics.find((m) => m.key === key))
          .filter(Boolean);
        return (
          <Section key={id} id={id} title="Overview" sub={`Stori vs. peer set — selected period ${selectedPeriodLabel}`} registerRef={registerRef}>
            <KpiCards data={overviewMetrics} peers={CI.PEERS} order={CI.METRIC_ORDER} />
            <div className="callout">
              <span className="callout-mark" />
              <div><strong>All 24 requested metrics are now available in All Metric Trends.</strong>{' '}
                Overview stays focused on a curated set of scale, revenue, profitability, lending and efficiency indicators.</div>
            </div>
          </Section>
        );
      case 'metrics':
        return (
          <Section key={id} id={id} title="Peer Metrics Comparison" sub={`Click any metric to rank peers · selected period ${selectedPeriodLabel}`} registerRef={registerRef}>
            <div className="chart-toolbar">
              <PeerChips peers={CI.PEERS} visible={visible} onToggle={toggle} keys={CI.METRIC_ORDER} />
              <div className="ct-right">
                <PeriodSelect months={CI.MONTHS} value={selectedPeriod} onChange={setSelectedPeriod} label="Table period" />
                <Toggle on={heatmap} onChange={setHeatmap} label="Heatmap" />
                <Toggle on={highlightStori} onChange={setHighlightStori} label="Highlight Stori" />
              </div>
            </div>
            <div className="card">
              <MetricsTable data={selectedMetrics} peers={CI.PEERS} order={CI.METRIC_ORDER}
                visible={visible} highlightStori={highlightStori} heatmap={heatmap} />
            </div>
            <p className="src-note"><strong>Note:</strong> Source: Company information and CNBV. Monthly SOFIPO data. Marketing efficiency = promotion &amp; advertising expense / gross revenues.</p>
          </Section>
        );
      case 'allmetrics':
        return (
          <Section key={id} id={id} title="All Metric Trends" sub="Interactive monthly trend view for all 24 requested dashboard metrics" registerRef={registerRef}>
            <MetricTrendExplorer metrics={CI.METRICS} metricSeries={CI.METRIC_SERIES || {}} peers={CI.PEERS} months={CI.MONTHS} visible={visible} onToggle={toggle} theme={theme} selectedPeriod={selectedPeriod} />
          </Section>
        );
      case 'arpoc':
        return (
          <Section key={id} id={id} title="Revenue per Customer (ARPOC)" sub="ARPOC rebounds; customer base still outpacing revenues YoY" registerRef={registerRef}>
            <TrendSection ds={CI.ARPOC} defaultType="line" peers={CI.PEERS} months={CI.MONTHS} visible={visible} onToggle={toggle} theme={theme} />
            <p className="src-note"><strong>Note:</strong> {CI.ARPOC.note}</p>
          </Section>
        );
      case 'gross':
        return (
          <Section key={id} id={id} title="Gross Profit" sub="Accelerating gross profit, supported by revenue growth and lower funding costs" registerRef={registerRef}>
            <TrendSection ds={CI.GROSS_PROFIT} defaultType="bars" peers={CI.PEERS} months={CI.MONTHS} visible={visible} onToggle={toggle} theme={theme} />
            <p className="src-note"><strong>Note:</strong> {CI.GROSS_PROFIT.note}</p>
          </Section>
        );
      case 'products':
        return (
          <Section key={id} id={id} title="Product Comparison" sub="Feature coverage and product-level terms across Mexican fintech peers" registerRef={registerRef}>
            <div className="product-stack">
              <div className="card product-card">
                <div className="product-card-head">Product Offering Comparison</div>
                <ProductMatrixTable cols={CI.PRODUCT_OFFERING_COLS} rows={CI.PRODUCT_OFFERING_ROWS} />
              </div>
              <div className="card product-card">
                <div className="product-card-head">Credit Card Product Comparison</div>
                <ProductMatrixTable cols={CI.CREDIT_CARD_COLS} rows={CI.CREDIT_CARD_ROWS} compact />
              </div>
              <div className="card product-card">
                <div className="product-card-head">Deposit Product Comparison</div>
                <DepositTable cols={CI.DEPOSIT_COLS} rows={CI.DEPOSIT_ROWS} theme={theme} />
              </div>
              <div className="card product-card">
                <div className="product-card-head">Personal Loans Product Comparison</div>
                <ProductMatrixTable cols={CI.PERSONAL_LOAN_COLS} rows={CI.PERSONAL_LOAN_ROWS} compact />
              </div>
            </div>
            <p className="src-note"><strong>Note:</strong> Product data transcribed from provided source slides; text-heavy cells are preserved as shown where legible.</p>
          </Section>
        );
      case 'funding':
        return (
          <Section key={id} id={id} title="Capital Raised" sub="Recent peer rounds principally led by existing investors and strategics" registerRef={registerRef}>
            <div className="card"><FundingTable rows={CI.FUNDING} peers={CI.PEERS} /></div>
          </Section>
        );
      case 'debt':
        return (
          <Section key={id} id={id} title="Recent Peer Debt Financings" sub="Debt transactions by Klar and Plata from the provided source slide" registerRef={registerRef}>
            <div className="card"><DebtFinancingTable rows={CI.PEER_DEBT_FINANCINGS} peers={CI.PEERS} /></div>
          </Section>
        );
      case 'capital':
        return (
          <Section key={id} id={id} title="Capital Structure" sub={CI.CAP_STRUCTURE.title} registerRef={registerRef}>
            <div className="card cap-card">
              <div className="cap-legend">
                {CI.CAP_STRUCTURE.layers.map((l) => (
                  <span key={l.key} className="cap-leg-item"><span className="cap-leg-dot" style={{ background: theme === 'dark' && l.darkColor ? l.darkColor : l.color }} />{l.label}</span>
                ))}
                {CI.CAP_STRUCTURE.illustrative && <span className="illus-tag">Illustrative</span>}
              </div>
              <StackedColumnChart data={CI.CAP_STRUCTURE} theme={theme} />
            </div>
            <p className="src-note"><strong>Note:</strong> {CI.CAP_STRUCTURE.note}</p>
          </Section>
        );
      default: return null;
    }
  }

  return (
    <div className={'app view-' + view}>
      <aside className="rail">
        <div className="rail-logo" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
        <div className="rail-tag">Competitive Intelligence</div>
        <nav className="rail-nav">
          {NAV.map((n) => (
            <button key={n.id} className={'rail-item' + (active === n.id ? ' active' : '')} onClick={() => goTo(n.id)}>
              <Icon name={n.icon} /><span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="rail-foot">Confidential</div>
      </aside>

      <div className="content">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{view === 'continuous' ? 'Competitive Dashboard' : curMeta.label}</h1>
            <span className="period-pill">As of {selectedPeriodLabel}</span>
          </div>
          <div className="topbar-controls">
            <PeriodSelect months={CI.MONTHS} value={selectedPeriod} onChange={setSelectedPeriod} />
            <Segmented value={view} onChange={setView} options={[{ v: 'focus', label: 'Focus' }, { v: 'continuous', label: 'Continuous' }]} />
            <Segmented value={theme} onChange={setTheme} options={[{ v: 'light', label: 'Light' }, { v: 'dark', label: 'Dark' }]} />
            <button className="export-btn" onClick={() => window.print()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3" /></svg>
              Export PDF
            </button>
          </div>
        </header>
        <main className="scroll-body" ref={scrollBody}>
          <div className="page">
            {sectionsToShow.map((id) => renderSection(id))}
          </div>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
