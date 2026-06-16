# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A Next.js 14 (App Router) media intelligence dashboard built as a pitch demo for PolicyBazaar's FY 26–27 media agency pitch. The original `index.html` single-file version is preserved alongside the Next.js app.

## Development

```bash
npm run dev       # dev server at http://localhost:3000
npm run build     # production build (run this to check for type errors)
npm run lint      # ESLint
```

## Architecture

**Stack**: Next.js 14 App Router · TypeScript · Tailwind CSS + custom CSS variables · react-chartjs-2 · React Context

```
src/
├── app/
│   ├── globals.css          # Full design system (CSS vars, layout, card/table/chart classes)
│   ├── layout.tsx           # Fonts (Inter, Space Grotesk, JetBrains Mono)
│   └── page.tsx             # Wraps <DashboardProvider> + <Dashboard>
├── context/
│   └── DashboardContext.tsx # Global state: mediaMode, activeView, period, market, category, attrModel
├── lib/
│   ├── colors.ts            # C palette constant — use these everywhere, never hardcode hex
│   ├── types.ts             # Shared TypeScript interfaces
│   └── data.ts              # All chart/table data: PERIOD_DATA, MEDIA_DATA, funnel steps, market rows, etc.
└── components/
    ├── dashboard/
    │   ├── Dashboard.tsx    # Shell: Sidebar + Topbar + view switcher
    │   ├── Sidebar.tsx      # Nav with Monitor / Intelligence groups
    │   └── Topbar.tsx       # Period/Market/Category filters + media toggle + export button
    ├── ui/
    │   ├── KpiCard.tsx      # Reusable KPI tile with optional sparkline
    │   ├── FunnelChart.tsx  # Custom div-based funnel (not Chart.js)
    │   ├── Sparkline.tsx    # Tiny line chart for KPI cards
    │   └── SankeyDiagram.tsx # Pure SVG Sankey for the attribution view
    └── views/
        ├── OverviewView.tsx
        ├── BrandView.tsx
        ├── PerformanceView.tsx
        ├── MarketsView.tsx
        ├── AttributionView.tsx
        └── CompetitionView.tsx
```

### State management

`DashboardContext` holds all global state. Views consume it with `useDashboard()`. The period filter drives `PERIOD_DATA[period]` lookups that update KPIs and chart data reactively — no imperative DOM manipulation.

### Chart pattern

Every view component registers only the Chart.js components it needs at the top of the file (idempotent). Mixed bar+line charts use react-chartjs-2's generic `<Chart type="bar">` with per-dataset `type` overrides — using `<Bar>` for mixed types causes TypeScript errors.

### Data is illustrative

All numbers are simulated to match the spec document. To update data, edit `src/lib/data.ts`. Keep numbers internally consistent (quarterly `PERIOD_DATA` entries should sum to the full-year values, and `leads × lead→policy rate ≈ policies`).
