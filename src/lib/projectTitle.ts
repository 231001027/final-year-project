/** Removes the "Title1 - ", "Title2 - ", etc. prefix from stored project titles. */
export function stripProjectTitlePrefix(title: string): string {
  return title.replace(/^Title\d+\s*-\s*/i, '').trim();
}
