import React from "react";

function fmt(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function getStreak(entries) {
  if (!entries.length) return 0;
  const dates = [...new Set(entries.map((e) => new Date(e.ts).toDateString()))].reverse();
  const today = new Date().toDateString();
  if (dates[0] !== today) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i - 1]) - new Date(dates[i])) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function hasAlert(e) {
  return parseFloat(e.temp) > 38.5 || parseInt(e.pain) > 8;
}

const woundColors = {
  healing: "bg-green-100 text-green-800",
  swelling: "bg-yellow-100 text-yellow-800",
  infection: "bg-red-100 text-red-800",
  dry: "bg-blue-100 text-blue-800",
  discharge: "bg-orange-100 text-orange-800",
};

export default function Dashboard({ entries }) {
  const streak = getStreak(entries);
  const avgPain = entries.length
    ? (entries.reduce((a, b) => a + parseInt(b.pain), 0) / entries.length).toFixed(1)
    : null;
  const avgTemp = entries.length
    ? (entries.reduce((a, b) => a + parseFloat(b.temp), 0) / entries.length).toFixed(1)
    : null;
  const alerts = entries.filter(hasAlert).length;
  const latest = [...entries].reverse()[0];

  return (
    <div className="space-y-4">
      {streak > 0 && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 text-white flex items-center gap-3 shadow-md">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="font-bold text-lg">{streak}-day streak!</p>
            <p className="text-sm text-amber-100">Keep logging your recovery daily.</p>
          </div>
        </div>
      )}

      {alerts > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-4 text-white flex items-start gap-3 shadow-md">
          <span className="text-2xl mt-0.5">⚠️</span>
          <div>
            <p className="font-bold">Medical Alert</p>
            <p className="text-sm text-red-100">
              {alerts} entr{alerts > 1 ? "ies" : "y"} flagged with high temperature or pain.
              Please consult your doctor immediately.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white shadow-md">
          <p className="text-xs text-indigo-200 font-medium">Entries</p>
          <p className="text-3xl font-bold mt-1">{entries.length}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-4 text-white shadow-md">
          <p className="text-xs text-pink-200 font-medium">Avg Pain</p>
          <p className="text-3xl font-bold mt-1">{avgPain ?? "—"}</p>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-4 text-white shadow-md">
          <p className="text-xs text-teal-200 font-medium">Avg Temp</p>
          <p className="text-2xl font-bold mt-1">{avgTemp ? avgTemp + "°" : "—"}</p>
        </div>
      </div>

      {latest && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-3">Latest Check-in</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 rounded-xl p-3">
              <p className="text-xs text-indigo-400">Pain level</p>
              <p className="text-2xl font-bold text-indigo-700">{latest.pain}<span className="text-sm font-normal">/10</span></p>
            </div>
            <div className="bg-rose-50 rounded-xl p-3">
              <p className="text-xs text-rose-400">Temperature</p>
              <p className="text-2xl font-bold text-rose-700">{latest.temp}°C</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-400">Wound</p>
              <p className="text-sm font-semibold text-green-700 capitalize">{latest.wound}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-xs text-purple-400">Activity</p>
              <p className="text-sm font-semibold text-purple-700 capitalize">{latest.activity}</p>
            </div>
          </div>
          {latest.notes && (
            <p className="mt-3 text-sm text-gray-500 italic border-t pt-3">"{latest.notes}"</p>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-800">All Entries</p>
          <span className="text-xs text-gray-400">{entries.length} total</span>
        </div>
        {entries.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-gray-400 text-sm">No entries yet. Start with your first check-in!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {[...entries].reverse().map((e) => (
              <div key={e.id} className={`p-4 ${hasAlert(e) ? "bg-red-50" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {hasAlert(e) && (
                        <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">⚠ Alert</span>
                      )}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${woundColors[e.wound] || "bg-gray-100 text-gray-700"}`}>
                        {e.wound}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{e.activity}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{fmt(e.ts)}</p>
                    {e.notes && <p className="text-xs text-gray-500 mt-1 italic">"{e.notes}"</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <div className="text-center bg-indigo-100 rounded-xl px-3 py-1.5">
                      <p className="text-xs text-indigo-400">Pain</p>
                      <p className="text-base font-bold text-indigo-700">{e.pain}</p>
                    </div>
                    <div className="text-center bg-rose-100 rounded-xl px-3 py-1.5">
                      <p className="text-xs text-rose-400">Temp</p>
                      <p className="text-base font-bold text-rose-700">{e.temp}°</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}