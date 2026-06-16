'use client';
import type { FunnelStep } from '@/lib/types';
import { C } from '@/lib/colors';

interface Props { steps: FunnelStep[]; }

export default function FunnelChart({ steps }: Props) {
  const max = steps[0]?.value ?? 1;
  return (
    <div className="funnel">
      {steps.map((s, i) => {
        const w = Math.max(14, (s.value / max) * 100);
        const conv = i === 0 ? '100%' : `${((s.value / steps[i - 1].value) * 100).toFixed(1)}%`;
        const convVal = i === 0 ? 100 : (s.value / steps[i - 1].value) * 100;
        const convColor = i === 0 ? C.muted : convVal > 40 ? C.green : C.amber;
        return (
          <div className="fstep" key={s.label}>
            <div className="ftag">
              {s.label}
              <small>{s.sub}</small>
            </div>
            <div className="barwrap">
              <div className="fbar" style={{ width: `${w}%`, background: s.color }}>
                <span className="mono">{s.display}</span>
              </div>
            </div>
            <div className="fconv">
              <span style={{ color: convColor }}>{conv}</span>
              <small>{i === 0 ? 'entry' : 'step conv'}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}
