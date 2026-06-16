import { C } from './colors';
import type {
  MediaKPIs, PeriodData, FunnelStep, BrTableRow, MarketRow, CompetitorRow
} from './types';

// ─── Media toggle KPI data ─────────────────────────────────────────────────
export const MEDIA_DATA: Record<string, MediaKPIs> = {
  combo: {
    reach: '134', reachPct: '64', reachDelta: '▲ 64% of 210M TG universe',
    brDelta: '▲ vs 54% TV-only', brFoot: '134M of TG',
    freq: '4.3', freqFoot: '3+ reach: 71% of reached',
    vtr: '71', vtrDelta: '▲ +6pts vs benchmark', vtrFoot: 'completed views / starts',
    hi: '48', rfHint: 'TV + Digital · gap vs TV = incremental',
  },
  tv: {
    reach: '113', reachPct: '54', reachDelta: '▲ 54% of 210M TG universe',
    brDelta: 'TV Prime Time', brFoot: '113M of TG',
    freq: '5.1', freqFoot: '3+ reach: 78% of reached',
    vtr: '92', vtrDelta: 'spot completion ¹', vtrFoot: 'linear TV — GRP basis',
    hi: '39', rfHint: 'TV only · Prime-Time GRPs',
  },
  digital: {
    reach: '86', reachPct: '41', reachDelta: '▲ 41% of 210M TG universe',
    brDelta: 'OTT + YT + Display', brFoot: '86M of TG',
    freq: '3.4', freqFoot: '3+ reach: 58% of reached',
    vtr: '68', vtrDelta: '▲ +3pts vs benchmark', vtrFoot: 'completed views / starts',
    hi: '44', rfHint: 'Digital only · fixed-impression',
  },
};

// ─── Period filter data ────────────────────────────────────────────────────
export const PERIOD_DATA: Record<string, PeriodData> = {
  'FY 26–27 (Full)': {
    reach: '134', reachPct: '64', reachDelta: '▲ 64% of 210M TG universe',
    grp: '1,240', grpDelta: '▲ vs 1,150 planned', sov: '31%',
    sessions: '33.0', leads: '8.6', leadYoY: '+27%',
    policies: '0.61', spend: '₹150 Cr', spent: '₹71 Cr', pace: '98%',
    imprPolicy: '0.025%', reachEnq: '3.6%', leadPolicy: '7.1%', costPolicy: '₹2,459',
    paceTV:   [9, 10, 8, 7, 8, 8, 11, 10, 9, 7, 6, 7],
    paceDig:  [4,  5, 4, 4, 4, 4,  6,  5, 5, 3, 3, 3],
    pacePlan: [13,15,12,11,12,12, 17, 15,14,10, 9,10],
  },
  'Q1 · Apr–Jun': {
    reach: '89', reachPct: '42', reachDelta: '▲ 42% of 210M TG universe',
    grp: '310', grpDelta: '▲ vs 295 planned', sov: '28%',
    sessions: '8.4', leads: '2.1', leadYoY: '+23%',
    policies: '0.14', spend: '₹38 Cr', spent: '₹38 Cr', pace: '101%',
    imprPolicy: '0.021%', reachEnq: '3.2%', leadPolicy: '6.7%', costPolicy: '₹2,714',
    paceTV:   [9,10,8,null,null,null,null,null,null,null,null,null],
    paceDig:  [4, 5,4,null,null,null,null,null,null,null,null,null],
    pacePlan: [13,15,12,null,null,null,null,null,null,null,null,null],
  },
  'Q2 · Jul–Sep': {
    reach: '108', reachPct: '51', reachDelta: '▲ 51% of 210M TG universe',
    grp: '380', grpDelta: '▲ vs 365 planned', sov: '30%',
    sessions: '11.0', leads: '2.8', leadYoY: '+25%',
    policies: '0.19', spend: '₹33 Cr', spent: '₹33 Cr', pace: '96%',
    imprPolicy: '0.023%', reachEnq: '3.4%', leadPolicy: '6.8%', costPolicy: '₹2,631',
    paceTV:   [null,null,null,7,8,8,null,null,null,null,null,null],
    paceDig:  [null,null,null,4,4,4,null,null,null,null,null,null],
    pacePlan: [null,null,null,11,12,12,null,null,null,null,null,null],
  },
  'Festive · Oct–Dec': {
    reach: '127', reachPct: '60', reachDelta: '▲ 60% of 210M TG universe',
    grp: '550', grpDelta: '▲ vs 520 planned', sov: '33%',
    sessions: '13.6', leads: '3.7', leadYoY: '+31%',
    policies: '0.28', spend: '₹49 Cr', spent: '₹49 Cr', pace: '99%',
    imprPolicy: '0.028%', reachEnq: '3.9%', leadPolicy: '7.6%', costPolicy: '₹2,214',
    paceTV:   [null,null,null,null,null,null,11,10,9,null,null,null],
    paceDig:  [null,null,null,null,null,null, 6, 5,5,null,null,null],
    pacePlan: [null,null,null,null,null,null,17,15,14,null,null,null],
  },
};

// ─── Overview waterfall funnel ──────────────────────────────────────────────
export const WATERFALL_STEPS: FunnelStep[] = [
  { label: 'Paid impressions', sub: 'TV GRP-eq + digital', value: 2410, display: '2.41 B', color: C.ink },
  { label: 'Net reach (1+)',    sub: 'de-duplicated TG',    value: 1340, display: '134 M',  color: C.pb },
  { label: 'Site / app sessions', sub: 'engaged visits',   value:  330, display: '33.0 M', color: C.pbBright },
  { label: 'Enquiries (leads)', sub: 'high-intent',        value:   86, display: '8.6 M',  color: C.cyan },
  { label: 'Qualified leads',   sub: 'agent-verified',     value:   39, display: '3.9 M',  color: C.amber },
  { label: 'Policies issued',   sub: 'converted',          value:  6.1, display: '0.61 M', color: C.green },
];

export const BUDGET_CHANNELS = [
  { label: 'TV (PT)',       value: 100, color: C.ink,      type: 'tv' },
  { label: 'OTT',           value:  18, color: C.pb,       type: 'digital' },
  { label: 'YouTube',       value:  12, color: C.pbBright, type: 'digital' },
  { label: 'Social',        value:   8, color: C.cyan,     type: 'digital' },
  { label: 'Display',       value:   5, color: C.violet,   type: 'digital' },
  { label: 'Search / Perf', value:   7, color: C.amber,    type: 'digital' },
] as const;

// ─── Brand health channel scorecard ─────────────────────────────────────────
export const BR_TABLE_ROWS: BrTableRow[] = [
  { channel: 'TV — Prime Time',  color: C.ink,      media: 'tv',      delivery: '1,240 GRPs', acd: '10/15/20s', reach: '54%', freq: '3.9×', vtr: '92%¹', cprp: '₹172' },
  { channel: 'OTT (fixed-imp)',  color: C.pb,       media: 'digital', delivery: '420 M impr', acd: '20s',       reach: '19%', freq: '2.8×', vtr: '74%',  cprp: '₹243' },
  { channel: 'YouTube',          color: C.pbBright, media: 'digital', delivery: '310 M impr', acd: '15s',       reach: '12%', freq: '3.1×', vtr: '68%',  cprp: '₹198' },
  { channel: 'Connected TV',     color: C.cyan,     media: 'digital', delivery: '95 M impr',  acd: '20s',       reach:  '5%', freq: '2.2×', vtr: '81%',  cprp: '₹291' },
  { channel: 'Premium Display',  color: C.violet,   media: 'digital', delivery: '180 M impr', acd: '—',         reach:  '2%', freq: '1.9×', vtr: '—',    cprp: '₹156' },
];

// ─── Market data ─────────────────────────────────────────────────────────────
export const MARKET_ROWS: MarketRow[] = [
  { market: 'HSM Urban',         tier: 'p1', reachPct: 62, leads: '3.1 M', cpl: '₹262', leadYoY: '+34%' },
  { market: 'AP + TL Urban',     tier: 'p1', reachPct: 54, leads: '1.2 M', cpl: '₹288', leadYoY: '+26%' },
  { market: 'Karnataka Urban',   tier: 'p1', reachPct: 51, leads: '1.0 M', cpl: '₹291', leadYoY: '+24%' },
  { market: 'Tamil Nadu Urban',  tier: 'p1', reachPct: 48, leads: '0.9 M', cpl: '₹305', leadYoY: '+22%', highlight: true },
  { market: 'Kerala Urban',      tier: 'p1', reachPct: 46, leads: '0.6 M', cpl: '₹312', leadYoY: '+19%' },
  { market: 'West Bengal Urban', tier: 'p1', reachPct: 44, leads: '0.7 M', cpl: '₹318', leadYoY: '+21%' },
  { market: 'Maharashtra Urban', tier: 'p1', reachPct: 58, leads: '1.4 M', cpl: '₹271', leadYoY: '+28%' },
  { market: 'Gujarat Urban',     tier: 'p2', reachPct: 49, leads: '0.5 M', cpl: '₹309', leadYoY: '+18%' },
  { market: 'Punjab Urban',      tier: 'p2', reachPct: 47, leads: '0.3 M', cpl: '₹322', leadYoY: '+16%' },
  { market: 'Odisha Urban',      tier: 'p2', reachPct: 41, leads: '0.2 M', cpl: '₹341', leadYoY: '+14%' },
];

// ─── Performance funnel ───────────────────────────────────────────────────────
export const PERF_FUNNEL: FunnelStep[] = [
  { label: 'Clicks',       sub: 'paid digital',           value: 412, display: '41.2 M', color: C.pb },
  { label: 'Sessions',     sub: 'engaged visits',         value: 330, display: '33.0 M', color: C.pbBright },
  { label: 'Leads',        sub: 'CTL 20.9%',              value:  86, display: '8.6 M',  color: C.cyan },
  { label: 'Qualified',    sub: 'agent-verified',         value:  39, display: '3.9 M',  color: C.amber },
  { label: 'Conversions',  sub: 'CVR 7.1%',               value: 6.1, display: '0.61 M', color: C.green },
];

export const PIPELINE_FUNNEL: FunnelStep[] = [
  { label: 'Total leads',       sub: 'enquiries',              value: 86,  display: '8.6 M',  color: C.ink },
  { label: 'Contacted',         sub: 'call-centre reached',    value: 64,  display: '6.4 M',  color: C.pb },
  { label: 'Quote shared',      sub: 'comparison delivered',   value: 41,  display: '4.1 M',  color: C.pbBright },
  { label: 'Payment initiated', sub: 'plan selected',          value: 9.9, display: '0.99 M', color: C.cyan },
  { label: 'Converted',         sub: 'policy issued',          value: 6.1, display: '0.61 M', color: C.green },
];

// ─── Competitor data ──────────────────────────────────────────────────────────
export const COMPETITOR_ROWS: CompetitorRow[] = [
  { name: 'PolicyBazaar',    color: C.pb,     spend: '₹12.4 Cr', sov: '31%', index: '+51 idx', focus: 'Health · Term' },
  { name: 'Acko',            color: C.amber,  spend: '₹7.2 Cr',  sov: '18%', index: '+31 idx', focus: 'Motor · Health' },
  { name: 'Direct insurers', color: C.muted,  spend: '₹10.8 Cr', sov: '27%', index: '+10 idx', focus: 'Term · Invest' },
  { name: 'Ditto / advisory',color: C.violet, spend: '₹2.1 Cr',  sov: '12%', index: '+22 idx', focus: 'Term' },
  { name: 'Other aggregators',color: C.cyan,  spend: '₹2.4 Cr',  sov: '12%', index: '+8 idx',  focus: 'Motor' },
];

// ─── Attribution model data ───────────────────────────────────────────────────
export const ATTR_DATA: Record<string, number[]> = {
  mmm: [34, 48, 18],
  dda: [28, 54, 18],
  lt:  [11, 71, 18],
};

// ─── TV market-wise GRP table ─────────────────────────────────────────────────
export const TV_MARKET_GRP = [
  { market: 'India Urban',                target: 115341, grp: 118, cov: 22766, ots: 6, r1: 20, r3:  9, r5: 6 },
  { market: 'HSM Urban',                  target:  79963, grp: 164, cov: 21960, ots: 6, r1: 27, r3: 13, r5: 8 },
  { market: 'Mega Cities',                target:  32781, grp: 150, cov:  7402, ots: 7, r1: 23, r3: 12, r5: 8 },
  { market: 'Guj / D&D / DNH – Urban',   target:   8639, grp: 138, cov:  2390, ots: 5, r1: 28, r3: 12, r5: 8 },
  { market: 'Odisha – Urban',             target:   1907, grp: 136, cov:   419, ots: 6, r1: 22, r3: 10, r5: 5 },
  { market: 'Bihar / Jharkhand – Urban',  target:   3967, grp: 199, cov:  1020, ots: 8, r1: 25, r3: 12, r5: 7 },
  { market: 'MP / Chhattisgarh – Urban',  target:   7025, grp: 174, cov:  2192, ots: 6, r1: 31, r3: 14, r5: 9 },
  { market: 'Pun / Cha – Urban',          target:   4238, grp: 167, cov:  1216, ots: 6, r1: 28, r3: 15, r5:10 },
  { market: 'West Bengal – Urban',        target:   6129, grp: 103, cov:  1013, ots: 6, r1: 16, r3:  9, r5: 6 },
  { market: 'Mah / Goa – Urban',          target:  18238, grp: 150, cov:  4823, ots: 6, r1: 26, r3: 12, r5: 8 },
];

// ─── TV genre/channel GRP table (HSM) ────────────────────────────────────────
export const TV_CHAN_GRP = [
  { market: 'HSM', genre: 'GEC 1',    channel: 'Star Plus',    grp: 30, color: C.pb },
  { market: 'HSM', genre: 'GEC 1',    channel: 'Colors',       grp: 25, color: C.pb },
  { market: 'HSM', genre: 'GEC 1',    channel: 'Zee TV',       grp: 35, color: C.pb },
  { market: 'HSM', genre: 'GEC 1 HD', channel: 'Star Plus HD', grp:  7, color: C.pbBright },
  { market: 'HSM', genre: 'GEC 1 HD', channel: 'Colors HD',    grp:  8, color: C.pbBright },
  { market: 'HSM', genre: 'GEC 1 HD', channel: 'Zee TV HD',    grp:  5, color: C.pbBright },
  { market: 'HSM', genre: 'GEC 2 HD', channel: 'Sony SAB HD',  grp:  7, color: C.cyan },
  { market: 'HSM', genre: 'Hin News', channel: 'Aaj Tak',      grp: 10, color: C.amber },
  { market: 'HSM', genre: 'Hin News', channel: 'Republic Bharat', grp: 10, color: C.amber },
  { market: 'HSM', genre: 'Hin News', channel: 'News Nation',  grp:  5, color: C.amber },
  { market: 'HSM', genre: 'Eng News', channel: 'Times Now',    grp:  1, color: C.violet },
  { market: 'HSM', genre: 'Eng News', channel: 'Republic TV',  grp:  2, color: C.violet },
];

// ─── Sparkline seed data ─────────────────────────────────────────────────────
export const SPARK_DATA = {
  reach:    [40, 46, 52, 55, 60, 62, 64],
  incr:     [20, 24, 28, 30, 34, 36, 38],
  grp:      [980,1040,1090,1130,1180,1210,1240],
  leads:    [5.1, 6.0, 6.6, 7.2, 7.9, 8.3, 8.6],
  policies: [0.31,0.38,0.44,0.50,0.55,0.58,0.61],
};
