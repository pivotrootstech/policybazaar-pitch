'use client';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useDashboard } from '@/context/DashboardContext';
import { C } from '@/lib/colors';
import { MARKET_ROWS } from '@/lib/data';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };

function heatColor(v: number) {
  const t = (v - 40) / 24;
  const r = Math.round(221 - (221 - 37)  * t);
  const g = Math.round(231 - (231 - 99)  * t);
  const b = Math.round(250 - (250 - 235) * t);
  return `rgb(${r},${g},${b})`;
}

export default function MarketsView() {
  const { market: filterMarket } = useDashboard();

  const rows = filterMarket === 'All Markets'
    ? MARKET_ROWS
    : MARKET_ROWS.filter(r => {
        const f = filterMarket.toLowerCase();
        return r.market.toLowerCase().includes(f.replace(/^p[12]\s·\s/i,'').replace(/-u$/i,'').trim().toLowerCase());
      });

  return (
    <>
      <div className="view-head">
        <div>
          <div className="eyebrow">Markets &amp; Category</div>
          <h2>Market Performance</h2>
          <p>P1/P2 state delivery with Tamil Nadu broken out. Reach, leads and efficiency, market by market.</p>
        </div>
        <div className="view-meta">Priority: <b>P1</b> HSM·AP+TL·Kar·TN·Ker·WB·Mah · <b>P2</b> Odisha·Pun·Guj</div>
      </div>

      <div className="grid g23">
        <div className="card">
          <div className="card-h"><h3>State delivery scorecard</h3><span className="hint">urban · TG net reach &amp; leads</span></div>
          <table>
            <thead><tr><th>Market</th><th>Tier</th><th className="r">Reach %</th><th className="r">Leads</th><th className="r">CPL</th><th className="r">Lead YoY</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.market} className={r.highlight ? 'hl' : ''}>
                  <td>{r.market}{r.highlight && <span style={{ color: C.amber }}> ★</span>}</td>
                  <td><span className={`pill ${r.tier}`}>{r.tier.toUpperCase()}</span></td>
                  <td className="r">
                    <span className="cell" style={{ background: heatColor(r.reachPct) }}>{r.reachPct}%</span>
                  </td>
                  <td className="r mono">{r.leads}</td>
                  <td className="r mono">{r.cpl}</td>
                  <td className="r tiny-up">{r.leadYoY}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="legend-scale">
            <span>Reach %</span>
            <span className="grad" />
            <span>low → high</span>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3><span className="tagdot" style={{ background: C.cyan }} />Leads per market</h3><span className="hint">urban · YTD</span></div>
          <div className="card-sub">Where leads are coming from — the demand counterpart to the reach scorecard.</div>
          <div className="chh lg">
            <Bar
              data={{ labels: ['HSM-U','Mah-U','AP+TL-U','Kar-U','WB-U','TN-U','Ker-U','Guj-U','Pun-U','Odisha-U'],
                datasets: [{ label: 'Leads', data: [3.10,1.40,1.20,1.00,0.70,0.90,0.60,0.50,0.30,0.20],
                  backgroundColor: ['#1d4ed8',C.pb,C.pb,C.pb,C.pbBright,C.pbBright,C.pbBright,C.cyan,C.cyan,C.cyan],
                  borderRadius: 5 }] }}
              options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}M leads` } } }, scales: { x: { grid: GRID, title: { display: true, text: 'Leads (M)' } }, y: { grid: noGrid } } }}
            />
          </div>
          <div className="statline" style={{ marginTop: 12, justifyContent: 'space-around', borderTop: '1px solid var(--line)', paddingTop: 12 }}>
            <div className="s"><span className="v" style={{ fontSize: 16, color: C.pb }}>3.1M</span><span className="l">HSM — top market</span></div>
            <div className="s"><span className="v" style={{ fontSize: 16, color: C.cyan }}>78%</span><span className="l">P1 share of leads</span></div>
            <div className="s"><span className="v" style={{ fontSize: 16, color: C.amber }}>₹262</span><span className="l">Lowest CPL (HSM)</span></div>
          </div>
        </div>
      </div>

      <div className="grid g3">
        <div className="card">
          <div className="card-h"><h3>Lead share by priority tier</h3><span className="hint">P1 vs P2</span></div>
          <div className="chh sm">
            <Doughnut data={{ labels: ['P1 markets','P2 markets'], datasets: [{ data: [78,22], backgroundColor: [C.pb,C.violet], borderWidth: 2, borderColor: '#fff' }] }}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => ` ${c.raw}% of leads` } } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Category mix by region</h3><span className="hint">North vs South</span></div>
          <div className="chh sm">
            <Bar data={{ labels: ['North/HSM','South','East','West'], datasets: [
              { label: 'Health',     data: [42,38,36,40], backgroundColor: C.cyan,   stack: 's', borderRadius: 3 },
              { label: 'Term',       data: [28,22,24,26], backgroundColor: C.pb,     stack: 's', borderRadius: 3 },
              { label: 'Motor',      data: [22,28,26,24], backgroundColor: C.violet, stack: 's', borderRadius: 3 },
              { label: 'Invest',     data: [ 8,12,14,10], backgroundColor: C.amber,  stack: 's', borderRadius: 3 },
            ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: noGrid }, y: { grid: GRID, stacked: true, ticks: { callback: v => v + '%' } } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Language-creative VTR</h3><span className="hint">10 TVC languages</span></div>
          <div className="chh sm">
            <Bar data={{ labels: ['Tamil','Telugu','Hindi','Kannada','Malayalam','Bengali','Marathi'],
              datasets: [{ data: [86,79,74,77,81,72,75], backgroundColor: [C.amber,C.pb,C.muted,C.pbBright,C.cyan,C.violet,C.green], borderRadius: 4 }] }}
              options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` VTR ${c.raw}%` } } }, scales: { x: { grid: GRID, ticks: { callback: v => v + '%' } }, y: { grid: noGrid } } }} />
          </div>
        </div>
      </div>
    </>
  );
}
