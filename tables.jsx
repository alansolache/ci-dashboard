/* ===========================================================================
   Tables — MetricsTable (sortable matrix), DepositTable, FundingTable
   JSX. Exports to window.
   =========================================================================== */
const { useState: _useStateT, useMemo: _useMemoT } = React;

function fmtMetric(v, fmt) {
  if (v === null || v === undefined) return 'n.a.';
  switch (fmt) {
    case 'money': return '$' + v;
    case 'money_m': return '$' + v.toLocaleString() + 'm';
    case 'money_signed': return v < 0 ? '$(' + Math.abs(v) + ')M' : '$' + v + 'M';
    case 'pct1': return v.toFixed(1) + '%';
    case 'pct0': return v + '%';
    default: return '' + v;
  }
}

/* small caret used in sortable headers */
function SortCaret({ dir }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: dir ? 1 : 0.25, transition: 'transform .15s' }}>
      <path d="M5 1.5L8.5 6.5H1.5z" fill="currentColor" transform={dir === 'asc' ? '' : 'rotate(180 5 5)'} />
    </svg>
  );
}

function PeerDot({ k, peers }) {
  return <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 9, background: peers[k].color, marginRight: 7, verticalAlign: 'middle' }} />;
}

/* ============================ METRICS MATRIX ============================== */
function MetricsTable({ data, peers, order, visible, highlightStori, heatmap }) {
  const [sortKey, setSortKey] = _useStateT(null);
  const cols = order.filter((k) => visible[k]);

  const orderedCols = _useMemoT(() => {
    if (!sortKey) return cols;
    const row = data.find((m) => m.key === sortKey);
    const factor = row.goodHigh ? -1 : 1;
    return [...cols].sort((a, b) => {
      const va = row.vals[a], vb = row.vals[b];
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return (va - vb) * factor;
    });
  }, [sortKey, cols.join(','), data]);

  // heatmap: per-row, color cell by rank among present values
  function cellStyle(row, k) {
    const isStori = k === 'stori';
    const base = {};
    if (heatmap) {
      const vals = cols.map((c) => row.vals[c]).filter((v) => v !== null);
      const v = row.vals[k];
      if (v !== null && vals.length > 1) {
        const min = Math.min(...vals), max = Math.max(...vals);
        const t = max === min ? 0.5 : (v - min) / (max - min);
        const score = row.goodHigh ? t : 1 - t;
        // green for good, soft red for bad
        if (score >= 0.5) base.background = `rgba(0,209,128,${0.10 + (score - 0.5) * 0.5})`;
        else base.background = `rgba(255,102,102,${0.10 + (0.5 - score) * 0.45})`;
      }
    }
    return base;
  }

  function leaderFor(row) {
    const present = cols.filter((c) => row.vals[c] !== null);
    if (!present.length) return null;
    return present.reduce((best, c) => {
      const better = row.goodHigh ? row.vals[c] > row.vals[best] : row.vals[c] < row.vals[best];
      return better ? c : best;
    }, present[0]);
  }

  return (
    <div className="tbl-wrap">
      <table className="ci-table metrics-table">
        <thead>
          <tr>
            <th className="rowhead-th"></th>
            {orderedCols.map((k) => (
              <th key={k} className={(highlightStori && k === 'stori') ? 'col-stori' : ''}>
                <span className="peer-h"><PeerDot k={k} peers={peers} />{peers[k].name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const leader = leaderFor(row);
            const active = sortKey === row.key;
            return (
              <tr key={row.key}>
                <td className={'rowhead' + (active ? ' rowhead-active' : '')}
                  onClick={() => setSortKey(active ? null : row.key)} title="Sort peers by this metric">
                  <span className="rowhead-inner">{row.label}<SortCaret dir={active ? 'desc' : null} /></span>
                </td>
                {orderedCols.map((k) => {
                  const v = row.vals[k];
                  const neg = v !== null && v < 0;
                  return (
                    <td key={k} style={cellStyle(row, k)}
                      className={[(highlightStori && k === 'stori') ? 'col-stori' : '', neg ? 'neg' : '', (!heatmap && leader === k) ? 'leader' : ''].join(' ')}>
                      {fmtMetric(v, row.fmt)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ============================ CHECK / X ICONS ============================= */
function CheckIcon({ ok }) {
  return (
    <span className={'bool-chip ' + (ok ? 'ok' : 'no')}>
      {ok ? (
        <svg width="14" height="14" viewBox="0 0 16 16"><path d="M6.5 11.2L3.3 8l1.1-1.1 2.1 2.1 4.9-4.9L12.6 5z" fill="#fff" /></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 16 16"><path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z" fill="#fff" stroke="#fff" strokeWidth="0.8" /></svg>
      )}
    </span>
  );
}

/* ============================ DEPOSIT TABLE =============================== */
function DepositTable({ cols, rows, theme }) {
  const [hoverRow, setHoverRow] = _useStateT(null);
  return (
    <div className="tbl-wrap">
      <table className="ci-table deposit-table">
        <thead>
          <tr>
            <th className="rowhead-th"></th>
            {cols.map((c) => (
              <th key={c.key} className={c.stori ? 'col-stori-head' : ''}>{c.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={hoverRow === ri ? 'row-hover' : ''}
              onMouseEnter={() => setHoverRow(ri)} onMouseLeave={() => setHoverRow(null)}>
              <td className="rowhead rowhead-plain">{row.label}</td>
              {row.vals.map((v, ci) => (
                <td key={ci} className={cols[ci].stori ? 'col-stori' : ''}>
                  {row.type === 'bool'
                    ? <CheckIcon ok={!!v} />
                    : (v === null ? <span className="na">n.a.</span> : v.toFixed(2) + '%')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================ FUNDING TABLE =============================== */
function FundingTable({ rows, peers }) {
  // group consecutive rows by company
  const groups = [];
  rows.forEach((r) => {
    const last = groups[groups.length - 1];
    if (last && last.company === r.company) last.items.push(r);
    else groups.push({ company: r.company, items: [r] });
  });
  const peerKey = (name) => ({ Klar: 'klar', Plata: 'plata', Uala: 'uala' }[name]);

  return (
    <div className="tbl-wrap">
      <table className="ci-table funding-table">
        <thead>
          <tr>
            <th>Round</th><th>Date</th><th>Amount Raised</th><th>Valuation</th><th>Lead Investor</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, gi) => (
            <React.Fragment key={gi}>
              <tr className="group-row">
                <td colSpan={6}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 10, background: peers[peerKey(g.company)] ? peers[peerKey(g.company)].color : 'var(--stori-green-active)' }} />
                    {g.company}
                  </span>
                </td>
              </tr>
              {g.items.map((it, ii) => (
                <tr key={ii} className="fund-row">
                  <td className="fund-round">
                    <strong>{it.round}</strong>
                    {it.sub && <em>{it.sub}</em>}
                  </td>
                  <td className="ml">{it.date}</td>
                  <td className="ml mono">{it.amount}</td>
                  <td className="mono">{it.valuation}</td>
                  <td className="ml">{it.lead}</td>
                  <td className="ml notes">{it.notes}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { MetricsTable, DepositTable, FundingTable, fmtMetric });
