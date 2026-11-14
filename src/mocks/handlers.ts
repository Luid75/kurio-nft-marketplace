import { http, HttpResponse, delay } from 'msw'
import Decimal from 'decimal.js'
import { nfts } from '../data'
import { readStored, saveStored } from '../lib/storage'
import type { CartLine, Collector, Order, Quote } from '../types'

type Credentials = { name: string; email: string; password: string }
const demo: Credentials = { name: 'Colecionador Kurio', email: 'colecionador@kurio.com', password: 'Kurio123!' }

const quoteFor = (items: CartLine[], coupon = ''): Quote => {
  let subtotal = new Decimal(0)
  for (const line of items) {
    const nft = nfts.find(item => item.id === line.id)
    if (!nft || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 20 || line.quantity > nft.maxEdition - nft.edition + 1) {
      throw new Error('Um dos NFTs não está disponível na quantidade solicitada.')
    }
    subtotal = subtotal.plus(new Decimal(nft.price).mul(line.quantity))
  }
  const code = coupon.trim().toUpperCase()
  if (code && code !== 'KURIO10') throw new Error('Cupom inválido ou expirado.')
  const discount = code ? subtotal.mul('0.10') : new Decimal(0)
  const fee = items.length ? new Decimal('0.016') : new Decimal(0)
  return {
    subtotal: subtotal.toFixed(3),
    discount: discount.toFixed(3),
    networkFee: fee.toFixed(3),
    total: subtotal.minus(discount).plus(fee).toFixed(3),
    coupon: code || undefined,
  }
}

const errorResponse = (message: string, status = 400) => HttpResponse.json({ message }, { status })

export const handlers = [
  http.get('/api/nfts', async ({ request }) => {
    await delay(180)
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') || '').toLowerCase()
    const category = url.searchParams.get('category') || ''
    const network = url.searchParams.get('network') || ''
    const sort = url.searchParams.get('sort') || 'recent'
    const min = Number(url.searchParams.get('min') || '0')
    const max = Number(url.searchParams.get('max') || '12.3')
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const filtered = nfts.filter(nft =>
      (!search || (nft.name + ' ' + nft.artist).toLowerCase().includes(search)) &&
      (!category || nft.category === category) &&
      (!network || nft.network === network) &&
      Number(nft.price) >= min && Number(nft.price) <= max
    )
    if (sort === 'low') filtered.sort((a, b) => Number(a.price) - Number(b.price))
    if (sort === 'high') filtered.sort((a, b) => Number(b.price) - Number(a.price))
    if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
    const size = 9
    return HttpResponse.json({ items: filtered.slice((page - 1) * size, page * size), total: filtered.length, page, pages: Math.max(1, Math.ceil(filtered.length / size)) })
  }),
  http.get('/api/nfts/:id', ({ params }) => {
    const nft = nfts.find(item => item.id === params.id)
    return nft ? HttpResponse.json(nft) : errorResponse('NFT não encontrado.', 404)
  }),
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    const registered = readStored<Credentials[]>('kurio:users', [])
    const user = [demo, ...registered].find(item => item.email.toLowerCase() === body.email.toLowerCase() && item.password === body.password)
    if (!user) return errorResponse('E-mail ou senha incorretos.', 401)
    return HttpResponse.json({ id: user.email.toLowerCase(), name: user.name, email: user.email } satisfies Collector)
  }),
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as Credentials
    if (!body.name?.trim() || !body.email?.includes('@') || (body.password?.length || 0) < 8) return errorResponse('Confira seus dados e use uma senha de pelo menos 8 caracteres.')
    const users = readStored<Credentials[]>('kurio:users', [])
    if ([demo, ...users].some(item => item.email.toLowerCase() === body.email.toLowerCase())) return errorResponse('Este e-mail já está cadastrado.', 409)
    saveStored('kurio:users', [...users, { name: body.name.trim(), email: body.email.toLowerCase(), password: body.password }])
    return HttpResponse.json({ id: body.email.toLowerCase(), name: body.name.trim(), email: body.email.toLowerCase() } satisfies Collector, { status: 201 })
  }),
  http.post('/api/quote', async ({ request }) => {
    await delay(120)
    const body = await request.json() as { items: CartLine[]; coupon: string }
    try { return HttpResponse.json(quoteFor(body.items, body.coupon)) }
    catch (error) { return errorResponse((error as Error).message, 409) }
  }),
  http.post('/api/orders', async ({ request }) => {
    await delay(380)
    const key = request.headers.get('Idempotency-Key')
    if (!key) return errorResponse('Identificador da tentativa ausente.', 400)
    const body = await request.json() as { items: CartLine[]; coupon: string; collector: Collector; wallet: string }
    if (!body.collector?.id) return errorResponse('Entre na sua conta.', 401)
    if (!body.wallet) return errorResponse('Selecione uma carteira.', 400)
    const storageKey = 'kurio:orders:' + body.collector.id
    const orders = readStored<Array<Order & { requestKey: string }>>(storageKey, [])
    const previous = orders.find(order => order.requestKey === key)
    if (previous) return HttpResponse.json(previous)
    try {
      const quote = quoteFor(body.items, body.coupon)
      if (!body.items.length) return errorResponse('Carrinho vazio.', 400)
      const order: Order & { requestKey: string } = {
        id: 'KUR-' + crypto.randomUUID().slice(0, 8).toUpperCase(),
        requestKey: key,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        items: body.items.map(line => ({ nft: nfts.find(item => item.id === line.id)!, quantity: line.quantity, price: nfts.find(item => item.id === line.id)!.price })),
        quote, collector: body.collector, wallet: body.wallet,
      }
      saveStored(storageKey, [order, ...orders])
      return HttpResponse.json(order, { status: 201 })
    } catch (error) {
      return errorResponse((error as Error).message, 409)
    }
  }),
  http.get('/api/orders/:id', ({ params }) => {
    const user = readStored<Collector | null>('kurio:session', null)
    if (!user) return errorResponse('Entre na sua conta.', 401)
    const orders = readStored<Order[]>('kurio:orders:' + user.id, [])
    const order = orders.find(item => item.id === params.id)
    return order ? HttpResponse.json(order) : errorResponse('Pedido não encontrado.', 404)
  }),
]
