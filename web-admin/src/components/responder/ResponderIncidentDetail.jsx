import { useState } from "react";

export default function ResponderIncidentDetail({ incident, onUpdateStatus }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // One-tap action handlers (Acknowledge, En Route, On Scene)
  const handleQuickAction = async (actionType) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Calls the status update service without requiring text input (safe for travel)
      await onUpdateStatus(incident.id, actionType);
      setSuccess(`Mission status successfully updated to: ${actionType}`);
    } catch {
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      <div className="border-b pb-4 flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Assigned Mission
          </span>
          <h2 className="text-2xl font-bold text-navy-900 mt-1">
            {incident?.report_code || "RPT-2026-0001"}
          </h2>
          <p className="text-sm text-gray-600">
            Concern: {incident?.concern_code || "Emergency Hazard"}
          </p>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
          Status: {incident?.current_status || "Assigned"}
        </span>
      </div>

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Mission Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border text-sm">
        <div>
          <p className="text-gray-500 font-semibold">Exact Location:</p>
          <p className="font-bold text-gray-800">
            {incident?.address || "Purok I, Camunatan"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 font-semibold">Nearest Landmark:</p>
          <p className="font-bold text-gray-800">
            {incident?.landmark || "Near Barangay Chapel"}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-gray-500 font-semibold">Situation Briefing:</p>
          <p className="text-gray-800 mt-1">
            {incident?.description || "No additional description provided."}
          </p>
        </div>
      </div>

      {/* ONE-TAP MOVEMENT ACTIONS (Safe for field travel - No typing required) */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 text-sm">
          Quick Field Movement Actions (One-Tap)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickAction("acknowledge")}
            className="p-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 text-center"
          >
            1. Acknowledge Mission
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickAction("en_route")}
            className="p-3 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 disabled:opacity-50 text-center"
          >
            2. Mark En Route
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickAction("on_scene")}
            className="p-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 disabled:opacity-50 text-center"
          >
            3. Mark On Scene
          </button>
        </div>
      </div>

      {/* FIELD FLAGS & SITUATION UPDATES GUIDANCE */}
      <div className="border-t pt-4 space-y-2">
        <h3 className="font-bold text-gray-900 text-sm">
          On-Scene Branching & Field Findings
        </h3>
        <p className="text-xs text-gray-600">
          Once on scene, use the designated field findings form below for
          resolution, flagging invalid/prank reports, unable to locate issues,
          requesting support backups, or submitting factual situation updates.
        </p>
      </div>
    </div>
  );
}
