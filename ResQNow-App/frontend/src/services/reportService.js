// src/services/reportService.js

import {
  apiRequest,
  getCsrfCookie,
} from './api';

// ============ RESPONSE HELPER ============
// Laravel may return a Resource directly
// or inside a "report" / "data" property.
function extractReport(data) {
  return (
    data?.report?.data ||
    data?.report ||
    data?.data ||
    data
  );
}

// ============ GET ALL REPORTS ============
// Get all reports belonging to
// the logged-in resident.
export async function getReports() {
  const data = await apiRequest(
    '/api/reports'
  );

  // Laravel Resource collections
  // normally return { data: [...] }
  return Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];
}

// ============ GET ONE REPORT ============
// Get a report using its public code.
// Example: EM-000001
export async function getReport(
  reportCode
) {
  const data = await apiRequest(
    `/api/reports/${encodeURIComponent(
      reportCode
    )}`
  );

  return extractReport(data);
}

// ============ CREATE EMERGENCY REPORT ============
export async function createEmergencyReport(
  reportData
) {
  // Sanctum session POST requests
  // need a fresh CSRF cookie.
  await getCsrfCookie();

  const data = await apiRequest(
    '/api/reports/emergency',
    {
      method: 'POST',
      body: JSON.stringify(reportData),
    }
  );

  return extractReport(data);
}

// Emergency evidence uploads after the report is created, so a slow upload
// cannot delay an urgent report from reaching the response queue.
export async function uploadReportEvidence(reportCode, photo) {
  const formData = new FormData();
  formData.append('photo', photo);

  const data = await apiRequest(
    `/api/reports/${encodeURIComponent(reportCode)}/evidence`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return data;
}

// ============ CREATE NON-EMERGENCY REPORT ============
// Non-emergency uses FormData because
// photo evidence may be attached.
export async function createNonEmergencyReport(
  reportData
) {
  await getCsrfCookie();

  const formData =
    new FormData();

  formData.append(
    'concernCode',
    reportData.concernCode
  );

  if (reportData.subcategory) {
    formData.append(
      'subcategory',
      reportData.subcategory
    );
  }

  formData.append(
    'reportingFor',
    reportData.reportingFor
  );

  if (reportData.subjectName) {
    formData.append(
      'subjectName',
      reportData.subjectName
    );
  }

  if (reportData.subjectContact) {
    formData.append(
      'subjectContact',
      reportData.subjectContact
    );
  }

  if (reportData.relationshipNote) {
    formData.append(
      'relationshipNote',
      reportData.relationshipNote
    );
  }

  formData.append(
    'purok',
    reportData.purok
  );

  formData.append(
    'location',
    reportData.location
  );

  if (reportData.landmark) {
    formData.append(
      'landmark',
      reportData.landmark
    );
  }

  if (
    reportData.latitude !== null &&
    reportData.latitude !== undefined
  ) {
    formData.append(
      'latitude',
      String(
        reportData.latitude
      )
    );
  }

  if (
    reportData.longitude !== null &&
    reportData.longitude !== undefined
  ) {
    formData.append(
      'longitude',
      String(
        reportData.longitude
      )
    );
  }

  formData.append(
    'description',
    reportData.description
  );

  if (
    reportData.requiredAssistance
  ) {
    formData.append(
      'requiredAssistance',
      reportData.requiredAssistance
    );
  }

  // Laravel expects an actual array.
  (
    reportData.affectedIndividuals ||
    []
  ).forEach((item) => {
    formData.append(
      'affectedIndividuals[]',
      item
    );
  });

  if (reportData.photo) {
    formData.append(
      'photo',
      reportData.photo
    );
  }

  const data = await apiRequest(
    '/api/reports/non-emergency',
    {
      method: 'POST',
      body: formData,
    }
  );

  return extractReport(data);
}
// ============ CANCEL RESIDENT REPORT ============
// Shared cancellation for Emergency, Non-Emergency, and SOS reports.
// The backend derives ownership from the Sanctum-authenticated resident.
export async function cancelReport(
  reportCode,
  {
    reason,
    remarks = '',
    expectedVersion,
  }
) {
  await getCsrfCookie();

  const data = await apiRequest(
    `/api/reports/${encodeURIComponent(
      reportCode
    )}/cancel`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        reason,
        remarks:
          remarks?.trim() || null,
        expectedVersion,
      }),
    }
  );

  return extractReport(data);
}
