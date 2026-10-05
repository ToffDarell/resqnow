import { useEffect, useMemo, useState } from "react";

import {
  getReportsForVerification,
  verifyReport,
  returnReportForReview,
} from "../../services/reportsService";

import { useLanguage } from "../../hooks/useLanguage";

const priorityStyles = {
  Critical: "border-[#FECDCA] bg-[#FEF3F2] text-[#D92D20]",
  High: "border-[#FEDF89] bg-[#FFF4E5] text-[#B54708]",
  Moderate: "border-[#FDE68A] bg-[#FFFAEB] text-[#A15C00]",
  Low: "border-[#E4E7EC] bg-[#F2F4F7] text-[#667085]",
  "Not Prioritized": "border-[#E4E7EC] bg-[#F9FAFB] text-[#667085]",
};

function InfoItem({ label, value }) {
  const { t } = useLanguage();

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#344054]">
        {value || t("notSpecified")}
      </p>
    </div>
  );
}

function Verification({ onVerificationUpdate }) {
  const { t } = useLanguage();

  // Report verification state

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [selectedId, setSelectedId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [actionMessage, setActionMessage] = useState("");

  // Return for review modal state

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnRemarks, setReturnRemarks] = useState("");
  const [returnError, setReturnError] = useState("");
  const [isReturning, setIsReturning] = useState(false);

  const loadReports = async () => {
    try {
      setLoadingReports(true);
      setReportsError("");

      const data = await getReportsForVerification();

      setReports(data);

      setSelectedId((currentSelectedId) => {
        const stillExists = data.some(
          (report) => report.id === currentSelectedId,
        );

        if (stillExists) {
          return currentSelectedId;
        }

        return data[0]?.id ?? "";
      });
    } catch (error) {
      console.error("Failed to load reports for verification:", error);

      setReportsError(t("verificationServerError"));
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadReports();
    };

    load();
  }, []);

  const pendingReports = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        normalizedSearch === "" ||
        report.id.toLowerCase().includes(normalizedSearch) ||
        report.type.toLowerCase().includes(normalizedSearch) ||
        report.location.toLowerCase().includes(normalizedSearch) ||
        report.reporter.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "All" || report.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [reports, searchTerm, categoryFilter]);

  const selectedReport =
    reports.find((report) => report.id === selectedId) ?? null;

  const pendingCount = reports.length;

  const handleSelectReport = (reportId) => {
    setSelectedId(reportId);
    setActionMessage("");
  };

  const handleVerify = async () => {
    if (!selectedReport) return;

    try {
      await verifyReport(selectedReport.databaseId);

      onVerificationUpdate?.({
        ...selectedReport,
        verification: "Verified",
        status: "For Prioritization",
      });

      setActionMessage(
        t("reportVerifiedForwarded").replace("{id}", selectedReport.id),
      );

      await loadReports();
    } catch (error) {
      console.error("Failed to verify report:", error);

      setActionMessage(t("verificationFailed"));
    }
  };

  const openReturnModal = () => {
    setReturnRemarks("");
    setReturnError("");
    setShowReturnModal(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedReport) return;

    if (!returnRemarks.trim()) {
      setReturnError(t("returnRemarksRequired"));
      return;
    }

    try {
      setIsReturning(true);
      setReturnError("");

      await returnReportForReview(
        selectedReport.databaseId,
        returnRemarks.trim(),
      );

      onVerificationUpdate?.({
        ...selectedReport,
        verification: "Returned",
      });

      setActionMessage(
        t("reportReturnedForReview").replace("{id}", selectedReport.id),
      );

      setShowReturnModal(false);

      await loadReports();
    } catch (error) {
      console.error("Failed to return report for review:", error);

      setReturnError(error.message || t("verificationFailed"));
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}

      <div>
        <h1 className="text-2xl font-bold text-[#101C2E]">
          {t("verificationCenter")}
        </h1>

        <p className="mt-1 text-sm text-[#667085]">
          {t("verificationCenterDescription")}
        </p>
      </div>
      {/* Report verification */}

      <div className="flex">
        <div className="w-full max-w-xs rounded-xl border border-[#E4E7EC] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#667085]">
            {t("pendingReports")}
          </p>

          <p className="mt-3 text-3xl font-bold text-[#101C2E]">
            {pendingCount}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Report list */}

        <div className="rounded-xl border border-[#E4E7EC] bg-white p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#101C2E]">
              {t("pendingReports")}
            </h2>

            <p className="text-sm text-[#667085]">
              {t("selectReportToReview")}
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t("searchReports")}
              className="w-full rounded-lg border border-[#D0D5DD] px-4 py-3 text-sm outline-none focus:border-[#1F5FA6]"
            />

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full rounded-lg border border-[#D0D5DD] px-4 py-3 text-sm outline-none focus:border-[#1F5FA6]"
            >
              <option value="All">{t("allCategories")}</option>

              <option value="Flooding">Flooding</option>

              <option value="Fire">Fire</option>

              <option value="Hazard-Related">Hazard-Related</option>
            </select>
          </div>

          {loadingReports && (
            <p className="py-10 text-center text-sm text-[#667085]">
              {t("loadingReports")}
            </p>
          )}

          {reportsError && (
            <p className="py-10 text-center text-sm text-[#D92D20]">
              {reportsError}
            </p>
          )}

          {!loadingReports && !reportsError && pendingReports.length === 0 && (
            <p className="py-10 text-center text-sm text-[#667085]">
              {t("noPendingReportsVerification")}
            </p>
          )}

          <div className="mt-4 space-y-3">
            {pendingReports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => handleSelectReport(report.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selectedId === report.id
                    ? "border-[#1F5FA6] bg-[#EAF1FA]"
                    : "border-[#E4E7EC] bg-white hover:border-[#C7B9FF]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#101C2E]">
                      {report.id}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#344054]">
                      {report.type}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-bold ${
                      priorityStyles[report.priority || "Not Prioritized"]
                    }`}
                  >
                    {report.priority === "Critical"
                      ? t("critical")
                      : report.priority === "High"
                        ? t("high")
                        : report.priority === "Moderate"
                          ? t("moderate")
                          : report.priority === "Low"
                            ? t("low")
                            : t("notPrioritized")}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#667085]">{report.location}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Report details */}

        <div className="rounded-xl border border-[#E4E7EC] bg-white p-6">
          {selectedReport ? (
            <>
              <div className="flex flex-col gap-4 border-b border-[#E4E7EC] pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1F5FA6]">
                    {selectedReport.id}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#101C2E]">
                    {selectedReport.type}
                  </h2>

                  <p className="mt-2 text-sm text-[#667085]">
                    {selectedReport.category}
                  </p>
                </div>

                <span className="rounded-full bg-[#FFF4E5] px-3 py-1 text-sm font-bold text-[#B54708]">
                  {t("pendingVerification")}
                </span>
              </div>

              {actionMessage && (
                <div className="mt-5 rounded-lg bg-[#EAF1FA] p-4 text-sm font-semibold text-[#174A86]">
                  {actionMessage}
                </div>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  label={t("reporter")}
                  value={selectedReport.reporter}
                />

                <InfoItem
                  label={t("location")}
                  value={selectedReport.location}
                />

                <InfoItem
                  label={t("submitted")}
                  value={selectedReport.submitted}
                />

                <InfoItem
                  label={t("priority")}
                  value={selectedReport.priority || t("notPrioritized")}
                />

                <InfoItem
                  label={t("affectedPeople")}
                  value={selectedReport.affected}
                />

                <InfoItem
                  label={t("vulnerablePersons")}
                  value={selectedReport.vulnerable}
                />

                <InfoItem
                  label={t("waterLevel")}
                  value={selectedReport.waterLevel}
                />

                <InfoItem
                  label={t("roadPassability")}
                  value={selectedReport.roadPassability}
                />
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
                  {t("description")}
                </p>

                <p className="mt-2 rounded-lg bg-[#F9FAFB] p-4 text-sm leading-6 text-[#475467]">
                  {selectedReport.description || t("noDescriptionProvided")}
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#E4E7EC] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={openReturnModal}
                  className="rounded-lg border border-[#FECDCA] px-5 py-3 text-sm font-bold text-[#D92D20] hover:bg-[#FEF3F2]"
                >
                  {t("returnForReview")}
                </button>

                <button
                  type="button"
                  onClick={handleVerify}
                  className="rounded-lg bg-[#1F5FA6] px-5 py-3 text-sm font-bold text-white hover:bg-[#1F5FA6]"
                >
                  {t("verifyReport")}
                </button>
              </div>
            </>
          ) : (
            <div className="flex min-h-[500px] items-center justify-center text-center">
              <p className="text-sm text-[#667085]">
                {t("selectPendingReport")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RETURN FOR REVIEW MODAL */}

      {showReturnModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101C2E]/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#101C2E]">
                  {t("returnForReview")}
                </h2>

                <p className="mt-1 text-xs text-[#667085]">
                  {selectedReport.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="text-lg font-bold text-[#98A2B3] hover:text-[#344054]"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="text-xs font-bold text-[#475467]">
                  {t("returnRemarksLabel")}
                </label>

                <textarea
                  rows="4"
                  value={returnRemarks}
                  onChange={(event) => {
                    setReturnRemarks(event.target.value);
                    setReturnError("");
                  }}
                  placeholder={t("returnRemarksPlaceholder")}
                  className="mt-2 w-full resize-none rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-sm text-[#344054] outline-none focus:border-[#1F5FA6]"
                />
              </div>

              {returnError && (
                <p className="rounded-lg border border-[#FECDCA] bg-[#FEF3F2] px-3 py-2 text-xs font-semibold text-[#B42318]">
                  {returnError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E4E7EC] px-6 py-4">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-sm font-semibold text-[#475467]"
              >
                {t("cancel")}
              </button>

              <button
                type="button"
                onClick={handleConfirmReturn}
                disabled={isReturning}
                className="rounded-lg bg-[#D92D20] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B42318] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isReturning ? t("returningReport") : t("confirmReturn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Verification;
