import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { Art } from '../components/Art'
import { NftCard } from '../components/NftCard'
import { Button } from '../components/ui/Button'
import { categories } from '../data'
import { getCatalog } from '../lib/api'
import { initialFilters, type CatalogSearch } from '../lib/search'

export function Home() {
  const filters = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const [min, setMin] = useState(filters.min)
  const [max, setMax] = useState(filters.max)
  const [mobileFilters, setMobileFilters] = useState(false)
  useEffect(() => { setMin(filters.min); setMax(filters.max) }, [filters.min, filters.max])
  const params = Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, String(value)]))
  const catalog = useQuery({ queryKey: ['nfts', filters], queryFn: () => getCatalog(params), placeholderData: previous => previous })
  function update(values: Partial<CatalogSearch>) { void navigate({ search: previous => ({ ...previous, ...values, page: values.page ?? 1 }) }) }
  function applyPrice(event: FormEvent) { event.preventDefault(); update({ min, max }) }
  const pages = catalog.data?.pages || 1

  return <>
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow">Bem-vindo à Kurio</span>
        <h1>SEJA DONO DO FUTURO<br/>DA ARTE DIGITAL</h1>
        <p>Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.</p>
        <a className="ui-button ui-button-primary ui-button-default hero-cta" href="#catalogo">EXPLORAR <ArrowRight size={16}/></a>
        <div className="hero-dots"><span className="selected"/><span/><span/></div>
      </div>
      <div className="hero-art"><Art variant="emerald"/></div>
    </section>
    <section className="catalog container" id="catalogo">
      <button className="filters-toggle ui-button ui-button-outline ui-button-sm" type="button" onClick={() => setMobileFilters(!mobileFilters)}><SlidersHorizontal size={17}/> Filtrar NFTs</button>
      <aside className={mobileFilters ? 'sidebar open' : 'sidebar'}>
        <h3>Coleções</h3>
        <div className="filter-links">
          {categories.map(category => <button key={category.name} type="button" onClick={() => update({category: filters.category === category.name ? '' : category.name})} className={filters.category === category.name ? 'selected' : ''}><span>{category.name}</span><span>({category.count})</span></button>)}
        </div>
        <form className="price-filter" onSubmit={applyPrice}>
          <h3>Faixa de preço</h3>
          <div className="price-inputs"><label>Mín. ETH<input type="number" min="0" max="12.3" step="0.01" value={min} onChange={event => setMin(event.target.value)}/></label><label>Máx. ETH<input type="number" min="0" max="12.3" step="0.01" value={max} onChange={event => setMax(event.target.value)}/></label></div>
          <p>Preço: {min.replace('.', ',')} – {max.replace('.', ',')} ETH</p>
          <Button size="sm" type="submit" disabled={Number(min) > Number(max)}>Aplicar</Button>
        </form>
        <h3>Rede</h3>
        <div className="filter-links">{(['Ethereum', 'Polygon', 'Solana'] as const).map((network,index) => <button type="button" key={network} className={filters.network === network ? 'selected' : ''} onClick={() => update({network: filters.network === network ? '' : network})}><span>{network}</span><span>({[119,78,86][index]})</span></button>)}</div>
        <div className="featured-sidebar"><h3>NFT EM DESTAQUE</h3><strong>OFERTA LIMITADA</strong><Art variant="nomad"/></div>
      </aside>
      <div className="catalog-content">
        <div className="catalog-toolbar">
          <div className="catalog-tabs"><button type="button" className={!filters.category ? 'active' : ''} onClick={() => update({category:''})}>Todos os NFTs</button><button type="button" onClick={() => update({sort:'recent'})}>Novos lançamentos</button><button type="button" onClick={() => update({sort:'high'})}>Em alta</button></div>
          <label className="sort-label">Ordenar por:
            <select aria-label="Ordenação" value={filters.sort} onChange={event => update({sort:event.target.value})}>
              <option value="recent">Listados recentemente</option><option value="low">Menor preço</option><option value="high">Maior preço</option><option value="name">Nome</option>
            </select>
          </label>
        </div>
        {filters.search && <p className="search-status">Resultados para “{filters.search}” <button type="button" onClick={() => update({search:''})}>Limpar busca</button></p>}
        {catalog.isPending ? <div className="nft-grid">{Array.from({length:9},(_,index)=><div className="skeleton-card" key={index}/>)}</div>
          : catalog.isError ? <div className="state-panel"><h3>Não foi possível carregar os NFTs.</h3><Button onClick={() => void catalog.refetch()}>Tentar novamente</Button></div>
          : catalog.data?.items.length ? <div className="nft-grid">{catalog.data.items.map(nft=><NftCard nft={nft} key={nft.id}/>)}</div>
          : <div className="state-panel"><h3>Nenhum NFT encontrado.</h3><p>Tente outros filtros ou uma busca diferente.</p><Button onClick={() => void navigate({ search: initialFilters })}>Limpar filtros</Button></div>}
        <div className="pagination" aria-label="Paginação do catálogo">{Array.from({length:pages},(_,index)=>index+1).map(page=><button key={page} type="button" className={filters.page===page?'active':''} onClick={()=>update({page})}>{page}</button>)}<button type="button" aria-label="Próxima página" disabled={filters.page>=pages} onClick={()=>update({page:filters.page+1})}><ChevronRight size={17}/></button></div>
      </div>
    </section>
    <section className="promos container">
      <div className="promo"><Art variant="emerald"/><div><h3>Lançamentos gênesis<br/>de edição limitada</h3><p>Colecione edições escassas diretamente dos criadores antes da revelação pública.</p><a href="#catalogo" className="ui-button ui-button-primary ui-button-sm">Explorar <ArrowRight size={14}/></a></div></div>
      <div className="promo"><Art variant="baron"/><div><h3>Arte digital selecionada<br/>e muito mais</h3><p>Explore novos artistas, coleções verificadas e obras digitais que definem o futuro.</p><a href="#catalogo" className="ui-button ui-button-primary ui-button-sm">Explorar <ArrowRight size={14}/></a></div></div>
    </section>
    <section className="journal container" id="diario"><h2>Diário da Cunhagem</h2><p>Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.</p><div className="journal-grid">
      {[
        { title:'Como funciona a propriedade de NFTs',body:'Aprenda a colecionar, negociar e verificar ativos digitais.',art:'baron' as const },
        { title:'10 artistas digitais para acompanhar',body:'Conheça criadores que moldam a cultura digital.',art:'emerald' as const },
        { title:'Raridade, atributos e procedência',body:'Entenda raridade, procedência, direitos autorais e utilidade.',art:'nomad' as const },
        { title:'Como proteger sua carteira',body:'Proteja sua carteira, seus ativos e sua identidade.',art:'golden' as const },
      ].map((post,index)=><article className="journal-card" key={post.title}><Art variant={post.art}/><div><small>{12+index} de setembro　|　Leitura de {index+3} min</small><h3>{post.title}</h3><p>{post.body}</p><Link to="/wallets">Ler mais →</Link></div></article>)}
    </div></section>
  </>
}
