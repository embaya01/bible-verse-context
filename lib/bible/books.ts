export type BibleBook = {
  name: string;
  slug: string;
  testament: "OT" | "NT";
  chapters: number;
  aliases: string[];
};

export const BOOKS: BibleBook[] = [
  { name: "Genesis", slug: "genesis", testament: "OT", chapters: 50, aliases: ["gen"] },
  { name: "Exodus", slug: "exodus", testament: "OT", chapters: 40, aliases: ["ex", "exo"] },
  { name: "Leviticus", slug: "leviticus", testament: "OT", chapters: 27, aliases: ["lev"] },
  { name: "Numbers", slug: "numbers", testament: "OT", chapters: 36, aliases: ["num"] },
  { name: "Deuteronomy", slug: "deuteronomy", testament: "OT", chapters: 34, aliases: ["deut", "dt"] },
  { name: "Joshua", slug: "joshua", testament: "OT", chapters: 24, aliases: ["josh"] },
  { name: "Judges", slug: "judges", testament: "OT", chapters: 21, aliases: ["judg"] },
  { name: "Ruth", slug: "ruth", testament: "OT", chapters: 4, aliases: [] },
  { name: "1 Samuel", slug: "1-samuel", testament: "OT", chapters: 31, aliases: ["1 sam", "1sam", "i sam"] },
  { name: "2 Samuel", slug: "2-samuel", testament: "OT", chapters: 24, aliases: ["2 sam", "2sam", "ii sam"] },
  { name: "1 Kings", slug: "1-kings", testament: "OT", chapters: 22, aliases: ["1 kgs", "1kgs"] },
  { name: "2 Kings", slug: "2-kings", testament: "OT", chapters: 25, aliases: ["2 kgs", "2kgs"] },
  { name: "1 Chronicles", slug: "1-chronicles", testament: "OT", chapters: 29, aliases: ["1 chr", "1chr"] },
  { name: "2 Chronicles", slug: "2-chronicles", testament: "OT", chapters: 36, aliases: ["2 chr", "2chr"] },
  { name: "Ezra", slug: "ezra", testament: "OT", chapters: 10, aliases: [] },
  { name: "Nehemiah", slug: "nehemiah", testament: "OT", chapters: 13, aliases: ["neh"] },
  { name: "Esther", slug: "esther", testament: "OT", chapters: 10, aliases: ["est"] },
  { name: "Job", slug: "job", testament: "OT", chapters: 42, aliases: [] },
  { name: "Psalms", slug: "psalms", testament: "OT", chapters: 150, aliases: ["ps", "psalm"] },
  { name: "Proverbs", slug: "proverbs", testament: "OT", chapters: 31, aliases: ["prov", "pr"] },
  { name: "Ecclesiastes", slug: "ecclesiastes", testament: "OT", chapters: 12, aliases: ["eccl", "ecc"] },
  { name: "Song of Solomon", slug: "song-of-solomon", testament: "OT", chapters: 8, aliases: ["song", "sos", "song of songs"] },
  { name: "Isaiah", slug: "isaiah", testament: "OT", chapters: 66, aliases: ["isa"] },
  { name: "Jeremiah", slug: "jeremiah", testament: "OT", chapters: 52, aliases: ["jer"] },
  { name: "Lamentations", slug: "lamentations", testament: "OT", chapters: 5, aliases: ["lam"] },
  { name: "Ezekiel", slug: "ezekiel", testament: "OT", chapters: 48, aliases: ["ezek", "eze"] },
  { name: "Daniel", slug: "daniel", testament: "OT", chapters: 12, aliases: ["dan"] },
  { name: "Hosea", slug: "hosea", testament: "OT", chapters: 14, aliases: ["hos"] },
  { name: "Joel", slug: "joel", testament: "OT", chapters: 3, aliases: [] },
  { name: "Amos", slug: "amos", testament: "OT", chapters: 9, aliases: [] },
  { name: "Obadiah", slug: "obadiah", testament: "OT", chapters: 1, aliases: ["obad"] },
  { name: "Jonah", slug: "jonah", testament: "OT", chapters: 4, aliases: ["jon"] },
  { name: "Micah", slug: "micah", testament: "OT", chapters: 7, aliases: ["mic"] },
  { name: "Nahum", slug: "nahum", testament: "OT", chapters: 3, aliases: ["nah"] },
  { name: "Habakkuk", slug: "habakkuk", testament: "OT", chapters: 3, aliases: ["hab"] },
  { name: "Zephaniah", slug: "zephaniah", testament: "OT", chapters: 3, aliases: ["zeph"] },
  { name: "Haggai", slug: "haggai", testament: "OT", chapters: 2, aliases: ["hag"] },
  { name: "Zechariah", slug: "zechariah", testament: "OT", chapters: 14, aliases: ["zech"] },
  { name: "Malachi", slug: "malachi", testament: "OT", chapters: 4, aliases: ["mal"] },
  { name: "Matthew", slug: "matthew", testament: "NT", chapters: 28, aliases: ["matt", "mt"] },
  { name: "Mark", slug: "mark", testament: "NT", chapters: 16, aliases: ["mk"] },
  { name: "Luke", slug: "luke", testament: "NT", chapters: 24, aliases: ["lk"] },
  { name: "John", slug: "john", testament: "NT", chapters: 21, aliases: ["jn"] },
  { name: "Acts", slug: "acts", testament: "NT", chapters: 28, aliases: ["ac"] },
  { name: "Romans", slug: "romans", testament: "NT", chapters: 16, aliases: ["rom"] },
  { name: "1 Corinthians", slug: "1-corinthians", testament: "NT", chapters: 16, aliases: ["1 cor", "1cor"] },
  { name: "2 Corinthians", slug: "2-corinthians", testament: "NT", chapters: 13, aliases: ["2 cor", "2cor"] },
  { name: "Galatians", slug: "galatians", testament: "NT", chapters: 6, aliases: ["gal"] },
  { name: "Ephesians", slug: "ephesians", testament: "NT", chapters: 6, aliases: ["eph"] },
  { name: "Philippians", slug: "philippians", testament: "NT", chapters: 4, aliases: ["phil", "php"] },
  { name: "Colossians", slug: "colossians", testament: "NT", chapters: 4, aliases: ["col"] },
  { name: "1 Thessalonians", slug: "1-thessalonians", testament: "NT", chapters: 5, aliases: ["1 thess", "1thess"] },
  { name: "2 Thessalonians", slug: "2-thessalonians", testament: "NT", chapters: 3, aliases: ["2 thess", "2thess"] },
  { name: "1 Timothy", slug: "1-timothy", testament: "NT", chapters: 6, aliases: ["1 tim", "1tim"] },
  { name: "2 Timothy", slug: "2-timothy", testament: "NT", chapters: 4, aliases: ["2 tim", "2tim"] },
  { name: "Titus", slug: "titus", testament: "NT", chapters: 3, aliases: ["tit"] },
  { name: "Philemon", slug: "philemon", testament: "NT", chapters: 1, aliases: ["phlm"] },
  { name: "Hebrews", slug: "hebrews", testament: "NT", chapters: 13, aliases: ["heb"] },
  { name: "James", slug: "james", testament: "NT", chapters: 5, aliases: ["jas"] },
  { name: "1 Peter", slug: "1-peter", testament: "NT", chapters: 5, aliases: ["1 pet", "1pet"] },
  { name: "2 Peter", slug: "2-peter", testament: "NT", chapters: 3, aliases: ["2 pet", "2pet"] },
  { name: "1 John", slug: "1-john", testament: "NT", chapters: 5, aliases: ["1 jn", "1jn"] },
  { name: "2 John", slug: "2-john", testament: "NT", chapters: 1, aliases: ["2 jn", "2jn"] },
  { name: "3 John", slug: "3-john", testament: "NT", chapters: 1, aliases: ["3 jn", "3jn"] },
  { name: "Jude", slug: "jude", testament: "NT", chapters: 1, aliases: [] },
  { name: "Revelation", slug: "revelation", testament: "NT", chapters: 22, aliases: ["rev", "rv"] },
];

const BOOK_BY_SLUG = new Map(BOOKS.map((b) => [b.slug, b]));

const BOOK_BY_LOOKUP = new Map<string, BibleBook>();
for (const book of BOOKS) {
  BOOK_BY_LOOKUP.set(book.name.toLowerCase(), book);
  BOOK_BY_LOOKUP.set(book.slug, book);
  for (const alias of book.aliases) {
    BOOK_BY_LOOKUP.set(alias.toLowerCase(), book);
  }
}

export function getBookBySlug(slug: string): BibleBook | undefined {
  return BOOK_BY_SLUG.get(slug.toLowerCase());
}

export function isValidChapter(book: BibleBook, chapter: number): boolean {
  return Number.isInteger(chapter) && chapter >= 1 && chapter <= book.chapters;
}

export type ParsedReference = {
  book: BibleBook;
  chapter: number;
};

/**
 * Parse free-text references like "John 3", "1 cor 13", "Psalm 23".
 * Returns null on anything we can't confidently resolve.
 */
export function parseReference(input: string): ParsedReference | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  const match = trimmed.match(/^([1-3]?\s?[a-z][a-z\s]*?)\s+(\d+)$/i);
  if (!match) return null;

  const bookKey = match[1].replace(/\s+/g, " ").trim();
  const chapter = parseInt(match[2], 10);
  const book = BOOK_BY_LOOKUP.get(bookKey);
  if (!book) return null;
  if (!isValidChapter(book, chapter)) return null;

  return { book, chapter };
}
