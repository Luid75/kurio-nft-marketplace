import type { Nft, Category } from './types'

export const categories: Array<{ name: Category; count: number }> = [
  { name: 'Arte digital', count: 33 },
  { name: 'Fotografia', count: 12 },
  { name: 'Música', count: 65 },
  { name: 'Arte 3D', count: 39 },
  { name: 'Colecionáveis', count: 23 },
  { name: 'Generativa', count: 17 },
  { name: 'Jogos', count: 19 },
  { name: 'Assinaturas', count: 13 },
  { name: 'Utilidade', count: 18 },
]

const description = 'Um colecionável digital de edição limitada da coleção Kurio Editions. Uma obra criada para colecionadores, com identidade visual marcante e procedência registrada na rede.'

export const nfts: Nft[] = [
  { id: 'emerald-ape-042', name: 'Emerald Ape #042', tokenId: '#0042', price: '1.19', category: 'Arte digital', network: 'Ethereum', edition: 1, maxEdition: 50, artist: 'Kurio Editions', variant: 'emerald', description, rare: true },
  { id: 'sage-nomad-009', name: 'Sage Nomad #009', tokenId: '#0009', price: '1.69', category: 'Colecionáveis', network: 'Polygon', edition: 8, maxEdition: 25, artist: 'Nova Sato', variant: 'nomad', description },
  { id: 'neon-vessel-552', name: 'Neon Vessel #552', tokenId: '#0552', price: '1.99', oldPrice: '2.29', category: 'Arte digital', network: 'Ethereum', edition: 2, maxEdition: 15, artist: 'Kurio Editions', variant: 'baron', description, rare: true },
  { id: 'cosmic-bloom-118', name: 'Cosmic Bloom #118', tokenId: '#0118', price: '1.29', category: 'Arte 3D', network: 'Solana', edition: 3, maxEdition: 40, artist: 'Nova Sato', variant: 'nomad', description },
  { id: 'violet-nomad-314', name: 'Violet Nomad #314', tokenId: '#0314', price: '1.39', category: 'Fotografia', network: 'Polygon', edition: 14, maxEdition: 60, artist: 'Nora Li', variant: 'nomad', description },
  { id: 'ivory-baron-088', name: 'Ivory Baron #088', tokenId: '#0088', price: '1.79', category: 'Arte digital', network: 'Ethereum', edition: 1, maxEdition: 40, artist: 'Kurio Editions', variant: 'baron', description },
  { id: 'golden-beat-207', name: 'Golden Beat #207', tokenId: '#0207', price: '0.99', category: 'Música', network: 'Solana', edition: 7, maxEdition: 100, artist: 'Milo Beats', variant: 'golden', description },
  { id: 'golden-frequency-071', name: 'Golden Frequency #071', tokenId: '#0071', price: '0.59', category: 'Generativa', network: 'Polygon', edition: 15, maxEdition: 100, artist: 'Milo Beats', variant: 'golden', description },
  { id: 'golden-signal-160', name: 'Golden Signal #160', tokenId: '#0160', price: '0.39', category: 'Jogos', network: 'Solana', edition: 38, maxEdition: 200, artist: 'Milo Beats', variant: 'golden', description },
  { id: 'emerald-classic-041', name: 'Emerald Classic #041', tokenId: '#0041', price: '2.39', category: 'Arte digital', network: 'Ethereum', edition: 1, maxEdition: 10, artist: 'Kurio Editions', variant: 'emerald', description },
  { id: 'sage-drifter-119', name: 'Sage Drifter #119', tokenId: '#0119', price: '0.89', category: 'Assinaturas', network: 'Polygon', edition: 4, maxEdition: 80, artist: 'Nova Sato', variant: 'nomad', description },
  { id: 'baron-legacy-300', name: 'Baron Legacy #300', tokenId: '#0300', price: '3.29', category: 'Utilidade', network: 'Ethereum', edition: 1, maxEdition: 5, artist: 'Kurio Editions', variant: 'baron', description },
]

export const money = (amount: string) => Number(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) + ' ETH'
