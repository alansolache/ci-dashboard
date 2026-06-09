/* ===========================================================================
   Charts — custom SVG, brand-styled. Vanilla-React (no JSX deps beyond React).
   Exports to window: useMeasure, niceScale, LineChart, ColumnChart, StackedColumnChart
   =========================================================================== */
const { useState: _useState, useRef: _useRef, useEffect: _useEffect, useMemo: _useMemo } = React;

/* measure a container's pixel width so SVG text stays crisp */
function useMeasure() {
  const ref = _useRef(null);
  const [w, setW] = _useState(0);
  _useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.round(e.contentRect.width));
    });
    ro.observe(ref.current);
    setW(Math.round(ref.current.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/* compute a "nice" axis scale that always includes 0 when data crosses it */
function niceScale(min, max, maxTicks = 5) {
  if (min === max) { min -= 1; max += 1; }
  if (min > 0) min = 0;
  if (max < 0) max = 0;
  const range = niceNum(max - min, false);
  const step = niceNum(range / (maxTicks - 1), true);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = niceMin; v <= niceMax + step * 0.001; v += step) ticks.push(Math.round(v * 100) / 100);
  return { min: niceMin, max: niceMax, step, ticks };
}
function niceNum(range, round) {
  const exp = Math.floor(Math.log10(range));
  const frac = range / Math.pow(10, exp);
  let nf;
  if (round) nf = frac < 1.5 ? 1 : frac < 3 ? 2 : frac < 7 ? 5 : 10;
  else nf = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return nf * Math.pow(10, exp);
}

function fmtVal(v, kind) {
  if (v === null || v === undefined) return 'n.a.';
  if (kind === 'money') return '$' + v;
  if (kind === 'money_m') return '$' + v.toLocaleString() + 'm';
  if (kind === 'pct') return v + '%';
  return (Math.round(v * 10) / 10).toFixed(1);
}

/* ============================ LINE CHART ================================== */
function LineChart({ data, peers, labels, visible, showLabels, theme }) {
  const [ref, W] = useMeasure();
  const [hover, setHover] = _useState(null); // index
  const H = 460;
  const padL = 16, padR = 16, padT = 40, padB = 56;
  const keys = Object.keys(data.series).filter((k) => visible[k]);

  const flat = [];
  keys.forEach((k) => data.series[k].forEach((v) => { if (v !== null) flat.push(v); }));
  const sc = niceScale(Math.min(...flat, 0), Math.max(...flat, 1), 6);

  if (!W) return React.createElement('div', { ref, style: { width: '100%', height: H } });
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = labels.length;
  const x = (i) => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v) => padT + (1 - (v - sc.min) / (sc.max - sc.min)) * plotH;
  const gridCol = theme === 'dark' ? 'rgba(255,255,255,.10)' : 'rgba(22,22,22,.07)';
  const axisCol = theme === 'dark' ? 'rgba(255,255,255,.55)' : 'var(--ink-47)';

  const els = [];
  // gridlines + y labels
  sc.ticks.forEach((t, i) => {
    els.push(React.createElement('line', { key: 'g' + i, x1: padL, x2: padL + plotW, y1: y(t), y2: y(t),
      stroke: t === 0 ? (theme === 'dark' ? 'rgba(255,255,255,.28)' : 'rgba(22,22,22,.22)') : gridCol, strokeWidth: 1 }));
  });
  // x baseline labels
  labels.forEach((lab, i) => {
    const parts = lab.split(' ');
    els.push(React.createElement('text', { key: 'x' + i, x: x(i), y: H - padB + 22, textAnchor: 'middle',
      fontSize: 13, fontWeight: 700, fill: axisCol }, parts[0]));
    if (parts[1]) els.push(React.createElement('text', { key: 'xy' + i, x: x(i), y: H - padB + 38, textAnchor: 'middle',
      fontSize: 12, fontWeight: 600, fill: theme === 'dark' ? 'rgba(255,255,255,.4)' : 'var(--ink-30)' }, parts[1]));
  });
  // hover guide
  if (hover !== null) {
    els.push(React.createElement('line', { key: 'hg', x1: x(hover), x2: x(hover), y1: padT, y2: padT + plotH,
      stroke: theme === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(22,22,22,.25)', strokeWidth: 1, strokeDasharray: '4 4' }));
  }
  // lines + points
  keys.forEach((k) => {
    const col = peers[k].color;
    const pts = data.series[k].map((v, i) => (v === null ? null : [x(i), y(v)]));
    // build path across gaps
    let d = '', pen = false;
    pts.forEach((p) => { if (!p) { pen = false; return; } d += (pen ? ' L' : ' M') + p[0] + ' ' + p[1]; pen = true; });
    els.push(React.createElement('path', { key: 'l' + k, d, fill: 'none', stroke: col,
      strokeWidth: k === 'stori' ? 3.5 : 2.5, strokeLinejoin: 'round', strokeLinecap: 'round',
      opacity: hover === null ? 1 : 0.9 }));
    pts.forEach((p, i) => {
      if (!p) return;
      els.push(React.createElement('circle', { key: 'c' + k + i, cx: p[0], cy: p[1], r: hover === i ? 5 : 3.5,
        fill: theme === 'dark' ? '#0b2b2f' : '#fff', stroke: col, strokeWidth: 2.5 }));
    });
  });
  // value pills (drawn last so they sit on top)
  if (showLabels) {
    // collision-aware vertical nudging per index
    labels.forEach((_, i) => {
      const stack = keys.map((k) => ({ k, v: data.series[k][i] })).filter((o) => o.v !== null)
        .sort((a, b) => y(a.v) - y(b.v));
      stack.forEach((o) => {
        const col = peers[o.k].color;
        const tx = fmtVal(o.v, 'num');
        const w = tx.length * 7.4 + 12, h = 19;
        const px = Math.min(Math.max(x(i) - w / 2, padL), W - padR - w);
        const py = y(o.v) - 24;
        els.push(React.createElement('g', { key: 'pill' + o.k + i, opacity: hover === null || hover === i ? 1 : 0.18 },
          React.createElement('rect', { x: px, y: py, width: w, height: h, rx: 5, fill: col }),
          React.createElement('text', { x: px + w / 2, y: py + h / 2 + 4.5, textAnchor: 'middle',
            fontSize: 12, fontWeight: 700, fill: o.k === 'klar' || o.k === 'revolut' ? '#0b2b2f' : '#fff' }, tx)
        ));
      });
    });
  }
  // hover hit zones
  labels.forEach((_, i) => {
    const bw = plotW / Math.max(n - 1, 1);
    els.push(React.createElement('rect', { key: 'hit' + i, x: x(i) - bw / 2, y: padT, width: bw, height: plotH,
      fill: 'transparent', onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null) }));
  });

  // tooltip
  let tip = null;
  if (hover !== null) {
    const rows = keys.map((k) => ({ k, v: data.series[k][hover] })).filter((o) => o.v !== null)
      .sort((a, b) => b.v - a.v);
    const left = x(hover) > W / 2;
    tip = React.createElement('div', {
      style: {
        position: 'absolute', top: 8, [left ? 'left' : 'right']: 16,
        background: theme === 'dark' ? '#0b2b2f' : '#fff',
        border: '1px solid ' + (theme === 'dark' ? 'rgba(255,255,255,.16)' : 'var(--ink-12)'),
        borderRadius: 12, boxShadow: 'var(--shadow-2)', padding: '10px 14px', minWidth: 150, pointerEvents: 'none',
      } },
      React.createElement('div', { style: { font: '700 12px Inter', color: theme === 'dark' ? 'rgba(255,255,255,.6)' : 'var(--ink-47)', marginBottom: 6, letterSpacing: '.02em' } }, labels[hover]),
      rows.map((o) => React.createElement('div', { key: o.k, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' } },
        React.createElement('span', { style: { width: 9, height: 9, borderRadius: 9, background: peers[o.k].color, flex: '0 0 auto' } }),
        React.createElement('span', { style: { font: '600 13px Inter', color: theme === 'dark' ? '#fff' : 'var(--ink)', flex: 1 } }, peers[o.k].name),
        React.createElement('span', { style: { font: '700 13px Inter', color: theme === 'dark' ? '#fff' : 'var(--ink)' } }, fmtVal(o.v, 'money'))))
    );
  }

  return React.createElement('div', { ref, style: { position: 'relative', width: '100%' } },
    React.createElement('svg', { width: W, height: H, style: { display: 'block' } }, els),
    tip
  );
}

/* ============================ COLUMN CHART ================================ */
function ColumnChart({ data, peers, labels, visible, showLabels, theme }) {
  const [ref, W] = useMeasure();
  const [hover, setHover] = _useState(null);
  const H = 460;
  const padL = 16, padR = 16, padT = 40, padB = 56;
  const keys = Object.keys(data.series).filter((k) => visible[k]);

  const flat = [];
  keys.forEach((k) => data.series[k].forEach((v) => { if (v !== null) flat.push(v); }));
  const sc = niceScale(Math.min(...flat, 0), Math.max(...flat, 0), 6);

  if (!W) return React.createElement('div', { ref, style: { width: '100%', height: H } });
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = labels.length;
  const band = plotW / n;
  const groupPad = band * 0.18;
  const groupW = band - groupPad * 2;
  const barW = Math.min(groupW / Math.max(keys.length, 1), 18);
  const innerGap = (groupW - barW * keys.length) / Math.max(keys.length - 1, 1);
  const y = (v) => padT + (1 - (v - sc.min) / (sc.max - sc.min)) * plotH;
  const y0 = y(0);
  const gridCol = theme === 'dark' ? 'rgba(255,255,255,.10)' : 'rgba(22,22,22,.07)';
  const axisCol = theme === 'dark' ? 'rgba(255,255,255,.55)' : 'var(--ink-47)';

  const els = [];
  sc.ticks.forEach((t, i) => els.push(React.createElement('line', { key: 'g' + i, x1: padL, x2: padL + plotW, y1: y(t), y2: y(t),
    stroke: t === 0 ? (theme === 'dark' ? 'rgba(255,255,255,.32)' : 'rgba(22,22,22,.30)') : gridCol, strokeWidth: t === 0 ? 1.5 : 1 })));

  labels.forEach((lab, i) => {
    const cx = padL + band * i + band / 2;
    const parts = lab.split(' ');
    if (hover === i) els.push(React.createElement('rect', { key: 'hl' + i, x: padL + band * i + groupPad * 0.4, y: padT,
      width: band - groupPad * 0.8, height: plotH, rx: 6, fill: theme === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(22,22,22,.035)' }));
    els.push(React.createElement('text', { key: 'x' + i, x: cx, y: H - padB + 22, textAnchor: 'middle', fontSize: 13, fontWeight: 700, fill: axisCol }, parts[0]));
    if (parts[1]) els.push(React.createElement('text', { key: 'xy' + i, x: cx, y: H - padB + 38, textAnchor: 'middle', fontSize: 12, fontWeight: 600, fill: theme === 'dark' ? 'rgba(255,255,255,.4)' : 'var(--ink-30)' }, parts[1]));
  });

  labels.forEach((_, i) => {
    const gx = padL + band * i + groupPad;
    keys.forEach((k, ki) => {
      const v = data.series[k][i];
      if (v === null) return;
      const bx = gx + ki * (barW + innerGap);
      const top = v >= 0 ? y(v) : y0;
      const h = Math.abs(y(v) - y0);
      const col = peers[k].color;
      els.push(React.createElement('rect', { key: 'b' + k + i, x: bx, y: top, width: barW, height: Math.max(h, 0.5), rx: 2.5,
        fill: col, opacity: hover === null || hover === i ? 1 : 0.35 }));
      if (showLabels && keys.length <= 3) {
        const tx = (Math.round(v * 10) / 10).toFixed(1);
        els.push(React.createElement('text', { key: 'bl' + k + i, x: bx + barW / 2, y: v >= 0 ? top - 5 : top + h + 13,
          textAnchor: 'middle', fontSize: 11, fontWeight: 700, fill: col, opacity: hover === null || hover === i ? 1 : 0.35 }, tx));
      }
    });
    const bw = band;
    els.push(React.createElement('rect', { key: 'hit' + i, x: padL + band * i, y: padT, width: bw, height: plotH,
      fill: 'transparent', onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null) }));
  });

  let tip = null;
  if (hover !== null) {
    const rows = keys.map((k) => ({ k, v: data.series[k][hover] })).filter((o) => o.v !== null).sort((a, b) => b.v - a.v);
    const cx = padL + band * hover + band / 2;
    const left = cx > W / 2;
    tip = React.createElement('div', { style: { position: 'absolute', top: 8, [left ? 'left' : 'right']: 16,
      background: theme === 'dark' ? '#0b2b2f' : '#fff', border: '1px solid ' + (theme === 'dark' ? 'rgba(255,255,255,.16)' : 'var(--ink-12)'),
      borderRadius: 12, boxShadow: 'var(--shadow-2)', padding: '10px 14px', minWidth: 150, pointerEvents: 'none' } },
      React.createElement('div', { style: { font: '700 12px Inter', color: theme === 'dark' ? 'rgba(255,255,255,.6)' : 'var(--ink-47)', marginBottom: 6 } }, labels[hover]),
      rows.map((o) => React.createElement('div', { key: o.k, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' } },
        React.createElement('span', { style: { width: 9, height: 9, borderRadius: 2, background: peers[o.k].color } }),
        React.createElement('span', { style: { font: '600 13px Inter', color: theme === 'dark' ? '#fff' : 'var(--ink)', flex: 1 } }, peers[o.k].name),
        React.createElement('span', { style: { font: '700 13px Inter', color: theme === 'dark' ? '#fff' : 'var(--ink)' } }, (Math.round(o.v * 10) / 10).toFixed(1))))
    );
  }

  return React.createElement('div', { ref, style: { position: 'relative', width: '100%' } },
    React.createElement('svg', { width: W, height: H, style: { display: 'block' } }, els), tip);
}

/* ===================== STACKED COLUMN (capital structure) ================= */
function StackedColumnChart({ data, theme }) {
  const [ref, W] = useMeasure();
  const [hover, setHover] = _useState(null);
  const H = 420;
  const padL = 16, padR = 16, padT = 32, padB = 44;
  const totals = data.years.map((_, i) => data.layers.reduce((s, l) => s + l.vals[i], 0));
  const sc = niceScale(0, Math.max(...totals), 6);
  if (!W) return React.createElement('div', { ref, style: { width: '100%', height: H } });
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = data.years.length;
  const band = plotW / n;
  const barW = Math.min(band * 0.5, 64);
  const y = (v) => padT + (1 - v / sc.max) * plotH;
  const gridCol = theme === 'dark' ? 'rgba(255,255,255,.10)' : 'rgba(22,22,22,.07)';
  const axisCol = theme === 'dark' ? 'rgba(255,255,255,.55)' : 'var(--ink-47)';

  const els = [];
  sc.ticks.forEach((t, i) => {
    els.push(React.createElement('line', { key: 'g' + i, x1: padL, x2: padL + plotW, y1: y(t), y2: y(t), stroke: gridCol, strokeWidth: 1 }));
    els.push(React.createElement('text', { key: 'gy' + i, x: padL, y: y(t) - 4, fontSize: 11, fontWeight: 600, fill: axisCol }, '$' + t + 'm'));
  });
  data.years.forEach((yr, i) => {
    const cx = padL + band * i + band / 2;
    els.push(React.createElement('text', { key: 'x' + i, x: cx, y: H - padB + 24, textAnchor: 'middle', fontSize: 14, fontWeight: 700, fill: axisCol }, yr));
    let acc = 0;
    data.layers.forEach((l) => {
      const v = l.vals[i]; const top = y(acc + v); const h = y(acc) - y(acc + v); acc += v;
      els.push(React.createElement('rect', { key: 'b' + l.key + i, x: cx - barW / 2, y: top, width: barW, height: Math.max(h, 0),
        fill: l.color, opacity: hover === null || hover === i ? 1 : 0.4,
        onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null) }));
    });
    els.push(React.createElement('text', { key: 'tot' + i, x: cx, y: y(totals[i]) - 8, textAnchor: 'middle', fontSize: 13, fontWeight: 800,
      fill: theme === 'dark' ? '#fff' : 'var(--ink)' }, '$' + totals[i].toFixed(0) + 'm'));
  });

  let tip = null;
  if (hover !== null) {
    const left = (padL + band * hover + band / 2) > W / 2;
    tip = React.createElement('div', { style: { position: 'absolute', top: 8, [left ? 'left' : 'right']: 16,
      background: theme === 'dark' ? '#0b2b2f' : '#fff', border: '1px solid ' + (theme === 'dark' ? 'rgba(255,255,255,.16)' : 'var(--ink-12)'),
      borderRadius: 12, boxShadow: 'var(--shadow-2)', padding: '10px 14px', minWidth: 150, pointerEvents: 'none' } },
      React.createElement('div', { style: { font: '700 12px Inter', color: theme === 'dark' ? 'rgba(255,255,255,.6)' : 'var(--ink-47)', marginBottom: 6 } }, data.years[hover]),
      data.layers.map((l) => React.createElement('div', { key: l.key, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' } },
        React.createElement('span', { style: { width: 9, height: 9, borderRadius: 2, background: l.color } }),
        React.createElement('span', { style: { font: '600 13px Inter', color: theme === 'dark' ? '#fff' : 'var(--ink)', flex: 1 } }, l.label),
        React.createElement('span', { style: { font: '700 13px Inter', color: theme === 'dark' ? '#fff' : 'var(--ink)' } }, '$' + l.vals[hover] + 'm')))
    );
  }
  return React.createElement('div', { ref, style: { position: 'relative', width: '100%' } },
    React.createElement('svg', { width: W, height: H, style: { display: 'block' } }, els), tip);
}

Object.assign(window, { useMeasure, niceScale, fmtVal, LineChart, ColumnChart, StackedColumnChart });
