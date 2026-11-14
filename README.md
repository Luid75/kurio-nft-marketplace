# Kurio — NFT Marketplace

Marketplace demonstrativo de arte digital desenvolvido com React e TypeScript. O projeto segue a linguagem visual do protótipo Kurio e contempla descoberta, catálogo, detalhes das obras, favoritos, carrinho e simulação de checkout.

## Executar localmente

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

A configuração do MSW gera o arquivo `public/mockServiceWorker.js` durante a instalação e antes do build. As requisições REST são interceptadas no navegador.

## Conta de demonstração

- E-mail: `colecionador@kurio.com`
- Senha: `Kurio123!`
- Cupom: `KURIO10` (10% de desconto)
- Cenário de pagamento recusado: no checkout, selecione `Carteira recusada (simulada)`; o pedido terá estado `declined` e os itens serão mantidos no carrinho.

É possível criar outros usuários fictícios. **Não use senhas reais**: a autenticação e o armazenamento são simulados no navegador.

## Funcionalidades disponíveis nesta versão

- Catálogo com pesquisa, categoria, rede, ordenação e paginação sincronizados com a URL.
- Detalhes dos NFTs, edições, seleção de quantidade e favoritos por conta.
- Carrinho persistente e transferência dos itens de visitante ao entrar.
- Cotação com Decimal.js, cupom, desconto e taxa de rede calculados por API simulada.
- Checkout demonstrativo, idempotência por tentativa e recibo de pedido.
- Login/cadastro fictícios, perfil, histórico de pedidos e carteiras simuladas.
- Layout responsivo com componentes acessíveis e testes iniciais Playwright.
- Integração Socket.IO opcional via `VITE_SOCKET_URL` (requer servidor externo).

## Comandos

```bash
npm run dev
npm run build
npm run test:e2e
```

Antes do Playwright, instale o Chromium com `npx playwright install chromium`.

## Deploy na Vercel

Aplicação publicada: https://kurio-nft-marketplace-luid4.vercel.app. O deploy é realizado automaticamente a partir da branch `main` no GitHub.

Configuração: framework Vite, build `npm run build`, saída `dist`. O arquivo `vercel.json` já contempla o fallback de navegação para rotas client-side.

Confira o status do último deploy no painel Vercel antes de compartilhar a versão atualizada.

## Escopo e limitações

Este projeto é um primeiro incremento funcional. A arte de exemplo é SVG autoral, inspirada na composição do protótipo, e não substitui os arquivos de imagem originais do Figma. APIs, login, carteiras e pagamentos são inteiramente simulados. Não há blockchain, tokens ou pagamentos reais.

A integração em tempo real depende de servidor Socket.IO fornecido separadamente. O conjunto completo de cenários determinísticos, segurança de sessão em backend, integração MSW–Socket.IO, regressões visuais e metas Lighthouse **ainda não foi implementado nem validado**. Consulte [ARCHITECTURE.md](ARCHITECTURE.md).

## Acompanhamento dos requisitos do desafio

A entrega ainda é parcial em relação ao README oficial de `junglegaming/frontend-challenge`. Já existem rotas, catálogo, checkout simulado, MSW, testes E2E e deploy público. Ainda são necessários: uso efetivo de componentes shadcn/ui; cenários MSW completos e reproduzíveis; transporte Socket.IO simulado funcionando no build público; sessões e mutations de conta inteiramente via API; fluxo de pagamento pendente/recusado; testes de regressão visual e relatórios Lighthouse com as metas solicitadas. As ilustrações SVG são provisórias e não equivalem aos assets originais do Figma.

As mutations de pedido exigem `Idempotency-Key`; a mesma chave recupera o pedido anterior, enquanto a reutilização com itens ou carteira diferentes retorna HTTP 409. O checkout envia `expectedTotal` para recusar cotações alteradas. Senhas cadastradas no mock são armazenadas como hash SHA-256, apenas para evitar texto puro na demonstração; **isso não constitui autenticação segura de produção**.
