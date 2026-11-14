# Arquitetura

## Visão geral

Aplicação Vite + React + TypeScript, com TanStack Router para páginas e parâmetros, TanStack Query para cache e estados assíncronos, Axios para transporte REST e MSW para interceptação de chamadas de rede.

- `src/data.ts`: catálogo de demonstração.
- `src/components`: elementos compartilhados, cartões e ilustrações SVG.
- `src/pages`: catálogo, detalhes, carrinho, checkout, pedido, perfil e carteiras.
- `src/state/MarketplaceContext.tsx`: carrinho, sessão local, favoritos e carteiras.
- `src/lib/api.ts`: cliente REST.
- `src/mocks/handlers.ts`: rotas REST simuladas e regras de cotação.
- `src/lib/events.ts`: cliente Socket.IO opcional para invalidação de cache.
- `src/styles.css`: tokens, layouts responsivos, estados e acessibilidade.

## Fluxo de dados

TanStack Query carrega catálogo, detalhes, cotação e pedidos a partir do Axios; MSW intercepta `/api/*` no browser. O catálogo sincroniza filtros e página pela query string. O carrinho de visitante usa uma chave própria em localStorage. Ao entrar, os itens são mesclados com o carrinho da conta. Favoritos e carteiras usam chaves isoladas pelo ID da conta demonstrativa.

A cotação é recalculada por endpoint simulado usando Decimal.js, com cupom `KURIO10` e taxa de rede fictícia de `0.016 ETH`. A criação de pedido recebe `Idempotency-Key` e persiste um snapshot dos itens e valores por conta.

## Contratos REST iniciais

- `GET /api/nfts`: busca, filtros, ordenação e paginação.
- `GET /api/nfts/:id`: detalhes ou 404.
- `POST /api/auth/login` e `POST /api/auth/register`: conta demonstrativa.
- `POST /api/quote`: subtotal, desconto, taxa e total em strings ETH.
- `POST /api/orders`: confirma a compra simulada e retorna recibo.
- `GET /api/orders/:id`: consulta isolada por conta.

## Limitações conhecidas

O armazenamento em localStorage não é autenticação segura; o objetivo é simular fluxos em um desafio frontend, sem colocar credenciais reais em risco. Não existe backend persistente ou autorização de servidor. O mock do pedido confirma a compra diretamente, sem simulação completa de pagamento pendente/recusado, reconexão, timeout ou disputas de estoque.

O cliente Socket.IO existe, mas depende de `VITE_SOCKET_URL` e de um serviço externo de eventos. Ainda falta a integração compatível MSW–Socket.IO e a reconciliação versionada de eventos duplicados/antigos.

Os assets SVG são placeholders próprios e devem ser substituídos pelos originais exportados do Figma para fidelidade pixel a pixel. A cobertura E2E é inicial; ainda faltam testes de cenários negativos, regressão visual e auditoria Lighthouse.
