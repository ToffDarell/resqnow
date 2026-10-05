import { apiFetch } from "./apiClient";

/**
 * Official taxonomy categories aligned with handoff requirements
 */
export const REPORT_CATEGORIES = [
  "Life-Threatening Emergency",
  "Medical Emergency",
  "Fire / Smoke / Electrical Hazard",
  "Flood Rescue Needed",
  "Road Accident",
  "Public Safety / Violence",
  "Immediate Evacuation Assistance",
  "Other Urgent Emergency",
];

/**
 * Convert backend report data into frontend-friendly format.
 */
function formatReport(report) {
  return {
    id: `RPT-${String(report.id).padStart(4, "0")}`,

    // Actual database ID
    databaseId: report.id,

    type: report.report_type || "Unknown Report",
    category: report.category || "Uncategorized",
    location: report.location || "No location provided",

    submitted: report.created_at
      ? new Date(report.created_at).toLocaleString()
      : "Unknown",

    reporter: report.user?.name || "Unknown Resident",

    priority: report.priority || "Not Prioritized",
    currentPriority: report.priority || null,

    verification: report.verification_status || "Pending",
    status: report.status || "For Verification",

    description: report.description || "No description provided.",

    latitude: report.latitude,
    longitude: report.longitude,

    userId: report.user_id,

    affected: report.affected_people || "Not specified",
    vulnerable: report.vulnerable_persons || "Not specified",
    waterLevel: report.water_level || "Not specified",
    roadPassability: report.road_passability || "Not specified",

    verificationRemarks: report.verification_remarks || null,
    returnedAt: report.returned_at || null,

    evidence: "No evidence information",
    affectedResidents: report.affected_residents ?? null,
    locationRisk: report.location_risk || null,
    assistanceEvacuationNeed: report.assistance_evacuation_need || null,
    additionalRiskFactors: report.additional_risk_factors || [],
    triageRemarks: report.triage_remarks || null,
    triageScore: report.triage_score ?? null,
    triageRecommendation: report.triage_recommendation || null,
    triageAssessedAt: report.triage_assessed_at || null,
    triageAssessedBy: report.triage_assessed_by || null,
  };
}

/**
 * Get reports waiting for verification.
 */
export async function getReportsForVerification() {
  const response = await apiFetch("/reports/for-verification");

  if (!response.ok) {
    throw new Error("Failed to fetch reports for verification.");
  }

  const result = await response.json();

  return result.data.map(formatReport);
}

/**
 * Verify a report.
 */
export async function verifyReport(reportId) {
  const response = await apiFetch(`/reports/${reportId}/verify`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to verify report.");
  }

  return response.json();
}

/**
 * Return a report for review with remarks.
 */
export async function returnReportForReview(reportId, remarks) {
  const response = await apiFetch(`/reports/${reportId}/return`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ remarks }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to return report for review.",
    );
  }

  const result = await response.json();

  return result.data;
}

/**
 * Create a new manual report.
 */
export async function createReport(reportData) {
  const response = await apiFetch("/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to create report.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Create a new report with optional photo evidence using FormData (R04).
 */
export async function createReportWithEvidence(reportData, imageFile = null) {
  const formData = new FormData();

  Object.keys(reportData).forEach((key) => {
    if (reportData[key] !== null && reportData[key] !== undefined) {
      formData.append(key, reportData[key]);
    }
  });

  if (imageFile) {
    formData.append("evidence", imageFile);
  }

  const response = await apiFetch("/reports", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to submit report with evidence.",
    );
  }

  return result.data;
}

/**
 * Get verified reports waiting for prioritization.
 */
export async function getReportsForPrioritization() {
  const response = await apiFetch("/reports/for-prioritization");

  if (!response.ok) {
    throw new Error("Failed to fetch reports for prioritization.");
  }

  const result = await response.json();

  return result.data.map(formatReport);
}

/**
 * Assign priority to a report.
 */
export async function assignReportPriority(
  reportId,
  priority,
  overrideReason = "",
) {
  const response = await apiFetch(`/reports/${reportId}/priority`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      priority,
      override_reason: overrideReason,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to assign report priority.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Assess triage factors for a report.
 */
export async function assessReportTriage(reportId, triageData) {
  const response = await apiFetch(`/reports/${reportId}/triage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(triageData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to assess report triage.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Get all reports.
 */
export async function getAllReports() {
  const response = await apiFetch("/reports");

  if (!response.ok) {
    throw new Error("Failed to fetch reports.");
  }

  const result = await response.json();

  return result.data.map(formatReport);
}

/**
 * Get all incidents.
 */
export async function getAllIncidents() {
  const response = await apiFetch("/incidents");

  if (!response.ok) {
    throw new Error("Failed to fetch incidents.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Get a specific incident.
 */
export async function getIncidentById(incidentId) {
  const response = await apiFetch(`/incidents/${incidentId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch incident.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Create an incident from a prioritized report.
 */
export async function createIncidentFromReport(reportId) {
  const response = await apiFetch(`/reports/${reportId}/create-incident`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to create incident.");
  }

  return response.json();
}

/**
 * Get all registered residents.
 */
export async function getAllResidents() {
  const response = await apiFetch("/residents");

  if (!response.ok) {
    throw new Error("Failed to fetch residents.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Update resident verification status.
 */
export async function updateResidentVerification(
  residentId,
  verificationStatus,
  verificationRemarks = "",
) {
  const response = await apiFetch(`/residents/${residentId}/verification`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      verification_status: verificationStatus,
      verification_remarks: verificationRemarks,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to update resident verification.",
    );
  }

  return response.json();
}

/**
 * Get all personnel.
 */
export async function getAllPersonnel() {
  const response = await apiFetch("/personnel");

  if (!response.ok) {
    throw new Error("Failed to fetch personnel.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Assign personnel to an incident.
 */
export async function assignIncidentPersonnel(incidentId, personnelId) {
  const response = await apiFetch(`/incidents/${incidentId}/assignment`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assigned_personnel_id: personnelId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to assign personnel to incident.",
    );
  }

  const result = await response.json();

  return result.data;
}

export async function updateIncidentStatus(incidentId, status) {
  const response = await apiFetch(`/incidents/${incidentId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to update incident status.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Get all announcements.
 */
export async function getAllAnnouncements() {
  const response = await apiFetch("/announcements");

  if (!response.ok) {
    throw new Error("Failed to fetch announcements.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Create a new announcement.
 */
export async function createAnnouncement(announcementData) {
  const response = await apiFetch("/announcements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(announcementData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to create announcement.");
  }

  return response.json();
}

/**
 * Get all audit logs.
 */
export async function getAllAuditLogs() {
  const response = await apiFetch("/audit-logs");

  if (!response.ok) {
    throw new Error("Failed to fetch audit logs.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Create an audit log.
 */
export async function createAuditLog(auditLogData) {
  const response = await apiFetch("/audit-logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(auditLogData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to create audit log.");
  }

  return response.json();
}

/**
 * Update an existing announcement.
 */
export async function updateAnnouncement(announcementId, announcementData) {
  const response = await apiFetch(`/announcements/${announcementId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(announcementData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to update announcement.");
  }

  return response.json();
}

/**
 * Update announcement status only.
 */
export async function updateAnnouncementStatus(announcementId, status) {
  const response = await apiFetch(`/announcements/${announcementId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to update announcement status.",
    );
  }

  return response.json();
}

export async function getSystemSettings() {
  const response = await apiFetch("/settings");

  if (!response.ok) {
    throw new Error("Failed to fetch system settings.");
  }

  const result = await response.json();

  return result.data;
}

export async function updateSystemSettings(settingsData) {
  const response = await apiFetch("/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settingsData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to update system settings.");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Delete an announcement.
 */
export async function deleteAnnouncement(announcementId) {
  const response = await apiFetch(`/announcements/${announcementId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Failed to delete announcement.");
  }

  return response.json();
}

export async function getNotifications() {
  const response = await apiFetch("/notifications");

  if (!response.ok) {
    throw new Error("Failed to fetch notifications.");
  }

  const result = await response.json();

  return result.data;
}

export async function getUnreadNotificationCount() {
  const response = await apiFetch("/notifications/unread-count");

  if (!response.ok) {
    throw new Error("Failed to fetch unread notification count.");
  }

  const result = await response.json();

  return result.data.count;
}

export async function markNotificationAsRead(notificationId) {
  const response = await apiFetch(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to mark notification as read.",
    );
  }

  const result = await response.json();

  return result.data;
}

export async function markAllNotificationsAsRead() {
  const response = await apiFetch("/notifications/read-all", {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to mark all notifications as read.",
    );
  }

  return response.json();
}
