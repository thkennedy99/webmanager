import { test } from '@playwright/test'

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'livestream-video', path: '/livestream-video' },
  { name: 'video-audio', path: '/video-audio' },
  { name: 'artists', path: '/artists' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'awards', path: '/awards' },
]

for (const { name, path } of pages) {
  test(`screenshot: ${name} desktop`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto(`http://localhost:3002${path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: `test-results/screenshots/${name}-desktop.png`,
      fullPage: true,
    })
  })

  test(`screenshot: ${name} mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(`http://localhost:3002${path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: `test-results/screenshots/${name}-mobile.png`,
      fullPage: true,
    })
  })
}
