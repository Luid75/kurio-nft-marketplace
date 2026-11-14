import { test, expect } from '@playwright/test'

test('catálogo carrega e mantém filtros após atualizar a página', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /SEJA DONO DO FUTURO/ })).toBeVisible()
  await expect(page.locator('.nft-card')).toHaveCount(9)
  const isMobile = await page.locator('.filters-toggle').isVisible()
  if (isMobile) await page.locator('.filters-toggle').click()
  await page.getByRole('button', { name: /Arte digital/ }).first().click()
  await expect(page).toHaveURL(/category=Arte/)
  await page.reload()
  await expect(page.locator('.nft-card').first()).toBeVisible()
})

test('detalhes inexistentes têm estado de erro', async ({ page }) => {
  await page.goto('/nft/nao-existe')
  await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible()
})

test('item adicionado aparece no carrinho', async ({ page }) => {
  await page.goto('/nft/emerald-ape-042')
  await page.getByRole('button', { name: /Adicionar ao carrinho/ }).click()
  await page.goto('/cart')
  await expect(page.getByText('Emerald Ape #042')).toBeVisible()
})

test('login de demonstração exibe perfil', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Entrar', exact: true }).first().click()
  await page.getByRole('textbox', { name: 'E-mail' }).fill('colecionador@kurio.com')
  await page.getByLabel('Senha', { exact: true }).fill('Kurio123!')
  await page.locator('.auth-form button[type=submit]').click()
  await page.locator('.header-actions .account-link').click()
  await expect(page.getByRole('heading', { name: 'Colecionador Kurio' })).toBeVisible()
})
