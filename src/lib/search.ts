export type CatalogSearch = {
  search: string
  category: string
  network: string
  sort: string
  min: string
  max: string
  page: number
}
export const initialFilters: CatalogSearch = {
  search: '', category: '', network: '', sort: 'recent', min: '0', max: '12.3', page: 1,
}
export function parseFilters(search: Record<string, unknown>): CatalogSearch {
  const string = (key: keyof CatalogSearch, fallback: string) => typeof search[key] === 'string' ? search[key] as string : fallback
  const page = Number(search.page)
  return {
    search: string('search', ''),
    category: string('category', ''),
    network: string('network', ''),
    sort: string('sort', 'recent'),
    min: string('min', '0'),
    max: string('max', '12.3'),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}
