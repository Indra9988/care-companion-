import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

function shortDate(ts) {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

const lineOpts = (yMin, yMax) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: "#1e1b4b", titleColor: "#c7d2fe", bodyColor: "#fff" },
  },
  scales: {
    x: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 11 } } },
    y: {
      min: yMin,
      max: yMax,
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { font: { size: 11 } },
    },
  },
  elements: { point: { radius: 5, hoverRadius: 7 } },
});

export default function Charts({ entries }) {
  if (!entries.length) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
        <p className="text-4xl mb-3">📈</p>
        <p className="text-gray-500">No data yet.</p>
        <p className="text-sm text-gray-400 mt-1">Add check-ins to see your charts.</p>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => a.ts - b.ts);
  const labels = sorted.map((e) => shortDate(e.ts));
  const pains = sorted.map((e) => parseInt(e.pain));
  const temps = sorted.map((e) => parseFloat(e.temp));

  const avgPain = (pains.reduce((a, b) => a + b, 0) / pains.length).toFixed(1);
  const maxPain = Math.max(...pains);
  const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
  const maxTemp = Math.max(...temps).toFixed(1);

  const painData = {
    labels,
    datasets: [{
      data: pains,
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.12)",
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointBackgroundColor: pains.map((p) => (p > 8 ? "#ef4444" : "#6366f1")),
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    }],
  };

  const tempData = {
    labels,
    datasets: [{
      data: temps,
      borderColor: "#ec4899",
      backgroundColor: "rgba(236,72,153,0.12)",
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointBackgroundColor: temps.map((t) => (t > 38.5 ? "#ef4444" : "#ec4899")),
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    }],
  };

  const woundCounts = sorted.reduce((acc, e) => {
    acc[e.wound] = (acc[e.wound] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-md">
        <h2 className="text-lg font-bold">Recovery Charts</h2>
        <p className="text-sm text-indigo-200 mt-1">Your health trends over time</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <p className="text-xs text-indigo-500 font-medium">Avg / Max Pain</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{avgPain} / {maxPain}</p>
          <p className="text-xs text-indigo-400 mt-0.5">out of 10</p>
        </div>
        <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
          <p className="text-xs text-pink-500 font-medium">Avg / Max Temp</p>
          <p className="text-2xl font-bold text-pink-700 mt-1">{avgTemp}° / {maxTemp}°</p>
          <p className="text-xs text-pink-400 mt-0.5">Celsius</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span>
            Pain Level Trend
          </p>
          {pains.some((p) => p > 8) && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">⚠ High pain</span>
          )}
        </div>
        <div style={{ height: 200 }}>
          <Line data={painData} options={lineOpts(0, 10)} />
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">Red dots indicate pain greater than 8</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-pink-500"></span>
            Temperature Trend
          </p>
          {temps.some((t) => t > 38.5) && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">⚠ Fever</span>
          )}
        </div>
        <div style={{ height: 200 }}>
          <Line data={tempData} options={lineOpts(35, Math.max(40, ...temps) + 0.5)} />
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">Red dots indicate temp greater than 38.5°C</p>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-800 mb-4">Wound Condition Summary</p>
        <div className="space-y-2">
          {Object.entries(woundCounts).map(([cond, count]) => {
            const pct = Math.round((count / sorted.length) * 100);
            const colors = {
              healing: "bg-green-400",
              dry: "bg-blue-400",
              swelling: "bg-yellow-400",
              discharge: "bg-orange-400",
              infection: "bg-red-500",
            };
            return (
              <div key={cond}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-700 font-medium">{cond}</span>
                  <span className="text-gray-500">{count} entries ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${colors[cond] || "bg-gray-400"} h-2 rounded-full`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}