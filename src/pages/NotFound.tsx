import { initialFilters } from '../lib/search'
import { Link } from '@tanstack/react-router'
export function NotFound() {
  return <div className="container state-panel page-gap"><h1>404</h1><h2>Esta página não foi encontrada.</h2><Link className="ui-button ui-button-primary ui-button-default" to="/" search={initialFilters}>Voltar ao início</Link></div>
}
