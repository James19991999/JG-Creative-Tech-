export type SearchableFields = {
  title: string;
  description: string;
  category: string;
};

/**
 * Scores how well `query` fuzzy-matches `target`. Returns null for no
 * match, otherwise a score where higher is better. Characters of the
 * query must appear in target IN ORDER but not necessarily
 * contiguously (so "svcs" matches "Services"). Contiguous and
 * word-boundary matches score higher than scattered ones, so "sol"
 * ranks "Solutions" above a page that merely contains the letters
 * s-o-l scattered somewhere in a long description.
 */
export function fuzzyMatch(query: string, target: string): number | null {
  if (query.length === 0) return 0;

  const q = query.toLowerCase();
  const t = target.toLowerCase();

  let score = 0;
  let targetIndex = 0;
  let consecutiveRun = 0;

  for (let i = 0; i < q.length; i++) {
    const char = q[i];
    const foundAt = t.indexOf(char, targetIndex);
    if (foundAt === -1) return null;

    const isConsecutive = foundAt === targetIndex;
    const isWordStart = foundAt === 0 || /[\s\-/]/.test(t[foundAt - 1]);

    if (isConsecutive) {
      consecutiveRun += 1;
      score += 3 + consecutiveRun; // reward longer consecutive runs
    } else {
      consecutiveRun = 0;
      score += 1;
    }
    if (isWordStart) score += 4;

    targetIndex = foundAt + 1;
  }

  // Bonus for the match starting right at the beginning of the string
  if (t.startsWith(q)) score += 10;
  // Small penalty for very long targets so shorter, more precise
  // titles don't get buried under long descriptions matching by luck
  score -= Math.min(5, Math.floor(t.length / 40));

  return score;
}

export type SearchResult<T> = {
  item: T;
  score: number;
};

/**
 * Ranks `items` against `query` using a weighted blend of the title,
 * category, and description fields - title matches count far more
 * than description matches, so searching "insights" surfaces the
 * Insights page itself before any blog post whose body happens to
 * contain the word.
 */
export function fuzzySearch<T extends SearchableFields>(
  query: string,
  items: T[],
  limit = 8
): SearchResult<T>[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];

  const results: SearchResult<T>[] = [];

  for (const item of items) {
    const titleScore = fuzzyMatch(trimmed, item.title);
    const categoryScore = fuzzyMatch(trimmed, item.category);
    const descriptionScore = fuzzyMatch(trimmed, item.description);

    if (titleScore === null && categoryScore === null && descriptionScore === null) {
      continue;
    }

    const combined =
      (titleScore ?? 0) * 3 + (categoryScore ?? 0) * 1.5 + (descriptionScore ?? 0) * 1;

    results.push({ item, score: combined });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
