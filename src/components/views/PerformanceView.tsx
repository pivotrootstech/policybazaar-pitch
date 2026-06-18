'use client';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, BubbleController, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { C } from '@/lib/colors';
import type { DemoRow } from '@/app/api/Demo/route';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, BubbleController, Title, Tooltip, Legend, Filler);

const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };

/* ── number formatters ───────────────────────────────────────────────────── */
function fmtBig(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}
function fmtINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}
function bestIdx(arr: number[], higher = true): number {
  let idx = 0;
  arr.forEach((v, i) => {
    if (higher ? v > arr[idx] : v < arr[idx]) idx = i;
  });
  return idx;
}

/* ── funnel component ────────────────────────────────────────────────────── */
function CoinFunnel({ row }: { row: DemoRow }) {
  const stages = [
    { label: 'Impressions', sub: 'top of funnel',  value: row.impressions, color: C.ink },
    { label: 'Clicks',      sub: 'paid traffic',   value: row.clicks,      color: C.pb },
    { label: 'Installs',    sub: 'app installs',   value: row.installs,    color: C.cyan },
    { label: 'Signups',     sub: 'registrations',  value: row.signups,     color: C.violet },
    { label: 'NAPs',        sub: 'next action',    value: row.naps,        color: C.green },
  ];
  const max = stages[0].value;
  return (
    <div className="funnel">
      {stages.map((s, i) => {
        const w = Math.max(12, (s.value / max) * 100);
        const prev = stages[i - 1];
        const dropPct = i === 0 ? null : (((prev.value - s.value) / prev.value) * 100).toFixed(1);
        const convPct = i === 0 ? '100%' : ((s.value / prev.value) * 100).toFixed(1) + '%';
        const convColor = i === 0 ? C.muted : parseFloat(convPct) > 40 ? C.green : C.amber;
        return (
          <div className="fstep" key={s.label}>
            <div className="ftag">{s.label}<small>{s.sub}</small></div>
            <div className="barwrap">
              <div className="fbar" style={{ width: `${w}%`, background: s.color }}>
                <span className="mono">{fmtBig(s.value)}</span>
              </div>
            </div>
            <div className="fconv">
              <span style={{ color: convColor }}>{convPct}</span>
              <small>{i === 0 ? 'entry' : dropPct ? `↓ ${dropPct}% drop` : 'step conv'}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── main view ───────────────────────────────────────────────────────────── */
export default function PerformanceView() {
  const [data, setData]       = useState<DemoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [fromIdx, setFromIdx] = useState<number | null>(null);
  const [toIdx,   setToIdx]   = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/Demo')
      .then(r => r.json())
      .then(json => {
        const rows: DemoRow[] = json.data ?? [];
        setData(rows);
        // default: last 6 months
        setFromIdx(Math.max(0, rows.length - 6));
        setToIdx(rows.length - 1);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load data'); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: C.muted, fontSize: 14 }}>Loading Demo data…</div>;
  if (error || !data.length) return <div style={{ padding: 40, textAlign: 'center', color: C.red, fontSize: 14 }}>{error || 'No data'}</div>;

  const fi = fromIdx ?? 0;
  const ti = toIdx   ?? data.length - 1;

  const filtered  = data.slice(fi, ti + 1);
  const months    = filtered.map(d => d.month);
  const latest    = filtered[filtered.length - 1];           // last month in selected range
  const prev      = filtered.length > 1                      // month before it in range
    ? filtered[filtered.length - 2]
    : filtered[0];

  // quick-range presets
  function applyPreset(n: number) {
    setFromIdx(Math.max(0, data.length - n));
    setToIdx(data.length - 1);
  }

  /* ── KPI deltas vs previous month ──────────────────────────────────────── */
  function delta(curr: number, p: number) {
    const pct = ((curr - p) / p * 100).toFixed(1);
    return `${Number(pct) >= 0 ? '▲' : '▼'} ${Math.abs(Number(pct))}% MoM`;
  }
  function deltaType(curr: number, p: number): 'up' | 'dn' {
    return curr >= p ? 'up' : 'dn';
  }

  /* ── best-value highlight for scorecard table (always last 6) ────────────*/
  const tableRows = filtered;
  const bestCTR  = bestIdx(tableRows.map(r => r.ctr));
  const bestCPI  = bestIdx(tableRows.map(r => r.cpi), false);
  const bestCPS  = bestIdx(tableRows.map(r => r.cps), false);
  const bestInst = bestIdx(tableRows.map(r => r.installs));
  const bestSig  = bestIdx(tableRows.map(r => r.signups));
  const bestNaps = bestIdx(tableRows.map(r => r.naps));

  const greenCell: React.CSSProperties = {
    color: '#047a52', fontWeight: 800, background: '#ECFDF5',
    borderRadius: 6, padding: '2px 6px',
  };

  return (
    <>
      <div className="view-head">
        <div>
          <div className="eyebrow">Performance · Lower Funnel</div>
          <h2>Demo — Month-on-Month Intelligence</h2>
          <p>
            Impressions → Clicks → Installs → Signups → NAPs · Showing: <b>{months[0]}</b> – <b>{months[months.length - 1]}</b> ({filtered.length} months)
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>

          {/* ── Custom date range ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {/* From */}
            <div className="chip">
              <span className="lbl">From</span>
              <select
                value={fi}
                onChange={e => {
                  const v = Number(e.target.value);
                  setFromIdx(v);
                  if (v > ti) setToIdx(v);
                }}
              >
                {data.map((d, i) => (
                  <option key={i} value={i}>{d.month}</option>
                ))}
              </select>
            </div>

            <span style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>→</span>

            {/* To */}
            <div className="chip">
              <span className="lbl">To</span>
              <select
                value={ti}
                onChange={e => {
                  const v = Number(e.target.value);
                  setToIdx(v);
                  if (v < fi) setFromIdx(v);
                }}
              >
                {data.map((d, i) => (
                  <option key={i} value={i}>{d.month}</option>
                ))}
              </select>
            </div>

            {/* Quick presets */}
            <div className="seg">
              {([3, 6, 12] as const).map(n => (
                <button
                  key={n}
                  className={filtered.length === n && ti === data.length - 1 ? 'on' : ''}
                  onClick={() => applyPreset(n)}
                >
                  {n === 3 ? '3M' : n === 6 ? '6M' : '1Y'}
                </button>
              ))}
              <button
                className={fi === 0 && ti === data.length - 1 ? 'on' : ''}
                onClick={() => { setFromIdx(0); setToIdx(data.length - 1); }}
              >
                All
              </button>
            </div>
          </div>

          <div className="view-meta" style={{ textAlign: 'right' }}>
            Source: <b>Demo M-O-M Dataset</b><br />
            Showing <b>{filtered.length}</b> months: <b>{months[0]}</b> → <b>{months[months.length - 1]}</b>
          </div>
        </div>
      </div>

      {/* ── KPI strip — 5 raw metrics ────────────────────────────────────── */}
      <div className="grid g5">
        {/* Impressions */}
        <div className="card kpi">
          <div className="accent" style={{ background: C.ink }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="topline"><span className="name">Impressions</span></div>
            <div className="val">{fmtBig(latest.impressions)}</div>
            <div className={`delta ${deltaType(latest.impressions, prev.impressions)}`}>{delta(latest.impressions, prev.impressions)}</div>
            <div className="foot"><span>Total paid impressions</span><span>{latest.month}</span></div>
          </div>
        </div>
        {/* Clicks */}
        <div className="card kpi">
          <div className="accent" style={{ background: C.pb }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="topline"><span className="name">Clicks</span></div>
            <div className="val">{fmtBig(latest.clicks)}</div>
            <div className={`delta ${deltaType(latest.clicks, prev.clicks)}`}>{delta(latest.clicks, prev.clicks)}</div>
            <div className="foot"><span>CTR {latest.ctr}%</span><span>{latest.month}</span></div>
          </div>
        </div>
        {/* Spends */}
        <div className="card kpi">
          <div className="accent" style={{ background: C.amber }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="topline"><span className="name">Spends</span></div>
            <div className="val">{fmtINR(latest.spends)}</div>
            <div className={`delta ${deltaType(prev.spends, latest.spends)}`}>{delta(prev.spends, latest.spends)}</div>
            <div className="foot"><span>Total media spend</span><span>{latest.month}</span></div>
          </div>
        </div>
        {/* Installs */}
        <div className="card kpi">
          <div className="accent" style={{ background: C.cyan }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="topline"><span className="name">Installs</span></div>
            <div className="val">{fmtBig(latest.installs)}</div>
            <div className={`delta ${deltaType(latest.installs, prev.installs)}`}>{delta(latest.installs, prev.installs)}</div>
            <div className="foot"><span>CPI {fmtINR(latest.cpi)}</span><span>{latest.month}</span></div>
          </div>
        </div>
        {/* Signups */}
        <div className="card kpi">
          <div className="accent" style={{ background: C.violet }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="topline"><span className="name">Signups</span></div>
            <div className="val">{fmtBig(latest.signups)}</div>
            <div className={`delta ${deltaType(latest.signups, prev.signups)}`}>{delta(latest.signups, prev.signups)}</div>
            <div className="foot"><span>CPS {fmtINR(latest.cps)}</span><span>{latest.month}</span></div>
          </div>
        </div>
      </div>

      {/* ── Funnel + Total spend card ─────────────────────────────────────── */}
      <div className="grid g23">
        <div className="card">
          <div className="card-h">
            <h3>Conversion Funnel — {latest.month}</h3>
            <span className="hint">Impressions → NAPs · % retained at each stage</span>
          </div>
          <div className="card-sub">Absolute volumes with stage drop-off. Latest month default; data covers 25 months.</div>
          <CoinFunnel row={latest} />
          <div className="statline" style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 14, justifyContent: 'space-around' }}>
            <div className="s"><span className="v" style={{ color: C.pb }}>{((latest.clicks / latest.impressions) * 100).toFixed(2)}%</span><span className="l">CTR</span></div>
            <div className="s"><span className="v" style={{ color: C.cyan }}>{fmtINR(latest.cpi)}</span><span className="l">Cost / Install</span></div>
            <div className="s"><span className="v" style={{ color: C.violet }}>{((latest.signups / latest.installs) * 100).toFixed(1)}%</span><span className="l">Install → Signup</span></div>
            <div className="s"><span className="v" style={{ color: C.amber }}>{fmtINR(latest.cps)}</span><span className="l">Cost / Signup</span></div>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div className="card-h" style={{ marginBottom: 2 }}><h3>{latest.month} Snapshot</h3><span className="hint">last month in range</span></div>
          {[
            { label: 'Total Impressions', value: fmtBig(latest.impressions), color: C.ink },
            { label: 'Total Clicks',      value: fmtBig(latest.clicks),      color: C.pb },
            { label: 'Total Spends',      value: fmtINR(latest.spends),      color: C.amber },
            { label: 'App Installs',      value: fmtBig(latest.installs),    color: C.cyan },
            { label: 'Signups',           value: fmtBig(latest.signups),     color: C.violet },
            { label: 'NAPs',              value: fmtBig(latest.naps),        color: C.green },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{s.label}</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          ))}
          <div className="insight" style={{ marginTop: 'auto' }}>
            <div className="ico">!</div>
            <div className="txt"><b>Note:</b> Values shown for <b>{latest.month}</b>. MoM delta compares against <b>{prev.month}</b>.</div>
          </div>
        </div>
      </div>

      {/* ── MoM trend chart ──────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-h">
          <h3>Month-on-Month Trend — Installs, Signups &amp; NAPs</h3>
          <span className="hint">{months[0]} – {months[months.length - 1]} · {filtered.length} months</span>
        </div>
        <div className="card-sub">Volume trend for the selected period. Switch periods using the 6M / 1Y / 2Y toggle above.</div>
        <div className="chh lg">
          <Line
            key={`trend-${fi}-${ti}`}
            data={{
              labels: months,
              datasets: [
                {
                  label: 'Installs',
                  data: filtered.map(d => d.installs),
                  borderColor: C.cyan, backgroundColor: C.cyan + '18',
                  borderWidth: 2.5, tension: 0.4, pointRadius: 3, pointBackgroundColor: C.cyan, fill: false,
                },
                {
                  label: 'Signups',
                  data: filtered.map(d => d.signups),
                  borderColor: C.violet, backgroundColor: C.violet + '18',
                  borderWidth: 2.5, tension: 0.4, pointRadius: 3, pointBackgroundColor: C.violet, fill: false,
                },
                {
                  label: 'NAPs',
                  data: filtered.map(d => d.naps),
                  borderColor: C.green, backgroundColor: C.green + '22',
                  borderWidth: 2, tension: 0.4, pointRadius: 3, pointBackgroundColor: C.green, fill: true,
                },
              ],
            }}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${fmtBig(c.raw as number)}` } },
              },
              scales: {
                x: { grid: noGrid, ticks: { maxRotation: 45, font: { size: 10 } } },
                y: { grid: GRID, ticks: { callback: v => fmtBig(Number(v)) } },
              },
            }}
          />
        </div>
      </div>

      {/* ── Spends & CTR trend ────────────────────────────────────────────── */}
      <div className="grid g2">
        <div className="card">
          <div className="card-h"><h3>Monthly Spends (₹)</h3><span className="hint">total media spend</span></div>
          <div className="chh">
            <Bar
              key={`spends-${fi}-${ti}`}
              data={{
                labels: months,
                datasets: [{
                  label: 'Spends (₹)',
                  data: filtered.map(d => d.spends),
                  backgroundColor: filtered.map((_, i) => i === filtered.length - 1 ? C.amber : C.amber + '88'),
                  borderRadius: 4,
                }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${fmtINR(c.raw as number)}` } } },
                scales: { x: { grid: noGrid, ticks: { maxRotation: 45, font: { size: 10 } } }, y: { grid: GRID, ticks: { callback: v => fmtINR(Number(v)) } } },
              }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>CTR &amp; CPI Trend</h3><span className="hint">efficiency over time</span></div>
          <div className="chh">
            <Line
              key={`ctr-${fi}-${ti}`}
              data={{
                labels: months,
                datasets: [
                  { label: 'CTR (%)',  data: filtered.map(d => d.ctr),  borderColor: C.pb,    borderWidth: 2, tension: 0.4, pointRadius: 2, yAxisID: 'y' },
                  { label: 'CPI (₹)', data: filtered.map(d => d.cpi),  borderColor: C.red,   borderWidth: 2, tension: 0.4, pointRadius: 2, yAxisID: 'y2', borderDash: [4, 3] },
                ],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                  x:  { grid: noGrid, ticks: { maxRotation: 45, font: { size: 10 } } },
                  y:  { grid: GRID, position: 'left',  title: { display: true, text: 'CTR %' },  ticks: { callback: v => v + '%' } },
                  y2: { position: 'right', title: { display: true, text: 'CPI ₹' }, grid: { display: false }, ticks: { callback: v => '₹' + v } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Scorecard ─────────────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-h">
          <h3>Scorecard — {months[0]} to {months[months.length - 1]}</h3>
          <span className="hint">Best value per column highlighted in green</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th className="r">Impressions</th>
              <th className="r">Clicks</th>
              <th className="r">Spends (₹)</th>
              <th className="r">Installs</th>
              <th className="r">CPI (₹)</th>
              <th className="r">Signups</th>
              <th className="r">CPS (₹)</th>
              <th className="r">NAPs</th>
              <th className="r">CTR %</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((r, i) => (
              <tr key={r.month}>
                <td style={{ fontWeight: 700 }}>{r.month}</td>
                <td className="r mono">{fmtBig(r.impressions)}</td>
                <td className="r mono">{fmtBig(r.clicks)}</td>
                <td className="r mono">{fmtINR(r.spends)}</td>
                <td className="r mono"><span style={i === bestInst ? greenCell : {}}>{fmtBig(r.installs)}</span></td>
                <td className="r mono"><span style={i === bestCPI  ? greenCell : {}}>{fmtINR(r.cpi)}</span></td>
                <td className="r mono"><span style={i === bestSig  ? greenCell : {}}>{fmtBig(r.signups)}</span></td>
                <td className="r mono"><span style={i === bestCPS  ? greenCell : {}}>{fmtINR(r.cps)}</span></td>
                <td className="r mono"><span style={i === bestNaps ? greenCell : {}}>{fmtBig(r.naps)}</span></td>
                <td className="r mono"><span style={i === bestCTR  ? greenCell : {}}>{r.ctr}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="foot-note">
          CPI = Cost per Install (lower is better) · CPS = Cost per Signup (lower is better) · CTR = Click-through rate (higher is better).
          Green cells = best value in each column across the last 6 months.
        </div>
      </div>
    </>
  );
}
