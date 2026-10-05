import { useEffect, useState } from "react";
import {
  getAllPersonnel,
  getSystemSettings,
  updateSystemSettings,
} from "../../services/reportsService";

const initialSettings = {
  systemName: "ResQNow",
  barangayName: "Barangay Camunatan",
  cityName: "City of Ilagan",
  language: "English",
  notifications: true,
  criticalAlerts: true,
  assignmentAlerts: true,
  announcementAlerts: true,
  autoRefresh: true,
};

const settingLabels = {
  systemName: "System Name",
  barangayName: "Barangay Name",
  cityName: "City / Municipality",
  language: "System Language",
  notifications: "Notifications",
  criticalAlerts: "Critical Incident Alerts",
  assignmentAlerts: "Personnel Assignment Alerts",
  announcementAlerts: "Announcement Alerts",
  autoRefresh: "Automatic Data Refresh",
};

const tabs = [
  {
    id: "general",
    label: "General Settings",
    description: "System information and preferences",
    icon: <SettingsIcon />,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alert and notification preferences",
    icon: <BellIcon />,
  },
  {
    id: "roles",
    label: "Roles & Access",
    description: "Personnel accounts and permissions",
    icon: <UsersIcon />,
  },
];

function SettingsRoles({ systemSettings, onSettingsUpdate, onAddAuditLog }) {
  const [activeTab, setActiveTab] = useState("general");

  const [personnel, setPersonnel] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [personnelLoading, setPersonnelLoading] = useState(true);
const [personnelError, setPersonnelError] = useState("");

const [savedSettings, setSavedSettings] = useState(
  systemSettings || initialSettings,
);

const [settings, setSettings] = useState(
  systemSettings || initialSettings,
);

const [settingsLoading, setSettingsLoading] = useState(true);
const [settingsError, setSettingsError] = useState("");
const [settingsSaving, setSettingsSaving] = useState(false);

useEffect(() => {
  let isMounted = true;

  async function loadSystemSettings() {
    try {
      setSettingsLoading(true);
      setSettingsError("");

      const data = await getSystemSettings();

      if (!isMounted) return;

      const loadedSettings = {
        systemName: data.system_name,
        barangayName: data.barangay_name,
        cityName: data.city_name,
        language: data.language,
        notifications: data.notifications,
        criticalAlerts: data.critical_alerts,
        assignmentAlerts: data.assignment_alerts,
        announcementAlerts: data.announcement_alerts,
        autoRefresh: data.auto_refresh,
      };

      setSavedSettings(loadedSettings);
      setSettings(loadedSettings);
    } catch (error) {
      console.error("Failed to load system settings:", error);

      if (isMounted) {
        setSettingsError(
          "Unable to load system settings from the server.",
        );
      }
    } finally {
      if (isMounted) {
        setSettingsLoading(false);
      }
    }
  }

  loadSystemSettings();

  return () => {
    isMounted = false;
  };
}, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPersonnel() {
      try {
        setPersonnelLoading(true);
        setPersonnelError("");

        const personnelData = await getAllPersonnel();

        if (!isMounted) return;

        setPersonnel(personnelData);

        if (personnelData.length > 0) {
          setSelectedPersonnel(personnelData[0]);
        }
      } catch (error) {
        console.error("Failed to load personnel:", error);

        if (isMounted) {
          setPersonnelError(
            "Unable to load personnel accounts from the server.",
          );
        }
      } finally {
        if (isMounted) {
          setPersonnelLoading(false);
        }
      }
    }

    loadPersonnel();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSetting = (key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleSaveChanges = async () => {
    const changedSettings = Object.keys(settings).filter(
      (key) => settings[key] !== savedSettings[key],
    );

    if (changedSettings.length === 0 || settingsSaving) return;

    try {
      setSettingsSaving(true);
      setSettingsError("");

      const updatedData = await updateSystemSettings({
        system_name: settings.systemName,
        barangay_name: settings.barangayName,
        city_name: settings.cityName,
        language: settings.language,
        notifications: settings.notifications,
        critical_alerts: settings.criticalAlerts,
        assignment_alerts: settings.assignmentAlerts,
        announcement_alerts: settings.announcementAlerts,
        auto_refresh: settings.autoRefresh,
      });

      const updatedSettings = {
        systemName: updatedData.system_name,
        barangayName: updatedData.barangay_name,
        cityName: updatedData.city_name,
        language: updatedData.language,
        notifications: updatedData.notifications,
        criticalAlerts: updatedData.critical_alerts,
        assignmentAlerts: updatedData.assignment_alerts,
        announcementAlerts: updatedData.announcement_alerts,
        autoRefresh: updatedData.auto_refresh,
      };

      setSavedSettings(updatedSettings);
      setSettings(updatedSettings);

      onSettingsUpdate?.(updatedSettings);

      changedSettings.forEach((key) => {
        const oldValue = savedSettings[key];
        const newValue = updatedSettings[key];

        onAddAuditLog?.({
          action: "System Setting Updated",
          category: "System Action",
          target: "SYS-SETTINGS",
          field: settingLabels[key] || key,
          oldValue: String(oldValue),
          newValue: String(newValue),
          remarks: `${settingLabels[key] || key} was changed from "${oldValue}" to "${newValue}".`,
          status: "Success",
        });
      });
    } catch (error) {
      console.error("Failed to save system settings:", error);

      setSettingsError(
        error.message || "Unable to save system settings.",
      );
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleCancelChanges = () => {
    setSettings(savedSettings);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      {/* PAGE HEADER */}
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#101C2E]">
            Settings & Roles
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            Manage system preferences, notifications, and personnel access.
          </p>
        </div>

        <div className="hidden items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white px-3 py-2 shadow-sm sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#2ED47A]" />

          <span className="text-xs font-semibold text-[#475467]">
            System configuration
          </span>
        </div>
      </div>

      {/* SETTINGS WORKSPACE */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[240px_minmax(0,1fr)]">
        {/* LEFT NAVIGATION */}
        <aside className="min-h-0 overflow-auto rounded-xl border border-[#E4E7EC] bg-white p-2 shadow-sm">
          <div className="px-3 pb-2 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
              Configuration
            </p>
          </div>

          <div className="space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                    isActive
                      ? "bg-[#EAF1FA] text-[#1F5FA6]"
                      : "text-[#475467] hover:bg-[#F9FAFB]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-[#1F5FA6] text-white"
                        : "bg-[#F2F4F7] text-[#667085]"
                    }`}
                  >
                    {tab.icon}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold">
                      {tab.label}
                    </span>

                    <span
                      className={`mt-0.5 block text-[11px] leading-4 ${
                        isActive ? "text-[#1F5FA6]" : "text-[#98A2B3]"
                      }`}
                    >
                      {tab.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* SECURITY STATUS */}
          <div className="mt-4 rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F8F4] text-[#008F78]">
                <ShieldIcon />
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#344054]">
                  Access Protected
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-[#98A2B3]">
                  Only authorized barangay personnel can manage these settings.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
          {activeTab === "general" && (
            <GeneralSettings
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationSettings
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {activeTab === "roles" && (
            <RolesSettings
              personnel={personnel}
              selectedPersonnel={selectedPersonnel}
              setSelectedPersonnel={setSelectedPersonnel}
              personnelLoading={personnelLoading}
              personnelError={personnelError}
            />
          )}

          {/* SAVE AREA - NOT NEEDED FOR ROLES YET */}
          {activeTab !== "roles" && (
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#E4E7EC] bg-white px-5 py-4">
              <div>
                {settingsLoading && (
                  <p className="text-xs font-medium text-[#667085]">
                    Loading system settings...
                  </p>
                )}

                {!settingsLoading && settingsError && (
                  <p className="text-xs font-medium text-[#D92D20]">
                    {settingsError}
                  </p>
                )}

                {!settingsLoading && !settingsError && hasUnsavedChanges && (
                  <p className="text-xs font-medium text-[#D97706]">
                    You have unsaved changes.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancelChanges}
                  disabled={!hasUnsavedChanges}
                  className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${
                    hasUnsavedChanges
                      ? "border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB]"
                      : "cursor-not-allowed border-[#EAECF0] bg-[#F9FAFB] text-[#98A2B3]"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={
                    !hasUnsavedChanges || settingsSaving || settingsLoading
                  }
                  className={`rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-md transition ${
                    hasUnsavedChanges && !settingsSaving && !settingsLoading
                      ? "bg-[#1F5FA6] hover:bg-[#174A86]"
                      : "cursor-not-allowed bg-[#A9C5E6] shadow-none"
                  }`}
                >
                  {settingsSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function GeneralSettings({ settings, updateSetting }) {
  return (
    <>
      <SectionHeader
        eyebrow="System Configuration"
        title="General Settings"
        description="Basic information and default preferences for the ResQNow system."
      />

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <SettingsSection
          title="System Information"
          description="Identify the emergency management system and its operating barangay."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="System Name"
              value={settings.systemName}
              onChange={(value) => updateSetting("systemName", value)}
            />

            <Field
              label="Barangay"
              value={settings.barangayName}
              onChange={(value) => updateSetting("barangayName", value)}
            />

            <Field
              label="City / Municipality"
              value={settings.cityName}
              onChange={(value) => updateSetting("cityName", value)}
            />

            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-[#475467]">
                Default Language
              </label>

              <select
                value={settings.language}
                onChange={(event) =>
                  updateSetting("language", event.target.value)
                }
                className="h-10 w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-xs font-medium text-[#344054] outline-none transition focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/10"
              >
                <option>English</option>
                <option>Filipino</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <div className="mt-4">
          <SettingsSection
            title="System Behavior"
            description="Control default behavior of the administrative dashboard."
          >
            <div className="space-y-3">
              <ToggleRow
                label="Automatic Data Refresh"
                description="Keep dashboard information refreshed while personnel are monitoring operations."
                enabled={settings.autoRefresh}
                onChange={(value) => updateSetting("autoRefresh", value)}
              />
            </div>
          </SettingsSection>
        </div>

        <div className="mt-4 rounded-lg border border-[#E4E7EC] bg-[#F9F7FF] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D6E4F5] text-[#1F5FA6]">
              <InfoIcon />
            </div>

            <div>
              <p className="text-xs font-bold text-[#101C2E]">
                Configuration Preview
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#667085]">
                Changes are saved to the system database when you click Save
                Changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NotificationSettings({ settings, updateSetting }) {
  return (
    <>
      <SectionHeader
        eyebrow="Alert Management"
        title="Notification Settings"
        description="Configure which operational events should generate administrative alerts."
      />

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <SettingsSection
          title="Operational Alerts"
          description="Choose the events that require attention from barangay personnel."
        >
          <div className="space-y-3">
            <ToggleRow
              label="Critical Incident Alerts"
              description="Receive alerts when a report is classified as Critical priority."
              enabled={settings.criticalAlerts}
              onChange={(value) => updateSetting("criticalAlerts", value)}
              accent="critical"
            />

            <ToggleRow
              label="Personnel Assignment Alerts"
              description="Receive notifications when personnel or response teams are assigned to a report."
              enabled={settings.assignmentAlerts}
              onChange={(value) => updateSetting("assignmentAlerts", value)}
            />

            <ToggleRow
              label="Announcement Alerts"
              description="Receive notifications when an announcement is published or scheduled."
              enabled={settings.announcementAlerts}
              onChange={(value) => updateSetting("announcementAlerts", value)}
            />
          </div>
        </SettingsSection>

        <div className="mt-4 rounded-lg border border-[#FDE2E2] bg-[#FFF8F8] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FEECEC] text-[#EF4444]">
              <AlertIcon />
            </div>

            <div>
              <p className="text-xs font-bold text-[#7F1D1D]">
                Emergency Alert Notice
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#667085]">
                Critical incident notifications are intended for operational
                awareness and should not replace established barangay emergency
                communication procedures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function RolesSettings({
  personnel,
  selectedPersonnel,
  setSelectedPersonnel,
  personnelLoading,
  personnelError,
}) {
  return (
    <>
      <SectionHeader
        eyebrow="Access Control"
        title="Roles & Access"
        description="Review personnel accounts and their current administrative access."
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.7fr)]">
        <div className="min-h-0 overflow-auto border-b border-[#E4E7EC] xl:border-b-0 xl:border-r">
          <div className="sticky top-0 z-10 border-b border-[#E4E7EC] bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#344054]">
                  Personnel Accounts
                </p>

                <p className="mt-0.5 text-[11px] text-[#98A2B3]">
                  {personnel.length} authorized personnel
                </p>
              </div>

              <span className="rounded-full bg-[#E8F8F4] px-2.5 py-1 text-[11px] font-bold text-[#008F78]">
                Access Controlled
              </span>
            </div>
          </div>

          <div className="p-3">
            <div className="space-y-2">
              {personnelLoading ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  Loading personnel...
                </div>
              ) : personnelError ? (
                <div className="py-8 text-center text-sm text-red-500">
                  {personnelError}
                </div>
              ) : personnel.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No personnel accounts found.
                </div>
              ) : (
                personnel.map((person) => {
                  const isSelected = selectedPersonnel?.id === person.id;

                  return (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => setSelectedPersonnel(person)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                        isSelected
                          ? "border-[#C7D9EF] bg-[#EAF1FA]"
                          : "border-[#E4E7EC] bg-white hover:bg-[#FCFCFD]"
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D6E4F5] text-[11px] font-bold text-[#1F5FA6]">
                        {getInitials(person.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[#344054]">
                          {person.name}
                        </p>

                        <p className="truncate text-[11px] text-[#98A2B3]">
                          {person.role}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[#E8F8F4] px-2 py-1 text-[11px] font-bold text-[#008F78]">
                        {person.status}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="min-h-0 overflow-auto p-4">
          {selectedPersonnel && (
            <>
              <div className="rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F5FA6] text-sm font-bold text-white">
                    {getInitials(selectedPersonnel.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#101C2E]">
                      {selectedPersonnel.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#667085]">
                      {selectedPersonnel.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <DetailRow label="Role" value={selectedPersonnel.role} />

                <DetailRow
                  label="Response Team"
                  value={selectedPersonnel.team}
                />

                <DetailRow
                  label="Account Status"
                  value={selectedPersonnel.status}
                />

                <DetailRow
                  label="Access Level"
                  value={selectedPersonnel.access}
                />
              </div>

              <div className="mt-4 rounded-lg border border-[#E4E7EC] bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#98A2B3]">
                  Current Permissions
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <PermissionBadge label="View Reports" />
                  <PermissionBadge label="Verify Reports" />
                  <PermissionBadge label="Prioritize Reports" />
                  <PermissionBadge label="Assign Personnel" />
                  <PermissionBadge label="Update Status" />
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[#E4E7EC] bg-[#F9F7FF] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D6E4F5] text-[#1F5FA6]">
                    <ShieldIcon />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#101C2E]">
                      Role-Based Access
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#667085]">
                      Access permissions are currently displayed as a
                      configuration preview. Actual authorization will be
                      enforced by the backend authentication and role system.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="shrink-0 border-b border-[#E4E7EC] px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#1F5FA6]">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-lg font-bold text-[#101C2E]">{title}</h2>

      <p className="mt-1 text-xs text-[#667085]">{description}</p>
    </div>
  );
}

function SettingsSection({ title, description, children }) {
  return (
    <div className="rounded-lg border border-[#E4E7EC] bg-white p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#344054]">{title}</h3>

        <p className="mt-0.5 text-[11px] text-[#98A2B3]">{description}</p>
      </div>

      {children}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold text-[#475467]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-xs font-medium text-[#344054] outline-none transition focus:border-[#1F5FA6] focus:ring-2 focus:ring-[#1F5FA6]/10"
      />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onChange,
  accent = "default",
}) {
  const activeColor = accent === "critical" ? "bg-[#EF4444]" : "bg-[#1F5FA6]";

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] p-3.5">
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#344054]">{label}</p>

        <p className="mt-0.5 max-w-2xl text-[11px] leading-4 text-[#98A2B3]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? activeColor : "bg-[#D0D5DD]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#F0F1F3] py-2.5 last:border-b-0">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-[#98A2B3]">
        {label}
      </span>

      <span className="text-right text-xs font-semibold text-[#344054]">
        {value}
      </span>
    </div>
  );
}

function PermissionBadge({ label }) {
  return (
    <span className="rounded-full bg-[#EAF1FA] px-2.5 py-1 text-[11px] font-semibold text-[#1F5FA6]">
      {label}
    </span>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SettingsIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5.5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3 5 6v5c0 4.5 2.9 8.4 7 10 4.1-1.6 7-5.5 7-10V6z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.5" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3 2.8 19h18.4z" />
      <path d="M12 9v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export default SettingsRoles;
