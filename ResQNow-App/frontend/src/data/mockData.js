// ============================================================
// src/data/mockData.js — All mock data for Resident-side testing
// ============================================================

// ============ MOCK RESIDENT ============
export const mockResident = {
  id: 'RES-001',
  fullName: 'Juan Dela Cruz',
  contactNumber: '09123456789',
  email: 'Resident123@gmail.com',
  address: 'Purok 1, Barangay Camunatan',
  purok: 'Purok 1',
  householdCount: 5,
  householdProfile: {
    hasSeniorCitizen: true,
    hasChild: true,
    hasPWD: false,
    hasPregnantPerson: false,
  },
  role: 'resident',
  accountStatus: 'Verified',
};


// ============ EMERGENCY REPORTS ============
export const mockEmergencyReports = [
  {
    id: 'EM-001',
    reportType: 'Emergency',
    concernType: 'Flood Rescue Needed',
    location: 'Purok 2, Barangay Camunatan',
    landmark: 'Near the covered court',
    status: 'In Progress',
    priority: 'High',
    description:
      'Water level rising fast. Family of 5 trapped on second floor.',
    victimName: null,
    victimContact: null,
    submittedAt: '2026-08-25 08:30 AM',
    updatedAt: '2026-08-25 08:45 AM',
    latestUpdate:
      'Barangay rescue team has been dispatched to the location.',

    timeline: [
      {
        status: 'Submitted',
        date: '2026-08-25 08:30 AM',
        done: true,
      },
      {
        status: 'In Progress',
        date: '2026-08-25 08:35 AM',
        done: true,
      },
      {
        status: 'Responders En Route',
        date: '2026-08-25 08:45 AM',
        done: true,
      },
      {
        status: 'Responded',
        date: null,
        done: false,
      },
      {
        status: 'Resolved',
        date: null,
        done: false,
      },
    ],

    assignedPersonnel:
      'Responder One (RSP-001)',

    barangayRemarks: null,
    invalidReason: null,
    resolvedRemarks: null,
  },

  {
    id: 'EM-002',
    reportType: 'Emergency',
    concernType: 'Medical Emergency',
    location: 'Purok 3, Barangay Camunatan',
    landmark: 'Beside the sari-sari store',
    status: 'Responded',
    priority: 'High',
    description:
      'Elderly resident experiencing difficulty breathing.',
    victimName: 'Maria Dela Cruz',
    victimContact: '09129876543',
    submittedAt: '2026-08-24 03:15 PM',
    updatedAt: '2026-08-24 04:00 PM',
    latestUpdate:
      'Medical team has arrived and is providing treatment.',

    timeline: [
      {
        status: 'Submitted',
        date: '2026-08-24 03:15 PM',
        done: true,
      },
      {
        status: 'In Progress',
        date: '2026-08-24 03:20 PM',
        done: true,
      },
      {
        status: 'Responders En Route',
        date: '2026-08-24 03:30 PM',
        done: true,
      },
      {
        status: 'Responded',
        date: '2026-08-24 04:00 PM',
        done: true,
      },
      {
        status: 'Resolved',
        date: null,
        done: false,
      },
    ],

    assignedPersonnel:
      'Barangay Health Worker',

    barangayRemarks:
      'Patient stable. Referred to rural health unit.',

    invalidReason: null,
    resolvedRemarks: null,
  },
];

// ============ NON-EMERGENCY REPORTS ============
export const mockNonEmergencyReports = [
  {
    id: 'NE-001',
    reportType: 'Non-Emergency',
    concernType: 'Road Obstruction',
    subcategory: 'Fallen Tree',
    location: 'Purok 1, Barangay Camunatan',
    landmark: 'Near the elementary school',
    status: 'Pending Verification',
    priority: 'Medium',
    description:
      "A large mango tree branch fell across the road after last night's storm. Vehicles cannot pass.",
    reportingFor: 'Myself',
    affectedIndividuals: [],
    requiredAssistance:
      'Chainsaw and cleanup crew needed.',
    photoUrl: null,
    submittedAt: '2026-08-25 09:15 AM',
    updatedAt: '2026-08-25 09:15 AM',
    latestUpdate:
      'Waiting for barangay verification.',

    timeline: [
      {
        status: 'Submitted',
        date: '2026-08-25 09:15 AM',
        done: true,
      },
      {
        status: 'Pending Verification',
        date: '2026-08-25 09:15 AM',
        done: true,
      },
      {
        status: 'Verified',
        date: null,
        done: false,
      },
      {
        status: 'In Progress',
        date: null,
        done: false,
      },
      {
        status: 'Resolved',
        date: null,
        done: false,
      },
    ],

    assignedPersonnel: null,
    barangayRemarks: null,
    invalidReason: null,
    resolvedRemarks: null,
  },

  {
    id: 'NE-002',
    reportType: 'Non-Emergency',
    concernType: 'Damaged Facility',
    subcategory: 'Street Light',
    location: 'Purok 1, Barangay Camunatan',
    landmark: 'Corner of Purok 1 entrance',
    status: 'Verified',
    priority: 'Low',
    description:
      'Street light has been broken for two weeks. Area is very dark at night.',
    reportingFor: 'Myself',
    affectedIndividuals: [
      'Senior Citizen',
    ],
    requiredAssistance:
      'Electrician needed to repair the street light.',
    photoUrl: null,
    submittedAt: '2026-08-23 02:00 PM',
    updatedAt: '2026-08-24 10:00 AM',
    latestUpdate:
      'Verified by barangay. Scheduled for repair.',

    timeline: [
      {
        status: 'Submitted',
        date: '2026-08-23 02:00 PM',
        done: true,
      },
      {
        status: 'Pending Verification',
        date: '2026-08-23 02:00 PM',
        done: true,
      },
      {
        status: 'Verified',
        date: '2026-08-24 10:00 AM',
        done: true,
      },
      {
        status: 'In Progress',
        date: null,
        done: false,
      },
      {
        status: 'Resolved',
        date: null,
        done: false,
      },
    ],

    assignedPersonnel: null,

    barangayRemarks:
      'Verified on-site. Repair scheduled for next week.',

    invalidReason: null,
    resolvedRemarks: null,
  },

  {
    id: 'NE-003',
    reportType: 'Non-Emergency',
    concernType: 'Evacuation Preparation',
    subcategory: null,
    location: 'Purok 3, Barangay Camunatan',
    landmark: 'Blue house with red gate',
    status: 'Resolved',
    priority: 'Medium',
    description:
      'Family needs help moving to the evacuation center before the typhoon hits.',
    reportingFor: 'Another Person',

    affectedIndividuals: [
      'Child',
      'Senior Citizen',
    ],

    requiredAssistance:
      'Transportation to evacuation center.',

    photoUrl: null,
    submittedAt: '2026-08-20 06:00 PM',
    updatedAt: '2026-08-20 08:30 PM',
    latestUpdate:
      'Resolved. Family successfully relocated.',

    timeline: [
      {
        status: 'Submitted',
        date: '2026-08-20 06:00 PM',
        done: true,
      },
      {
        status: 'Pending Verification',
        date: '2026-08-20 06:00 PM',
        done: true,
      },
      {
        status: 'Verified',
        date: '2026-08-20 06:30 PM',
        done: true,
      },
      {
        status: 'In Progress',
        date: '2026-08-20 07:00 PM',
        done: true,
      },
      {
        status: 'Resolved',
        date: '2026-08-20 08:30 PM',
        done: true,
      },
    ],

    assignedPersonnel:
      'Responder One (RSP-001)',

    barangayRemarks: null,
    invalidReason: null,

    resolvedRemarks:
      'Family of 4 safely transported to Barangay Camunatan Evacuation Center.',
  },
];

export const mockAllReports = [
  ...mockEmergencyReports,
  ...mockNonEmergencyReports,
];

// ============ ANNOUNCEMENTS ============
// details = complete information shown
// inside /updates/:updateId
export const mockAnnouncements = [
  {
    id: 'ANN-001',
    title: 'Evacuation Advisory',

    message:
      'Residents in low-lying and flood-prone areas are advised to prepare for possible evacuation. Monitor official barangay and PAGASA advisories.',

    details:
      'Residents living in low-lying and flood-prone areas of Barangay Camunatan are advised to prepare for possible evacuation due to changing weather conditions. Prepare essential medicines, identification cards, important documents, drinking water, food, clothing, flashlights, and other emergency supplies. Families with children, senior citizens, PWDs, and pregnant household members are encouraged to prepare early. Continue monitoring official Barangay Camunatan and PAGASA advisories for further instructions.',

    type: 'Critical Alert',
    priority: 'critical',

    location:
      'Low-lying and flood-prone areas of Barangay Camunatan',

    postedBy:
      'Barangay Camunatan',

    eventStartAt: null,
    eventEndAt: null,

    createdAt:
      '2026-08-26T08:00:00',

    expiresAt:
      '2026-08-27T23:59:59',

    isRead: false,

    safetyGuideId:
      'flood',
  },

  {
    id: 'ANN-002',
    title: 'Free Medical Check-up',

    message:
      'The Barangay Health Center will conduct free medical check-ups on August 29 from 8:00 AM to 12:00 NN at the Barangay Hall.',

    details:
      'The Barangay Health Center will conduct free medical check-ups for residents of Barangay Camunatan. Residents may visit the Barangay Hall for basic health assessment and consultation. Senior citizens and residents with existing health concerns are encouraged to bring their maintenance medicine list and available medical records.',

    type: 'Announcement',
    priority: 'important',

    location:
      'Barangay Camunatan Hall',

    postedBy:
      'Barangay Health Center',

    eventStartAt:
      '2026-08-29T08:00:00',

    eventEndAt:
      '2026-08-29T12:00:00',

    createdAt:
      '2026-08-25T14:00:00',

    expiresAt:
      '2026-08-29T12:00:00',

    isRead: false,
    safetyGuideId: null,
  },

  {
    id: 'ANN-003',
    title:
      'Barangay Clean-up Drive — September 14',

    message:
      'Residents are encouraged to participate in the Barangay Clean-up Drive on September 14, 2026. Meeting point is at the Barangay Hall at 6:00 AM.',

    details:
      'Barangay Camunatan residents are invited to participate in the community clean-up drive on September 14, 2026. Participants will meet at the Barangay Hall at 6:00 AM before proceeding to assigned clean-up areas. Residents are encouraged to bring gloves, drinking water, and appropriate footwear. Cleaning tools may also be brought if available.',

    type: 'Announcement',
    priority: 'normal',

    location:
      'Barangay Camunatan Hall',

    postedBy:
      'Barangay Camunatan',

    eventStartAt:
      '2026-09-14T06:00:00',

    eventEndAt:
      '2026-09-14T12:00:00',

    createdAt:
      '2026-08-25T09:00:00',

    expiresAt:
      '2026-09-14T23:59:59',

    isRead: false,

    safetyGuideId:
      'cleanup',
  },

  {
    id: 'ANN-004',
    title:
      'Disaster Preparedness Orientation',

    message:
      'Residents are invited to attend the Barangay Disaster Preparedness Orientation at the Barangay Hall.',

    details:
      'Barangay Camunatan residents are invited to attend a Disaster Preparedness Orientation. The activity will discuss basic household preparedness, evacuation procedures, emergency communication, important emergency supplies, and actions residents should take before and during disasters.',

    type: 'Announcement',
    priority: 'normal',

    location:
      'Barangay Camunatan Hall',

    postedBy:
      'Barangay Camunatan',

    eventStartAt:
      '2026-09-20T13:00:00',

    eventEndAt:
      '2026-09-20T17:00:00',

    createdAt:
      '2026-08-24T10:00:00',

    expiresAt:
      '2026-09-20T17:00:00',

    isRead: true,
    safetyGuideId: null,
  },

  {
    id: 'ANN-005',
    title:
      'Medical Mission — September 10',

    message:
      'A barangay medical mission will be held at the Barangay Hall on September 10, 2026. Free check-ups and consultations will be available.',

    details:
      'Barangay Camunatan will conduct a medical mission for residents on September 10, 2026. Free basic medical check-ups and consultations will be available at the Barangay Hall. Residents are encouraged to bring valid identification and any available medical information, including maintenance medicines and previous prescriptions.',

    type: 'Announcement',
    priority: 'normal',

    location:
      'Barangay Camunatan Hall',

    postedBy:
      'Barangay Camunatan',

    eventStartAt:
      '2026-09-10T08:00:00',

    eventEndAt:
      '2026-09-10T17:00:00',

    createdAt:
      '2026-08-24T14:30:00',

    expiresAt:
      '2026-09-10T23:59:59',

    isRead: true,
    safetyGuideId: null,
  },
];

// ============ BARANGAY CONTACTS ============
export const mockBarangayContacts = [
  {
    id: 'BRGY-001',
    name: 'Barangay Camunatan Hotline',
    role: 'Barangay Hotline',
    phoneNumber: '0917-123-4567',
    group: 'Hotline',
  },
  {
    id: 'BRGY-002',
    name: 'Juan Dela Cruz',
    role: 'Punong Barangay / Barangay Captain',
    phoneNumber: '0917-000-0001',
    group: 'Official',
  },
  {
    id: 'BRGY-003',
    name: 'Barangay Kagawad 1',
    role: 'Barangay Kagawad',
    phoneNumber: '0917-000-0002',
    group: 'Official',
  },
  {
    id: 'BRGY-004',
    name: 'Barangay Kagawad 2',
    role: 'Barangay Kagawad',
    phoneNumber: '0917-000-0003',
    group: 'Official',
  },
  {
    id: 'BRGY-005',
    name: 'Barangay Kagawad 3',
    role: 'Barangay Kagawad',
    phoneNumber: '0917-000-0004',
    group: 'Official',
  },
  {
    id: 'BRGY-006',
    name: 'Barangay Kagawad 4',
    role: 'Barangay Kagawad',
    phoneNumber: '0917-000-0005',
    group: 'Official',
  },
  {
    id: 'BRGY-007',
    name: 'Barangay Kagawad 5',
    role: 'Barangay Kagawad',
    phoneNumber: '0917-000-0006',
    group: 'Official',
  },
  {
    id: 'BRGY-008',
    name: 'Barangay Kagawad 6',
    role: 'Barangay Kagawad',
    phoneNumber: '0917-000-0007',
    group: 'Official',
  },
  {
    id: 'BRGY-009',
    name: 'Barangay Kagawad 7',
    role: 'Barangay Kagawad',
    phoneNumber: '0917-000-0008',
    group: 'Official',
  },
  {
    id: 'BRGY-010',
    name: 'SK Chairperson',
    role:
      'Sangguniang Kabataan Chairperson',
    phoneNumber: '0917-000-0009',
    group: 'Official',
  },
  {
    id: 'BRGY-011',
    name: 'Barangay Secretary',
    role: 'Barangay Secretary',
    phoneNumber: '0917-000-0010',
    group: 'Personnel',
  },
  {
    id: 'BRGY-012',
    name: 'Barangay Treasurer',
    role: 'Barangay Treasurer',
    phoneNumber: '0917-000-0011',
    group: 'Personnel',
  },
  {
    id: 'BRGY-013',
    name: 'BDRRMO Personnel',
    role: 'Disaster Response',
    phoneNumber: '0917-678-9012',
    group: 'Personnel',
  },
  {
    id: 'BRGY-014',
    name: 'Barangay Health Worker',
    role: 'Health Assistance',
    phoneNumber: '0917-000-0012',
    group: 'Personnel',
  },
  {
    id: 'BRGY-015',
    name: 'Barangay Tanod',
    role: 'Peace and Order',
    phoneNumber: '0917-000-0013',
    group: 'Personnel',
  },
];

// ============ EMERGENCY CONTACTS ============
export const mockEmergencyContacts = [
  {
    id: 'CT-001',
    name: 'Barangay Camunatan Hotline',
    category: 'Barangay',
    phoneNumber: '0917-123-4567',
    description:
      'Main barangay emergency hotline. Available 24/7.',
  },
  {
    id: 'CT-002',
    name:
      'BFP — Bureau of Fire Protection',
    category: 'Fire',
    phoneNumber: '0917-234-5678',
    description:
      'Report fire emergencies and request fire rescue.',
  },
  {
    id: 'CT-003',
    name:
      'PNP — Ilagan City Police Station',
    category: 'Police',
    phoneNumber: '0917-345-6789',
    description:
      'Report crimes, public safety concerns, and request police assistance.',
  },
  {
    id: 'CT-004',
    name: 'Ilagan City Health Office',
    category: 'Medical',
    phoneNumber: '0917-456-7890',
    description:
      'Medical emergencies, ambulance requests, and health concerns.',
  },
  {
    id: 'CT-005',
    name:
      'CDRRMO — City Disaster Risk Reduction',
    category: 'Rescue',
    phoneNumber: '0917-567-8901',
    description:
      'Disaster response, rescue operations, and evacuation coordination.',
  },
  {
    id: 'CT-006',
    name:
      'BDRRMO — Barangay Disaster Risk Reduction',
    category: 'Rescue',
    phoneNumber: '0917-678-9012',
    description:
      'Local barangay disaster response team.',
  },
  {
    id: 'CT-007',
    name:
      'Barangay Camunatan Evacuation Center',
    category: 'Evacuation',
    phoneNumber: '0917-789-0123',
    description:
      'Located at Barangay Camunatan Covered Court. Capacity: 200 persons.',
  },
];

// ============ NOTIFICATIONS ============
//
// detailType tells UpdateDetail.jsx
// exactly what information should be shown.
//
// report_progress
//   → show report progress only
//
// assigned_personnel
//   → show assigned personnel only
//
// resolution
//   → show resolution information only
//
export const mockNotifications = [
  {
    id: 'NOTIF-001',
    title: 'Report Submitted',

    message:
      'Your flood rescue report EM-001 has been submitted. Barangay personnel have been notified.',

    type: 'report_update',
    detailType: 'report_progress',
    progressStatus: 'Submitted',

    priority: 'normal',

    createdAt:
      '2026-08-25T08:30:00',

    expiresAt: null,

    relatedReportId:
      'EM-001',

    isRead: false,
  },

  {
    id: 'NOTIF-005',
    title: 'Personnel Assigned',

    message:
      'Responder One has been assigned to your flood rescue report EM-001.',

    type: 'report_update',
    detailType:
      'assigned_personnel',

    priority: 'important',

    createdAt:
      '2026-08-25T08:35:00',

    expiresAt: null,

    relatedReportId:
      'EM-001',

    isRead: false,
  },

  {
    id: 'NOTIF-002',
    title: 'Report In Progress',

    message:
      'Your emergency report EM-001 is now being processed by barangay personnel.',

    type: 'report_update',
    detailType: 'report_progress',
    progressStatus:
      'In Progress',

    priority: 'important',

    createdAt:
      '2026-08-25T08:45:00',

    expiresAt: null,

    relatedReportId:
      'EM-001',

    isRead: false,
  },

  {
    id: 'NOTIF-003',
    title: 'Responders En Route',

    message:
      'Barangay responders are now on the way to your reported location.',

    type: 'report_update',
    detailType: 'report_progress',
    progressStatus:
      'Responders En Route',

    priority: 'important',

    createdAt:
      '2026-08-25T09:00:00',

    expiresAt: null,

    relatedReportId:
      'EM-001',

    isRead: false,
  },

  {
    id: 'NOTIF-004',
    title: 'Report Resolved',

    message:
      'Your evacuation assistance report NE-003 has been resolved. Family successfully relocated.',

    type: 'report_update',
    detailType: 'resolution',

    priority: 'normal',

    createdAt:
      '2026-08-20T20:30:00',

    expiresAt: null,

    relatedReportId:
      'NE-003',

    isRead: true,
  },
];

// ============ EMERGENCY TYPES ============
export const emergencyTypes = [
  {
    id: 'life-death',
    label: 'Life and Death Emergency',
    icon: 'HeartPulse',
  },
  {
    id: 'fire',
    label: 'Fire Emergency',
    icon: 'Flame',
  },
  {
    id: 'medical',
    label: 'Medical Emergency',
    icon: 'Stethoscope',
  },
  {
    id: 'violence',
    label: 'Public Safety / Violence',
    icon: 'ShieldAlert',
  },
  {
    id: 'flood',
    label: 'Flood Rescue Needed',
    icon: 'Waves',
  },
  {
    id: 'accident',
    label: 'Road Accident',
    icon: 'Car',
  },
  {
    id: 'evacuation',
    label: 'Immediate Evacuation',
    icon: 'Tent',
  },
];

// ============ NON-EMERGENCY TYPES ============
export const nonEmergencyConcernTypes = [
  'Evacuation Preparation',
  'Barangay Health Worker Assistance',
  'Road Obstruction',
  'Damaged Facility',
  'Clean-up Assistance',
  'Community Concern',
  'Other Assistance',
];

export const nonEmergencyTypes = [
  {
    id: 'evac-assistance',
    label: 'Evacuation Preparation',
    icon: 'Tent',
  },
  {
    id: 'bhw-assistance',
    label:
      'Barangay Health Worker Assistance',
    icon: 'Stethoscope',
  },
  {
    id: 'road-obstruction',
    label: 'Road Obstruction',
    icon: 'TreePine',
  },
  {
    id: 'damaged-facility',
    label: 'Damaged Facility',
    icon: 'Wrench',
  },
  {
    id: 'cleanup',
    label: 'Clean-up Assistance',
    icon: 'Broom',
  },
  {
    id: 'community-concern',
    label: 'Community Concern',
    icon: 'MessageSquare',
  },
  {
    id: 'other-assistance',
    label: 'Other Assistance',
    icon: 'CircleHelp',
  },
];

// ============ PUROKS ============
export const purokOptions = [
  'Purok 1',
  'Purok 2',
  'Purok 3',
];

// ============ SAFETY TIPS ============
export const safetyTips = [
  {
    category: 'Emergency Safety',

    items: [
      {
        id: 'life-death',
        title:
          'Life and Death Emergency',

        tips: [
          'Call the barangay hotline immediately while sending your report.',
          'Stay calm and give your exact location and what is happening.',
          'Do not move a seriously injured person unless there is immediate danger.',
          'Keep your phone reachable and stay put for responders.',
        ],
      },

      {
        id: 'fire',
        title: 'Fire Emergency',

        tips: [
          'Get out first — never fight a fire alone.',
          'Call the BFP hotline and report your location clearly.',
          'Stay low to the ground and cover your mouth and nose to avoid smoke.',
          'Know two exits from your home and meet at a safe place outside.',
        ],
      },

      {
        id: 'medical',
        title: 'Medical Emergency',

        tips: [
          'Call the barangay hotline or City Health Office for an ambulance.',
          "Provide the patient's age, condition, and exact location.",
          'Do not give food or drink to an unconscious person.',
          'Perform first aid only if you are trained to do so.',
        ],
      },

      {
        id: 'violence',
        title:
          'Public Safety / Violence',

        tips: [
          'Move away from the danger and stay out of sight if possible.',
          'Call the police as soon as it is safe to do so.',
          'Do not intervene physically — let responders handle the situation.',
          'Note descriptions of people or vehicles from a safe distance.',
        ],
      },

      {
        id: 'flood',
        title:
          'Flood Rescue Needed',

        tips: [
          'Move to higher ground immediately.',
          'Never walk or drive through floodwater.',
          'Turn off electricity if water is rising inside your home.',
          'Bring your emergency go-bag and wait for rescue.',
        ],
      },

      {
        id: 'accident',
        title: 'Road Accident',

        tips: [
          'Move to a safe spot away from moving traffic.',
          'Call for medical help if anyone is injured.',
          'Do not move injured victims unless there is fire or immediate danger.',
          'Turn on hazard lights or mark the area if it is safe.',
        ],
      },

      {
        id: 'evacuation',
        title:
          'Immediate Evacuation',

        tips: [
          'Follow the barangay evacuation route to the covered court.',
          'Bring your go-bag, IDs, and important documents.',
          'Lock your home and turn off utilities if time allows.',
          'Bring children, seniors, PWDs, and pregnant family members first.',
        ],
      },
    ],
  },

  {
    category:
      'Community & Non-Emergency Safety',

    items: [
      {
        id: 'evac-assistance',
        title:
          'Evacuation Preparation',

        tips: [
          'Request help early, before conditions get worse.',
          'Indicate how many people need transport, including seniors, children, and PWDs.',
          'Prepare your go-bag before requesting evacuation.',
          'Wait at a visible, safe pickup point.',
        ],
      },

      {
        id: 'bhw-assistance',
        title:
          'Barangay Health Worker Assistance',

        tips: [
          "Prepare the patient's information and symptoms before the visit.",
          'Note any maintenance medications and allergies.',
          'Make sure someone is available to receive the health worker.',
          'Keep your contact number reachable.',
        ],
      },

      {
        id: 'road-obstruction',
        title: 'Road Obstruction',

        tips: [
          'Avoid the blocked area and use alternate routes.',
          'Do not remove fallen power lines — report them instead.',
          'Take a photo and note the exact landmark for your report.',
          'Warn neighbors and passersby if it is safe to do so.',
        ],
      },

      {
        id: 'damaged-facility',
        title: 'Damaged Facility',

        tips: [
          'Keep people away from the damaged area.',
          'Report broken streetlights, roads, or public structures with a photo.',
          'Note any immediate danger such as exposed wires or unstable parts.',
          'Do not attempt repairs on public facilities yourself.',
        ],
      },

      {
        id: 'cleanup',
        title: 'Clean-up Assistance',

        tips: [
          'Coordinate with your purok for a group clean-up schedule.',
          'Wear gloves, boots, and a mask when handling debris.',
          'Separate waste properly and watch for hazards like nails or glass.',
          'Report large or hazardous debris that needs heavy equipment.',
        ],
      },

      {
        id: 'community-concern',
        title: 'Community Concern',

        tips: [
          'Describe the concern clearly with location and photos.',
          'Provide a landmark so personnel can find the area easily.',
          'Avoid spreading unverified information.',
          'Report through the app or barangay office for proper documentation.',
        ],
      },

      {
        id: 'other-assistance',
        title: 'Other Assistance',

        tips: [
          'Describe the kind of help needed as clearly as possible.',
          'Include your purok, landmark, and the best time to reach you.',
          'Attach a photo if it helps explain the request.',
          'Wait for barangay verification before expecting a response.',
        ],
      },
    ],
  },
];