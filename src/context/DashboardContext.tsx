'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import type { MediaMode, ViewId, AttrModel } from '@/lib/types';

interface DashboardState {
  mediaMode: MediaMode;
  setMediaMode: (m: MediaMode) => void;
  activeView: ViewId;
  setActiveView: (v: ViewId) => void;
  period: string;
  setPeriod: (p: string) => void;
  market: string;
  setMarket: (m: string) => void;
  category: string;
  setCategory: (c: string) => void;
  attrModel: AttrModel;
  setAttrModel: (m: AttrModel) => void;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [mediaMode, setMediaMode] = useState<MediaMode>('combo');
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [period, setPeriod] = useState('FY 26–27 (Full)');
  const [market, setMarket] = useState('All Markets');
  const [category, setCategory] = useState('All Categories');
  const [attrModel, setAttrModel] = useState<AttrModel>('mmm');

  return (
    <DashboardContext.Provider value={{
      mediaMode, setMediaMode,
      activeView, setActiveView,
      period, setPeriod,
      market, setMarket,
      category, setCategory,
      attrModel, setAttrModel,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}
