'use client';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Chart } from 'react-chartjs-2';
import { C } from '@/lib/colors';
import {
  PERIOD_DATA, PERF_FUNNEL, MARKET_ROWS, COMPETITOR_ROWS,
  BUDGET_CHANNELS, WATERFALL_STEPS,
} from '@/lib/data';
import KpiCard from '@/components/ui/KpiCard';
import FunnelChart from '@/components/ui/FunnelChart';
import type { BrandDataResponse } from '@/app/api/Demo-jan25/route';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };

const CT_COLORS: Record<string, string> = {
  'DSP': C.pb, 'ROS': C.cyan, 'Impact': C.amber, 'CTV/Video': C.violet,
  'Union-Budget': C.green, 'TRUMP Impact': C.ink, 'TRUMP ROS': C.muted,
  'Stitched-Video-Ads': '#E6539A', 'ROS-OND': '#38BDF8', 'Impact-OND': '#FCD34D',
  'Hotstar-OND': '#FCA5A5', 'Video-OND': '#C4B5FD', 'Twitter-OND': '#93C5FD',
  'Reddit-OND': '#FB923C', 'Hotstar': C.red, 'News-ROS': '#0E7490',
  'Targeted-ROS': '#0369A1', 'Video/OTT/Music': '#7E22CE', 'Cricket': '#B45309',
  'Food-Tech-ROS': '#15803D', 'Food-Tech-Impact': '#A16207',
};
const ctColor = (ct: string) => CT_COLORS[ct] ?? C.pb;

const fmtB = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return String(n);
};
const fmtCr = (n: number) => {
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + 'L';
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const MONTH_ORDER = [
  'Oct-24','Nov-24','Dec-24','Jan-25','Feb-25','Mar-25',
  'Jul-25','Aug-25','Sep-25','Feb-26','Mar-26','May-26','Jun-26',
];

// ── Section header helper ──────────────────────────────────────────────────
function SectionHead({ title, sub, accent }: { title: string; sub: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '24px 0 12px' }}>
      <span style={{ width: 4, height: 18, borderRadius: 2, background: accent, flexShrink: 0, alignSelf: 'center' }} />
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.ink }}>{title}</h3>
      <span style={{ fontSize: 12, color: C.muted }}>{sub}</span>
    </div>
  );
}

export default function OverviewView() {
  const fy = PERIOD_DATA['FY 26–27 (Full)'];

  // ── Fetch digital campaign data ──────────────────────────────────────────
  const [brand, setBrand] = useState<BrandDataResponse | null>(null);

  useEffect(() => {
    fetch('/api/Demo-jan25')
      .then(r => r.json())
      .then((d: BrandDataResponse) => setBrand(d))
      .catch(() => {});
  }, []);

  // Month-wise trend (sorted)
  const monthTrend = brand
    ? MONTH_ORDER
        .filter(m => brand.records.some(r => r.month === m))
        .map(m => {
          const rows = brand.records.filter(r => r.month === m);
          return {
            month: m,
            imp: rows.reduce((s, r) => s + r.impressions, 0),
            spd: rows.reduce((s, r) => s + r.spends, 0),
          };
        })
    : [];

  // Campaign type breakdown (top 6)
  const ctMap = new Map<string, number>();
  if (brand) {
    for (const r of brand.records) {
      ctMap.set(r.campaignType, (ctMap.get(r.campaignType) ?? 0) + r.spends);
    }
  }
  const ctSpend = Array.from(ctMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Top 5 markets
  const top5Markets = MARKET_ROWS.slice(0, 5);

  // Budget donut
  const totalBudget = BUDGET_CHANNELS.reduce((s, c) => s + c.value, 0);

  const ot = brand?.overallTotals;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="view-head">
        <div>
          <div className="eyebrow">Dashboard · All Views</div>
          <h2>Overall Campaign Summary</h2>
        </div>
        <div className="view-meta" style={{ textAlign: 'right' }}>
          FY 26–27 · PolicyBazaar<br />
          <b>Data: Demo Jan–Jun 2026</b>
        </div>
      </div>

      {/* ── Top KPIs ────────────────────────────────────────────────────── */}
      <div className="grid g4">
        <KpiCard
          accentColor={C.pb}
          name="Overall Impressions"
          value={ot ? fmtB(ot.impressions) : '—'}
          delta={ot ? `CTR ${ot.ctr.toFixed(3)}%` : 'loading…'}
          footLeft={brand ? `${brand.months.length} months · ${brand.publishers.length} publishers` : ''}
        />
        <KpiCard
          accentColor={C.green}
          name="Total Spends"
          value={ot ? fmtCr(ot.spends) : '—'}
          delta={ot ? `CPM ₹${ot.avgCPM.toFixed(0)}` : ''}
          footLeft="digital only · excl. TV/Print"
        />
        <KpiCard
          accentColor={C.cyan}
          name="Leads Generated"
          value={fy.leads + 'M'}
          delta={`${fy.leadYoY} YoY · ${fy.reachEnq} reach→lead`}
          footLeft="FY 26–27 full year"
        />
        <KpiCard
          accentColor={C.violet}
          name="Policies Issued"
          value={fy.policies + 'M'}
          delta={`${fy.leadPolicy} lead→policy · ${fy.costPolicy}/policy`}
          footLeft="brand-attributed"
        />
      </div>

      {/* ── Digital Campaign ────────────────────────────────────────────── */}
      <SectionHead title="Digital Campaign Performance" sub="Demo RAW sheet · all months" accent={C.pb} />
      <div className="grid g23">
        <div className="card">
          <div className="card-h">
            <h3>Month-wise impressions &amp; spends</h3>
            <span className="hint">{brand ? `${brand.months.length} months` : 'loading'}</span>
          </div>
          <div className="chh lg">
            {brand ? (
              <Chart
                type="bar"
                data={{
                  labels: monthTrend.map(m => m.month),
                  datasets: [
                    {
                      type: 'bar' as const,
                      label: 'Impressions',
                      data: monthTrend.map(m => m.imp),
                      backgroundColor: C.pb + '55',
                      borderColor: C.pb,
                      borderWidth: 1,
                      borderRadius: 4,
                      yAxisID: 'y',
                    },
                    {
                      type: 'line' as const,
                      label: 'Spends',
                      data: monthTrend.map(m => m.spd),
                      borderColor: C.amber,
                      borderWidth: 2.5,
                      tension: 0.4,
                      pointRadius: 3,
                      pointBackgroundColor: C.amber,
                      fill: false,
                      yAxisID: 'y2',
                    },
                  ],
                }}
                options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { callbacks: { label: c => c.dataset.label === 'Impressions' ? ` ${fmtB(c.raw as number)}` : ` ${fmtCr(c.raw as number)}` } },
                  },
                  scales: {
                    x:  { grid: noGrid },
                    y:  { grid: GRID, position: 'left',  ticks: { callback: v => fmtB(v as number) } },
                    y2: { grid: { display: false }, position: 'right', ticks: { callback: v => fmtCr(v as number) } },
                  },
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.muted }}>Loading…</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <h3>Spend by campaign type</h3>
            <span className="hint">top 6</span>
          </div>
          <div className="chh">
            {ctSpend.length > 0 ? (
              <Doughnut
                data={{
                  labels: ctSpend.map(([ct]) => ct),
                  datasets: [{
                    data: ctSpend.map(([, v]) => v),
                    backgroundColor: ctSpend.map(([ct]) => ctColor(ct)),
                    borderWidth: 2, borderColor: '#fff',
                  }],
                }}
                options={{
                  responsive: true, maintainAspectRatio: false, cutout: '60%',
                  plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10 } },
                    tooltip: { callbacks: { label: c => ` ${c.label}: ${fmtCr(c.raw as number)}` } },
                  },
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.muted }}>Loading…</div>
            )}
          </div>
          {ot && (
            <div className="statline" style={{ marginTop: 10, justifyContent: 'space-around' }}>
              <div className="s"><span className="v" style={{ color: C.pb }}>{fmtB(ot.impressions)}</span><span className="l">Impressions</span></div>
              <div className="s"><span className="v" style={{ color: C.violet }}>{fmtB(ot.views)}</span><span className="l">Views</span></div>
              <div className="s"><span className="v" style={{ color: C.amber }}>{ot.vtr.toFixed(1)}%</span><span className="l">VTR</span></div>
            </div>
          )}
        </div>
      </div>

      {/* ── Performance Funnel ──────────────────────────────────────────── */}
      <SectionHead title="Performance Funnel" sub="FY 26–27 · clicks → policies" accent={C.cyan} />
      <div className="grid g23">
        <div className="card">
          <div className="card-h"><h3>Media waterfall</h3><span className="hint">de-duplicated · all channels</span></div>
          <FunnelChart steps={WATERFALL_STEPS} />
          <div className="statline" style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 14, justifyContent: 'space-around' }}>
            <div className="s"><span className="v" style={{ color: C.pb }}>{fy.imprPolicy}</span><span className="l">Impr→policy</span></div>
            <div className="s"><span className="v" style={{ color: C.cyan }}>{fy.reachEnq}</span><span className="l">Reach→lead</span></div>
            <div className="s"><span className="v" style={{ color: C.amber }}>{fy.leadPolicy}</span><span className="l">Lead→policy</span></div>
            <div className="s"><span className="v" style={{ color: C.green }}>{fy.costPolicy}</span><span className="l">Cost/policy</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Conversion funnel</h3><span className="hint">step-by-step</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
            {PERF_FUNNEL.map((step, i, arr) => {
              const prev = arr[i - 1];
              const pct = prev ? ((step.value / prev.value) * 100).toFixed(1) + '%' : '100%';
              const w = Math.max(15, (step.value / arr[0].value) * 100);
              return (
                <div key={step.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, color: C.ink }}>{step.label}</span>
                    <span style={{ color: C.muted }}>{step.display} &nbsp;<b style={{ color: step.color }}>{pct}</b></span>
                  </div>
                  <div style={{ height: 8, background: '#EEF2F8', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${w}%`, background: step.color, borderRadius: 4, transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="foot-note" style={{ marginTop: 12 }}>
            Clicks → Sessions → Leads → Qualified → Conversions. Each bar is % of Clicks.
          </div>
        </div>
      </div>

      {/* ── Markets + Competition ────────────────────────────────────────── */}
      <SectionHead title="Markets &amp; Competition" sub="top markets · SOV snapshot" accent={C.amber} />
      <div className="grid g2">
        {/* Markets */}
        <div className="card">
          <div className="card-h"><h3>Top markets by reach</h3><span className="hint">FY 26–27</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}>
            {top5Markets.map(m => (
              <div key={m.market}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, color: C.ink }}>{m.market}</span>
                  <span style={{ color: C.muted }}>
                    <b style={{ color: C.pb }}>{m.reachPct}%</b> reach &nbsp;·&nbsp; {m.leads} leads &nbsp;·&nbsp;
                    <b style={{ color: m.leadYoY.startsWith('+') ? C.green : C.red }}>{m.leadYoY}</b>
                  </span>
                </div>
                <div style={{ height: 7, background: '#EEF2F8', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${m.reachPct}%`, background: C.pb + '99', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="foot-note" style={{ marginTop: 12 }}>
            Reach % of urban TG universe · CPL {top5Markets[0].cpl} – {top5Markets[top5Markets.length - 1].cpl}
          </div>
        </div>

        {/* Competition */}
        <div className="card">
          <div className="card-h"><h3>Competitive SOV</h3><span className="hint">share of voice · GRP</span></div>
          <div className="chh">
            <Bar
              data={{
                labels: COMPETITOR_ROWS.map(r => r.name),
                datasets: [
                  {
                    label: 'SOV %',
                    data: COMPETITOR_ROWS.map(r => parseInt(r.sov)),
                    backgroundColor: COMPETITOR_ROWS.map(r => r.color),
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { label: c => ` ${c.raw}% SOV · ${COMPETITOR_ROWS[c.dataIndex as number].index}` } },
                },
                scales: {
                  x: { grid: GRID, ticks: { callback: v => v + '%' }, max: 40 },
                  y: { grid: noGrid },
                },
              }}
            />
          </div>
          <table style={{ marginTop: 12, width: '100%' }}>
            <thead>
              <tr>
                <th>Brand</th>
                <th className="r">Spend</th>
                <th className="r">SOV</th>
                <th className="r">Index</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITOR_ROWS.map(r => (
                <tr key={r.name}>
                  <td><span className="pill" style={{ background: r.color + '1a', color: r.color }}>●</span> {r.name}</td>
                  <td className="r mono">{r.spend}</td>
                  <td className="r mono">{r.sov}</td>
                  <td className="r mono" style={{ color: C.green }}>{r.index}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Budget + Brand Lift + Health ────────────────────────────────── */}
      <SectionHead title="Budget &amp; Brand Health" sub="pacing · lift · signals" accent={C.violet} />
      <div className="grid g3">
        {/* Budget */}
        <div className="card">
          <div className="card-h"><h3>Budget distribution</h3><span className="hint">FY 26–27 annual</span></div>
          <div className="chh sm" style={{ position: 'relative' }}>
            <Doughnut
              data={{
                labels: BUDGET_CHANNELS.map(c => c.label),
                datasets: [{ data: BUDGET_CHANNELS.map(c => c.value), backgroundColor: BUDGET_CHANNELS.map(c => c.color), borderWidth: 2, borderColor: '#fff' }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false, cutout: '62%',
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ₹${c.raw} Cr` } } },
              }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 600 }}>₹{totalBudget}</span>
              <span style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>Cr · FY 26–27</span>
            </div>
          </div>
          <div className="statline" style={{ marginTop: 8, justifyContent: 'space-around' }}>
            <div className="s"><span className="v" style={{ color: C.ink }}>{fy.spend}</span><span className="l">Planned</span></div>
            <div className="s"><span className="v" style={{ color: C.pb }}>{fy.spent}</span><span className="l">Spent YTD</span></div>
            <div className="s"><span className="v" style={{ color: C.green }}>{fy.pace}</span><span className="l">On pace</span></div>
          </div>
        </div>

        {/* Brand lift */}
        <div className="card">
          <div className="card-h"><h3>Brand lift study Analysis</h3>
          {/* <span className="hint">pre vs post · Δ pts</span> */}
          </div>
          <div className="chh sm">
            <Bar
              data={{
                labels: ['Awareness', 'Consideration', 'Intent', 'Trust', 'Preference'],
                datasets: [{ label: 'Δ pts', data: [9.2, 12.4, 6.8, 8.1, 5.4], backgroundColor: [C.pb, C.violet, C.cyan, C.green, C.amber], borderRadius: 5 }],
              }}
              options={{
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` +${c.raw} pts` } } },
                scales: { x: { grid: GRID, ticks: { callback: v => '+' + v } }, y: { grid: noGrid } },
              }}
            />
          </div>
        </div>

        {/* Health signals */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div className="card-h" style={{ marginBottom: 2 }}><h3>Health signals</h3><span className="hint">vs target</span></div>
          {[
            { label: 'Lead growth → +30% goal',  pct: 91,  color: C.cyan },
            { label: 'Net reach → 60% goal',      pct: 107, color: C.pb },
            { label: 'High-income reach → 55%',   pct: 87,  color: C.violet },
            { label: 'Video VTR → 65%',           pct: 109, color: C.amber },
          ].map(h => (
            <div key={h.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
                <span>{h.label}</span>
                <span className="mono">{Math.min(h.pct, 100)}%</span>
              </div>
              <div className="bar"><i style={{ width: `${Math.min(h.pct, 100)}%`, background: h.color }} /></div>
            </div>
          ))}
          <div className="insight" style={{ marginTop: 'auto' }}>
            <div className="ico">!</div>
            <div className="txt"><b>Pacing flag:</b> Term lead growth (+19%) trails Health (+34%). Re-weight ₹4–6 Cr of Q3 OTT toward Term-intent cohorts.</div>
          </div>
        </div>
      </div>

      <div className="foot-note">Illustrative dataset modelled on the PolicyBazaar brand media brief. Digital figures sourced from Demo Jan–Jun 2026 RAW sheet. Funnel, market and competition data are simulated for demonstration.</div>
    </>
  );
}
