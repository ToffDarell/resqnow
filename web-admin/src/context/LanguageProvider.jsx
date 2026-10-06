import { useMemo } from "react";
import LanguageContext from "./LanguageContextValue";

const translations = {
  English: {
    /* =========================
       NAVIGATION GROUPS
    ========================= */

    overview: "OVERVIEW",
    operations: "OPERATIONS",
    management: "MANAGEMENT",
    system: "SYSTEM",

    /* =========================
       NAVIGATION
    ========================= */

    dashboard: "Dashboard",
    allReports: "All Reports",
    reports: "Reports",
    verification: "Verification",
    prioritization: "Prioritization",
    incidentMap: "Incident Map",
    residents: "Residents",
    personnel: "Personnel",
    announcements: "Announcements",
    auditLogs: "Audit Logs",
    settingsRoles: "Settings & Roles",
    settings: "Settings",

    /* =========================
       SIDEBAR
    ========================= */

    barangayWebAdmin: "Barangay Web Admin",
    addManualReport: "Add Manual Report",
    signOut: "Sign Out",
    allSystemsOperational: "All systems operational",
    lastSync: "Last sync",
    currentAccess: "Current Access",

    /* =========================
       GENERAL ACTIONS
    ========================= */

    logout: "Logout",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    search: "Search",
    close: "Close",
    confirm: "Confirm",
    back: "Back",

    /* =========================
       TOPBAR SEARCH
    ========================= */

    searchReportsResidentsLocations:
      "Search reports, residents, or locations...",

    clearSearch: "Clear search",

    /* =========================
       NOTIFICATIONS
    ========================= */

    notifications: "Notifications",
    latestSystemActivity: "Latest system activity",
    new: "new",
    viewAllNotifications: "View all notifications",
    administrator: "Administrator",
    barangayPersonnel: "Barangay Personnel",

    evacuationAlertIssued: "Evacuation alert issued",

    evacuationAlertMessage:
      "Building A and surrounding areas require attention.",

    newReportPendingVerification: "New report pending verification",

    hazardReportWaiting: "A hazard report is waiting for personnel review.",

    medicalSupportAssigned: "Medical support assigned",

    responsePersonnelAssigned:
      "Response personnel have been assigned to the incident.",

    justNow: "Just now",
    tenMinutesAgo: "10 min ago",
    twentyFiveMinutesAgo: "25 min ago",

    /* =========================
       AUDIT LOGS
    ========================= */

    activityHistory: "Activity History",
    activityInformation: "Activity Information",
    searchActivities: "Search activities...",
    allCategories: "All Categories",

    /* =========================
       DASHBOARD
    ========================= */

    dashboardAdminLabel: "RESQNOW ADMIN DASHBOARD",

    dashboardSituation: "Here's the current situation in your barangay.",

    totalReports: "Total Reports",
    emergencyReports: "Emergency Reports",
    nonEmergencyReports: "Non-Emergency Reports",
    pendingVerification: "Pending Verification",
    resolvedReports: "Resolved Reports",

    reportsRecorded: "Reports recorded",
    emergencyCases: "Emergency cases",
    nonEmergencyCases: "Non-emergency cases",
    awaitingReview: "Awaiting review",
    successfullyResolved: "Successfully resolved",
    urgentEmergencyReports: "Urgent Emergency Reports",
    noUrgentEmergencyReports: "No urgent emergency reports at this time.",

    activeIncident: "Active Incident",
    activeIncidentStatus: "Active incident",
    noActiveIncident: "No active incident",

    currentStatus: "Current Status",
    incidentId: "Incident ID",
    location: "Location",
    status: "Status",
    priority: "Priority",

    noActiveIncidents: "No active incidents",

    allIncidentsResolved: "All recorded incidents are currently resolved.",

    priorityOverview: "Priority Overview",

    prioritizedReportsLabel: "Prioritized Reports",

    totalReportsLabel: "Total reports",

    liveUpdates: "Live Updates",

    viewAllUpdates: "View all updates",

    tryAgain: "Try again",

    loadingIncident: "Loading incident...",

    loadingUpdates: "Loading updates...",

    noIncidentUpdates: "No incident updates available.",

    alertsSent: "Alerts Sent",

    last24Hours: "Last 24h",

    peopleAccounted: "People Accounted",

    ofTotal: "of total",

    activeIncidents: "Active Incidents",

    acrossLocations: "Across locations",

    resourcesDeployed: "Resources Deployed",

    teamsAndEquipment: "Teams & equipment",

    requiresMonitoring: "Requires monitoring",

    notSpecified: "Not specified",

    notPrioritized: "Not Prioritized",

    emergencyIncident: "Emergency Incident",

    noIncidentDescription: "No incident description provided.",

    emergencyResponseMonitoring: "Emergency response requires monitoring.",
    goodMorningAdmin: "Good morning, Admin!",
    goodAfternoonAdmin: "Good afternoon, Admin!",
    goodEveningAdmin: "Good evening, Admin!",

    /* =========================
       DASHBOARD PRIORITY
    ========================= */

    critical: "Critical",
    high: "High",
    moderate: "Moderate",
    low: "Low",
    resolved: "Resolved",

    /* =========================
       ALL REPORTS
    ========================= */

    operationsLabel: "Operations",

    allReportsPageTitle: "All Reports",

    allReportsDescription: "Monitor and manage all submitted barangay reports.",

    refresh: "Refresh",

    loadingReports: "Loading reports...",

    unableToLoadReports: "Unable to load reports",

    unableToLoadReportsServer: "Unable to load reports from the server.",

    activeReports: "Active Reports",

    criticalReports: "Critical Reports",

    allSubmissions: "All submissions",

    needsAction: "Needs action",

    needsReview: "Needs review",

    resolvedCount: "resolved",

    searchReportsLocationsReporters:
      "Search reports, locations, or reporters...",

    reportsCountOf: "of",

    reportsCount: "reports",

    allStatus: "All Status",

    allPriority: "All Priority",

    report: "Report",

    submitted: "Submitted",

    noReportsFound: "No reports found",

    changeSearchOrFilters: "Try changing your search term or filters.",

    showing: "Showing",

    selectReportForDetails: "Select a report to view its details",

    /* =========================
       VERIFICATION
    ========================= */

    verificationCenter: "Verification Center",

    verificationCenterDescription:
      "Review emergency reports and resident account registrations.",

    reportVerification: "Report Verification",

    residentAccountVerification: "Resident Account Verification",

    pendingReports: "Pending Reports",

    verifiedToday: "Verified Today",

    returned: "Returned",

    selectReportToReview: "Select a report to review.",

    searchReports: "Search reports...",

    noPendingReportsVerification: "No pending reports for verification.",

    verificationServerError:
      "Unable to load reports for verification from the server.",

    returnForReviewBackendMessage:
      "Return for Review will be connected to the backend next.",

    reportVerifiedForwarded:
      "{id} has been verified and forwarded for prioritization.",

    verificationFailed:
      "Unable to verify the report. Please check the Laravel server.",

    reporter: "Reporter",

    affectedPeople: "Affected People",

    vulnerablePersons: "Vulnerable Persons",

    waterLevel: "Water Level",

    roadPassability: "Road Passability",

    description: "Description",

    noDescriptionProvided: "No description provided.",

    returnForReview: "Return for Review",

    verifyReport: "Verify Report",

    selectPendingReport: "Select a pending report to review.",

    pendingResidentAccounts: "Pending Resident Accounts",

    searchResidents: "Search residents...",

    noPendingResidentAccounts: "No pending resident accounts.",

    email: "Email",

    mobile: "Mobile",

    address: "Address",

    purok: "Purok",

    registered: "Registered",

    verificationRemarks: "Verification Remarks",

    addRemarksIfNecessary: "Add remarks if necessary...",

    rejectAccount: "Reject Account",

    approveAccount: "Approve Account",

    selectResidentAccount: "Select a resident account to review.",

    rejectionRemarksRequired:
      "Please provide verification remarks before rejecting this account.",

    residentVerificationDefaultRemark:
      "Resident account was verified as a Barangay Camunatan resident.",

    residentApproved: "{name}'s account has been approved.",

    residentRejected: "{name}'s account has been rejected.",

    /* =========================
       PRIORITIZATION
    ========================= */

    prioritizationDescription:
      "Review triage indicators and determine the response priority of verified reports.",

    prioritizationQueueActive: "Prioritization Queue Active",

    pendingReview: "Pending Review",

    reportsAwaitingPrioritization: "Reports awaiting prioritization",

    immediateAttention: "Immediate attention",

    priorityResponse: "Priority response",

    routineResponse: "Routine response",

    prioritizationQueue: "Prioritization Queue",

    reportsReadyForPriorityReview: "Reports ready for priority review",

    allPriorities: "All Priorities",

    noReportsAwaitingPrioritization: "No reports awaiting prioritization",

    verifiedReportsWillAppear: "Verified reports will appear here.",

    current: "Current",

    evacuationNeed: "Evacuation Need",

    threatToLife: "Threat to Life",

    present: "Present",

    reportDescription: "Report Description",

    priorityDecision: "Priority Decision",

    priorityDecisionDescription:
      "Confirm the recommended priority or adjust it based on personnel assessment.",

    selectedPriority: "Selected Priority",

    priorityWorkflowDescription:
      "This decision will be used by the response workflow.",

    notSelected: "Not selected",

    savingPriority: "Saving Priority...",

    confirmPriority: "Confirm Priority",

    noReportSelected: "No report selected",

    selectReportFromQueue: "Select a report from the prioritization queue.",

    unableToLoadPrioritization:
      "Unable to load prioritization reports. Please check the API connection.",

    failedToAssignPriority: "Failed to assign report priority.",

    /* =========================
   INCIDENT MAP
========================= */

    incidentMapTitle: "Incident Map",

    incidentMapDescription:
      "Monitor reported incidents, hazard-prone areas, and active response locations.",

    liveIncidentMonitoring: "Live Incident Monitoring",

    highPriority: "High Priority",

    moderatePriority: "Moderate Priority",

    routineMonitoring: "Routine monitoring",

    barangayIncidentOverview: "Barangay Incident Overview",

    floodProneArea: "Flood-prone area",

    incidents: "Incidents",

    selectIncidentToInspect: "Select an incident to inspect",

    noIncidentsFound: "No incidents found",

    noIncidentsMatchPriority: "No incidents match the selected priority.",

    mapLegend: "Map Legend",

    moderateOther: "Moderate / Other",

    hazardZone: "Hazard Zone",

    selectedIncident: "Selected Incident",

    latitude: "Latitude",

    longitude: "Longitude",

    unableToLoadIncidents: "Unable to load incidents",

    unableToLoadIncidentsServer: "Unable to load incidents from the server.",

    /* =========================
   RESIDENTS
========================= */

    residentsPageTitle: "Residents",

    residentsPageDescription:
      "Manage registered residents and review their account information.",

    residentRegistry: "Resident Registry",

    totalResidents: "Total Residents",

    registeredAccounts: "Registered accounts",

    activeAccounts: "Active Accounts",

    currentlyActive: "Currently active",

    verifiedResidents: "Verified Residents",

    activeResidentAccounts: "Active resident accounts",

    reportsSubmitted: "Reports Submitted",

    fromRegisteredResidents: "From registered residents",

    active: "Active",

    inactive: "Inactive",

    loadingResidents: "Loading residents...",

    unableToLoadResidents: "Unable to load residents",

    failedToLoadResidents: "Failed to load residents.",

    tryAgainResidents: "Try Again",

    resident: "Resident",

    contact: "Contact",

    role: "Role",

    noResidentsFound: "No residents found",

    adjustSearchOrStatus: "Try adjusting your search or status filter.",

    selectResidentToViewDetails: "Select a resident to view details",

    contactInformation: "Contact Information",

    emailAddress: "Email Address",

    mobileNumber: "Mobile Number",

    accountInformation: "Account Information",

    accountRole: "Account Role",

    reportActivity: "Report Activity",

    submittedReports: "submitted reports",

    reportsAssociatedWithAccount:
      "Reports associated with this resident account.",

    viewResidentReports: "View Resident Reports",

    noResidentSelected: "No resident selected",

    selectResidentFromRegistry: "Select a resident from the registry.",

    personnelPageTitle: "Personnel",
    personnelPageDescription:
      "Manage barangay response personnel, teams, and current assignments.",
    personnelRegistry: "Personnel Registry",
    totalPersonnel: "Total Personnel",
    registeredPersonnel: "Registered personnel",
    activePersonnel: "Active Personnel",

    available: "Available",
    readyForAssignment: "Ready for assignment",
    assigned: "Assigned",
    handlingActiveReports: "Handling active reports",
    unableToLoadPersonnel:
      "Unable to load personnel data. Please check the Laravel server.",
    loadingPersonnel: "Loading personnel...",

    team: "Team",
    availability: "Availability",

    assignment: "Assignment",
    searchPersonnel: "Search personnel...",

    noPersonnelFound: "No personnel found",

    of: "of",
    selectPersonnelToViewDetails: "Select personnel to view details",
    personnelInformation: "Personnel Information",
    responseTeam: "Response Team",

    currentAssignment: "Current Assignment",
    activeReport: "Active Report",
    currentLocation: "Current location",
    noActiveAssignment: "No active assignment",
    personnelAvailableForDeployment:
      "This personnel is currently available for deployment.",

    joined: "Joined",
    viewAssignment: "View Assignment",
    noActiveAssignmentButton: "No Active Assignment",
    noPersonnelSelected: "No personnel selected",
    selectPersonnelFromRegistry: "Select personnel from the registry",
    unknownPersonnel: "Unknown Personnel",

    notAssigned: "Not assigned",
    notProvided: "Not provided",
    unavailable: "Unavailable",

    /* =========================
       ANNOUNCEMENTS
    ========================= */

    announcementsPageTitle: "Announcements",

    announcementsPageDescription:
      "Create and manage emergency advisories and barangay announcements.",

    newAnnouncement: "New Announcement",

    totalAnnouncements: "Total Announcements",

    allAnnouncementRecords: "All announcement records",

    published: "Published",

    visibleToResidents: "Visible to residents",

    drafts: "Drafts",

    pendingPublication: "Pending publication",

    criticalAlerts: "Critical Alerts",

    highPriorityCommunication: "High-priority communication",

    announcementList: "Announcement List",

    criticalAnnouncementsFirst: "Critical announcements appear first.",

    searchAnnouncements: "Search announcements...",

    all: "All",

    loadingAnnouncements: "Loading announcements...",

    retrievingAnnouncementRecords: "Retrieving announcement records.",

    failedToLoadAnnouncements: "Failed to load announcements",

    retry: "Retry",

    noAnnouncementsFound: "No announcements found",

    changeSearchOrFilter: "Try changing your search or filter.",

    announcementDetails: "Announcement Details",

    announcementMessage: "Announcement Message",

    expiration: "Expiration",

    noExpiration: "No expiration",

    lastUpdated: "Last updated",

    manage: "Manage",

    noAnnouncementSelected: "No announcement selected",

    selectAnnouncementFromList: "Select an announcement from the list.",

    announcementManagement: "Announcement Management",

    editAnnouncement: "Edit Announcement",

    message: "Message",

    enterAnnouncementTitle: "Enter announcement title",

    enterAnnouncementMessage: "Enter announcement message...",

    startDate: "Start Date",

    endDateExpiration: "End Date / Expiration",

    saveChanges: "Save Changes",

    createAnnouncement: "Create Announcement",

    manageAnnouncement: "Manage Announcement",

    changeAnnouncementStatus: "Change Announcement Status",

    selectAppropriateStatus:
      "Select the appropriate status for this announcement.",

    draftDescription: "Saved internally and not yet visible to residents.",

    publishedDescription: "Currently active and visible to residents.",

    archivedDescription: "Stored for record purposes and no longer active.",

    expiredDescription: "Automatically or manually marked as no longer valid.",

    announcementTitle: "Announcement Title",

    announcementMessageField: "Announcement Message",

    category: "Category",

    expirationField: "Expiration",

    /* =========================
       AUDIT LOGS
    ========================= */

    auditLogsPageTitle: "Audit Logs",

    auditLogsPageDescription:
      "Review system activities and track changes made by administrators and personnel.",

    allActions: "All Actions",

    allUsers: "All Users",

    filterByDate: "Filter by Date",

    endDate: "End Date",

    clearFilters: "Clear Filters",

    auditLog: "Audit Log",

    action: "Action",

    user: "User",

    timestamp: "Timestamp",

    details: "Details",

    noAuditLogsFound: "No audit logs found",

    noAuditLogsMatch: "No audit logs match the selected filters.",

    loadingAuditLogs: "Loading audit logs...",

    unableToLoadAuditLogs: "Unable to load audit logs",

    failedToLoadAuditLogs:
      "Failed to load audit logs. Please check the Laravel server.",

    viewAuditDetails: "View Audit Details",

    auditDetails: "Audit Details",

    performedBy: "Performed By",

    performedAt: "Performed At",

    affectedRecord: "Affected Record",

    recordType: "Record Type",

    recordId: "Record ID",

    fieldChanged: "Field Changed",

    oldValue: "Old Value",

    newValue: "New Value",

    remarks: "Remarks",

    systemActivity: "System Activity",

    showingAuditLogs: "Showing audit logs",

    /* =========================
       SETTINGS & ROLES
    ========================= */

    settingsRolesPageTitle: "Settings & Roles",

    settingsRolesPageDescription:
      "Manage system settings, user roles, and access permissions.",

    systemSettings: "System Settings",

    systemSettingsDescription:
      "Configure the basic settings used by the ResQNow administration system.",

    userRoles: "User Roles",

    userRolesDescription:
      "Manage user roles and their access to system features.",

    rolesPermissions: "Roles & Permissions",

    roleManagement: "Role Management",

    permissionManagement: "Permission Management",

    administratorRole: "Administrator",

    barangayPersonnelRole: "Barangay Personnel",

    residentRole: "Resident",

    roleName: "Role Name",

    roleDescription: "Role Description",

    permissions: "Permissions",

    accessLevel: "Access Level",

    fullAccess: "Full Access",

    limitedAccess: "Limited Access",

    readOnlyAccess: "Read-only Access",

    manageUsers: "Manage Users",

    manageReports: "Manage Reports",

    manageVerification: "Manage Verification",

    managePrioritization: "Manage Prioritization",

    manageIncidents: "Manage Incidents",

    manageAnnouncements: "Manage Announcements",

    viewAuditLogs: "View Audit Logs",

    manageSettings: "Manage Settings",

    accountSettings: "Account Settings",

    notificationSettings: "Notification Settings",

    languageSettings: "Language",

    selectLanguage: "Select Language",

    english: "English",

    filipino: "Filipino",

    systemInformation: "System Information",

    systemName: "System Name",

    barangay: "Barangay",

    city: "City",

    systemVersion: "System Version",

    saveSettings: "Save Settings",

    settingsSaved: "Settings saved successfully.",

    settingsSaveFailed: "Failed to save settings.",

    changesSaved: "Changes saved successfully.",

    noPermission: "You do not have permission to perform this action.",

    activeRole: "Active Role",

    assignedUsers: "Assigned Users",

    manageRole: "Manage Role",

    viewPermissions: "View Permissions",

    noRolesFound: "No roles found",

    noPermissionsFound: "No permissions found",
  },

  Filipino: {
    /* =========================
       NAVIGATION GROUPS
    ========================= */

    overview: "PANGKALAHATAN",
    operations: "OPERASYON",
    management: "PAMAMAHALA",
    system: "SISTEMA",

    /* =========================
       NAVIGATION
    ========================= */

    dashboard: "Dashboard",
    allReports: "Lahat ng Ulat",
    reports: "Mga Ulat",
    verification: "Beripikasyon",
    prioritization: "Pagbibigay ng Prayoridad",
    incidentMap: "Mapa ng mga Insidente",
    residents: "Mga Residente",
    personnel: "Mga Tauhan",
    announcements: "Mga Anunsyo",
    auditLogs: "Talaan ng Aktibidad",
    settingsRoles: "Mga Setting at Tungkulin",
    settings: "Mga Setting",

    /* =========================
       SIDEBAR
    ========================= */

    barangayWebAdmin: "Web Admin ng Barangay",

    addManualReport: "Magdagdag ng Manu-manong Ulat",

    signOut: "Mag-sign Out",

    allSystemsOperational: "Maayos ang lahat ng sistema",

    lastSync: "Huling pag-sync",

    currentAccess: "Kasalukuyang Access",

    /* =========================
       GENERAL ACTIONS
    ========================= */

    logout: "Mag-logout",
    save: "I-save",
    cancel: "Kanselahin",
    edit: "I-edit",
    delete: "Tanggalin",
    view: "Tingnan",
    search: "Maghanap",
    close: "Isara",
    confirm: "Kumpirmahin",
    back: "Bumalik",

    /* =========================
       TOPBAR SEARCH
    ========================= */

    searchReportsResidentsLocations:
      "Maghanap ng mga ulat, residente, o lokasyon...",

    clearSearch: "I-clear ang paghahanap",

    /* =========================
       NOTIFICATIONS
    ========================= */

    notifications: "Mga Abiso",

    latestSystemActivity: "Pinakabagong aktibidad ng sistema",

    new: "bago",

    viewAllNotifications: "Tingnan ang lahat ng abiso",

    administrator: "Administrador",

    barangayPersonnel: "Tauhan ng Barangay",

    evacuationAlertIssued: "Naglabas ng abiso para sa paglikas",

    evacuationAlertMessage:
      "Ang Building A at mga kalapit na lugar ay nangangailangan ng agarang pansin.",

    newReportPendingVerification:
      "May bagong ulat na naghihintay ng beripikasyon",

    hazardReportWaiting:
      "May hazard report na naghihintay para sa pagsusuri ng mga tauhan.",

    medicalSupportAssigned: "Naitalaga ang medical support",

    responsePersonnelAssigned:
      "Naitalaga na ang response personnel sa insidente.",

    justNow: "Ngayon lang",

    tenMinutesAgo: "10 minuto ang nakalipas",

    twentyFiveMinutesAgo: "25 minuto ang nakalipas",

    /* =========================
       AUDIT LOGS
    ========================= */

    activityHistory: "Kasaysayan ng Aktibidad",

    activityInformation: "Impormasyon ng Aktibidad",

    searchActivities: "Maghanap ng aktibidad...",

    allCategories: "Lahat ng Kategorya",

    /* =========================
       DASHBOARD
    ========================= */

    dashboardAdminLabel: "RESQNOW ADMIN DASHBOARD",

    dashboardSituation: "Narito ang kasalukuyang sitwasyon sa inyong barangay.",

    totalReports: "Kabuuang Ulat",
    emergencyReports: "Mga Ulat ng Emergency",
    nonEmergencyReports: "Mga Non-Emergency na Ulat",
    pendingVerification: "Naghihintay ng Beripikasyon",
    resolvedReports: "Mga Nalutas na Ulat",

    reportsRecorded: "Mga naitalang ulat",
    emergencyCases: "Mga emergency na kaso",
    nonEmergencyCases: "Mga non-emergency na kaso",
    awaitingReview: "Naghihintay ng pagsusuri",
    successfullyResolved: "Matagumpay na nalutas",
    urgentEmergencyReports: "Mga Apurahang Ulat ng Emergency",
    noUrgentEmergencyReports: "Walang mga apurahang ulat ng emergency sa ngayon.",

    activeIncident: "Aktibong Insidente",

    activeIncidentStatus: "Aktibong insidente",

    noActiveIncident: "Walang aktibong insidente",

    currentStatus: "Kasalukuyang Status",

    incidentId: "ID ng Insidente",

    location: "Lokasyon",

    status: "Status",

    priority: "Prayoridad",

    noActiveIncidents: "Walang aktibong insidente",

    allIncidentsResolved:
      "Lahat ng naitalang insidente ay kasalukuyang nalutas.",

    priorityOverview: "Pangkalahatang Prayoridad",

    prioritizedReportsLabel: "Mga Na-prayoridad na Ulat",

    totalReportsLabel: "Kabuuang mga ulat",

    liveUpdates: "Mga Live na Update",

    viewAllUpdates: "Tingnan ang lahat ng update",

    tryAgain: "Subukan muli",

    loadingIncident: "Ikinakarga ang insidente...",

    loadingUpdates: "Ikinakarga ang mga update...",

    noIncidentUpdates: "Walang available na update sa mga insidente.",

    alertsSent: "Mga Naipadalang Abiso",

    last24Hours: "Huling 24 oras",

    peopleAccounted: "Mga Taong Nabilang",

    ofTotal: "ng kabuuan",

    activeIncidents: "Mga Aktibong Insidente",

    acrossLocations: "Sa iba't ibang lokasyon",

    resourcesDeployed: "Mga Na-deploy na Resource",

    teamsAndEquipment: "Mga team at kagamitan",

    requiresMonitoring: "Nangangailangan ng pagmamanman",

    notSpecified: "Hindi tinukoy",

    notPrioritized: "Walang Prayoridad",

    emergencyIncident: "Emergency na Insidente",

    noIncidentDescription: "Walang ibinigay na paglalarawan ng insidente.",

    emergencyResponseMonitoring:
      "Ang emergency response ay nangangailangan ng pagmamanman.",
    goodMorningAdmin: "Magandang umaga, Admin!",
    goodAfternoonAdmin: "Magandang hapon, Admin!",
    goodEveningAdmin: "Magandang gabi, Admin!",

    /* =========================
       DASHBOARD PRIORITY
    ========================= */

    critical: "Kritikal",

    high: "Mataas",

    moderate: "Katamtaman",

    low: "Mababa",

    resolved: "Nalutas",

    /* =========================
       ALL REPORTS
    ========================= */

    operationsLabel: "Mga Operasyon",

    allReportsPageTitle: "Lahat ng Ulat",

    allReportsDescription:
      "Subaybayan at pamahalaan ang lahat ng isinumiteng ulat ng barangay.",

    refresh: "I-refresh",

    loadingReports: "Ikinakarga ang mga ulat...",

    unableToLoadReports: "Hindi maikarga ang mga ulat",

    unableToLoadReportsServer: "Hindi maikarga ang mga ulat mula sa server.",

    activeReports: "Mga Aktibong Ulat",

    criticalReports: "Mga Kritikal na Ulat",

    allSubmissions: "Lahat ng isinumite",

    needsAction: "Nangangailangan ng aksyon",

    needsReview: "Nangangailangan ng pagsusuri",

    resolvedCount: "nalutas",

    searchReportsLocationsReporters:
      "Maghanap ng mga ulat, lokasyon, o nag-ulat...",

    reportsCountOf: "mula sa",

    reportsCount: "mga ulat",

    allStatus: "Lahat ng Status",

    allPriority: "Lahat ng Prayoridad",

    report: "Ulat",

    submitted: "Isinumite",

    noReportsFound: "Walang nakitang ulat",

    changeSearchOrFilters:
      "Subukang baguhin ang iyong paghahanap o mga filter.",

    showing: "Ipinapakita ang",

    selectReportForDetails: "Pumili ng ulat upang makita ang mga detalye nito",

    /* =========================
       VERIFICATION
    ========================= */

    verificationCenter: "Sentro ng Beripikasyon",

    verificationCenterDescription:
      "Suriin ang mga emergency report at mga pagpaparehistro ng resident account.",

    reportVerification: "Beripikasyon ng Ulat",

    residentAccountVerification: "Beripikasyon ng Resident Account",

    pendingReports: "Mga Naghihintay na Ulat",

    verifiedToday: "Na-beripika Ngayon",

    returned: "Ibinalik",

    selectReportToReview: "Pumili ng ulat upang suriin.",

    searchReports: "Maghanap ng mga ulat...",

    noPendingReportsVerification:
      "Walang naghihintay na ulat para sa beripikasyon.",

    verificationServerError:
      "Hindi maikarga ang mga ulat para sa beripikasyon mula sa server.",

    returnForReviewBackendMessage:
      "Ang pagbabalik para sa pagsusuri ay ikokonekta sa backend sa susunod.",

    reportVerifiedForwarded:
      "Ang {id} ay na-beripika at ipinasa para sa pagbibigay ng prayoridad.",

    verificationFailed:
      "Hindi ma-beripika ang ulat. Pakisuri ang Laravel server.",

    reporter: "Nag-ulat",

    affectedPeople: "Mga Apektadong Tao",

    vulnerablePersons: "Mga Vulnerable na Tao",

    waterLevel: "Antas ng Tubig",

    roadPassability: "Kalagayan ng Daan",

    description: "Paglalarawan",

    noDescriptionProvided: "Walang ibinigay na paglalarawan.",

    returnForReview: "Ibalik para sa Pagsusuri",

    verifyReport: "I-beripika ang Ulat",

    selectPendingReport: "Pumili ng naghihintay na ulat upang suriin.",

    pendingResidentAccounts: "Mga Naghihintay na Resident Account",

    searchResidents: "Maghanap ng mga residente...",

    noPendingResidentAccounts: "Walang naghihintay na resident account.",

    email: "Email",

    mobile: "Mobile",

    address: "Address",

    purok: "Purok",

    registered: "Nakarehistro",

    verificationRemarks: "Mga Puna sa Beripikasyon",

    addRemarksIfNecessary: "Magdagdag ng puna kung kinakailangan...",

    rejectAccount: "Tanggihan ang Account",

    approveAccount: "Aprubahan ang Account",

    selectResidentAccount: "Pumili ng resident account upang suriin.",

    rejectionRemarksRequired:
      "Magbigay ng verification remarks bago tanggihan ang account na ito.",

    residentVerificationDefaultRemark:
      "Ang resident account ay na-beripika bilang residente ng Barangay Camunatan.",

    residentApproved: "Naaprubahan ang account ni {name}.",

    residentRejected: "Tinanggihan ang account ni {name}.",

    /* =========================
       PRIORITIZATION
    ========================= */

    prioritizationDescription:
      "Suriin ang mga triage indicator at tukuyin ang prayoridad ng pagtugon sa mga na-beripikang ulat.",

    prioritizationQueueActive: "Aktibo ang Queue ng Prayoridad",

    pendingReview: "Naghihintay ng Pagsusuri",

    reportsAwaitingPrioritization:
      "Mga ulat na naghihintay ng pagbibigay ng prayoridad",

    immediateAttention: "Agarang atensyon",

    priorityResponse: "Mataas na prayoridad ng pagtugon",

    routineResponse: "Karaniwang pagtugon",

    prioritizationQueue: "Queue ng Prayoridad",

    reportsReadyForPriorityReview:
      "Mga ulat na handa para sa pagsusuri ng prayoridad",

    allPriorities: "Lahat ng Prayoridad",

    noReportsAwaitingPrioritization:
      "Walang ulat na naghihintay ng pagbibigay ng prayoridad",

    verifiedReportsWillAppear: "Lalabas dito ang mga na-beripikang ulat.",

    current: "Kasalukuyan",

    evacuationNeed: "Pangangailangan sa Paglikas",

    threatToLife: "Banta sa Buhay",

    present: "Mayroon",

    reportDescription: "Paglalarawan ng Ulat",

    priorityDecision: "Desisyon sa Prayoridad",

    priorityDecisionDescription:
      "Kumpirmahin ang inirekomendang prayoridad o baguhin ito batay sa pagsusuri ng personnel.",

    selectedPriority: "Napiling Prayoridad",

    priorityWorkflowDescription:
      "Gagamitin ang desisyong ito sa response workflow.",

    notSelected: "Walang Napili",

    savingPriority: "Sine-save ang Prayoridad...",

    confirmPriority: "Kumpirmahin ang Prayoridad",

    noReportSelected: "Walang napiling ulat",

    selectReportFromQueue: "Pumili ng ulat mula sa queue ng prayoridad.",

    unableToLoadPrioritization:
      "Hindi maikarga ang mga ulat para sa pagbibigay ng prayoridad. Pakisuri ang API connection.",

    failedToAssignPriority: "Hindi maitalaga ang prayoridad ng ulat.",

    /* =========================
   INCIDENT MAP
========================= */

    incidentMapTitle: "Mapa ng mga Insidente",

    incidentMapDescription:
      "Subaybayan ang mga naiulat na insidente, mga lugar na may panganib, at mga aktibong lokasyon ng pagtugon.",

    liveIncidentMonitoring: "Live na Pagsubaybay sa mga Insidente",

    highPriority: "Mataas na Prayoridad",

    mediumPriority: "Katamtamang Prayoridad",

    routineMonitoring: "Karaniwang pagmamanman",

    barangayIncidentOverview: "Pangkalahatang Insidente sa Barangay",

    floodProneArea: "Lugar na madaling bahain",

    incidents: "Mga Insidente",

    selectIncidentToInspect: "Pumili ng insidente upang suriin",

    noIncidentsFound: "Walang nakitang insidente",

    noIncidentsMatchPriority:
      "Walang insidenteng tumutugma sa napiling prayoridad.",

    mapLegend: "Legend ng Mapa",

    mediumOther: "Katamtaman / Iba Pa",

    hazardZone: "Lugar na Mapanganib",

    selectedIncident: "Napiling Insidente",

    latitude: "Latitude",

    longitude: "Longitude",

    unableToLoadIncidents: "Hindi maikarga ang mga insidente",

    unableToLoadIncidentsServer:
      "Hindi maikarga ang mga insidente mula sa server.",

    /* =========================
   RESIDENTS
========================= */

    residentsPageTitle: "Mga Residente",

    residentsPageDescription:
      "Pamahalaan ang mga rehistradong residente at suriin ang impormasyon ng kanilang account.",

    residentRegistry: "Registry ng mga Residente",

    totalResidents: "Kabuuang Residente",

    registeredAccounts: "Mga rehistradong account",

    activeAccounts: "Mga Aktibong Account",

    currentlyActive: "Kasalukuyang aktibo",

    verifiedResidents: "Mga Na-beripikang Residente",

    activeResidentAccounts: "Mga aktibong resident account",

    reportsSubmitted: "Mga Isinumiteng Ulat",

    fromRegisteredResidents: "Mula sa mga rehistradong residente",

    active: "Aktibo",

    inactive: "Hindi Aktibo",

    loadingResidents: "Ikinakarga ang mga residente...",

    unableToLoadResidents: "Hindi maikarga ang mga residente",

    failedToLoadResidents: "Hindi maikarga ang mga residente.",

    tryAgainResidents: "Subukan Muli",

    resident: "Residente",

    contact: "Contact",

    role: "Tungkulin",

    noResidentsFound: "Walang nakitang residente",

    adjustSearchOrStatus:
      "Subukang baguhin ang iyong paghahanap o status filter.",

    selectResidentToViewDetails:
      "Pumili ng residente upang makita ang mga detalye",

    contactInformation: "Impormasyon sa Pakikipag-ugnayan",

    emailAddress: "Email Address",

    mobileNumber: "Mobile Number",

    accountInformation: "Impormasyon ng Account",

    accountRole: "Tungkulin ng Account",

    reportActivity: "Aktibidad ng mga Ulat",

    submittedReports: "mga isinumiteng ulat",

    reportsAssociatedWithAccount:
      "Mga ulat na nauugnay sa resident account na ito.",

    viewResidentReports: "Tingnan ang mga Ulat ng Residente",

    noResidentSelected: "Walang napiling residente",

    selectResidentFromRegistry: "Pumili ng residente mula sa registry.",

    personnelPageTitle: "Mga Personnel",
    personnelPageDescription:
      "Pamahalaan ang mga barangay response personnel, team, at kasalukuyang assignment.",
    personnelRegistry: "Registry ng mga Personnel",
    totalPersonnel: "Kabuuang Personnel",
    registeredPersonnel: "Mga rehistradong personnel",
    activePersonnel: "Mga Aktibong Personnel",

    available: "Available",
    readyForAssignment: "Handa para sa assignment",
    assigned: "Naka-assign",
    handlingActiveReports: "Humahawak ng mga aktibong ulat",
    unableToLoadPersonnel:
      "Hindi maikarga ang personnel data. Pakisuri ang Laravel server.",
    loadingPersonnel: "Ikinakarga ang mga personnel...",

    team: "Team",
    availability: "Availability",

    assignment: "Assignment",
    searchPersonnel: "Maghanap ng personnel...",

    noPersonnelFound: "Walang nakitang personnel",

    of: "mula sa",
    selectPersonnelToViewDetails:
      "Pumili ng personnel upang makita ang mga detalye",
    personnelInformation: "Impormasyon ng Personnel",
    responseTeam: "Response Team",

    currentAssignment: "Kasalukuyang Assignment",
    activeReport: "Aktibong Ulat",
    currentLocation: "Kasalukuyang lokasyon",
    noActiveAssignment: "Walang aktibong assignment",
    personnelAvailableForDeployment:
      "Ang personnel na ito ay kasalukuyang available para sa deployment.",

    joined: "Sumali",
    viewAssignment: "Tingnan ang Assignment",
    noActiveAssignmentButton: "Walang Aktibong Assignment",
    noPersonnelSelected: "Walang napiling personnel",
    selectPersonnelFromRegistry: "Pumili ng personnel mula sa registry",
    unknownPersonnel: "Hindi Kilalang Personnel",

    notAssigned: "Walang assignment",
    notProvided: "Hindi ibinigay",
    unavailable: "Hindi Available",

    /* =========================
       ANNOUNCEMENTS
    ========================= */

    announcementsPageTitle: "Mga Anunsyo",

    announcementsPageDescription:
      "Gumawa at mamahala ng mga emergency advisory at barangay announcement.",

    newAnnouncement: "Bagong Anunsyo",

    totalAnnouncements: "Kabuuang mga Anunsyo",

    allAnnouncementRecords: "Lahat ng announcement records",

    published: "Nailathala",

    visibleToResidents: "Makikita ng mga residente",

    drafts: "Mga Draft",

    pendingPublication: "Naghihintay na mailathala",

    criticalAlerts: "Mga Kritikal na Alert",

    highPriorityCommunication: "Mataas na prayoridad na komunikasyon",

    announcementList: "Listahan ng mga Anunsyo",

    criticalAnnouncementsFirst:
      "Ang mga kritikal na anunsyo ay unang ipinapakita.",

    searchAnnouncements: "Maghanap ng mga anunsyo...",

    all: "Lahat",

    loadingAnnouncements: "Ikinakarga ang mga anunsyo...",

    retrievingAnnouncementRecords: "Kinukuha ang mga announcement record.",

    failedToLoadAnnouncements: "Hindi maikarga ang mga anunsyo",

    retry: "Subukan Muli",

    noAnnouncementsFound: "Walang nakitang anunsyo",

    changeSearchOrFilter: "Subukang baguhin ang paghahanap o filter.",

    announcementDetails: "Mga Detalye ng Anunsyo",

    announcementMessage: "Mensahe ng Anunsyo",

    expiration: "Pag-expire",

    noExpiration: "Walang expiration",

    lastUpdated: "Huling na-update",

    manage: "Pamahalaan",

    noAnnouncementSelected: "Walang napiling anunsyo",

    selectAnnouncementFromList: "Pumili ng anunsyo mula sa listahan.",

    announcementManagement: "Pamamahala ng Anunsyo",

    editAnnouncement: "I-edit ang Anunsyo",

    message: "Mensahe",

    enterAnnouncementTitle: "Ilagay ang pamagat ng anunsyo",

    enterAnnouncementMessage: "Ilagay ang mensahe ng anunsyo...",

    startDate: "Petsa ng Simula",

    endDateExpiration: "Petsa ng Pagtatapos / Pag-expire",

    saveChanges: "I-save ang mga Pagbabago",

    createAnnouncement: "Gumawa ng Anunsyo",

    manageAnnouncement: "Pamahalaan ang Anunsyo",

    changeAnnouncementStatus: "Baguhin ang Status ng Anunsyo",

    selectAppropriateStatus:
      "Piliin ang naaangkop na status para sa anunsyong ito.",

    draftDescription:
      "Naka-save lamang sa system at hindi pa nakikita ng mga residente.",

    publishedDescription: "Kasalukuyang aktibo at nakikita ng mga residente.",

    archivedDescription: "Naka-save para sa record at hindi na aktibo.",

    expiredDescription:
      "Awtomatikong o manu-manong minarkahan bilang hindi na valid.",

    announcementTitle: "Pamagat ng Anunsyo",

    announcementMessageField: "Mensahe ng Anunsyo",

    category: "Kategorya",

    expirationField: "Pag-expire",

    /* =========================
       AUDIT LOGS
    ========================= */

    auditLogsPageTitle: "Talaan ng Aktibidad",

    auditLogsPageDescription:
      "Suriin ang mga aktibidad ng sistema at subaybayan ang mga pagbabagong ginawa ng mga administrator at personnel.",

    allActions: "Lahat ng Aksyon",

    allUsers: "Lahat ng User",

    filterByDate: "I-filter ayon sa Petsa",

    endDate: "Petsa ng Pagtatapos",

    clearFilters: "I-clear ang mga Filter",

    auditLog: "Talaan ng Aktibidad",

    action: "Aksyon",

    user: "User",

    timestamp: "Petsa at Oras",

    details: "Mga Detalye",

    noAuditLogsFound: "Walang nakitang tala ng aktibidad",

    noAuditLogsMatch:
      "Walang tala ng aktibidad na tumutugma sa napiling mga filter.",

    loadingAuditLogs: "Ikinakarga ang mga tala ng aktibidad...",

    unableToLoadAuditLogs: "Hindi maikarga ang mga tala ng aktibidad",

    failedToLoadAuditLogs:
      "Hindi maikarga ang mga tala ng aktibidad. Pakisuri ang Laravel server.",

    viewAuditDetails: "Tingnan ang Detalye ng Aktibidad",

    auditDetails: "Mga Detalye ng Aktibidad",

    performedBy: "Isinagawa Ni",

    performedAt: "Isinagawa Noong",

    affectedRecord: "Naapektuhang Record",

    recordType: "Uri ng Record",

    recordId: "Record ID",

    fieldChanged: "Binagong Field",

    oldValue: "Dating Halaga",

    newValue: "Bagong Halaga",

    remarks: "Mga Puna",

    systemActivity: "Aktibidad ng Sistema",

    showingAuditLogs: "Ipinapakitang mga tala ng aktibidad",

    /* =========================
       SETTINGS & ROLES
    ========================= */

    settingsRolesPageTitle: "Mga Setting at Tungkulin",

    settingsRolesPageDescription:
      "Pamahalaan ang mga setting ng sistema, user role, at mga pahintulot sa access.",

    systemSettings: "Mga Setting ng Sistema",

    systemSettingsDescription:
      "I-configure ang mga pangunahing setting na ginagamit ng ResQNow administration system.",

    userRoles: "Mga Tungkulin ng User",

    userRolesDescription:
      "Pamahalaan ang mga user role at ang kanilang access sa mga feature ng sistema.",

    rolesPermissions: "Mga Tungkulin at Pahintulot",

    roleManagement: "Pamamahala ng Tungkulin",

    permissionManagement: "Pamamahala ng mga Pahintulot",

    administratorRole: "Administrador",

    barangayPersonnelRole: "Tauhan ng Barangay",

    residentRole: "Residente",

    roleName: "Pangalan ng Tungkulin",

    roleDescription: "Paglalarawan ng Tungkulin",

    permissions: "Mga Pahintulot",

    accessLevel: "Antas ng Access",

    fullAccess: "Buong Access",

    limitedAccess: "Limitadong Access",

    readOnlyAccess: "Read-only na Access",

    manageUsers: "Pamahalaan ang mga User",

    manageReports: "Pamahalaan ang mga Ulat",

    manageVerification: "Pamahalaan ang Beripikasyon",

    managePrioritization: "Pamahalaan ang Pagbibigay ng Prayoridad",

    manageIncidents: "Pamahalaan ang mga Insidente",

    manageAnnouncements: "Pamahalaan ang mga Anunsyo",

    viewAuditLogs: "Tingnan ang Talaan ng Aktibidad",

    manageSettings: "Pamahalaan ang mga Setting",

    accountSettings: "Mga Setting ng Account",

    notificationSettings: "Mga Setting ng Abiso",

    languageSettings: "Wika",

    selectLanguage: "Pumili ng Wika",

    english: "English",

    filipino: "Filipino",

    systemInformation: "Impormasyon ng Sistema",

    systemName: "Pangalan ng Sistema",

    barangay: "Barangay",

    city: "Lungsod",

    systemVersion: "Bersyon ng Sistema",

    saveSettings: "I-save ang mga Setting",

    settingsSaved: "Matagumpay na na-save ang mga setting.",

    settingsSaveFailed: "Hindi ma-save ang mga setting.",

    changesSaved: "Matagumpay na na-save ang mga pagbabago.",

    noPermission: "Wala kang pahintulot na gawin ang aksyong ito.",

    activeRole: "Kasalukuyang Tungkulin",

    assignedUsers: "Mga Nakatalagang User",

    manageRole: "Pamahalaan ang Tungkulin",

    viewPermissions: "Tingnan ang mga Pahintulot",

    noRolesFound: "Walang nakitang tungkulin",

    noPermissionsFound: "Walang nakitang pahintulot",
  },
};

export default function LanguageProvider({ language = "English", children }) {
  const value = useMemo(() => {
    const currentLanguage = translations[language] ? language : "English";

    return {
      language: currentLanguage,

      t: (key) => translations[currentLanguage][key] || key,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
