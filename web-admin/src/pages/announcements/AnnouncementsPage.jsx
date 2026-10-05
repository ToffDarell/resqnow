import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  updateAnnouncementStatus,
  deleteAnnouncement,
} from "../../services/reportsService";

import { useLanguage } from "../../hooks/useLanguage";

const categories = [
  "Weather Advisory",
  "Emergency Alert",
  "Evacuation Notice",
  "Community Announcement",
  "Health Advisory",
  "Public Safety Advisory",
];

const priorities = ["Critical", "High", "Moderate", "Low"];

const statuses = ["Draft", "Published", "Archived", "Expired"];

const emptyForm = {
  title: "",
  message: "",
  category: "Community Announcement",
  priority: "Moderate",
  startDate: "",
  endDate: "",
  status: "Draft",
};

const statusStyles = {
  Published: "bg-[#ECFDF3] text-[#027A48]",
  Draft: "bg-[#F2F4F7] text-[#667085]",
  Archived: "bg-[#FFF4E5] text-[#B54708]",
  Expired: "bg-[#FEF3F2] text-[#D92D20]",
};

const priorityStyles = {
  Critical: "bg-[#FEF3F2] text-[#D92D20] border-[#FECDCA]",
  High: "bg-[#FFF4E5] text-[#B54708] border-[#FEDF89]",
  Moderate: "bg-[#FFFAEB] text-[#A15C00] border-[#FDE68A]",
  Low: "bg-[#F2F4F7] text-[#667085] border-[#E4E7EC]",
};

function AnnouncementsPage({ onAddAuditLog }) {
  const { t } = useLanguage();

  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const displayStatus = (status) => {
    const statusMap = {
      Published: t("published"),
      Draft: t("drafts"),
      Archived: "Archived",
      Expired: "Expired",
    };

    return statusMap[status] || status;
  };

  const displayPriority = (priority) => {
    const priorityMap = {
      Critical: t("criticalAlerts"),
      High: "High",
      Moderate: "Moderate",
      Low: "Low",
    };

    return priorityMap[priority] || priority;
  };

  /* =========================
     FORMAT ANNOUNCEMENT
  ========================= */

  const formatAnnouncement = (announcement) => {
    const formatDateForInput = (dateValue) => {
      if (!dateValue) return "";

      return new Date(dateValue).toISOString().split("T")[0];
    };

    const formatDisplayDate = (dateValue) => {
      if (!dateValue) return "—";

      return new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateValue));
    };

    return {
      id: announcement.id,
      databaseId: announcement.id,

      title: announcement.title || "",
      message: announcement.content || "",

      category: announcement.category || "Community Announcement",

      priority: announcement.priority || "Moderate",

      startDate: formatDateForInput(announcement.published_at),

      endDate: formatDateForInput(announcement.expires_at),

      status: announcement.status || "Draft",

      createdAt: formatDisplayDate(announcement.created_at),

      updatedAt: formatDisplayDate(
        announcement.updated_at || announcement.created_at,
      ),
    };
  };

  /* =========================
     LOAD ANNOUNCEMENTS
  ========================= */

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getAllAnnouncements();

      const formattedAnnouncements = data.map(formatAnnouncement);

      setAnnouncements(formattedAnnouncements);

      setSelectedAnnouncementId((currentId) => {
        const stillExists = formattedAnnouncements.some(
          (announcement) => announcement.id === currentId,
        );

        if (stillExists) {
          return currentId;
        }

        return formattedAnnouncements.length > 0
          ? formattedAnnouncements[0].id
          : null;
      });
    } catch (err) {
      console.error("Failed to load announcements:", err);

      setError(err.message || t("failedToLoadAnnouncements"));
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     LOAD ON PAGE OPEN
  ========================= */

  useEffect(() => {
    const load = async () => {
      await loadAnnouncements();
    };

    load();
  }, []);
  /* =========================
     EFFECTIVE STATUS
  ========================= */

  const getEffectiveStatus = (announcement) => {
    if (announcement.status === "Published" && announcement.endDate) {
      const today = new Date().toISOString().split("T")[0];

      if (announcement.endDate < today) {
        return "Expired";
      }
    }

    return announcement.status;
  };

  /* =========================
     SORT ANNOUNCEMENTS
  ========================= */

  const sortedAnnouncements = useMemo(() => {
    const priorityOrder = {
      Critical: 1,
      High: 2,
      Moderate: 3,
      Low: 4,
    };

    const statusOrder = {
      Published: 1,
      Draft: 2,
      Expired: 3,
      Archived: 4,
    };

    return [...announcements]
      .map((announcement) => ({
        ...announcement,
        effectiveStatus: getEffectiveStatus(announcement),
      }))
      .sort((a, b) => {
        const statusDifference =
          (statusOrder[a.effectiveStatus] || 99) -
          (statusOrder[b.effectiveStatus] || 99);

        if (statusDifference !== 0) {
          return statusDifference;
        }

        const priorityDifference =
          (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return 0;
      });
  }, [announcements]);

  /* =========================
     FILTER ANNOUNCEMENTS
  ========================= */

  const filteredAnnouncements = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return sortedAnnouncements.filter((announcement) => {
      const matchesSearch =
        search === "" ||
        announcement.title.toLowerCase().includes(search) ||
        announcement.category.toLowerCase().includes(search) ||
        announcement.message.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || announcement.effectiveStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sortedAnnouncements, searchTerm, statusFilter]);

  /* =========================
     SELECTED ANNOUNCEMENT
  ========================= */

  const selectedAnnouncement =
    sortedAnnouncements.find(
      (announcement) => announcement.id === selectedAnnouncementId,
    ) || null;

  /* =========================
     COUNTS
  ========================= */

  const publishedCount = announcements.filter(
    (announcement) => getEffectiveStatus(announcement) === "Published",
  ).length;

  const draftCount = announcements.filter(
    (announcement) => announcement.status === "Draft",
  ).length;

  const criticalCount = announcements.filter(
    (announcement) => announcement.priority === "Critical",
  ).length;

  /* =========================
     NEW ANNOUNCEMENT
  ========================= */

  const handleNewAnnouncement = () => {
    setEditingAnnouncement(null);

    setFormData({
      ...emptyForm,
      startDate: new Date().toISOString().split("T")[0],
    });

    setIsFormOpen(true);
  };

  /* =========================
     EDIT ANNOUNCEMENT
  ========================= */

  const handleEditAnnouncement = () => {
    if (!selectedAnnouncement) return;

    setEditingAnnouncement(selectedAnnouncement);

    setFormData({
      title: selectedAnnouncement.title,
      message: selectedAnnouncement.message,
      category: selectedAnnouncement.category,
      priority: selectedAnnouncement.priority,
      startDate: selectedAnnouncement.startDate,
      endDate: selectedAnnouncement.endDate || "",
      status: selectedAnnouncement.status,
    });

    setIsFormOpen(true);
  };

  /* =========================
     FORM CHANGE
  ========================= */

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =========================
     SAVE ANNOUNCEMENT
  ========================= */

  const handleSaveAnnouncement = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      alert("Please complete the announcement title and message.");
      return;
    }

    try {
      const announcementData = {
        title: formData.title.trim(),
        content: formData.message.trim(),
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        published_at: formData.startDate || null,
        expires_at: formData.endDate || null,
      };

      if (editingAnnouncement) {
        const oldAnnouncement = editingAnnouncement;

        await updateAnnouncement(
          editingAnnouncement.databaseId || editingAnnouncement.id,
          announcementData,
        );

        const fieldsToTrack = [
          {
            key: "title",
            label: "Announcement Title",
          },
          {
            key: "message",
            label: "Announcement Message",
          },
          {
            key: "category",
            label: "Category",
          },
          {
            key: "priority",
            label: "Priority",
          },
          {
            key: "startDate",
            label: "Start Date",
          },
          {
            key: "endDate",
            label: "End Date / Expiration",
          },
          {
            key: "status",
            label: "Announcement Status",
          },
        ];

        fieldsToTrack.forEach(({ key, label }) => {
          const oldValue = oldAnnouncement[key] || "—";

          const newValue = formData[key] || "—";

          if (String(oldValue) !== String(newValue)) {
            onAddAuditLog?.({
              action: "Announcement Updated",
              category: "System Action",
              target: `ANN-${editingAnnouncement.id}`,
              field: label,
              oldValue,
              newValue,
              remarks: `${label} was updated for "${formData.title}".`,
            });
          }
        });

        setSelectedAnnouncementId(editingAnnouncement.id);
      } else {
        const result = await createAnnouncement(announcementData);

        const newAnnouncement = formatAnnouncement(result.data);

        onAddAuditLog?.({
          action: "Announcement Created",
          category: "System Action",
          target: `ANN-${newAnnouncement.id}`,
          field: "Announcement",
          oldValue: "—",
          newValue: formData.title,
          remarks: `New ${formData.category} announcement "${formData.title}" was created.`,
        });

        setSelectedAnnouncementId(newAnnouncement.id);
      }

      setIsFormOpen(false);
      setEditingAnnouncement(null);
      setFormData(emptyForm);

      await loadAnnouncements();
    } catch (err) {
      console.error("Failed to save announcement:", err);

      alert(err.message || "Failed to save announcement.");
    }
  };

  /* =========================
     DELETE ANNOUNCEMENT
  ========================= */

  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedAnnouncement.title}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteAnnouncement(
        selectedAnnouncement.databaseId || selectedAnnouncement.id,
      );

      onAddAuditLog?.({
        action: "Announcement Deleted",
        category: "System Action",
        target: `ANN-${selectedAnnouncement.id}`,
        field: "Announcement",
        oldValue: selectedAnnouncement.title,
        newValue: "Deleted",
        remarks: `Announcement "${selectedAnnouncement.title}" was deleted.`,
      });

      setSelectedAnnouncementId(null);

      await loadAnnouncements();
    } catch (err) {
      console.error("Failed to delete announcement:", err);

      alert(err.message || "Failed to delete announcement.");
    }
  };

  /* =========================
     MANAGE STATUS
  ========================= */

  const handleStatusChange = async (newStatus) => {
    if (!selectedAnnouncement) return;

    const oldStatus = selectedAnnouncement.status;

    if (oldStatus === newStatus) {
      setIsManageOpen(false);
      return;
    }

    try {
      await updateAnnouncementStatus(
        selectedAnnouncement.databaseId || selectedAnnouncement.id,
        newStatus,
      );

      let action = "Announcement Status Updated";

      if (newStatus === "Published") {
        action = "Announcement Published";
      } else if (newStatus === "Archived") {
        action = "Announcement Archived";
      } else if (newStatus === "Expired") {
        action = "Announcement Expired";
      } else if (newStatus === "Draft") {
        action = "Announcement Saved as Draft";
      }

      onAddAuditLog?.({
        action,
        category: "System Action",
        target: `ANN-${selectedAnnouncement.id}`,
        field: "Announcement Status",
        oldValue: oldStatus,
        newValue: newStatus,
        remarks: `Announcement "${selectedAnnouncement.title}" status changed from ${oldStatus} to ${newStatus}.`,
      });

      setIsManageOpen(false);

      await loadAnnouncements();
    } catch (err) {
      console.error("Failed to update announcement status:", err);

      alert(err.message || "Failed to update announcement status.");
    }
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col gap-4">
        {/* PAGE HEADER */}

        <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#101C2E]">
              {t("announcementsPageTitle")}
            </h1>

            <p className="mt-1 text-sm text-[#667085]">
              {t("announcementsPageDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNewAnnouncement}
            className="rounded-lg bg-[#1F5FA6] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1F5FA6]"
          >
            + {t("newAnnouncement")}
          </button>
        </div>

        {/* SUMMARY */}

        <div className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
          <SummaryCard
            label={t("totalAnnouncements")}
            value={announcements.length}
            description={t("allAnnouncementRecords")}
          />

          <SummaryCard
            label={t("published")}
            value={publishedCount}
            description={t("visibleToResidents")}
          />

          <SummaryCard
            label={t("drafts")}
            value={draftCount}
            description={t("pendingPublication")}
          />

          <SummaryCard
            label={t("criticalAlerts")}
            value={criticalCount}
            description={t("highPriorityCommunication")}
          />
        </div>

        {/* MAIN CONTENT */}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          {/* LIST */}

          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
            {/* FILTERS */}

            <div className="flex shrink-0 flex-col gap-3 border-b border-[#E4E7EC] p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#101C2E]">
                  {t("announcementList")}
                </h2>

                <p className="mt-0.5 text-xs text-[#667085]">
                  {t("criticalAnnouncementsFirst")}
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t("searchAnnouncements")}
                  className="h-9 w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-xs outline-none focus:border-[#1F5FA6]"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-9 rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-xs font-medium text-[#475467] outline-none"
                >
                  <option value="All">{t("all")}</option>

                  {statuses.map((status) => (
                    <option key={status}>{displayStatus(status)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ANNOUNCEMENT LIST */}

            <div className="min-h-0 flex-1 overflow-auto p-3">
              {isLoading ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-[#344054]">
                    {t("loadingAnnouncements")}
                  </p>

                  <p className="mt-1 text-xs text-[#98A2B3]">
                    {t("retrievingAnnouncementRecords")}
                  </p>
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-[#D92D20]">
                    {t("failedToLoadAnnouncements")}
                  </p>

                  <p className="mt-1 text-xs text-[#667085]">{error}</p>

                  <button
                    type="button"
                    onClick={loadAnnouncements}
                    className="mt-4 rounded-lg bg-[#1F5FA6] px-4 py-2 text-xs font-bold text-white"
                  >
                    {t("retry")}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAnnouncements.map((announcement) => {
                    const isSelected =
                      selectedAnnouncementId === announcement.id;

                    return (
                      <button
                        key={announcement.id}
                        type="button"
                        onClick={() =>
                          setSelectedAnnouncementId(announcement.id)
                        }
                        className={`w-full rounded-lg border p-4 text-left transition ${
                          isSelected
                            ? "border-[#1F5FA6] bg-[#EAF1FA]"
                            : "border-[#E4E7EC] bg-white hover:bg-[#FCFCFD]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2 py-1 text-[11px] font-bold ${
                                  priorityStyles[announcement.priority]
                                }`}
                              >
                                {displayPriority(announcement.priority)}
                              </span>

                              <span
                                className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                                  statusStyles[
                                    announcement.effectiveStatus ||
                                      announcement.status
                                  ]
                                }`}
                              >
                                {displayStatus(
                                  announcement.effectiveStatus ||
                                    announcement.status,
                                )}
                              </span>
                            </div>

                            <h3 className="mt-2 text-sm font-bold text-[#101C2E]">
                              {announcement.title}
                            </h3>

                            <p className="mt-1 text-xs text-[#667085]">
                              {announcement.category}
                            </p>

                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#475467]">
                              {announcement.message}
                            </p>
                          </div>

                          <span className="text-[11px] font-semibold text-[#98A2B3]">
                            {announcement.id}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {filteredAnnouncements.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-sm font-bold text-[#344054]">
                        {t("noAnnouncementsFound")}
                      </p>

                      <p className="mt-1 text-xs text-[#98A2B3]">
                        {t("changeSearchOrFilter")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* DETAILS */}

          <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-sm">
            {selectedAnnouncement ? (
              <>
                <div className="shrink-0 border-b border-[#E4E7EC] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#1F5FA6]">
                        {t("announcementDetails")}
                      </p>

                      <h2 className="mt-1 text-lg font-bold leading-6 text-[#101C2E]">
                        {selectedAnnouncement.title}
                      </h2>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        statusStyles[
                          selectedAnnouncement.effectiveStatus ||
                            selectedAnnouncement.status
                        ]
                      }`}
                    >
                      {displayStatus(
                        selectedAnnouncement.effectiveStatus ||
                          selectedAnnouncement.status,
                      )}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#98A2B3]">
                    {selectedAnnouncement.id}
                  </p>
                </div>

                <div className="min-h-0 flex-1 overflow-auto p-5">
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      <InfoBox
                        label={t("category")}
                        value={selectedAnnouncement.category}
                      />

                      <InfoBox
                        label={t("priority")}
                        value={displayPriority(selectedAnnouncement.priority)}
                      />

                      <InfoBox
                        label={t("startDate")}
                        value={selectedAnnouncement.startDate || "—"}
                      />

                      <InfoBox
                        label={t("expiration")}
                        value={
                          selectedAnnouncement.endDate || t("noExpiration")
                        }
                      />
                    </div>

                    <div className="border-t border-[#E4E7EC] pt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#1F5FA6]">
                        {t("announcementMessage")}
                      </p>

                      <div className="mt-3 rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] p-4">
                        <p className="text-sm leading-6 text-[#475467]">
                          {selectedAnnouncement.message}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#98A2B3]">
                        {t("lastUpdated")}: {selectedAnnouncement.updatedAt}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 border-t border-[#E4E7EC] p-4">
                  <button
                    type="button"
                    onClick={handleEditAnnouncement}
                    className="flex-1 rounded-lg border border-[#1F5FA6] bg-white px-4 py-2.5 text-xs font-bold text-[#1F5FA6] transition hover:bg-[#EAF1FA]"
                  >
                    {t("edit")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsManageOpen(true)}
                    className="flex-1 rounded-lg bg-[#1F5FA6] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1F5FA6]"
                  >
                    {t("manage")}
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAnnouncement}
                    className="rounded-lg border border-[#FECDCA] bg-white px-4 py-2.5 text-xs font-bold text-[#D92D20] transition hover:bg-[#FEF3F2]"
                  >
                    {t("delete")}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <div>
                  <p className="text-sm font-bold text-[#101C2E]">
                    {t("noAnnouncementSelected")}
                  </p>

                  <p className="mt-1 text-xs text-[#667085]">
                    {t("selectAnnouncementFromList")}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* =========================
          CREATE / EDIT MODAL
      ========================= */}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1F5FA6]">
                  {t("announcementManagement")}
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#101C2E]">
                  {editingAnnouncement
                    ? t("editAnnouncement")
                    : t("newAnnouncement")}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xl font-bold text-[#667085]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="p-5">
              <div className="space-y-4">
                <FormField
                  label={t("announcementTitle")}
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder={t("enterAnnouncementTitle")}
                />

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#344054]">
                    {t("message")}
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows="5"
                    placeholder={t("enterAnnouncementMessage")}
                    className="w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 py-3 text-sm outline-none focus:border-[#1F5FA6]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SelectField
                    label={t("category")}
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    options={categories}
                  />

                  <SelectField
                    label={t("priority")}
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    options={priorities}
                  />

                  <FormField
                    label={t("startDate")}
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleFormChange}
                  />

                  <FormField
                    label={t("endDateExpiration")}
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleFormChange}
                  />

                  <div className="sm:col-span-2">
                    <SelectField
                      label={t("status")}
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      options={statuses}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-[#E4E7EC] pt-5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-[#E4E7EC] px-4 py-2.5 text-xs font-bold text-[#475467]"
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#1F5FA6] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1F5FA6]"
                >
                  {editingAnnouncement
                    ? t("saveChanges")
                    : t("createAnnouncement")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          MANAGE MODAL
      ========================= */}

      {isManageOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="border-b border-[#E4E7EC] p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#1F5FA6]">
                {t("manageAnnouncement")}
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#101C2E]">
                {t("changeAnnouncementStatus")}
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#667085]">
                {t("selectAppropriateStatus")}
              </p>
            </div>

            <div className="space-y-2 p-5">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
                    selectedAnnouncement.status === status
                      ? "border-[#1F5FA6] bg-[#EAF1FA]"
                      : "border-[#E4E7EC] hover:bg-[#FCFCFD]"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-[#101C2E]">
                      {displayStatus(status)}
                    </p>

                    <p className="mt-1 text-[11px] text-[#667085]">
                      {getStatusDescription(status, t)}
                    </p>
                  </div>

                  {selectedAnnouncement.status === status && (
                    <span className="text-sm font-bold text-[#1F5FA6]"><Check size={16} /></span>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-[#E4E7EC] p-4">
              <button
                type="button"
                onClick={() => setIsManageOpen(false)}
                className="w-full rounded-lg border border-[#E4E7EC] py-2.5 text-xs font-bold text-[#475467]"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

function SummaryCard({ label, value, description }) {
  return (
    <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#101C2E]">{value}</p>

      <p className="mt-1 text-[11px] text-[#667085]">{description}</p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg border border-[#E4E7EC] bg-[#F8FAFC] p-3">
      <p className="text-[11px] font-bold uppercase text-[#98A2B3]">{label}</p>

      <p className="mt-1 text-xs font-bold text-[#344054]">{value}</p>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-[#344054]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-sm outline-none focus:border-[#1F5FA6]"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-[#344054]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-lg border border-[#E4E7EC] bg-[#FCFCFD] px-3 text-sm outline-none focus:border-[#1F5FA6]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function getStatusDescription(status, t) {
  const descriptions = {
    Draft: t("draftDescription"),
    Published: t("publishedDescription"),
    Archived: t("archivedDescription"),
    Expired: t("expiredDescription"),
  };

  return descriptions[status];
}

export default AnnouncementsPage;
