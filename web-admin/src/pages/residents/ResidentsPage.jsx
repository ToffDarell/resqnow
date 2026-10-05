import { User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getAllResidents,
  updateResidentVerification,
} from "../../services/reportsService";
import { useLanguage } from "../../hooks/useLanguage";

const statusStyles = {
  Active: "bg-[#ECFDF3] text-[#027A48]",
  Inactive: "bg-[#F2F4F7] text-[#667085]",
};

const verificationStyles = {
  Verified: "border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]",
  Pending: "border-[#FEDF89] bg-[#FFF4E5] text-[#B54708]",
  Rejected: "border-[#FDA29B] bg-[#FEF3F2] text-[#B42318]",
};

function formatResident(resident, t) {
  const status =
    resident.status?.toLowerCase() === "active" ? "Active" : "Inactive";

  return {
    id: `RES-${String(resident.id).padStart(4, "0")}`,

    // Actual database ID
    databaseId: resident.id,

    name: resident.name || t("unknownResident"),

    email: resident.email || t("noEmailProvided"),

    // These fields are not yet available in the Laravel database
    mobile: resident.mobile || t("notProvided"),

    address: resident.address || t("notProvided"),

    status,

    verification: resident.verification_status || "Pending",
    verificationRemarks: resident.verification_remarks || "",
    verifiedAt: resident.verified_at || null,

    reports: resident.reports_count || 0,

    registered: resident.created_at
      ? new Date(resident.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : t("unknown"),

    createdAt: resident.created_at,

    role: resident.role || "resident",
  };
}

function ResidentsPage({ onViewResidentReports }) {
  const { t } = useLanguage();

  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedResidentId, setSelectedResidentId] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllResidents();

      const formattedResidents = data.map((resident) =>
        formatResident(resident, t),
      );

      setResidents(formattedResidents);

      setSelectedResidentId((currentSelectedId) => {
        if (
          currentSelectedId &&
          formattedResidents.some(
            (resident) => resident.id === currentSelectedId,
          )
        ) {
          return currentSelectedId;
        }

        return formattedResidents[0]?.id || null;
      });
    } catch (err) {
      console.error("Failed to load residents:", err);

      setError(err.message || t("failedToLoadResidents"));
    } finally {
      setLoading(false);
    }
  };
  const handleVerification = async (verificationStatus) => {
    if (!selectedResident) return;

    try {
      setVerificationLoading(true);
      setError("");

      await updateResidentVerification(
        selectedResident.databaseId,
        verificationStatus,
        `${verificationStatus === "Verified" ? "Resident account approved" : "Resident account rejected"} by administrator.`,
      );

      await loadResidents();
    } catch (err) {
      console.error("Failed to update resident verification:", err);
      setError(err.message || "Failed to update resident verification.");
    } finally {
      setVerificationLoading(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      await loadResidents();
    };

    load();
  }, []);

  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        search === "" ||
        resident.name.toLowerCase().includes(search) ||
        resident.id.toLowerCase().includes(search) ||
        resident.email.toLowerCase().includes(search) ||
        resident.mobile.toLowerCase().includes(search) ||
        resident.address.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || resident.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [residents, searchTerm, statusFilter]);

  const selectedResident =
    residents.find((resident) => resident.id === selectedResidentId) ?? null;

  const totalResidents = residents.length;

  const activeResidents = residents.filter(
    (resident) => resident.status === "Active",
  ).length;

  const verifiedResidents = residents.filter(
    (resident) => resident.verification === "Verified",
  ).length;

  const totalReports = residents.reduce(
    (total, resident) => total + resident.reports,
    0,
  );

  const displayStatus = (status) => {
    if (status === "Active") return t("active");
    if (status === "Inactive") return t("inactive");
    return status;
  };

  const displayVerification = (verification) => {
    if (verification === "Verified") return t("verified");
    if (verification === "Pending") return t("pending");
    return verification;
  };

  const displayRole = (role) => {
    if (role?.toLowerCase() === "resident") {
      return t("resident");
    }

    return role;
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* PAGE HEADER */}
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101C2E]">
            {t("residentsPageTitle")}
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            {t("residentsPageDescription")}
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 shadow-sm sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#2ED47A]" />

          <span className="text-xs font-semibold text-[#344054]">
            {t("residentRegistry")}
          </span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
            {t("totalResidents")}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#101C2E]">
            {totalResidents}
          </p>

          <p className="mt-1 text-xs text-[#667085]">
            {t("registeredAccounts")}
          </p>
        </div>

        <div className="rounded-xl border border-[#ABEFC6] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
            {t("activeAccounts")}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#027A48]">
            {activeResidents}
          </p>

          <p className="mt-1 text-xs text-[#667085]">{t("currentlyActive")}</p>
        </div>

        <div className="rounded-xl border border-[#C7D9EF] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
            {t("verifiedResidents")}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#174A86]">
            {verifiedResidents}
          </p>

          <p className="mt-1 text-xs text-[#667085]">
            {t("activeResidentAccounts")}
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
            {t("reportsSubmitted")}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#101C2E]">
            {totalReports}
          </p>

          <p className="mt-1 text-xs text-[#667085]">
            {t("fromRegisteredResidents")}
          </p>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.65fr)]">
        {/* RESIDENT TABLE */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
          {/* TOOLBAR */}
          <div className="flex shrink-0 flex-col gap-3 border-b border-[#E4E7EC] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] px-3 transition focus-within:border-[#1F5FA6] focus-within:bg-white">
                <span className="text-sm text-[#667085]">⌕</span>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t("searchResidents")}
                  className="min-w-0 flex-1 bg-transparent text-xs text-[#101C2E] outline-none placeholder:text-[#98A2B3]"
                  aria-label={t("searchResidents")}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-lg border border-[#E4E7EC] bg-white px-3 text-xs font-semibold text-[#344054] outline-none focus:border-[#1F5FA6]"
              >
                <option value="All">{t("allStatus")}</option>

                <option value="Active">{t("active")}</option>

                <option value="Inactive">{t("inactive")}</option>
              </select>

              <button
                type="button"
                onClick={loadResidents}
                className="h-10 rounded-lg border border-[#C7D9EF] bg-[#EAF1FA] px-3 text-xs font-bold text-[#174A86] transition hover:bg-[#D6E4F5]"
              >
                {t("refresh")}
              </button>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[300px] flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#D6E4F5] border-t-[#1F5FA6]" />

                <p className="mt-4 text-sm font-semibold text-[#667085]">
                  {t("loadingResidents")}
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="flex min-h-[300px] flex-1 items-center justify-center p-6">
              <div className="max-w-sm text-center">
                <p className="text-sm font-bold text-[#B42318]">
                  {t("unableToLoadResidents")}
                </p>

                <p className="mt-2 text-xs text-[#667085]">{error}</p>

                <button
                  type="button"
                  onClick={loadResidents}
                  className="mt-4 rounded-lg bg-[#1F5FA6] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1F5FA6]"
                >
                  {t("tryAgainResidents")}
                </button>
              </div>
            </div>
          )}

          {/* TABLE */}
          {!loading && !error && (
            <>
              <div className="min-h-0 flex-1 overflow-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
                    <tr className="border-b border-[#E4E7EC]">
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                        {t("resident")}
                      </th>

                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                        {t("contact")}
                      </th>

                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                        {t("role")}
                      </th>

                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                        {t("verification")}
                      </th>

                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                        {t("status")}
                      </th>

                      <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                        {t("reports")}
                      </th>

                      <th className="px-4 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredResidents.map((resident) => {
                      const isSelected = selectedResident?.id === resident.id;

                      return (
                        <tr
                          key={resident.id}
                          onClick={() => setSelectedResidentId(resident.id)}
                          className={`cursor-pointer border-b border-[#E4E7EC] transition ${
                            isSelected ? "bg-[#EAF1FA]" : "hover:bg-[#FAF9FF]"
                          }`}
                        >
                          {/* RESIDENT */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF1FA] text-xs font-bold text-[#174A86]">
                                {resident.name.charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-[#101C2E]">
                                  {resident.name}
                                </p>

                                <p className="mt-0.5 text-[11px] text-[#667085]">
                                  {resident.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}
                          <td className="px-4 py-3">
                            <p className="text-xs font-medium text-[#344054]">
                              {resident.email}
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                              {resident.mobile}
                            </p>
                          </td>

                          {/* ROLE */}
                          <td className="px-4 py-3">
                            <span className="capitalize text-xs font-semibold text-[#344054]">
                              {displayRole(resident.role)}
                            </span>
                          </td>

                          {/* VERIFICATION */}
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full border px-2 py-1 text-[11px] font-bold ${
                                verificationStyles[resident.verification]
                              }`}
                            >
                              {displayVerification(resident.verification)}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                                statusStyles[resident.status]
                              }`}
                            >
                              {displayStatus(resident.status)}
                            </span>
                          </td>

                          {/* REPORTS */}
                          <td className="px-4 py-3 text-right text-xs font-bold text-[#344054]">
                            {resident.reports}
                          </td>

                          <td className="px-4 py-3 text-right text-sm text-[#98A2B3]">
                            ›
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredResidents.length === 0 && (
                  <div className="flex min-h-[260px] items-center justify-center p-6 text-center">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF1FA] text-lg text-[#1F5FA6]">
                        <User size={22} />
                      </div>

                      <p className="mt-3 text-sm font-bold text-[#101C2E]">
                        {t("noResidentsFound")}
                      </p>

                      <p className="mt-1 text-xs text-[#667085]">
                        {t("adjustSearchOrStatus")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* TABLE FOOTER */}
              <div className="flex shrink-0 items-center justify-between border-t border-[#E4E7EC] px-4 py-3">
                <p className="text-xs text-[#667085]">
                  {t("showing")}{" "}
                  <span className="font-semibold text-[#344054]">
                    {filteredResidents.length}
                  </span>{" "}
                  {t("of")} {totalResidents} {t("residents").toLowerCase()}
                </p>

                <p className="hidden text-[11px] text-[#98A2B3] sm:block">
                  {t("selectResidentToViewDetails")}
                </p>
              </div>
            </>
          )}
        </section>

        {/* DETAILS */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
          {selectedResident ? (
            <>
              {/* RESIDENT HEADER */}
              <div className="shrink-0 border-b border-[#E4E7EC] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F5FA6] text-lg font-bold text-white">
                    {selectedResident.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-[#101C2E]">
                      {selectedResident.name}
                    </p>

                    <p className="mt-0.5 text-xs text-[#667085]">
                      {selectedResident.id}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      statusStyles[selectedResident.status]
                    }`}
                  >
                    {displayStatus(selectedResident.status)}
                  </span>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                      verificationStyles[selectedResident.verification]
                    }`}
                  >
                    {displayVerification(selectedResident.verification)}
                  </span>
                </div>
              </div>

              {/* DETAILS CONTENT */}
              <div className="min-h-0 flex-1 overflow-auto p-5">
                <div className="space-y-5">
                  {/* CONTACT */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F5FA6]">
                      {t("contactInformation")}
                    </h3>

                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                          {t("emailAddress")}
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-[#344054]">
                          {selectedResident.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                          {t("mobileNumber")}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#344054]">
                          {selectedResident.mobile}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                          {t("address")}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#344054]">
                          {selectedResident.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACCOUNT */}
                  <div className="border-t border-[#E4E7EC] pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F5FA6]">
                      {t("accountInformation")}
                    </h3>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] p-3">
                        <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                          {t("reports")}
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#101C2E]">
                          {selectedResident.reports}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] p-3">
                        <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                          {t("registered")}
                        </p>

                        <p className="mt-1 text-xs font-bold text-[#344054]">
                          {selectedResident.registered}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                        {t("accountRole")}
                      </p>

                      <p className="mt-1 capitalize text-sm font-semibold text-[#344054]">
                        {displayRole(selectedResident.role)}
                      </p>
                    </div>
                  </div>

                  {/* REPORT ACTIVITY */}
                  <div className="border-t border-[#E4E7EC] pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F5FA6]">
                      {t("reportActivity")}
                    </h3>

                    <div className="mt-3 rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#101C2E]">
                            {selectedResident.reports} {t("submittedReports")}
                          </p>

                          <p className="mt-1 text-xs text-[#667085]">
                            {t("reportsAssociatedWithAccount")}
                          </p>
                        </div>

                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF1FA] text-sm font-bold text-[#1F5FA6]">
                          {selectedResident.reports}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="shrink-0 border-t border-[#E4E7EC] p-4 space-y-3">
                {selectedResident?.verification === "Pending" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleVerification("Rejected")}
                      disabled={verificationLoading}
                      className="rounded-lg border border-[#FDA29B] bg-white px-4 py-2.5 text-xs font-bold text-[#B42318] transition hover:bg-[#FEF3F2] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {verificationLoading ? "Updating..." : "Reject"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVerification("Verified")}
                      disabled={verificationLoading}
                      className="rounded-lg bg-[#1F5FA6] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1F5FA6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {verificationLoading ? "Updating..." : "Approve"}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (selectedResident && onViewResidentReports) {
                      onViewResidentReports(selectedResident);
                    }
                  }}
                  disabled={!selectedResident || !onViewResidentReports}
                  className="w-full rounded-lg border border-[#1F5FA6] bg-white px-4 py-2.5 text-xs font-bold text-[#1F5FA6] transition hover:bg-[#EAF1FA] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("viewResidentReports")}
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF1FA] text-lg text-[#1F5FA6]">
                  <User size={22} />
                </div>

                <p className="mt-3 text-sm font-bold text-[#101C2E]">
                  {t("noResidentSelected")}
                </p>

                <p className="mt-1 text-xs text-[#667085]">
                  {t("selectResidentFromRegistry")}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ResidentsPage;
