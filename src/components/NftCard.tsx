import { Link } from '@tanstack/react-router'
import { Heart, ShoppingCart, ArrowUpRight } from 'lucide-react'
import type { Nft } from '../types'
import { Art } from './Art'
import { useMarketplace } from '../state/MarketplaceContext'
import { money } from '../data'

export function NftCard({ nft }: { nft: Nft }) {
  const { addToCart, toggleFavorite, favorites } = useMarketplace()
  return <article className="nft-card">
    <div className="nft-art">
      <Link to="/nft/$nftId" params={{ nftId: nft.id }} aria-label={'Ver ' + nft.name}><Art variant={nft.variant}/></Link>
      {nft.rare && <span className="nft-tag">RARO</span>}
      <div className="card-actions">
        <button type="button" aria-label={'Adicionar ' + nft.name + ' ao carrinho'} title="Adicionar ao carrinho" onClick={() => addToCart(nft.id)}><ShoppingCart size={17}/></button>
        <button type="button" aria-label={'Favoritar ' + nft.name} title="Favorito" onClick={() => toggleFavorite(nft.id)} className={favorites.includes(nft.id) ? 'favorited' : ''}><Heart size={17} fill={favorites.includes(nft.id) ? 'currentColor' : 'none'}/></button>
        <Link to="/nft/$nftId" params={{ nftId: nft.id }} aria-label={'Detalhes de ' + nft.name}><ArrowUpRight size={17}/></Link>
      </div>
    </div>
    <Link className="nft-name" to="/nft/$nftId" params={{ nftId: nft.id }}>{nft.name}</Link>
    <div className="nft-price">{money(nft.price)} {nft.oldPrice && <s>{money(nft.oldPrice)}</s>}</div>
  </article>
}
