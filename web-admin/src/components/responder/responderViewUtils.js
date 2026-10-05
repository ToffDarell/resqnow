/**
 * Priority rank weights for sorting responder queues (T01)
 */
const PRIORITY_WEIGHTS = {
  Critical: 4,
  High: 3,
  Moderate: 2,
  Low: 1,
  "Not Prioritized": 0,
};

export function sortReportsByPriority(reports) {
  return [...reports].sort((a, b) => {
    const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
    const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
    return weightB - weightA; // Highest priority first
  });
}

export function getPriorityBadgeColor(priority) {
  switch (priority) {
    case "Critical":
      return "bg-red-700 text-white";
    case "High":
      return "bg-red-500 text-white";
    case "Moderate":
      return "bg-amber-500 text-white";
    case "Low":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
}

/**
 * Validates and parses coordinates, avoiding null/zero defaults (T02)
 */
export function parseCoordinates(lat, lng) {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  const isValidLat =
    !isNaN(parsedLat) && parsedLat !== 0 && parsedLat >= -90 && parsedLat <= 90;
  const isValidLng =
    !isNaN(parsedLng) &&
    parsedLng !== 0 &&
    parsedLng >= -180 &&
    parsedLng <= 180;

  if (isValidLat && isValidLng) {
    return [parsedLat, parsedLng];
  }

  // Return null instead of forcing a fake 0,0 point
  return null;
}
