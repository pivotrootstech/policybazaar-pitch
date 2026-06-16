import * as XLSX from 'xlsx';
import {
  WATERFALL_STEPS, BUDGET_CHANNELS, BR_TABLE_ROWS,
  TV_MARKET_GRP, TV_CHAN_GRP, MARKET_ROWS, COMPETITOR_ROWS,
  PERIOD_DATA, ATTR_DATA,
} from './data';

/* ── helpers ─────────────────────────────────────────────────────────────── */
type Row = (string | number)[];

function section(title: string): Row[] {
  return [[], [`== ${title} ==`]];
}

function header(...cols: string[]): Row {
  return cols;
}

/* ── build the full flat data table ─────────────────────────────────────── */
export function buildRows(): Row[] {
  const rows: Row[] = [];

  /* 1 ─ Campaign Overview KPIs */
  rows.push(...section('CAMPAIGN OVERVIEW KPIs (FY 26–27 Full Year)'));
  rows.push(header('Metric', 'Value', 'Notes'));
  rows.push(['Net Reach (TG)', '134M', '64% of 210M TG universe']);
  rows.push(['Incremental Reach over TV', '+38%', '36.4M cord-cutters added via OTT/YT']);
  rows.push(['GRPs Delivered', '1,240', 'vs 1,150 planned']);
  rows.push(['Category SOV', '31%', 'Leads category']);
  rows.push(['Sessions', '33.0M', 'Site + app']);
  rows.push(['Leads (Enquiries)', '8.6M', '+27% YoY']);
  rows.push(['Qualified Leads', '3.9M', 'Agent-verified']);
  rows.push(['Policies Issued', '0.61M', 'Converted']);
  rows.push(['Brand-Attributed Policies', '34%', 'MMM + view-through']);
  rows.push(['Total Budget', '₹150 Cr', 'TV ₹100 Cr + Digital ₹50 Cr']);
  rows.push(['Spend YTD', '₹71 Cr', '98% on pace']);
  rows.push(['Blended Cost / Policy', '₹2,459', '']);
  rows.push(['Impression → Policy Rate', '0.025%', '']);
  rows.push(['Lead → Policy Rate', '7.1%', '']);

  /* 2 ─ Period Comparison */
  rows.push(...section('PERIOD COMPARISON'));
  rows.push(header('Period', 'Reach', 'Reach %', 'GRPs', 'SOV', 'Sessions (M)', 'Leads (M)', 'Lead YoY', 'Policies (M)', 'Spend', 'Spent', 'On Pace', 'Cost/Policy'));
  Object.entries(PERIOD_DATA).forEach(([period, d]) => {
    rows.push([period, d.reach + 'M', d.reachPct + '%', d.grp, d.sov, d.sessions, d.leads, d.leadYoY, d.policies, d.spend, d.spent, d.pace, d.costPolicy]);
  });

  /* 3 ─ Media Waterfall */
  rows.push(...section('MEDIA WATERFALL FUNNEL'));
  rows.push(header('Stage', 'Label', 'Value (Index)', 'Display', 'Stage Conversion'));
  WATERFALL_STEPS.forEach((s, i) => {
    const prev = i === 0 ? null : WATERFALL_STEPS[i - 1];
    const conv = i === 0 ? '100%' : `${((s.value / prev!.value) * 100).toFixed(1)}%`;
    rows.push([i + 1, s.label, s.value, s.display, conv]);
  });

  /* 4 ─ Budget Distribution */
  rows.push(...section('BUDGET DISTRIBUTION'));
  rows.push(header('Channel', 'Budget (₹ Cr)', 'Type', 'Share %'));
  const totalBudget = BUDGET_CHANNELS.reduce((a, b) => a + b.value, 0);
  BUDGET_CHANNELS.forEach(c => {
    rows.push([c.label, c.value, c.type === 'tv' ? 'TV' : 'Digital', `${((c.value / totalBudget) * 100).toFixed(1)}%`]);
  });
  rows.push(['TOTAL', totalBudget, '', '100%']);

  /* 5 ─ Brand Health Channel Scorecard */
  rows.push(...section('BRAND HEALTH – CHANNEL SCORECARD'));
  rows.push(header('Channel', 'Media Type', 'Delivery', 'ACD', 'Reach Contrib.', 'Avg Frequency', 'VTR', 'CPRP'));
  BR_TABLE_ROWS.forEach(r => {
    rows.push([r.channel, r.media === 'tv' ? 'TV' : 'Digital', r.delivery, r.acd, r.reach, r.freq, r.vtr, r.cprp]);
  });

  /* 6 ─ TV Deep-Dive KPIs */
  rows.push(...section('TV DEEP-DIVE – KEY METRICS'));
  rows.push(header('Metric', 'Value', 'Notes'));
  rows.push(['Total GRPs', '1,240', 'vs 1,150 planned']);
  rows.push(['Category SOV (GRP)', '31%', 'Leads category']);
  rows.push(['Reach 1+', '64%', 'Net of TV panel']);
  rows.push(['Reach 3+', '42%', 'Above 40% threshold']);
  rows.push(['CPRP Actual', '₹172', 'vs ₹185 planned']);

  /* 7 ─ TV Market-wise GRP & Reach */
  rows.push(...section('TV DELIVERY – MARKET-WISE GRP & REACH (BARC)'));
  rows.push(header('Market', "Target'000", 'GRP', "Cov'000", 'OTS', '1+%', '3+%', '5+%'));
  TV_MARKET_GRP.forEach(r => {
    rows.push([r.market, r.target, r.grp, r.cov, r.ots, r.r1, r.r3, r.r5]);
  });

  /* 8 ─ TV Genre & Channel GRPs */
  rows.push(...section('TV DELIVERY – GENRE & CHANNEL GRPs (HSM)'));
  rows.push(header('Market', 'Genre', 'Channel', 'GRPs'));
  TV_CHAN_GRP.forEach(r => {
    rows.push([r.market, r.genre, r.channel, r.grp]);
  });

  /* 9 ─ Brand Lift */
  rows.push(...section('BRAND LIFT STUDY – PRE vs POST'));
  rows.push(header('Metric', 'Pre Score', 'Post Score', 'Delta (pts)'));
  rows.push(['Awareness',     '', '', '+9.2']);
  rows.push(['Consideration', '34', '46', '+12.4']);
  rows.push(['Intent',        '', '', '+6.8']);
  rows.push(['Trust',         '41', '49', '+8.1']);
  rows.push(['Preference',    '', '', '+5.4']);

  /* 10 ─ Performance Funnel */
  rows.push(...section('PERFORMANCE FUNNEL – PAID DIGITAL'));
  rows.push(header('Stage', 'Volume', 'Stage Conversion'));
  const perfSteps = [
    { label: 'Clicks',      val: '41.2M', conv: '—' },
    { label: 'Sessions',    val: '33.0M', conv: '80.0%' },
    { label: 'Leads',       val: '8.6M',  conv: '20.9% (CTL)' },
    { label: 'Qualified',   val: '3.9M',  conv: '45.3%' },
    { label: 'Conversions', val: '0.61M', conv: '7.1% (CVR)' },
  ];
  perfSteps.forEach(s => rows.push([s.label, s.val, s.conv]));

  /* 11 ─ Performance Channel Scorecard */
  rows.push(...section('PERFORMANCE – CHANNEL SCORECARD'));
  rows.push(header('Channel', 'Clicks', 'CTL', 'CPL', 'CVR', 'Verified Leads', 'CP Verified Lead'));
  rows.push(['Search',   '18.2M', '23%', '₹212', '9.4%', '2.9M', '₹318']);
  rows.push(['Social',   '9.1M',  '17%', '₹248', '5.2%', '0.9M', '₹402']);
  rows.push(['YouTube',  '8.0M',  '19%', '₹268', '6.8%', '0.8M', '₹389']);
  rows.push(['Display',  '5.9M',  '12%', '₹392', '4.1%', '0.3M', '₹611']);

  /* 12 ─ Leads & Spend by Category */
  rows.push(...section('PERFORMANCE – LEADS & SPEND BY CATEGORY'));
  rows.push(header('Category', 'Leads (M)', 'Spend (₹ Cr)', 'CPL (blended)'));
  rows.push(['Health',      '3.4', '9.8',  '₹256']);
  rows.push(['Term',        '2.1', '7.4',  '₹388']);
  rows.push(['Motor',       '2.4', '5.1',  '₹298']);
  rows.push(['Investments', '0.7', '2.9',  '₹431']);
  rows.push(['TOTAL',       '8.6', '25.2', '₹294 (blended)']);

  /* 13 ─ Lead Pipeline by Product */
  rows.push(...section('LEAD LIFECYCLE – PIPELINE BY PRODUCT'));
  rows.push(header('Product', 'Total Leads', 'Contacted', 'Quote Shared', 'Callback Queue', 'Payment Pending', 'Converted', 'Dropped'));
  rows.push(['Health',      '3.40M', '2.62M', '1.71M', '0.46M', '0.16M', '0.27M', '1.71M']);
  rows.push(['Term',        '2.10M', '1.55M', '0.96M', '0.31M', '0.11M', '0.13M', '1.20M']);
  rows.push(['Motor',       '2.40M', '1.78M', '1.18M', '0.28M', '0.08M', '0.17M', '1.30M']);
  rows.push(['Investments', '0.70M', '0.45M', '0.25M', '0.07M', '0.03M', '0.04M', '0.34M']);
  rows.push(['TOTAL',       '8.60M', '6.40M', '4.10M', '1.12M', '0.38M', '0.61M', '4.55M']);

  /* 14 ─ Pipeline drop-off */
  rows.push(...section('LEAD PIPELINE – STAGE DROP-OFF'));
  rows.push(header('Stage', 'Drop-off %'));
  rows.push(['Lead → Contact',        '26%']);
  rows.push(['Contact → Quote',       '36%']);
  rows.push(['Quote → Payment',       '76%']);
  rows.push(['Payment → Conversion',  '38%']);

  /* 15 ─ Market Scorecard */
  rows.push(...section('MARKETS – STATE DELIVERY SCORECARD'));
  rows.push(header('Market', 'Tier', 'Reach %', 'Leads', 'CPL', 'Lead YoY'));
  MARKET_ROWS.forEach(r => {
    rows.push([r.market, r.tier.toUpperCase(), r.reachPct + '%', r.leads, r.cpl, r.leadYoY]);
  });

  /* 16 ─ Attribution MMM */
  rows.push(...section('ATTRIBUTION – MARKETING MIX MODEL'));
  rows.push(header('Attribution Model', 'Brand %', 'Performance %', 'Base / Organic %'));
  rows.push(['MMM (Bayesian)',  ATTR_DATA.mmm[0], ATTR_DATA.mmm[1], ATTR_DATA.mmm[2]]);
  rows.push(['Data-Driven',    ATTR_DATA.dda[0], ATTR_DATA.dda[1], ATTR_DATA.dda[2]]);
  rows.push(['Last-Touch',     ATTR_DATA.lt[0],  ATTR_DATA.lt[1],  ATTR_DATA.lt[2]]);

  rows.push(...section('ATTRIBUTION – KEY SIGNALS'));
  rows.push(header('Metric', 'Value', 'Notes'));
  rows.push(['Brand-driven policy share (MMM)', '34%',   '']);
  rows.push(['Branded search uplift in-flight',  '+41%',  'vs dark weeks']);
  rows.push(['View-through conversions',          '0.18M', '30-day window, device-matched']);
  rows.push(['Adstock half-life',                 '3.2 weeks', 'Geometric decay fit']);
  rows.push(['Brand-assisted ROI multiple',       '2.9×',  '']);

  /* 17 ─ Competitive SOV */
  rows.push(...section('COMPETITIVE – SHARE OF VOICE & SPEND TRACKER'));
  rows.push(header('Advertiser', 'Est. Monthly Spend', 'SOV', 'Spend Index (vs Jan)', 'Category Focus'));
  COMPETITOR_ROWS.forEach(r => {
    rows.push([r.name, r.spend, r.sov, r.index, r.focus]);
  });

  /* 18 ─ Competitive SOV by Market */
  rows.push(...section('COMPETITIVE – SOV BY PRIORITY MARKET'));
  rows.push(header('Market', 'PolicyBazaar SOV %', 'Category Avg %'));
  [['HSM-U', 38], ['TN-U', 24], ['Kar-U', 29], ['AP+TL-U', 31], ['Ker-U', 27], ['WB-U', 30], ['Mah-U', 35]].forEach(([m, v]) => {
    rows.push([m, v, 33]);
  });

  return rows;
}

/* ── Export as Excel (.xlsx) ─────────────────────────────────────────────── */
export function exportExcel() {
  const rows = buildRows();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  /* column widths */
  ws['!cols'] = [
    { wch: 36 }, { wch: 18 }, { wch: 18 }, { wch: 14 },
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PB Media Intelligence');
  XLSX.writeFile(wb, 'PolicyBazaar_Media_Intelligence_FY26-27.xlsx');
}

/* ── Export as CSV ───────────────────────────────────────────────────────── */
export function exportCSV() {
  const rows = buildRows();
  const csv = rows
    .map(row =>
      row.map(cell => {
        const s = String(cell ?? '');
        return s.includes(',') || s.includes('"') || s.includes('\n')
          ? `"${s.replace(/"/g, '""')}"`
          : s;
      }).join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'PolicyBazaar_Media_Intelligence_FY26-27.csv';
  a.click();
  URL.revokeObjectURL(url);
}
