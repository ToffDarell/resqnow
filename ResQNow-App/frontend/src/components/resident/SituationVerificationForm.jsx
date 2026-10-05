import  { useState } from "react";

export default function SituationVerificationForm({ category, onSubmit }) {
  const [answers, setAnswers] = useState({
    urgentReason: "medical_danger",
    details: "",
    isImmediateDanger: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow space-y-4"
    >
      <h3 className="text-lg font-bold text-navy-900">
        Situation Verification Form (SVF)
      </h3>
      <p className="text-sm text-gray-600">
        Category: {category || "General Emergency"}
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Primary Reason for Emergency / SOS:
        </label>
        <select
          name="urgentReason"
          value={answers.urgentReason}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="medical_danger">Medical Danger / Health Risk</option>
          <option value="fire_smoke">Fire / Smoke / Electrical Hazard</option>
          <option value="flood_rescue">Flood Rescue Needed</option>
          <option value="trapped_person">Trapped Person / Stuck</option>
          <option value="violence">Immediate Violence / Threat</option>
          <option value="unable_to_describe">
            Unable to describe / Unsure (For urgent review)
          </option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isImmediateDanger"
          checked={answers.isImmediateDanger}
          onChange={handleChange}
          id="isImmediateDanger"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label
          htmlFor="isImmediateDanger"
          className="ml-2 text-sm text-gray-600"
        >
          Does this require immediate assistance within minutes?
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Details (Optional if rushing):
        </label>
        <textarea
          name="details"
          value={answers.details}
          onChange={handleChange}
          rows="3"
          placeholder="Provide brief details or note 'unable to describe' if necessary..."
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700"
      >
        Submit Situation Assessment
      </button>
    </form>
  );
}
