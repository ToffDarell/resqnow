// src/i18n/locales/en.js

const en = {
  // ============ COMMON ============
  common: {
    home: 'Home',
    track: 'Track',
    report: 'Report',
    safety: 'Safety',
    contacts: 'Contacts',
    updates: 'Updates',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    edit: 'Edit',
    back: 'Back',
    call: 'Call',
    callNow: 'Call Now',
    optional: 'Optional',
    required: 'Required',
    yes: 'Yes',
    no: 'No',
    submit: 'Submit',
    confirm: 'Confirm',
    loading: 'Loading...',
    viewAll: 'View all',
    search: 'Search',
    resident: 'Resident',
    notProvided: 'Not provided',
  },

  // ============ NAVIGATION ============
  nav: {
    home: 'Home',
    track: 'Track',
    report: 'Report',
    safety: 'Safety',
    contacts: 'Contacts',
    updates: 'Updates',
    submitReport: 'Submit Report',
    profileSettings: 'Profile and Settings',
  },

  // ============ DASHBOARD ============
  dashboard: {
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',

    importantUpdates: 'Important Updates',
    myReports: 'My Reports',
    latestReport: 'Latest Report',

    active: 'Active',
    pending: 'Pending',
    resolved: 'Resolved',

    viewAll: 'View all',

    criticalAlert: 'Critical Alert',
    alert: 'Alert',
    reportUpdate: 'Report Update',
    announcement: 'Announcement',

    latestUpdate: 'Latest Update',
    featuredSafetyGuide: 'Featured Safety Guide',
    floodSafety: 'Flood Safety',
    safetyPreparedness: 'Safety Preparedness',

    emergencyContacts: 'Emergency Contacts',
  },

  // ============ SUBMIT REPORT ============
  submitChoice: {
    title: 'Submit a Report',
    subtitle:
      'Choose the type of report that matches your situation.',

    emergencyTitle: 'Emergency',
    urgent: 'Urgent',

    emergencyDescription:
      'For immediate danger, fire, flood, injury, rescue, or urgent evacuation.',

    quickFlow: 'Quick reporting flow',

    nonEmergencyTitle: 'Non-Emergency',

    nonEmergencyDescription:
      'For barangay concerns like damaged facilities, obstructions, and assistance requests.',

    moreDetails:
      'More details may be needed',

    notSure:
      'Not sure what to choose?',

    emergencyHint:
      'Use Emergency if urgent help is needed right away.',

    nonEmergencyHint:
      'Use Non-Emergency for concerns that can be reviewed by barangay personnel.',

    signalNote:
      'If internet or mobile signal is weak during an emergency, use the Contacts page to call the barangay hotline directly.',
  },

  // ============ EMERGENCY REPORT ============
  emergency: {
    title: 'Emergency Report',
    question: 'What is the emergency?',

    locationQuestion:
      'Where is the emergency?',

    currentLocationHint:
      'This will use your current location.',

    otherLocationHint:
      'The emergency may not be at your location. Set where it is actually happening.',

    useCurrentLocation:
      'Use Current Location',

    locating:
      'Getting location...',

    atCurrentLocation:
      'Emergency is at my current location',

    manualLocation:
      'Enter location manually',

    somewhereElse:
      'Emergency is somewhere else',

    useCurrentInstead:
      'Use my current location instead',

    manualLocationPlaceholder:
      'Type the location or landmark',

    victimLocationPlaceholder:
      'Where is the victim located?',

    reportingForOther:
      'Reporting for someone else?',

    reportingForOtherHint:
      'Tap if the emergency is for another person.',

    addVictimDetails:
      "Add the victim's details below.",

    victimName:
      'Victim Name',

    victimContact:
      'Victim Contact',

    unknownName:
      "I don't know the name",

    reporterInfo:
      'Your name, contact, and purok will be sent automatically.',

    optionalDetails:
      'Optional Details',

    optionalDetailsHint:
      'Landmark & short description',

    nearbyLandmark:
      'Nearby Landmark',

    nearbyLandmarkPlaceholder:
      'Example: Near the covered court',

    shortDescription:
      'Short Description',

    shortDescriptionPlaceholder:
      'Briefly describe what is happening...',

    weakSignal:
      'Weak signal?',

    weakSignalMessage:
      'Call the hotline directly.',

    viewContacts:
      'View Contacts',

    send:
      'Send Emergency Report',

    confirmTitle:
      'Confirm Emergency Report',

    confirmMessage:
      'Send now? Your name, contact number, address, and location will be sent to barangay personnel.',

    sendNow:
      'Send Now',

    sending:
      'Sending...',

    type:
      'Type',

    contact:
      'Contact',

    victim:
      'Victim',

    selectTypeError:
      'Please select the type of emergency.',

    locationError:
      'Please set your location so responders know where to go.',

    gpsError:
      'Your current location could not be detected. Enter the location manually.',

    submittedTitle:
      'Emergency Report Submitted',

    submittedMessage:
      'Your emergency report has been received and is ready for barangay response.',

    reportId:
      'Report ID',

    reporter:
      'Reporter',

    location:
      'Location',

    for:
      'For',

    status:
      'Status',

    backHome:
      'Back to Home',

    submitAnother:
      'Submit Another Report',

    categories: {
      lifeDeath: {
        label:
          'Life-Threatening',

        description:
          "Someone's life is in immediate danger.",
      },

      fire: {
        label:
          'Fire Emergency',

        description:
          'Active fire, heavy smoke, or immediate fire danger.',
      },

      medical: {
        label:
          'Medical Emergency',

        description:
          'Serious injury, illness, or urgent medical help.',
      },

      violence: {
        label:
          'Violence / Safety Threat',

        description:
          'Violence, threats, or immediate danger from another person.',
      },

      flood: {
        label:
          'Flood Rescue',

        description:
          'Urgent rescue or assistance because of flooding.',
      },

      accident: {
        label:
          'Road Accident',

        description:
          'Vehicle crash or serious road-related accident.',
      },

      evacuation: {
        label:
          'Urgent Evacuation',

        description:
          'Immediate help is needed to evacuate safely.',
      },
    },
  },

  // ============ NON-EMERGENCY REPORT ============
  nonEmergency: {
    title:
      'Non-Emergency Report',

    subtitle:
      'Report a barangay concern or request assistance.',

    reportingFor:
      'Who is this report for?',

    reportingForHint:
      'Tell us who may need the barangay assistance.',

    myself:
      'Myself',

    anotherPerson:
      'Another Person',

    name:
      'Name',

    contactNumber:
      'Contact Number',

    relationship:
      'Relationship / Note',

    ifKnown:
      'If known',

    optionalPlaceholder:
      'Optional',

    exampleNeighbor:
      'Example: Neighbor',

    concernQuestion:
      'What is your concern?',

    concernInstruction:
      'Select the category that best matches your report.',

    specifyConcern:
      'Specify the concern',

    optional:
      'optional',

    evacuationWarning:
      'In danger right now? Use Emergency Report → Urgent Evacuation instead.',

    incidentLocation:
      'Incident Location',

    setIncidentLocation:
      'Set where the concern is located',

    purok:
      'Purok',

    addressLocation:
      'Address / Incident Location',

    addressPlaceholder:
      'Enter the location of the concern',

    nearbyLandmark:
      'Nearby Landmark',

    landmarkPlaceholder:
      'Example: Near the elementary school',

    pinIncidentLocation:
      'Pin Incident Location',

    mapLater:
      'Map pin integration will be connected later.',

    sampleCoordinates:
      'Sample coordinates: {{coordinates}}',

    reportDetails:
      'Report Details',

    reportDetailsHint:
      'Give enough information for barangay personnel to review the concern.',

    description:
      'Description',

    descriptionPlaceholder:
      'Describe the concern briefly...',

    assistanceNeeded:
      'Assistance Needed',

    assistancePlaceholder:
      'Example: Clean-up crew, transportation, repair...',

    affectedIndividuals:
      'Affected Individuals',

    affectedHint:
      'Select all that apply. Optional.',

    affected: {
      child:
        'Child',

      seniorCitizen:
        'Senior Citizen',

      pwd:
        'PWD',

      pregnantPerson:
        'Pregnant Person',

      injuredPerson:
        'Injured Person',
    },

    photoEvidence:
      'Photo Evidence',

    photoOptional:
      'Optional only.',

    addPhoto:
      'Add Photo',

    photoType:
      'JPG or PNG',

    removePhoto:
      'Remove photo',

    reporterInfo:
      'Your name, contact number, address, and purok will be included automatically with this report.',

    reviewReport:
      'Review Report',

    pendingNotice:
      'Non-emergency reports will start as Pending Verification.',

    confirmTitle:
      'Confirm Report',

    confirmHint:
      'Review the important details before submitting.',

    concernType:
      'Concern Type',

    reportingForLabel:
      'Reporting For',

    person:
      'Person',

    location:
      'Location',

    descriptionLabel:
      'Description',

    status:
      'Status',

    goBack:
      'Go Back',

    confirmSubmit:
      'Confirm & Submit',

    submitting:
      'Submitting...',

    selectTypeError:
      'Please select a concern type.',

    locationError:
      'Please provide the incident location.',

    descriptionError:
      'Please add a short description of the concern.',

    submittedTitle:
      'Report Submitted',

    submittedMessage:
      'Your concern has been submitted and is waiting for barangay verification.',

    reportId:
      'Report ID',

    reporter:
      'Reporter',

    viewReports:
      'View My Reports',

    backHome:
      'Back to Home',

    categories: {
      evacuation: {
        label:
          'Evacuation Help',

        description:
          'Non-urgent help preparing for or getting to an evacuation center.',
      },

      healthWorker: {
        label:
          'Health Worker Assistance',

        description:
          'Request a BHW visit, health check, or basic health assistance.',
      },

      roadObstruction: {
        label:
          'Blocked Road / Obstruction',

        description:
          'Tree, debris, vehicle, or object is blocking a road or pathway.',
      },

      damagedFacility: {
        label:
          'Damaged Public Facility',

        description:
          'Damaged streetlight, road, drainage, or barangay facility.',
      },

      cleanup: {
        label:
          'Community Clean-Up',

        description:
          'Waste, branches, or scattered debris needs barangay clean-up.',
      },

      community: {
        label:
          'Community Concern',

        description:
          'Sanitation, noise, stray animals, or other neighborhood concerns.',
      },

      other: {
        label:
          'Other Barangay Assistance',

        description:
          'Request barangay help that does not fit the categories above.',
      },
    },
  },

  // ============ TRACK REPORTS ============
  track: {
    title:
      'Track Reports',

    subtitle:
      'View and monitor your submitted reports.',

    searchPlaceholder:
      'Search report ID or concern...',

    all:
      'All',

    emergency:
      'Emergency',

    nonEmergency:
      'Non-Emergency',

    active:
      'Active',

    resolved:
      'Resolved',

    reportId:
      'Report ID',

    type:
      'Type',

    concern:
      'Concern',

    location:
      'Location',

    status:
      'Status',

    date:
      'Date',

    latestUpdate:
      'Latest Update',

    noReports:
      'No reports found.',

    trySearch:
      'Try changing your search or report filter.',

    reportFound:
      '{{count}} report found',

    reportsFound:
      '{{count}} reports found',
  },

  // ============ REPORT DETAIL ============
  reportDetail: {
    title:
      'Report Details',

    back:
      'Back to Track',

    notFound:
      'Report not found',

    notFoundMessage:
      'The report you are looking for does not exist.',

    viewReports:
      'View My Reports',

    currentStatus:
      'Current Status',

    latestUpdate:
      'Latest Update',

    resolutionRemarks:
      'Resolution Remarks',

    progress:
      'Report Progress',

    assignedPersonnel:
      'Assigned Personnel',

    assignedToReport:
      'Assigned to this report',

    noPersonnel:
      'No personnel has been assigned yet.',

    incidentLocation:
      'Incident Location',

    landmark:
      'Landmark',

    reportInformation:
      'Report Information',

    barangayRemarks:
      'Barangay Remarks',

    noRemarks:
      'No barangay remarks available yet.',

    invalidTitle:
      'Report Marked Invalid',

    invalidReason:
      'Reason',

    reportType:
      'Report Type',

    concernType:
      'Concern Type',

    subcategory:
      'Subcategory',

    submitted:
      'Submitted',

    updated:
      'Updated',

    reportingFor:
      'Reporting For',

    description:
      'Description',

    noDescription:
      'No description provided.',

    assistanceNeeded:
      'Assistance Needed',

    victimInformation:
      'Victim Information',

    affectedIndividuals:
      'Affected Individuals',

    name:
      'Name',

    contact:
      'Contact',

    waitingUpdate:
      'Waiting for update',

    priority:
      '{{priority}} Priority',
  },

  // ============ CONTACTS ============
  contacts: {
    title:
      'Emergency Contacts',

    subtitle:
      'Barangay contacts, emergency services, and important locations.',

    barangayHotline:
      'Barangay Hotline',

    callBarangayHotline:
      'Call Barangay Hotline',

    officials:
      'Barangay Officials & Personnel',

    officialsDescription:
      'Captain, Kagawads, SK, Secretary, Treasurer and personnel',

    contactDirectory:
      'Contact Directory',

    tapCardCall:
      'Tap a card to call',

    emergencyLocations:
      'Emergency Locations',

    emergencyLocationsHint:
      'Barangay and nearby emergency facilities.',

    selectLocation:
      'Select a location',

    selectLocationHint:
      'Tap one of the locations below.',

    mapLater:
      'Map integration will be connected later.',

    lguServices:
      'LGU & Emergency Services',

    lguHint:
      'Tap a service to call.',

    fire:
      'Fire',

    police:
      'Police',

    medical:
      'Medical',

    rescue:
      'Rescue',
  },

  // ============ UPDATES ============
  updates: {
    title:
      'Updates',

    subtitle:
      'Barangay announcements, emergency alerts, and your report updates.',

    all:
      'All',

    alerts:
      'Alerts',

    announcements:
      'Announcements',

    myReports:
      'My Reports',

    criticalAlert:
      'Critical Alert',

    reportUpdate:
      'Report Update',

    announcement:
      'Announcement',

    update:
      'Update',

    expired:
      'Expired',

    until:
      'Until {{date}}',

    unread:
      'Unread',

    nothingHere:
      'Nothing here yet',

    noUpdates:
      'No updates to show.',

    openReport:
      'Open report {{id}}',
  },

  // ============ SAFETY TIPS ============
  safetyTips: {
    title:
      'Safety Tips',

    subtitle:
      'Preparedness and safety guides for emergencies and community concerns.',

    stayInformed:
      'Stay informed. Stay safe.',

    guideMessage:
      'These quick guides help you respond correctly to emergencies and community concerns covered by ResQNow.',

    emergencySafety:
      'Emergency Safety',

    communitySafety:
      'Community & Non-Emergency Safety',

    reminder:
      '{{count}} reminder',

    reminders:
      '{{count}} reminders',

    signalNote:
      'If an emergency report cannot be sent because of weak internet or mobile signal, use the Contacts page to call the barangay hotline directly.',
  },

  // ============ LOGIN ============
  login: {
    residentAccess:
      'Resident Access',

    welcomeBack:
      'Welcome back',

    signInMessage:
      'Sign in to access your ResQNow account.',

    emailAddress:
      'Email Address',

    emailPlaceholder:
      'you@example.com',

    password:
      'Password',

    rememberMe:
      'Remember me',

    forgotPassword:
      'Forgot password?',

    signIn:
      'Sign In',

    signingIn:
      'Signing in...',

    noAccount:
      "Don't have a resident account?",

    createOne:
      'Create one',

    emergencyResponder:
      'Emergency Responder?',

    responderDescription:
      'Use the responder portal to view assigned incidents and update response status.',

    responderAccess:
      'Responder Access',

    secureAccess:
      'Secure Resident Access',

    reporting:
      'Resident Emergency Reporting',

    heroTitle:
      'Fast help starts with the right information.',

    heroDescription:
      'Report emergencies, request barangay assistance, and track your submitted reports.',

    emailRequired:
      'Email is required',

    invalidEmail:
      'Please enter a valid email address',

    passwordRequired:
      'Password is required',

    wrongCredentials:
      'The email or password you entered is incorrect. Please try again.',

    showPassword:
      'Show password',

    hidePassword:
      'Hide password',
  },

  // ============ REGISTER ============
  register: {
    createAccount:
      'Create Account',

    registerMessage:
      'Register to start reporting concerns.',

    personalInformation:
      'Personal Information',

    fullName:
      'Full Name',

    contactNumber:
      'Contact Number',

    purok:
      'Purok',

    selectPurok:
      'Select Purok',

    address:
      'Address',

    accountCredentials:
      'Account Credentials',

    emailAddress:
      'Email Address',

    password:
      'Password',

    confirmPassword:
      'Confirm Password',

    householdInformation:
      'Household Information',

    householdCount:
      'Household Count',

    householdProfile:
      'Household Profile',

    seniorCitizen:
      'Senior Citizen',

    child:
      'Child',

    pwd:
      'PWD',

    pregnantPerson:
      'Pregnant Person',

    homeLocation:
      'Home Location',

    homeLocationPin:
      'Home location pin',

    mapLater:
      'Map integration will be connected later.',

    confirmInformation:
      'I confirm that the information I provided is true and correct. I understand that my account will be subject to barangay verification.',

    creating:
      'Creating Account...',

    secureRegistration:
      'Secure Registration',

    accountCreated:
      'Account Created',

    accountCreatedMessage:
      'Your resident account has been created and is now waiting for barangay verification.',

    pendingVerification:
      'Pending Verification',

    verificationNote:
      'Barangay personnel will review your information. You will receive an update once your account has been verified.',

    goToLogin:
      'Go to Login',

    fixFields:
      'Please fix the highlighted fields before continuing.',

    confirmInfoError:
      'Please confirm that your information is correct.',

    fullNameRequired:
      'Full name is required',

    nameTooShort:
      'Name is too short',

    contactRequired:
      'Contact number is required',

    invalidPhone:
      'Enter a valid PH mobile number (09XX XXX XXXX)',

    emailRequired:
      'Email is required',

    invalidEmail:
      'Please enter a valid email',

    addressRequired:
      'Address is required',

    purokRequired:
      'Please select your purok',

    passwordRequired:
      'Password is required',

    passwordLength:
      'At least 8 characters',

    passwordUppercase:
      'Needs an uppercase letter',

    passwordLowercase:
    'Needs a lowercase letter',

    passwordNumber:
      'Needs a number',

    passwordSpecial:
      'Needs a special character',

    confirmRequired:
      'Please confirm your password',

    passwordsDontMatch:
      'Passwords do not match',

    veryWeak:
      'Very Weak',

    weak:
      'Weak',

    fair:
      'Fair',

    good:
      'Good',

    strong:
      'Strong',

    veryStrong:
      'Very Strong',

    atLeast8:
      'At least 8 characters',

    uppercaseLetter:
      'Uppercase letter',

    lowercaseLetter:
    'Lowercase letter',  

    oneNumber:
      'One number',

    specialCharacter:
      'Special character',

    namePlaceholder:
      'Enter your complete name',

    phonePlaceholder:
      '09XX XXX XXXX',

    addressPlaceholder:
      'Street, Barangay, City',

    emailPlaceholder:
      'you@example.com',

    passwordPlaceholder:
      'Create a strong password',

    confirmPasswordPlaceholder:
      'Re-enter your password',

    householdPlaceholder:
      'Number of household members',

    showPassword:
      'Show password',

    hidePassword:
      'Hide password',
  },

  // ============ SETTINGS ============
  settings: {
    title:
      'Profile & Settings',

    subtitle:
      'Manage your resident information and account preferences.',

    resident:
      'Resident',

    verifiedResident:
      'Verified Resident',

    personalHousehold:
      'Personal & Household',

    personalHouseholdHint:
      'Profile, address and household information',

    residentInformation:
      'Resident Information',

    fullName:
      'Full Name',

    contactNumber:
      'Contact Number',

    email:
      'Email',

    address:
      'Address',

    purok:
      'Purok',

    homeLocation:
      'Home Location',

    savedHomeLocation:
      'Saved Home Location',

    mapLater:
      'Map pin integration will be connected later.',

    householdInformation:
      'Household Information',

    householdMembers:
      'Household Members',

    householdMembersHint:
      'Total people in your household',

    householdProfile:
      'Household Profile',

    seniorCitizen:
      'Senior Citizen',

    child:
      'Child',

    pwd:
      'PWD',

    pregnantPerson:
      'Pregnant Person',

    edit:
      'Edit',

    editProfile:
      'Edit profile',

    cancel:
      'Cancel',

    saveChanges:
      'Save Changes',

    profileUpdated:
      'Profile updated successfully.',

    fullNameRequired:
      'Full name is required.',

    invalidMobile:
      'Enter a valid 11-digit mobile number starting with 09.',

    invalidEmail:
      'Enter a valid email address.',

    addressRequired:
      'Address is required.',

    security:
      'Account & Security',

    securityHint:
      'Change your account password',

    currentPassword:
      'Current Password',

    newPassword:
      'New Password',

    confirmPassword:
      'Confirm New Password',

    showPasswords:
      'Show passwords',

    hidePasswords:
      'Hide passwords',

    passwordRequirements:
      'Password requirements',

    passwordRequirementsText:
  'At least 8 characters with uppercase and lowercase letters, a number, and a special character.',

currentPasswordRequired:
  'Enter your current password.',

newPasswordInvalid:
  'New password must be at least 8 characters and include uppercase and lowercase letters, a number, and a special character.',

    passwordMismatch:
      'New passwords do not match.',

    changePassword:
      'Change Password',

    passwordUpdated:
      'Password updated successfully.',

    preferences:
      'Preferences',

    preferencesHint:
      'Language and notification settings',

    language:
      'Language',

    languages: {
      en:
        'English',

      tl:
        'Tagalog',

      ilo:
        'Ilocano',

      ibg:
        'Ibanag (Ybanag)',
    },

    notifications:
      'Notifications',

    reportUpdates:
      'Report Updates',

    reportUpdatesHint:
      'Status and responder updates',

    announcements:
      'Announcements',

    announcementsHint:
      'Barangay news and advisories',

    emergencyAlerts:
      'Emergency Alerts',

    emergencyAlertsHint:
      'Critical safety and evacuation alerts',

    savePreferences:
      'Save Preferences',

    preferencesSaved:
      'Preferences saved.',

    privacy:
      'Privacy & Data',

    privacyHint:
      'How your resident information is used',

    residentDataPrivacy:
      'Resident Data Privacy',

    privacyMessage:
      'Your personal information is used to identify your account, verify reports, contact you when necessary, and help barangay personnel respond to requests and emergencies.',

    privacyDetails:
      'Report information such as your name, contact number, location, and submitted details may be shared with authorized barangay or emergency personnel when needed for response and coordination.',

    signOut:
      'Sign Out',

    residentId:
      'Resident ID',

    notAvailable:
      'Not available',

    notProvided:
      'Not provided',

    decreaseHousehold:
      'Decrease household count',

    increaseHousehold:
      'Increase household count',
  },

  // ============ REPORT STATUS ============
  status: {
    submitted:
      'Submitted',

    pendingVerification:
      'Pending Verification',

    verified:
      'Verified',

    assigned:
      'Assigned',

    inProgress:
      'In Progress',

    respondersEnRoute:
      'Responders En Route',

    responded:
      'Responded',

    resolved:
      'Resolved',

    invalid:
      'Invalid',
  },

  // ============ PRIORITY ============
  priority: {
    critical:
      'Critical',

    high:
      'High',

    medium:
      'Medium',

    low:
      'Low',
  },

  // ============ REPORT TYPE ============
  reportType: {
    emergency:
      'Emergency',

    nonEmergency:
      'Non-Emergency',
  },
};

export default en;