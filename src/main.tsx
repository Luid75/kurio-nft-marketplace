import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { MarketplaceProvider } from './state/MarketplaceContext'
import { router } from './router'
import './styles.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
})

async function bootstrap() {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass', serviceWorker: { url: '/mockServiceWorker.js' } })
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MarketplaceProvider>
          <RouterProvider router={router} />
        </MarketplaceProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  )
}
bootstrap().catch(error => {
  console.error(error)
  const root = document.getElementById('root')
  if (root) root.textContent = 'Não foi possível iniciar a loja. Atualize a página para tentar novamente.'
})
