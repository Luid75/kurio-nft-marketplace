import { initialFilters } from '../lib/search'
import { useState } from 'react'
import { Link, useParams, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Heart, Minus, Plus, ShoppingCart, Star, ShieldCheck } from 'lucide-react'
import { getNft } from '../lib/api'
import { Art } from '../components/Art'
import { NftCard } from '../components/NftCard'
import { nfts, money } from '../data'
import { useMarketplace } from '../state/MarketplaceContext'
import { Button } from '../components/ui/Button'

export function NftDetails() {
  const { nftId } = useParams({ from: '/nft/$nftId' })
  const router = useRouter()
  const [selectedView, setSelectedView] = useState(0)
  const goBack = () => { if (document.referrer.startsWith(window.location.origin) && window.history.length > 1) window.history.back(); else void router.navigate({ to: '/', search: initialFilters }) }
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'details' | 'reviews'>('details')
  const { addToCart, toggleFavorite, favorites } = useMarketplace()
  const { data: nft, isPending, isError, error, refetch } = useQuery({ queryKey: ['nft', nftId], queryFn: () => getNft(nftId), retry: false })
  if (isPending) return <div className="container state-panel page-gap">Carregando NFT...</div>
  if (isError || !nft) return <div className="container state-panel page-gap"><h2>NFT não encontrado</h2><p>{error instanceof Error ? error.message : 'O item solicitado não está disponível.'}</p><Button onClick={() => void refetch()}>Tentar novamente</Button> <Link to="/" search={initialFilters}>Voltar ao mercado</Link></div>
  const available = Math.min(20, nft.maxEdition - nft.edition + 1)
  return <div className="container detail-page">
    <div className="breadcrumbs"><button type="button" className="back-link" onClick={goBack} aria-label="Voltar à página anterior">← Voltar</button> <Link to="/" search={initialFilters}>Início</Link> <ChevronRight size={14}/> <Link to="/" search={initialFilters}>Mercado</Link> <ChevronRight size={14}/> {nft.name}</div>
    <div className="detail-hero">
      <div className="detail-gallery"><div className="gallery-thumbnails">{Array.from({length:4},(_,index)=><button className={index===selectedView?'selected':''} key={index} type="button" onClick={()=>setSelectedView(index)} aria-pressed={index===selectedView} aria-label={'Vista '+(index+1)}><Art variant={nft.variant}/></button>)}</div><div className="detail-primary-art"><div className={"detail-art-view detail-art-view-" + selectedView}><Art variant={nft.variant}/></div></div></div>
      <div className="detail-info">
        <h1>{nft.name}</h1><strong className="detail-price">{money(nft.price)}</strong>
        <p className="rating"><Star size={14} fill="currentColor"/> <Star size={14} fill="currentColor"/> <Star size={14} fill="currentColor"/> <Star size={14} fill="currentColor"/> <Star size={14} fill="currentColor"/> <span>19 avaliações de colecionadores</span></p>
        <hr/><h4>Sobre este NFT:</h4><p>{nft.description}</p><h4>Edição:</h4>
        <div className="edition-pills"><span>1/1</span><span>{nft.edition}/{nft.maxEdition}</span><span>{available > 0 ? 'ABERTA' : 'ESGOTADA'}</span></div>
        <div className="purchase-row"><div className="quantity-control"><button aria-label="Diminuir quantidade" disabled={quantity<=1} onClick={()=>setQuantity(current=>Math.max(1,current-1))}><Minus size={16}/></button><span>{quantity}</span><button aria-label="Aumentar quantidade" disabled={quantity>=available} onClick={()=>setQuantity(current=>Math.min(available,current+1))}><Plus size={16}/></button></div><Button disabled={!available} onClick={()=>addToCart(nft.id,quantity)}><ShoppingCart size={16}/> Adicionar ao carrinho</Button><Button variant="outline" onClick={()=>toggleFavorite(nft.id)}><Heart size={16} fill={favorites.includes(nft.id)?'currentColor':'none'}/> Favoritar</Button></div>
        <p className="detail-meta">ID do token: {nft.tokenId}</p><p className="detail-meta">Coleção: {nft.artist}</p><p className="detail-meta">Atributos: {nft.category}, edição limitada</p><p className="detail-meta"><ShieldCheck size={15}/> Rede: {nft.network}</p>
      </div>
    </div>
    <section className="detail-description"><div className="section-tabs"><button className={tab==='details'?'active':''} onClick={()=>setTab('details')}>Detalhes do NFT</button><button className={tab==='reviews'?'active':''} onClick={()=>setTab('reviews')}>Avaliações de colecionadores (19)</button></div>{tab==='details'? <div><p>{nft.name} é uma obra digital da coleção {nft.artist}. Cada edição possui atributos próprios e uma identidade visual criada para colecionadores que apreciam arte digital.</p><p>A propriedade inclui acesso ao colecionável digital e ao registro de procedência na rede simulada desta demonstração.</p><h4>Rede:</h4><p>{nft.network}, com dados simulados para esta experiência.</p><h4>Contrato:</h4><p>Transações demonstrativas; nenhum contrato real é utilizado.</p><h4>Direitos autorais:</h4><p>O criador mantém os direitos autorais da obra.</p></div> : <div><p>As avaliações nesta demonstração são ilustrativas.</p><p>Os colecionadores destacam a identidade visual e o conceito da coleção.</p></div>}</section>
    <section className="related"><h3>Mais desta coleção</h3><div className="related-grid">{nfts.filter(item=>item.id!==nft.id).slice(0,5).map(item=><NftCard key={item.id} nft={item}/>)}</div></section>
  </div>
}
