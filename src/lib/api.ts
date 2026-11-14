import axios from 'axios'
import type { CatalogResponse, Nft, Order, Quote, CartLine, Collector } from '../types'

export const api = axios.create({ baseURL: '/api', timeout: 12000 })

export async function getCatalog(params: Record<string, string>): Promise<CatalogResponse> {
  const { data } = await api.get<CatalogResponse>('/nfts', { params })
  return data
}
export async function getNft(id: string): Promise<Nft> {
  const { data } = await api.get<Nft>('/nfts/' + id)
  return data
}
export async function getQuote(items: CartLine[], coupon: string): Promise<Quote> {
  const { data } = await api.post<Quote>('/quote', { items, coupon })
  return data
}
export async function placeOrder(items: CartLine[], coupon: string, collector: Collector, wallet: string, requestId: string): Promise<Order> {
  const { data } = await api.post<Order>('/orders', { items, coupon, collector, wallet }, {
    headers: { 'Idempotency-Key': requestId },
  })
  return data
}
export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>('/orders/' + id)
  return data
}
