// src/utils/updateUtils.js

// ============ PRIORITY SCORE ============
// Used when sorting updates
const priorityScore = {
  critical: 3,
  important: 2,
  normal: 1,
};

// ============ NORMALIZE ANNOUNCEMENT ============
// Adds shared fields used by Dashboard and Updates
function normalizeAnnouncement(announcement) {
  return {
    ...announcement,

    updateSource: 'announcement',

    updateCategory:
      announcement.priority === 'critical'
        ? 'alert'
        : 'announcement',

    relatedReportId: null,
  };
}

// ============ NORMALIZE NOTIFICATION ============
// Adds shared fields used by Dashboard and Updates
function normalizeNotification(notification) {
  return {
    ...notification,

    updateSource: 'notification',

    updateCategory:
      notification.type === 'report_update'
        ? 'report'
        : notification.type === 'emergency_alert'
        ? 'alert'
        : 'notification',
  };
}

// ============ SORT UPDATES ============
// Higher priority first, then newest
function sortUpdates(a, b) {
  const aPriority =
    priorityScore[a.priority] || 0;

  const bPriority =
    priorityScore[b.priority] || 0;

  const priorityDifference =
    bPriority - aPriority;

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return (
    new Date(b.createdAt) -
    new Date(a.createdAt)
  );
}

// ============ ALL UPDATES ============
// Keeps current and expired items
// Updates page decides where expired items appear
function getAllUpdates(
  announcements,
  notifications
) {
  const combined = [
    ...announcements.map(
      normalizeAnnouncement
    ),

    ...notifications.map(
      normalizeNotification
    ),
  ];

  return combined.sort(sortUpdates);
}

// ============ DASHBOARD UPDATES ============
// Only active updates appear on Home
// Only newest update per report is kept
// Maximum of 2 compact items
function getDashboardUpdates(
  announcements,
  notifications
) {
  const now = new Date();

  let combined = [
    ...announcements.map(
      normalizeAnnouncement
    ),

    ...notifications.map(
      normalizeNotification
    ),
  ];

  // Remove expired updates from Home
  combined = combined.filter(
    (item) => {
      if (!item.expiresAt) {
        return true;
      }

      const expiration =
        new Date(
          item.expiresAt
        );

      if (
        Number.isNaN(
          expiration.getTime()
        )
      ) {
        return true;
      }

      return expiration > now;
    }
  );

  // Sort by importance and date
  combined.sort(sortUpdates);

  // Only keep newest update per report
  const seenReports =
    new Set();

  combined = combined.filter(
    (item) => {
      if (!item.relatedReportId) {
        return true;
      }

      if (
        seenReports.has(
          item.relatedReportId
        )
      ) {
        return false;
      }

      seenReports.add(
        item.relatedReportId
      );

      return true;
    }
  );

  // Dashboard only shows 2
  return combined.slice(0, 2);
}

// ============ EXPIRED CHECK ============
// Check whether an update already expired
function isUpdateExpired(update) {
  if (!update.expiresAt) {
    return false;
  }

  const expiration =
    new Date(update.expiresAt);

  if (
    Number.isNaN(
      expiration.getTime()
    )
  ) {
    return false;
  }

  return expiration <= new Date();
}

export {
  getAllUpdates,
  getDashboardUpdates,
  isUpdateExpired,
};