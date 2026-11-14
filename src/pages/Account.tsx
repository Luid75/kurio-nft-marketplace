import { Link } from '@tanstack/react-router'
import { Heart, LogOut, Wallet } from 'lucide-react'
import { useMarketplace } from '../state/MarketplaceContext'
import { readStored } from '../lib/storage'
import { nfts, money } from '../data'
import { NftCard } from '../components/NftCard'
import type { Order } from '../types'
import { Button } from '../components/ui/Button'

export function Account() {
  const { collector, favorites, signOut, setAuthMode, setAuthOpen } = useMarketplace()
  if (!collector) return <div className="container state-panel page-gap"><h2>Seu espaço de colecionador</h2><p>Entre para ver favoritos, pedidos e carteiras.</p><Button onClick={()=>{setAuthMode('login');setAuthOpen(true)}}>Entrar</Button></div>
  const orders = readStored<Order[]>('kurio:orders:' + collector.id, [])
  const saved = nfts.filter(item=>favorites.includes(item.id))
  return <div className="container account-page"><div className="account-top"><div><span className="eyebrow">Meu perfil</span><h1>{collector.name}</h1><p>{collector.email}</p></div><Button variant="outline" onClick={signOut}><LogOut size={16}/> Sair da conta</Button></div>
    <div className="account-stats"><div><Heart size={21}/><strong>{favorites.length}</strong><span>Favoritos</span></div><div><Wallet size={21}/><Link to="/wallets">Gerenciar carteiras</Link></div><div><strong>{orders.length}</strong><span>Pedidos</span></div></div>
    <section className="account-section"><h2>Minha lista de favoritos</h2>{saved.length?<div className="related-grid">{saved.map(nft=><NftCard nft={nft} key={nft.id}/>)}</div>:<p>Você ainda não favoritou nenhum NFT. <Link to="/">Explorar o mercado</Link></p>}</section>
    <section className="account-section"><h2>Histórico de pedidos</h2>{orders.length?orders.map(order=><Link key={order.id} className="history-order" to="/order/$orderId" params={{orderId:order.id}}><span>{order.id}</span><span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span><strong>{money(order.quote.total)}</strong><span>{order.status==='confirmed'?'Confirmado':order.status}</span></Link>):<p>Nenhum pedido realizado até o momento.</p>}</section>
  </div>
}
