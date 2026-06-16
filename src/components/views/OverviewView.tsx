'use client';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line, Chart } from 'react-chartjs-2';
import { useDashboard } from '@/context/DashboardContext';
import { C } from '@/lib/colors';
import { PERIOD_DATA, WATERFALL_STEPS, BUDGET_CHANNELS, SPARK_DATA } from '@/lib/data';
import KpiCard from '@/components/ui/KpiCard';
import FunnelChart from '@/components/ui/FunnelChart';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };

export default function OverviewView() {
  const { period, mediaMode } = useDashboard();
  const p = PERIOD_DATA[period] ?? PERIOD_DATA['FY 26–27 (Full)'];

  const budgetChannels = BUDGET_CHANNELS.filter(ch =>
    mediaMode === 'combo' ? true : mediaMode === 'tv' ? ch.type === 'tv' : ch.type === 'digital'
  );
  const totalBudget = budgetChannels.reduce((a, b) => a + b.value, 0);

  return (
    <>
      <div className="view-head">
        <div>
          <div className="eyebrow">Media Campaign Overview</div>
          <h2>Driving reach to policy sale</h2>
        </div>
        <div className="view-meta">
          Plan: <b>₹150 Cr</b> · TV ₹100 Cr / Digital ₹50 Cr<br />
          Data refreshed 14 Jun 2026, 09:12 IST
        </div>
      </div>

      {/* KPI row */}
      <div className="grid g5">
        <KpiCard accentColor={C.pb}     name="Net Reach · TG"       icon="◎" iconBg="#e6efff" iconColor={C.pb}     value={p.reach}    valueSuffix="M"   delta={p.reachDelta}            footLeft="1+ reach"          footRight="Target 60%"       sparkData={SPARK_DATA.reach}    sparkColor={C.pb}    />
        <KpiCard accentColor={C.amber}  name="Incremental Reach /TV" icon="＋" iconBg="#fcf3da" iconColor="#b8860b" value="+38"        valueSuffix="%"   delta="▲ 36.4M cord-cutters"    footLeft="OTT + YouTube de-dup" footRight="vs TV-only"      sparkData={SPARK_DATA.incr}     sparkColor={C.amber} />
        <KpiCard accentColor={C.ink}    name="GRP / SOV"             icon="▦" iconBg="#e7ebf3" iconColor={C.ink}   value={p.grp}                        delta={`▲ ${p.sov} category SOV`} footLeft="TV target-GRPs"   footRight="P1 markets"       sparkData={SPARK_DATA.grp}      sparkColor={C.ink}   />
        <KpiCard accentColor={C.cyan}   name="Traffic &amp; Leads"   icon="⤓" iconBg="#dcf6fb" iconColor="#0891b2" value={p.sessions}  valueSuffix="M"   delta={`▲ ${p.leads}M leads · ${p.leadYoY} YoY`} footLeft="sessions → enquiries" footRight="Goal +30%" sparkData={SPARK_DATA.leads} sparkColor={C.cyan} />
        <KpiCard accentColor={C.violet} name="Conversions (Attributed)" icon="⟿" iconBg="#f1ecfe" iconColor="#7c3aed" value={p.policies} valueSuffix="M" delta="▲ 34% brand-attributed"  footLeft="policies issued"   footRight="MMM + view-through" sparkData={SPARK_DATA.policies} sparkColor={C.violet} />
      </div>

      {/* Waterfall + Budget */}
      <div className="grid g23">
        <div className="card">
          <div className="card-h">
            <h3><span className="tagdot" style={{ background: C.pb }} />The Media Waterfall</h3>
            <span className="hint">FY 26–27 YTD · all channels de-duplicated</span>
          </div>
          <FunnelChart steps={WATERFALL_STEPS} />
          <div className="statline" style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 14, justifyContent: 'space-around' }}>
            <div className="s"><span className="v" style={{ color: C.pb }}>{p.imprPolicy}</span><span className="l">Impression → policy</span></div>
            <div className="s"><span className="v" style={{ color: C.cyan }}>{p.reachEnq}</span><span className="l">Reach → enquiry</span></div>
            <div className="s"><span className="v" style={{ color: C.amber }}>{p.leadPolicy}</span><span className="l">Lead → policy</span></div>
            <div className="s"><span className="v" style={{ color: C.green }}>{p.costPolicy}</span><span className="l">Blended cost / policy</span></div>
          </div>
          <div className="foot-note">Read left→right: paid impressions compress into reach, into sessions, into raw enquiries, into agent-qualified leads, into issued policies.</div>
        </div>

        <div className="card">
          <div className="card-h">
            <h3><span className="tagdot" style={{ background: C.amber }} />Budget Distribution</h3>
            <span className="hint">Annual</span>
          </div>
          <div className="chh sm" style={{ position: 'relative' }}>
            <Doughnut
              data={{
                labels: budgetChannels.map(c => c.label),
                datasets: [{ data: budgetChannels.map(c => c.value), backgroundColor: budgetChannels.map(c => c.color), borderWidth: 2, borderColor: '#fff' }],
              }}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ₹${c.raw} Cr` } } } }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 600 }}>₹{totalBudget}</span>
              <span style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>Cr · FY 26–27</span>
            </div>
          </div>
          <div className="legend">
            {budgetChannels.map(ch => (
              <div key={ch.label} className="li"><span className="sw" style={{ background: ch.color }} />{ch.label} <b>₹{ch.value}Cr</b></div>
            ))}
          </div>
        </div>
      </div>

      {/* Pacing + Lift + Health */}
      <div className="grid g3">
        <div className="card">
          <div className="card-h"><h3>Spend pacing vs flight plan</h3><span className="hint">₹ Cr / month</span></div>
          <div className="chh sm">
            <Chart type="bar"
              data={{
                labels: MONTHS,
                datasets: [
                  { type: 'bar'  as const, label: 'TV',      data: mediaMode !== 'digital' ? p.paceTV  : Array(12).fill(null), backgroundColor: C.ink, stack: 's', borderRadius: 3 },
                  { type: 'bar'  as const, label: 'Digital', data: mediaMode !== 'tv'      ? p.paceDig : Array(12).fill(null), backgroundColor: C.pb,  stack: 's', borderRadius: 3 },
                  { type: 'line' as const, label: 'Plan',    data: mediaMode === 'combo' ? p.pacePlan : Array(12).fill(null), borderColor: C.amber, borderWidth: 2, borderDash: [5, 4], pointRadius: 0, tension: 0.3 },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: noGrid }, y: { grid: GRID, ticks: { callback: (v: string | number) => '₹' + v } } } }}
            />
          </div>
          <div className="statline" style={{ marginTop: 10, justifyContent: 'space-between' }}>
            <div className="s"><span className="v" style={{ fontSize: 16, color: C.ink }}>{p.spend}</span><span className="l">Planned</span></div>
            <div className="s"><span className="v" style={{ fontSize: 16, color: C.pb }}>{p.spent}</span><span className="l">Spent YTD</span></div>
            <div className="s"><span className="v" style={{ fontSize: 16, color: C.green }}>{p.pace}</span><span className="l">On pace</span></div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Brand lift study — pre vs post</h3><span className="hint">Δ points</span></div>
          <div className="chh sm">
            <Bar
              data={{
                labels: ['Awareness', 'Consideration', 'Intent', 'Trust', 'Preference'],
                datasets: [{ label: 'Δ points', data: [9.2, 12.4, 6.8, 8.1, 5.4], backgroundColor: [C.pb, C.violet, C.cyan, C.green, C.amber], borderRadius: 5 }],
              }}
              options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` +${c.raw} pts post-campaign` } } }, scales: { x: { grid: GRID, ticks: { callback: v => '+' + v } }, y: { grid: noGrid } } }}
            />
          </div>
          <div className="legend">
            {[['Awareness', '+9.2', C.pb], ['Consideration', '+12.4', C.violet], ['Intent', '+6.8', C.cyan], ['Trust', '+8.1', C.green], ['Preference', '+5.4', C.amber]].map(([k, v, c]) => (
              <div key={k as string} className="li"><span className="sw" style={{ background: c as string }} />{k as string} <b>{v as string} pts</b></div>
            ))}
          </div>
        </div>

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

      <div className="foot-note">Illustrative dataset modelled on the PolicyBazaar brand media brief (May 2026) for pitch demonstration. Figures are simulated to show the measurement architecture, not actuals.</div>
    </>
  );
}
