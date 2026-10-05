export const ROLES = {
  ADMIN: "Administrator",
  PERSONNEL: "Barangay Personnel",
  RESPONDER: "Emergency Responder",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    "dashboard.view",

    "reports.view",
    "reports.create",
    "reports.edit",
    "reports.delete",

    "verification.view",
    "verification.manage",

    "prioritization.view",
    "prioritization.manage",

    "map.view",

    "residents.view",
    "residents.manage",

    "personnel.view",
    "personnel.manage",

    "announcements.view",
    "announcements.create",
    "announcements.edit",
    "announcements.publish",
    "announcements.archive",

    "audit.view",

    "settings.view",
    "settings.manage",
  ],

  [ROLES.PERSONNEL]: [
    "dashboard.view",

    "reports.view",
    "reports.create",
    "reports.edit",

    "verification.view",
    "verification.manage",

    "prioritization.view",
    "prioritization.manage",

    "map.view",

    "residents.view",

    "personnel.view",

    "announcements.view",

    "audit.view",
  ],

  [ROLES.RESPONDER]: [
    "dashboard.view",

    "reports.view",

    "map.view",
  ],
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

export function normalizeRole(role) {
  const roleMap = {
    admin: ROLES.ADMIN,
    personnel: ROLES.PERSONNEL,
    responder: ROLES.RESPONDER,
  };

  return roleMap[role?.toLowerCase()] || role;
}