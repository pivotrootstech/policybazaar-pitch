'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler);

interface Props { data: number[]; color: string; }

export default function Sparkline({ data, color }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Line
        data={{
          labels: data.map((_, i) => i),
          datasets: [{
            data,
            borderColor: color,
            borderWidth: 2.5,
            fill: true,
            backgroundColor: (ctx: { chart: ChartJS }) => {
              const canvas = ctx.chart.canvas;
              const gradient = canvas.getContext('2d')?.createLinearGradient(0, 0, 0, canvas.height);
              gradient?.addColorStop(0, color + '55');
              gradient?.addColorStop(0.7, color + '18');
              gradient?.addColorStop(1, color + '00');
              return gradient ?? color + '22';
            },
            tension: 0.45,
            pointRadius: 0,
            borderCapStyle: 'round',
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          layout: { padding: { top: 8, right: 0, bottom: 0, left: 0 } },
          plugins: {
            legend:  { display: false },
            tooltip: { enabled: false },
          },
          scales: {
            x: { display: false },
            y: { display: false },
          },
        }}
      />
    </div>
  );
}
