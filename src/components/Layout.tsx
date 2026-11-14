import { useState, type ReactNode, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Search, ShoppingCart, LogIn, Menu, X, Heart, UserRound } from 'lucide-react'
import { useMarketplace } from '../state/MarketplaceContext'
import { initialFilters } from '../lib/search'
import { AuthModal } from './AuthModal'
import { Button } from './ui/Button'

export function Layout({ children }: { children: ReactNode }) {
  return <div className="site"><Header/><main>{children}</main><Footer/><AuthModal/></div>
}
function Header() {
  const { cart, collector, setAuthOpen, setAuthMode } = useMarketplace()
  const [menu, setMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  function search(event: FormEvent) {
    event.preventDefault()
    void navigate({ to: '/', search: { ...initialFilters, search: query } })
    setSearchOpen(false)
    setMenu(false)
  }
  return <header className="header container">
    <Link to="/" search={initialFilters} className="brand" aria-label="Kurio, página inicial">KURIO</Link>
    <nav className={menu ? 'nav open' : 'nav'} aria-label="Menu principal">
      <Link to="/" search={initialFilters} activeOptions={{ exact: true }} activeProps={{ className: 'active' }} onClick={() => setMenu(false)}>Início</Link>
      <Link to="/" search={initialFilters} activeProps={{ className: 'active' }} onClick={() => setMenu(false)}>Mercado</Link>
      <Link to="/" search={initialFilters} onClick={() => setMenu(false)}>Criadores</Link>
      <a href="/#diario" onClick={() => setMenu(false)}>Aprenda</a>
    </nav>
    <div className="header-actions">
      <button type="button" className="icon-button" aria-label="Buscar NFTs" onClick={() => setSearchOpen(!searchOpen)}><Search size={21}/></button>
      <Link className="cart-icon" to="/cart" aria-label={'Carrinho, ' + cart.reduce((sum, line) => sum + line.quantity, 0) + ' itens'}><ShoppingCart size={20}/>{cart.length > 0 && <span>{cart.reduce((sum, line) => sum + line.quantity, 0)}</span>}</Link>
      {collector
        ? <Link className="account-link" to="/account"><UserRound size={16}/><span>Perfil</span></Link>
        : <Button size="sm" onClick={() => { setAuthMode('login'); setAuthOpen(true) }}><LogIn size={15}/> Entrar</Button>}
      <button className="mobile-menu icon-button" type="button" aria-label="Abrir menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </div>
    {searchOpen && <form className="search-popover" onSubmit={search}><input autoFocus placeholder="Buscar NFTs e artistas..." aria-label="Buscar NFTs e artistas" value={query} onChange={event => setQuery(event.target.value)}/><Button type="submit" size="sm">Buscar</Button></form>}
  </header>
}
export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  return <footer className="container footer">
    <div className="footer-highlights">
      <div><span className="footer-circle">W</span><h4>Segurança da carteira</h4><p>Proteja sua carteira e colecione arte digital verificada com confiança.</p></div>
      <div><span className="footer-circle">C</span><h4>Criadores em destaque</h4><p>Conheça artistas, estúdios e comunidades que moldam a cultura digital.</p></div>
      <div><span className="footer-circle">D</span><h4>Alertas de lançamentos</h4><p>Receba novidades de coleções e análises de mercado.</p></div>
      <form onSubmit={event => { event.preventDefault(); setSubscribed(true) }}><h4>Antecipe-se ao próximo lançamento</h4><div className="newsletter"><input required type="email" placeholder="digite seu e-mail..." aria-label="E-mail para novidades" value={email} onChange={event => setEmail(event.target.value)}/><Button type="submit" size="sm">Enviar</Button></div><p>{subscribed ? 'E-mail registrado nesta demonstração.' : 'Receba lançamentos selecionados, histórias de criadores e novidades do mercado.'}</p></form>
    </div>
    <div className="footer-band"><strong>KURIO</strong><span>Feito para colecionadores,<br/> criadores e cultura</span><span>contato@email.com</span><span>Propriedade digital para todos.</span></div>
    <div className="footer-columns">
      <div><h4>Meu perfil</h4><Link to="/account">Meu perfil</Link><Link to="/account">Minha coleção</Link><Link to="/wallets">Carteiras</Link></div>
      <div><h4>Central de ajuda</h4><a href="#top">Como comprar NFTs</a><a href="#top">Carteira e segurança</a><a href="#top">Política do mercado</a></div>
      <div><h4>Coleções</h4><Link to="/" search={{...initialFilters,category:'Arte digital'}}>Arte digital</Link><Link to="/" search={{...initialFilters,category:'Fotografia'}}>Fotografia</Link><Link to="/" search={{...initialFilters,category:'Música'}}>Música</Link><Link to="/" search={{...initialFilters,category:'Arte 3D'}}>Arte 3D</Link></div>
      <div><h4>Comunidade</h4><p>Instagram · X · Discord</p><h4>Carteiras compatíveis</h4><span className="wallet-logos">METAMASK · WALLETCONNECT · COINBASE</span></div>
    </div>
    <div className="copyright">© 2026 Kurio. Propriedade digital para todos.</div>
  </footer>
}
