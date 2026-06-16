'use client';
import { useDashboard } from '@/context/DashboardContext';
import { exportExcel } from '@/lib/exportData';
import type { MediaMode } from '@/lib/types';

const VIEW_CRUMBS: Record<string, string> = {
  overview:    'Unified brand + performance intelligence with Cross Channel View',
  brand:       'Brand health · upper funnel · reach, frequency, VTR, trust',
  performance: 'Performance funnel · impression to policy economics',
  markets:     'Markets & category · P1/P2 with Tamil Nadu focus',
  attribution: 'Brand → Performance · MMM & multi-touch attribution',
  competition: 'Competitive share of voice & spend tracking',
};

const PERIODS = ['FY 26–27 (Full)', 'Q1 · Apr–Jun', 'Q2 · Jul–Sep', 'Festive · Oct–Dec'];
const MARKETS = ['All Markets', 'P1 · HSM-U', 'P1 · TN-U', 'P1 · Kar-U', 'P1 · AP+TL-U', 'P2 · Guj-U'];
const CATS    = ['All Categories', 'Health', 'Term', 'Motor', 'Investments'];


export default function Topbar() {
  const {
    mediaMode, setMediaMode, activeView,
    period, setPeriod, market, setMarket, category, setCategory,
  } = useDashboard();

  return (
    <header className="topbar">
      {/* ── Left: title + subtitle ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="topbar-title">PolicyBazaar X Havas Converged Dashboard</div>
        <div className="topbar-crumb">{VIEW_CRUMBS[activeView]}</div>
      </div>

      {/* ── Right: 2-row filter block ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>

        {/* Row 1: dropdown chips + export */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="chip">
            <span className="lbl">Period</span>
            <select value={period} onChange={e => setPeriod(e.target.value)}>
              {PERIODS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="chip">
            <span className="lbl">Market</span>
            <select value={market} onChange={e => setMarket(e.target.value)}>
              {MARKETS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="chip">
            <span className="lbl">Category</span>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Export button */}
          <button
            onClick={exportExcel}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px',
              border: '1px solid #E4EAF3',
              borderRadius: 14,
              background: '#F7FAFE',
              color: 'var(--ink)',
              fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap', transition: '.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F7FAFE'; e.currentTarget.style.color = 'var(--ink)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Excel
          </button>
        </div>

        {/* Row 2: media toggle + synced */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="seg">
            {(['combo', 'tv', 'digital'] as MediaMode[]).map(m => (
              <button
                key={m}
                className={mediaMode === m ? 'on' : ''}
                onClick={() => setMediaMode(m)}
              >
                {m === 'combo' ? 'TV + Digital' : m === 'tv' ? 'TV Only' : 'Digital Only'}
              </button>
            ))}
          </div>
          <div className="live">
            <span className="pulse" />
            Synced
          </div>
        </div>

      </div>
    </header>
  );
}
