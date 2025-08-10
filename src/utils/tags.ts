export function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')   // spaces/punctuation → hyphens
    .replace(/^-+|-+$/g, '');      // trim hyphens
}
