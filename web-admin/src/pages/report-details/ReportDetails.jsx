import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getAllIncidents,
  getAllPersonnel,
  getAllAuditLogs,
  assignIncidentPersonnel,
  updateIncidentStatus,
  assignReportPriority,
  createIncidentFromReport,
} from "../../services/reportsService";

const priorityStyles = {
  Critical: "border-[#FECDCA] bg-[#FEF3F2] text-[#D92D20]",
  High: "border-[#FEDF89] bg-[#FFF4E5] text-[#B54708]",
  Moderate: "border-[#FDE68A] bg-[#FFFAEB] text-[#A15C00]",
  Low: "border-[#E4E7EC] bg-[#F2F4F7] text-[#667085]",
};

const statusStyles = {
  "For Verification": "bg-[#FFF7ED] text-[#B54708]",
  "Pending Response": "bg-[#EAF1FA] text-[#174A86]",
  Dispatched: "bg-[#EEF4FF] text-[#174A86]",
  "In Progress": "bg-[#EEF4FF] text-[#174A86]",
  Resolved: "bg-[#ECFDF3] text-[#027A48]",
  Closed: "bg-[#F2F4F7] text-[#475467]",
};

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#344054]">{value}</p>
    </div>
  );
}

function formatTriageValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Not assessed";
  }

  return String(value);
}

function getRecommendationStyle(priority) {
  switch (priority) {
    case "Critical":
      return {
        container: "border-[#FECDCA] bg-[#FEF3F2]",
        badge: "bg-[#FEE4E2] text-[#B42318]",
        text: "text-[#B42318]",
      };

    case "High":
      return {
        container: "border-[#FEDF89] bg-[#FFF4E5]",
        badge: "bg-[#FEF0C7] text-[#B54708]",
        text: "text-[#B54708]",
      };

    case "Moderate":
      return {
        container: "border-[#FDE68A] bg-[#FFFAEB]",
        badge: "bg-[#FEF0C7] text-[#A15C00]",
        text: "text-[#A15C00]",
      };

    default:
      return {
        container: "border-[#E4E7EC] bg-[#F8FAFC]",
        badge: "bg-[#F2F4F7] text-[#475467]",
        text: "text-[#475467]",
      };
  }
}

function AutomatedRiskItem({ label, value, score, highlighted = false }) {
  return (
    <div
      className={`rounded-lg border p-3.5 ${
        highlighted
          ? "border-[#C7D7FE] bg-[#F5F8FF]"
          : "border-[#E4E7EC] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
            {label}
          </p>

          <p className="mt-1.5 text-sm font-bold text-[#344054]">
            {formatTriageValue(value)}
          </p>
        </div>

        {score !== null && score !== undefined && (
          <span className="shrink-0 rounded-lg bg-[#EEF2FF] px-2 py-1 text-[11px] font-bold text-[#4F46E5]">
            +{score}
          </span>
        )}
      </div>
    </div>
  );
}
function formatDisplayDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString([], {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatHistoryTime(value) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ReportDetails({ report: selectedReport, onBack, onReportUpdate }) {
  const report = {
    ...(selectedReport || {}),
    id: selectedReport?.id || "Not available",
    type:
      selectedReport?.type || selectedReport?.report_type || "Not available",
    category: selectedReport?.category || "Not available",
    priority: selectedReport?.priority || "Not Prioritized",
    status:
      selectedReport?.status ||
      selectedReport?.verification_status ||
      "For Verification",
    verification:
      selectedReport?.verification ||
      selectedReport?.verification_status ||
      "Pending",
    reporter:
      selectedReport?.reporter ||
      selectedReport?.reporter_name ||
      selectedReport?.user?.name ||
      "Unknown Resident",
    contact:
      selectedReport?.contact ||
      selectedReport?.contact_number ||
      selectedReport?.user?.contact_number ||
      "Not provided",
    location: selectedReport?.location || "Not provided",
    submitted: formatDisplayDate(
      selectedReport?.created_at || selectedReport?.submitted,
    ),
    description: selectedReport?.description || "No description provided.",
    triage: {
      threatToLife:
        selectedReport?.threat_to_life ??
        selectedReport?.triage?.threatToLife ??
        "Not assessed",
      assistanceNeed:
        selectedReport?.assistance_need ??
        selectedReport?.triage?.assistanceNeed ??
        "Not assessed",
      peopleAffected:
        selectedReport?.affected_residents ??
        selectedReport?.people_affected ??
        selectedReport?.triage?.peopleAffected ??
        null,
      vulnerablePersons:
        selectedReport?.vulnerable_persons ??
        selectedReport?.triage?.vulnerablePersons ??
        "Not assessed",
      accessImpact:
        selectedReport?.triage?.accessImpact ??
        selectedReport?.road_passability ??
        "Not assessed",
      locationRisk:
        selectedReport?.location_risk ??
        selectedReport?.triage?.locationRisk ??
        "Not assessed",
      hazardSeverity:
        selectedReport?.hazard_severity ??
        selectedReport?.triage?.hazardSeverity ??
        "Not assessed",
      rateOfWorsening:
        selectedReport?.rate_of_worsening ??
        selectedReport?.triage?.rateOfWorsening ??
        "Not assessed",
      waterLevel:
        selectedReport?.waterLevel ??
        selectedReport?.triage?.waterLevel ??
        "Not assessed",

      roadPassability:
        selectedReport?.roadPassability ??
        selectedReport?.triage?.roadPassability ??
        "Not assessed",

      evacuationNeed:
        selectedReport?.evacuationNeed ??
        selectedReport?.triage?.evacuationNeed ??
        selectedReport?.assistanceEvacuationNeed ??
        "Not assessed",

      affectedResidents:
        selectedReport?.affectedResidents ??
        selectedReport?.triage?.affectedResidents ??
        null,

      assistanceEvacuationNeed:
        selectedReport?.assistanceEvacuationNeed ??
        selectedReport?.triage?.assistanceEvacuationNeed ??
        "Not assessed",

      score:
        selectedReport?.triageScore ?? selectedReport?.triage?.score ?? null,

      recommendation:
        selectedReport?.triageRecommendation ??
        selectedReport?.triage?.recommendation ??
        null,

      remarks:
        selectedReport?.triageRemarks ?? selectedReport?.triage?.remarks ?? "",

      assessedAt:
        selectedReport?.triageAssessedAt ??
        selectedReport?.triage?.assessedAt ??
        null,
    },
    assignment: selectedReport?.assignment || {},
    evidence: Array.isArray(selectedReport?.evidence)
      ? selectedReport.evidence
      : [],
    history: Array.isArray(selectedReport?.history)
      ? selectedReport.history
      : [],
  };

  const [status, setStatus] = useState(report.status);
  const [assignment, setAssignment] = useState(() => ({
    ...(report.assignment || {}),
  }));

  const [history, setHistory] = useState(() => [...(report.history || [])]);

  const [showMoreHistory, setShowMoreHistory] = useState(false);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState(
    () => report.assignment?.team || "",
  );

  const [selectedPersonnel, setSelectedPersonnel] = useState("");

  const [personnelList, setPersonnelList] = useState([]);
  const [incident, setIncident] = useState(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(
    selectedReport?.priority || "",
  );
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [priorityError, setPriorityError] = useState("");

  useEffect(() => {
    const loadAssignmentData = async () => {
      setStatus(report.status);
      setSelectedPriority(
        report.priority !== "Not Prioritized" ? report.priority : "",
      );
      setAssignment({
        team: report.assignment?.team || "Unassigned",
        personnel: report.assignment?.personnel || "Unassigned",
        assignedAt: report.assignment?.assignedAt || "Not yet assigned",
      });
      setHistory(report.history || []);
      setIncident(null);
      setSelectedPersonnel("");
      setSelectedTeam("");

      try {
        const [personnelData, incidentsData, auditLogsData] = await Promise.all(
          [getAllPersonnel(), getAllIncidents(), getAllAuditLogs()],
        );

        setPersonnelList(personnelData || []);
        const auditLogs = Array.isArray(auditLogsData) ? auditLogsData : [];

        const reportIdMatch = String(selectedReport?.id || "").match(/\d+$/);
        const reportDatabaseId =
          selectedReport?.databaseId ??
          (reportIdMatch ? Number(reportIdMatch[0]) : null);

        const matchedIncident = (incidentsData || []).find(
          (item) =>
            item.report_id === reportDatabaseId ||
            item.report?.id === reportDatabaseId ||
            item.incident_code ===
              `INC-${String(reportDatabaseId || "").padStart(4, "0")}`,
        );

        setIncident(matchedIncident || null);

        if (matchedIncident) {
          setStatus(matchedIncident.status);

          const assignedPersonnelId = matchedIncident.assigned_personnel_id;
          const assignedPersonnel = matchedIncident.personnel;

          setSelectedPersonnel(
            assignedPersonnelId ? String(assignedPersonnelId) : "",
          );
          setSelectedTeam(assignedPersonnel?.team || "");

          setAssignment({
            team: assignedPersonnel?.team || "Unassigned",
            personnel: assignedPersonnel?.name || "Unassigned",
            assignedAt: assignedPersonnel
              ? "Currently assigned"
              : "Not yet assigned",
          });

          const incidentHistory = [];

          if (selectedReport?.created_at) {
            incidentHistory.push({
              status: "Report Submitted",
              detail: "Report recorded in ResQNow.",
              time: formatHistoryTime(selectedReport.created_at),
            });
          }

          if (matchedIncident.created_at) {
            incidentHistory.push({
              status: "Incident Created",
              detail: `${matchedIncident.incident_code} created from prioritized report.`,
              time: formatHistoryTime(matchedIncident.created_at),
            });
          }

          const incidentAuditLogs = auditLogs.filter((log) => {
            return (
              log.category === "Incident" &&
              log.target === matchedIncident.incident_code
            );
          });

          incidentAuditLogs.forEach((log) => {
            if (log.action === "Incident Status Updated") {
              incidentHistory.push({
                status: log.new_value,
                detail: log.remarks,
                time: formatHistoryTime(log.created_at),
              });
            }

            if (log.action === "Incident Personnel Assigned") {
              incidentHistory.push({
                status: "Personnel Assigned",
                detail: log.remarks,
                time: formatHistoryTime(log.created_at),
              });
            }
          });

          if (incidentHistory.length > 0) {
            setHistory(incidentHistory);
          }
        }
      } catch (error) {
        console.error("Failed to load incident data:", error);
        setAssignmentError("Failed to load incident and personnel data.");
      }
    };

    loadAssignmentData();
  }, [selectedReport?.id]);

  const handleStatusChange = async (newStatus) => {
    if (!incident || newStatus === status) return;

    try {
      const updatedIncident = await updateIncidentStatus(
        incident.id,
        newStatus,
      );

      setIncident(updatedIncident);
      setStatus(updatedIncident.status);

      const newHistoryItem = {
        status: updatedIncident.status,
        detail: `Incident status updated to ${updatedIncident.status} by Barangay Personnel`,
        time: "Just now",
      };

      setHistory((current) => [...current, newHistoryItem]);
    } catch (error) {
      console.error("Failed to update incident status:", error);
      alert(error.message || "Failed to update incident status.");
    }
  };
  const handleConfirmPriority = async () => {
    if (!selectedPriority) {
      setPriorityError("Please select a priority.");
      return;
    }

    const reportIdMatch = String(selectedReport?.id || "").match(/\d+$/);
    const reportDatabaseId =
      selectedReport?.databaseId ??
      (reportIdMatch ? Number(reportIdMatch[0]) : null);

    if (!reportDatabaseId) {
      setPriorityError("The report database ID could not be determined.");
      return;
    }

    try {
      setPriorityLoading(true);
      setPriorityError("");

      const updatedReport = await assignReportPriority(
        reportDatabaseId,
        selectedPriority,
      );

      const finalPriority = updatedReport?.priority || selectedPriority;

      setSelectedPriority(finalPriority);
      setStatus(updatedReport?.status || "Prioritized");

      onReportUpdate?.({
        id: report.id,
        ...updatedReport,
        priority: finalPriority,
        status: updatedReport?.status || "Prioritized",
      });
    } catch (error) {
      console.error("Failed to assign report priority:", error);
      setPriorityError(error.message || "Failed to assign report priority.");
    } finally {
      setPriorityLoading(false);
    }
  };

  const handleCreateIncident = async () => {
    const reportIdMatch = String(selectedReport?.id || "").match(/\d+$/);
    const reportDatabaseId =
      selectedReport?.databaseId ??
      (reportIdMatch ? Number(reportIdMatch[0]) : null);

    if (!reportDatabaseId) {
      setAssignmentError("The report database ID could not be determined.");
      return;
    }

    try {
      setAssignmentLoading(true);
      setAssignmentError("");

      const createdIncident = await createIncidentFromReport(reportDatabaseId);

      setIncident(createdIncident);
      setStatus(createdIncident.status);

      setAssignment({
        team: "Unassigned",
        personnel: "Unassigned",
        assignedAt: "Not yet assigned",
      });

      onReportUpdate?.({
        id: report.id,
        incident: createdIncident,
      });
    } catch (error) {
      console.error("Failed to create incident:", error);
      setAssignmentError(
        error.message || "Failed to create incident from report.",
      );
    } finally {
      setAssignmentLoading(false);
    }
  };
  const handleSaveAssignment = async () => {
    if (!incident) {
      setAssignmentError("This report does not have an incident record yet.");
      return;
    }

    if (!selectedPersonnel || selectedPersonnel === "Unassigned") {
      setAssignmentError("Please select personnel.");
      return;
    }

    const selectedPerson = personnelList.find(
      (person) =>
        person.id === Number(selectedPersonnel) ||
        person.databaseId === Number(selectedPersonnel),
    );

    if (!selectedPerson) {
      setAssignmentError("Selected personnel was not found.");
      return;
    }

    try {
      setAssignmentLoading(true);
      setAssignmentError("");

      const updatedIncident = await assignIncidentPersonnel(
        incident.id,
        selectedPerson.id || selectedPerson.databaseId,
      );

      setIncident(updatedIncident);

      const personnelName =
        updatedIncident?.personnel?.name ||
        selectedPerson.name ||
        "Assigned Personnel";

      const assignedAt = new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const newAssignment = {
        team: selectedTeam,
        personnel: personnelName,
        assignedAt,
      };

      setAssignment(newAssignment);

      const auditLogsData = await getAllAuditLogs();
      const auditLogs = Array.isArray(auditLogsData) ? auditLogsData : [];

      const incidentAuditLogs = auditLogs.filter(
        (log) =>
          log.category === "Incident" &&
          log.target === updatedIncident.incident_code,
      );

      const refreshedHistory = [];

      if (selectedReport?.created_at) {
        refreshedHistory.push({
          status: "Report Submitted",
          detail: "Report recorded in ResQNow.",
          time: formatHistoryTime(selectedReport.created_at),
        });
      }

      if (updatedIncident.created_at) {
        refreshedHistory.push({
          status: "Incident Created",
          detail: `${updatedIncident.incident_code} created from prioritized report.`,
          time: formatHistoryTime(updatedIncident.created_at),
        });
      }

      incidentAuditLogs.forEach((log) => {
        if (log.action === "Incident Status Updated") {
          refreshedHistory.push({
            status: log.new_value,
            detail: log.remarks,
            time: formatHistoryTime(log.created_at),
          });
        }

        if (log.action === "Incident Personnel Assigned") {
          refreshedHistory.push({
            status: "Personnel Assigned",
            detail: log.remarks,
            time: formatHistoryTime(log.created_at),
          });
        }
      });

      if (refreshedHistory.length > 0) {
        setHistory(refreshedHistory);
      }

      onReportUpdate?.({
        id: report.id,
        assignment: newAssignment,
      });

      setShowAssignmentModal(false);
    } catch (error) {
      console.error("Failed to assign personnel:", error);
      setAssignmentError(error.message || "Failed to assign personnel.");
    } finally {
      setAssignmentLoading(false);
    }
  };

  const nextStatusMap = {
    "Pending Response": "Dispatched",
    Dispatched: "In Progress",
    "In Progress": "Resolved",
    Resolved: "Closed",
    Closed: null,
  };

  const nextIncidentStatus = nextStatusMap[status] || null;
  const canAssignPriority = !incident && report.status === "For Prioritization";

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // HEADER
    doc.setFillColor(31, 29, 71);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ResQNow", 14, 13);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Barangay Hazard Report", 14, 20);

    // RESET TEXT COLOR
    doc.setTextColor(31, 29, 71);

    // TITLE
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Report Details", 14, 42);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(102, 112, 133);
    doc.text(`Report ID: ${report.id}`, 14, 50);

    // REPORT INFORMATION
    autoTable(doc, {
      startY: 58,
      head: [["Report Information", "Details"]],
      body: [
        ["Report ID", report.id],
        ["Report Type", report.type],
        ["Category", report.category],
        ["Priority", report.priority],
        ["Current Status", status],
        ["Verification", report.verification],
        ["Reporter", report.reporter],
        ["Contact Number", report.contact],
        ["Location", report.location],
        ["Submitted", report.submitted],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [131, 70, 242],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    // DESCRIPTION
    let currentY = doc.lastAutoTable.finalY + 12;

    doc.setTextColor(31, 29, 71);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Report Description", 14, currentY);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 84, 103);

    const descriptionLines = doc.splitTextToSize(
      report.description,
      pageWidth - 28,
    );

    doc.text(descriptionLines, 14, currentY + 7);

    currentY += descriptionLines.length * 5 + 16;

    // TRIAGE ASSESSMENT
    doc.setTextColor(31, 29, 71);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Triage Assessment", 14, currentY);

    autoTable(doc, {
      startY: currentY + 6,
      head: [["Assessment", "Result"]],
      body: [
        ["Threat to Life", report.triage.threatToLife],
        ["Assistance Need", report.triage.assistanceNeed],
        ["People Affected", report.triage.peopleAffected],
        ["Vulnerable Persons", report.triage.vulnerablePersons],
        ["Access Impact", report.triage.accessImpact],
        ["Location Risk", report.triage.locationRisk],
        ["Hazard Severity", report.triage.hazardSeverity],
        ["Rate of Worsening", report.triage.rateOfWorsening],
        ["Water Level", report.triage.waterLevel],
        ["Road Passability", report.triage.roadPassability],
        ["Evacuation Need", report.triage.evacuationNeed],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [31, 29, 71],
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
    });

    // ASSIGNMENT
    currentY = doc.lastAutoTable.finalY + 12;

    // Check if we need another page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setTextColor(31, 29, 71);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Response Assignment", 14, currentY);

    autoTable(doc, {
      startY: currentY + 6,
      head: [["Assignment", "Details"]],
      body: [
        ["Response Team", assignment.team],
        ["Assigned Personnel", assignment.personnel],
        ["Assigned At", assignment.assignedAt],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [131, 70, 242],
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
    });

    // STATUS HISTORY
    currentY = doc.lastAutoTable.finalY + 12;

    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    doc.setTextColor(31, 29, 71);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Status History", 14, currentY);

    autoTable(doc, {
      startY: currentY + 6,
      head: [["Status", "Details", "Time"]],
      body: history.map((item) => [item.status, item.detail, item.time]),
      theme: "grid",
      headStyles: {
        fillColor: [31, 29, 71],
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
    });

    // FOOTER
    const totalPages = doc.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);

      const height = doc.internal.pageSize.getHeight();

      doc.setFontSize(8);
      doc.setTextColor(152, 162, 179);

      doc.text(
        `Generated by ResQNow • Page ${page} of ${totalPages}`,
        pageWidth / 2,
        height - 10,
        { align: "center" },
      );
    }

    // DOWNLOAD PDF
    doc.save(`${report.id}-Report-Details.pdf`);
  };

  const visibleHistory = showMoreHistory ? history : history.slice(-4);

  const statusDescription =
    status === "For Verification"
      ? "This report is awaiting verification before entering the response workflow."
      : status === "Pending Response"
        ? "The incident is ready for response dispatch."
        : status === "Dispatched"
          ? "Response personnel have been dispatched to the incident."
          : status === "In Progress"
            ? "Response personnel are actively handling the incident."
            : status === "Resolved"
              ? "The incident has been resolved and is ready for closure."
              : status === "Closed"
                ? "The incident response has been completed and closed."
                : "The current response status is being reviewed.";

  const verificationDescription =
    report.verification === "Pending"
      ? "Report is awaiting verification."
      : "Report has passed initial review.";

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* PAGE HEADER */}
      <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#667085] transition hover:text-[#1F5FA6]"
          >
            ← Back to All Reports
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1F5FA6]">
              Report Details
            </p>

            <span className="text-xs text-[#98A2B3]">/</span>

            <span className="text-xs font-bold text-[#667085]">
              {report.id}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#101C2E]">
              {report.type}
            </h1>

            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                priorityStyles[report.priority] || priorityStyles.Low
              }`}
            >
              {report.priority} Priority
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                statusStyles[status] || statusStyles["For Verification"]
              }`}
            >
              {status}
            </span>
          </div>

          <p className="mt-1 text-sm text-[#667085]">
            Submitted {report.submitted}
          </p>
        </div>

        {/* EXPORT PDF */}
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-4 py-2.5 text-sm font-semibold text-[#475467] shadow-sm transition hover:border-[#1F5FA6] hover:text-[#1F5FA6]"
          >
            <span>↓</span>
            Export PDF
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
        {/* LEFT */}
        <div className="min-h-0 overflow-auto pr-1">
          <div className="space-y-4">
            {/* REPORT INFORMATION */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <h2 className="text-sm font-bold text-[#101C2E]">
                  Report Information
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 lg:grid-cols-3">
                <InfoItem label="Report ID" value={report.id} />
                <InfoItem label="Reporter" value={report.reporter} />
                <InfoItem label="Contact Number" value={report.contact} />
                <InfoItem label="Category" value={report.category} />
                <InfoItem label="Location" value={report.location} />
                <InfoItem label="Submitted" value={report.submitted} />
              </div>
            </section>

            {/* DESCRIPTION */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <h2 className="text-sm font-bold text-[#101C2E]">
                  Report Description
                </h2>
              </div>

              <div className="p-5">
                <p className="text-sm leading-6 text-[#475467]">
                  {report.description}
                </p>
              </div>
            </section>
            {/* AUTOMATED RISK ASSESSMENT */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF1FA] text-[#1F5FA6]">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 3l8 4v5c0 4.8-3.4 7.8-8 9-4.6-1.2-8-4.2-8-9V7l8-4z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-[#101C2E]">
                        Automated Risk Assessment
                      </h2>

                      <p className="mt-0.5 text-xs text-[#667085]">
                        System-generated assessment based on resident-submitted
                        information.
                      </p>
                    </div>
                  </div>

                  {report.triage.recommendation ? (
                    <div
                      className={`rounded-lg border px-4 py-2.5 ${
                        getRecommendationStyle(report.triage.recommendation)
                          .container
                      }`}
                    >
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                        Assessment Status
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-4">
                        <span
                          className={`text-sm font-bold ${
                            getRecommendationStyle(report.triage.recommendation)
                              .text
                          }`}
                        >
                          {report.triage.recommendation}
                        </span>

                        {report.triage.score !== null && (
                          <span className="text-xs font-bold text-[#667085]">
                            Risk Score: {report.triage.score} / 20
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="rounded-full bg-[#F2F4F7] px-3 py-1.5 text-[11px] font-bold text-[#667085]">
                      Assessment Pending
                    </span>
                  )}
                </div>
              </div>

              {report.triage.recommendation ? (
                <>
                  <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2">
                    <AutomatedRiskItem
                      label="Water Level"
                      value={report.triage.waterLevel}
                      score={null}
                    />

                    <AutomatedRiskItem
                      label="Affected Residents"
                      value={
                        report.triage.affectedResidents !== null
                          ? `${report.triage.affectedResidents} residents`
                          : "Not reported"
                      }
                      score={null}
                    />

                    <AutomatedRiskItem
                      label="Road Passability"
                      value={report.triage.roadPassability}
                      score={null}
                    />

                    <AutomatedRiskItem
                      label="Location Risk"
                      value={report.triage.locationRisk}
                      score={null}
                      highlighted={["High", "Critical"].includes(
                        report.triage.locationRisk,
                      )}
                    />

                    <AutomatedRiskItem
                      label="Assistance / Evacuation Need"
                      value={report.triage.assistanceEvacuationNeed}
                      score={null}
                      highlighted={
                        report.triage.assistanceEvacuationNeed ===
                          "Immediate evacuation required" ||
                        report.triage.assistanceEvacuationNeed ===
                          "Evacuation recommended"
                      }
                    />

                    <AutomatedRiskItem
                      label="Assessment Status"
                      value="System Generated"
                      score={null}
                      highlighted
                    />
                  </div>

                  {report.triage.remarks && (
                    <div className="mx-5 mb-5 rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
                        Assessment Remarks
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#475467]">
                        {report.triage.remarks}
                      </p>
                    </div>
                  )}

                  <div className="mx-5 mb-5 rounded-lg border border-[#FEDF89] bg-[#FFFCF5] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FEF0C7] text-[#B54708]">
                        !
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#7A2E0E]">
                          Automated recommendation
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#8A4B08]">
                          The system generated this recommendation from the
                          information submitted with the report. Barangay
                          personnel must review the assessment before confirming
                          the final priority.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-5">
                  <div className="rounded-lg border border-dashed border-[#D0D5DD] bg-[#F8FAFC] px-5 py-8 text-center">
                    <p className="text-sm font-bold text-[#344054]">
                      Risk assessment not yet available
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#667085]">
                      Assessment data is not available for this report yet. Only
                      information recorded in the report database is displayed.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* EVIDENCE */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <h2 className="text-sm font-bold text-[#101C2E]">
                  Submitted Evidence
                </h2>

                <p className="mt-0.5 text-xs text-[#667085]">
                  {(report.evidence || []).length} attachments submitted report.
                </p>
              </div>

              {(report.evidence || []).length > 0 ? (
                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  {(report.evidence || []).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="overflow-hidden rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] text-left transition hover:border-[#1F5FA6]"
                    >
                      <div className="flex h-28 items-center justify-center bg-[#EAF1FA] text-2xl text-[#1F5FA6]">
                        ▧
                      </div>

                      <div className="px-3 py-2.5">
                        <p className="truncate text-xs font-semibold text-[#344054]">
                          {item.label}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-5">
                  <div className="rounded-lg border border-dashed border-[#E4E7EC] bg-[#F8FAFC] px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-[#667085]">
                      No evidence attached
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* RIGHT */}
        <div className="min-h-0 overflow-auto pr-1">
          <div className="space-y-4">
            {/* STATUS */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <h2 className="text-sm font-bold text-[#101C2E]">
                  Current Status
                </h2>
              </div>

              <div className="p-5">
                <div className="rounded-lg bg-[#EEF4FF] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    Response Status
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#174A86]">
                    {status}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#667085]">
                    {statusDescription}
                  </p>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="report-status"
                    className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]"
                  >
                    Update Status
                  </label>

                  <select
                    id="report-status"
                    value={status}
                    onChange={(event) => handleStatusChange(event.target.value)}
                    disabled={!incident || !nextIncidentStatus}
                    className="mt-2 h-10 w-full rounded-lg border border-[#E4E7EC] bg-white px-3 text-sm font-medium text-[#344054] outline-none transition focus:border-[#1F5FA6] disabled:cursor-not-allowed disabled:bg-[#F8FAFC]"
                  >
                    <option value={status}>{status}</option>
                    {nextIncidentStatus && (
                      <option value={nextIncidentStatus}>
                        {nextIncidentStatus}
                      </option>
                    )}
                  </select>

                  {incident && nextIncidentStatus ? (
                    <p className="mt-2 text-[11px] text-[#667085]">
                      Next allowed status: {nextIncidentStatus}
                    </p>
                  ) : incident ? (
                    <p className="mt-2 text-[11px] font-semibold text-[#667085]">
                      This incident has completed its response workflow.
                    </p>
                  ) : (
                    <p className="mt-2 text-[11px] text-[#667085]">
                      This report does not have an incident record yet.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* PRIORITY ASSIGNMENT */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <h2 className="text-sm font-bold text-[#101C2E]">
                  Priority Assignment
                </h2>

                <p className="mt-0.5 text-xs text-[#667085]">
                  Review the system recommendation and confirm the final
                  priority.
                </p>
              </div>

              <div className="space-y-4 p-5">
                <div
                  className={`rounded-lg border p-4 ${
                    report.triage.recommendation
                      ? getRecommendationStyle(report.triage.recommendation)
                          .container
                      : "border-[#E4E7EC] bg-[#F8FAFC]"
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                    Assessment Status
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="text-lg font-bold text-[#101C2E]">
                      {report.triage.recommendation || "Not assessed"}
                    </p>

                    {report.triage.score !== null &&
                      report.triage.score !== undefined && (
                        <span className="text-xs font-bold text-[#667085]">
                          {report.triage.score}
                        </span>
                      )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
                    Final Priority
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {["Low", "Moderate", "High", "Critical"].map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        disabled={priorityLoading || !canAssignPriority}
                        onClick={() => {
                          setSelectedPriority(priority);
                          setPriorityError("");
                        }}
                        className={`rounded-lg border px-3 py-2.5 text-xs font-bold transition ${
                          selectedPriority === priority
                            ? priorityStyles[priority]
                            : "border-[#E4E7EC] bg-white text-[#667085] hover:border-[#1F5FA6] hover:text-[#1F5FA6]"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
                    Decision
                  </p>

                  <div className="mt-2 rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] px-3 py-3">
                    <p className="text-xs font-semibold text-[#344054]">
                      {selectedPriority
                        ? "Priority selected for confirmation"
                        : "Awaiting final priority"}
                    </p>
                  </div>
                </div>

                {priorityError && (
                  <p className="rounded-lg border border-[#FECDCA] bg-[#FEF3F2] px-3 py-2 text-xs font-semibold text-[#B42318]">
                    {priorityError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleConfirmPriority}
                  disabled={
                    priorityLoading || !canAssignPriority || !selectedPriority
                  }
                  className="w-full rounded-lg bg-[#1F5FA6] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1F5FA6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {priorityLoading ? "Saving Priority..." : "Confirm Priority"}
                </button>
              </div>
            </section>

            {/* ASSIGNMENT */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <h2 className="text-sm font-bold text-[#101C2E]">
                  Response Assignment
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <InfoItem label="Response Team" value={assignment.team} />

                <InfoItem
                  label="Assigned Personnel"
                  value={assignment.personnel}
                />

                <InfoItem label="Assigned At" value={assignment.assignedAt} />

                {!incident && status === "Prioritized" ? (
                  <button
                    type="button"
                    onClick={handleCreateIncident}
                    disabled={assignmentLoading}
                    className="w-full rounded-lg bg-[#1F5FA6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1F5FA6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {assignmentLoading
                      ? "Creating Incident..."
                      : "Create Incident"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAssignmentError("");
                      setShowAssignmentModal(true);
                    }}
                    disabled={!incident}
                    className="w-full rounded-lg border border-[#1F5FA6] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F5FA6] transition hover:bg-[#EAF1FA] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Change Assignment
                  </button>
                )}
              </div>
            </section>

            {/* VERIFICATION */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <h2 className="text-sm font-bold text-[#101C2E]">
                  Verification
                </h2>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#344054]">
                      Verification Status
                    </p>

                    <p className="mt-0.5 text-xs text-[#667085]">
                      {verificationDescription}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      report.verification === "Verified"
                        ? "bg-[#ECFDF3] text-[#027A48]"
                        : "bg-[#FFF7ED] text-[#B54708]"
                    }`}
                  >
                    {report.verification}
                  </span>
                </div>
              </div>
            </section>

            {/* HISTORY */}
            <section className="rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
              <div className="border-b border-[#E4E7EC] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-[#101C2E]">
                    Status History
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowMoreHistory((current) => !current)}
                    className="text-[11px] font-semibold text-[#1F5FA6]"
                  >
                    {showMoreHistory ? "Show Less" : "View All"}
                  </button>
                </div>
              </div>

              <div className="p-5">
                {visibleHistory.length > 0 ? (
                  <div className="space-y-4">
                    {visibleHistory.map((item, index) => (
                      <div
                        key={`${item.status}-${item.time}-${index}`}
                        className="flex gap-3"
                      >
                        <div className="flex flex-col items-center">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EAF1FA] text-xs font-bold text-[#1F5FA6]">
                            <Check size={14} strokeWidth={3} />
                          </span>

                          {index !== visibleHistory.length - 1 && (
                            <span className="mt-1 h-full w-px bg-[#E4E7EC]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#344054]">
                            {item.status}
                          </p>

                          <p className="mt-0.5 text-[11px] leading-4 text-[#667085]">
                            {item.detail}
                          </p>

                          <p className="mt-1 text-[11px] font-semibold text-[#98A2B3]">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#667085]">
                    No status history is available for this report yet.
                  </p>
                )}
              </div>
            </section>

            {/* NEXT RESPONSE ACTION */}
            {incident && nextIncidentStatus && (
              <button
                type="button"
                onClick={() => handleStatusChange(nextIncidentStatus)}
                className="w-full rounded-lg bg-[#1F5FA6] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1F5FA6]"
              >
                {nextIncidentStatus === "Dispatched"
                  ? "Dispatch Incident"
                  : nextIncidentStatus === "In Progress"
                    ? "Start Response"
                    : nextIncidentStatus === "Resolved"
                      ? "Mark as Resolved"
                      : "Close Incident"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ASSIGNMENT MODAL */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101C2E]/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#101C2E]">
                  Assign Response Team
                </h2>

                <p className="mt-1 text-xs text-[#667085]">
                  Assign personnel to this incident.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAssignmentError("");
                  setShowAssignmentModal(false);
                }}
                className="text-lg font-bold text-[#98A2B3] hover:text-[#344054]"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="text-xs font-bold text-[#475467]">
                  Response Team
                </label>

                <select
                  value={selectedTeam}
                  disabled
                  className="mt-2 h-11 w-full rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] px-3 text-sm text-[#475467] outline-none disabled:cursor-not-allowed"
                >
                  <option value={selectedTeam}>
                    {selectedTeam || "Select personnel first"}
                  </option>
                </select>
                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Team is based on the selected personnel record.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#475467]">
                  Assigned Personnel
                </label>

                <select
                  value={selectedPersonnel}
                  onChange={(event) => {
                    const personnelId = event.target.value;
                    setSelectedPersonnel(personnelId);

                    const person = personnelList.find(
                      (item) => String(item.id) === personnelId,
                    );

                    setSelectedTeam(person?.team || "");
                  }}
                  className="mt-2 h-11 w-full rounded-lg border border-[#E4E7EC] px-3 text-sm outline-none focus:border-[#1F5FA6]"
                >
                  <option value="">Select personnel</option>

                  {personnelList
                    .filter(
                      (person) =>
                        person.status === "Active" &&
                        (person.availability === "Available" ||
                          String(person.id) === selectedPersonnel),
                    )
                    .map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} — {person.team || "No team"}
                      </option>
                    ))}
                </select>
              </div>

              {assignmentError && (
                <p className="rounded-lg border border-[#FECDCA] bg-[#FEF3F2] px-3 py-2 text-xs font-semibold text-[#B42318]">
                  {assignmentError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E4E7EC] px-6 py-4">
              <button
                type="button"
                onClick={() => setShowAssignmentModal(false)}
                className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-sm font-semibold text-[#475467]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveAssignment}
                disabled={assignmentLoading || !selectedPersonnel}
                className="rounded-lg bg-[#1F5FA6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1F5FA6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assignmentLoading ? "Saving..." : "Save Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportDetails;
