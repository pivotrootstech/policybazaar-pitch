'use client';
import Image from 'next/image';
import { useDashboard } from '@/context/DashboardContext';
import type { ViewId } from '@/lib/types';

const NAV = [
  {
    group: 'Monitor',
    items: [
      {
        id: 'overview' as ViewId, label: 'Overall Summary', badge: null,
        icon: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
      },
      {
        id: 'brand' as ViewId, label: 'Brand Health', badge: 'TV·OTT',
        icon: <><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18"/><circle cx="12" cy="12" r="3.5"/></>,
      },
      {
        id: 'performance' as ViewId, label: 'Performance Funnel', badge: null,
        icon: <><path d="M3 17l5-5 4 3 7-8"/><path d="M3 21h18"/></>,
      },
      {
        id: 'markets' as ViewId, label: 'Markets & Category', badge: null,
        icon: <><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></>,
      },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      {
        id: 'brandperf' as ViewId, label: 'Brand Performance', badge: 'Digital',
        icon: <><path d="M3 12h4l3-9 4 18 3-9h4"/></>,
      },
      {
        id: 'competition' as ViewId, label: 'Competitive SOV', badge: null,
        icon: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
      },
    ],
  },
];

export default function Sidebar() {
  const { activeView, setActiveView } = useDashboard();

  return (
    <aside className="side">
      {/* Brand */}
      <div className="brand">
        <div className="brand-lockup">
          <div className="pb-mark">
            <Image
              src="/assets/images/pb_logo.png"
              alt="PolicyBazaar"
              width={42}
              height={42}
              style={{ objectFit: 'cover', borderRadius: 16 }}
              priority
            />
          </div>
          <div>
            <div className="brand-small">Client dashboard</div>
            <div className="brand-title">PolicyBazaar</div>
          </div>
        </div>
        <div className="brand-divider" />
        <div className="havas-lockup">
          <span>Powered BY</span>
          <Image
            src="/assets/images/converaged.png"
            alt="Havas Converged"
            width={142}
            height={38}
            style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
            priority
          />
        </div>
        
      </div>

      {/* Nav */}
      <div className="nav-wrap">
        {NAV.map(section => (
          <div key={section.group}>
            <div className="nav-label">{section.group}</div>
            {section.items.map(item => (
              <div
                key={item.id}
                className={`nav-item${activeView === item.id ? ' active' : ''}`}
                onClick={() => setActiveView(item.id)}
              >
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  {item.icon}
                </svg>
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="side-foot">
     <b style={{ color: '#D60000' }}>Havas Converged</b>

      </div>
    </aside>
  );
}
