'use client';
import Sparkline from './Sparkline';

interface Props {
  accentColor: string;
  name: string;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  value: string;
  valueSuffix?: string;
  delta: string;
  deltaType?: 'up' | 'dn' | 'flat';
  footLeft?: string;
  footRight?: string;
  sparkData?: number[];
  sparkColor?: string;
}

export default function KpiCard({
  accentColor, name, icon, iconBg, iconColor,
  value, valueSuffix, delta, deltaType = 'up',
  footLeft, footRight, sparkData, sparkColor,
}: Props) {
  return (
    <div className="card kpi">
      {/* Top accent bar */}
      <div className="accent" style={{ background: accentColor }} />

      {/* Sparkline sits behind text, full card height, right-aligned */}
      {sparkData && sparkColor && (
        <div className="spark-wrap">
          <Sparkline data={sparkData} color={sparkColor} />
        </div>
      )}

      {/* Text content floats above the sparkline */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="topline">
          <span className="name">{name}</span>
          {icon && (
            <div className="kpi-ico" style={{ background: iconBg, color: iconColor }}>
              {icon}
            </div>
          )}
        </div>
        <div className="val">
          {value}
          {valueSuffix && <small>{valueSuffix}</small>}
        </div>
        <div className={`delta ${deltaType}`}>{delta}</div>
        {(footLeft || footRight) && (
          <div className="foot">
            <span>{footLeft}</span>
            {footRight && <span>{footRight}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
