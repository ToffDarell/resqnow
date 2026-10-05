import { Phone, Users, User, Siren, ShieldCheck, Cross, Landmark } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getAllIncidents } from "../../services/reportsService";
import { useLanguage } from "../../hooks/useLanguage";

/* =========================================
   PRIORITY STYLES
========================================= */

const priorityStyles = {
  Critical: "bg-[#FEF3F2] text-[#D92D20] border-[#FECDCA]",
  High: "bg-[#FFF4E5] text-[#B54708] border-[#FEDF89]",
  Moderate: "bg-[#FFFAEB] text-[#A15C00] border-[#FDE68A]",
  Low: "bg-[#F2F4F7] text-[#667085] border-[#E4E7EC]",
};

/* =========================================
   STATUS STYLES
========================================= */

const statusStyles = {
  "Pending Response": "bg-[#FFF4E5] text-[#B54708]",
  Dispatched: "bg-[#EEF4FF] text-[#174A86]",
  "In Progress": "bg-[#EAF1FA] text-[#174A86]",
  Resolved: "bg-[#ECFDF3] text-[#027A48]",
  Closed: "bg-[#F2F4F7] text-[#667085]",

  // Legacy statuses kept for display compatibility
  Responding: "bg-[#EEF4FF] text-[#174A86]",
  Assigned: "bg-[#EAF1FA] text-[#174A86]",
  Monitoring: "bg-[#ECFDF3] text-[#027A48]",
};

/* =========================================
   BARANGAY CONTACTS
========================================= */

const barangayContacts = [
  {
    name: "Barangay Emergency Hotline",
    number: "0997 692 0615",
    note: "Main barangay number",
  },
  {
    name: "Barangay Captain",
    number: "0997 692 0615",
    note: "Shared barangay number; Captain name not supplied",
  },
  {
    name: "Kag. Eva P. Sabado",
    number: "0926 907 4243",
    note: "Kagawad",
  },
  {
    name: "Kag. Florina M. Pagulayan",
    number: "0967 550 0540",
    note: "Kagawad",
  },
  {
    name: "Kag. Solita M. Noriega",
    number: null,
    note: "Kagawad",
  },
  {
    name: "Kag. Rosseller G. Casasola",
    number: "0906 740 2510",
    note: "Kagawad",
  },
  {
    name: "Kag. Remedios C. Fugaban",
    number: "0915 540 8153",
    note: "Kagawad",
  },
  {
    name: "Kag. Ricardo C. Zipagan",
    number: "0952 562 5876",
    note: "Kagawad",
  },
  {
    name: "Kag. Albert A. Maramag",
    number: "0945 366 5695",
    note: "Kagawad",
  },
  {
    name: "Sec. Gloria D. Candelaria",
    number: "0965 709 2802",
    note: "Barangay Secretary",
  },
  {
    name: "Treas. Shirley M. Aganinta",
    number: null,
    note: "Treasurer",
  },
  {
    name: "SK Jomel Evans P. Sabado",
    number: "0975 887 4427",
    note: "SK Chairperson",
  },
  {
    name: "Barangay Emergency Response",
    number: "0906 740 2510",
    note: "Shared response contact",
  },
  {
    name: "Camunatan / City Evacuation Contact",
    number: "0906 740 2510",
    note: "Exact center name/location still needs clarification",
  },
];

/* =========================================
   EMERGENCY CONTACTS
========================================= */

const emergencyContacts = [
  {
    name: "Philippine Emergency Hotline",
    numbers: ["911"],
  },
  {
    name: "Ilagan Emergency Hotline",
    numbers: ["624 1124"],
  },
  {
    name: "Ilagan Central Command Center",
    numbers: ["0915 233 1124", "0919 844 3346"],
  },
  {
    name: "CDRRMO / Rescue 1124",
    numbers: [
      "PLDT (078) 624 0203",
      "Globe 0915 234 1124",
      "Smart 0919 844 3346",
    ],
  },
  {
    name: "City Police Station - Main",
    numbers: ["0917 145 5432"],
  },
  {
    name: "Isabela Police Provincial Office",
    numbers: ["0977 803 7506", "0917 501 8212"],
  },
  {
    name: "PNP SOCO",
    numbers: ["0955 256 3162"],
  },
  {
    name: "BFP - Ilagan Fire Station",
    numbers: ["0953 056 3939", "911"],
  },
  {
    name: "Ilagan Fire-Rescue Volunteers",
    numbers: ["0917 579 7778"],
  },
  {
    name: "Ilagan Mayor's Action Center",
    numbers: ["0915 167 0129"],
  },
  {
    name: "City Health Office 1",
    numbers: ["0977 463 8785"],
  },
  {
    name: "City Health Office 2",
    numbers: ["0917 874 8988"],
  },
  {
    name: "City of Ilagan Medical Center",
    numbers: ["0999 993 2534"],
  },
  {
    name: "San Antonio City of Ilagan Hospital",
    numbers: ["0955 236 1000"],
  },
  {
    name: "Gov. Faustino N. Dy Sr. Memorial Hospital",
    numbers: ["624 1295", "0915 400 8661"],
  },
  {
    name: "Isabela Doctors General Hospital",
    numbers: ["(078) 624 2071", "0965 807 248"],
  },
  {
    name: "Dr. Victor S. Villamor Memorial Hospital",
    numbers: ["0917 100 8061"],
  },
  {
    name: "ISELCO II - Head Office",
    numbers: ["0956 994 6994", "0929 663 4511"],
  },
  {
    name: "ISELCO II - Centro Poblacion Branch",
    numbers: ["0953 305 1460"],
  },
  {
    name: "City General Services Office - Streetlights",
    numbers: ["0955 413 3899", "(078) 624 0742"],
  },
  {
    name: "City of Ilagan Water District",
    numbers: ["(078) 624 0097", "(078) 624 2083"],
  },
  {
    name: "City Social Welfare & Development Office",
    numbers: ["0927 703 6910", "0939 714 0342"],
  },
  {
    name: "City Environment & Natural Resources Office",
    numbers: ["0926 926 2960"],
  },
  {
    name: "City Veterinary Office",
    numbers: ["0927 134 0664"],
  },
];

/* =========================================
   FORMAT INCIDENT DATA
========================================= */

function formatIncident(incident) {
  return {
    id: incident.id,

    incidentCode:
      incident.incident_code ||
      `INC-${String(incident.id).padStart(4, "0")}`,

    type: incident.title || incident.type || "Unknown Incident",

    category: incident.category || "Uncategorized",

    description:
      incident.description || "No incident description provided.",

    location: incident.location || "Location not specified",

    priority: incident.priority || "Moderate",

    status: incident.status || "Pending Response",

    latitude:
      incident.latitude !== null && incident.latitude !== undefined
        ? Number(incident.latitude)
        : null,

    longitude:
      incident.longitude !== null && incident.longitude !== undefined
        ? Number(incident.longitude)
        : null,

    peopleAffected: "Not specified",

    createdAt: incident.created_at,

    reportId: incident.report_id,
  };
}

/* =========================================
   MAP VIEWPORT
========================================= */

function MapViewport({ incidents }) {
  const map = useMap();

  useEffect(() => {
    const validCoordinates = incidents
      .filter(
        (incident) =>
          Number.isFinite(incident.latitude) &&
          Number.isFinite(incident.longitude),
      )
      .map((incident) => [incident.latitude, incident.longitude]);

    if (validCoordinates.length === 0) {
      return;
    }

    if (validCoordinates.length === 1) {
      map.setView(validCoordinates[0], 16);
      return;
    }

    map.fitBounds(validCoordinates, {
      padding: [40, 40],
      maxZoom: 17,
    });
  }, [incidents, map]);

  return null;
}

/* =========================================
   INCIDENT MAP
========================================= */

function IncidentMap({ autoRefresh = true }) {
  const { t } = useLanguage();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("All");

  /* =========================
     LOAD INCIDENTS
  ========================= */

  const loadIncidents = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError("");

      const data = await getAllIncidents();

      const formattedIncidents = data.map((incident) =>
        formatIncident(incident),
      );

      setIncidents(formattedIncidents);

      setSelectedIncidentId((currentSelectedId) => {
        const selectedStillExists = formattedIncidents.some(
          (incident) => incident.id === currentSelectedId,
        );

        if (selectedStillExists) {
          return currentSelectedId;
        }

        return formattedIncidents.length > 0
          ? formattedIncidents[0].id
          : null;
      });
    } catch (loadError) {
      console.error("Failed to load incidents:", loadError);

      setError(
        loadError?.message ||
          "Unable to load incident data. Please try again.",
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

useEffect(() => {
  const load = async () => {
    await loadIncidents(true);
  };

  load();

  if (!autoRefresh) {
    return undefined;
  }

  const refreshInterval = setInterval(() => {
    loadIncidents(false);
  }, 15000);

  return () => {
    clearInterval(refreshInterval);
  };
}, [autoRefresh]);

  /* =========================
     FILTER INCIDENTS
  ========================= */

  const filteredIncidents = useMemo(() => {
    if (priorityFilter === "All") {
      return incidents;
    }

    return incidents.filter(
      (incident) => incident.priority === priorityFilter,
    );
  }, [incidents, priorityFilter]);

  /* =========================
     SELECTED INCIDENT
  ========================= */

  const selectedIncident =
    filteredIncidents.find(
      (incident) => incident.id === selectedIncidentId,
    ) ??
    filteredIncidents[0] ??
    null;

  /* =========================
     SUMMARY COUNTS
  ========================= */

  const activeIncidentCount = incidents.filter(
    (incident) => !["Resolved", "Closed"].includes(incident.status),
  ).length;

  const criticalCount = incidents.filter(
    (incident) => incident.priority === "Critical",
  ).length;

  const highCount = incidents.filter(
    (incident) => incident.priority === "High",
  ).length;

  const moderateCount = incidents.filter(
    (incident) => incident.priority === "Moderate",
  ).length;

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#D6E4F5] border-t-[#1F5FA6]" />

          <p className="mt-4 text-sm font-semibold text-[#667085]">
            {t("loadingIncident")}
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */

  if (error) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="rounded-xl border border-[#FECDCA] bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-[#D92D20]">
            {t("unableToLoadIncidents")}
          </p>

          <p className="mt-2 text-sm text-[#667085]">{error}</p>

          <button
            type="button"
            onClick={loadIncidents}
            className="mt-5 rounded-lg bg-[#1F5FA6] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1F5FA6]"
          >
            {t("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */

  return (
    <div className="flex min-h-full flex-col gap-4 pb-6">
      {/* ================= PAGE HEADER ================= */}

      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101C2E]">
            {t("incidentMapTitle")}
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            {t("incidentMapDescription")}
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-[#ABEFC6] bg-[#ECFDF3] px-3 py-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#2ED47A]" />

          <span className="text-xs font-semibold text-[#027A48]">
            {t("liveIncidentMonitoring")}
          </span>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
        {/* ACTIVE */}

        <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
            {t("activeIncidents")}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#101C2E]">
            {activeIncidentCount}
          </p>

          <p className="mt-1 text-xs text-[#667085]">
            {t("requiresMonitoring")}
          </p>
        </div>

        {/* CRITICAL */}

        <div className="rounded-xl border border-[#FECDCA] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#D92D20]">
            {t("critical")}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#D92D20]">
            {criticalCount}
          </p>

          <p className="mt-1 text-xs text-[#667085]">
            {t("immediateAttention")}
          </p>
        </div>

        {/* HIGH */}

        <div className="rounded-xl border border-[#FEDF89] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#B54708]">
            {t("highPriority")}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#B54708]">
            {highCount}
          </p>

          <p className="mt-1 text-xs text-[#667085]">
            {t("priorityResponse")}
          </p>
        </div>

        {/* MODERATE */}

        <div className="rounded-xl border border-[#FDE68A] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#A15C00]">
            {t("moderate")}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#A15C00]">
            {moderateCount}
          </p>

          <p className="mt-1 text-xs text-[#667085]">
            {t("routineMonitoring")}
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ================= MAP ================= */}

        <section className="flex h-[620px] min-w-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
          {/* MAP HEADER */}

          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E4E7EC] px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-[#101C2E]">
                {t("barangayIncidentOverview")}
              </h2>

              <p className="mt-0.5 text-[11px] text-[#667085]">
                Barangay Camunatan, City of Ilagan
              </p>
            </div>

            <select
              value={priorityFilter}
              onChange={(event) => {
                setPriorityFilter(event.target.value);
                setSelectedIncidentId(null);
              }}
              className="h-9 rounded-lg border border-[#E4E7EC] bg-white px-3 text-xs font-semibold text-[#344054] shadow-sm outline-none focus:border-[#1F5FA6]"
            >
              <option value="All">{t("allPriorities")}</option>
              <option value="Critical">{t("critical")}</option>
              <option value="High">{t("high")}</option>
              <option value="Moderate">{t("moderate")}</option>
              <option value="Low">{t("low")}</option>
            </select>
          </div>

          {/* REAL LEAFLET MAP */}

          <div className="relative min-h-[520px] flex-1 overflow-hidden">
            <MapContainer
              center={[17.15, 121.89]}
              zoom={14}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapViewport incidents={filteredIncidents} />

              {filteredIncidents
                .filter(
                  (incident) =>
                    Number.isFinite(incident.latitude) &&
                    Number.isFinite(incident.longitude),
                )
                .map((incident) => {
                  const isSelected = selectedIncident?.id === incident.id;

                  const markerColor =
                    incident.priority === "Critical"
                      ? "#EF4444"
                      : incident.priority === "High"
                        ? "#F59E0B"
                        : incident.priority === "Moderate"
                          ? "#1F5FA6"
                          : "#64748B";

                  return (
                    <CircleMarker
                      key={incident.id}
                      center={[incident.latitude, incident.longitude]}
                      radius={isSelected ? 12 : 9}
                      pathOptions={{
                        color: "#FFFFFF",
                        weight: 3,
                        fillColor: markerColor,
                        fillOpacity: 1,
                      }}
                      eventHandlers={{
                        click: () => setSelectedIncidentId(incident.id),
                      }}
                    >
                      <Popup>
                        <div className="min-w-[180px]">
                          <p className="text-xs font-bold text-[#1F5FA6]">
                            {incident.incidentCode}
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#101C2E]">
                            {incident.type}
                          </p>

                          <p className="mt-1 text-xs text-[#667085]">
                            {incident.location}
                          </p>

                          <div className="mt-2 text-xs">
                            <span className="font-semibold">Priority:</span>{" "}
                            {incident.priority}
                          </div>

                          <div className="mt-1 text-xs">
                            <span className="font-semibold">Status:</span>{" "}
                            {incident.status}
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
            </MapContainer>

            {/* EMPTY MAP STATE */}

            {filteredIncidents.length === 0 && (
              <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center">
                <div className="rounded-lg bg-white px-5 py-4 text-center shadow-sm">
                  <p className="text-sm font-bold text-[#344054]">
                    {t("noIncidentsFound")}
                  </p>

                  <p className="mt-1 text-xs text-[#667085]">
                    {t("noIncidentsMatchPriority")}
                  </p>
                </div>
              </div>
            )}

            {/* MAP LEGEND */}

            <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-[#E4E7EC] bg-white/95 p-3 shadow-sm backdrop-blur">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
                {t("mapLegend")}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />

                  <span className="text-[11px] font-medium text-[#667085]">
                    {t("critical")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />

                  <span className="text-[11px] font-medium text-[#667085]">
                    {t("high")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1F5FA6]" />

                  <span className="text-[11px] font-medium text-[#667085]">
                    {t("moderate")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]" />

                  <span className="text-[11px] font-medium text-[#667085]">
                    {t("low")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INCIDENT LIST ================= */}

      <section className="flex h-[620px] min-w-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
          <div className="shrink-0 border-b border-[#E4E7EC] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#101C2E]">
                  {t("incidents")}
                </h2>

                <p className="mt-0.5 text-xs text-[#667085]">
                  {t("selectIncidentToInspect")}
                </p>
              </div>

              <span className="rounded-full bg-[#EAF1FA] px-2.5 py-1 text-[11px] font-bold text-[#174A86]">
                {filteredIncidents.length}
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {filteredIncidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;

              return (
                <button
                  key={incident.id}
                  type="button"
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={`w-full border-b border-[#E4E7EC] p-4 text-left transition ${
                    isSelected ? "bg-[#EAF1FA]" : "hover:bg-[#FAF9FF]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#1F5FA6]">
                        {incident.incidentCode}
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-[#101C2E]">
                        {incident.type}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#667085]">
                        {incident.location}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-bold ${
                        priorityStyles[incident.priority] ||
                        priorityStyles.Moderate
                      }`}
                    >
                      {incident.priority === "Critical"
                        ? t("critical")
                        : incident.priority === "High"
                          ? t("high")
                          : incident.priority === "Moderate"
                            ? t("moderate")
                            : incident.priority === "Low"
                              ? t("low")
                              : incident.priority}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                        statusStyles[incident.status] ||
                        "bg-[#F2F4F7] text-[#667085]"
                      }`}
                    >
                      {incident.status}
                    </span>

                    <span className="text-[11px] text-[#98A2B3]">
                      {incident.category}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredIncidents.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-sm font-semibold text-[#667085]">
                  {t("noIncidentsFound")}
                </p>
              </div>
            )}
          </div>

          {/* ================= SELECTED INCIDENT ================= */}

          {selectedIncident && (
            <div className="shrink-0 border-t border-[#E4E7EC] bg-[#F8FAFC] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
                {t("selectedIncident")}
              </p>

              <p className="mt-1 text-sm font-bold text-[#101C2E]">
                {selectedIncident.type}
              </p>

              <p className="mt-0.5 text-xs text-[#667085]">
                {selectedIncident.location}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-[#E4E7EC] bg-white p-2.5">
                  <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                    {t("priority")}
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#344054]">
                    {selectedIncident.priority === "Critical"
                      ? t("critical")
                      : selectedIncident.priority === "High"
                        ? t("high")
                        : selectedIncident.priority === "Moderate"
                          ? t("moderate")
                          : selectedIncident.priority === "Low"
                            ? t("low")
                            : selectedIncident.priority}
                  </p>
                </div>

                <div className="rounded-lg border border-[#E4E7EC] bg-white p-2.5">
                  <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                    {t("status")}
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#344054]">
                    {selectedIncident.status}
                  </p>
                </div>
              </div>

              <div className="mt-2 rounded-lg border border-[#E4E7EC] bg-white p-2.5">
                <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                  {t("description")}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-[#667085]">
                  {selectedIncident.description}
                </p>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-[#E4E7EC] bg-white p-2.5">
                  <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                    {t("latitude")}
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#344054]">
                    {selectedIncident.latitude ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-lg border border-[#E4E7EC] bg-white p-2.5">
                  <p className="text-[11px] font-bold uppercase text-[#98A2B3]">
                    {t("longitude")}
                  </p>

                  <p className="mt-1 text-xs font-bold text-[#344054]">
                    {selectedIncident.longitude ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

           {/* ================= HOTLINE DIRECTORY ================= */}

      <section className="shrink-0 rounded-xl border border-[#E4E7EC] bg-white p-5 shadow-sm">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#1F5FA6]">
              Emergency Contacts
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#101C2E]">
              Hotline Directory
            </h2>

            <p className="mt-1 text-xs text-[#667085]">
              Barangay contacts and emergency services for operational response.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-[#EAF1FA] px-3 py-2 text-[11px] font-bold text-[#174A86]">
            <Phone size={12} />
            <span>
              {barangayContacts.length + emergencyContacts.length} contacts
            </span>
          </div>
        </div>

        {/* ================= BARANGAY CONTACTS ================= */}

        <div className="mt-5 overflow-hidden rounded-xl border border-[#E4E7EC]">
          {/* Section Header */}
          <div className="flex items-center gap-3 border-b border-[#E4E7EC] bg-[#F5F8FC] px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D6E4F5] text-base text-[#174A86]">
              <Users size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#101C2E]">
                Barangay Camunatan Contacts
              </h3>

              <p className="mt-0.5 text-[11px] text-[#667085]">
                Barangay officials and local response contacts
              </p>
            </div>
          </div>

          {/* Contact Grid */}
          <div className="grid md:grid-cols-2">
            {barangayContacts.map((contact, index) => (
              <div
                key={contact.name}
                className={`flex min-w-0 items-center gap-3 px-4 py-3.5 transition hover:bg-[#FAF9FF] ${
                  index % 2 === 0
                    ? "md:border-r md:border-[#E4E7EC]"
                    : ""
                } ${
                  index < barangayContacts.length - 2
                    ? "border-b border-[#E4E7EC]"
                    : index === barangayContacts.length - 2
                      ? "border-b border-[#E4E7EC] md:border-b-0"
                      : ""
                }`}
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF1FA] text-sm text-[#174A86]">
                  <User size={16} />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-5 text-[#344054]">
                    {contact.name}
                  </p>

                  <p className="text-[11px] leading-4 text-[#667085]">
                    {contact.note}
                  </p>
                </div>

                {/* Phone */}
                {contact.number ? (
                  <a
                    href={`tel:${contact.number.replace(/\D/g, "")}`}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#EAF1FA] px-3 py-2 text-[11px] font-bold text-[#174A86] transition hover:bg-[#D6E4F5]"
                  >
                    <Phone size={12} />
                    <span>{contact.number}</span>
                  </a>
                ) : (
                  <span className="shrink-0 rounded-lg bg-[#F2F4F7] px-3 py-2 text-[11px] font-semibold text-[#98A2B3]">
                    Not provided
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= EMERGENCY & CITY SERVICES ================= */}

        <div className="mt-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 rounded-lg border border-[#FECDCA] bg-[#FFF8F7] px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FEE4E2] text-base text-[#D92D20]">
              <Phone size={16} />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#101C2E]">
                Emergency & City Services
              </h3>

              <p className="mt-0.5 text-[11px] text-[#667085]">
                Emergency, security, medical, government, and utility contacts
              </p>
            </div>
          </div>

          {/* Service Cards */}
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {[
              {
                title: "Emergency & Rescue",
                icon: <Siren size={18} />,
                names: [
                  "Philippine Emergency Hotline",
                  "Ilagan Emergency Hotline",
                  "Ilagan Central Command Center",
                  "CDRRMO / Rescue 1124",
                  "BFP - Ilagan Fire Station",
                  "Ilagan Fire-Rescue Volunteers",
                ],
                cardClass: "border-[#FECDCA]",
                headerClass: "bg-[#FFF5F4]",
                iconClass: "bg-[#FEE4E2] text-[#D92D20]",
                countClass: "bg-white text-[#D92D20]",
                buttonClass:
                  "bg-[#FFF0EE] text-[#D92D20] hover:bg-[#FEE4E2]",
              },
              {
                title: "Police & Security",
                icon: <ShieldCheck size={18} />,
                names: [
                  "City Police Station - Main",
                  "Isabela Police Provincial Office",
                  "PNP SOCO",
                ],
                cardClass: "border-[#C7D7FE]",
                headerClass: "bg-[#F3F7FF]",
                iconClass: "bg-[#E0EAFF] text-[#174A86]",
                countClass: "bg-white text-[#174A86]",
                buttonClass:
                  "bg-[#EEF4FF] text-[#174A86] hover:bg-[#E0EAFF]",
              },
              {
                title: "Medical & Health",
                icon: <Cross size={18} />,
                names: [
                  "City Health Office 1",
                  "City Health Office 2",
                  "City of Ilagan Medical Center",
                  "San Antonio City of Ilagan Hospital",
                  "Gov. Faustino N. Dy Sr. Memorial Hospital",
                  "Isabela Doctors General Hospital",
                  "Dr. Victor S. Villamor Memorial Hospital",
                ],
                cardClass: "border-[#ABEFC6]",
                headerClass: "bg-[#F0FDF7]",
                iconClass: "bg-[#D1FADF] text-[#027A48]",
                countClass: "bg-white text-[#027A48]",
                buttonClass:
                  "bg-[#ECFDF3] text-[#027A48] hover:bg-[#D1FADF]",
              },
              {
                title: "Government & Utilities",
                icon: <Landmark size={18} />,
                names: [
                  "Ilagan Mayor's Action Center",
                  "ISELCO II - Head Office",
                  "ISELCO II - Centro Poblacion Branch",
                  "City General Services Office - Streetlights",
                  "City of Ilagan Water District",
                  "City Social Welfare & Development Office",
                  "City Environment & Natural Resources Office",
                  "City Veterinary Office",
                ],
                cardClass: "border-[#FDE68A]",
                headerClass: "bg-[#FFFBEB]",
                iconClass: "bg-[#FEF0C7] text-[#A15C00]",
                countClass: "bg-white text-[#A15C00]",
                buttonClass:
                  "bg-[#FFFAEB] text-[#A15C00] hover:bg-[#FEF0C7]",
              },
            ].map((group) => (
              <div
                key={group.title}
                className={`overflow-hidden rounded-xl border bg-white ${group.cardClass}`}
              >
                {/* Card Header */}
                <div
                  className={`flex items-center justify-between gap-3 border-b border-inherit px-4 py-3 ${group.headerClass}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base ${group.iconClass}`}
                    >
                      {group.icon}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[#101C2E]">
                        {group.title}
                      </h4>

                      <p className="mt-0.5 text-[11px] text-[#667085]">
                        {group.title}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-2 text-[11px] font-bold ${group.countClass}`}
                  >
                    {group.names.length}
                  </span>
                </div>

                {/* Contacts */}
                <div className="grid sm:grid-cols-2">
                  {group.names.map((name, index) => {
                    const contact = emergencyContacts.find(
                      (item) => item.name === name,
                    );

                    if (!contact) return null;

                    return (
                      <div
                        key={contact.name}
                        className={`min-w-0 px-4 py-4 transition hover:bg-[#FCFCFD] ${
                          index % 2 === 0
                            ? "sm:border-r sm:border-[#E4E7EC]"
                            : ""
                        } ${
                          index < group.names.length - 2
                            ? "border-b border-[#E4E7EC]"
                            : index === group.names.length - 2
                              ? "border-b border-[#E4E7EC] sm:border-b-0"
                              : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Contact Details */}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold leading-5 text-[#344054]">
                              {contact.name}
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                              Emergency contact
                            </p>
                          </div>

                          {/* Phone Buttons */}
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            {contact.numbers.map((number) => (
                              <a
                                key={`${contact.name}-${number}`}
                                href={`tel:${number.replace(/\D/g, "")}`}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold transition ${group.buttonClass}`}
                              >
                                <Phone size={12} />
                                <span>{number}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default IncidentMap;