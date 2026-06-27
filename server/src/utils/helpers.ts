export function omitPassword<T extends { password_hash?: string }>(row: T) {
  const { password_hash: _, ...rest } = row;
  return rest;
}

/** Removes the "Title1 - ", "Title2 - ", etc. prefix from stored project titles. */
export function cleanProjectTitle(title: string) {
  return title.replace(/^Title\d+\s*-\s*/i, '').trim();
}

export function mapProjectRow(row: Record<string, unknown>) {
  const mapped = mapTimestamps(row);
  return mapped;
}

export function mapTimestamps(row: Record<string, unknown>) {
  return {
    ...row,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
    selection_date:
      row.selection_date instanceof Date ? row.selection_date.toISOString() : row.selection_date ?? null,
    allocation_date:
      row.allocation_date instanceof Date ? row.allocation_date.toISOString() : row.allocation_date,
  };
}
