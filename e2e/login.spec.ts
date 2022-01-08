import { expect } from '@playwright/test'
import { readFixture } from '../app/utils/fixtures'
import { test } from './base-test'

test('Login', async ({ page, queries: { getByRole } }) => {
  // Go to http://localhost:3000/
  await page.goto('/')

  // Click text=Masuk
  await page.click('text=Masuk')
  await expect(page).toHaveURL('http://localhost:3000/login')

  // Query email
  const email = await getByRole('textbox', {
    name: /alamat email/i,
  })

  // Fill email
  await email.fill('me@zainf.dev')

  // Click text=Kirim link ke alamat email
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.click('text=Kirim link ke alamat email'),
  ])

  // Click text=✨ Link telah dikirim ke alamat email Anda ✨
  await expect(
    page.locator('text=✨ Link telah dikirim ke alamat email Anda ✨').first()
  ).toBeVisible()

  const data = await readFixture('magic')
  const { magicLink } = JSON.parse(data)

  // Go to the magic link
  await page.goto(magicLink)

  // If the magic link matches the current token stored in the session storage,
  // the user will be redirected to the dashboard automatically.
  await expect(page).toHaveURL('http://localhost:3000/dashboard')
})
