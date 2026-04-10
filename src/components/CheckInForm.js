import React, { useState } from "react";

const painLabels = ["", "Minimal", "Mild", "Mild", "Moderate", "Moderate", "Noticeable", "Severe", "Severe", "Intense", "Unbearable"];
const painColors = ["", "bg-green-400", "bg-green-400", "bg-lime-400", "bg-yellow-400", "bg-yellow-500", "bg-orange-400", "bg-orange-500", "bg-red-400", "bg-red-500", "bg-red-600"];

export default function CheckInForm({ onSave }) {
  const [pain, setPain] = useState(5);
  const [temp, setTemp] = useState("");
  const [wound, setWound] = useState("healing");
  const [activity, setActivity] = useState("resting");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const t = parseFloat(temp);
    if (!temp || isNaN(t) || t < 34 || t > 43) {
      setError("Please enter a valid temperature (34–43°C).");
      return;
    }
    if (t > 38.5 || pain > 8) setShowAlert(true);
    onSave({ pain, temp: t.toFixed(1), wound, activity, notes });
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-md">
        <h2 className="text-lg font-bold">Daily Check-in</h2>
        <p className="text-sm text-indigo-200 mt-1">Log your recovery for today</p>
      </div>

      {showAlert && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-semibold text-red-700">Medical Alert</p>
            <p className="text-sm text-red-600 mt-0.5">
              {parseFloat(temp) > 38.5 ? `High temperature (${parseFloat(temp).toFixed(1)}°C). ` : ""}
              {pain > 8 ? `High pain level (${pain}/10). ` : ""}
              Please contact your healthcare provider immediately.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-xl">😣</span> Pain Level
            </label>
            <div className={`${painColors[pain]} text-white text-sm font-bold px-3 py-1 rounded-full`}>
              {pain}/10 · {painLabels[pain]}
            </div>
          </div>
          <input
            type="range"
            min="1" max="10" step="1"
            value={pain}
            onChange={(e) => setPain(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(pain - 1) * 11.1}%, #e5e7eb ${(pain - 1) * 11.1}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 - Minimal</span><span>10 - Unbearable</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <span className="text-xl">🌡️</span> Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1" min="34" max="43"
            placeholder="e.g. 37.2"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {parseFloat(temp) > 38.5 && (
            <p className="text-red-500 text-xs mt-2 font-medium">⚠ High temperature detected!</p>
          )}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <span className="text-xl">🩹</span> Wound Condition
          </label>
          <select
            value={wound}
            onChange={(e) => setWound(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            <option value="healing">✅ Healing normally</option>
            <option value="dry">🟢 Dry &amp; closed</option>
            <option value="swelling">🟡 Swelling present</option>
            <option value="discharge">🟠 Discharge present</option>
            <option value="infection">🔴 Signs of infection</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <span className="text-xl">🏃</span> Activity Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: "resting", label: "Bed rest", icon: "🛏️" },
              { val: "light", label: "Light movement", icon: "🚶" },
              { val: "moderate", label: "Moderate", icon: "🏃" },
              { val: "active", label: "Quite active", icon: "💪" },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setActivity(opt.val)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  activity === opt.val
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}
              >
                <span>{opt.icon}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <span className="text-xl">📝</span> Notes <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any symptoms, feelings, or observations..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all"
        >
          💾 Save Today's Entry
        </button>
      </form>
    </div>
  );
}