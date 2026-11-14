import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { NftDetails } from './pages/NftDetails'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderDetails } from './pages/OrderDetails'
import { Account } from './pages/Account'
import { Wallets } from './pages/Wallets'
import { NotFound } from './pages/NotFound'
import { parseFilters } from './lib/search'

const rootRoute = createRootRoute({
  component: () => <Layout><Outlet /></Layout>,
  notFoundComponent: NotFound,
})
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', validateSearch: parseFilters, component: Home })
const nftRoute = createRoute({ getParentRoute: () => rootRoute, path: '/nft/$nftId', component: NftDetails })
const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cart', component: Cart })
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/checkout', component: Checkout })
const orderRoute = createRoute({ getParentRoute: () => rootRoute, path: '/order/$orderId', component: OrderDetails })
const accountRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account', component: Account })
const walletsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wallets', component: Wallets })

const routeTree = rootRoute.addChildren([homeRoute, nftRoute, cartRoute, checkoutRoute, orderRoute, accountRoute, walletsRoute])
export const router = createRouter({ routeTree, defaultPreload: 'intent' })
declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
