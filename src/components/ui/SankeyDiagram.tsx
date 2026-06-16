'use client';

const W = 920, H = 300;

interface Node { n: string; v: number; c: string; }
interface Link { from: number; to: number; v: number; }

function layout(arr: Node[], x: number) {
  const total = arr.reduce((a, b) => a + b.v, 0);
  let y = 20;
  return arr.map(d => {
    const h = (d.v / total) * (H - 40 - 14 * (arr.length - 1));
    const node = { ...d, x, y, h, cy: y + h / 2 };
    y += h + 14;
    return node;
  });
}

function band(x1: number, y1: number, x2: number, y2: number, w: number, color: string) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1 - w / 2} C${mx},${y1 - w / 2} ${mx},${y2 - w / 2} ${x2},${y2 - w / 2} L${x2},${y2 + w / 2} C${mx},${y2 + w / 2} ${mx},${y1 + w / 2} ${x1},${y1 + w / 2} Z`;
}

export default function SankeyDiagram() {
  const left: Node[]  = [{ n: 'TV · Prime Time', v: 54, c: '#3B82F6' }, { n: 'OTT · fixed-imp', v: 26, c: '#06B6D4' }, { n: 'YouTube', v: 20, c: '#a78bfa' }];
  const mid: Node[]   = [{ n: 'Branded search', v: 34, c: '#3B82F6' }, { n: 'Direct / app visits', v: 30, c: '#22d3ee' }, { n: 'Recall & assist', v: 36, c: '#fbbf24' }];
  const right: Node[] = [{ n: 'Brand-driven policies', v: 34, c: '#fbbf24' }, { n: 'Performance-driven', v: 48, c: '#3B82F6' }, { n: 'Base / organic', v: 18, c: '#7e93b8' }];

  const colX = [60, 430, 820];
  const nodeW = 14;
  const L = layout(left,  colX[0]);
  const M = layout(mid,   colX[1]);
  const R = layout(right, colX[2]);

  const links1: Link[] = [
    { from: 0, to: 0, v: 18 }, { from: 0, to: 2, v: 20 }, { from: 0, to: 1, v: 8 },
    { from: 1, to: 1, v: 14 }, { from: 1, to: 2, v: 8  }, { from: 1, to: 0, v: 6 },
    { from: 2, to: 0, v: 10 }, { from: 2, to: 2, v: 8  },
  ];
  const links2: Link[] = [
    { from: 0, to: 0, v: 22 }, { from: 0, to: 1, v: 12 },
    { from: 1, to: 1, v: 18 }, { from: 1, to: 2, v: 12 },
    { from: 2, to: 0, v: 12 }, { from: 2, to: 1, v: 18 },
  ];

  const lyOff  = L.map(n => n.y);
  const myOffIn = M.map(n => n.y);
  const myOff  = M.map(n => n.y);
  const ryOff  = R.map(n => n.y);

  const bands1 = links1.map(({ from: li, to: mi, v }) => {
    const s = L[li], t = M[mi];
    const w = Math.max(3, v * 1.4);
    const sy = lyOff[li]  + w / 2; lyOff[li]  += w;
    const ty = myOffIn[mi] + w / 2; myOffIn[mi] += w;
    return <path key={`l1-${li}-${mi}`} d={band(s.x + nodeW, sy, t.x, ty, w, s.c)} fill={s.c} opacity={0.22} />;
  });

  const bands2 = links2.map(({ from: mi, to: ri, v }) => {
    const s = M[mi], t = R[ri];
    const w = Math.max(3, v * 1.4);
    const sy = myOff[mi] + w / 2; myOff[mi] += w;
    const ty = ryOff[ri] + w / 2; ryOff[ri] += w;
    return <path key={`l2-${mi}-${ri}`} d={band(s.x + nodeW, sy, t.x, ty, w, t.c)} fill={t.c} opacity={0.22} />;
  });

  function renderNodes(arr: ReturnType<typeof layout>) {
    return arr.map((n, i) => {
      const rightAligned = n.x > 700;
      const anchor = rightAligned ? 'end' : 'start';
      const tx = rightAligned ? n.x - 8 : n.x + nodeW + 8;
      return (
        <g key={i}>
          <rect x={n.x} y={n.y} width={nodeW} height={n.h} rx={3} fill={n.c} />
          <text x={tx} y={n.cy - 1} fill="#fff" textAnchor={anchor} fontFamily="Inter" fontSize={11.5} fontWeight={600}>{n.n}</text>
          <text x={tx} y={n.cy + 13} fill="#9fb3d6" textAnchor={anchor} fontFamily="JetBrains Mono" fontSize={10}>{n.v}%</text>
        </g>
      );
    });
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {bands1}
      {bands2}
      {renderNodes(L)}
      {renderNodes(M)}
      {renderNodes(R)}
    </svg>
  );
}
