import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useMarketplace } from '../state/MarketplaceContext'
import { getQuote } from '../lib/api'
import { errorMessage } from '../lib/utils'
import { nfts, money } from '../data'
import { Art } from '../components/Art'
import { NftCard } from '../components/NftCard'
import { Button } from '../components/ui/Button'

export function Cart() {
  const { cart, updateQuantity, removeFromCart, collector, setAuthMode, setAuthOpen } = useMarketplace()
  const [couponText, setCouponText] = useState('')
  const [coupon, setCoupon] = useState('')
  const lines = cart.flatMap(line => {
    const nft = nfts.find(item => item.id === line.id)
    return nft ? [{...line,nft}] : []
  })
  const quote = useQuery({ queryKey:['quote',cart,coupon], queryFn:()=>getQuote(cart,coupon), enabled:cart.length>0, retry:false })
  function applyCoupon(event: FormEvent) { event.preventDefault(); setCoupon(couponText.trim().toUpperCase()) }
  function requestLogin() { setAuthMode('login'); setAuthOpen(true) }
  return <div className="container cart-page">
    <div className="breadcrumbs"><Link to="/">Início</Link> / <Link to="/">Mercado</Link> / Carrinho</div>
    <h1 className="page-title">Carrinho de NFTs</h1>
    {!lines.length ? <div className="state-panel empty-cart"><ShoppingBag size={34}/><h2>Seu carrinho está vazio</h2><p>Encontre um NFT para começar sua coleção.</p><Link className="ui-button ui-button-primary ui-button-default" to="/">Explorar mercado</Link></div> :
      <div className="cart-layout">
        <div className="cart-products"><div className="cart-head"><span>NFTs</span><span>Preço</span><span>Edições</span><span>Total</span></div>
          {lines.map(({nft,quantity})=><div className="cart-line" key={nft.id}>
            <div className="cart-product"><Link to="/nft/$nftId" params={{nftId:nft.id}}><Art variant={nft.variant}/></Link><div><Link to="/nft/$nftId" params={{nftId:nft.id}}>{nft.name}</Link><small>ID do token: {nft.tokenId}</small></div></div>
            <span>{money(nft.price)}</span>
            <div className="quantity-control small"><button aria-label={'Diminuir '+nft.name} disabled={quantity<=1} onClick={()=>updateQuantity(nft.id,quantity-1)}><Minus size={13}/></button>{quantity}<button aria-label={'Aumentar '+nft.name} disabled={quantity>=Math.min(20,nft.maxEdition-nft.edition+1)} onClick={()=>updateQuantity(nft.id,quantity+1)}><Plus size={13}/></button></div>
            <strong className="nft-price">{money((Number(nft.price)*quantity).toString())}</strong><button className="remove-cart" aria-label={'Remover '+nft.name} onClick={()=>removeFromCart(nft.id)}><Trash2 size={17}/></button>
          </div>)}
        </div>
        <aside className="order-summary"><h3>Resumo da carteira</h3><form onSubmit={applyCoupon}><label htmlFor="coupon">Código promocional</label><div className="coupon-row"><input id="coupon" placeholder="Digite o código promocional..." value={couponText} onChange={event=>setCouponText(event.target.value)}/><Button type="submit" size="sm">Aplicar</Button></div></form>
          {coupon && <p className="coupon-applied">Cupom aplicado: {coupon} <button onClick={()=>{setCoupon('');setCouponText('')}}>Remover</button></p>}
          {quote.isError && <p className="form-error" role="alert">{errorMessage(quote.error)}</p>}
          {quote.data && <div className="summary-lines"><div><span>Subtotal</span><span>{money(quote.data.subtotal)}</span></div><div><span>Desconto do lançamento</span><span>− {money(quote.data.discount)}</span></div><div><span>Taxa de rede</span><span>{money(quote.data.networkFee)}</span></div><div className="summary-total"><strong>Total</strong><strong>{money(quote.data.total)}</strong></div></div>}
          {collector ? <Link className={'ui-button ui-button-primary ui-button-default checkout-cta'+(quote.isError?' disabled':'')} to="/checkout">Conectar e finalizar</Link> : <Button className="checkout-cta" onClick={requestLogin}>Entrar para finalizar</Button>}
          <Link to="/" className="continue-link">Continuar explorando</Link>
        </aside>
      </div>}
    <section className="related cart-related"><h3>Colecionadores também viram</h3><div className="related-grid">{nfts.slice(3,8).map(nft=><NftCard nft={nft} key={nft.id}/>)}</div></section>
  </div>
}
