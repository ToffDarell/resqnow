// src/i18n/locales/ilo.js

const ilo = {
  // ============ COMMON ============
  common: {
    home: 'Home',
    track: 'Subaybayan',
    report: 'Ag-report',
    safety: 'Katalgedan',
    contacts: 'Dagiti Contact',
    updates: 'Dagiti Update',
    save: 'I-save',
    cancel: 'Kanselaen',
    close: 'Iserra',
    edit: 'I-edit',
    back: 'Agsubli',
    call: 'Tumawag',
    callNow: 'Tumawag Itan',
    optional: 'Opsional',
    required: 'Masapul',
    yes: 'Wen',
    no: 'Saan',
    submit: 'Isumite',
    confirm: 'Kumpirmaen',
    loading: 'Aglo-load...',
    viewAll: 'Kitaen amin',
    search: 'Agbiruk',
    resident: 'Residente',
    notProvided: 'Awan ti naited',
  },

  // ============ NAVIGATION ============
  nav: {
    home: 'Home',
    track: 'Subaybayan',
    report: 'Ag-report',
    safety: 'Katalgedan',
    contacts: 'Dagiti Contact',
    updates: 'Dagiti Update',
    submitReport: 'Isumite ti Report',
    profileSettings: 'Profile ken Settings',
  },

  // ============ DASHBOARD ============
  dashboard: {
    goodMorning: 'Naimbag a bigat',
    goodAfternoon: 'Naimbag a malem',
    goodEvening: 'Naimbag a rabii',

    importantUpdates: 'Napateg a Dagiti Update',
    myReports: 'Dagiti Report Ko',
    latestReport: 'Kaudian a Report',

    active: 'Aktibo',
    pending: 'Agur-uray',
    resolved: 'Naresolbar',

    viewAll: 'Kitaen amin',

    criticalAlert: 'Kritikal nga Alerto',
    alert: 'Alerto',
    reportUpdate: 'Update ti Report',
    announcement: 'Anunsio',

    latestUpdate: 'Kaudian nga Update',
    featuredSafetyGuide: 'Napateg a Gabay ti Katalgedan',
    floodSafety: 'Katalgedan iti Layos',
    safetyPreparedness: 'Panagsagana iti Katalgedan',

    emergencyContacts: 'Dagiti Emergency Contact',
  },

  // ============ SUBMIT REPORT ============
  submitChoice: {
    title: 'Isumite ti Report',

    subtitle:
      'Pilien ti klase ti report a maitutop iti kasasaad.',

    emergencyTitle:
      'Emergency',

    urgent:
      'Naganat',

    emergencyDescription:
      'Para iti dagus a peggad, apuy, layos, pannakadangran, rescue, wenno naganat a panaglikas.',

    quickFlow:
      'Napardas a proseso ti panag-report',

    nonEmergencyTitle:
      'Non-Emergency',

    nonEmergencyDescription:
      'Para kadagiti pakaseknan ti barangay kas iti nadadael a pasilidad, nakabarra a dalan, ken panagkiddaw ti tulong.',

    moreDetails:
      'Mabalin a masapul ti kanayonan a detalye',

    notSure:
      'Saan ka a sigurado no ania ti piliem?',

    emergencyHint:
      'Pilien ti Emergency no masapul ti dagus a tulong.',

    nonEmergencyHint:
      'Pilien ti Non-Emergency para kadagiti pakaseknan a mabalin a kitaen ti barangay personnel.',

    signalNote:
      'No nakapsot ti internet wenno mobile signal iti emergency, usaren ti Contacts page tapno direkta a tawagan ti barangay hotline.',
  },

  // ============ EMERGENCY REPORT ============
  emergency: {
    title: 'Emergency Report',
    question: 'Ania ti emergency?',

    locationQuestion:
      'Sadino ti emergency?',

    currentLocationHint:
      'Usaren daytoy ti agdama a lokasion mo.',

    otherLocationHint:
      'Mabalin a saan nga adda iti lokasion mo ti emergency. Iset no sadino talaga a mapasamak.',

    useCurrentLocation:
      'Usaren ti Agdama a Lokasion',

    locating:
      'Agala ti lokasion...',

    atCurrentLocation:
      'Adda ti emergency iti agdama a lokasion ko',

    manualLocation:
      'Itype ti lokasion',

    somewhereElse:
      'Adda ti emergency iti sabali a lugar',

    useCurrentInstead:
      'Usaren laengen ti agdama a lokasion ko',

    manualLocationPlaceholder:
      'Itype ti lokasion wenno landmark',

    victimLocationPlaceholder:
      'Sadino ti ayan ti biktima?',

    reportingForOther:
      'Ag-report para iti sabali?',

    reportingForOtherHint:
      'I-tap no para iti sabali a tao ti emergency.',

    addVictimDetails:
      'Inayon dagiti detalye ti biktima iti baba.',

    victimName:
      'Nagan ti Biktima',

    victimContact:
      'Contact ti Biktima',

    unknownName:
      'Saan ko ammo ti nagan',

    reporterInfo:
      'Automatiko a mairaman ti nagan, contact, ken purok mo.',

    optionalDetails:
      'Opsional a Detalye',

    optionalDetailsHint:
      'Landmark ken ababa a deskripsion',

    nearbyLandmark:
      'Asideg a Landmark',

    nearbyLandmarkPlaceholder:
      'Kas pagarigan: Asideg iti covered court',

    shortDescription:
      'Ababa a Deskripsion',

    shortDescriptionPlaceholder:
      'Ababa nga iladawan no ania ti mapasamak...',

    weakSignal:
      'Nakapsot ti signal?',

    weakSignalMessage:
      'Direkta a tawagan ti hotline.',

    viewContacts:
      'Kitaen dagiti Contact',

    send:
      'Ipadala ti Emergency Report',

    confirmTitle:
      'Kumpirmaen ti Emergency Report',

    confirmMessage:
      'Ipadala itan? Maipadala iti barangay personnel ti nagan, contact number, address, ken lokasion mo.',

    sendNow:
      'Ipadala Itan',

    sending:
      'Agip-ipadala...',

    type:
      'Klase',

    contact:
      'Contact',

    victim:
      'Biktima',

    selectTypeError:
      'Pilien ti klase ti emergency.',

    locationError:
      'Iset ti lokasion tapno ammo dagiti responders no sadino ti papananda.',

    gpsError:
      'Saan a naala ti agdama a lokasion mo. Itype ti lokasion.',

    submittedTitle:
      'Naisumite ti Emergency Report',

    submittedMessage:
      'Naawat ti emergency report mo ken nakasagana para iti panagtignay ti barangay.',

    reportId:
      'Report ID',

    reporter:
      'Nag-report',

    location:
      'Lokasion',

    for:
      'Para iti',

    status:
      'Status',

    backHome:
      'Agsubli iti Home',

    submitAnother:
      'Agisumite Manen ti Report',

    categories: {
      lifeDeath: {
        label:
          'Peggad iti Biag',

        description:
          'Adda tao a dagus a mapeggad ti biagna.',
      },

      fire: {
        label:
          'Emergency iti Apuy',

        description:
          'Aktibo nga apuy, napuskol nga asuk, wenno dagus a peggad ti apuy.',
      },

      medical: {
        label:
          'Medical Emergency',

        description:
          'Nakaro a pannakadangran, sakit, wenno naganat a medikal a tulong.',
      },

      violence: {
        label:
          'Kinaranggas / Peggad iti Katalgedan',

        description:
          'Kinaranggas, pamutbuteng, wenno dagus a peggad manipud iti sabali a tao.',
      },

      flood: {
        label:
          'Flood Rescue',

        description:
          'Naganat a rescue wenno tulong gapu iti layos.',
      },

      accident: {
        label:
          'Aksidente iti Dalan',

        description:
          'Panagbangga ti lugan wenno nakaro nga aksidente iti dalan.',
      },

      evacuation: {
        label:
          'Naganat a Panaglikas',

        description:
          'Masapul ti dagus a tulong tapno natalged a makalikas.',
      },
    },
  },

  // ============ NON-EMERGENCY REPORT ============
  nonEmergency: {
    title: 'Non-Emergency Report',
    subtitle:
      'Ag-report ti pakaseknan ti barangay wenno agkiddaw ti tulong.',

    reportingFor:
      'Para iti sino daytoy a report?',

    reportingForHint:
      'Ibaga no sino ti mabalin a kasapulan ti tulong ti barangay.',

    myself:
      'Para kaniak',

    anotherPerson:
      'Sabali a Tao',

    name:
      'Nagan',

    contactNumber:
      'Contact Number',

    relationship:
      'Relasion / Nota',

    ifKnown:
      'No ammo',

    optionalPlaceholder:
      'Opsional',

    exampleNeighbor:
      'Kas pagarigan: Karruba',

    concernQuestion:
      'Ania ti pakaseknan mo?',

    concernInstruction:
      'Pilien ti kategoria a maitutop iti report.',

    specifyConcern:
      'Tukuyen ti pakaseknan',

    optional:
      'opsional',

    evacuationWarning:
      'Adda ka iti peggad itan? Usaren ti Emergency Report → Urgent Evacuation.',

    incidentLocation:
      'Lokasion ti Insidente',

    setIncidentLocation:
      'Iset no sadino ti ayan ti pakaseknan',

    purok:
      'Purok',

    addressLocation:
      'Address / Lokasion ti Insidente',

    addressPlaceholder:
      'Itype ti lokasion ti pakaseknan',

    nearbyLandmark:
      'Asideg a Landmark',

    landmarkPlaceholder:
      'Kas pagarigan: Asideg iti elementary school',

    pinIncidentLocation:
      'I-pin ti Lokasion ti Insidente',

    mapLater:
      'Maikonekta ti map pin integration inton sumaruno.',

    sampleCoordinates:
      'Sample coordinates: {{coordinates}}',

    reportDetails:
      'Dagiti Detalye ti Report',

    reportDetailsHint:
      'Mangted ti umdas nga impormasyon tapno masuri ti barangay personnel ti pakaseknan.',

    description:
      'Deskripsion',

    descriptionPlaceholder:
      'Ababa nga iladawan ti pakaseknan...',

    assistanceNeeded:
      'Kasapulan a Tulong',

    assistancePlaceholder:
      'Kas pagarigan: Clean-up crew, transportasion, repair...',

    affectedIndividuals:
      'Dagiti Naapektaran a Tao',

    affectedHint:
      'Pilien amin a maitutop. Opsional.',

    affected: {
      child: 'Ubing',
      seniorCitizen: 'Senior Citizen',
      pwd: 'PWD',
      pregnantPerson: 'Masikog',
      injuredPerson: 'Nadangran a Tao',
    },

    photoEvidence:
      'Ladawan nga Ebidensia',

    photoOptional:
      'Opsional laeng.',

    addPhoto:
      'Manginayon ti Ladawan',

    photoType:
      'JPG wenno PNG',

    removePhoto:
      'Ikkaten ti ladawan',

    reporterInfo:
      'Automatiko a mairaman iti report ti nagan, contact number, address, ken purok mo.',

    reviewReport:
      'Usisaen ti Report',

    pendingNotice:
      'Dagiti non-emergency report ket mangrugi a Pending Verification.',

    confirmTitle:
      'Kumpirmaen ti Report',

    confirmHint:
      'Usisaen dagiti napateg a detalye sakbay nga isumite.',

    concernType:
      'Klase ti Pakaseknan',

    reportingForLabel:
      'Report Para iti',

    person:
      'Tao',

    location:
      'Lokasion',

    descriptionLabel:
      'Deskripsion',

    status:
      'Status',

    goBack:
      'Agsubli',

    confirmSubmit:
      'Kumpirmaen ken Isumite',

    submitting:
      'Agis-isumite...',

    selectTypeError:
      'Pilien ti klase ti pakaseknan.',

    locationError:
      'Itype ti lokasion ti insidente.',

    descriptionError:
      'Manginayon ti ababa a deskripsion ti pakaseknan.',

    submittedTitle:
      'Naisumite ti Report',

    submittedMessage:
      'Naisumite ti pakaseknan mo ken agur-uray iti beripikasion ti barangay.',

    reportId:
      'Report ID',

    reporter:
      'Nag-report',

    viewReports:
      'Kitaen Dagiti Report Ko',

    backHome:
      'Agsubli iti Home',

    categories: {
      evacuation: {
        label: 'Tulong iti Panaglikas',
        description:
          'Saan a naganat a tulong iti panagsagana wenno papan iti evacuation center.',
      },

      healthWorker: {
        label: 'Tulong ti Health Worker',
        description:
          'Agkiddaw ti BHW visit, health check, wenno basic health assistance.',
      },

      roadObstruction: {
        label: 'Nakabarra a Dalan',
        description:
          'Kayo, debris, lugan, wenno banag a mangbarbar iti dalan.',
      },

      damagedFacility: {
        label: 'Nadadael a Publiko a Pasilidad',
        description:
          'Nadadael a streetlight, dalan, drainage, wenno barangay facility.',
      },

      cleanup: {
        label: 'Community Clean-Up',
        description:
          'Rugit, sanga, wenno debris a kasapulan ti barangay clean-up.',
      },

      community: {
        label: 'Pakaseknan ti Komunidad',
        description:
          'Sanitation, riribuk, stray animals, wenno sabali a pakaseknan ti komunidad.',
      },

      other: {
        label: 'Sabali a Tulong ti Barangay',
        description:
          'Agkiddaw ti tulong a saan a mairaman kadagiti sabali a kategoria.',
      },
    },
  },

  // ============ TRACK REPORTS ============
  track: {
    title: 'Subaybayan Dagiti Report',
    subtitle:
      'Kitaen ken subaybayan dagiti naisumite a report.',
    searchPlaceholder:
      'Agbiruk ti report ID wenno pakaseknan...',
    all: 'Amin',
    emergency: 'Emergency',
    nonEmergency: 'Non-Emergency',
    active: 'Aktibo',
    resolved: 'Naresolbar',
    reportId: 'Report ID',
    type: 'Klase',
    concern: 'Pakaseknan',
    location: 'Lokasion',
    status: 'Status',
    date: 'Petsa',
    latestUpdate: 'Kaudian nga Update',
    noReports: 'Awan ti nabirukan a report.',
    trySearch:
      'Padasen a baliwan ti panagbiruk wenno report filter.',
    reportFound:
      '{{count}} a report ti nabirukan',
    reportsFound:
      '{{count}} a report ti nabirukan',
  },

  // ============ REPORT DETAIL ============
  reportDetail: {
    title: 'Dagiti Detalye ti Report',
    back: 'Agsubli iti Track',
    notFound: 'Saan a nabirukan ti report',
    notFoundMessage:
      'Awan ti report a sapsapulem.',
    viewReports: 'Kitaen Dagiti Report Ko',
    currentStatus: 'Agdama a Status',
    latestUpdate: 'Kaudian nga Update',
    resolutionRemarks: 'Resolution Remarks',
    progress: 'Progreso ti Report',
    assignedPersonnel: 'Na-assign a Personnel',
    assignedToReport: 'Na-assign iti daytoy a report',
    noPersonnel: 'Awan pay ti na-assign a personnel.',
    incidentLocation: 'Lokasion ti Insidente',
    landmark: 'Landmark',
    reportInformation: 'Impormasyon ti Report',
    barangayRemarks: 'Remarks ti Barangay',
    noRemarks: 'Awan pay ti remarks ti barangay.',
    invalidTitle: 'Naimarka a Invalid ti Report',
    invalidReason: 'Rason',
    reportType: 'Klase ti Report',
    concernType: 'Klase ti Pakaseknan',
    subcategory: 'Subcategory',
    submitted: 'Naisumite',
    updated: 'Na-update',
    reportingFor: 'Report Para iti',
    description: 'Deskripsion',
    noDescription: 'Awan ti naited a deskripsion.',
    assistanceNeeded: 'Kasapulan a Tulong',
    victimInformation: 'Impormasyon ti Biktima',
    affectedIndividuals: 'Dagiti Naapektaran a Tao',
    name: 'Nagan',
    contact: 'Contact',
    waitingUpdate: 'Agur-uray ti update',
    priority: '{{priority}} Priority',
  },

  // ============ CONTACTS ============
  contacts: {
    title: 'Dagiti Emergency Contact',
    subtitle:
      'Dagiti contact ti barangay, emergency services, ken napateg a lokasion.',
    barangayHotline: 'Barangay Hotline',
    callBarangayHotline: 'Tawagan ti Barangay Hotline',
    officials: 'Dagiti Opisial ken Personnel ti Barangay',
    officialsDescription:
      'Captain, Kagawads, SK, Secretary, Treasurer ken personnel',
    contactDirectory: 'Contact Directory',
    tapCardCall: 'I-tap ti card tapno tumawag',
    emergencyLocations: 'Dagiti Emergency Location',
    emergencyLocationsHint:
      'Barangay ken asideg nga emergency facilities.',
    selectLocation: 'Pilien ti lokasion',
    selectLocationHint:
      'I-tap ti maysa kadagiti lokasion iti baba.',
    mapLater:
      'Maikonekta ti map integration inton sumaruno.',
    lguServices: 'LGU ken Emergency Services',
    lguHint: 'I-tap ti serbisyo tapno tumawag.',
    fire: 'Bumbero',
    police: 'Pulis',
    medical: 'Medikal',
    rescue: 'Rescue',
  },

  // ============ UPDATES ============
  updates: {
    title: 'Dagiti Update',
    subtitle:
      'Dagiti anunsio ti barangay, emergency alert, ken update ti report.',
    all: 'Amin',
    alerts: 'Dagiti Alerto',
    announcements: 'Dagiti Anunsio',
    myReports: 'Dagiti Report Ko',
    criticalAlert: 'Kritikal nga Alerto',
    reportUpdate: 'Update ti Report',
    announcement: 'Anunsio',
    update: 'Update',
    expired: 'Nag-expire',
    until: 'Agingga {{date}}',
    unread: 'Saan pay a nabasa',
    nothingHere: 'Awan pay ditoy',
    noUpdates: 'Awan ti update a maipakita.',
    openReport: 'Luktan ti report {{id}}',
  },

  // ============ SAFETY TIPS ============
  safetyTips: {
    title: 'Dagiti Gabay ti Katalgedan',
    subtitle:
      'Dagiti gabay ti panagsagana ken katalgedan para iti emergency ken pakaseknan ti komunidad.',
    stayInformed:
      'Agtalinaed a makaammo. Agtalinaed a natalged.',
    guideMessage:
      'Dagitoy a gabay ket tumulong iti umno a panagtignay iti emergency ken pakaseknan ti komunidad a saklawen ti ResQNow.',
    emergencySafety: 'Katalgedan iti Emergency',
    communitySafety:
      'Katalgedan ti Komunidad ken Non-Emergency',
    reminder: '{{count}} a palagip',
    reminders: '{{count}} a palagip',
    signalNote:
      'No saan a maipadala ti emergency report gapu iti nakapsot nga internet wenno mobile signal, usaren ti Contacts page tapno direkta a tawagan ti barangay hotline.',
  },

  // ============ LOGIN ============
  login: {
    residentAccess: 'Akses ti Residente',
    welcomeBack: 'Naimbag a panagsubli',
    signInMessage:
      'Ag-sign in tapno ma-access ti ResQNow account.',
    emailAddress: 'Email Address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    rememberMe: 'Laglagipennak',
    forgotPassword: 'Nalipatan ti password?',
    signIn: 'Ag-sign In',
    signingIn: 'Ag-sign in...',
    noAccount: 'Awan pay ti resident account?',
    createOne: 'Agaramid ti account',
    emergencyResponder: 'Emergency Responder?',
    responderDescription:
      'Usaren ti responder portal tapno makita dagiti na-assign nga insidente ken ma-update ti response status.',
    responderAccess: 'Responder Access',
    secureAccess: 'Natalged nga Akses ti Residente',
    reporting: 'Resident Emergency Reporting',
    heroTitle:
      'Ti napardas a tulong ket mangrugi iti umno nga impormasyon.',
    heroDescription:
      'Ag-report ti emergency, agkiddaw ti tulong ti barangay, ken subaybayan dagiti report.',
    emailRequired: 'Masapul ti email',
    invalidEmail: 'Mangted ti valid nga email address',
    passwordRequired: 'Masapul ti password',
    wrongCredentials:
      'Saan nga umno ti email wenno password. Padasen manen.',
    showPassword: 'Ipakita ti password',
    hidePassword: 'Ilemmeng ti password',
  },

  // ============ REGISTER ============
  register: {
    createAccount: 'Agaramid ti Account',
    registerMessage:
      'Agrehistro tapno makapag-report kadagiti pakaseknan.',
    personalInformation: 'Personal nga Impormasyon',
    fullName: 'Naan-anay a Nagan',
    contactNumber: 'Contact Number',
    purok: 'Purok',
    selectPurok: 'Pilien ti Purok',
    address: 'Address',
    accountCredentials: 'Account Credentials',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Kumpirmaen ti Password',
    householdInformation: 'Impormasyon ti Sambahayan',
    householdCount: 'Bilang ti Sambahayan',
    householdProfile: 'Profile ti Sambahayan',
    seniorCitizen: 'Senior Citizen',
    child: 'Ubing',
    pwd: 'PWD',
    pregnantPerson: 'Masikog',
    homeLocation: 'Lokasion ti Balay',
    homeLocationPin: 'Home location pin',
    mapLater: 'Maikonekta ti map integration inton sumaruno.',
    confirmInformation:
      'Kumpirmaek nga pudno ken umno ti impormasion nga inted ko. Maawatak nga ti account ko ket masailalim iti beripikasion ti barangay.',
    creating: 'Ag-aramid ti Account...',
    secureRegistration: 'Natalged a Panagrehistro',
    accountCreated: 'Naaramid ti Account',
    accountCreatedMessage:
      'Naaramid ti resident account mo ken agur-uray iti beripikasion ti barangay.',
    pendingVerification: 'Pending Verification',
    verificationNote:
      'Usisaen ti barangay personnel ti impormasion mo. Makaawat ka ti update no na-verify ti account.',
    goToLogin: 'Mapan iti Login',
    fixFields:
      'Ayusen dagiti naka-highlight a field sakbay nga agtuloy.',
    confirmInfoError:
      'Kumpirmaen nga umno ti impormasion.',
    fullNameRequired: 'Masapul ti naan-anay a nagan',
    nameTooShort: 'Nababassit unay ti nagan',
    contactRequired: 'Masapul ti contact number',
    invalidPhone:
      'Mangted ti valid a PH mobile number (09XX XXX XXXX)',
    emailRequired: 'Masapul ti email',
    invalidEmail: 'Mangted ti valid nga email',
    addressRequired: 'Masapul ti address',
    purokRequired: 'Pilien ti purok',
    passwordRequired: 'Masapul ti password',
    passwordLength: 'Saan a nababbaba iti 8 characters',
    passwordUppercase: 'Masapul ti dakkel a letra',
    passwordLowercase: 'Masapul ti bassit a letra',
    passwordNumber: 'Masapul ti numero',
    passwordSpecial: 'Masapul ti espesyal a character',
    confirmRequired: 'Kumpirmaen ti password',
    passwordsDontMatch: 'Saan a nagtunos dagiti password',
    veryWeak: 'Nakapsot Unay',
    weak: 'Nakapsot',
    fair: 'Nalaing',
    good: 'Naimbag',
    strong: 'Napigsa',
    veryStrong: 'Napigsa Unay',
    atLeast8: 'Saan a nababbaba iti 8 characters',
    uppercaseLetter: 'Dakkel a letra',
    lowercaseLetter: 'Bassit a letra',
    oneNumber: 'Maysa a numero',
    specialCharacter: 'Espesial a character',
    namePlaceholder: 'Itype ti naan-anay a nagan',
    phonePlaceholder: '09XX XXX XXXX',
    addressPlaceholder: 'Street, Barangay, City',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: 'Agaramid ti napigsa a password',
    confirmPasswordPlaceholder: 'Itype manen ti password',
    householdPlaceholder: 'Bilang ti tao iti sambahayan',
    showPassword: 'Ipakita ti password',
    hidePassword: 'Ilemmeng ti password',
  },

  // ============ SETTINGS ============
  settings: {
    title: 'Profile ken Settings',
    subtitle:
      'Taripatuem ti impormasyon mo kas residente ken dagiti preference ti account.',
    resident: 'Residente',
    verifiedResident: 'Naberipika a Residente',
    personalHousehold: 'Personal ken Sambahayan',
    personalHouseholdHint:
      'Profile, address, ken impormasyon ti sambahayan',
    residentInformation: 'Impormasyon ti Residente',
    fullName: 'Naan-anay a Nagan',
    contactNumber: 'Contact Number',
    email: 'Email',
    address: 'Address',
    purok: 'Purok',
    homeLocation: 'Lokasion ti Balay',
    savedHomeLocation: 'Naisagana a Lokasion ti Balay',
    mapLater: 'Maikonekta ti map pin integration inton sumaruno.',
    householdInformation: 'Impormasyon ti Sambahayan',
    householdMembers: 'Dagiti Kameng ti Sambahayan',
    householdMembersHint: 'Kabuuan a bilang ti tao iti sambahayan',
    householdProfile: 'Profile ti Sambahayan',
    seniorCitizen: 'Senior Citizen',
    child: 'Ubing',
    pwd: 'PWD',
    pregnantPerson: 'Masikog',
    edit: 'I-edit',
    editProfile: 'I-edit ti profile',
    cancel: 'Kanselaen',
    saveChanges: 'I-save dagiti Panagbaliw',
    profileUpdated: 'Na-update ti profile.',
    fullNameRequired: 'Masapul ti naan-anay a nagan.',
    invalidMobile:
      'Mangted ti valid nga 11-digit mobile number a mangrugi iti 09.',
    invalidEmail: 'Mangted ti valid nga email address.',
    addressRequired: 'Masapul ti address.',
    security: 'Account ken Security',
    securityHint: 'Baliwan ti password ti account',
    currentPassword: 'Agdama a Password',
    newPassword: 'Baro a Password',
    confirmPassword: 'Kumpirmaen ti Baro a Password',
    showPasswords: 'Ipakita dagiti password',
    hidePasswords: 'Ilemmeng dagiti password',
    passwordRequirements: 'Dagiti kasapulan ti password',
    passwordRequirementsText: 'Saan a nababbaba iti 8 characters nga addaan dakkel ken bassit a letra, numero, ken espesyal a character.',
    currentPasswordRequired: 'Itype ti agdama a password.',
    newPasswordInvalid: 'Ti baro a password ket masapul a saan a nababbaba iti 8 characters ken addaan dakkel ken bassit a letra, numero, ken espesyal a character.',
    passwordMismatch: 'Saan a nagtunos dagiti baro a password.',
    changePassword: 'Baliwan ti Password',
    passwordUpdated: 'Na-update ti password.',
    preferences: 'Dagiti Preference',
    preferencesHint: 'Pagsasao ken notification settings',
    language: 'Pagsasao',

    languages: {
      en: 'English',
      tl: 'Tagalog',
      ilo: 'Ilocano',
      ibg: 'Ibanag (Ybanag)',
    },

    notifications: 'Dagiti Notification',
    reportUpdates: 'Dagiti Update ti Report',
    reportUpdatesHint: 'Status ken responder updates',
    announcements: 'Dagiti Anunsio',
    announcementsHint: 'Barita ken advisories ti barangay',
    emergencyAlerts: 'Dagiti Emergency Alert',
    emergencyAlertsHint:
      'Kritikal a safety ken evacuation alerts',
    savePreferences: 'I-save dagiti Preference',
    preferencesSaved: 'Naisave dagiti preference.',
    privacy: 'Privacy ken Data',
    privacyHint:
      'No kasano a maus-usar ti impormasyon mo kas residente',
    residentDataPrivacy: 'Privacy ti Data ti Residente',
    privacyMessage:
      'Ti personal nga impormasyon mo ket mausar tapno mailasin ti account, ma-verify dagiti report, makontak ka no kasapulan, ken matulongan ti barangay personnel iti panagtignay kadagiti request ken emergency.',
    privacyDetails:
      'Ti impormasyon ti report kas iti nagan, contact number, lokasion, ken naisumite a detalye ket mabalin a maibingay kadagiti awtorisado nga barangay wenno emergency personnel no kasapulan iti response ken coordination.',
    signOut: 'Ag-sign Out',
    residentId: 'Resident ID',
    notAvailable: 'Saan nga available',
    notProvided: 'Awan ti naited',
    decreaseHousehold: 'Pabassiten ti bilang ti sambahayan',
    increaseHousehold: 'Paaduen ti bilang ti sambahayan',
  },

  // ============ REPORT STATUS ============
  status: {
    submitted: 'Naisumite',
    pendingVerification: 'Agur-uray iti Beripikasion',
    verified: 'Naberipika',
    assigned: 'Na-assign',
    inProgress: 'Maiproseso',
    respondersEnRoute: 'Mapan Dagiti Responders',
    responded: 'Nasungbatan',
    resolved: 'Naresolbar',
    invalid: 'Invalid',
  },

  // ============ PRIORITY ============
  priority: {
    critical: 'Kritikal',
    high: 'Nangato',
    medium: 'Naited',
    low: 'Nababa',
  },

  // ============ REPORT TYPE ============
  reportType: {
    emergency: 'Emergency',
    nonEmergency: 'Non-Emergency',
  },
};

export default ilo;