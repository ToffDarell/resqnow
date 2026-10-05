import { Check, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getReportsForPrioritization,
  assessReportTriage,
  assignReportPriority,
} from "../../services/reportsService";

import { useLanguage } from "../../hooks/useLanguage";

const priorityStyles = {
  Critical: "border-[#FECDCA] bg-[#FEF3F2] text-[#D92D20]",
  High: "border-[#FEDF89] bg-[#FFF4E5] text-[#B54708]",
  Moderate: "border-[#FDE68A] bg-[#FFFAEB] text-[#A15C00]",
  Low: "border-[#E4E7EC] bg-[#F2F4F7] text-[#667085]",
};

function TriageItem({ label, value, critical = false }) {
  return (
    <div className="rounded-lg border border-[#E4E7EC] bg-white p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-bold ${
          critical ? "text-[#D92D20]" : "text-[#344054]"
        }`}
      >
        {value || "Not specified"}
      </p>
    </div>
  );
}

function Prioritization({ onPriorityUpdate }) {
  const { t } = useLanguage();

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [selectedId, setSelectedId] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedPriority, setSelectedPriority] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [triageData, setTriageData] = useState({
    water_level: "",
    road_passability: "",
    affected_residents: "",
    location_risk: "",
    assistance_evacuation_need: "",
    triage_remarks: "",
  });

  const [triageResult, setTriageResult] = useState(null);
  const [isAssessingTriage, setIsAssessingTriage] = useState(false);

  /* =========================================
     LOAD REPORTS FROM LARAVEL API
  ========================================= */

  async function loadReports() {
    try {
      setLoadingReports(true);
      setReportsError("");

      const data = await getReportsForPrioritization();

      setReports(data);

      setSelectedId((currentSelectedId) => {
        const stillExists = data.some(
          (report) => report.id === currentSelectedId,
        );

        if (stillExists) return currentSelectedId;

        const firstReport = data[0];

        if (firstReport) {
          setSelectedPriority(
            firstReport.currentPriority &&
              firstReport.currentPriority !== "Not Prioritized"
              ? firstReport.currentPriority
              : "",
          );
        }

        return firstReport?.id ?? "";
      });
    } catch (err) {
      console.error("FAILED TO LOAD PRIORITIZATION REPORTS:", err);

      setReportsError(t("unableToLoadPrioritization"));
    } finally {
      setLoadingReports(false);
    }
  }

  /* =========================================
   LOAD ON PAGE OPEN
========================================= */

  useEffect(() => {
    const load = async () => {
      await loadReports();
    };

    load();
  }, []);

  /* =========================================
   PENDING REPORTS
========================================= */

  const pendingReports = reports;

  /* =========================================
   FILTER REPORTS
========================================= */

  const filteredReports = useMemo(() => {
    if (filter === "All") {
      return pendingReports;
    }

    return pendingReports.filter((report) => report.currentPriority === filter);
  }, [pendingReports, filter]);

  /* =========================================
   SELECTED REPORT
========================================= */

  const selectedReport =
    filteredReports.find((report) => report.id === selectedId) ||
    filteredReports[0] ||
    null;

  const handleAssessTriage = async () => {
    if (!selectedReport) {
      return;
    }

    try {
      setIsAssessingTriage(true);

      const result = await assessReportTriage(selectedReport.databaseId, {
        ...triageData,
        affected_residents: Number(triageData.affected_residents),
      });

      setTriageResult(result);

      // System automatically assigns the computed recommendation
      if (result?.recommendation) {
        setSelectedPriority(result.recommendation);
      }
    } catch (error) {
      console.error("Failed to assess triage:", error);

      alert(error.message || "Failed to assess report triage.");
    } finally {
      setIsAssessingTriage(false);
    }
  };

  /* =========================================
     CONFIRM SYSTEM-COMPUTED PRIORITY
  ========================================= */

  const handleConfirmPriority = async () => {
    if (!selectedReport || !selectedPriority) {
      return;
    }

    try {
      setIsSaving(true);

      await assignReportPriority(selectedReport.databaseId, selectedPriority);

      onPriorityUpdate?.({
        id: selectedReport.id,
        currentPriority: selectedPriority,
        priority: selectedPriority,
        priorityStatus: "Confirmed",
        status: "Prioritized",
      });

      await loadReports();
    } catch (error) {
      console.error("Failed to assign priority:", error);

      alert(error.message || t("failedToAssignPriority"));
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================
     COUNTS
  ========================================= */

  const pendingCount = pendingReports.length;

  const criticalCount = reports.filter(
    (report) => report.currentPriority === "Critical",
  ).length;

  const highCount = reports.filter(
    (report) => report.currentPriority === "High",
  ).length;

  const moderateCount = reports.filter(
    (report) => report.currentPriority === "Moderate",
  ).length;

  const lowCount = reports.filter(
    (report) => report.currentPriority === "Low",
  ).length;

  const displayPriority = (priority) => {
    if (priority === "Critical") return t("critical");
    if (priority === "High") return t("high");
    if (priority === "Moderate") return t("moderate");
    if (priority === "Low") return t("low");

    return priority || t("notSelected");
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* PAGE HEADER */}

      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101C2E]">
            {t("prioritization")}
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            {t("prioritizationDescription")}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#ABEFC6] bg-[#ECFDF3] px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#12B76A]" />

          <span className="text-sm font-semibold text-[#027A48]">
            {t("prioritizationQueueActive")}
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid shrink-0 grid-cols-1 gap-3 md:grid-cols-5">
        <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
            {t("pendingReview")}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#101C2E]">
            {pendingCount}
          </p>

          <p className="mt-1 text-sm text-[#667085]">
            {t("reportsAwaitingPrioritization")}
          </p>
        </div>

        <div className="rounded-xl border border-[#FECDCA] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
            {t("critical")}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#D92D20]">
            {criticalCount}
          </p>

          <p className="mt-1 text-sm text-[#667085]">
            {t("immediateAttention")}
          </p>
        </div>

        <div className="rounded-xl border border-[#FEDF89] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
            {t("high")}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#B54708]">
            {highCount}
          </p>

          <p className="mt-1 text-sm text-[#667085]">{t("priorityResponse")}</p>
        </div>

        <div className="rounded-xl border border-[#FDE68A] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
            {t("moderate")}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#A15C00]">
            {moderateCount}
          </p>

          <p className="mt-1 text-sm text-[#667085]">{t("routineResponse")}</p>
        </div>
        <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
            {t("low")}
          </p>

          <p className="mt-2 text-2xl font-bold text-[#667085]">
            {lowCount}
          </p>

          <p className="mt-1 text-sm text-[#667085]">
            {t("lowPriorityResponse")}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* LEFT QUEUE */}

        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
          <div className="border-b border-[#E4E7EC] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#101C2E]">
                  {t("prioritizationQueue")}
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  {t("reportsReadyForPriorityReview")}
                </p>
              </div>

              <span className="rounded-full bg-[#EAF1FA] px-3 py-1 text-xs font-bold text-[#174A86]">
                {filteredReports.length} {t("reportsCount")}
              </span>
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="mt-4 w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-sm font-medium text-[#344054] outline-none"
            >
              <option value="All">{t("allPriorities")}</option>

              <option value="Critical">{t("critical")}</option>

              <option value="High">{t("high")}</option>

              <option value="Moderate">{t("moderate")}</option>

              <option value="Low">{t("low")}</option>
            </select>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loadingReports && (
              <div className="p-6 text-center text-sm text-[#667085]">
                {t("loadingReports")}
              </div>
            )}

            {!loadingReports && reportsError && (
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-[#D92D20]">
                  {reportsError}
                </p>

                <button
                  type="button"
                  onClick={loadReports}
                  className="mt-3 rounded-lg bg-[#1F5FA6] px-4 py-2 text-sm font-semibold text-white"
                >
                  {t("tryAgain")}
                </button>
              </div>
            )}

            {!loadingReports &&
              !reportsError &&
              filteredReports.length === 0 && (
                <div className="flex h-full min-h-[250px] items-center justify-center p-6">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF1FA] text-xl">
                      <Check size={24} />
                    </div>

                    <h3 className="mt-4 font-bold text-[#101C2E]">
                      {t("noReportsAwaitingPrioritization")}
                    </h3>

                    <p className="mt-1 text-sm text-[#667085]">
                      {t("verifiedReportsWillAppear")}
                    </p>
                  </div>
                </div>
              )}

            {!loadingReports &&
              !reportsError &&
              filteredReports.map((report) => {
                const isSelected = selectedReport?.id === report.id;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(report.id);

                      setTriageData({
                        water_level: "",
                        road_passability: "",
                        affected_residents: "",
                        location_risk: "",
                        assistance_evacuation_need: "",
                        triage_remarks: "",
                      });

                      setTriageResult(null);

                      setSelectedPriority(
                        report.currentPriority &&
                          report.currentPriority !== "Not Prioritized"
                          ? report.currentPriority
                          : report.recommendedPriority || "Moderate",
                      );
                    }}
                    className={`w-full border-b border-[#E4E7EC] p-5 text-left transition ${
                      isSelected
                        ? "bg-[#F9F8FF] ring-1 ring-inset ring-[#1F5FA6]"
                        : "hover:bg-[#F9FAFB]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#174A86]">
                          {report.id}
                        </p>

                        <h3 className="mt-1 font-bold text-[#101C2E]">
                          {report.type}
                        </h3>
                      </div>

                      <span className="rounded-full border border-[#D0D5DD] bg-white px-3 py-1 text-xs font-bold text-[#344054]">
                        {displayPriority(report.currentPriority)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#667085]">
                      {report.location}
                    </p>

                    <p className="mt-2 text-xs text-[#98A2B3]">
                      {report.submitted}
                    </p>
                  </button>
                );
              })}
          </div>
        </section>

        {/* RIGHT DETAILS */}

        {selectedReport ? (
          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
            <div className="border-b border-[#E4E7EC] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-[#174A86]">
                      {selectedReport.id}
                    </span>

                    <span className="text-[#98A2B3]">•</span>

                    <span className="text-[#667085]">
                      {selectedReport.category}
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold text-[#101C2E]">
                    {selectedReport.type}
                  </h2>

                  <p className="mt-2 text-sm text-[#667085]">
                    {selectedReport.location} • {selectedReport.submitted}
                  </p>
                </div>

                <span className="rounded-full border border-[#D0D5DD] bg-white px-4 py-2 text-xs font-bold text-[#344054]">
                  {t("current")}:{" "}
                  {displayPriority(selectedReport.currentPriority)}
                </span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {/* TRIAGE */}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <TriageItem
                  label={t("affectedPeople")}
                  value={selectedReport.peopleAffected}
                />

                <TriageItem
                  label={t("vulnerablePersons")}
                  value={selectedReport.vulnerablePersons}
                />

                <TriageItem
                  label={t("waterLevel")}
                  value={selectedReport.waterLevel}
                />

                <TriageItem
                  label={t("roadPassability")}
                  value={selectedReport.roadPassability}
                />

                <TriageItem
                  label={t("evacuationNeed")}
                  value={selectedReport.evacuationNeed}
                />

                <TriageItem
                  label={t("threatToLife")}
                  value={selectedReport.threatToLife}
                  critical={selectedReport.threatToLife === "Present"}
                />
              </div>

              {/* DESCRIPTION */}

              <div className="mt-4 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#98A2B3]">
                  {t("reportDescription")}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#475467]">
                  {selectedReport.description || t("noDescriptionProvided")}
                </p>
              </div>

              {/* TRIAGE ASSESSMENT */}

              <div className="mt-4 rounded-xl border border-[#E4E7EC] bg-white p-5">
                <div>
                  <h3 className="font-bold text-[#101C2E]">
                    Triage Assessment
                  </h3>

                  <p className="mt-1 text-sm text-[#667085]">
                    System computes triage automatically based on verified
                    factual conditions.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* WATER LEVEL */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                      Water Level
                    </label>

                    <select
                      value={triageData.water_level}
                      onChange={(event) =>
                        setTriageData((current) => ({
                          ...current,
                          water_level: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-sm text-[#344054] outline-none"
                    >
                      <option value="">Select water level</option>
                      <option value="None">None</option>
                      <option value="Not applicable">Not applicable</option>
                      <option value="Below knee level">Below knee level</option>
                      <option value="Knee level">Knee level</option>
                      <option value="Above knee level">Above knee level</option>
                      <option value="Waist level or higher">
                        Waist level or higher
                      </option>
                    </select>
                  </div>

                  {/* ROAD PASSABILITY */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                      Road Passability
                    </label>

                    <select
                      value={triageData.road_passability}
                      onChange={(event) =>
                        setTriageData((current) => ({
                          ...current,
                          road_passability: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-sm text-[#344054] outline-none"
                    >
                      <option value="">Select road condition</option>
                      <option value="Fully passable">Fully passable</option>
                      <option value="Passable with caution">
                        Passable with caution
                      </option>
                      <option value="Partially passable">
                        Partially passable
                      </option>
                      <option value="Difficult to pass">
                        Difficult to pass
                      </option>
                      <option value="Impassable">Impassable</option>
                    </select>
                  </div>

                  {/* AFFECTED RESIDENTS */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                      Affected Residents
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={triageData.affected_residents}
                      onChange={(event) =>
                        setTriageData((current) => ({
                          ...current,
                          affected_residents: event.target.value,
                        }))
                      }
                      placeholder="Enter number of affected residents"
                      className="mt-2 w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-sm text-[#344054] outline-none"
                    />
                  </div>

                  {/* LOCATION RISK */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                      Location Risk
                    </label>

                    <select
                      value={triageData.location_risk}
                      onChange={(event) =>
                        setTriageData((current) => ({
                          ...current,
                          location_risk: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-sm text-[#344054] outline-none"
                    >
                      <option value="">Select location risk</option>
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  {/* ASSISTANCE / EVACUATION */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                      Assistance / Evacuation Need
                    </label>

                    <select
                      value={triageData.assistance_evacuation_need}
                      onChange={(event) =>
                        setTriageData((current) => ({
                          ...current,
                          assistance_evacuation_need: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-sm text-[#344054] outline-none"
                    >
                      <option value="">Select assistance need</option>
                      <option value="No immediate assistance needed">
                        No immediate assistance needed
                      </option>
                      <option value="Assistance needed">
                        Assistance needed
                      </option>
                      <option value="Urgent assistance needed">
                        Urgent assistance needed
                      </option>
                      <option value="Evacuation recommended">
                        Evacuation recommended
                      </option>
                      <option value="Immediate evacuation required">
                        Immediate evacuation required
                      </option>
                    </select>
                  </div>

                  {/* REMARKS */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                      Verification & Assessment Remarks
                    </label>

                    <textarea
                      rows="3"
                      value={triageData.triage_remarks}
                      onChange={(event) =>
                        setTriageData((current) => ({
                          ...current,
                          triage_remarks: event.target.value,
                        }))
                      }
                      placeholder="Add fact-checking or assessment remarks..."
                      className="mt-2 w-full resize-none rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-sm text-[#344054] outline-none"
                    />
                  </div>
                </div>

                {/* ASSESS BUTTON */}
                <div className="mt-5 flex justify-end border-t border-[#E4E7EC] pt-4">
                  <button
                    type="button"
                    onClick={handleAssessTriage}
                    disabled={
                      isAssessingTriage ||
                      !triageData.water_level ||
                      !triageData.road_passability ||
                      triageData.affected_residents === "" ||
                      !triageData.location_risk ||
                      !triageData.assistance_evacuation_need
                    }
                    className="rounded-lg bg-[#101C2E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#161433] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAssessingTriage
                      ? "Computing System Triage..."
                      : "Compute Triage from Facts"}
                  </button>
                </div>

                {/* TRIAGE RESULT (SYSTEM COMPUTED) */}
                {triageResult && (
                  <div className="mt-4 rounded-lg border border-[#C7D9EF] bg-[#F9F8FF] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                          System Triage Score
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[#101C2E]">
                          {triageResult.score} / 20
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                          System Computed Recommendation
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full border px-4 py-2 text-sm font-bold ${
                            priorityStyles[triageResult.recommendation] ||
                            "border-[#E4E7EC] bg-white text-[#667085]"
                          }`}
                        >
                          {displayPriority(triageResult.recommendation)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ZERO-BIAS SYSTEM PRIORITY DISPLAY (READ-ONLY) */}

              <div className="mt-4 rounded-xl border border-[#E4E7EC] bg-[#FCFCFD] p-5">
                <h3 className="font-bold text-[#101C2E]">
                  System-Computed Priority Level
                </h3>

                <p className="mt-1 text-sm text-[#667085]">
                  Per zero-bias policy, priority is strictly computed by the
                  system based on verified facts above. Manual override is
                  disabled.
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#E4E7EC] pt-4">
                  <div>
                    <p className="text-sm font-semibold text-[#344054]">
                      Final Assigned Priority (System Computed)
                    </p>

                    <p className="mt-1 text-sm text-[#667085]">
                      Ready for automated or staff assignment queueing.
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-bold ${
                      priorityStyles[selectedPriority] ||
                      "border-[#E4E7EC] bg-white text-[#667085]"
                    }`}
                  >
                    {displayPriority(selectedPriority)}
                  </span>
                </div>
              </div>
            </div>

            {/* CONFIRM SYSTEM PRIORITY BUTTON */}

            <div className="border-t border-[#E4E7EC] p-5">
              <button
                type="button"
                onClick={handleConfirmPriority}
                disabled={!triageResult || !selectedPriority || isSaving}
                className="w-full rounded-lg bg-[#1F5FA6] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#1F5FA6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving System Priority..."
                  : "Confirm & Apply System-Computed Priority"}
              </button>
            </div>
          </section>
        ) : (
          <section className="flex min-h-0 items-center justify-center rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF1FA] text-xl text-[#1F5FA6]">
                <Zap size={24} />
              </div>

              <h2 className="mt-3 text-sm font-bold text-[#101C2E]">
                {t("noReportSelected")}
              </h2>

              <p className="mt-1 text-xs text-[#667085]">
                {t("selectReportFromQueue")}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Prioritization;
