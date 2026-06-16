'use client';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, ScatterController, Title, Tooltip, Legend,
} from 'chart.js';
import { Doughnut, Line, Scatter, Chart } from 'react-chartjs-2';
import { C } from '@/lib/colors';
import { COMPETITOR_ROWS } from '@/lib/data';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, ScatterController, Title, Tooltip, Legend);

const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };

export default function CompetitionView() {
  return (
    <>
      <div className="view-head">
        <div>
          <div className="eyebrow">Competitive Intelligence</div>
          <h2>Share of voice &amp; spend tracking</h2>
          <p>Estimated SOV against insurers and aggregators, with a spend index and SOV-vs-SOM gap.</p>
        </div>
        <div className="view-meta">Source: <b>est. via impression scraping + ad-library + panel</b><br />Refreshed weekly</div>
      </div>

      <div className="grid g23">
        <div className="card">
          <div className="card-h"><h3>Share of voice — category</h3><span className="hint">est. paid impressions, all media</span></div>
          <div className="chh">
            <Doughnut data={{ labels: ['PolicyBazaar','Acko','Ditto / others','Insurers (direct)','Other aggregators'], datasets: [{ data: [31,18,12,27,12], backgroundColor: [C.pb,C.amber,C.violet,C.muted,C.cyan], borderWidth: 2, borderColor: '#fff' }] }}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => ` ${c.raw}% SOV` } } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>SOV vs SOM gap</h3><span className="hint">excess share of voice</span></div>
          <div className="card-sub">Brands above the diagonal are &quot;investing to grow&quot; (SOV &gt; market share). PolicyBazaar&apos;s positive eSOV supports share gains.</div>
          <div className="chh">
            <Scatter
              data={{ datasets: [
                { label: 'PolicyBazaar',    data: [{ x: 24, y: 31 }], backgroundColor: C.pb,     pointRadius: 11 },
                { label: 'Acko',            data: [{ x: 14, y: 18 }], backgroundColor: C.amber,  pointRadius:  9 },
                { label: 'Direct insurers', data: [{ x: 34, y: 27 }], backgroundColor: C.muted,  pointRadius: 10 },
                { label: 'Ditto/others',    data: [{ x:  9, y: 12 }], backgroundColor: C.violet, pointRadius:  7 },
              ] }}
              options={{ responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: SOM ${(c.raw as {x:number}).x}%, SOV ${(c.raw as {y:number}).y}%` } } },
                scales: {
                  x: { grid: GRID, title: { display: true, text: 'Market share (SOM) %' }, max: 40 },
                  y: { grid: GRID, title: { display: true, text: 'Share of voice %' },      max: 40 },
                } }}
            />
          </div>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="card-h"><h3>Spend index trend</h3><span className="hint">indexed to Jan = 100</span></div>
          <div className="chh">
            <Line data={{ labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [
              { label: 'PolicyBazaar',    data: [100,108,121,134,142,151], borderColor: C.pb,    borderWidth: 2.5, tension: 0.4, pointRadius: 0 },
              { label: 'Acko',            data: [100,112,118,109,124,131], borderColor: C.amber, borderWidth: 2,   tension: 0.4, pointRadius: 0 },
              { label: 'Direct insurers', data: [100,101,104, 98,107,110], borderColor: C.muted, borderWidth: 2,   tension: 0.4, pointRadius: 0 },
            ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: noGrid }, y: { grid: GRID } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>SOV by priority market</h3><span className="hint">PolicyBazaar share %</span></div>
          <div className="chh">
            <Chart type="bar" data={{ labels: ['HSM-U','TN-U','Kar-U','AP+TL-U','Ker-U','WB-U','Mah-U'], datasets: [
              { type: 'bar'  as const, label: 'PolicyBazaar SOV', data: [38,24,29,31,27,30,35], backgroundColor: C.pb, borderRadius: 5 },
              { type: 'line' as const, label: 'Category avg',     data: [33,33,33,33,33,33,33], borderColor: C.red, borderDash: [5,4], borderWidth: 1.5, pointRadius: 0 },
            ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: noGrid }, y: { grid: GRID, ticks: { callback: (v: string | number) => v + '%' } } } }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-h"><h3>Competitive spend tracker</h3><span className="hint">est. monthly · digital + TV</span></div>
        <table>
          <thead><tr><th>Advertiser</th><th className="r">Est. monthly spend</th><th className="r">SOV</th><th className="r">Spend index (vs Jan)</th><th>Category focus</th></tr></thead>
          <tbody>
            {COMPETITOR_ROWS.map(r => (
              <tr key={r.name}>
                <td><span className="pill" style={{ background: r.color + '1a', color: r.color }}>●</span> {r.name}</td>
                <td className="r mono">{r.spend}</td>
                <td className="r mono">{r.sov}</td>
                <td className="r tiny-up">{r.index}</td>
                <td>{r.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="foot-note">eSOV = SOV minus market share. Estimates blend ad-library scraping, impression-share modelling and TV monitoring; treat as directional, not audited spend.</div>
      </div>
    </>
  );
}
