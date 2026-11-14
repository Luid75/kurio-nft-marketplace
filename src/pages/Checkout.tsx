import { initialFilters } from '../lib/search'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LockKeyhole, ShieldCheck, Wallet } from 'lucide-react'
import { useMarketplace } from '../state/MarketplaceContext'
import { getQuote, placeOrder } from '../lib/api'
import { errorMessage } from '../lib/utils'
import { nfts, money } from '../data'
import { Button } from '../components/ui/Button'

export function Checkout() {
  const { cart, collector, wallets, removePurchased, setAuthMode, setAuthOpen } = useMarketplace()
  const [wallet, setWallet] = useState('MetaMask (simulada)')
  const [coupon] = useState(() => sessionStorage.getItem('kurio:checkout:coupon') || '')
  const navigate = useNavigate()
  const requestKey = useRef(crypto.randomUUID())
  const quote = useQuery({queryKey:['quote',cart,coupon],queryFn:()=>getQuote(cart,coupon),enabled:cart.length>0,retry:false})
  const submit = useMutation({
    mutationFn: async () => {
      if (!collector) throw new Error('Entre na sua conta.')
      return placeOrder(cart,coupon,collector,wallet,requestKey.current)
    },
    onSuccess: order => {
      removePurchased(cart)
      void navigate({to:'/order/$orderId',params:{orderId:order.id}})
    },
  })
  useEffect(() => { requestKey.current = crypto.randomUUID() }, [cart, coupon, wallet])
  if (!collector) return <div className="container state-panel page-gap"><LockKeyhole size={30}/><h2>Entre para continuar</h2><p>É necessário ter uma conta para finalizar.</p><Button onClick={()=>{setAuthMode('login');setAuthOpen(true)}}>Entrar</Button></div>
  if (!cart.length) return <div className="container state-panel page-gap"><h2>Nenhum item para finalizar</h2><Link to="/" search={initialFilters}>Voltar ao mercado</Link></div>
  return <div className="container checkout-page">
    <div className="breadcrumbs"><Link to="/cart">Carrinho</Link> / Pagamento</div><h1 className="page-title">Finalizar coleção</h1>
    <div className="checkout-layout">
      <section className="checkout-form">
        <h2>Dados do colecionador</h2><div className="checkout-box"><strong>{collector.name}</strong><p>{collector.email}</p></div>
        <h2>Selecionar carteira</h2><div className="wallet-choice"><Wallet size={22}/><label><span>Carteira para simulação</span><select value={wallet} onChange={event=>setWallet(event.target.value)}><option>MetaMask (simulada)</option><option>WalletConnect (simulada)</option><option>Coinbase Wallet (simulada)</option>{wallets.map(item=><option key={item.id} value={item.name}>{item.name}</option>)}</select></label></div>
        <div className="checkout-disclaimer"><ShieldCheck size={19}/><p>Pagamento demonstrativo. Nenhuma criptomoeda será transferida e nenhuma carteira real será conectada.</p></div>
        <h2>Revisão do pedido</h2>{cart.map(line=>{const nft=nfts.find(item=>item.id===line.id);return nft?<div className="checkout-item" key={line.id}><span>{nft.name} × {line.quantity}</span><strong>{money((Number(nft.price)*line.quantity).toString())}</strong></div>:null})}
      </section>
      <aside className="order-summary"><h3>Resumo do pedido</h3>{quote.isPending?<p>Atualizando valores...</p>:quote.isError?<p className="form-error" role="alert">{errorMessage(quote.error)}</p>:quote.data&&<div className="summary-lines"><div><span>Subtotal</span><span>{money(quote.data.subtotal)}</span></div><div><span>Desconto</span><span>− {money(quote.data.discount)}</span></div><div><span>Taxa de rede</span><span>{money(quote.data.networkFee)}</span></div><div className="summary-total"><strong>Total</strong><strong>{money(quote.data.total)}</strong></div></div>}
        {submit.isError&&<p className="form-error" role="alert">{errorMessage(submit.error)}</p>}
        <Button className="checkout-cta" disabled={quote.isPending||quote.isError||submit.isPending} onClick={()=>submit.mutate()}>{submit.isPending?'Confirmando pedido...':'Confirmar compra simulada'}</Button><Link to="/cart" className="continue-link">Voltar ao carrinho</Link>
      </aside>
    </div>
  </div>
}
