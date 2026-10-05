// Logo artwork is referenced from the source sites; image files are not bundled.
// To self-host a logo, import the approved image from src/assets and use that
// import as its `src`. No contact data or database migration needs to change.
// See reference/LOGO-SOURCES.md for sources and the city-seal substitutions.

const ilaganSeal = {
  src: 'https://cityofilagan.com/wp-content/uploads/2022/09/cropped-banner-logo-512x512-pixel-1.png',
  alt: 'City of Ilagan seal',
};

const iselcoLogo = {
  src: 'https://iselco2.com.ph/wp-content/uploads/iselco-4.png',
  alt: 'Isabela II Electric Cooperative logo',
};

export const contactLogos = {
  'ilagan-bfp': {
    src: 'https://bfp.gov.ph/wp-content/uploads/2023/04/BFP-OFFICIAL-LOGO.png',
    alt: 'Bureau of Fire Protection seal',
  },
  'ilagan-pnp': {
    src: 'https://www.marefa.org/w/images/thumb/9/98/Philippine_National_Police_seal.svg/1200px-Philippine_National_Police_seal.svg.png',
    alt: 'Philippine National Police seal',
  },
  // The parent LGU seal identifies these city offices. These are not claimed
  // to be separate CDRRMO, IMAC, hospital, or City Health Office logos.
  'ilagan-cdrrmo': ilaganSeal,
  'ilagan-imac': ilaganSeal,
  'ilagan-cho-1': ilaganSeal,
  'ilagan-cho-2': ilaganSeal,
  'ilagan-medical-center': ilaganSeal,
  'ilagan-cgso': ilaganSeal,
  'iselco-ii-head': iselcoLogo,
  'iselco-ii-centro': iselcoLogo,
  'ilagan-water': {
    src: 'https://www.cityofilaganwaterdistrict.gov.ph/images/footer%20logo.png',
    alt: 'City of Ilagan Water District logo',
  },
  // National 911 and Fil-Chinese fire volunteers retain category symbols
  // until a confirmed agency logo asset is available.
};
