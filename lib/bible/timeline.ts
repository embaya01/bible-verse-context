// Linear year-based timeline. All years are integers: negative = BC, positive = AD.

export const TIMELINE_START = -4100; // "Before creation" buffer
export const TIMELINE_END = 100;
export const TOTAL_YEARS = TIMELINE_END - TIMELINE_START; // 4200

export type TimelineEvent = {
  label: string;
  year: number;
  book?: string;
  era: string;
};

/** Maps a calendar year to a 0.0–1.0 fraction of the full timeline. */
export function yearToFraction(year: number): number {
  return (year - TIMELINE_START) / TOTAL_YEARS;
}

/** Formats a year as "~28 AD", "~586 BC", or "Creation era" for very old dates. */
export function yearToLabel(year: number): string {
  if (year <= -4000) return "Creation era";
  if (year < 0) return `~${Math.abs(year)} BC`;
  if (year === 0) return "1 AD";
  return `~${year} AD`;
}

// ~70 curated events from Creation to the close of the NT canon.
export const EVENTS: TimelineEvent[] = [
  // Primeval History
  { label: "Creation",                    year: -4000, era: "Primeval",          book: "Genesis 1–2" },
  { label: "The Fall",                    year: -3990, era: "Primeval",          book: "Genesis 3" },
  { label: "Cain kills Abel",             year: -3900, era: "Primeval",          book: "Genesis 4" },
  { label: "The Flood",                   year: -2350, era: "Primeval",          book: "Genesis 6–8" },
  { label: "Tower of Babel",              year: -2200, era: "Primeval",          book: "Genesis 11" },

  // Patriarchs
  { label: "Abraham's Call",              year: -2091, era: "Patriarchs",        book: "Genesis 12" },
  { label: "Sodom & Gomorrah destroyed",  year: -2067, era: "Patriarchs",        book: "Genesis 19" },
  { label: "Isaac born",                  year: -2066, era: "Patriarchs",        book: "Genesis 21" },
  { label: "Jacob & Esau born",           year: -2006, era: "Patriarchs",        book: "Genesis 25" },
  { label: "Joseph sold into slavery",    year: -1898, era: "Patriarchs",        book: "Genesis 37" },
  { label: "Jacob's family enters Egypt", year: -1876, era: "Patriarchs",        book: "Genesis 46" },

  // Egypt & Exodus
  { label: "Moses born",                  year: -1526, era: "Egypt & Exodus",    book: "Exodus 2" },
  { label: "The Exodus",                  year: -1446, era: "Egypt & Exodus",    book: "Exodus 12" },
  { label: "Law given at Sinai",          year: -1446, era: "Egypt & Exodus",    book: "Exodus 20" },
  { label: "40 years in the wilderness",  year: -1445, era: "Egypt & Exodus",    book: "Numbers" },
  { label: "Moses dies; Joshua leads",    year: -1406, era: "Egypt & Exodus",    book: "Deuteronomy 34" },
  { label: "Conquest of Canaan begins",   year: -1405, era: "Egypt & Exodus",    book: "Joshua 1" },

  // Judges
  { label: "Period of the Judges",        year: -1375, era: "Judges",            book: "Judges 1" },
  { label: "Deborah leads Israel",        year: -1209, era: "Judges",            book: "Judges 4" },
  { label: "Gideon defeats Midian",       year: -1162, era: "Judges",            book: "Judges 6" },
  { label: "Ruth & Boaz",                 year: -1100, era: "Judges",            book: "Ruth" },
  { label: "Samuel born",                 year: -1105, era: "Judges",            book: "1 Samuel 1" },
  { label: "Samson's ministry",           year: -1075, era: "Judges",            book: "Judges 13" },

  // United Kingdom
  { label: "Saul anointed king",          year: -1050, era: "United Kingdom",    book: "1 Samuel 10" },
  { label: "David anointed king",         year: -1010, era: "United Kingdom",    book: "1 Samuel 16" },
  { label: "David captures Jerusalem",    year: -1004, era: "United Kingdom",    book: "2 Samuel 5" },
  { label: "Solomon's reign begins",      year: -970,  era: "United Kingdom",    book: "1 Kings 1" },
  { label: "Temple built in Jerusalem",   year: -966,  era: "United Kingdom",    book: "1 Kings 6" },

  // Divided Kingdom
  { label: "Kingdom divides",             year: -930,  era: "Divided Kingdom",   book: "1 Kings 12" },
  { label: "Elijah & prophets of Baal",   year: -874,  era: "Divided Kingdom",   book: "1 Kings 18" },
  { label: "Jonah goes to Nineveh",       year: -793,  era: "Divided Kingdom",   book: "Jonah" },
  { label: "Isaiah's ministry begins",    year: -740,  era: "Divided Kingdom",   book: "Isaiah 1" },
  { label: "Fall of Northern Kingdom",    year: -722,  era: "Divided Kingdom",   book: "2 Kings 17" },
  { label: "Josiah's reforms",            year: -621,  era: "Divided Kingdom",   book: "2 Kings 22–23" },
  { label: "Jeremiah's ministry begins",  year: -627,  era: "Divided Kingdom",   book: "Jeremiah 1" },
  { label: "First Babylonian invasion",   year: -605,  era: "Divided Kingdom",   book: "Daniel 1" },
  { label: "Jerusalem falls to Babylon",  year: -586,  era: "Divided Kingdom",   book: "2 Kings 25" },

  // Exile
  { label: "Ezekiel's visions begin",     year: -593,  era: "Exile",             book: "Ezekiel 1" },
  { label: "Shadrach, Meshach & Abednego",year: -587,  era: "Exile",             book: "Daniel 3" },
  { label: "Daniel's vision of empires",  year: -553,  era: "Exile",             book: "Daniel 7" },

  // Return & Intertestamental
  { label: "Cyrus's decree — return from exile", year: -538, era: "Return",      book: "Ezra 1" },
  { label: "Temple foundation laid",      year: -536,  era: "Return",            book: "Ezra 3" },
  { label: "Temple rebuilt & dedicated",  year: -516,  era: "Return",            book: "Ezra 6" },
  { label: "Esther saves the Jews",       year: -479,  era: "Return",            book: "Esther" },
  { label: "Ezra leads return",           year: -458,  era: "Return",            book: "Ezra 7" },
  { label: "Nehemiah rebuilds the walls", year: -445,  era: "Return",            book: "Nehemiah 1" },
  { label: "Malachi — last OT prophet",   year: -430,  era: "Return",            book: "Malachi" },
  { label: "Alexander conquers Palestine",year: -332,  era: "Intertestamental" },
  { label: "Septuagint (Greek OT) written",year: -285, era: "Intertestamental" },
  { label: "Maccabean revolt",            year: -167,  era: "Intertestamental" },
  { label: "Temple rededicated (Hanukkah)",year: -164, era: "Intertestamental" },
  { label: "Roman rule begins",           year: -63,   era: "Intertestamental" },
  { label: "Herod the Great rules",       year: -37,   era: "Intertestamental" },

  // Life of Jesus
  { label: "Birth of Jesus",              year: -5,    era: "Life of Jesus",     book: "Matthew 1; Luke 2" },
  { label: "Flight to Egypt",             year: -4,    era: "Life of Jesus",     book: "Matthew 2" },
  { label: "Jesus at the Temple (age 12)",year: 8,     era: "Life of Jesus",     book: "Luke 2" },
  { label: "John the Baptist's ministry", year: 26,    era: "Life of Jesus",     book: "Mark 1" },
  { label: "Baptism of Jesus",            year: 27,    era: "Life of Jesus",     book: "Matthew 3" },
  { label: "Sermon on the Mount",         year: 28,    era: "Life of Jesus",     book: "Matthew 5–7" },
  { label: "Feeding of the 5,000",        year: 29,    era: "Life of Jesus",     book: "John 6" },
  { label: "Transfiguration",             year: 29,    era: "Life of Jesus",     book: "Matthew 17" },
  { label: "Triumphal Entry",             year: 30,    era: "Life of Jesus",     book: "Matthew 21" },
  { label: "Last Supper",                 year: 30,    era: "Life of Jesus",     book: "Matthew 26" },
  { label: "Crucifixion & Resurrection",  year: 30,    era: "Life of Jesus",     book: "Matthew 27–28" },

  // Early Church
  { label: "Pentecost & the Church born", year: 30,    era: "Early Church",      book: "Acts 2" },
  { label: "Stephen martyred",            year: 35,    era: "Early Church",      book: "Acts 7" },
  { label: "Paul's conversion",           year: 35,    era: "Early Church",      book: "Acts 9" },
  { label: "Paul's first journey",        year: 46,    era: "Early Church",      book: "Acts 13–14" },
  { label: "Jerusalem Council",           year: 49,    era: "Early Church",      book: "Acts 15" },
  { label: "Paul writes to the Galatians",year: 49,    era: "Early Church",      book: "Galatians" },
  { label: "Paul's second journey",       year: 50,    era: "Early Church",      book: "Acts 16–18" },
  { label: "Paul writes 1 Corinthians",   year: 55,    era: "Early Church",      book: "1 Corinthians" },
  { label: "Paul writes Romans",          year: 57,    era: "Early Church",      book: "Romans" },
  { label: "Paul arrested in Jerusalem",  year: 58,    era: "Early Church",      book: "Acts 21" },
  { label: "Paul's death",               year: 67,    era: "Early Church" },
  { label: "Jerusalem & Temple destroyed",year: 70,    era: "Early Church",      book: "Matthew 24" },

  // Late NT
  { label: "John's Gospel written",       year: 90,    era: "Late NT",           book: "John" },
  { label: "John exiled to Patmos",       year: 95,    era: "Late NT",           book: "Revelation 1" },
  { label: "Revelation written",          year: 95,    era: "Late NT",           book: "Revelation" },
];
