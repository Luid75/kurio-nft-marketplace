import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { CartLine, Collector, Wallet } from '../types'
import { readStored, saveStored } from '../lib/storage'
import { subscribeToLiveUpdates } from '../lib/events'

type ContextValue = {
  collector: Collector | null
  cart: CartLine[]
  favorites: string[]
  wallets: Wallet[]
  authOpen: boolean
  authMode: 'login' | 'register'
  setAuthOpen: (value: boolean) => void
  setAuthMode: (value: 'login' | 'register') => void
  signIn: (user: Collector) => void
  signOut: () => void
  addToCart: (id: string, quantity?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  removePurchased: (lines: CartLine[]) => void
  toggleFavorite: (id: string) => void
  addWallet: (wallet: Wallet) => void
}
const MarketplaceContext = createContext<ContextValue | null>(null)
const guestKey = 'kurio:cart:guest'
const userKey = (user: Collector | null) => user ? 'kurio:cart:' + user.id : guestKey

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [collector, setCollector] = useState<Collector | null>(() => readStored('kurio:session', null))
  const [cart, setCart] = useState<CartLine[]>(() => {
    const user = readStored<Collector | null>('kurio:session', null)
    return readStored(userKey(user), [])
  })
  const [favorites, setFavorites] = useState<string[]>(() => {
    const user = readStored<Collector | null>('kurio:session', null)
    return user ? readStored('kurio:favorites:' + user.id, []) : []
  })
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const user = readStored<Collector | null>('kurio:session', null)
    return user ? readStored('kurio:wallets:' + user.id, []) : []
  })
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => { saveStored(userKey(collector), cart) }, [cart, collector])
  useEffect(() => { if (collector) saveStored('kurio:favorites:' + collector.id, favorites) }, [favorites, collector])
  useEffect(() => { if (collector) saveStored('kurio:wallets:' + collector.id, wallets) }, [wallets, collector])
  useEffect(() => subscribeToLiveUpdates(queryClient), [queryClient])

  function signIn(user: Collector) {
    const guestCart = readStored<CartLine[]>(guestKey, [])
    const userCart = readStored<CartLine[]>('kurio:cart:' + user.id, [])
    const merged = [...userCart]
    for (const line of guestCart) {
      const existing = merged.find(item => item.id === line.id)
      if (existing) existing.quantity = Math.min(20, existing.quantity + line.quantity)
      else merged.push({ ...line })
    }
    saveStored('kurio:cart:' + user.id, merged)
    localStorage.removeItem(guestKey)
    saveStored('kurio:session', user)
    setCollector(user)
    setCart(merged)
    setFavorites(readStored('kurio:favorites:' + user.id, []))
    setWallets(readStored('kurio:wallets:' + user.id, []))
    setAuthOpen(false)
    queryClient.clear()
  }
  function signOut() {
    localStorage.removeItem('kurio:session')
    setCollector(null)
    setCart(readStored(guestKey, []))
    setFavorites([])
    setWallets([])
    queryClient.clear()
  }
  function addToCart(id: string, quantity = 1) {
    setCart(previous => {
      const existing = previous.find(item => item.id === id)
      if (existing) return previous.map(item => item.id === id ? { ...item, quantity: Math.min(20, item.quantity + quantity) } : item)
      return [...previous, { id, quantity }]
    })
  }
  function updateQuantity(id: string, quantity: number) {
    setCart(previous => previous.map(item => item.id === id ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) } : item))
  }
  function removeFromCart(id: string) {
    setCart(previous => previous.filter(item => item.id !== id))
  }
  function removePurchased(lines: CartLine[]) {
    setCart(previous => previous.flatMap(item => {
      const bought = lines.find(line => line.id === item.id)?.quantity ?? 0
      return item.quantity > bought ? [{ ...item, quantity: item.quantity - bought }] : []
    }))
  }
  function toggleFavorite(id: string) {
    if (!collector) {
      setAuthMode('login')
      setAuthOpen(true)
      return
    }
    setFavorites(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id])
  }
  function addWallet(wallet: Wallet) {
    setWallets(previous => [...previous, wallet])
  }

  const value = useMemo<ContextValue>(() => ({
    collector, cart, favorites, wallets, authOpen, authMode, setAuthOpen, setAuthMode,
    signIn, signOut, addToCart, updateQuantity, removeFromCart, removePurchased, toggleFavorite, addWallet,
  }), [collector, cart, favorites, wallets, authOpen, authMode])
  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext)
  if (!context) throw new Error('MarketplaceProvider não encontrado')
  return context
}
