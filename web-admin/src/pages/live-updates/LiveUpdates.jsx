import { AlertTriangle, Ambulance, Zap, Check, AlertCircle, MapPin, Search, Megaphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllIncidents } from "../../services/reportsService";

function formatIncidentUpdate(incident) {
  const createdDate = incident.created_at
    ? new Date(incident.created_at)
    : null;

  const statusType =
    incident.status === "Pending Response"
      ? "Emergency"
      : incident.status === "Dispatched" ||
        incident.status === "In Progress"
      ? "Response"
      : incident.status === "Resolved"
      ? "Response"
      : "Report";

  const icon =
    incident.status === "Pending Response"
      ? <AlertTriangle size={20} />
      : incident.status === "Dispatched"
      ? <Ambulance size={20} />
      : incident.status === "In Progress"
      ? <Zap size={20} />
      : incident.status === "Resolved"
      ? <Check size={20} />
      : <AlertCircle size={20} />;

  return {
    id: incident.id,

    type: statusType,

    icon,

    title: incident.title || "Incident",

    description:
      incident.description || "No incident description provided.",

    location:
      incident.location || "Location not specified",

    reportedBy: "Barangay Response Team",

    time: createdDate
      ? createdDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Unknown",

    date: createdDate
      ? createdDate.toLocaleDateString([], {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown",

    relatedReport: incident.incident_code
      ? incident.incident_code
      : `INC-${String(incident.id).padStart(4, "0")}`,

    status: incident.status || "Pending Response",

    priority: incident.priority || "Not Prioritized",

    reportId: incident.report_id,
  };
}

const typeStyles = {
  Emergency: {
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-100",
  },

  Evacuation: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-100",
  },

  Response: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },

  Report: {
    bg: "bg-orange-50",
    text: "text-orange-500",
    border: "border-orange-100",
  },

  Verification: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
  },
};

const statusStyles = {
  "Pending Response": "bg-red-50 text-red-600",

  Dispatched: "bg-blue-50 text-blue-600",

  "In Progress": "bg-orange-50 text-orange-600",

  Resolved: "bg-green-50 text-green-600",

  Closed: "bg-gray-100 text-gray-600",
};

function LiveUpdates({ onBack, autoRefresh = true }) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const [updatesData, setUpdatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Load real incidents from Laravel API.
   */
useEffect(() => {
  let isMounted = true;

  async function loadIncidents(showLoading = false) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const incidents = await getAllIncidents();

      const formattedIncidents = incidents.map(
        formatIncidentUpdate,
      );

      if (!isMounted) return;

      setUpdatesData(formattedIncidents);

      setSelectedUpdate((currentSelected) => {
        if (formattedIncidents.length === 0) {
          return null;
        }

        // Keep the currently selected incident after refresh.
        if (currentSelected) {
          const refreshedSelected = formattedIncidents.find(
            (incident) => incident.id === currentSelected.id,
          );

          if (refreshedSelected) {
            return refreshedSelected;
          }
        }

        // Select the first incident if nothing is selected.
        return formattedIncidents[0];
      });
    } catch (err) {
      console.error("Failed to load incidents:", err);

      if (isMounted) {
        setError(
          "Unable to load live incident updates from the server.",
        );
      }
    } finally {
      if (isMounted && showLoading) {
        setLoading(false);
      }
    }
  }

  // Initial load
  loadIncidents(true);

  if (!autoRefresh) {
    return () => {
      isMounted = false;
    };
  }

  // Automatic refresh every 15 seconds.
  const refreshInterval = setInterval(() => {
    loadIncidents(false);
  }, 15000);

  return () => {
    isMounted = false;
    clearInterval(refreshInterval);
  };
}, [autoRefresh]);

  const filteredUpdates = useMemo(() => {
    return updatesData.filter((update) => {
      const matchesType =
        selectedType === "All" ||
        update.type === selectedType;

      const searchValue = search.toLowerCase();

      const matchesSearch =
        update.title.toLowerCase().includes(searchValue) ||
        update.description
          .toLowerCase()
          .includes(searchValue) ||
        update.location
          .toLowerCase()
          .includes(searchValue) ||
        update.relatedReport
          .toLowerCase()
          .includes(searchValue);

      return matchesType && matchesSearch;
    });
  }, [updatesData, search, selectedType]);

  const activeIncidents = updatesData.filter(
    (item) =>
      item.status === "Pending Response" ||
      item.status === "Dispatched" ||
      item.status === "In Progress"
  ).length;

  const resolvedIncidents = updatesData.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1400px]">

        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#667085] transition hover:text-[#1F5FA6]"
        >
          ← Back to Dashboard
        </button>

        {/* PAGE HEADER */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-[#101C2E]">
            Live Updates
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Monitor the latest hazard, incident, and response updates in the barangay.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* TOTAL */}
          <div className="rounded-xl border border-[#E4E7EC] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Total Incidents
            </p>

            <p className="mt-2 text-3xl font-bold text-[#101C2E]">
              {updatesData.length}
            </p>

            <p className="mt-1 text-sm text-[#667085]">
              Recorded incident operations
            </p>
          </div>

          {/* ACTIVE */}
          <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Active Incidents
            </p>

            <p className="mt-2 text-3xl font-bold text-red-500">
              {activeIncidents}
            </p>

            <p className="mt-1 text-sm text-[#667085]">
              Requires response or monitoring
            </p>
          </div>

          {/* RESOLVED */}
          <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Resolved Incidents
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolvedIncidents}
            </p>

            <p className="mt-1 text-sm text-[#667085]">
              Successfully resolved operations
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">

          {/* UPDATES LIST */}
          <div className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">

            {/* CONTROLS */}
            <div className="flex flex-col gap-3 border-b border-[#E4E7EC] p-5 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-lg font-bold text-[#101C2E]">
                  Latest Activity
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  {filteredUpdates.length} update
                  {filteredUpdates.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search updates..."
                  className="rounded-lg border border-[#D0D5DD] px-4 py-2.5 text-sm text-[#344054] outline-none transition focus:border-[#1F5FA6]"
                />

                <select
                  value={selectedType}
                  onChange={(event) =>
                    setSelectedType(event.target.value)
                  }
                  className="rounded-lg border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm text-[#344054] outline-none focus:border-[#1F5FA6]"
                >
                  <option value="All">
                    All Updates
                  </option>

                  <option value="Emergency">
                    Emergency
                  </option>

                  <option value="Response">
                    Response
                  </option>

                  <option value="Report">
                    Report
                  </option>

                </select>

              </div>
            </div>

            {/* TIMELINE */}
            <div className="max-h-[620px] overflow-y-auto p-5">

              {loading ? (

                <div className="flex min-h-[300px] items-center justify-center">
                  <p className="text-sm text-[#667085]">
                    Loading live incident updates...
                  </p>
                </div>

              ) : filteredUpdates.length > 0 ? (

                <div className="relative">

                  <div className="absolute bottom-0 left-6 top-0 w-px bg-[#E4E7EC]" />

                  <div className="space-y-5">

                    {filteredUpdates.map((update) => {

                      const style =
                        typeStyles[update.type] ||
                        typeStyles.Report;

                      return (

                        <button
                          key={update.id}
                          type="button"
                          onClick={() =>
                            setSelectedUpdate(update)
                          }
                          className={`relative flex w-full gap-4 rounded-lg p-3 text-left transition hover:bg-[#F9FAFB] ${
                            selectedUpdate?.id === update.id
                              ? "bg-[#EAF1FA]"
                              : ""
                          }`}
                        >

                          {/* ICON */}
                          <div
                            className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-lg font-bold ${style.bg} ${style.text} ${style.border}`}
                          >
                            {update.icon}
                          </div>

                          {/* CONTENT */}
                          <div className="min-w-0 flex-1">

                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                              <p className="text-xs font-medium text-[#667085]">
                                {update.time}
                              </p>

                              <span
                                className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  statusStyles[update.status] ||
                                  "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {update.status}
                              </span>

                            </div>

                            <h3 className="mt-1 text-base font-bold text-[#101C2E]">
                              {update.title}
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-[#667085]">
                              {update.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#667085]">

                              <span>
                                <MapPin size={13} className="mr-1 inline -mt-0.5" />{update.location}
                              </span>

                              <span>
                                By {update.reportedBy}
                              </span>

                            </div>

                          </div>

                        </button>
                      );
                    })}

                  </div>
                </div>

              ) : (

                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                  <div className="text-4xl">
                    <Search size={36} strokeWidth={1.5} className="mx-auto text-[#98A2B3]" />
                  </div>

                  <h3 className="mt-4 font-bold text-[#101C2E]">
                    No updates found
                  </h3>

                  <p className="mt-1 text-sm text-[#667085]">
                    No incident updates are currently available.
                  </p>

                </div>

              )}

            </div>
          </div>

          {/* UPDATE DETAILS */}
          <div className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">

            {selectedUpdate ? (

              <div className="p-6">

                <p className="text-xs font-bold uppercase tracking-wider text-[#1F5FA6]">
                  Incident Details
                </p>

                <div className="mt-5 flex items-center gap-3">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                      typeStyles[selectedUpdate.type]?.bg
                    } ${
                      typeStyles[selectedUpdate.type]?.text
                    }`}
                  >
                    {selectedUpdate.icon}
                  </div>

                  <div>

                    <p className="text-xs text-[#667085]">
                      {selectedUpdate.type}
                    </p>

                    <h2 className="font-bold text-[#101C2E]">
                      {selectedUpdate.title}
                    </h2>

                  </div>

                </div>

                <div className="mt-6 space-y-5">

                  <div>

                    <p className="text-xs font-semibold uppercase text-[#667085]">
                      Status
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#101C2E]">
                      {selectedUpdate.status}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase text-[#667085]">
                      Priority
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#101C2E]">
                      {selectedUpdate.priority}
                    </p>

                  </div>

                  <div className="border-t border-[#E4E7EC] pt-5">

                    <p className="text-xs font-semibold uppercase text-[#667085]">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#475467]">
                      {selectedUpdate.description}
                    </p>

                  </div>

                  <div className="border-t border-[#E4E7EC] pt-5">

                    <p className="text-xs font-semibold uppercase text-[#667085]">
                      Location
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#344054]">
                      {selectedUpdate.location}
                    </p>

                  </div>

                  <div className="border-t border-[#E4E7EC] pt-5">

                    <p className="text-xs font-semibold uppercase text-[#667085]">
                      Incident Code
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#1F5FA6]">
                      {selectedUpdate.relatedReport}
                    </p>

                  </div>

                  <div className="border-t border-[#E4E7EC] pt-5">

                    <p className="text-xs font-semibold uppercase text-[#667085]">
                      Managed By
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#344054]">
                      {selectedUpdate.reportedBy}
                    </p>

                  </div>

                  <div className="border-t border-[#E4E7EC] pt-5">

                    <p className="text-xs font-semibold uppercase text-[#667085]">
                      Date & Time
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#344054]">
                      {selectedUpdate.date}
                    </p>

                    <p className="text-sm text-[#667085]">
                      {selectedUpdate.time}
                    </p>

                  </div>

                </div>

              </div>

            ) : (

              <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">

                <div className="text-4xl">
                  <Megaphone size={36} strokeWidth={1.5} className="mx-auto text-[#98A2B3]" />
                </div>

                <h3 className="mt-4 font-bold text-[#101C2E]">
                  Select an incident
                </h3>

                <p className="mt-2 text-sm text-[#667085]">
                  Select an incident from the timeline to view its complete details.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default LiveUpdates;