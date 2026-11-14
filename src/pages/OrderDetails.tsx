import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, PackageCheck } from 'lucide-react'
import { getOrder } from '../lib/api'
import { money } from '../data'
import { Art } from '../components/Art'
import { useMarketplace } from '../state/MarketplaceContext'

export function OrderDetails() {
  const { orderId } = useParams({ from: '/order/$orderId' })
  const { collector } = useMarketplace()
  const order = useQuery({queryKey:['order',orderId,collector?.id],queryFn:()=>getOrder(orderId),enabled:!!collector,retry:false})
  if (!collector) return <div className="container state-panel page-gap"><h2>Entre para ver seu pedido</h2><Link to="/">Voltar ao início</Link></div>
  if (order.isPending) return <div className="container state-panel page-gap">Carregando pedido...</div>
  if (order.isError || !order.data) return <div className="container state-panel page-gap"><h2>Pedido não encontrado</h2><Link to="/account">Minha conta</Link></div>
  const data=order.data
  return <div className="container order-page"><div className="order-success"><CheckCircle2 size={56}/><h1>Pedido confirmado!</h1><p>Seu pedido foi confirmado pela simulação de pagamento.</p><span>Pedido {data.id}</span></div><div className="receipt"><div className="receipt-head"><h2>Recibo da coleção</h2><PackageCheck size={24}/></div><p>Data: {new Date(data.createdAt).toLocaleString('pt-BR')}</p><p>Carteira: {data.wallet}</p>{data.items.map(line=><div className="receipt-line" key={line.nft.id}><Art variant={line.nft.variant}/><span>{line.nft.name} × {line.quantity}</span><strong>{money((Number(line.price)*line.quantity).toString())}</strong></div>)}<div className="summary-total"><strong>Total</strong><strong>{money(data.quote.total)}</strong></div></div><div className="order-actions"><Link className="ui-button ui-button-primary ui-button-default" to="/">Explorar NFTs</Link><Link to="/account">Ver meus pedidos</Link></div></div>
}
