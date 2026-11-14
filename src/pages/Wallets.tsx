import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { Wallet, Plus, ShieldCheck } from 'lucide-react'
import { useMarketplace } from '../state/MarketplaceContext'
import { Button } from '../components/ui/Button'
import type { Network } from '../types'

export function Wallets() {
  const { collector, wallets, addWallet, setAuthOpen, setAuthMode } = useMarketplace()
  const [name, setName] = useState('')
  const [network, setNetwork] = useState<Network>('Ethereum')
  function add(event: FormEvent) {
    event.preventDefault()
    addWallet({id:crypto.randomUUID(),name:name.trim(),network,address:'0xDEMO...'+crypto.randomUUID().slice(0,6).toUpperCase()})
    setName('')
  }
  if (!collector) return <div className="container state-panel page-gap"><h2>Carteiras</h2><p>Entre para gerenciar suas carteiras simuladas.</p><Button onClick={()=>{setAuthMode('login');setAuthOpen(true)}}>Entrar</Button></div>
  return <div className="container wallets-page"><div className="breadcrumbs"><Link to="/account">Perfil</Link> / Carteiras</div><h1 className="page-title">Minhas carteiras</h1><p className="muted">Organize as carteiras usadas nas simulações de compra.</p><div className="wallets-layout"><section><h2>Carteiras cadastradas</h2>{wallets.length?wallets.map(wallet=><div className="wallet-row" key={wallet.id}><Wallet size={24}/><div><strong>{wallet.name}</strong><p>{wallet.network} · {wallet.address}</p></div></div>):<p>Nenhuma carteira cadastrada.</p>}</section><form onSubmit={add} className="wallet-add"><h2>Adicionar carteira</h2><label>Nome da carteira<input required minLength={2} value={name} onChange={event=>setName(event.target.value)} placeholder="Minha carteira"/></label><label>Rede<select value={network} onChange={event=>setNetwork(event.target.value as Network)}><option>Ethereum</option><option>Polygon</option><option>Solana</option></select></label><Button type="submit"><Plus size={16}/> Adicionar</Button></form></div><p className="wallet-notice"><ShieldCheck size={17}/> As carteiras são fictícias e não acessam extensões, saldos ou blockchain.</p></div>
}
