import { getPayload } from 'payload'
import config from '../src/payload.config'
import crypto from 'crypto'

const ERINSHORE_TENANT = 1
const ERINSHORE_THEME = 3
const CONCERTS_TENANT = 3
const CONCERTS_THEME = 4

function uid() {
  return crypto.randomBytes(12).toString('hex')
}

async function run() {
  const payload = await getPayload({ config: await config })

  // ── 1. Erin Shore Hero Slides ──────────────────────────────────
  // Use existing media IDs: orchestra-hero (not in media table — use hero-1,2,3 + cx350 images)
  const erinSlides = [
    { image_id: 41, alt: 'Concert production and livestreaming' },
    { image_id: 42, alt: 'Live orchestra performance' },
    { image_id: 43, alt: 'Choral performance recording' },
    { image_id: 44, alt: 'Professional camera operator filming orchestra' },
    { image_id: 24, alt: 'Professional livestream production setup' },
  ]

  // Check if slides already exist
  const existingErinSlides = await payload.db.pool.query(
    `SELECT COUNT(*) FROM site_themes_hero_slides WHERE _parent_id = $1`,
    [ERINSHORE_THEME],
  )
  if (parseInt(existingErinSlides.rows[0].count) === 0) {
    for (let i = 0; i < erinSlides.length; i++) {
      await payload.db.pool.query(
        `INSERT INTO site_themes_hero_slides (_order, _parent_id, id, image_id, alt) VALUES ($1, $2, $3, $4, $5)`,
        [i + 1, ERINSHORE_THEME, uid(), erinSlides[i].image_id, erinSlides[i].alt],
      )
    }
    console.log(`Added ${erinSlides.length} hero slides to Erin Shore theme`)
  } else {
    console.log('Erin Shore hero slides already exist, skipping')
  }

  // ── 2. Times Concerts Hero Images ──────────────────────────────
  // Create media records for Times Concerts from available stock images
  // We'll reuse some concert images that are appropriate
  const concertImages = [
    { src: 'concert-crowd.jpg', alt: 'Audience at a traditional music concert' },
    { src: 'folk-hero.jpg', alt: 'Traditional Irish folk musicians performing' },
    { src: 'acoustic-guitar.jpg', alt: 'Acoustic guitar at an Irish music session' },
    { src: 'violin-closeup.jpg', alt: 'Fiddle player at a traditional music session' },
  ]

  // Check if concerts tenant has any media
  const existingConcertMedia = await payload.find({
    collection: 'media',
    where: { tenant: { equals: CONCERTS_TENANT } },
    limit: 1,
    overrideAccess: true,
  })

  const concertMediaIds: number[] = []
  if (existingConcertMedia.docs.length === 0) {
    // Import images from erinshore directory as new media for the concerts tenant
    const fs = await import('fs')
    const path = await import('path')

    for (const img of concertImages) {
      const filePath = path.resolve(process.cwd(), 'public/images/erinshore', img.src)
      if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${img.src} (file not found)`)
        continue
      }
      const buffer = fs.readFileSync(filePath)
      const doc = await payload.create({
        collection: 'media',
        data: {
          alt: img.alt,
          tenant: CONCERTS_TENANT,
        } as never,
        file: {
          data: buffer,
          name: img.src,
          mimetype: 'image/jpeg',
          size: buffer.length,
        },
        overrideAccess: true,
      })
      concertMediaIds.push(doc.id as number)
      console.log(`Uploaded for Times Concerts: ${img.src} -> ID ${doc.id}`)
    }
  } else {
    console.log('Times Concerts already has media, fetching existing')
    const allMedia = await payload.find({
      collection: 'media',
      where: { tenant: { equals: CONCERTS_TENANT } },
      limit: 10,
      overrideAccess: true,
    })
    allMedia.docs.forEach((d) => concertMediaIds.push(d.id as number))
  }

  // Add hero slides to Times Concerts theme
  const existingConcertSlides = await payload.db.pool.query(
    `SELECT COUNT(*) FROM site_themes_hero_slides WHERE _parent_id = $1`,
    [CONCERTS_THEME],
  )
  if (parseInt(existingConcertSlides.rows[0].count) === 0 && concertMediaIds.length > 0) {
    for (let i = 0; i < concertMediaIds.length; i++) {
      await payload.db.pool.query(
        `INSERT INTO site_themes_hero_slides (_order, _parent_id, id, image_id, alt) VALUES ($1, $2, $3, $4, $5)`,
        [i + 1, CONCERTS_THEME, uid(), concertMediaIds[i], concertImages[i]?.alt || 'Concert image'],
      )
    }
    console.log(`Added ${concertMediaIds.length} hero slides to Times Concerts theme`)
  } else {
    console.log('Times Concerts hero slides already exist or no media available')
  }

  // ── 3. Populate Times Concerts Page Content ────────────────────
  console.log('\nPopulating page content...')

  // Helper to create rich text JSON
  function richText(blocks: { tag?: string; text: string; bold?: boolean }[]) {
    const children = blocks.map((b) => {
      if (b.tag) {
        return {
          tag: b.tag,
          type: 'heading',
          format: '',
          indent: 0,
          version: 1,
          children: [{ text: b.text, type: 'text', version: 1, ...(b.bold ? { format: 1 } : {}) }],
          direction: 'ltr',
        }
      }
      return {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [{ text: b.text, type: 'text', version: 1, ...(b.bold ? { format: 1 } : {}) }],
        direction: 'ltr',
        textStyle: '',
        textFormat: 0,
      }
    })
    return { root: { type: 'root', format: '', indent: 0, version: 1, children, direction: 'ltr' } }
  }

  // Home page content (ID 17)
  const homeRichText = richText([
    { tag: 'h2', text: 'Live Recorded Concerts' },
    { text: 'TIMES Concerts brings you professionally recorded concerts of some of the best traditional Irish musicians around. Our videos are recorded by audio engineers and videographers on multiple cameras with audio directly from the mixing board.' },
    { text: 'With over 80 videos in our library, you can search by instrument, year of performance, or artist name. New concerts are added regularly from the annual O\'Flaherty Retreat and other events.' },
    { tag: 'h2', text: 'Affordable Access' },
    { text: 'For just $30 per year, you get unlimited access to our entire video library. Your subscription helps cover the cost of professional recording equipment, site hosting, and supports the artists who make this music possible.' },
    { tag: 'h2', text: 'Featured Events' },
    { text: 'O\'Flaherty Retreat — Our flagship annual event featuring some of the finest traditional Irish musicians from around the world. Concerts have been professionally recorded since 2017.' },
    { text: 'North Texas Irish Festival — Virtual concert sessions featuring international and local artists.' },
    { text: 'House Concerts — Intimate performances recorded in home settings, capturing the spirit of the Irish session tradition.' },
  ])

  await payload.db.pool.query(
    `INSERT INTO pages_blocks_rich_text (_order, _parent_id, _path, id, content, alignment) VALUES (1, 17, 'layout', $1, $2, 'left')`,
    [uid(), JSON.stringify(homeRichText)],
  )
  console.log('Added content to Home page')

  // Videos page (ID 18) — add video grid block
  await payload.db.pool.query(
    `INSERT INTO pages_blocks_video_grid (_order, _parent_id, _path, id, heading, columns, items_per_page, show_filters, show_playlist) VALUES (1, 18, 'layout', $1, 'Concert Video Library', '3', 9, true, true)`,
    [uid()],
  )
  console.log('Added VideoGrid block to Videos page')

  // All Access Pass page (ID 19)
  const accessRichText = richText([
    { tag: 'h2', text: 'Unlimited Access to Our Video Library' },
    { text: 'The TIMES Concerts All Access Pass gives you unlimited streaming access to our entire collection of over 80 professionally recorded traditional Irish music concerts.' },
    { tag: 'h2', text: 'What You Get' },
    { text: 'Full access to all concert recordings from the O\'Flaherty Retreat (2017–2025), North Texas Irish Festival virtual events, house concerts, and more.' },
    { text: 'New recordings added throughout the year as events happen.' },
    { text: 'Search and filter videos by instrument, artist, year, or location.' },
    { text: 'Playlist mode — queue up concerts and let them play back-to-back.' },
    { tag: 'h2', text: 'Pricing' },
    { text: '$30 per year — that\'s less than $2.50 per month for access to the finest traditional Irish music performances.' },
    { text: 'Your subscription directly supports the cost of professional recording equipment, site hosting, and the artists who make this music possible.' },
  ])

  await payload.db.pool.query(
    `INSERT INTO pages_blocks_rich_text (_order, _parent_id, _path, id, content, alignment) VALUES (1, 19, 'layout', $1, $2, 'left')`,
    [uid(), JSON.stringify(accessRichText)],
  )
  console.log('Added content to All Access Pass page')

  // FAQ page (ID 20)
  const faqRichText = richText([
    { tag: 'h2', text: 'About TIMES Concerts' },
    { tag: 'h3', text: 'What is TIMES?' },
    { text: 'TIMES stands for the Traditional Irish Music Education Society. We are a nonprofit organization dedicated to preserving and promoting traditional Irish music through high-quality concert recordings.' },
    { tag: 'h3', text: 'How are the concerts recorded?' },
    { text: 'All concerts are professionally recorded with multiple cameras and audio taken directly from the mixing board. Our production team includes experienced audio engineers and videographers who specialize in live music.' },
    { tag: 'h3', text: 'How much does a subscription cost?' },
    { text: '$30 per year gives you unlimited access to our entire video library of over 80 concert recordings.' },
    { tag: 'h3', text: 'Where does the money go?' },
    { text: 'Subscription fees cover the cost of recording equipment, video production, website hosting, and help support the artists who perform. We are a nonprofit and keep costs as low as possible.' },
    { tag: 'h3', text: 'Can I volunteer?' },
    { text: 'Yes! We are always looking for volunteers to help with concert production, video editing, and event coordination. Please use our contact form to get in touch.' },
    { tag: 'h3', text: 'How do I cancel my subscription?' },
    { text: 'You can cancel your subscription at any time from your account page. Your access will continue until the end of your current billing period.' },
  ])

  await payload.db.pool.query(
    `INSERT INTO pages_blocks_rich_text (_order, _parent_id, _path, id, content, alignment) VALUES (1, 20, 'layout', $1, $2, 'left')`,
    [uid(), JSON.stringify(faqRichText)],
  )
  console.log('Added content to FAQ page')

  // Newsletter page (ID 21)
  // Add mailing list block
  await payload.db.pool.query(
    `INSERT INTO pages_blocks_mailing_list (_order, _parent_id, _path, id, heading, description, button_label) VALUES (1, 21, 'layout', $1, 'Subscribe to Our Newsletter', 'Stay up to date with new concert recordings, upcoming events, and news from the traditional Irish music community.', 'Subscribe')`,
    [uid()],
  )
  console.log('Added MailingList block to Newsletter page')

  // Retreat pages (23-31) — add placeholder content
  const retreatYears = [
    { id: 23, year: 2017 },
    { id: 24, year: 2018 },
    { id: 25, year: 2019 },
    { id: 26, year: 2020 },
    { id: 27, year: 2021 },
    { id: 28, year: 2022 },
    { id: 29, year: 2023 },
    { id: 30, year: 2024 },
    { id: 31, year: 2025 },
  ]

  for (const retreat of retreatYears) {
    const isVirtual = retreat.year === 2020
    const retreatText = richText([
      { tag: 'h2', text: `${retreat.year} O'Flaherty ${isVirtual ? 'Virtual ' : ''}Retreat Concerts` },
      { text: `Watch the professionally recorded concert performances from the ${retreat.year} O'Flaherty ${isVirtual ? 'Virtual ' : ''}Retreat. All videos feature multi-camera production with professional audio.` },
      { text: isVirtual
        ? 'Due to the pandemic, the 2020 retreat was held virtually, bringing together musicians from around the world for online concert sessions.'
        : `The ${retreat.year} retreat brought together some of the finest traditional Irish musicians for an unforgettable weekend of music, workshops, and fellowship.`
      },
    ])

    // Add video grid block for each retreat year
    await payload.db.pool.query(
      `INSERT INTO pages_blocks_rich_text (_order, _parent_id, _path, id, content, alignment) VALUES (1, $1, 'layout', $2, $3, 'left')`,
      [retreat.id, uid(), JSON.stringify(retreatText)],
    )
    await payload.db.pool.query(
      `INSERT INTO pages_blocks_video_grid (_order, _parent_id, _path, id, heading, columns, items_per_page, show_filters, show_playlist) VALUES (2, $1, 'layout', $2, NULL, '3', 12, true, true)`,
      [retreat.id, uid()],
    )
    console.log(`Added content to ${retreat.year} retreat page`)
  }

  // ── 4. Re-publish all pages to create version records ──────────
  console.log('\nRe-publishing all Times Concerts pages...')
  const { docs: concertPages } = await payload.find({
    collection: 'pages',
    where: { tenant: { equals: CONCERTS_TENANT } },
    limit: 100,
    overrideAccess: true,
  })

  for (const p of concertPages) {
    await payload.update({
      collection: 'pages',
      id: p.id,
      data: { title: p.title, _status: 'published' } as never,
      draft: false,
      overrideAccess: true,
    })
    console.log(`Published: ${p.title}`)
  }

  // Also re-publish Erin Shore pages to sync hero slide version records
  console.log('\nRe-publishing Erin Shore theme...')
  await payload.update({
    collection: 'site-themes',
    id: ERINSHORE_THEME,
    data: { name: 'Erin Shore Theme', _status: 'published' } as never,
    draft: false,
    overrideAccess: true,
  })

  await payload.update({
    collection: 'site-themes',
    id: CONCERTS_THEME,
    data: { name: 'Times Concerts Theme', _status: 'published' } as never,
    draft: false,
    overrideAccess: true,
  })
  console.log('Re-published both site themes')

  console.log('\nDone!')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
