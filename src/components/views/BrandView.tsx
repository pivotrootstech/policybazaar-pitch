'use client';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useDashboard } from '@/context/DashboardContext';
import { C } from '@/lib/colors';
import { BR_TABLE_ROWS, TV_MARKET_GRP, TV_CHAN_GRP, MEDIA_DATA } from '@/lib/data';
import KpiCard from '@/components/ui/KpiCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };
const GRP_X  = [0, 100, 200, 300, 400, 500, 600, 700, 800];

export default function BrandView() {
  const { mediaMode } = useDashboard();
  const m = MEDIA_DATA[mediaMode];

  const rfDatasets = [
    { label: 'TV + Digital', data: [0,22,38,48,55,60,62,63.5,64], borderColor: C.pb, backgroundColor: C.pb + '33', fill: true, borderWidth: 3, tension: 0.4, pointRadius: 0, hidden: mediaMode === 'tv' || mediaMode === 'digital' },
    { label: 'TV only',      data: [0,18,30,38,44,48,51,53,54],   borderColor: C.muted, borderDash: [6,4], borderWidth: 2, tension: 0.4, pointRadius: 0, fill: false, hidden: mediaMode === 'digital' },
    { label: 'Digital only', data: [0,14,24,31,36,39,40,40.5,41], borderColor: C.amber, borderDash: [2,3], borderWidth: 2, tension: 0.4, pointRadius: 0, fill: false, hidden: mediaMode !== 'digital' },
  ];

  const tableRows = BR_TABLE_ROWS.filter(r =>
    mediaMode === 'combo' ? true : mediaMode === 'tv' ? r.media === 'tv' : r.media === 'digital'
  );

  return (
    <>
      <div className="view-head">
        <div>
          <div className="eyebrow">Brand Health · Upper Funnel</div>
          <h2>Brand Metrics</h2>
        </div>
        <div className="view-meta">
          Currency: <b>Net Reach (000s) · TG M 26–48 Urban</b><br />
          Source: BARC + OTT log-level + panel fusion
        </div>
      </div>

      <div className="grid g4">
        <KpiCard accentColor={C.pb}     name="1+ Net Reach"      value={m.reachPct} valueSuffix="%" delta={m.brDelta}     footLeft={m.brFoot} />
        <KpiCard accentColor={C.amber}  name="Avg Frequency"     value={m.freq}     valueSuffix="x" delta="● optimal band 3–5" deltaType="flat" footLeft={m.freqFoot} />
        <KpiCard accentColor={C.cyan}   name="Video VTR"         value={m.vtr}      valueSuffix="%" delta={m.vtrDelta}    footLeft={m.vtrFoot} />
        <KpiCard accentColor={C.violet} name="High-Income Reach" value={m.hi}       valueSuffix="%" delta="▲ NCCS A / ₹15L+ HHI" footLeft="fixed-impression buys" />
      </div>

      {/* R&F curve + Frequency dist */}
      <div className="grid g23">
        <div className="card">
          <div className="card-h"><h3>Reach &amp; frequency build curve</h3><span className="hint">{m.rfHint}</span></div>
          <div className="card-sub">Cumulative 1+ net reach as GRPs / impressions accumulate. The gap between TV+Digital and TV-only is the incremental reach digital unlocks.</div>
          <div className="chh lg">
            <Line data={{ labels: GRP_X, datasets: rfDatasets }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${c.raw}% net reach` } } },
                scales: { x: { grid: GRID, title: { display: true, text: 'Cumulative target GRPs / impressions (index)' } }, y: { grid: GRID, ticks: { callback: v => v + '%' }, title: { display: true, text: '1+ net reach' } } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Frequency distribution</h3><span className="hint">% of reached TG</span></div>
          <div className="chh">
            <Bar data={{ labels: ['1','2','3','4','5','6','7+'], datasets: [{ data: [12,10,16,18,15,12,17], backgroundColor: ['#cdd9f2','#a9bdec',C.pbBright,C.pb,'#1d4ed8','#1e40af','#172e6b'], borderRadius: 4 }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}% at freq ${c.label}` } } }, scales: { x: { grid: noGrid, title: { display: true, text: 'Exposures' } }, y: { grid: GRID, ticks: { callback: v => v + '%' } } } }} />
          </div>
          <div className="insight" style={{ marginTop: 12 }}>
            <div className="ico">◎</div>
            <div className="txt"><b>22%</b> of reached audience sits at 1–2 exposures — a re-targetable shoulder for OTT/YouTube top-ups.</div>
          </div>
        </div>
      </div>

      {/* Incremental + Gauge + Trust */}
      <div className="grid g3">
        <div className="card">
          <div className="card-h"><h3>Incremental reach by channel</h3><span className="hint">over TV baseline</span></div>
          <div className="chh sm">
            <Bar data={{ labels: ['OTT','YouTube','CTV','Display'], datasets: [{ data: [19,12,5,2], backgroundColor: [C.pb,C.pbBright,C.cyan,C.violet], borderRadius: 5 }] }}
              options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` +${c.raw}% incremental reach` } } }, scales: { x: { grid: GRID, ticks: { callback: v => '+' + v + '%' } }, y: { grid: noGrid } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>High-income reach delivery</h3><span className="hint">NCCS A · ₹15L+ HHI</span></div>
          <div className="gauge-wrap" style={{ marginTop: 14 }}>
            <div className="gauge">
              <Doughnut data={{ datasets: [{ data: [parseInt(m.hi), 100 - parseInt(m.hi)], backgroundColor: [C.violet, '#ece9fb'], borderWidth: 0 }] }}
                options={{ responsive: true, maintainAspectRatio: false, cutout: '74%', circumference: 270, rotation: 225, plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
              <div className="gtext"><span className="gv">{m.hi}%</span><span className="gl">of target</span></div>
            </div>
            <div>
              <div className="statline" style={{ flexDirection: 'column', gap: 12 }}>
                <div className="s"><span className="v" style={{ color: C.pb }}>28.4M</span><span className="l">High-income TG reached</span></div>
                <div className="s"><span className="v" style={{ color: C.amber }}>₹248</span><span className="l">Cost per high-income reach point</span></div>
                <div className="s"><span className="v" style={{ color: C.violet }}>1.7×</span><span className="l">Index vs all-audience CPRP</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Brand trust &amp; consideration</h3><span className="hint">wave-on-wave</span></div>
          <div className="chh sm">
            <Line data={{ labels: ['Pre','W1','W4','W8','W12','Post'], datasets: [
              { label: 'Consideration', data: [34,37,42,45,47,46], borderColor: C.violet, borderWidth: 2.5, tension: 0.4, pointRadius: 3, pointBackgroundColor: C.violet },
              { label: 'Trust',         data: [41,42,45,48,49,49], borderColor: C.green,  borderWidth: 2.5, tension: 0.4, pointRadius: 3, pointBackgroundColor: C.green },
            ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: noGrid }, y: { grid: GRID, ticks: { callback: v => v + '%' } } } }} />
          </div>
          <div className="statline" style={{ marginTop: 10, justifyContent: 'space-around' }}>
            <div className="s"><span className="v" style={{ fontSize: 16, color: C.violet }}>34 → 46</span><span className="l">Consideration · +12 pts</span></div>
            <div className="s"><span className="v" style={{ fontSize: 16, color: C.green }}>41 → 49</span><span className="l">Trust · +8 pts</span></div>
          </div>
        </div>
      </div>

      {/* Channel scorecard */}
      <div className="card">
        <div className="card-h"><h3>Channel scorecard — brand layer</h3><span className="hint">fixed-impression / non-biddable inventory</span></div>
        <table>
          <thead><tr><th>Channel</th><th className="r">Delivery</th><th className="r">ACD</th><th className="r">Reach contrib.</th><th className="r">Avg freq</th><th className="r">VTR</th><th className="r">CPRP</th></tr></thead>
          <tbody>
            {tableRows.map(r => (
              <tr key={r.channel}>
                <td><span className="pill" style={{ background: r.color + '1a', color: r.color }}>●</span> {r.channel}</td>
                <td className="r mono">{r.delivery}</td>
                <td className="r mono">{r.acd}</td>
                <td className="r mono">{r.reach}</td>
                <td className="r mono">{r.freq}</td>
                <td className="r mono">{r.vtr}</td>
                <td className="r mono">{r.cprp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="foot-note">TV in GRPs with ACD mix; digital in impressions. CPRP = cost per rating point equiv. ¹ Linear TV spot-completion proxy.</div>
      </div>

      {/* TV Deep-Dive */}
      <div className="view-head" style={{ marginTop: 26, marginBottom: 14 }}>
        <div>
          <div className="eyebrow" style={{ color: C.ink }}>Television · GRP &amp; Reach Deep-Dive</div>
          <h2 style={{ fontSize: 20 }}>TV delivery — GRP, SOV, reach &amp; CPRP</h2>
        </div>
        <div className="view-meta">Currency: <b>BARC · TG M 26–48 Urban</b><br />Daypart: predominantly Prime Time</div>
      </div>

      <div className="grid g4">
        <KpiCard accentColor={C.ink}   name="Total GRPs"         value="1,240" delta="▲ vs 1,150 planned"      footLeft="target-GRPs · TG" />
        <KpiCard accentColor={C.pb}    name="Category SOV (GRP)" value="31"    valueSuffix="%" delta="▲ leads category" footLeft="share of category GRPs" />
        <KpiCard accentColor={C.cyan}  name="Reach 1+ / 3+"      value="64"    valueSuffix="%" delta="▲ 3+ above 40% threshold" footLeft="net of TV panel" />
        <KpiCard accentColor={C.amber} name="CPRP · actual"       value="₹172" delta="▼ vs ₹185 planned" deltaType="up" footLeft="cost / rating point" />
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="card-h"><h3>CPRP — planned vs actual</h3><span className="hint">₹ per rating point · by market</span></div>
          <div className="chh">
            <Bar data={{ labels: ['HSM','TN','Kar','AP+TL','Ker','WB','Mah'], datasets: [
              { label: 'Planned', data: [178,205,196,188,198,210,182], backgroundColor: '#c7d2e6', borderRadius: 4 },
              { label: 'Actual',  data: [172,198,191,183,205,201,176], backgroundColor: C.pb,     borderRadius: 4 },
            ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ₹${c.raw} CPRP` } } }, scales: { x: { grid: noGrid }, y: { grid: GRID, ticks: { callback: v => '₹' + v } } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>GRP split by genre</h3><span className="hint">GEC · News · Sports · Movies · Regional</span></div>
          <div className="chh">
            <Doughnut data={{ labels: ['GEC','News','Sports','Movies','Regional','Music/Other'], datasets: [{ data: [42,16,18,9,12,3], backgroundColor: [C.pb,C.amber,C.green,C.violet,C.cyan,C.muted], borderWidth: 2, borderColor: '#fff' }] }}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'right' }, tooltip: { callbacks: { label: c => ` ${c.label}: ${c.raw}% of GRPs` } } } }} />
          </div>
        </div>
      </div>

      {/* BARC market table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-h"><h3>Market-wise GRP &amp; reach delivery</h3><span className="hint">Urban · BARC · Target&apos;000 / GRP / Cov&apos;000 / OTS / 1+ / 3+ / 5+</span></div>
        <table>
          <thead><tr><th>Market Urban</th><th className="r">Target&#x27;000</th><th className="r">GRP</th><th className="r">Cov&#x27;000</th><th className="r">OTS</th><th className="r">1+</th><th className="r">3+</th><th className="r">5+</th></tr></thead>
          <tbody>
            {TV_MARKET_GRP.map((r, i) => (
              <tr key={r.market} className={i === 0 ? 'hl' : ''}>
                <td>{r.market}</td>
                <td className="r mono">{r.target.toLocaleString('en-IN')}</td>
                <td className="r mono">{r.grp}</td>
                <td className="r mono">{r.cov.toLocaleString('en-IN')}</td>
                <td className="r mono">{r.ots}</td>
                <td className="r mono">{r.r1}</td>
                <td className="r mono">{r.r3}</td>
                <td className="r mono">{r.r5}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="foot-note">Target&apos;000 = TG universe in thousands · GRP = gross rating points · Cov&apos;000 = covered audience · OTS = avg frequency · 1+/3+/5+ = % of TG reached at that frequency.</div>
      </div>

      {/* Genre & channel table + bar */}
      <div className="grid g23">
        <div className="card">
          <div className="card-h"><h3>GRP by genre &amp; channel — HSM</h3><span className="hint">channel-level delivery</span></div>
          <table>
            <thead><tr><th>Market</th><th>Genre</th><th>Channel</th><th className="r">GRPs</th></tr></thead>
            <tbody>
              {TV_CHAN_GRP.map(r => (
                <tr key={r.channel}>
                  <td>{r.market}</td>
                  <td><span className="pill" style={{ background: r.color + '1a', color: r.color }}>{r.genre}</span></td>
                  <td>{r.channel}</td>
                  <td className="r mono">{r.grp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-h"><h3>Genre contribution</h3><span className="hint">HSM · share of GRP</span></div>
          <div className="chh">
            <Bar data={{ labels: ['GEC 1','GEC HD','News (Hin)','News (Eng)'], datasets: [{ label: 'GRPs', data: [90,27,25,3], backgroundColor: [C.pb,C.pbBright,C.amber,C.violet], borderRadius: 5 }] }}
              options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw} GRPs` } } }, scales: { x: { grid: GRID, title: { display: true, text: 'GRPs' } }, y: { grid: noGrid } } }} />
          </div>
          <div className="foot-note">GEC carries the bulk of HSM weight; News adds frequency at low CPRP; HD genres extend high-income reach.</div>
        </div>
      </div>
    </>
  );
}
