export const CATALOGUE_CATEGORIES = ['All', 'Tops', 'Denim', 'Trousers'] as const

export type CatalogueCategory = (typeof CATALOGUE_CATEGORIES)[number]

export type CatalogueProduct = {
  id: string
  name: string
  category: Exclude<CatalogueCategory, 'All'>
  headline: [string, string]
  line: string
  image: string
  panel: string
}

export const CATALOGUE_PRODUCTS: CatalogueProduct[] = [
  {
    id: 'striped-jersey',
    name: 'Striped football jersey',
    category: 'Tops',
    headline: ['A jersey', 'for the lot'],
    line: 'A striped football jersey shown for sourcing, not sold by the piece.',
    image: '/catalogue/striped-jersey.png',
    panel: '#3a2430',
  },
  {
    id: 'cable-polo',
    name: 'Cable polo',
    category: 'Tops',
    headline: ['Cable knit,', 'cut close'],
    line: 'A short-sleeve cable polo for knit programmes bought in volume.',
    image: '/catalogue/cable-polo.png',
    panel: '#1c1e22',
  },
  {
    id: 'brown-polo',
    name: 'Brown knit polo',
    category: 'Tops',
    headline: ['A polo', 'in brown knit'],
    line: 'A buttoned knit polo for ranges that buy tops by the lot.',
    image: '/catalogue/brown-polo.png',
    panel: '#3a2e26',
  },
  {
    id: 'blue-tee',
    name: 'Blue tee',
    category: 'Tops',
    headline: ['A plain tee,', 'ready to scale'],
    line: 'An oversized blue tee for basics programmes sourced in quantity.',
    image: '/catalogue/blue-tee.png',
    panel: '#243044',
  },
  {
    id: 'blueberry-tee',
    name: 'Blueberry tee',
    category: 'Tops',
    headline: ['A print', 'on cotton'],
    line: 'A graphic tee shown for sourcing across markets.',
    image: '/catalogue/blueberry-tee.png',
    panel: '#2c3330',
  },
  {
    id: 'crest-sweatshirt',
    name: 'Crest sweatshirt',
    category: 'Tops',
    headline: ['A sweatshirt', 'with a crest'],
    line: 'A crested sweatshirt for apparel lots, not single retail.',
    image: '/catalogue/crest-sweatshirt.png',
    panel: '#242428',
  },
  {
    id: 'grid-shirt',
    name: 'Grid shirt',
    category: 'Tops',
    headline: ['A shirt', 'on a grid'],
    line: 'A printed camp shirt for fashion ranges bought in volume.',
    image: '/catalogue/grid-shirt.png',
    panel: '#2a2e33',
  },
  {
    id: 'washed-jeans',
    name: 'Washed wide jeans',
    category: 'Denim',
    headline: ['Wide denim,', 'washed through'],
    line: 'Washed wide-leg jeans for denim programmes sourced by the lot.',
    image: '/catalogue/washed-jeans.png',
    panel: '#2c3340',
  },
  {
    id: 'faded-jeans',
    name: 'Faded wide jeans',
    category: 'Denim',
    headline: ['Faded denim,', 'cut wide'],
    line: 'Faded wide-leg jeans shown for sourcing, not priced for sale.',
    image: '/catalogue/faded-jeans.png',
    panel: '#32363c',
  },
  {
    id: 'light-jeans',
    name: 'Light wide jeans',
    category: 'Denim',
    headline: ['Light wash,', 'full length'],
    line: 'Light-wash wide jeans for denim ranges bought in quantity.',
    image: '/catalogue/light-jeans.png',
    panel: '#3a4048',
  },
  {
    id: 'indigo-jeans',
    name: 'Indigo wide jeans',
    category: 'Denim',
    headline: ['Indigo,', 'held wide'],
    line: 'Dark indigo wide-leg jeans for bulk denim supply.',
    image: '/catalogue/indigo-jeans.png',
    panel: '#1e2833',
  },
  {
    id: 'olive-trousers',
    name: 'Olive wide trousers',
    category: 'Trousers',
    headline: ['Olive cloth,', 'cut wide'],
    line: 'Wide olive trousers for trouser programmes sourced by the lot.',
    image: '/catalogue/olive-trousers.png',
    panel: '#2e332c',
  },
]

export function catalogueProduct(id: string): CatalogueProduct {
  return CATALOGUE_PRODUCTS.find((product) => product.id === id) ?? CATALOGUE_PRODUCTS[0]
}
