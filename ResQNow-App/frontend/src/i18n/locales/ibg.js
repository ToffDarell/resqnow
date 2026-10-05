// src/i18n/locales/ibg.js

const ibg = {
  // ============ COMMON ============
  common: {
    home: 'Home',
    track: 'Subaybayan',
    report: 'Mag-report',
    safety: 'Katalgedan',
    contacts: 'Dagun nga Contact',
    updates: 'Dagun nga Update',
    save: 'I-save',
    cancel: 'Kanselaan',
    close: 'Isarra',
    edit: 'I-edit',
    back: 'Mappasib',
    call: 'Tawagan',
    callNow: 'Tawagan Simmu',
    optional: 'Optional',
    required: 'Mawag',
    yes: "Tabbi'",
    no: 'Ari',
    submit: 'I-submit',
    confirm: 'Kumpirmaan',
    loading: 'Naglo-load...',
    viewAll: 'Tannan ngamin',
    search: 'Magbiruk',
    resident: 'Residenti',
    notProvided: 'Awan tu naited',
  },

  // ============ NAVIGATION ============
  nav: {
    home: 'Home',
    track: 'Subaybayan',
    report: 'Mag-report',
    safety: 'Katalgedan',
    contacts: 'Dagun nga Contact',
    updates: 'Dagun nga Update',
    submitReport: 'Mag-submit tu Report',
    profileSettings: 'Profile anna Settings',
  },

  // ============ DASHBOARD ============
  dashboard: {
    goodMorning: 'Mapia nga mataruk',
    goodAfternoon: 'Mapia nga fugak',
    goodEvening: 'Mapia nga gabi',
    importantUpdates: 'Mapateg nga Dagun nga Update',
    myReports: 'Dagun nga Report Ku',
    latestReport: 'Audian nga Report',
    active: 'Aktibo',
    pending: 'Nakkaur-uray',
    resolved: 'Naresolve',
    viewAll: 'Tannan ngamin',
    criticalAlert: 'Kritikal nga Alerto',
    alert: 'Alerto',
    reportUpdate: 'Update ta Report',
    announcement: 'Anunsyo',
    latestUpdate: 'Audian nga Update',
    featuredSafetyGuide: 'Mapateg nga Gabay ta Katalgedan',
    floodSafety: 'Katalgedan ta Layos',
    safetyPreparedness: 'Paghahanda ta Katalgedan',
    emergencyContacts: 'Dagun nga Emergency Contact',
  },

  // ============ SUBMIT REPORT ============
  submitChoice: {
    title: 'Mag-submit tu Report',
    subtitle:
      'Pilien y uri na report nga mabagay ta situwasyon mu.',
    emergencyTitle: 'Emergency',
    urgent: 'Urgente',
    emergencyDescription:
      'Para ta dagus nga peligro, afi, layos, dunor, rescue, onu dagus nga paglikas.',
    quickFlow: 'Mapaspas nga proseso na pag-report',
    nonEmergencyTitle: 'Non-Emergency',
    nonEmergencyDescription:
      'Para ta pakakaga ta barangay nga kagina na nasira nga pasilidad, harang, anna request tu tulung.',
    moreDetails:
      'Mabalin nga mawag tu karumanan nga detalye',
    notSure:
      'Ari sigurado nu anni y pilien?',
    emergencyHint:
      'Usan y Emergency nu mawag tu dagus nga tulung.',
    nonEmergencyHint:
      'Usan y Non-Emergency para ta pakakaga nga mabalin nga usisaan na barangay personnel.',
    signalNote:
      'Nu akapoy y internet onu mobile signal ta oras na emergency, usan y Contacts page tapenu tawagan y barangay hotline nga derekta.',
  },

  // ============ EMERGENCY REPORT ============
  emergency: {
    title: 'Emergency Report',
    question: 'Anni y emergency?',
    locationQuestion: 'Sitaw y emergency?',
    currentLocationHint:
      'Usan naw y simmu nga lokasyon mu.',
    otherLocationHint:
      'Mabalin nga ari ta lokasyon mu y emergency. Iset nu sitaw mattageno.',
    useCurrentLocation:
      'Usan y Simmu nga Lokasyon',
    locating:
      'Magkuha tu lokasyon...',
    atCurrentLocation:
      'Y emergency ay ta simmu nga lokasyon ku',
    manualLocation:
      'Ipasok y lokasyon nga manwal',
    somewhereElse:
      'Y emergency ay ta tanakwan nga lugar',
    useCurrentInstead:
      'Usan y simmu nga lokasyon ku',
    manualLocationPlaceholder:
      'I-type y lokasyon onu landmark',
    victimLocationPlaceholder:
      'Sitaw y biktima?',
    reportingForOther:
      'Mag-report para ta tanakwan?',
    reportingForOtherHint:
      'I-tap nu y emergency ay para ta tanakwan nga tolay.',
    addVictimDetails:
      'Inayon y detalye na biktima ta baba.',
    victimName:
      'Nagan na Biktima',
    victimContact:
      'Contact na Biktima',
    unknownName:
      'Ari ku ammu y nagan',
    reporterInfo:
      'Y nagan, contact, anna purok mu ay awtomatiko nga mairaman.',
    optionalDetails:
      'Optional nga Detalye',
    optionalDetailsHint:
      'Landmark anna abbag nga deskripsyon',
    nearbyLandmark:
      'Asiddug nga Landmark',
    nearbyLandmarkPlaceholder:
      'Alimbawa: Asiddug ta covered court',
    shortDescription:
      'Abbag nga Deskripsyon',
    shortDescriptionPlaceholder:
      'Abbagan nga ilarawan y mattageno...',
    weakSignal:
      'Akapoy nga signal?',
    weakSignalMessage:
      'Tawagan y hotline nga derekta.',
    viewContacts:
      'Tannan dagun nga Contact',
    send:
      'Ipadala y Emergency Report',
    confirmTitle:
      'Kumpirmaan y Emergency Report',
    confirmMessage:
      'Ipadala simmu? Y nagan, contact number, address, anna lokasyon mu ay maipadala ta barangay personnel.',
    sendNow:
      'Ipadala Simmu',
    sending:
      'Magpadala...',
    type:
      'Uri',
    contact:
      'Contact',
    victim:
      'Biktima',
    selectTypeError:
      'Mamili tu uri na emergency.',
    locationError:
      'Iset y lokasyon tapenu ammu na responders y papanan da.',
    gpsError:
      'Ari nakwa y simmu nga lokasyon mu. Ipasok y lokasyon nga manwal.',
    submittedTitle:
      'Naisumite ngana y Emergency Report',
    submittedMessage:
      'Y emergency report mu ay nattanggap ngana anna nakahanda para ta tugon na barangay.',
    reportId:
      'Report ID',
    reporter:
      'Nag-report',
    location:
      'Lokasyon',
    for:
      'Para ta',
    status:
      'Status',
    backHome:
      'Mappasib ta Home',
    submitAnother:
      'Mag-submit tu Tanakwan nga Report',

    categories: {
      lifeDeath: {
        label: 'Peggad ta Biag',
        description:
          'Adda tolay nga dagus a mapeggad y biag na.',
      },

      fire: {
        label: 'Emergency ta Afi',
        description:
          'Aktibo nga afi, makapal nga asuk, onu dagus nga peligro ta afi.',
      },

      medical: {
        label: 'Medical Emergency',
        description:
          'Malubha nga dunor, sakit, onu dagus nga medikal nga tulung.',
      },

      violence: {
        label: 'Karahasan / Peggad ta Katalgedan',
        description:
          'Karahasan, pamutbuteng, onu dagus nga peligro nga naggafu ta tanakwan.',
      },

      flood: {
        label: 'Flood Rescue',
        description:
          'Dagus nga rescue onu tulung gapu ta layos.',
      },

      accident: {
        label: 'Aksidente ta Dalan',
        description:
          'Banggaan na sasakyan onu malubha nga aksidente ta dalan.',
      },

      evacuation: {
        label: 'Dagus nga Paglikas',
        description:
          'Mawag y dagus nga tulung tapenu makalikas nga natalged.',
      },
    },
  },

  // ============ NON-EMERGENCY REPORT ============
  nonEmergency: {
    title: 'Non-Emergency Report',
    subtitle:
      'Mag-report ta pakakaga ta barangay onu umawag tu tulung.',
    reportingFor:
      'Para kani yaw nga report?',
    reportingForHint:
      'Ibagam nu sinni y mabalin nga mawag tu tulung na barangay.',
    myself: 'Siak laman',
    anotherPerson: 'Tanakwan nga Toley',
    name: 'Nagan',
    contactNumber: 'Contact Number',
    relationship: 'Relasyon / Nota',
    ifKnown: 'Nu ammumu',
    optionalPlaceholder: 'Optional',
    exampleNeighbor: 'Alimbawa: Karruba',
    concernQuestion: 'Anni y pakakagamu?',
    concernInstruction:
      'Pilien y kategorya nga mabagay ta report mu.',
    specifyConcern: 'Tukuyan y pakakaga',
    optional: 'optional',
    evacuationWarning:
      'Tadday ka ta peligro simmu? Usan y Emergency Report → Urgent Evacuation.',
    incidentLocation: 'Lokasyon na Insidente',
    setIncidentLocation:
      'Iset nu sitaw mattukduan y pakakaga',
    purok: 'Purok',
    addressLocation: 'Address / Lokasyon na Insidente',
    addressPlaceholder:
      'Ipasok y lokasyon na pakakaga',
    nearbyLandmark: 'Asiddug nga Landmark',
    landmarkPlaceholder:
      'Alimbawa: Asiddug ta elementary school',
    pinIncidentLocation:
      'I-pin y Lokasyon na Insidente',
    mapLater:
      'Y map pin integration ay makonekta inton dumattal.',
    sampleCoordinates:
      'Sample coordinates: {{coordinates}}',
    reportDetails:
      'Dagun nga Detalye na Report',
    reportDetailsHint:
      'Mangiyawa tu hustu nga impormasyon tapenu masurian na barangay personnel y pakakaga.',
    description: 'Deskripsyon',
    descriptionPlaceholder:
      'Abbagan nga ilarawan y pakakaga...',
    assistanceNeeded: 'Mawag nga Tulung',
    assistancePlaceholder:
      'Alimbawa: Clean-up crew, transportasyon, repair...',
    affectedIndividuals:
      'Dagun nga Toley nga Naapektaran',
    affectedHint:
      'Pilien ngamin nga mamappat. Optional.',

    affected: {
      child: 'Abing',
      seniorCitizen: 'Senior Citizen',
      pwd: 'PWD',
      pregnantPerson: 'Masikog',
      injuredPerson: 'Nadunor nga Toley',
    },

    photoEvidence: 'Ladawan nga Ebidensya',
    photoOptional: 'Optional laman.',
    addPhoto: 'Magayon tu Ladawan',
    photoType: 'JPG onu PNG',
    removePhoto: 'Ikkat y ladawan',
    reporterInfo:
      'Y nagan, contact number, address, anna purok mu ay awtomatiko nga mairaman ta report.',
    reviewReport: 'Usisaan y Report',
    pendingNotice:
      'Dagun nga non-emergency report ay magiru nga Pending Verification.',
    confirmTitle: 'Kumpirmaan y Report',
    confirmHint:
      'Usisaan y mapateg nga detalye sakbay nga i-submit.',
    concernType: 'Uri na Pakakaga',
    reportingForLabel: 'Report Para ta',
    person: 'Toley',
    location: 'Lokasyon',
    descriptionLabel: 'Deskripsyon',
    status: 'Status',
    goBack: 'Mappasib',
    confirmSubmit: 'Kumpirmaan anna I-submit',
    submitting: 'Mag-submit...',
    selectTypeError:
      'Mamili tu uri na pakakaga.',
    locationError:
      'Mangiyawa tu lokasyon na insidente.',
    descriptionError:
      'Mangiyawa tu abbag nga deskripsyon na pakakaga.',
    submittedTitle: 'Naisumite ngana y Report',
    submittedMessage:
      'Y pakakagamu ay naisumite ngana anna magur-uray tu beripikasyon na barangay.',
    reportId: 'Report ID',
    reporter: 'Nag-report',
    viewReports: 'Tannan dagun nga Report Ku',
    backHome: 'Mappasib ta Home',

    categories: {
      evacuation: {
        label: 'Tulung ta Paglikas',
        description:
          'Ari dagus nga tulung ta paghahanda onu papan ta evacuation center.',
      },

      healthWorker: {
        label: 'Tulung na Health Worker',
        description:
          'Umawag tu BHW visit, health check, onu basic health assistance.',
      },

      roadObstruction: {
        label: 'Nakabara nga Dalan',
        description:
          'Kayo, debris, sasakyan, onu bagay nga nakabara ta dalan.',
      },

      damagedFacility: {
        label: 'Nasira nga Pampublikong Pasilidad',
        description:
          'Nasira nga streetlight, dalan, drainage, onu barangay facility.',
      },

      cleanup: {
        label: 'Community Clean-Up',
        description:
          'Basura, sanga, onu debris nga mawag tu barangay clean-up.',
      },

      community: {
        label: 'Pakakaga ta Komunidad',
        description:
          'Sanitation, noise, stray animals, onu tanakwan nga pakakaga ta komunidad.',
      },

      other: {
        label: 'Tanakwan nga Tulung na Barangay',
        description:
          'Umawag tu tulung nga ari mairaman ta tanakwan nga kategorya.',
      },
    },
  },

  // ============ TRACK REPORTS ============
  track: {
    title: 'Subaybayan Dagun nga Report',
    subtitle:
      'Tannan anna subaybayan y naisumite nga report.',
    searchPlaceholder:
      'Magbiruk tu report ID onu pakakaga...',
    all: 'Ngamin',
    emergency: 'Emergency',
    nonEmergency: 'Non-Emergency',
    active: 'Aktibo',
    resolved: 'Naresolve',
    reportId: 'Report ID',
    type: 'Uri',
    concern: 'Pakakaga',
    location: 'Lokasyon',
    status: 'Status',
    date: 'Petsa',
    latestUpdate: 'Audian nga Update',
    noReports: 'Awan tu nabirukan nga report.',
    trySearch:
      'Padasan nga baliwan y pagbiruk onu report filter.',
    reportFound: '{{count}} nga report y nabirukan',
    reportsFound: '{{count}} nga report y nabirukan',
  },

  // ============ REPORT DETAIL ============
  reportDetail: {
    title: 'Dagun nga Detalye na Report',
    back: 'Mappasib ta Track',
    notFound: 'Ari nabirukan y report',
    notFoundMessage:
      'Awan y report nga birukan mu.',
    viewReports: 'Tannan Dagun nga Report Ku',
    currentStatus: 'Simmu nga Status',
    latestUpdate: 'Audian nga Update',
    resolutionRemarks: 'Resolution Remarks',
    progress: 'Progreso na Report',
    assignedPersonnel: 'Nakattalaga nga Personnel',
    assignedToReport: 'Nakattalaga ta yaw nga report',
    noPersonnel: 'Awan paga nakattalaga nga personnel.',
    incidentLocation: 'Lokasyon na Insidente',
    landmark: 'Landmark',
    reportInformation: 'Impormasyon na Report',
    barangayRemarks: 'Remarks na Barangay',
    noRemarks: 'Awan paga remarks na barangay.',
    invalidTitle: 'Namarkaan nga Invalid y Report',
    invalidReason: 'Rason',
    reportType: 'Uri na Report',
    concernType: 'Uri na Pakakaga',
    subcategory: 'Subcategory',
    submitted: 'Naisumite',
    updated: 'Na-update',
    reportingFor: 'Report Para ta',
    description: 'Deskripsyon',
    noDescription: 'Awan tu naited nga deskripsyon.',
    assistanceNeeded: 'Mawag nga Tulung',
    victimInformation: 'Impormasyon na Biktima',
    affectedIndividuals: 'Dagun nga Naapektaran nga Toley',
    name: 'Nagan',
    contact: 'Contact',
    waitingUpdate: 'Magur-uray tu update',
    priority: '{{priority}} Priority',
  },

  // ============ CONTACTS ============
  contacts: {
    title: 'Dagun nga Emergency Contact',
    subtitle:
      'Dagun nga contact na barangay, emergency services, anna mapateg nga lokasyon.',
    barangayHotline: 'Barangay Hotline',
    callBarangayHotline:
      'Tawagan y Barangay Hotline',
    officials:
      'Dagun nga Opisyal anna Personnel na Barangay',
    officialsDescription:
      'Captain, Kagawads, SK, Secretary, Treasurer anna personnel',
    contactDirectory: 'Direktoryo na Contact',
    tapCardCall: 'I-tap y card tapenu tawagan',
    emergencyLocations:
      'Dagun nga Emergency Location',
    emergencyLocationsHint:
      'Barangay anna asiddug nga emergency facilities.',
    selectLocation: 'Mamili tu lokasyon',
    selectLocationHint:
      'I-tap y tadday ta dagun nga lokasyon ta baba.',
    mapLater:
      'Y map integration ay makonekta inton dumattal.',
    lguServices:
      'LGU anna Emergency Services',
    lguHint:
      'I-tap y serbisyo tapenu tawagan.',
    fire: 'Afi',
    police: 'Police',
    medical: 'Medical',
    rescue: 'Rescue',
  },

  // ============ UPDATES ============
  updates: {
    title: 'Dagun nga Update',
    subtitle:
      'Dagun nga anunsyo na barangay, emergency alert, anna update ta report.',
    all: 'Ngamin',
    alerts: 'Dagun nga Alerto',
    announcements: 'Dagun nga Anunsyo',
    myReports: 'Dagun nga Report Ku',
    criticalAlert: 'Kritikal nga Alerto',
    reportUpdate: 'Update ta Report',
    announcement: 'Anunsyo',
    update: 'Update',
    expired: 'Nag-expire',
    until: 'Anggana {{date}}',
    unread: 'Ari paga nabasa',
    nothingHere: 'Awan paga tatun',
    noUpdates: 'Awan tu update nga maipasingan.',
    openReport: 'Luktan y report {{id}}',
  },

  // ============ SAFETY TIPS ============
  safetyTips: {
    title: 'Dagun nga Gabay ta Katalgedan',
    subtitle:
      'Dagun nga gabay ta paghahanda anna katalgedan para ta emergency anna pakakaga ta komunidad.',
    stayInformed:
      'Matalupaddian nga adda pakannammu. Mattalinaed nga natalged.',
    guideMessage:
      'Daguyaw nga gabay ay tumulung ta ustu nga pagtugon ta emergency anna pakakaga ta komunidad nga sakupon na ResQNow.',
    emergencySafety:
      'Katalgedan ta Emergency',
    communitySafety:
      'Katalgedan ta Komunidad anna Non-Emergency',
    reminder:
      '{{count}} nga pakalagi',
    reminders:
      '{{count}} nga pakalagian',
    signalNote:
      'Nu ari makapadala y emergency report gapu ta akapoy nga internet onu mobile signal, usan y Contacts page tapenu tawagan y barangay hotline nga derekta.',
  },

  // ============ LOGIN ============
  login: {
    residentAccess: 'Akses na Residenti',
    welcomeBack: 'Mapia nga pappasib',
    signInMessage:
      'Mag-sign in tapenu ma-access y ResQNow account mu.',
    emailAddress: 'Email Address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    rememberMe: 'Laggiantam',
    forgotPassword: 'Nalingngatan y password?',
    signIn: 'Mag-sign In',
    signingIn: 'Mag-sign in...',
    noAccount: 'Awan tu resident account?',
    createOne: 'Mangngua tu account',
    emergencyResponder: 'Emergency Responder?',
    responderDescription:
      'Usan y responder portal tapenu matannan y naka-assign nga insidente anna ma-update y response status.',
    responderAccess: 'Akses na Responder',
    secureAccess: 'Natalged nga Akses na Residenti',
    reporting: 'Pag-report tu Emergency na Residenti',
    heroTitle:
      'Y mapaspas nga tulung ay magiru ta ustu nga impormasyon.',
    heroDescription:
      'Mag-report tu emergency, umawag tu tulung ta barangay, anna subaybayan y report.',
    emailRequired: 'Mawag y email',
    invalidEmail: 'Mangiyawa tu valid nga email address',
    passwordRequired: 'Mawag y password',
    wrongCredentials:
      'Y email onu password nga inyeg mu ay mali. Padasan uli.',
    showPassword: 'Ipasingan y password',
    hidePassword: 'Ilemmeng y password',
  },

  // ============ REGISTER ============
  register: {
    createAccount: 'Mangngua tu Account',
    registerMessage:
      'Magrehistro tapenu magiru nga mag-report tu pakakaga.',
    personalInformation: 'Personal nga Impormasyon',
    fullName: 'Nagan',
    contactNumber: 'Contact Number',
    purok: 'Purok',
    selectPurok: 'Mamili tu Purok',
    address: 'Address',
    accountCredentials: 'Dagun nga Kredensyal na Account',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Kumpirmaan y Password',
    householdInformation: 'Impormasyon na Sangakattulan',
    householdCount: 'Bilang na Sangakattulan',
    householdProfile: 'Profile na Sangakattulan',
    seniorCitizen: 'Senior Citizen',
    child: 'Abing',
    pwd: 'PWD',
    pregnantPerson: 'Masikog',
    homeLocation: 'Lokasyon na Balay',
    homeLocationPin: 'Home location pin',
    mapLater:
      'Y map integration ay makonekta inton dumattal.',
    confirmInformation:
      'Kukumpirmaan ku nga y impormasyon nga iniyao ku ay tuttu anna hustu. Naawatan ku nga y account ku ay masaillalum ta beripikasyon na barangay.',
    creating: 'Mangngua tu Account...',
    secureRegistration: 'Natalged nga Pagrehistro',
    accountCreated: 'Nangngua ngana y Account',
    accountCreatedMessage:
      'Y resident account mu ay nangngua ngana anna magur-uray ta beripikasyon na barangay.',
    pendingVerification: 'Pending Verification',
    verificationNote:
      'Usisaan na barangay personnel y impormasyon mu. Makawat ka tu update nu na-verify ngana y account mu.',
    goToLogin: 'Mappasib ta Login',
    fixFields:
      'Paki-ayos y naka-highlight nga field sakbay nga magtuloy.',
    confirmInfoError:
      'Paki-kumpirma nga hustu y impormasyon mu.',
    fullNameRequired: 'Mawag y nagan',
    nameTooShort: 'Abbag y nagan',
    contactRequired: 'Mawag y contact number',
    invalidPhone:
      'Mangiyawa tu valid nga PH mobile number (09XX XXX XXXX)',
    emailRequired: 'Mawag y email',
    invalidEmail: 'Mangiyawa tu valid nga email',
    addressRequired: 'Mawag y address',
    purokRequired: 'Mamili tu purok',
    passwordRequired: 'Mawag y password',
    passwordLength: 'Ari kumurang ta 8 nga karakter',
    passwordUppercase: 'Mawag tu dakal nga letra',
    passwordLowercase:  'Mawag tu abbag nga letra',
    passwordNumber: 'Mawag tu numero',
    passwordSpecial: 'Mawag tu espesyal nga karakter',
    confirmRequired: 'Kumpirmaan y password',
    passwordsDontMatch: 'Ari magkakaparehas y password',
    veryWeak: 'Akapoy nga Akapoy',
    weak: 'Akapoy',
    fair: 'Hustu',
    good: 'Mapia',
    strong: 'Mapigsa',
    veryStrong: 'Mapigsa nga Mapigsa',
    atLeast8: 'Ari kumurang ta 8 nga karakter',
    uppercaseLetter: 'Dakal nga letra',
    lowercaseLetter: 'Abbag nga letra',
    oneNumber: 'Tadday nga numero',
    specialCharacter: 'Espesyal nga karakter',
    namePlaceholder: 'Ipasok y nagan',
    phonePlaceholder: '09XX XXX XXXX',
    addressPlaceholder: 'Street, Barangay, City',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: 'Mangngua tu mapigsa nga password',
    confirmPasswordPlaceholder: 'Ipasok uli y password',
    householdPlaceholder:
      'Bilang na memyembro na sangakattulan',
    showPassword: 'Ipasingan y password',
    hidePassword: 'Ilemmeng y password',
  },

  // ============ SETTINGS ============
  settings: {
    title: 'Profile anna Settings',
    subtitle:
      'Pamahalaan y impormasyon mu bilang residenti anna dagun nga kagustuan ta account.',
    resident: 'Residenti',
    verifiedResident: 'Naberipika nga Residenti',
    personalHousehold: 'Personal anna Sangakattulan',
    personalHouseholdHint:
      'Profile, address, anna impormasyon na sangakattulan',
    residentInformation: 'Impormasyon na Residenti',
    fullName: 'Nagan',
    contactNumber: 'Contact Number',
    email: 'Email',
    address: 'Address',
    purok: 'Purok',
    homeLocation: 'Lokasyon na Balay',
    savedHomeLocation: 'Nasimpa nga Lokasyon na Balay',
    mapLater:
      'Y map pin integration ay makonekta inton dumattal.',
    householdInformation: 'Impormasyon na Sangakattulan',
    householdMembers: 'Dagun nga Memyembro na Sangakattulan',
    householdMembersHint:
      'Kabuuan nga bilang na tolay ta sangakattulan',
    householdProfile: 'Profile na Sangakattulan',
    seniorCitizen: 'Senior Citizen',
    child: 'Abing',
    pwd: 'PWD',
    pregnantPerson: 'Masikog',
    edit: 'I-edit',
    editProfile: 'I-edit y profile',
    cancel: 'Kanselaan',
    saveChanges: 'I-save dagun nga Pinagbaliwan',
    profileUpdated: 'Na-update y profile.',
    fullNameRequired: 'Mawag y nagan.',
    invalidMobile:
      'Mangiyawa tu valid nga 11-digit mobile number nga magiru ta 09.',
    invalidEmail: 'Mangiyawa tu valid nga email address.',
    addressRequired: 'Mawag y address.',
    security: 'Account anna Seguridad',
    securityHint: 'Baliwan y password na account mu',
    currentPassword: 'Simmu nga Password',
    newPassword: 'Bagu nga Password',
    confirmPassword: 'Kumpirmaan y Bagu nga Password',
    showPasswords: 'Ipasingan dagun nga password',
    hidePasswords: 'Ilemmeng dagun nga password',
    passwordRequirements: 'Dagun nga kinakailangan na password',
    passwordRequirementsText: 'Ari kumurang ta 8 nga karakter nga adda tu dakal nga letra, numero, anna espesyal nga karakter.',
    currentPasswordRequired: 'Ipasok y simmu nga password.',
    newPasswordInvalid: 'Y bagu nga password ay mawag tu 8 nga karakter, dakal nga letra, numero, anna espesyal nga karakter.',
    passwordMismatch: 'Ari magkakaparehas y bagu nga password.',
    changePassword: 'Baliwan y Password',
    passwordUpdated: 'Nabaliwan ngana y password.',
    preferences: 'Dagun nga Kagustuan',
    preferencesHint: 'Pagsasao anna notification settings',
    language: 'Pagsasao',

    languages: {
      en: 'English',
      tl: 'Tagalog',
      ilo: 'Ilocano',
      ibg: 'Ibanag (Ybanag)',
    },

    notifications: 'Dagun nga Notifikasyon',
    reportUpdates: 'Dagun nga Update ta Report',
    reportUpdatesHint: 'Status anna responder updates',
    announcements: 'Dagun nga Anunsyo',
    announcementsHint:
      'Dagun nga balita anna advisories nga naggafu ta barangay',
    emergencyAlerts: 'Dagun nga Emergency Alert',
    emergencyAlertsHint:
      'Dagun nga kritikal nga safety anna evacuation alerts',
    savePreferences: 'I-save dagun nga Kagustuan',
    preferencesSaved: 'Naisave ngana dagun nga kagustuan.',
    privacy: 'Privacy anna Data',
    privacyHint:
      'Kunnasi maus-usar y impormasyon mu bilang residenti',
    residentDataPrivacy: 'Privacy na Data na Residenti',
    privacyMessage:
      'Y personal nga impormasyon mu ay mausar tapenu mabigbig y account mu, maverify y report, makontak ka nu mawag, anna matulungan y barangay personnel ta pagtugon ta request anna emergency.',
    privacyDetails:
      'Y impormasyon na report nga kagina na nagan, contact number, lokasyon, anna naisumite nga detalye ay mabalin nga maishare ta autorisado nga barangay onu emergency personnel nu mawag para ta response anna coordination.',
    signOut: 'Mag-sign Out',
    residentId: 'Resident ID',
    notAvailable: 'Ari available',
    notProvided: 'Awan tu naited',
    decreaseHousehold:
      'Bawasan y bilang na sangakattulan',
    increaseHousehold:
      'Dagdagan y bilang na sangakattulan',
  },

  // ============ REPORT STATUS ============
  status: {
    submitted: 'Naisumite',
    pendingVerification: 'Magur-uray tu Beripikasyon',
    verified: 'Naberipika',
    assigned: 'Nakattalaga',
    inProgress: 'Maproseso Simmu',
    respondersEnRoute: 'Mapan Dagun nga Responders',
    responded: 'Nakattabbag',
    resolved: 'Naresolve',
    invalid: 'Invalid',
  },

  // ============ PRIORITY ============
  priority: {
    critical: 'Kritikal',
    high: 'Mataas',
    medium: 'Katamtaman',
    low: 'Mababa',
  },

  // ============ REPORT TYPE ============
  reportType: {
    emergency: 'Emergency',
    nonEmergency: 'Non-Emergency',
  },
};

export default ibg;