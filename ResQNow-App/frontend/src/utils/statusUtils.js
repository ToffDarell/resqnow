// src/utils/statusUtils.js

// ============ STATUS STYLES ============
// One status = one visual meaning across resident and responder views.
function getStatusStyle(status) {
  switch (status) {
    case 'Submitted':
      return 'border bg-resqnow-violet/10 text-resqnow-violet border-resqnow-violet/20';

    case 'Pending Verification':
      return 'border bg-slate-100 text-slate-600 border-slate-200';

    case 'Verified':
      return 'border bg-resqnow-safe/10 text-resqnow-safe border-resqnow-safe/20';

    case 'Assigned':
      return 'border bg-resqnow-insight/10 text-resqnow-insight border-resqnow-insight/20';

    case 'In Progress':
    case 'Responders En Route':
      return 'border bg-resqnow-pending/10 text-resqnow-pending border-resqnow-pending/20';

    case 'Responded':
      return 'border bg-resqnow-indigo/10 text-resqnow-indigo border-resqnow-indigo/20';

    case 'Resolved':
      return 'border bg-resqnow-safe/10 text-resqnow-safe border-resqnow-safe/20';

    case 'Invalid':
      return 'border bg-resqnow-crimson/10 text-resqnow-crimson border-resqnow-crimson/20';

    case 'Cancelled':
      return 'border bg-slate-100 text-slate-600 border-slate-200';

    default:
      return 'border bg-slate-100 text-slate-600 border-slate-200';
  }
}

// ============ PRIORITY STYLES ============
function getPriorityStyle(priority) {
  switch (priority) {
    case 'Critical':
      return 'border bg-resqnow-crimson/10 text-resqnow-crimson border-resqnow-crimson/25';

    case 'High':
      return 'border bg-resqnow-pending/10 text-resqnow-pending border-resqnow-pending/25';

    case 'Medium':
      return 'border bg-bgy-yellow-soft text-bgy-navy border-bgy-yellow/60';

    case 'Low':
      return 'border bg-slate-100 text-slate-600 border-slate-200';

    default:
      return 'border bg-slate-50 text-slate-500 border-slate-200';
  }
}

// ============ STATUS LABELS ============
const statusKeys = {
  Submitted: 'status.submitted',
  'Pending Verification': 'status.pendingVerification',
  Verified: 'status.verified',
  Assigned: 'status.assigned',
  'In Progress': 'status.inProgress',
  'Responders En Route': 'status.respondersEnRoute',
  Responded: 'status.responded',
  Resolved: 'status.resolved',
  Invalid: 'status.invalid',
};

function getStatusLabel(status, t) {
  const key = statusKeys[status];
  if (!key || !t) return status;
  return t(key);
}

// ============ PRIORITY LABELS ============
const priorityKeys = {
  Critical: 'priority.critical',
  High: 'priority.high',
  Medium: 'priority.medium',
  Low: 'priority.low',
};

function getPriorityLabel(priority, t) {
  const key = priorityKeys[priority];
  if (!key || !t) return priority;
  return t(key);
}

export {
  getStatusStyle,
  getPriorityStyle,
  getStatusLabel,
  getPriorityLabel,
};
