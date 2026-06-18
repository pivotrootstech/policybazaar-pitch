'use client';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, BubbleController, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Bubble, Line } from 'react-chartjs-2';
import { C } from '@/lib/colors';
import { PERF_FUNNEL, PIPELINE_FUNNEL } from '@/lib/data';
import KpiCard from '@/components/ui/KpiCard';
import FunnelChart from '@/components/ui/FunnelChart';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, BubbleController, Title, Tooltip, Legend, Filler);

const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };

const PERF_TABLE = [
  { name: 'Search',  color: C.pb,       clicks: '18.2 M', ctl: '23%', cpl: '₹212', cvr: '9.4%', verifiedLeads: '2.9 M', cpVerified: '₹318' },
  { name: 'Social',  color: C.violet,   clicks: '9.1 M',  ctl: '17%', cpl: '₹248', cvr: '5.2%', verifiedLeads: '0.9 M', cpVerified: '₹402' },
  { name: 'YouTube', color: C.pbBright, clicks: '8.0 M',  ctl: '19%', cpl: '₹268', cvr: '6.8%', verifiedLeads: '0.8 M', cpVerified: '₹389' },
  { name: 'Display', color: C.amber,    clicks: '5.9 M',  ctl: '12%', cpl: '₹392', cvr: '4.1%', verifiedLeads: '0.3 M', cpVerified: '₹611' },
];

const PIPE_TABLE = [
  { product: 'Health',      color: C.cyan,   leads: '3.40 M', contacted: '2.62 M', quote: '1.71 M', callback: '0.46 M', payment: '0.16 M', converted: '0.27 M', dropped: '1.71 M' },
  { product: 'Term',        color: C.pb,     leads: '2.10 M', contacted: '1.55 M', quote: '0.96 M', callback: '0.31 M', payment: '0.11 M', converted: '0.13 M', dropped: '1.20 M' },
  { product: 'Motor',       color: C.violet, leads: '2.40 M', contacted: '1.78 M', quote: '1.18 M', callback: '0.28 M', payment: '0.08 M', converted: '0.17 M', dropped: '1.30 M' },
  { product: 'Investments', color: C.amber,  leads: '0.70 M', contacted: '0.45 M', quote: '0.25 M', callback: '0.07 M', payment: '0.03 M', converted: '0.04 M', dropped: '0.34 M' },
];

export default function PerformanceView() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="view-head">
        <div>
          <div className="eyebrow">Performance · Lower Funnel</div>
          <h2>From Impression to Conversion</h2>
          <p>Tracking the entire funnel beyond GRP &amp; CPL.</p>
        </div>
        <div className="view-meta">
          Window: <b>FY 26–27 YTD</b><br />
          Lead = high-intent enquiry · Policy = issued
        </div>
      </div>

      {/* ── Top KPIs ────────────────────────────────────────────────────────── */}
      <div className="grid g4">
        <KpiCard accentColor={C.cyan}    name="Clicks"              value="41.2" valueSuffix="M" delta="▲ 16% YoY" />
        <KpiCard accentColor={C.pb}      name="Sessions"            value="33.0" valueSuffix="M" delta="▲ 80% click→session" />
        <KpiCard accentColor={C.amber}   name="CTL · Click→Lead"    value="20.9" valueSuffix="%" delta="▲ +1.4pp" />
        <KpiCard accentColor={C.green}   name="Lead → Conversion"   value="7.1"  valueSuffix="%" delta="▲ +0.6pp" />
      </div>

      {/* ── Bubble + Funnel ─────────────────────────────────────────────────── */}
      <div className="grid g32">
        <div className="card">
          <div className="card-h"><h3>Channel efficiency matrix</h3><span className="hint">bubble = lead volume</span></div>
          <div className="card-sub">X = cost per lead, Y = lead→policy conversion. Top-left is the sweet spot: cheap leads that convert. Bubble size = lead share.</div>
          <div className="chh lg">
            <Bubble
              data={{
                datasets: [
                  { label: 'Search',  data: [{ x: 212, y: 9.4, r: 28 }], backgroundColor: C.pb + 'cc' },
                  { label: 'YouTube', data: [{ x: 268, y: 6.8, r: 22 }], backgroundColor: C.pbBright + 'cc' },
                  { label: 'Social',  data: [{ x: 248, y: 5.2, r: 24 }], backgroundColor: C.violet + 'cc' },
                  { label: 'Display', data: [{ x: 392, y: 4.1, r: 14 }], backgroundColor: C.amber + 'cc' },
                ],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: CPL ₹${(c.raw as {x:number}).x}, CVR ${(c.raw as {y:number}).y}%` } } },
                scales: {
                  x: { grid: GRID, title: { display: true, text: 'Cost per lead (₹) — cheaper ←' }, reverse: true },
                  y: { grid: GRID, title: { display: true, text: 'Lead → conversion %' }, ticks: { callback: v => v + '%' } },
                },
              }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Performance funnel</h3><span className="hint">all paid digital</span></div>
          <FunnelChart steps={PERF_FUNNEL} />
        </div>
      </div>

      {/* ── Leads by cat + Spends by cat + CPL trend ────────────────────────── */}
      <div className="grid g3">
        <div className="card">
          <div className="card-h"><h3>Leads by category</h3><span className="hint">Health · Term · Motor · Investments</span></div>
          <div className="chh">
            <Bar
              data={{ labels: ['Health','Term','Motor','Investments'], datasets: [{ label: 'Leads (M)', data: [3.4,2.1,2.4,0.7], backgroundColor: [C.cyan,C.pb,C.violet,C.amber], borderRadius: 6 }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}M leads` } } }, scales: { x: { grid: noGrid }, y: { grid: GRID, title: { display: true, text: 'Leads (M)' } } } }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Spends by category</h3><span className="hint">₹ Cr · paid digital</span></div>
          <div className="chh">
            <Bar
              data={{ labels: ['Health','Term','Motor','Investments'], datasets: [{ label: 'Spend (₹ Cr)', data: [9.8,7.4,5.1,2.9], backgroundColor: [C.cyan,C.pb,C.violet,C.amber], borderRadius: 6 }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ₹${c.raw} Cr` } } }, scales: { x: { grid: noGrid }, y: { grid: GRID, title: { display: true, text: 'Spend (₹ Cr)' } } } }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Cost-per-lead trend</h3><span className="hint">₹ · rolling monthly</span></div>
          <div className="chh">
            <Line
              data={{
                labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [
                  { label: 'Blended',     data: [321,312,305,298,294,289,278,272,284], borderColor: C.ink,       borderWidth: 2.5, borderDash: [5,3], tension: 0.4, pointRadius: 0 },
                  { label: 'Health',      data: [256,248,242,238,235,231,224,219,228], borderColor: C.cyan,      borderWidth: 2, tension: 0.4, pointRadius: 0 },
                  { label: 'Term',        data: [388,381,372,366,360,354,342,336,349], borderColor: C.pb,        borderWidth: 2, tension: 0.4, pointRadius: 0 },
                  { label: 'Motor',       data: [298,289,283,279,274,268,261,256,266], borderColor: C.violet,    borderWidth: 2, tension: 0.4, pointRadius: 0 },
                  { label: 'Investments', data: [431,422,414,406,399,392,381,374,388], borderColor: C.amber,     borderWidth: 2, tension: 0.4, pointRadius: 0 },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: noGrid }, y: { grid: GRID, ticks: { callback: v => '₹' + v } } } }}
            />
          </div>
        </div>
      </div>

      {/* ── Channel scorecard ────────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-h"><h3>Channel performance scorecard</h3><span className="hint">click → verified-lead economics</span></div>
        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th className="r">Clicks</th>
              <th className="r">CTL (click→lead)</th>
              <th className="r">CPL</th>
              <th className="r">CVR (→conversion)</th>
              <th className="r">Verified Leads</th>
              <th className="r">CP Verified Lead</th>
            </tr>
          </thead>
          <tbody>
            {PERF_TABLE.map(r => (
              <tr key={r.name}>
                <td><span className="pill" style={{ background: r.color + '1a', color: r.color }}>●</span> {r.name}</td>
                <td className="r mono">{r.clicks}</td>
                <td className="r mono">{r.ctl}</td>
                <td className="r mono">{r.cpl}</td>
                <td className="r mono">{r.cvr}</td>
                <td className="r mono">{r.verifiedLeads}</td>
                <td className="r mono">{r.cpVerified}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="foot-note">CTL = click→lead rate · CPL = cost per raw lead · CVR = lead→conversion · Verified Leads = leads validated by the call-centre · CP Verified Lead = cost per verified lead. Only lead-driving channels shown; OTT &amp; CTV sit in the Brand Health view as upper-funnel reach media.</div>
      </div>

      {/* ── Non-Converted / Pipeline ─────────────────────────────────────────── */}
      <div className="view-head" style={{ marginTop: 26, marginBottom: 14 }}>
        <div>
          <div className="eyebrow" style={{ color: C.ink }}>Lead Lifecycle · Non-Converted</div>
          <h2 style={{ fontSize: 20 }}>Where leads sit &amp; drop off — the full pipeline</h2>
          <p>Not every lead converts the same day. This is the complete post-lead funnel: how many are in pipeline, where they drop off, how many await a call-centre callback, and how many are stuck at payment — split by product.</p>
        </div>
        <div className="view-meta">Snapshot: <b>8.6M leads YTD</b><br />0.61M converted · 8.0M in lifecycle</div>
      </div>

      <div className="grid g4">
        <KpiCard accentColor={C.cyan}   name="In Pipeline (open)"  value="2.94" valueSuffix="M" delta="● 34% of leads active"    deltaType="flat" />
        <KpiCard accentColor={C.amber}  name="Awaiting Callback"    value="1.12" valueSuffix="M" delta="● agent queue"             deltaType="flat" />
        <KpiCard accentColor={C.violet} name="Payment Pending"      value="0.38" valueSuffix="M" delta="▲ recoverable revenue" />
        <KpiCard accentColor={C.red}    name="Dropped / Lost"       value="4.55" valueSuffix="M" delta="▼ 53% leakage"             deltaType="dn" />
      </div>

      <div className="grid g23">
        <div className="card">
          <div className="card-h"><h3>Post-lead stage funnel</h3><span className="hint">where the 8.6M leads are now</span></div>
          <FunnelChart steps={PIPELINE_FUNNEL} />
          <div className="foot-note">Each step shows how many leads remain; the % at right is the share retained from the previous stage. The gaps are the drop-off points to attack — biggest leakage is contact→quote.</div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Drop-off by stage</h3><span className="hint">% of leads lost at each step</span></div>
          <div className="chh">
            <Bar
              data={{ labels: ['Lead→Contact','Contact→Quote','Quote→Payment','Payment→Convert'], datasets: [{ label: 'Drop-off %', data: [26,36,76,38], backgroundColor: [C.amber,C.red,C.red,C.violet], borderRadius: 5 }] }}
              options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}% lost at this step` } } }, scales: { x: { grid: GRID, ticks: { callback: v => v + '%' } }, y: { grid: noGrid } } }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h"><h3>Pipeline by product</h3><span className="hint">leads · stage split · per category</span></div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th className="r">Leads</th>
              <th className="r">Contacted</th>
              <th className="r">Quote shared</th>
              <th className="r">Callback queue</th>
              <th className="r">Payment pending</th>
              <th className="r">Converted</th>
              <th className="r">Dropped</th>
            </tr>
          </thead>
          <tbody>
            {PIPE_TABLE.map(r => (
              <tr key={r.product}>
                <td><span className="pill" style={{ background: r.color + '1a', color: r.color }}>●</span> {r.product}</td>
                <td className="r mono">{r.leads}</td>
                <td className="r mono">{r.contacted}</td>
                <td className="r mono">{r.quote}</td>
                <td className="r mono" style={{ color: C.amber }}>{r.callback}</td>
                <td className="r mono" style={{ color: C.violet }}>{r.payment}</td>
                <td className="r mono" style={{ color: C.green }}>{r.converted}</td>
                <td className="r mono" style={{ color: C.red }}>{r.dropped}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="foot-note">Stage definitions — <b>Contacted</b>: call-centre reached the lead · <b>Quote shared</b>: a comparison/quote was delivered · <b>Callback</b>: lead asked to be re-contacted (in agent queue) · <b>Payment pending</b>: chose a plan, payment not completed · <b>Converted</b>: policy issued · <b>Dropped</b>: unreachable / not interested / lapsed.</div>
      </div>
    </>
  );
}
