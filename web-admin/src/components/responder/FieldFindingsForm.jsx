import { useState } from "react";

export default function FieldFindingsForm({ incidentId, onSubmit }) {
  const [finding, setFinding] = useState({
    outcome: "resolved",
    remarks: "",
    supportNeeded: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFinding((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(incidentId, finding);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow space-y-4"
    >
      <h4 className="text-md font-bold text-navy-900">
        Responder Field Findings & Outcome
      </h4>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Action / Outcome Status:
        </label>
        <select
          name="outcome"
          value={finding.outcome}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="resolved">Resolved with Remarks</option>
          <option value="unable_to_verify">
            Unable to Verify Location / Situation
          </option>
          <option value="wrong_category">Wrong Category / Needs Review</option>
          <option value="support_requested">Support / Backup Requested</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="supportNeeded"
          checked={finding.supportNeeded}
          onChange={handleChange}
          id="supportNeeded"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="supportNeeded" className="ml-2 text-sm text-gray-600">
          Mag-request ng karagdagang assistance (Police / Medical / BFP)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Field Notes / Remarks (Required):
        </label>
        <textarea
          name="remarks"
          value={finding.remarks}
          onChange={handleChange}
          required
          rows="3"
          placeholder="Ilagay ang detalye ng aksyong ginawa sa field..."
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded-md font-semibold hover:bg-green-700"
      >
        I-submit ang Field Outcome
      </button>
    </form>
  );
}
