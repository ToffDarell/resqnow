import { useState } from "react";
import { createReport } from "../../services/reportsService";

const initialForm = {
  reportType: "Hazard-Related",
  incidentType: "Flooding",
  description: "",
  reporterName: "",
  contactNumber: "",
  address: "",
  purok: "Purok 3",
  specificLocation: "",
  locationDescription: "",
  threatToLife: "Not Assessed",
  assistanceNeed: "Not Assessed",
  peopleAffected: "",
  vulnerablePersons: "None reported",
  hazardSeverity: "Not Assessed",
  locationRisk: "Not Assessed",
  waterLevel: "Not Applicable",
  roadPassability: "Not Assessed",
  evacuationNeed: "Not Assessed",
};

const reportTypes = [
  "Hazard-Related",
  "Incident-Related",
  "Assistance-Related",
];

const incidentTypes = [
  "Flooding",
  "Rising Water Level",
  "Road Obstruction",
  "Medical Assistance",
  "Evacuation Assistance",
  "Fire",
  "Other",
];

const purokOptions = [
  "Purok 1",
  "Purok 2",
  "Purok 3",
  "Purok 4",
  "Purok 5",
  "Purok 6",
];

function ManualAddReport() {
  const [form, setForm] = useState(initialForm);
  const [photoName, setPhotoName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setForm(initialForm);
    setPhotoName("");
  };

  const handleSaveDraft = () => {
    alert(
      "Manual report saved as draft. Backend integration will be added later.",
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Extract a numeric value from entries such as:
      // "Approximately 20 people" → 20
      const affectedResidentsMatch = form.peopleAffected.match(/\d+/);

      const affectedResidents = affectedResidentsMatch
        ? Number(affectedResidentsMatch[0])
        : 0;

      // Convert the form's wording into the values
      // expected by the automated triage system.
      const waterLevelMap = {
        "Not Applicable": "None/Not applicable",
        "Below Ankle": "Below knee",
        "Ankle Level": "Below knee",
        "Knee Level": "Knee",
        "Waist Level": "Waist or higher",
        "Chest Level": "Waist or higher",
      };

      const roadPassabilityMap = {
        "Not Assessed": "Fully passable",
        Passable: "Fully passable",
        "Passable with Caution": "Passable with caution",
        "Partially Blocked": "Partially passable",
        "Not Passable": "Impassable",
      };

      const locationRisk =
        form.locationRisk === "Not Assessed" ? "Low" : form.locationRisk;

      const assistanceNeedMap = {
        "Not Assessed": "No immediate assistance",
        Routine: "Assistance needed",
        Urgent: "Urgent assistance",
        Immediate: "Immediate evacuation required",
      };

      const evacuationNeedMap = {
        "Not Assessed": "No immediate assistance",
        "Not Required": "No immediate assistance",
        Recommended: "Evacuation recommended",
        Immediate: "Immediate evacuation required",
      };

      // Use the stronger of assistance need and evacuation need.
      const assistanceNeed =
        evacuationNeedMap[form.evacuationNeed] !== "No immediate assistance"
          ? evacuationNeedMap[form.evacuationNeed]
          : assistanceNeedMap[form.assistanceNeed];

      const additionalRiskFactors = [];

      if (form.threatToLife !== "Not Assessed") {
        additionalRiskFactors.push(`Threat to Life: ${form.threatToLife}`);
      }

      if (form.vulnerablePersons !== "None reported") {
        additionalRiskFactors.push(
          `Vulnerable Persons: ${form.vulnerablePersons}`,
        );
      }

      if (form.hazardSeverity !== "Not Assessed") {
        additionalRiskFactors.push(`Hazard Severity: ${form.hazardSeverity}`);
      }

      const reportData = {
        report_type: form.incidentType,
        category: form.reportType,
        description: form.description,

        location: [form.purok, form.specificLocation]
          .filter(Boolean)
          .join(", "),

        water_level: waterLevelMap[form.waterLevel] || "None/Not applicable",

        road_passability:
          roadPassabilityMap[form.roadPassability] || "Fully passable",

        affected_residents: affectedResidents,

        location_risk: locationRisk,

        assistance_evacuation_need: assistanceNeed,

        additional_risk_factors: additionalRiskFactors,
      };
      await createReport(reportData);

      alert("Manual report submitted successfully.");

      handleReset();
    } catch (error) {
      console.error("Failed to submit manual report:", error);

      alert(error.message || "Failed to submit manual report.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* PAGE HEADER */}
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101C2E]">
            Add Manual Report
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            Encode a report received directly by authorized barangay personnel.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 shadow-sm sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#00C9A7]" />

          <span className="text-xs font-semibold text-[#475467]">
            Authorized Personnel
          </span>
        </div>
      </div>

      {/* FORM WORKSPACE */}
      <div className="min-h-0 flex-1 overflow-auto pr-1">
        <div className="mx-auto max-w-[1400px] space-y-4 pb-4">
          {/* REPORT INFORMATION */}
          <FormSection
            number="01"
            title="Report Information"
            description="Provide the basic classification and description of the report."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Report Category"
                value={form.reportType}
                options={reportTypes}
                onChange={(value) => updateField("reportType", value)}
              />

              <SelectField
                label="Report Type"
                value={form.incidentType}
                options={incidentTypes}
                onChange={(value) => updateField("incidentType", value)}
              />

              <div className="md:col-span-2">
                <TextAreaField
                  label="Incident Description"
                  placeholder="Describe what happened, the current situation, and any assistance requested."
                  value={form.description}
                  onChange={(value) => updateField("description", value)}
                  rows={4}
                />
              </div>
            </div>
          </FormSection>

          {/* REPORTER INFORMATION */}
          <FormSection
            number="02"
            title="Reporter Information"
            description="Record the details of the person who reported the incident."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <TextField
                label="Reporter Name"
                placeholder="Enter full name"
                value={form.reporterName}
                onChange={(value) => updateField("reporterName", value)}
              />

              <TextField
                label="Contact Number"
                placeholder="09XX XXX XXXX"
                value={form.contactNumber}
                onChange={(value) => updateField("contactNumber", value)}
              />

              <TextField
                label="Address"
                placeholder="Enter reporter address"
                value={form.address}
                onChange={(value) => updateField("address", value)}
              />
            </div>
          </FormSection>

          {/* LOCATION */}
          <FormSection
            number="03"
            title="Incident Location"
            description="Specify where the incident or hazard is currently occurring."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Purok"
                value={form.purok}
                options={purokOptions}
                onChange={(value) => updateField("purok", value)}
              />

              <TextField
                label="Specific Location"
                placeholder="e.g. Near Camunatan Elementary School"
                value={form.specificLocation}
                onChange={(value) => updateField("specificLocation", value)}
              />

              <div className="md:col-span-2">
                <TextAreaField
                  label="Location Description"
                  placeholder="Provide landmarks, nearby roads, houses, establishments, or other useful location details."
                  value={form.locationDescription}
                  onChange={(value) =>
                    updateField("locationDescription", value)
                  }
                  rows={3}
                />
              </div>
            </div>
          </FormSection>

          {/* INITIAL ASSESSMENT */}
          <FormSection
            number="04"
            title="Initial Risk Assessment"
            description="Record the initial indicators used for report triage and prioritization."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <AssessmentField
                label="Threat to Life"
                value={form.threatToLife}
                options={["Not Assessed", "Present", "Not Present"]}
                onChange={(value) => updateField("threatToLife", value)}
                critical={form.threatToLife === "Present"}
              />

              <AssessmentField
                label="Assistance Need"
                value={form.assistanceNeed}
                options={["Not Assessed", "Immediate", "Urgent", "Routine"]}
                onChange={(value) => updateField("assistanceNeed", value)}
                critical={form.assistanceNeed === "Immediate"}
              />

              <TextField
                label="People Affected"
                placeholder="e.g. Approximately 20 people"
                value={form.peopleAffected}
                onChange={(value) => updateField("peopleAffected", value)}
              />

              <AssessmentField
                label="Vulnerable Persons"
                value={form.vulnerablePersons}
                options={[
                  "None reported",
                  "Children",
                  "Senior Citizens",
                  "PWDs",
                  "Children and Senior Citizens",
                  "Multiple vulnerable groups",
                ]}
                onChange={(value) => updateField("vulnerablePersons", value)}
              />

              <AssessmentField
                label="Hazard Severity"
                value={form.hazardSeverity}
                options={["Not Assessed", "Minor", "Moderate", "Severe"]}
                onChange={(value) => updateField("hazardSeverity", value)}
                critical={form.hazardSeverity === "Severe"}
              />

              <AssessmentField
                label="Water Level"
                value={form.waterLevel}
                options={[
                  "Not Applicable",
                  "Below Ankle",
                  "Ankle Level",
                  "Knee Level",
                  "Waist Level",
                  "Chest Level",
                ]}
                onChange={(value) => updateField("waterLevel", value)}
              />

              <AssessmentField
                label="Location Risk"
                value={form.locationRisk}
                options={[
                  "Not Assessed",
                  "Low",
                  "Moderate",
                  "High",
                  "Critical",
                ]}
                onChange={(value) => updateField("locationRisk", value)}
                critical={
                  form.locationRisk === "High" ||
                  form.locationRisk === "Critical"
                }
              />

              <AssessmentField
                label="Road Passability"
                value={form.roadPassability}
                options={[
                  "Not Assessed",
                  "Passable",
                  "Passable with Caution",
                  "Partially Blocked",
                  "Not Passable",
                ]}
                onChange={(value) => updateField("roadPassability", value)}
              />

              <AssessmentField
                label="Evacuation Need"
                value={form.evacuationNeed}
                options={[
                  "Not Assessed",
                  "Not Required",
                  "Recommended",
                  "Immediate",
                ]}
                onChange={(value) => updateField("evacuationNeed", value)}
                critical={
                  form.evacuationNeed === "Recommended" ||
                  form.evacuationNeed === "Immediate"
                }
              />
            </div>
          </FormSection>

          {/* EVIDENCE */}
          <FormSection
            number="05"
            title="Evidence"
            description="Attach available photo evidence or supporting documentation."
          >
            <label
              htmlFor="manual-report-photo"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#C7CBD4] bg-[#FCFCFD] px-6 py-8 text-center transition hover:border-[#1F5FA6] hover:bg-[#F9F7FF]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF1FA] text-[#1F5FA6]">
                <UploadIcon />
              </div>

              <p className="mt-3 text-sm font-bold text-[#344054]">
                {photoName || "Upload report evidence"}
              </p>

              <p className="mt-1 text-xs text-[#98A2B3]">
                JPG, PNG, or other supported image files
              </p>

              <input
                id="manual-report-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setPhotoName(file ? file.name : "");
                }}
              />
            </label>
          </FormSection>

          {/* FORM FOOTER */}
          <div className="flex flex-col-reverse gap-3 rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F4] text-[#008F78]">
                <ShieldIcon />
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#344054]">
                  Manual Entry Record
                </p>

                <p className="mt-0.5 text-xs leading-4 text-[#667085]">
                  This report will be attributed to the authorized personnel who
                  created it.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="h-10 rounded-lg border border-[#E4E7EC] bg-white px-4 text-sm font-bold text-[#475467] transition hover:bg-[#F9FAFB]"
              >
                Clear Form
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="h-10 rounded-lg border border-[#1F5FA6] bg-white px-4 text-sm font-bold text-[#1F5FA6] transition hover:bg-[#F9F7FF]"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-10 rounded-lg bg-[#1F5FA6] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1F5FA6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({ number, title, description, children }) {
  return (
    <section className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF1FA] text-[11px] font-bold text-[#1F5FA6]">
          {number}
        </div>

        <div>
          <h2 className="text-base font-bold text-[#101C2E]">{title}</h2>

          <p className="mt-0.5 text-xs leading-4 text-[#667085]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function TextField({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold text-[#475467]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-sm font-medium text-[#344054] outline-none transition placeholder:text-[#B0B7C3] focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/10"
      />
    </div>
  );
}

function TextAreaField({ label, placeholder, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold text-[#475467]">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 py-2.5 text-sm font-medium leading-5 text-[#344054] outline-none transition placeholder:text-[#B0B7C3] focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/10"
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold text-[#475467]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-sm font-medium text-[#344054] outline-none transition focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function AssessmentField({
  label,
  value,
  options,
  onChange,
  critical = false,
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        critical
          ? "border-[#F5C2C2] bg-[#FFF8F8]"
          : "border-[#E4E7EC] bg-[#FCFCFD]"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-[#344054]">{label}</label>

        {critical && (
          <span className="rounded-full bg-[#FEECEC] px-2 py-0.5 text-[11px] font-bold text-[#C53030]">
            Attention
          </span>
        )}
      </div>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-lg border border-[#E4E7EC] bg-white px-2.5 text-[11px] font-medium text-[#344054] outline-none transition focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3 5 6v5c0 4.5 2.9 8.4 7 10 4.1-1.6 7-5.5 7-10V6z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.5" />
    </svg>
  );
}

export default ManualAddReport;
