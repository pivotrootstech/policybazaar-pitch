'use client';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useDashboard } from '@/context/DashboardContext';
import type { AttrModel } from '@/lib/types';
import { C } from '@/lib/colors';
import { ATTR_DATA } from '@/lib/data';
import SankeyDiagram from '@/components/ui/SankeyDiagram';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };
const MODELS: { key: AttrModel; label: string }[] = [
  { key: 'mmm', label: 'MMM' },
  { key: 'dda', label: 'Data-driven' },
  { key: 'lt',  label: 'Last-touch' },
];

export default function AttributionView() {
  const { attrModel, setAttrModel } = useDashboard();
  const atData = ATTR_DATA[attrModel];

  return (
    <>
      <div className="view-head">
        <div>
          <div className="eyebrow">Intelligence · Signature View</div>
          <h2>Attribution of brand on performance</h2>
          <p>How much of the lead &amp; policy outcome is <em>caused</em> by upper-funnel brand — marketing-mix model, view-through, and branded-search uplift in one flow.</p>
        </div>
        <div className="view-meta">Model: <b>Bayesian MMM + multi-touch</b><br />Confidence 86% · 18-mo training window</div>
      </div>

      {/* Sankey */}
      <div className="card flowcard" style={{ marginBottom: 16 }}>
        <div className="card-h"><h3>The halo, traced</h3><span className="hint">contribution-weighted flow · brand → outcome</span></div>
        <div className="flow-cols">
          <div className="fc-lab">Upper funnel · brand</div>
          <div className="fc-lab">Mid funnel · demand signal</div>
          <div className="fc-lab">Outcome · 0.61M policies</div>
        </div>
        <SankeyDiagram />
        <div className="statline" style={{ marginTop: 8, justifyContent: 'space-around', borderTop: '1px solid #1c365f', paddingTop: 14 }}>
          <div className="s"><span className="v" style={{ color: '#fbbf24' }}>34%</span><span className="l" style={{ color: '#9fb3d6' }}>Brand-driven policies</span></div>
          <div className="s"><span className="v" style={{ color: '#3B82F6' }}>+41%</span><span className="l" style={{ color: '#9fb3d6' }}>Branded-search uplift in flight</span></div>
          <div className="s"><span className="v" style={{ color: '#22d3ee' }}>0.18M</span><span className="l" style={{ color: '#9fb3d6' }}>View-through conversions</span></div>
          <div className="s"><span className="v" style={{ color: '#a78bfa' }}>2.9×</span><span className="l" style={{ color: '#9fb3d6' }}>Brand-assisted ROI multiple</span></div>
        </div>
      </div>

      <div className="grid g3">
        <div className="card">
          <div className="card-h"><h3>MMM contribution decomposition</h3><span className="hint">of total policies</span></div>
          <div className="chh sm">
            <Doughnut data={{ labels: ['Brand (TV/OTT)','Performance','Base / organic'], datasets: [{ data: [34,48,18], backgroundColor: [C.amber,C.pb,C.muted], borderWidth: 2, borderColor: '#fff' }] }}
              options={{ responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => ` ${c.raw}% of policies` } } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Branded search lift during flights</h3><span className="hint">indexed search demand</span></div>
          <div className="chh sm">
            <Line data={{ labels: ['W1','W2','W3','W4','W5','W6','W7','W8'], datasets: [
              { label: 'Branded search', data: [100,118,141,138,126,112,148,152], borderColor: C.pb, backgroundColor: C.pb + '33', fill: true, borderWidth: 2.5, tension: 0.4, pointRadius: 0 },
              { label: 'Brand on air',   data: [0,40,40,40,0,0,40,40],            borderColor: C.amber, backgroundColor: C.amber + '18', fill: true, borderWidth: 0, stepped: true, pointRadius: 0 },
            ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => c.datasetIndex === 0 ? ` index ${c.raw}` : (Number(c.raw) > 0 ? ' burst on air' : ' dark') } } }, scales: { x: { grid: noGrid }, y: { grid: GRID } } }} />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Diminishing returns by channel</h3><span className="hint">marginal CPL response</span></div>
          <div className="chh sm">
            <Line data={{ labels: [0,1,2,3,4,5,6,7,8], datasets: [
              { label: 'TV',     data: [0,30,52,67,77,84,88,90,91], borderColor: C.ink,   borderWidth: 2, tension: 0.4, pointRadius: 0 },
              { label: 'OTT',    data: [0,38,62,78,87,92,95,96,97], borderColor: C.pb,    borderWidth: 2, tension: 0.4, pointRadius: 0 },
              { label: 'Search', data: [0,48,73,86,93,96,98,99,99], borderColor: C.amber, borderWidth: 2, tension: 0.4, pointRadius: 0 },
            ] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: noGrid, title: { display: true, text: 'Spend (relative)' } }, y: { grid: GRID, ticks: { callback: v => v + '%' }, title: { display: true, text: 'Response captured' } } } }} />
          </div>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <div className="card-h">
            <h3>Attribution model comparison</h3>
            <div className="seg">
              {MODELS.map(mod => (
                <button key={mod.key} className={attrModel === mod.key ? 'on' : ''} onClick={() => setAttrModel(mod.key)}>
                  {mod.label}
                </button>
              ))}
            </div>
          </div>
          <div className="card-sub">How credit shifts by model. Last-touch starves brand; MMM &amp; data-driven recover its true contribution — the argument for funding the upper funnel.</div>
          <div className="chh">
            <Bar
              data={{ labels: ['Brand','Performance','Base'], datasets: [{ label: 'Credit %', data: atData, backgroundColor: [C.amber, C.pb, C.muted], borderRadius: 6 }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}% credit` } } }, scales: { x: { grid: noGrid }, y: { grid: GRID, ticks: { callback: v => v + '%' }, max: 80 } } }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Brand → lead lag &amp; carryover</h3><span className="hint">adstock decay</span></div>
          <div className="card-sub">Brand exposure keeps producing leads after spend stops. ~3.2-week half-life means TV/OTT bursts should lead category-buy moments.</div>
          <div className="chh">
            <Bar data={{ labels: ['Wk0','Wk1','Wk2','Wk3','Wk4','Wk5','Wk6'],
              datasets: [{ label: 'Lead impact from a brand burst', data: [100,62,38,24,15,9,6],
                backgroundColor: [C.amber, C.amber, C.pbBright, '#cdd9f2','#cdd9f2','#cdd9f2','#cdd9f2'], borderRadius: 5 }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}% of peak lead impact` } } }, scales: { x: { grid: noGrid }, y: { grid: GRID, ticks: { callback: v => v + '%' } } } }} />
          </div>
          <div className="insight" style={{ marginTop: 12 }}>
            <div className="ico">⟿</div>
            <div className="txt"><b>Planning rule:</b> front-load brand 2–3 weeks before performance pushes; ~38% of a burst&apos;s lead impact lands in the following fortnight.</div>
          </div>
        </div>
      </div>
    </>
  );
}
