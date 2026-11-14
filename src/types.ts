export type Network = 'Ethereum' | 'Polygon' | 'Solana'
export type Category = 'Arte digital' | 'Fotografia' | 'Música' | 'Arte 3D' | 'Colecionáveis' | 'Generativa' | 'Jogos' | 'Assinaturas' | 'Utilidade'
export type ArtVariant = 'emerald' | 'nomad' | 'baron' | 'golden'

export interface Nft {
  id: string
  name: string
  tokenId: string
  price: string
  oldPrice?: string
  category: Category
  network: Network
  edition: number
  maxEdition: number
  artist: string
  variant: ArtVariant
  rare?: boolean
  description: string
}

export interface CartLine { id: string; quantity: number }
export interface Collector { id: string; name: string; email: string }
export interface Wallet { id: string; name: string; network: Network; address: string }
export interface Quote { subtotal: string; discount: string; networkFee: string; total: string; coupon?: string }
export interface Order {
  id: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'declined'
  items: Array<{ nft: Nft; quantity: number; price: string }>
  quote: Quote
  collector: Collector
  wallet: string
}
export interface CatalogResponse { items: Nft[]; total: number; page: number; pages: number }
