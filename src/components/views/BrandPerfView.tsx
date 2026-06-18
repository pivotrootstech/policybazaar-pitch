'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Doughnut, Chart } from 'react-chartjs-2';
import { C } from '@/lib/colors';
import KpiCard from '@/components/ui/KpiCard';
import type { BrandRecord, BrandDataResponse } from '@/app/api/Demo-jan25/route';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const GRID   = { color: '#EEF2F8', drawTicks: false as const };
const noGrid = { display: false };

const CT_COLORS: Record<string, string> = {
  'DSP':               C.pb,
  'ROS':               C.cyan,
  'Impact':            C.amber,
  'CTV/Video':         C.violet,
  'Union-Budget':      C.green,
  'TRUMP Impact':      C.ink,
  'TRUMP ROS':         C.muted,
  'Stitched-Video-Ads': C.pink,
  'ROS-OND':           '#38BDF8',
  'Impact-OND':        '#FCD34D',
  'Hotstar-OND':       '#FCA5A5',
  'Video-OND':         '#C4B5FD',
  'Twitter-OND':       '#93C5FD',
  'Reddit-OND':        '#FB923C',
  'Hotstar':           C.red,
  'News-ROS':          '#0E7490',
  'Targeted-ROS':      '#0369A1',
  'Video/OTT/Music':   '#7E22CE',
  'Cricket':           '#B45309',
  'Food-Tech-ROS':     '#15803D',
  'Food-Tech-Impact':  '#A16207',
};
const colorFor = (ct: string) => CT_COLORS[ct] ?? C.pb;

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

// ── Multi-select dropdown ──────────────────────────────────────────────────
interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  dotColor?: (v: string) => string;
  width?: number;
}
function MultiSelect({ label, options, selected, onChange, dotColor, width = 170 }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);

  const btnLabel = selected.length === 0
    ? `All ${label}s`
    : selected.length === 1
    ? selected[0]
    : `${selected.length} ${label}s selected`;

  const active = selected.length > 0;

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
          width, padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
          border: `1.5px solid ${active ? C.pb : '#E7ECF3'}`,
          background: active ? '#EFF4FF' : '#FAFBFC',
          color: active ? C.pb : '#5A6474',
          fontSize: 13, fontWeight: active ? 600 : 400,
          whiteSpace: 'nowrap', overflow: 'hidden',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: width - 32 }}>{btnLabel}</span>
        <span style={{ fontSize: 9, opacity: 0.6, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: '0.15s' }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 200,
          background: '#fff', border: '1px solid #E7ECF3', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(11,31,56,0.12)',
          minWidth: Math.max(width, 200), maxHeight: 280, overflowY: 'auto',
          padding: '6px 0',
        }}>
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              style={{ width: '100%', textAlign: 'left', padding: '5px 14px', fontSize: 12, color: C.red, background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F0F4FA', marginBottom: 2 }}
            >
              ✕ Clear
            </button>
          )}
          {options.map(opt => (
            <label
              key={opt}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', cursor: 'pointer', fontSize: 13,
                background: selected.includes(opt) ? '#EFF4FF' : 'transparent',
                color: C.ink,
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                style={{ accentColor: C.pb, flexShrink: 0 }}
              />
              {dotColor && (
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor(opt), flexShrink: 0 }} />
              )}
              <span style={{ lineHeight: 1.3 }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────
export default function BrandPerfView() {
  const [allRecords, setAllRecords] = useState<BrandRecord[]>([]);
  const [meta, setMeta] = useState<{
    months: string[]; campaignTypes: string[];
    publishers: string[]; adTypes: string[];
    overallTotals: BrandDataResponse['overallTotals'];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [selMonths,  setSelMonths]  = useState<string[]>([]);
  const [selCTs,     setSelCTs]     = useState<string[]>([]);
  const [selPubs,    setSelPubs]    = useState<string[]>([]);
  const [selAdTypes, setSelAdTypes] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/Demo-jan25')
      .then(r => r.json())
      .then((d: BrandDataResponse) => {
        setAllRecords(d.records);
        setMeta({
          months: d.months, campaignTypes: d.campaignTypes,
          publishers: d.publishers, adTypes: d.adTypes,
          overallTotals: d.overallTotals,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const clearAll = () => { setSelMonths([]); setSelCTs([]); setSelPubs([]); setSelAdTypes([]); };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    allRecords.filter(r =>
      (selMonths.length  === 0 || selMonths.includes(r.month)) &&
      (selCTs.length     === 0 || selCTs.includes(r.campaignType)) &&
      (selPubs.length    === 0 || selPubs.includes(r.publisher)) &&
      (selAdTypes.length === 0 || selAdTypes.includes(r.adType))
    ), [allRecords, selMonths, selCTs, selPubs, selAdTypes]);

  const fTotals = useMemo(() => {
    const imp = filtered.reduce((s, r) => s + r.impressions, 0);
    const clk = filtered.reduce((s, r) => s + r.clicks, 0);
    const viw = filtered.reduce((s, r) => s + r.views, 0);
    const spd = filtered.reduce((s, r) => s + r.spends, 0);
    return { imp, clk, viw, spd,
      ctr: imp > 0 ? (clk / imp) * 100 : 0,
      vtr: imp > 0 ? (viw / imp) * 100 : 0,
      cpm: imp > 0 ? (spd / imp) * 1000 : 0,
    };
  }, [filtered]);

  const monthTrend = useMemo(() => {
    if (!meta) return [];
    const map = new Map<string, { imp: number; spd: number; viw: number; clk: number }>();
    for (const r of filtered) {
      const ex = map.get(r.month) ?? { imp: 0, spd: 0, viw: 0, clk: 0 };
      ex.imp += r.impressions; ex.spd += r.spends;
      ex.viw += r.views;      ex.clk += r.clicks;
      map.set(r.month, ex);
    }
    return meta.months.filter(m => map.has(m)).map(m => ({ month: m, ...map.get(m)! }));
  }, [filtered, meta]);

  const ctBreakdown = useMemo(() => {
    const map = new Map<string, { imp: number; spd: number; viw: number }>();
    for (const r of filtered) {
      const ex = map.get(r.campaignType) ?? { imp: 0, spd: 0, viw: 0 };
      ex.imp += r.impressions; ex.spd += r.spends; ex.viw += r.views;
      map.set(r.campaignType, ex);
    }
    return Array.from(map.entries()).map(([ct, v]) => ({ ct, ...v })).sort((a, b) => b.imp - a.imp);
  }, [filtered]);

  const pubScorecard = useMemo(() => {
    const map = new Map<string, { publisher: string; ct: string; adType: string; imp: number; clk: number; viw: number; spd: number }>();
    for (const r of filtered) {
      const ex = map.get(r.publisher) ?? { publisher: r.publisher, ct: r.campaignType, adType: r.adType, imp: 0, clk: 0, viw: 0, spd: 0 };
      ex.imp += r.impressions; ex.clk += r.clicks;
      ex.viw += r.views;       ex.spd += r.spends;
      map.set(r.publisher, ex);
    }
    return Array.from(map.values())
      .map(p => ({ ...p,
        ctr: p.imp > 0 ? (p.clk / p.imp) * 100 : 0,
        vtr: p.imp > 0 ? (p.viw / p.imp) * 100 : 0,
        cpm: p.imp > 0 ? (p.spd / p.imp) * 1000 : 0,
      }))
      .sort((a, b) => b.imp - a.imp);
  }, [filtered]);

  const top10  = pubScorecard.slice(0, 10);
  const videoP = pubScorecard.filter(p => p.vtr > 0);
  const hasFilters = selMonths.length > 0 || selCTs.length > 0 || selPubs.length > 0 || selAdTypes.length > 0;

  if (loading) return <div style={{ padding: 40, color: C.muted }}>Loading campaign data…</div>;
  if (!meta)   return <div style={{ padding: 40, color: C.red  }}>Failed to load data.</div>;

  const activeCount = selMonths.length + selCTs.length + selPubs.length + selAdTypes.length;

  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="view-head">
        <div>
          <div className="eyebrow">Demo · RAW Sheet · Digital only</div>
          <h2>Brand Performance</h2>
        </div>
        <div className="view-meta" style={{ textAlign: 'right' }}>
          <b>{meta.months.length} months · {meta.publishers.length} publishers</b><br />
          Source: COIN_DCX_JAN&apos;25_DAILY_REPORT
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap',
        background: '#fff', border: '1px solid #E7ECF3', borderRadius: 12,
        padding: '16px 20px', marginBottom: 20,
        boxShadow: '0 1px 4px rgba(11,31,56,0.05)',
      }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Month */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Month</div>
            <MultiSelect
              label="Month" options={meta.months} selected={selMonths}
              onChange={setSelMonths} width={160}
            />
          </div>

          {/* Campaign Type */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Campaign Type</div>
            <MultiSelect
              label="Campaign Type" options={meta.campaignTypes} selected={selCTs}
              onChange={setSelCTs} dotColor={colorFor} width={190}
            />
          </div>

          {/* Publisher */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Publisher</div>
            <MultiSelect
              label="Publisher" options={meta.publishers} selected={selPubs}
              onChange={setSelPubs} width={190}
            />
          </div>

          {/* Ad Type */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Ad Type</div>
            <MultiSelect
              label="Ad Type" options={meta.adTypes} selected={selAdTypes}
              onChange={setSelAdTypes} width={160}
            />
          </div>
        </div>

        {/* Reset + active count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {hasFilters && (
            <span style={{ fontSize: 12, color: C.pb, fontWeight: 600 }}>
              {activeCount} filter{activeCount > 1 ? 's' : ''} active
            </span>
          )}
          <button
            onClick={clearAll}
            disabled={!hasFilters}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: hasFilters ? 'pointer' : 'default',
              border: `1.5px solid ${hasFilters ? C.red : '#E7ECF3'}`,
              background: hasFilters ? '#FFF0F0' : '#FAFBFC',
              color: hasFilters ? C.red : '#C0C8D4',
              transition: 'all 0.15s',
            }}
          >
            Reset filters
          </button>
        </div>
      </div>

      {/* ── KPI cards ────────────────────────────────────────────────────── */}
      <div className="grid g4">
        <KpiCard accentColor={C.pb}     name="Impressions"  value={fmtB(fTotals.imp)}  delta={`CTR ${fTotals.ctr.toFixed(3)}%`}    footLeft={hasFilters ? 'filtered view' : 'all months'} />
        <KpiCard accentColor={C.violet} name="Video Views"  value={fmtB(fTotals.viw)}  delta={`VTR ${fTotals.vtr.toFixed(1)}%`}    footLeft={`${videoP.length} video publishers`} />
        <KpiCard accentColor={C.amber}  name="Clicks"       value={fmtB(fTotals.clk)}  delta={`CPM ₹${fTotals.cpm.toFixed(0)}`}  footLeft="all campaigns" />
        <KpiCard accentColor={C.green}  name="Spends"       value={fmtCr(fTotals.spd)} delta={`${pubScorecard.length} publishers`} footLeft={hasFilters ? 'filtered' : 'all months'} />
      </div>

      {/* ── Month-wise trend ─────────────────────────────────────────────── */}
      <div className="card">
        <div className="card-h">
          <h3>Month-wise impressions &amp; spends</h3>
          <span className="hint">{hasFilters ? `${activeCount} filter${activeCount > 1 ? 's' : ''} applied` : 'all data'}</span>
        </div>
        <div className="chh lg">
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
                  label: 'Spends (₹)',
                  data: monthTrend.map(m => m.spd),
                  borderColor: C.amber,
                  backgroundColor: C.amber + '22',
                  borderWidth: 2.5,
                  tension: 0.4,
                  pointRadius: 4,
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
                tooltip: {
                  callbacks: {
                    label: c => c.dataset.label === 'Impressions'
                      ? ` ${fmtB(c.raw as number)} impressions`
                      : ` ${fmtCr(c.raw as number)} spends`,
                  },
                },
              },
              scales: {
                x:  { grid: noGrid },
                y:  { grid: GRID, position: 'left',  ticks: { callback: v => fmtB(v as number) },  title: { display: true, text: 'Impressions' } },
                y2: { grid: { display: false }, position: 'right', ticks: { callback: v => fmtCr(v as number) }, title: { display: true, text: 'Spends' } },
              },
            }}
          />
        </div>
      </div>

      {/* ── Campaign type breakdown + Spend share ───────────────────────── */}
      <div className="grid g23">
        <div className="card">
          <div className="card-h">
            <h3>Impressions by campaign type</h3>
            <span className="hint">{ctBreakdown.length} types</span>
          </div>
          <div className="chh lg">
            <Bar
              data={{
                labels: ctBreakdown.map(c => c.ct),
                datasets: [{ label: 'Impressions', data: ctBreakdown.map(c => c.imp), backgroundColor: ctBreakdown.map(c => colorFor(c.ct)), borderRadius: 5 }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${fmtB(c.raw as number)} impressions` } } },
                scales: { x: { grid: noGrid, ticks: { maxRotation: 35 } }, y: { grid: GRID, ticks: { callback: v => fmtB(v as number) } } },
              }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>Spend share</h3><span className="hint">by campaign type</span></div>
          <div className="chh">
            <Doughnut
              data={{
                labels: ctBreakdown.map(c => c.ct),
                datasets: [{ data: ctBreakdown.map(c => c.spd), backgroundColor: ctBreakdown.map(c => colorFor(c.ct)), borderWidth: 2, borderColor: '#fff' }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false, cutout: '58%',
                plugins: {
                  legend: { position: 'right', labels: { font: { size: 11 } } },
                  tooltip: { callbacks: { label: c => ` ${c.label}: ${fmtCr(c.raw as number)} (${Math.round((c.raw as number) / (fTotals.spd || 1) * 100)}%)` } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Top publishers + VTR ─────────────────────────────────────────── */}
      <div className="grid g2">
        <div className="card">
          <div className="card-h"><h3>Top publishers by impressions</h3><span className="hint">top 10</span></div>
          <div className="chh">
            <Bar
              data={{
                labels: top10.map(p => p.publisher),
                datasets: [{ label: 'Impressions', data: top10.map(p => p.imp), backgroundColor: top10.map(p => colorFor(p.ct) + 'cc'), borderRadius: 5 }],
              }}
              options={{
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: c => ` ${fmtB(c.raw as number)}`,
                      afterLabel: (c) => ` CTR: ${top10[c.dataIndex].ctr.toFixed(3)}%  CPM: ₹${top10[c.dataIndex].cpm.toFixed(0)}`,
                    },
                  },
                },
                scales: { x: { grid: GRID, ticks: { callback: v => fmtB(v as number) } }, y: { grid: noGrid } },
              }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-h"><h3>VTR — video publishers</h3><span className="hint">views / impressions %</span></div>
          {videoP.length === 0
            ? <div style={{ padding: 24, color: C.muted, fontSize: 13 }}>No video publishers in current selection.</div>
            : (
              <div className="chh">
                <Bar
                  data={{
                    labels: videoP.map(p => p.publisher),
                    datasets: [{ label: 'VTR %', data: videoP.map(p => +p.vtr.toFixed(1)), backgroundColor: videoP.map(p => colorFor(p.ct)), borderRadius: 5 }],
                  }}
                  options={{
                    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.raw}%` } } },
                    scales: { x: { grid: GRID, ticks: { callback: v => v + '%' } }, y: { grid: noGrid } },
                  }}
                />
              </div>
            )}
        </div>
      </div>

      {/* ── Publisher Scorecard ──────────────────────────────────────────── */}
      <div className="card">
        <div className="card-h">
          <h3>Publisher scorecard</h3>
          <span className="hint">{pubScorecard.length} publisher{pubScorecard.length !== 1 ? 's' : ''} · {hasFilters ? `${activeCount} filter${activeCount > 1 ? 's' : ''} applied` : 'all data'}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Publisher</th>
              <th>Campaign Type</th>
              <th>Ad Type</th>
              <th className="r">Impressions</th>
              <th className="r">Clicks</th>
              <th className="r">Views</th>
              <th className="r">CTR</th>
              <th className="r">VTR</th>
              <th className="r">CPM</th>
              <th className="r">Spends</th>
            </tr>
          </thead>
          <tbody>
            {pubScorecard.map((p, i) => (
              <tr key={i}>
                <td><span className="pill" style={{ background: colorFor(p.ct) + '1a', color: colorFor(p.ct) }}>●</span> {p.publisher}</td>
                <td><span className="pill" style={{ background: colorFor(p.ct) + '15', color: colorFor(p.ct), fontSize: 11 }}>{p.ct}</span></td>
                <td style={{ fontSize: 12, color: C.muted }}>{p.adType}</td>
                <td className="r mono">{fmtB(p.imp)}</td>
                <td className="r mono">{fmtB(p.clk)}</td>
                <td className="r mono">{p.viw > 0 ? fmtB(p.viw) : '—'}</td>
                <td className="r mono">{p.ctr.toFixed(3)}%</td>
                <td className="r mono">{p.vtr > 0 ? p.vtr.toFixed(1) + '%' : '—'}</td>
                <td className="r mono">₹{p.cpm.toFixed(0)}</td>
                <td className="r mono">{fmtCr(p.spd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="foot-note">TV · Print · Offline excluded. CTR = clicks/impressions · VTR = views/impressions · CPM = ₹ per 1,000 impressions.</div>
      </div>
    </>
  );
}
