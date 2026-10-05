// src/i18n/locales/tl.js

const tl = {
  // ============ COMMON ============
  common: {
    home: 'Home',
    track: 'Subaybayan',
    report: 'Mag-report',
    safety: 'Kaligtasan',
    contacts: 'Mga Contact',
    updates: 'Mga Update',
    save: 'I-save',
    cancel: 'Kanselahin',
    close: 'Isara',
    edit: 'I-edit',
    back: 'Bumalik',
    call: 'Tumawag',
    callNow: 'Tumawag Ngayon',
    optional: 'Opsyonal',
    required: 'Kailangan',
    yes: 'Oo',
    no: 'Hindi',
    submit: 'Isumite',
    confirm: 'Kumpirmahin',
    loading: 'Naglo-load...',
    viewAll: 'Tingnan lahat',
    search: 'Maghanap',
    resident: 'Residente',
    notProvided: 'Hindi ibinigay',
  },

  // ============ NAVIGATION ============
  nav: {
    home: 'Home',
    track: 'Subaybayan',
    report: 'Mag-report',
    safety: 'Kaligtasan',
    contacts: 'Mga Contact',
    updates: 'Mga Update',
    submitReport: 'Magsumite ng Report',
    profileSettings: 'Profile at Settings',
  },

  // ============ DASHBOARD ============
  dashboard: {
    goodMorning: 'Magandang umaga',
    goodAfternoon: 'Magandang hapon',
    goodEvening: 'Magandang gabi',

    importantUpdates: 'Mahahalagang Update',
    myReports: 'Mga Report Ko',
    latestReport: 'Pinakabagong Report',

    active: 'Aktibo',
    pending: 'Naghihintay',
    resolved: 'Nalutas',

    viewAll: 'Tingnan lahat',

    criticalAlert: 'Kritikal na Alerto',
    alert: 'Alerto',
    reportUpdate: 'Update sa Report',
    announcement: 'Anunsyo',

    latestUpdate: 'Pinakabagong Update',
    featuredSafetyGuide: 'Itinatampok na Gabay sa Kaligtasan',
    floodSafety: 'Kaligtasan sa Baha',
    safetyPreparedness: 'Paghahanda sa Kaligtasan',

    emergencyContacts: 'Mga Emergency Contact',
  },

  // ============ SUBMIT REPORT ============
  submitChoice: {
    title: 'Magsumite ng Report',
    subtitle:
      'Piliin ang uri ng report na akma sa iyong sitwasyon.',

    emergencyTitle: 'Emergency',
    urgent: 'Agarang Tulong',

    emergencyDescription:
      'Para sa agarang panganib, sunog, baha, pinsala, rescue, o agarang paglikas.',

    quickFlow: 'Mabilis na proseso ng pag-report',

    nonEmergencyTitle: 'Non-Emergency',

    nonEmergencyDescription:
      'Para sa mga concern sa barangay tulad ng sirang pasilidad, harang sa daan, at mga request ng tulong.',

    moreDetails:
      'Maaaring kailangan ng karagdagang detalye',

    notSure:
      'Hindi sigurado kung ano ang pipiliin?',

    emergencyHint:
      'Piliin ang Emergency kung kailangan agad ng tulong.',

    nonEmergencyHint:
      'Piliin ang Non-Emergency para sa mga concern na maaaring suriin ng barangay personnel.',

    signalNote:
      'Kung mahina ang internet o mobile signal habang may emergency, gamitin ang Contacts page upang direktang tawagan ang barangay hotline.',
  },

  // ============ EMERGENCY REPORT ============
  emergency: {
    title: 'Emergency Report',
    question: 'Ano ang emergency?',

    locationQuestion:
      'Saan nangyayari ang emergency?',

    currentLocationHint:
      'Gagamitin nito ang iyong kasalukuyang lokasyon.',

    otherLocationHint:
      'Maaaring wala sa iyong lokasyon ang emergency. Itakda kung saan ito aktwal na nangyayari.',

    useCurrentLocation:
      'Gamitin ang Kasalukuyang Lokasyon',

    locating:
      'Kinukuha ang lokasyon...',

    atCurrentLocation:
      'Nasa kasalukuyan kong lokasyon ang emergency',

    manualLocation:
      'Manu-manong ilagay ang lokasyon',

    somewhereElse:
      'Nasa ibang lugar ang emergency',

    useCurrentInstead:
      'Gamitin na lang ang kasalukuyan kong lokasyon',

    manualLocationPlaceholder:
      'I-type ang lokasyon o landmark',

    victimLocationPlaceholder:
      'Saan matatagpuan ang biktima?',

    reportingForOther:
      'Nag-rereport para sa ibang tao?',

    reportingForOtherHint:
      'I-tap kung para sa ibang tao ang emergency.',

    addVictimDetails:
      'Idagdag ang detalye ng biktima sa ibaba.',

    victimName:
      'Pangalan ng Biktima',

    victimContact:
      'Contact ng Biktima',

    unknownName:
      'Hindi ko alam ang pangalan',

    reporterInfo:
      'Awtomatikong isasama ang iyong pangalan, contact, at purok.',

    optionalDetails:
      'Opsyonal na Detalye',

    optionalDetailsHint:
      'Landmark at maikling deskripsyon',

    nearbyLandmark:
      'Malapit na Landmark',

    nearbyLandmarkPlaceholder:
      'Halimbawa: Malapit sa covered court',

    shortDescription:
      'Maikling Deskripsyon',

    shortDescriptionPlaceholder:
      'Maikling ilarawan kung ano ang nangyayari...',

    weakSignal:
      'Mahina ang signal?',

    weakSignalMessage:
      'Direktang tawagan ang hotline.',

    viewContacts:
      'Tingnan ang Mga Contact',

    send:
      'Ipadala ang Emergency Report',

    confirmTitle:
      'Kumpirmahin ang Emergency Report',

    confirmMessage:
      'Ipadala na? Ipapadala sa barangay personnel ang iyong pangalan, contact number, address, at lokasyon.',

    sendNow:
      'Ipadala Ngayon',

    sending:
      'Ipinapadala...',

    type:
      'Uri',

    contact:
      'Contact',

    victim:
      'Biktima',

    selectTypeError:
      'Pumili ng uri ng emergency.',

    locationError:
      'Itakda ang lokasyon upang malaman ng responders kung saan pupunta.',

    gpsError:
      'Hindi nakuha ang iyong kasalukuyang lokasyon. Manu-manong ilagay ang lokasyon.',

    submittedTitle:
      'Naisumite ang Emergency Report',

    submittedMessage:
      'Natanggap na ang iyong emergency report at handa na para sa pagtugon ng barangay.',

    reportId:
      'Report ID',

    reporter:
      'Nag-report',

    location:
      'Lokasyon',

    for:
      'Para kay',

    status:
      'Status',

    backHome:
      'Bumalik sa Home',

    submitAnother:
      'Magsumite ng Isa Pang Report',

    categories: {
      lifeDeath: {
        label:
          'Banta sa Buhay',

        description:
          'May taong nasa agarang panganib ang buhay.',
      },

      fire: {
        label:
          'Emergency sa Sunog',

        description:
          'Aktibong sunog, makapal na usok, o agarang panganib ng sunog.',
      },

      medical: {
        label:
          'Medical Emergency',

        description:
          'Malubhang pinsala, karamdaman, o agarang tulong medikal.',
      },

      violence: {
        label:
          'Karahasan / Banta sa Kaligtasan',

        description:
          'Karahasan, pagbabanta, o agarang panganib mula sa ibang tao.',
      },

      flood: {
        label:
          'Flood Rescue',

        description:
          'Agarang rescue o tulong dahil sa pagbaha.',
      },

      accident: {
        label:
          'Aksidente sa Kalsada',

        description:
          'Banggaan ng sasakyan o malubhang aksidente sa kalsada.',
      },

      evacuation: {
        label:
          'Agarang Paglikas',

        description:
          'Kailangan ng agarang tulong upang ligtas na makalikas.',
      },
    },
  },

  // ============ NON-EMERGENCY REPORT ============
  nonEmergency: {
    title:
      'Non-Emergency Report',

    subtitle:
      'Mag-report ng concern sa barangay o humingi ng tulong.',

    reportingFor:
      'Para kanino ang report na ito?',

    reportingForHint:
      'Sabihin kung sino ang maaaring nangangailangan ng tulong mula sa barangay.',

    myself:
      'Para sa Akin',

    anotherPerson:
      'Ibang Tao',

    name:
      'Pangalan',

    contactNumber:
      'Contact Number',

    relationship:
      'Relasyon / Tala',

    ifKnown:
      'Kung alam',

    optionalPlaceholder:
      'Opsyonal',

    exampleNeighbor:
      'Halimbawa: Kapitbahay',

    concernQuestion:
      'Ano ang iyong concern?',

    concernInstruction:
      'Piliin ang kategoryang pinakaangkop sa iyong report.',

    specifyConcern:
      'Tukuyin ang concern',

    optional:
      'opsyonal',

    evacuationWarning:
      'Nasa panganib ngayon? Gamitin ang Emergency Report → Urgent Evacuation sa halip.',

    incidentLocation:
      'Lokasyon ng Insidente',

    setIncidentLocation:
      'Itakda kung saan matatagpuan ang concern',

    purok:
      'Purok',

    addressLocation:
      'Address / Lokasyon ng Insidente',

    addressPlaceholder:
      'Ilagay ang lokasyon ng concern',

    nearbyLandmark:
      'Malapit na Landmark',

    landmarkPlaceholder:
      'Halimbawa: Malapit sa elementary school',

    pinIncidentLocation:
      'I-pin ang Lokasyon ng Insidente',

    mapLater:
      'Ikokonekta ang map pin integration sa susunod.',

    sampleCoordinates:
      'Halimbawang coordinates: {{coordinates}}',

    reportDetails:
      'Mga Detalye ng Report',

    reportDetailsHint:
      'Magbigay ng sapat na impormasyon upang masuri ng barangay personnel ang concern.',

    description:
      'Deskripsyon',

    descriptionPlaceholder:
      'Maikling ilarawan ang concern...',

    assistanceNeeded:
      'Kailangang Tulong',

    assistancePlaceholder:
      'Halimbawa: Clean-up crew, transportasyon, repair...',

    affectedIndividuals:
      'Mga Apektadong Tao',

    affectedHint:
      'Piliin ang lahat ng naaangkop. Opsyonal.',

    affected: {
      child:
        'Bata',

      seniorCitizen:
        'Senior Citizen',

      pwd:
        'PWD',

      pregnantPerson:
        'Buntis',

      injuredPerson:
        'Taong Nasugatan',
    },

    photoEvidence:
      'Larawang Ebidensya',

    photoOptional:
      'Opsyonal lamang.',

    addPhoto:
      'Magdagdag ng Larawan',

    photoType:
      'JPG o PNG',

    removePhoto:
      'Alisin ang larawan',

    reporterInfo:
      'Awtomatikong isasama sa report ang iyong pangalan, contact number, address, at purok.',

    reviewReport:
      'Suriin ang Report',

    pendingNotice:
      'Ang mga non-emergency report ay magsisimula bilang Pending Verification.',

    confirmTitle:
      'Kumpirmahin ang Report',

    confirmHint:
      'Suriin ang mahahalagang detalye bago isumite.',

    concernType:
      'Uri ng Concern',

    reportingForLabel:
      'Report Para Kay',

    person:
      'Tao',

    location:
      'Lokasyon',

    descriptionLabel:
      'Deskripsyon',

    status:
      'Status',

    goBack:
      'Bumalik',

    confirmSubmit:
      'Kumpirmahin at Isumite',

    submitting:
      'Isinusumite...',

    selectTypeError:
      'Pumili ng uri ng concern.',

    locationError:
      'Ilagay ang lokasyon ng insidente.',

    descriptionError:
      'Magdagdag ng maikling deskripsyon ng concern.',

    submittedTitle:
      'Naisumite ang Report',

    submittedMessage:
      'Naisumite na ang iyong concern at naghihintay ng beripikasyon ng barangay.',

    reportId:
      'Report ID',

    reporter:
      'Nag-report',

    viewReports:
      'Tingnan ang Mga Report Ko',

    backHome:
      'Bumalik sa Home',

    categories: {
      evacuation: {
        label:
          'Tulong sa Paglikas',

        description:
          'Hindi agarang tulong sa paghahanda o pagpunta sa evacuation center.',
      },

      healthWorker: {
        label:
          'Tulong mula sa Health Worker',

        description:
          'Humiling ng BHW visit, health check, o pangunahing tulong pangkalusugan.',
      },

      roadObstruction: {
        label:
          'Baradong Daan / Harang',

        description:
          'May puno, debris, sasakyan, o bagay na humaharang sa daan o pathway.',
      },

      damagedFacility: {
        label:
          'Sirang Pampublikong Pasilidad',

        description:
          'Sirang streetlight, kalsada, drainage, o barangay facility.',
      },

      cleanup: {
        label:
          'Community Clean-Up',

        description:
          'Basura, sanga, o debris na nangangailangan ng barangay clean-up.',
      },

      community: {
        label:
          'Concern sa Komunidad',

        description:
          'Sanitation, ingay, stray animals, o iba pang concern sa komunidad.',
      },

      other: {
        label:
          'Ibang Tulong mula sa Barangay',

        description:
          'Humiling ng tulong na hindi sakop ng ibang kategorya.',
      },
    },
  },

  // ============ TRACK REPORTS ============
  track: {
    title:
      'Subaybayan ang Mga Report',

    subtitle:
      'Tingnan at subaybayan ang iyong mga isinumiteng report.',

    searchPlaceholder:
      'Maghanap ng report ID o concern...',

    all:
      'Lahat',

    emergency:
      'Emergency',

    nonEmergency:
      'Non-Emergency',

    active:
      'Aktibo',

    resolved:
      'Nalutas',

    reportId:
      'Report ID',

    type:
      'Uri',

    concern:
      'Concern',

    location:
      'Lokasyon',

    status:
      'Status',

    date:
      'Petsa',

    latestUpdate:
      'Pinakabagong Update',

    noReports:
      'Walang nakitang report.',

    trySearch:
      'Subukang baguhin ang iyong paghahanap o report filter.',

    reportFound:
      '{{count}} report ang nakita',

    reportsFound:
      '{{count}} report ang nakita',
  },

  // ============ REPORT DETAIL ============
  reportDetail: {
    title:
      'Mga Detalye ng Report',

    back:
      'Bumalik sa Track',

    notFound:
      'Hindi nakita ang report',

    notFoundMessage:
      'Wala ang report na iyong hinahanap.',

    viewReports:
      'Tingnan ang Mga Report Ko',

    currentStatus:
      'Kasalukuyang Status',

    latestUpdate:
      'Pinakabagong Update',

    resolutionRemarks:
      'Resolution Remarks',

    progress:
      'Progress ng Report',

    assignedPersonnel:
      'Naka-assign na Personnel',

    assignedToReport:
      'Naka-assign sa report na ito',

    noPersonnel:
      'Wala pang naka-assign na personnel.',

    incidentLocation:
      'Lokasyon ng Insidente',

    landmark:
      'Landmark',

    reportInformation:
      'Impormasyon ng Report',

    barangayRemarks:
      'Remarks ng Barangay',

    noRemarks:
      'Wala pang remarks mula sa barangay.',

    invalidTitle:
      'Minarkahang Invalid ang Report',

    invalidReason:
      'Dahilan',

    reportType:
      'Uri ng Report',

    concernType:
      'Uri ng Concern',

    subcategory:
      'Subcategory',

    submitted:
      'Isinumite',

    updated:
      'Na-update',

    reportingFor:
      'Report Para Kay',

    description:
      'Deskripsyon',

    noDescription:
      'Walang ibinigay na deskripsyon.',

    assistanceNeeded:
      'Kailangang Tulong',

    victimInformation:
      'Impormasyon ng Biktima',

    affectedIndividuals:
      'Mga Apektadong Tao',

    name:
      'Pangalan',

    contact:
      'Contact',

    waitingUpdate:
      'Naghihintay ng update',

    priority:
      '{{priority}} Priority',
  },

  // ============ CONTACTS ============
  contacts: {
    title:
      'Mga Emergency Contact',

    subtitle:
      'Mga contact ng barangay, emergency services, at mahahalagang lokasyon.',

    barangayHotline:
      'Barangay Hotline',

    callBarangayHotline:
      'Tawagan ang Barangay Hotline',

    officials:
      'Mga Opisyal at Personnel ng Barangay',

    officialsDescription:
      'Captain, Kagawads, SK, Secretary, Treasurer at personnel',

    contactDirectory:
      'Contact Directory',

    tapCardCall:
      'I-tap ang card upang tumawag',

    emergencyLocations:
      'Mga Emergency Location',

    emergencyLocationsHint:
      'Barangay at mga kalapit na emergency facility.',

    selectLocation:
      'Pumili ng lokasyon',

    selectLocationHint:
      'I-tap ang isa sa mga lokasyon sa ibaba.',

    mapLater:
      'Ikokonekta ang map integration sa susunod.',

    lguServices:
      'LGU at Emergency Services',

    lguHint:
      'I-tap ang serbisyo upang tumawag.',

    fire:
      'Bumbero',

    police:
      'Pulis',

    medical:
      'Medikal',

    rescue:
      'Rescue',
  },

  // ============ UPDATES ============
  updates: {
    title:
      'Mga Update',

    subtitle:
      'Mga anunsyo ng barangay, emergency alert, at update sa iyong report.',

    all:
      'Lahat',

    alerts:
      'Mga Alerto',

    announcements:
      'Mga Anunsyo',

    myReports:
      'Mga Report Ko',

    criticalAlert:
      'Kritikal na Alerto',

    reportUpdate:
      'Update sa Report',

    announcement:
      'Anunsyo',

    update:
      'Update',

    expired:
      'Nag-expire',

    until:
      'Hanggang {{date}}',

    unread:
      'Hindi pa nababasa',

    nothingHere:
      'Wala pa rito',

    noUpdates:
      'Walang update na maipapakita.',

    openReport:
      'Buksan ang report {{id}}',
  },

  // ============ SAFETY TIPS ============
  safetyTips: {
    title:
      'Mga Gabay sa Kaligtasan',

    subtitle:
      'Mga gabay sa paghahanda at kaligtasan para sa emergency at concern sa komunidad.',

    stayInformed:
      'Manatiling may alam. Manatiling ligtas.',

    guideMessage:
      'Ang mga gabay na ito ay tutulong sa tamang pagtugon sa emergency at concern sa komunidad na sakop ng ResQNow.',

    emergencySafety:
      'Kaligtasan sa Emergency',

    communitySafety:
      'Kaligtasan sa Komunidad at Non-Emergency',

    reminder:
      '{{count}} paalala',

    reminders:
      '{{count}} paalala',

    signalNote:
      'Kung hindi maipadala ang emergency report dahil sa mahinang internet o mobile signal, gamitin ang Contacts page upang direktang tawagan ang barangay hotline.',
  },

  // ============ LOGIN ============
  login: {
    residentAccess:
      'Resident Access',

    welcomeBack:
      'Maligayang pagbabalik',

    signInMessage:
      'Mag-sign in upang ma-access ang iyong ResQNow account.',

    emailAddress:
      'Email Address',

    emailPlaceholder:
      'you@example.com',

    password:
      'Password',

    rememberMe:
      'Tandaan ako',

    forgotPassword:
      'Nakalimutan ang password?',

    signIn:
      'Mag-sign In',

    signingIn:
      'Nag-sign in...',

    noAccount:
      'Wala pang resident account?',

    createOne:
      'Gumawa ng account',

    emergencyResponder:
      'Emergency Responder?',

    responderDescription:
      'Gamitin ang responder portal upang makita ang mga naka-assign na insidente at i-update ang response status.',

    responderAccess:
      'Responder Access',

    secureAccess:
      'Secure Resident Access',

    reporting:
      'Resident Emergency Reporting',

    heroTitle:
      'Ang mabilis na tulong ay nagsisimula sa tamang impormasyon.',

    heroDescription:
      'Mag-report ng emergency, humingi ng tulong sa barangay, at subaybayan ang iyong mga report.',

    emailRequired:
      'Kailangan ang email',

    invalidEmail:
      'Maglagay ng valid na email address',

    passwordRequired:
      'Kailangan ang password',

    wrongCredentials:
      'Mali ang email o password na iyong inilagay. Subukan muli.',

    showPassword:
      'Ipakita ang password',

    hidePassword:
      'Itago ang password',
  },

  // ============ REGISTER ============
  register: {
    addressSearching: 'Hinahanap ang address na ito sa mapa…',
    addressFound: 'Inilipat ang pin ayon sa address mo. I-drag ito para i-adjust.',
    addressNotFound: 'Hindi namin mahanap ang address na iyan. I-tap ang mapa para maglagay ng pin.',
    addressFromPin: 'Nilagyan ng address mula sa pin mo. Puwede mo itong i-edit.',
    useSuggestion: 'Gamitin ang address mula sa pin mo:',
    personalHint: 'Gamitin ang tunay mong pangalan. Itinutugma ito ng barangay sa talaan ng sambahayan.',
    locationHint: 'Tinutulungan ng pin ang mga responder na mahanap agad ang bahay mo. Puwede mo itong baguhin mamaya.',
    householdHint: 'Para maihanda ng barangay ang tamang tulong kapag may emergency.',
    householdInvalid: 'Maglagay ng numero mula 1 hanggang 100',
    emergencyContact: 'Emergency contact',
    emergencyContactHint: 'Taong matatawagan namin kung hindi ka namin makontak. Opsyonal pero inirerekomenda.',
    contactName: 'Pangalan ng contact',
    contactNamePlaceholder: 'Kapamilya o kapitbahay',
    accountHint: 'Mag-sign in gamit ang email mo at ang password na ito.',
    optional: 'opsyonal',
    loadingMap: 'Niloload ang mapa…',
    useMyLocation: 'Gamitin ang kasalukuyan kong lokasyon',
    locating: 'Hinahanap ka…',
    removePin: 'Alisin ang pin',
    mapHint: 'I-tap ang mapa para maglagay ng pin, tapos i-drag ito sa eksaktong bahay mo.',
    locationUnavailable: 'Hindi available ang lokasyon sa device na ito.',
    locationDenied: 'Hindi namin makuha ang lokasyon mo. I-tap na lang ang mapa para maglagay ng pin.',
    haveAccount: 'Nakarehistro ka na?',
    privacy: 'Ang mga detalye mo ay gagamitin lang ng mga tauhan ng barangay para i-verify ang account mo at tumugon sa mga report mo. Hindi ito ipinapakita sa publiko.',
    heroTitle: 'Ang emergency response ng barangay mo, nasa bulsa mo.',
    heroText: 'Magrehistro nang isang beses para mag-report, magpadala ng SOS at tumanggap ng anunsyo mula sa Barangay Camunatan.',
    stepCreate: 'Gumawa ng account',
    stepCreateText: 'Ilagay ang detalye ng sambahayan at i-pin ang bahay mo sa mapa.',
    stepVerify: 'Beripikasyon ng barangay',
    stepVerifyText: 'Rerepasuhin ng mga tauhan ng barangay ang detalye mo bago ka makapag-sign in.',
    stepReport: 'Magsimulang mag-report',
    stepReportText: 'Magpadala ng SOS o report at sundan ang bawat update.',
    createAccount:
      'Gumawa ng Account',

    registerMessage:
      'Magrehistro upang makapagsimulang mag-report ng concern.',

    personalInformation:
      'Personal na Impormasyon',

    fullName:
      'Buong Pangalan',

    contactNumber:
      'Contact Number',

    purok:
      'Purok',

    selectPurok:
      'Pumili ng Purok',

    address:
      'Address',

    accountCredentials:
      'Account Credentials',

    emailAddress:
      'Email Address',

    password:
      'Password',

    confirmPassword:
      'Kumpirmahin ang Password',

    householdInformation:
      'Impormasyon ng Sambahayan',

    householdCount:
      'Bilang ng Tao sa Sambahayan',

    householdProfile:
      'Profile ng Sambahayan',

    seniorCitizen:
      'Senior Citizen',

    child:
      'Bata',

    pwd:
      'PWD',

    pregnantPerson:
      'Buntis',

    homeLocation:
      'Lokasyon ng Bahay',

    homeLocationPin:
      'Home location pin',

    mapLater:
      'Ikokonekta ang map integration sa susunod.',

    confirmInformation:
      'Kinukumpirma ko na tama at totoo ang impormasyong ibinigay ko. Nauunawaan ko na sasailalim sa beripikasyon ng barangay ang aking account.',

    creating:
      'Gumagawa ng Account...',

    secureRegistration:
      'Secure Registration',

    accountCreated:
      'Nagawa ang Account',

    accountCreatedMessage:
      'Nagawa na ang iyong resident account at naghihintay ng beripikasyon ng barangay.',

    pendingVerification:
      'Pending Verification',

    verificationNote:
      'Susuriin ng barangay personnel ang iyong impormasyon. Makakatanggap ka ng update kapag na-verify na ang iyong account.',

    goToLogin:
      'Pumunta sa Login',

    fixFields:
      'Ayusin ang mga naka-highlight na field bago magpatuloy.',

    confirmInfoError:
      'Kumpirmahin na tama ang iyong impormasyon.',

    fullNameRequired:
      'Kailangan ang buong pangalan',

    nameTooShort:
      'Masyadong maikli ang pangalan',

    contactRequired:
      'Kailangan ang contact number',

    invalidPhone:
      'Maglagay ng valid na PH mobile number (09XX XXX XXXX)',

    emailRequired:
      'Kailangan ang email',

    invalidEmail:
      'Maglagay ng valid na email',

    addressRequired:
      'Kailangan ang address',

    purokRequired:
      'Pumili ng iyong purok',

    passwordRequired:
      'Kailangan ang password',

    passwordLength:
      'Hindi bababa sa 8 character',

    passwordUppercase:
      'Kailangan ng malaking titik',

    passwordLowercase:
      'Kailangan ng maliit na titik',

    passwordNumber:
      'Kailangan ng numero',

    passwordSpecial:
      'Kailangan ng espesyal na character',

    confirmRequired:
      'Kumpirmahin ang iyong password',

    passwordsDontMatch:
      'Hindi magkatugma ang mga password',

    veryWeak:
      'Napakahina',

    weak:
      'Mahina',

    fair:
      'Katamtaman',

    good:
      'Mabuti',

    strong:
      'Malakas',

    veryStrong:
      'Napakalakas',

    atLeast8:
      'Hindi bababa sa 8 character',

    uppercaseLetter:
      'Malaking titik',

    lowercaseLetter:
      'Maliit na titik',

    oneNumber:
      'Isang numero',

    specialCharacter:
      'Espesyal na character',

    namePlaceholder:
      'Ilagay ang buong pangalan',

    phonePlaceholder:
      '09XX XXX XXXX',

    addressPlaceholder:
      'Street, Barangay, City',

    emailPlaceholder:
      'you@example.com',

    passwordPlaceholder:
      'Gumawa ng malakas na password',

    confirmPasswordPlaceholder:
      'Ilagay muli ang password',

    householdPlaceholder:
      'Bilang ng tao sa sambahayan',

    showPassword:
      'Ipakita ang password',

    hidePassword:
      'Itago ang password',
  },

  // ============ SETTINGS ============
  settings: {
    title:
      'Profile at Settings',

    subtitle:
      'Pamahalaan ang iyong impormasyon bilang residente at mga kagustuhan sa account.',

    resident:
      'Residente',

    verifiedResident:
      'Beripikadong Residente',

    personalHousehold:
      'Personal at Sambahayan',

    personalHouseholdHint:
      'Profile, address, at impormasyon ng sambahayan',

    residentInformation:
      'Impormasyon ng Residente',

    fullName:
      'Buong Pangalan',

    contactNumber:
      'Contact Number',

    email:
      'Email',

    address:
      'Address',

    purok:
      'Purok',

    homeLocation:
      'Lokasyon ng Bahay',

    savedHomeLocation:
      'Naka-save na Lokasyon ng Bahay',

    mapLater:
      'Ikokonekta ang map pin integration sa susunod.',

    householdInformation:
      'Impormasyon ng Sambahayan',

    householdMembers:
      'Mga Miyembro ng Sambahayan',

    householdMembersHint:
      'Kabuuang bilang ng tao sa iyong sambahayan',

    householdProfile:
      'Profile ng Sambahayan',

    seniorCitizen:
      'Senior Citizen',

    child:
      'Bata',

    pwd:
      'PWD',

    pregnantPerson:
      'Buntis',

    edit:
      'I-edit',

    editProfile:
      'I-edit ang profile',

    cancel:
      'Kanselahin',

    saveChanges:
      'I-save ang mga Pagbabago',

    profileUpdated:
      'Matagumpay na na-update ang profile.',

    fullNameRequired:
      'Kailangan ang buong pangalan.',

    invalidMobile:
      'Maglagay ng valid na 11-digit mobile number na nagsisimula sa 09.',

    invalidEmail:
      'Maglagay ng valid na email address.',

    addressRequired:
      'Kailangan ang address.',

    security:
      'Account at Seguridad',

    securityHint:
      'Palitan ang password ng iyong account',

    currentPassword:
      'Kasalukuyang Password',

    newPassword:
      'Bagong Password',

    confirmPassword:
      'Kumpirmahin ang Bagong Password',

    showPasswords:
      'Ipakita ang mga password',

    hidePasswords:
      'Itago ang mga password',

    passwordRequirements:
      'Mga kinakailangan sa password',

    passwordRequirementsText:
  'Hindi bababa sa 8 character na may malaking titik, numero, at espesyal na character.',

currentPasswordRequired:
  'Ilagay ang iyong kasalukuyang password.',

newPasswordInvalid:
  'Ang bagong password ay dapat may 8 character, malaking titik, numero, at espesyal na character.',

    passwordMismatch:
      'Hindi magkatugma ang mga bagong password.',

    changePassword:
      'Palitan ang Password',

    passwordUpdated:
      'Matagumpay na napalitan ang password.',

    preferences:
      'Mga Kagustuhan',

    preferencesHint:
      'Wika at notification settings',

    language:
      'Wika',

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
      'Mga Notification',

    reportUpdates:
      'Mga Update sa Report',

    reportUpdatesHint:
      'Status at responder updates',

    announcements:
      'Mga Anunsyo',

    announcementsHint:
      'Balita at advisories mula sa barangay',

    emergencyAlerts:
      'Mga Emergency Alert',

    emergencyAlertsHint:
      'Kritikal na safety at evacuation alerts',

    savePreferences:
      'I-save ang mga Kagustuhan',

    preferencesSaved:
      'Naka-save na ang mga kagustuhan.',

    privacy:
      'Privacy at Data',

    privacyHint:
      'Paano ginagamit ang iyong impormasyon bilang residente',

    residentDataPrivacy:
      'Privacy ng Data ng Residente',

    privacyMessage:
      'Ginagamit ang iyong personal na impormasyon upang makilala ang iyong account, beripikahin ang mga report, makipag-ugnayan sa iyo kapag kinakailangan, at makatulong sa barangay personnel sa pagtugon sa mga request at emergency.',

    privacyDetails:
      'Ang impormasyon sa report gaya ng iyong pangalan, contact number, lokasyon, at mga isinumiteng detalye ay maaaring ibahagi sa awtorisadong barangay o emergency personnel kapag kinakailangan para sa response at coordination.',

    signOut:
      'Mag-sign Out',

    residentId:
      'Resident ID',

    notAvailable:
      'Hindi available',

    notProvided:
      'Hindi ibinigay',

    decreaseHousehold:
      'Bawasan ang bilang ng tao sa sambahayan',

    increaseHousehold:
      'Dagdagan ang bilang ng tao sa sambahayan',
  },

  // ============ REPORT STATUS ============
  status: {
    submitted:
      'Nasumite',

    pendingVerification:
      'Naghihintay ng Beripikasyon',

    verified:
      'Beripikado',

    assigned:
      'Naka-assign',

    inProgress:
      'Kasalukuyang Pinoproseso',

    respondersEnRoute:
      'Papunta na ang Responders',

    responded:
      'Natugunan',

    resolved:
      'Nalutas',

    invalid:
      'Invalid',
  },

  // ============ PRIORITY ============
  priority: {
    critical:
      'Kritikal',

    high:
      'Mataas',

    medium:
      'Katamtaman',

    low:
      'Mababa',
  },

  // ============ REPORT TYPE ============
  reportType: {
    emergency:
      'Emergency',

    nonEmergency:
      'Non-Emergency',
  },
};

export default tl;