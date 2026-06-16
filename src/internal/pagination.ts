/**
 * Cursor-based pagination metadata returned by list endpoints. Cursors are
 * opaque strings; pass `next`/`prev` back via the `after`/`before` parameters
 * to page through results.
 */
export interface PageInfo {
  next?: string;
  prev?: string;
}

/** A single page of a paginated list response. */
export interface Page<T> {
  data: T[];
  pageInfo: PageInfo;
}

/**
 * Drives an async iterator that auto-follows `next` cursors, yielding each item
 * across all pages. `fetchPage` is called once per page with the current
 * `after` cursor (undefined for the first page).
 */
export async function* paginate<T>(
  fetchPage: (after: string | undefined) => Promise<Page<T>>,
): AsyncGenerator<T, void, undefined> {
  let after: string | undefined;
  do {
    const page = await fetchPage(after);
    for (const item of page.data) {
      yield item;
    }
    after = page.pageInfo.next;
  } while (after);
}
