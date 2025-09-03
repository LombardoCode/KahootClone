/**
 * Purpose of this file:
 * Saves and retrieves the recent searches that the user has performed
 * on the Dashboard text-box.
 */

const key: string = "recent_searches";

export const saveKahootSearch = (recentSearch: string) => {
  const desiredRecentSearchesNum: number = 5;
  recentSearch = recentSearch.trim().toLowerCase();

  if (recentSearch === "") {
    return;
  }

  let stored: string | null = localStorage.getItem(key);
  
  if (stored === null) {
    localStorage.setItem(key, `["${recentSearch}"]`);
    return;
  }

  let searches: string[] = JSON.parse(stored) as string[];

  if (searches.includes(recentSearch)) {
    const index: number = searches.indexOf(recentSearch);
    searches.splice(index, 1);
  }

  searches.unshift(recentSearch);

  if (searches.length > desiredRecentSearchesNum) {
    searches.pop();
  }

  localStorage.setItem(key, JSON.stringify(searches));
}

export const getRecentSearches = (): string[] => {
  let stored: string | null = localStorage.getItem(key);

  if (stored === null || stored === "") {
    const emptyArray: string[] = [];
    localStorage.setItem(key, JSON.stringify(emptyArray));
    return emptyArray;
  }

  let searches: string[] = JSON.parse(stored) as string[];
  return searches;
}
