import { getPayload } from 'payload'
import config from '../src/payload.config'
import crypto from 'crypto'

const CONCERTS_TENANT = 3

function uid() {
  return crypto.randomBytes(12).toString('hex')
}

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

async function run() {
  const payload = await getPayload({ config: await config })
  const db = payload.db.pool

  // Get all Times Concerts pages and their latest version IDs
  const pagesResult = await db.query(
    `SELECT p.id, p.title, p.slug, v.id as version_id
     FROM pages p
     JOIN _pages_v v ON v.parent_id = p.id AND v.latest = true
     WHERE p.tenant_id = $1
     ORDER BY p.id`,
    [CONCERTS_TENANT],
  )

  const pageMap = new Map<string, { pageId: number; versionId: number; title: string }>()
  for (const row of pagesResult.rows) {
    pageMap.set(row.slug, { pageId: row.id, versionId: row.version_id, title: row.title })
  }

  console.log(`Found ${pageMap.size} pages with versions`)

  // Helper: insert rich text into both live and version tables
  async function insertRichText(
    slug: string,
    order: number,
    content: ReturnType<typeof richText>,
  ) {
    const page = pageMap.get(slug)
    if (!page) {
      console.log(`  Skipping ${slug} — not found`)
      return
    }
    const blockId = uid()
    const jsonContent = JSON.stringify(content)

    // Live table
    await db.query(
      `INSERT INTO pages_blocks_rich_text (_order, _parent_id, _path, id, content, alignment)
       VALUES ($1, $2, 'layout', $3, $4, 'left')`,
      [order, page.pageId, blockId, jsonContent],
    )

    // Version table
    await db.query(
      `INSERT INTO _pages_v_blocks_rich_text (_order, _parent_id, _path, content, alignment, _uuid)
       VALUES ($1, $2, 'version_layout', $3, 'left', $4)`,
      [order, page.versionId, jsonContent, blockId],
    )

    console.log(`  Added rich text to ${page.title} (order ${order})`)
  }

  // Helper: insert video grid block into both tables
  async function insertVideoGrid(
    slug: string,
    order: number,
    heading: string | null,
  ) {
    const page = pageMap.get(slug)
    if (!page) return
    const blockId = uid()

    await db.query(
      `INSERT INTO pages_blocks_video_grid (_order, _parent_id, _path, id, heading, columns, items_per_page, show_filters, show_playlist)
       VALUES ($1, $2, 'layout', $3, $4, '3', 9, true, true)`,
      [order, page.pageId, blockId, heading],
    )

    await db.query(
      `INSERT INTO _pages_v_blocks_video_grid (_order, _parent_id, _path, heading, columns, items_per_page, show_filters, show_playlist, _uuid)
       VALUES ($1, $2, 'version_layout', $3, '3', 9, true, true, $4)`,
      [order, page.versionId, heading, blockId],
    )

    console.log(`  Added video grid to ${page.title} (order ${order})`)
  }

  // Helper: insert mailing list block into both tables
  async function insertMailingList(
    slug: string,
    order: number,
    heading: string,
    description: string,
    buttonLabel: string,
  ) {
    const page = pageMap.get(slug)
    if (!page) return
    const blockId = uid()

    await db.query(
      `INSERT INTO pages_blocks_mailing_list (_order, _parent_id, _path, id, heading, description, button_label)
       VALUES ($1, $2, 'layout', $3, $4, $5, $6)`,
      [order, page.pageId, blockId, heading, description, buttonLabel],
    )

    await db.query(
      `INSERT INTO _pages_v_blocks_mailing_list (_order, _parent_id, _path, heading, description, button_label, _uuid)
       VALUES ($1, $2, 'version_layout', $3, $4, $5, $6)`,
      [order, page.versionId, heading, description, buttonLabel, blockId],
    )

    console.log(`  Added mailing list to ${page.title} (order ${order})`)
  }

  // ── HOME PAGE ──────────────────────────────────────────────────
  console.log('\nHome page:')
  await insertRichText('home', 1, richText([
    { tag: 'h2', text: 'Live Recorded Concerts' },
    { text: 'TIMES Concerts brings you professionally recorded concerts of some of the best traditional Irish musicians around. Our videos are recorded by audio engineers and videographers on multiple cameras with audio directly from the mixing board.' },
    { text: 'With over 80 videos in our library, you can search by instrument, year of performance, or artist name. New concerts are added regularly from the annual O\'Flaherty Retreat and other events.' },
  ]))
  await insertRichText('home', 2, richText([
    { tag: 'h2', text: 'Affordable Access' },
    { text: 'For just $30 per year, you get unlimited access to our entire video library. Your subscription helps cover the cost of professional recording equipment, site hosting, and supports the artists who make this music possible.' },
  ]))
  await insertRichText('home', 3, richText([
    { tag: 'h2', text: 'Featured Events' },
    { text: 'O\'Flaherty Retreat — Our flagship annual event featuring some of the finest traditional Irish musicians from around the world. Concerts have been professionally recorded since 2017.' },
    { text: 'North Texas Irish Festival — Virtual concert sessions featuring international and local artists.' },
    { text: 'House Concerts — Intimate performances recorded in home settings, capturing the spirit of the Irish session tradition.' },
  ]))

  // ── VIDEOS PAGE ────────────────────────────────────────────────
  console.log('\nVideos page:')
  await insertRichText('videos', 1, richText([
    { text: 'Browse our full collection of professionally recorded traditional Irish music concerts. Use the filters below to search by instrument, year, or location. Click any video to watch, or use playlist mode to queue up a continuous concert experience.' },
  ]))
  await insertVideoGrid('videos', 2, 'Concert Video Library')

  // ── ALL ACCESS PASS ────────────────────────────────────────────
  console.log('\nAll Access Pass page:')
  await insertRichText('all-access-pass', 1, richText([
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
  ]))

  // ── FAQ ────────────────────────────────────────────────────────
  console.log('\nFAQ page:')
  await insertRichText('faq', 1, richText([
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
  ]))

  // ── NEWSLETTER ─────────────────────────────────────────────────
  console.log('\nNewsletter page:')
  await insertRichText('newsletter', 1, richText([
    { text: 'Stay connected with TIMES Concerts. Subscribe to our newsletter for updates on new concert recordings, upcoming events, and news from the traditional Irish music community.' },
  ]))
  await insertMailingList(
    'newsletter',
    2,
    'Subscribe to Our Newsletter',
    'Get notified when new concert recordings are added and stay up to date with upcoming events.',
    'Subscribe',
  )

  // ── RETREAT PAGES ──────────────────────────────────────────────
  const retreatYears = [
    { slug: '2017-oflaherty-retreat', year: 2017 },
    { slug: '2018-oflaherty-retreat', year: 2018 },
    { slug: '2019-oflaherty-retreat', year: 2019 },
    { slug: '2020-oflaherty-virtual', year: 2020 },
    { slug: '2021-oflaherty-retreat', year: 2021 },
    { slug: '2022-oflaherty-retreat', year: 2022 },
    { slug: '2023-oflaherty-retreat', year: 2023 },
    { slug: '2024-oflaherty-retreat', year: 2024 },
    { slug: '2025-oflaherty-retreat', year: 2025 },
  ]

  for (const retreat of retreatYears) {
    const isVirtual = retreat.year === 2020
    console.log(`\n${retreat.year} retreat:`)

    await insertRichText(retreat.slug, 1, richText([
      { text: `Watch the professionally recorded concert performances from the ${retreat.year} O'Flaherty ${isVirtual ? 'Virtual ' : ''}Retreat. All videos feature multi-camera production with professional audio.` },
      { text: isVirtual
        ? 'Due to the pandemic, the 2020 retreat was held virtually, bringing together musicians from around the world for online concert sessions.'
        : `The ${retreat.year} retreat brought together some of the finest traditional Irish musicians for an unforgettable weekend of music, workshops, and fellowship.`
      },
    ]))

    await insertVideoGrid(retreat.slug, 2, null)
  }

  console.log('\nAll content populated!')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
