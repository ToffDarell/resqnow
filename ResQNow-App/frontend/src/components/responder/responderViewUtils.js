export const PRIORITY_RANK = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export function isOpenReport(report) {
  return !['Resolved', 'Invalid', 'Cancelled'].includes(report?.status);
}

export function getCurrentAssignment(report, userId) {
  if (!Array.isArray(report?.assignedPersonnelList)) return null;

  return (
    report.assignedPersonnelList.find(
      (assignment) => String(assignment?.id) === String(userId)
    ) || null
  );
}

export function needsAcknowledgement(report, userId) {
  const assignment = getCurrentAssignment(report, userId);
  return Boolean(assignment && !assignment.acknowledged);
}

function timestamp(value) {
  if (!value) return Number.POSITIVE_INFINITY;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
}

export function sortOperationalReports(reports, userId) {
  return [...reports].sort((a, b) => {
    const priorityDiff =
      (PRIORITY_RANK[a?.priority] || 9) -
      (PRIORITY_RANK[b?.priority] || 9);

    if (priorityDiff !== 0) return priorityDiff;

    const acknowledgeDiff =
      Number(needsAcknowledgement(b, userId)) -
      Number(needsAcknowledgement(a, userId));

    if (acknowledgeDiff !== 0) return acknowledgeDiff;

    const aAssigned = getCurrentAssignment(a, userId)?.assignedAt;
    const bAssigned = getCurrentAssignment(b, userId)?.assignedAt;
    const assignmentDiff = timestamp(aAssigned) - timestamp(bAssigned);

    if (assignmentDiff !== 0) return assignmentDiff;

    return timestamp(a?.createdAt) - timestamp(b?.createdAt);
  });
}

export function validCoordinates(report) {
  const lat = Number(report?.latitude);
  const lng = Number(report?.longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    return null;
  }

  return { lat, lng };
}

export function directionsInfo(report) {
  const coordinates = validCoordinates(report);

  if (coordinates) {
    return {
      href: `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
      label: 'Directions',
      detail: 'Exact submitted coordinates',
      exact: true,
    };
  }

  const query = [report?.location, report?.landmark]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query || 'Barangay Camunatan'
    )}`,
    label: 'Search location',
    detail: 'Based on submitted address',
    exact: false,
  };
}

function telHref(number) {
  if (!number) return null;
  const cleaned = String(number).replace(/[^+\d]/g, '');
  return cleaned ? `tel:${cleaned}` : null;
}

export function contactTarget(report) {
  const anotherPerson =
    report?.reportingFor && report.reportingFor !== 'Myself';

  if (anotherPerson && report?.subjectContact) {
    return {
      name: report.subjectName || 'Person involved',
      number: report.subjectContact,
      href: telHref(report.subjectContact),
      label: 'Call person involved',
      kind: 'subject',
    };
  }

  if (report?.reporter?.contactNumber) {
    return {
      name: report.reporter.fullName || 'Reporter',
      number: report.reporter.contactNumber,
      href: telHref(report.reporter.contactNumber),
      label: 'Call reporter',
      kind: 'reporter',
    };
  }

  if (report?.subjectContact) {
    return {
      name: report.subjectName || 'Person involved',
      number: report.subjectContact,
      href: telHref(report.subjectContact),
      label: 'Call person involved',
      kind: 'subject',
    };
  }

  return {
    name: 'Contact unavailable',
    number: null,
    href: null,
    label: 'No contact number',
    kind: null,
  };
}

export function formatDateTime(value) {
  if (!value) return 'Time unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString([], {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatClock(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getPrimaryAction(report) {
  const lifecycle = ['acknowledge', 'start', 'en-route', 'arrived', 'resolve'];
  const actions = Array.isArray(report?.responderActions)
    ? report.responderActions
    : [];

  return (
    lifecycle
      .map((value) => actions.find((action) => action.value === value))
      .find(Boolean) || null
  );
}
