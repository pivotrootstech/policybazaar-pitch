export type MediaMode = 'combo' | 'tv' | 'digital';
export type ViewId = 'overview' | 'brand' | 'brandperf' | 'performance' | 'markets' | 'attribution' | 'competition';
export type AttrModel = 'mmm' | 'dda' | 'lt';

export interface MediaKPIs {
  reach: string;
  reachPct: string;
  reachDelta: string;
  brDelta: string;
  brFoot: string;
  freq: string;
  freqFoot: string;
  vtr: string;
  vtrDelta: string;
  vtrFoot: string;
  hi: string;
  rfHint: string;
}

export interface PeriodData {
  reach: string;
  reachPct: string;
  reachDelta: string;
  grp: string;
  grpDelta: string;
  sov: string;
  sessions: string;
  leads: string;
  leadYoY: string;
  policies: string;
  spend: string;
  spent: string;
  pace: string;
  imprPolicy: string;
  reachEnq: string;
  leadPolicy: string;
  costPolicy: string;
  paceTV: (number | null)[];
  paceDig: (number | null)[];
  pacePlan: (number | null)[];
}

export interface FunnelStep {
  label: string;
  sub: string;
  value: number;
  display: string;
  color: string;
}

export interface BrTableRow {
  channel: string;
  color: string;
  media: 'tv' | 'digital';
  delivery: string;
  acd: string;
  reach: string;
  freq: string;
  vtr: string;
  cprp: string;
}

export interface MarketRow {
  market: string;
  tier: 'p1' | 'p2';
  reachPct: number;
  leads: string;
  cpl: string;
  leadYoY: string;
  highlight?: boolean;
}

export interface CompetitorRow {
  name: string;
  color: string;
  spend: string;
  sov: string;
  index: string;
  focus: string;
}
