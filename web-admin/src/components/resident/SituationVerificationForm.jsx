import { useState } from "react";

export default function SituationVerificationForm({ category, onSubmit }) {
  const [answers, setAnswers] = useState({
    urgentReason: "",
    additionalDetails: "",
    unknownDetails: false,
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
      className="p-4 bg-white rounded shadow-md space-y-4"
    >
      <h3 className="text-lg font-bold text-navy-900">
        Situation Verification: {category}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select the primary reason for reporting:
        </label>
        <select
          name="urgentReason"
          value={answers.urgentReason}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required={!answers.unknownDetails}
        >
          <option value="">-- Select Situation --</option>
          <option value="medical_danger">Medical Danger / Trapped</option>
          <option value="fire_smoke">Fire / Smoke / Electrical Hazard</option>
          <option value="flood_rescue">Flood Rescue Needed</option>
          <option value="violence">Immediate Violence / Public Safety</option>
          <option value="other">Other Urgent Situation</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="unknownDetails"
          checked={answers.unknownDetails}
          onChange={handleChange}
          id="unknownDetails"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="unknownDetails" className="ml-2 text-sm text-gray-600">
          Unable to describe / Unsure of details (Permit immediate assistance
          review)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Additional Information:
        </label>
        <textarea
          name="additionalDetails"
          value={answers.additionalDetails}
          onChange={handleChange}
          placeholder="Provide a brief description..."
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700"
      >
        Save and Submit Details
      </button>
    </form>
  );
}
