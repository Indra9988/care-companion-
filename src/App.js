import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import CheckInForm from "./components/CheckInForm";
import Charts from "./components/Charts";

const STORAGE_KEY = "carecompanion_v1";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setEntries(saved);
    } catch {
      setEntries([]);
    }
  }, []);

  const addEntry = (entry) => {
    const updated = [...entries, { ...entry, id: Date.now(), ts: Date.now() }];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setTab("dashboard");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "checkin", label: "Check-in", icon: "✏️" },
    { id: "charts", label: "Charts", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💊</span>
            <div>
              <h1 className="text-xl font-bold leading-tight">CareCompanion</h1>
              <p className="text-xs text-purple-200">Post-Surgery Recovery Tracker</p>
            </div>
          </div>
          <span className="text-xs text-purple-200">{entries.length} entries</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-28">
        {tab === "dashboard" && <Dashboard entries={entries} />}
        {tab === "checkin" && <CheckInForm onSave={addEntry} />}
        {tab === "charts" && <Charts entries={entries} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-medium transition-colors ${
                tab === t.id
                  ? "text-indigo-600 border-t-2 border-indigo-600"
                  : "text-gray-400"
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}