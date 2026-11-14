import { io, type Socket } from 'socket.io-client'
import type { QueryClient } from '@tanstack/react-query'

let socket: Socket | undefined

export function subscribeToLiveUpdates(queryClient: QueryClient) {
  const url = import.meta.env.VITE_SOCKET_URL
  if (!url) return () => {}

  socket = io(url, { transports: ['websocket', 'polling'], autoConnect: true })
  const refreshCatalog = () => {
    void queryClient.invalidateQueries({ queryKey: ['nfts'] })
    void queryClient.invalidateQueries({ queryKey: ['nft'] })
    void queryClient.invalidateQueries({ queryKey: ['quote'] })
  }
  const refreshOrder = () => {
    void queryClient.invalidateQueries({ queryKey: ['order'] })
  }
  socket.on('nft.updated', refreshCatalog)
  socket.on('order.updated', refreshOrder)
  socket.on('connect', () => {
    refreshCatalog()
    refreshOrder()
  })

  return () => {
    socket?.removeAllListeners()
    socket?.disconnect()
    socket = undefined
  }
}
