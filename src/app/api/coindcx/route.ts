import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export interface CoinDCXRow {
  month:       string;
  impressions: number;
  clicks:      number;
  spends:      number;
  installs:    number;
  signups:     number;
  naps:        number;
  // derived
  ctr:         number;  // clicks / impressions (%)
  cpi:         number;  // spends / installs (₹)
  installToSignup: number; // signups / installs (%)
  cps:         number;  // spends / signups (₹)
}

function serialToMonth(v: string | number): string {
  if (typeof v === 'string') {
    return v.replace('Sept', 'Sep').replace("'", ' ');
  }
  const d = new Date(Math.round((v - 25569) * 86400 * 1000));
  return d.toLocaleString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}

function fmt(n: number, decimals = 2): number {
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'coindcx.xlsx');
    const buf  = fs.readFileSync(filePath);
    const wb   = XLSX.read(buf, { type: 'buffer' });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const raw  = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1 }) as (string | number)[][];

    // row 0 = empty, row 1 = header, rows 2+ = data
    const rows: CoinDCXRow[] = raw.slice(2)
      .filter(r => r[2] !== undefined && r[3] !== undefined)
      .map(r => {
        const imp  = Number(r[3]) || 0;
        const clk  = Number(r[4]) || 0;
        const spd  = Number(r[5]) || 0;
        const ins  = Number(r[6]) || 0;
        const sig  = Number(r[7]) || 0;
        const nap  = Number(r[8]) || 0;
        return {
          month:           serialToMonth(r[2] as string | number),
          impressions:     imp,
          clicks:          clk,
          spends:          spd,
          installs:        ins,
          signups:         sig,
          naps:            nap,
          ctr:             fmt(imp > 0 ? (clk / imp) * 100 : 0, 3),
          cpi:             fmt(ins > 0 ? spd / ins : 0, 2),
          installToSignup: fmt(ins > 0 ? (sig / ins) * 100 : 0, 2),
          cps:             fmt(sig > 0 ? spd / sig : 0, 2),
        };
      })
      .reverse(); // oldest → newest

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error('CoinDCX API error:', err);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
