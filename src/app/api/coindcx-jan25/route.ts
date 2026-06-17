import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// RAW sheet cols: 0=CampaignPlacementSite, 1=SR#, 2=Date, 3=Campaign_Duration,
// 4=Month, 5=Campaign, 6=Placement, 7=Site(CM360), 8=Group-By,
// 9=Publisher_Name, 10=Ad Type, 11=campaign type, 12=TYPE,
// 13=Publisher_Platform, 14=PUB_TYPE, 15=Spends, 16=Impressions, 17=Clicks, 18=Views

export interface BrandRecord {
  month: string;
  publisher: string;
  campaignType: string;
  adType: string;
  impressions: number;
  clicks: number;
  views: number;
  spends: number;
}

export interface BrandDataResponse {
  records: BrandRecord[];
  months: string[];
  campaignTypes: string[];
  publishers: string[];
  adTypes: string[];
  overallTotals: {
    impressions: number;
    clicks: number;
    views: number;
    spends: number;
    ctr: number;
    vtr: number;
    avgCPM: number;
  };
}

const EXCLUDE_AD = new Set([
  'TV', 'Print', 'Offline', 'TV-Cricket-Offine', 'ET-USER-Print', 'TV Business News (Offline)',
]);

const MONTH_ORDER = [
  'Oct-24','Nov-24','Dec-24','Jan-25','Feb-25','Mar-25',
  'Apr-25','May-25','Jun-25','Jul-25','Aug-25','Sep-25',
  'Oct-25','Nov-25','Dec-25','Jan-26','Feb-26','Mar-26','Apr-26','May-26','Jun-26',
];

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', "COIN_DCX_JAN'25_DAILY_REPORT.xlsx");
    const buf = fs.readFileSync(filePath);
    const wb  = XLSX.read(buf, { type: 'buffer' });
    const ws  = wb.Sheets['RAW'];
    const raw = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 }) as unknown[][];

    // Aggregate by (month, publisher, campaignType, adType)
    const aggMap = new Map<string, BrandRecord>();

    for (const row of raw.slice(1)) {
      if (!Array.isArray(row)) continue;
      const month       = String(row[4]  ?? '');
      const adType      = String(row[10] ?? '');
      const campaignType = String(row[11] ?? '');
      if (!month || EXCLUDE_AD.has(adType) || campaignType === 'Offline') continue;

      const publisher = String(row[9] ?? 'Unknown');
      const imp  = Number(row[16]) || 0;
      const clk  = Number(row[17]) || 0;
      const viw  = Number(row[18]) || 0;
      const spd  = Number(row[15]) || 0;

      const key = `${month}||${publisher}||${campaignType}||${adType}`;
      const ex  = aggMap.get(key);
      if (ex) {
        ex.impressions += imp;
        ex.clicks      += clk;
        ex.views       += viw;
        ex.spends      += spd;
      } else {
        aggMap.set(key, { month, publisher, campaignType, adType, impressions: imp, clicks: clk, views: viw, spends: spd });
      }
    }

    const records: BrandRecord[] = Array.from(aggMap.values())
      .map(r => ({ ...r, spends: Math.round(r.spends * 100) / 100 }))
      .filter(r => r.impressions > 0)
      .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month));

    const months = Array.from(new Set(records.map(r => r.month)))
      .sort((a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b));

    const campaignTypes = Array.from(new Set(records.map(r => r.campaignType))).sort();
    const publishers    = Array.from(new Set(records.map(r => r.publisher))).sort();
    const adTypes       = Array.from(new Set(records.map(r => r.adType))).sort();

    const totImp = records.reduce((s, r) => s + r.impressions, 0);
    const totClk = records.reduce((s, r) => s + r.clicks, 0);
    const totViw = records.reduce((s, r) => s + r.views, 0);
    const totSpd = records.reduce((s, r) => s + r.spends, 0);
    const r2 = (n: number) => Math.round(n * 100) / 100;

    return NextResponse.json<BrandDataResponse>({
      records,
      months,
      campaignTypes,
      publishers,
      adTypes,
      overallTotals: {
        impressions: totImp,
        clicks:      totClk,
        views:       totViw,
        spends:      r2(totSpd),
        ctr:         r2(totImp > 0 ? (totClk / totImp) * 100 : 0),
        vtr:         r2(totImp > 0 ? (totViw / totImp) * 100 : 0),
        avgCPM:      r2(totImp > 0 ? (totSpd / totImp) * 1000 : 0),
      },
    });
  } catch (err) {
    console.error('CoinDCX brand data error:', err);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
