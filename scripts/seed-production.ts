/**
 * Production seed script — creates all tenants, themes, nav, and pages
 * Run with: DATABASE_URL=... npx tsx scripts/seed-production.ts
 */
// @ts-nocheck
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ── Helpers ──────────────────────────────────────────────────

function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr',
        textStyle: '', textFormat: 0,
        children: [{ text, type: 'text', version: 1 }],
      })),
    },
  }
}

function richTextWithHeading(headingText: string, paragraphs: string[], tag: 'h2' | 'h3' = 'h2') {
  return {
    root: {
      type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: [
        {
          tag, type: 'heading', format: '', indent: 0, version: 1, direction: 'ltr',
          children: [{ text: headingText, type: 'text', version: 1 }],
        },
        ...paragraphs.map((text) => ({
          type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr',
          textStyle: '', textFormat: 0,
          children: [{ text, type: 'text', version: 1 }],
        })),
      ],
    },
  }
}

async function run() {
  const payload = await getPayload({ config: await config })

  // ══════════════════════════════════════════════════════════════
  // TENANT 1: ERIN SHORE PRODUCTIONS
  // ══════════════════════════════════════════════════════════════

  console.log('\n═══ Creating Erin Shore Productions ═══\n')

  const erinTenant = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Erin Shore Productions',
      slug: 'erinshore',
      domain: 'erinshoreprod.com',
      theme: {
        colorPrimary: '#0d1117',
        colorAccent: '#c9a84c',
        fontFamily: 'Playfair Display, Georgia, serif',
      },
      features: {
        enableVideoGrid: false,
        enableStore: false,
        enableMailingList: false,
      },
    } as never,
    overrideAccess: true,
  })
  const erinId = erinTenant.id
  console.log(`Tenant created: Erin Shore Productions (ID ${erinId})`)

  // ── Erin Shore: Media uploads ──────────────────────────────
  console.log('\nUploading Erin Shore images...')
  const erinImageDir = path.resolve(__dirname, '../public/images/erinshore')
  const imageUploads: Record<string, number> = {}

  const erinImages = [
    { file: 'livestream-setup.jpg', name: 'Livestream Production Setup', alt: 'Professional multi-camera livestream production setup in a concert hall' },
    { file: 'orchestra-performance.jpg', name: 'Orchestra Performance', alt: 'Symphony orchestra performing on stage in a concert hall' },
    { file: 'choir-concert.jpg', name: 'Choir Concert', alt: 'Choir performing on stage in a concert hall' },
    { file: 'choir-rehearsal.jpg', name: 'Choir Rehearsal', alt: 'Choir rehearsing with sheet music in a rehearsal space' },
    { file: 'sound-engineer.jpg', name: 'Sound Engineer', alt: 'Audio engineer at a professional mixing console during a live concert' },
    { file: 'camera-operator.jpg', name: 'Camera Operator', alt: 'Camera operator filming a concert with professional video camera' },
    { file: 'streaming-monitors.jpg', name: 'Streaming Monitors', alt: 'Multiple monitors showing live video feeds during a production' },
    { file: 'concert-hall-stage.jpg', name: 'Concert Hall Stage', alt: 'Concert hall stage with professional lighting ready for performance' },
    { file: 'orchestra-closeup.jpg', name: 'Orchestra Close-up', alt: 'Close-up of orchestra musicians performing in the strings section' },
    { file: 'school-concert.jpg', name: 'School Concert', alt: 'Students performing in a school auditorium concert' },
    { file: 'outdoor-concert.jpg', name: 'Outdoor Concert', alt: 'Outdoor amphitheater concert performance with stage lighting' },
    { file: 'recording-session.jpg', name: 'Recording Session', alt: 'Musicians in a recording session with professional microphones' },
    { file: 'livestream-viewer.jpg', name: 'Livestream Viewer', alt: 'Person watching a concert livestream at home on a laptop' },
    { file: 'conductor-leading.jpg', name: 'Conductor Leading', alt: 'Conductor leading an orchestra with baton under stage lighting' },
    { file: 'mixing-desk-detail.jpg', name: 'Mixing Desk Detail', alt: 'Close-up of professional audio mixing desk with illuminated faders' },
    { file: 'festival-stage.jpg', name: 'Festival Stage', alt: 'Large outdoor music festival stage with lighting and audience' },
    { file: 'mixing-console.jpg', name: 'Mixing Console', alt: 'Professional audio mixing console in a studio environment' },
    { file: 'hero-1.jpg', name: 'Hero Concert 1', alt: 'Live concert performance with dramatic stage lighting' },
    { file: 'hero-2.jpg', name: 'Hero Concert 2', alt: 'Concert performance with vibrant lighting and audience' },
    { file: 'hero-3.jpg', name: 'Hero Concert 3', alt: 'Orchestra and choir performing together on stage' },
  ]

  for (const img of erinImages) {
    const filePath = path.resolve(erinImageDir, img.file)
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${img.file} (not found)`)
      continue
    }
    const buffer = fs.readFileSync(filePath)
    const media = await payload.create({
      collection: 'media',
      data: { name: img.name, alt: img.alt, tenant: erinId } as never,
      file: { data: buffer, name: img.file, mimetype: 'image/jpeg', size: buffer.length },
      overrideAccess: true,
    })
    imageUploads[img.file] = media.id as number
    console.log(`  ${img.file} → ID ${media.id}`)
  }

  // ── Erin Shore: Site Theme ─────────────────────────────────
  console.log('\nCreating Erin Shore theme...')
  const erinTheme = await payload.create({
    collection: 'site-themes',
    data: {
      name: 'Erin Shore Theme',
      tenant: erinId,
      _status: 'published',
      siteProfile: {
        siteName: 'Erin Shore Productions',
        footerText: '© {{year}} Erin Shore Productions. All rights reserved.',
        footerLinks: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      heroSlides: [
        { image: imageUploads['hero-1.jpg'], alt: 'Live concert performance with dramatic stage lighting' },
        { image: imageUploads['hero-2.jpg'], alt: 'Concert performance with vibrant lighting and audience' },
        { image: imageUploads['hero-3.jpg'], alt: 'Orchestra and choir performing together on stage' },
      ].filter(s => s.image),
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Open Sans',
        h1Size: 48, h2Size: 36, h3Size: 26, h4Size: 22,
        bodySize: 17, headingWeight: '700', lineHeight: '1.6',
      },
      colors: {
        primary: '#0d1117', accent: '#c9a84c', accentHover: '#b8942f',
        bodyBackground: '#ffffff', bodyText: '#1a1a2e',
        navBackground: '#0d1117', navText: '#ffffffd9',
        footerBackground: '#0d1117', footerText: '#ffffff99',
        darkSectionBg: '#13161d',
      },
      navigation: { fontSize: 13, textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1' },
      hero: { height: 80, minHeight: 500, maxHeight: 800, overlayOpacity: '0.5', headlineSize: 3.5, subheadlineSize: 1.4 },
      buttons: { borderRadius: '4', paddingX: '2.5', paddingY: '0.6', fontWeight: '600', textTransform: 'uppercase' },
      spacing: { sectionPadding: '5', containerWidth: '1200' },
    } as never,
    overrideAccess: true,
  })
  console.log(`Theme created: ID ${erinTheme.id}`)

  // ── Erin Shore: Navigation ─────────────────────────────────
  console.log('\nCreating Erin Shore navigation...')
  const erinNav = [
    { label: 'Home', href: '/', order: 0 },
    { label: 'Livestreaming', href: '/livestreaming', order: 1 },
    { label: 'Concert Recording', href: '/concert-recording', order: 2 },
    { label: 'Live Sound', href: '/live-sound', order: 3 },
    { label: 'Portfolio', href: '/portfolio', order: 4 },
    { label: 'About', href: '/about', order: 5 },
    { label: 'Contact', href: '/contact', order: 6 },
  ]
  for (const nav of erinNav) {
    await payload.create({
      collection: 'navigation',
      data: { ...nav, tenant: erinId, openInNewTab: false } as never,
      overrideAccess: true,
    })
  }
  console.log(`  ${erinNav.length} nav items created`)

  // ── Erin Shore: Pages ──────────────────────────────────────
  console.log('\nCreating Erin Shore pages...')

  // Home page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home', slug: 'home', pageType: 'home', tenant: erinId, _status: 'published',
      heroHeadline: 'Professional Concert Livestreaming',
      heroSubheadline: 'Bringing orchestras, choirs, and ensembles to global audiences with multi-camera production.',
      metaTitle: 'Erin Shore Productions | Concert Livestreaming & Production',
      metaDescription: 'Professional concert livestreaming, video recording, and audio production for orchestras, choirs, and music education programs across D/FW.',
      layout: [
        {
          blockType: 'section', style: 'light', padding: 'large', containerWidth: 'default',
          content: [
            {
              blockType: 'columns', layout: 'half-half',
              columns: [
                { content: richTextWithHeading('Your Performance. Their Living Room.', [
                  'Erin Shore Productions specializes in bringing live concert experiences to audiences everywhere. Whether it\'s a symphony orchestra, a school choir, or a community ensemble — we make sure every performance reaches the people who matter most.',
                  'From multi-camera livestreaming to professional concert recording and live sound engineering, we handle the technical production so you can focus on the music.',
                ]) },
                { content: richText([]) },
              ],
            },
          ],
        },
        {
          blockType: 'section', style: 'muted', padding: 'large', containerWidth: 'default',
          content: [
            {
              blockType: 'cardGrid', columns: '3',
              cards: [
                { title: 'Concert Livestreaming', description: 'Multi-camera, multi-platform broadcast production for orchestras, choirs, and ensembles. Stream to YouTube, Facebook, Vimeo, or private ticketed platforms.' },
                { title: 'Concert Recording', description: 'Professional 4K video and high-fidelity audio recording. Multi-camera coverage with direct board audio feeds for the best possible capture.' },
                { title: 'Live Sound', description: 'Expert sound reinforcement and audio engineering for concert halls, auditoriums, and outdoor venues. Crystal-clear sound for every seat in the house.' },
              ],
            },
          ],
        },
        {
          blockType: 'section', style: 'dark', padding: 'medium', containerWidth: 'default',
          content: [
            {
              blockType: 'columns', layout: 'quarters',
              columns: [
                { content: richTextWithHeading('200+', ['Concerts Streamed']) },
                { content: richTextWithHeading('30,000', ['Global Viewers']) },
                { content: richTextWithHeading('25', ['Countries Reached']) },
                { content: richTextWithHeading('8+', ['Years Experience']) },
              ],
            },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Ready to Reach a Wider Audience?',
          description: 'Let\'s talk about bringing your next performance to a global audience.',
          buttonText: 'Get in Touch',
          buttonLink: '/contact',
          style: 'accent',
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  Home page created')

  // Livestreaming page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Concert Livestreaming', slug: 'livestreaming', pageType: 'general', tenant: erinId, _status: 'published',
      heroHeadline: 'Concert Livestreaming',
      heroSubheadline: 'Multi-camera, multi-platform broadcast production for orchestras, choirs, and ensembles.',
      metaTitle: 'Concert Livestreaming Services | Erin Shore Productions',
      metaDescription: 'Professional multi-camera concert livestreaming to YouTube, Facebook, Vimeo, and private platforms.',
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Professional Livestream Production', [
            'We provide end-to-end livestream production for concert venues across the Dallas-Fort Worth metroplex. Our team handles everything from camera placement and audio routing to encoding and platform delivery.',
            'Whether you\'re streaming a symphony concert to season ticket holders at home, broadcasting a school choir concert to family across the country, or running a ticketed virtual event — we have the equipment and expertise to deliver a polished, professional broadcast.',
          ]),
        },
        {
          blockType: 'cardGrid', columns: '4',
          cards: [
            { title: 'Plan', description: 'We survey your venue, plan camera angles, and coordinate with your audio team.' },
            { title: 'Setup', description: 'Our crew arrives early to set up cameras, audio feeds, and streaming encoders.' },
            { title: 'Broadcast', description: 'We manage the live switch, audio mix, and platform delivery in real-time.' },
            { title: 'Deliver', description: 'After the event, you receive a full recording for archive or on-demand viewing.' },
          ],
        },
        {
          blockType: 'accordion',
          items: [
            { title: 'What internet speed do you need?', content: richText(['We recommend a minimum of 20 Mbps upload speed for a reliable HD stream. We bring our own bonded cellular backup for venues with unreliable connections.']) },
            { title: 'How many cameras do you use?', content: richText(['Typically 3-5 cameras depending on the venue and performance. We use a mix of PTZ (remote-controlled) cameras and operated cameras for the best coverage.']) },
            { title: 'Can viewers interact during the stream?', content: richText(['Yes — we can enable live chat on YouTube and Facebook. For private events, we can set up moderated Q&A or audience polling.']) },
            { title: 'Do we get a recording afterward?', content: richText(['Absolutely. Every livestream is recorded at full quality. You\'ll receive an edited recording within 5-7 business days.']) },
            { title: 'How much does it cost?', content: richText(['Pricing depends on the venue, number of cameras, and stream duration. Most single-concert productions range from $1,500-$3,500. Contact us for a custom quote.']) },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Start Streaming Your Concerts',
          description: 'Contact us for a free consultation and venue assessment.',
          buttonText: 'Get a Quote',
          buttonLink: '/contact',
          style: 'accent',
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  Livestreaming page created')

  // Concert Recording page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Concert Recording', slug: 'concert-recording', pageType: 'general', tenant: erinId, _status: 'published',
      heroHeadline: 'Concert Recording',
      heroSubheadline: 'Professional 4K video and high-fidelity audio recording for orchestras, choirs, and ensembles.',
      metaTitle: 'Concert Recording Services | Erin Shore Productions',
      metaDescription: 'Professional multi-camera 4K concert recording with high-fidelity audio for orchestras and choirs.',
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Capture Every Performance', [
            'Our concert recording service captures your performance with the same multi-camera setup used for our livestreams — but optimized for post-production. We record at 4K resolution with high-fidelity audio taken directly from the mixing board.',
            'The result is a polished, professionally edited concert video suitable for promotional use, audition reels, grant applications, or on-demand streaming.',
          ]),
        },
        {
          blockType: 'cardGrid', columns: '3',
          cards: [
            { title: 'Multi-Camera 4K', description: 'Multiple camera angles captured in 4K resolution for cinematic concert videos.' },
            { title: 'Direct Board Audio', description: 'Audio captured directly from the mixing board for the highest fidelity recording.' },
            { title: 'Professional Editing', description: 'Full post-production editing with color correction, audio mastering, and multi-angle cuts.' },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Record Your Next Concert',
          description: 'Let\'s create a professional recording of your next performance.',
          buttonText: 'Contact Us',
          buttonLink: '/contact',
          style: 'accent',
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  Concert Recording page created')

  // Live Sound page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Live Sound', slug: 'live-sound', pageType: 'general', tenant: erinId, _status: 'published',
      heroHeadline: 'Live Sound',
      heroSubheadline: 'Expert sound reinforcement and audio engineering for concert halls, auditoriums, and outdoor venues.',
      metaTitle: 'Live Sound Engineering | Erin Shore Productions',
      metaDescription: 'Professional live sound engineering and reinforcement for concerts, auditoriums, and outdoor venues.',
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Crystal-Clear Sound for Every Seat', [
            'Great sound is the foundation of every great concert. Our live sound engineering team brings professional-grade equipment and years of experience mixing orchestras, choirs, and ensembles in venues of all sizes.',
            'From intimate recital halls to large outdoor amphitheaters, we ensure every audience member hears the music the way the performers intended.',
          ]),
        },
        {
          blockType: 'cardGrid', columns: '3',
          cards: [
            { title: 'Concert Halls', description: 'Tuned reinforcement for orchestras and choirs in traditional concert venues.' },
            { title: 'Auditoriums', description: 'School and community auditorium sound systems optimized for music performance.' },
            { title: 'Outdoor Events', description: 'Full PA systems for outdoor concerts, festivals, and community events.' },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Need Sound for Your Next Event?',
          description: 'Contact us for a free consultation.',
          buttonText: 'Get in Touch',
          buttonLink: '/contact',
          style: 'accent',
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  Live Sound page created')

  // About page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'About', slug: 'about', pageType: 'general', tenant: erinId, _status: 'published',
      heroHeadline: 'About Erin Shore Productions',
      heroSubheadline: 'Bringing live music to global audiences since 2016.',
      metaTitle: 'About | Erin Shore Productions',
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Our Story', [
            'Erin Shore Productions was founded with a simple mission: help performing arts organizations share their music with the world. What started as a small livestreaming operation has grown into a full-service concert production company serving orchestras, choirs, and music education programs across the Dallas-Fort Worth metroplex.',
            'We believe every performance deserves to be shared. Whether it\'s a parent watching their child\'s school concert from across the country, a donor experiencing a symphony from home, or a music director reviewing a recording for artistic growth — we make it happen with professional-grade production.',
          ]),
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  About page created')

  // Portfolio page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Portfolio', slug: 'portfolio', pageType: 'general', tenant: erinId, _status: 'published',
      heroHeadline: 'Our Work',
      heroSubheadline: 'A selection of our concert productions.',
      metaTitle: 'Portfolio | Erin Shore Productions',
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richText([
            'Browse a selection of our recent concert livestreams, recordings, and productions. Each project showcases our multi-camera production capabilities and commitment to professional quality.',
          ]),
        },
        {
          blockType: 'videoEmbed',
          url: 'https://vimeo.com/903409939',
          caption: 'Sample Concert Production',
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  Portfolio page created')

  // Contact page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact', slug: 'contact', pageType: 'contact', tenant: erinId, _status: 'published',
      heroHeadline: 'Contact Us',
      heroSubheadline: 'Get in touch for a free consultation.',
      metaTitle: 'Contact | Erin Shore Productions',
      metaDescription: 'Contact Erin Shore Productions for concert livestreaming, recording, and live sound services in the Dallas-Fort Worth area.',
    } as never,
    overrideAccess: true,
  })
  console.log('  Contact page created')

  // ══════════════════════════════════════════════════════════════
  // TENANT 2: TIMES CONCERTS
  // ══════════════════════════════════════════════════════════════

  console.log('\n═══ Creating TIMES Concerts ═══\n')

  const concertsTenant = await payload.create({
    collection: 'tenants',
    data: {
      name: 'TIMES Concerts',
      slug: 'times-concerts',
      domain: 'timesconcerts.com',
      theme: {
        colorPrimary: '#333333',
        colorAccent: '#2EA3F2',
        fontFamily: 'Open Sans, Arial, sans-serif',
      },
      features: {
        enableVideoGrid: true,
        enableStore: false,
        enableMailingList: true,
      },
    } as never,
    overrideAccess: true,
  })
  const concertsId = concertsTenant.id
  console.log(`Tenant created: TIMES Concerts (ID ${concertsId})`)

  // ── Times Concerts: Site Theme ─────────────────────────────
  console.log('\nCreating Times Concerts theme...')
  await payload.create({
    collection: 'site-themes',
    data: {
      name: 'Times Concerts Theme',
      tenant: concertsId,
      _status: 'published',
      siteProfile: {
        siteName: 'TIMES Concerts',
        footerText: '© {{year}} Traditional Irish Music Education Society. All rights reserved.',
        footerLinks: [
          { label: 'FAQ', href: '/faq' },
          { label: 'Newsletter', href: '/newsletter' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      seo: {
        defaultMetaKeywords: 'irish music, traditional music, concerts, trad sessions, O\'Flaherty Retreat, TIMES, fiddle, tin whistle',
      },
      typography: {
        headingFont: 'Lato', bodyFont: 'Nunito',
        h1Size: 36, h2Size: 28, h3Size: 22, h4Size: 18,
        bodySize: 16, headingWeight: '700', lineHeight: '1.8',
      },
      colors: {
        primary: '#333333', accent: '#2EA3F2', accentHover: '#1a8cd8',
        bodyBackground: '#ffffff', bodyText: '#666666',
        navBackground: '#333333', navText: '#ffffffd9',
        footerBackground: '#222222', footerText: '#ffffffb3',
        darkSectionBg: '#2c2c2c',
      },
      navigation: { fontSize: 14, textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5' },
      hero: { height: 60, minHeight: 350, maxHeight: 600, overlayOpacity: '0.5', headlineSize: 2.8, subheadlineSize: 1.2 },
      buttons: { borderRadius: '4', paddingX: '1.5', paddingY: '0.6', fontWeight: '600', textTransform: 'uppercase' },
      spacing: { sectionPadding: '4', containerWidth: '1200' },
    } as never,
    overrideAccess: true,
  })
  console.log('  Theme created')

  // ── Times Concerts: Navigation ─────────────────────────────
  console.log('\nCreating Times Concerts navigation...')
  const concertsNav = [
    { label: 'Home', href: '/', order: 1 },
    { label: 'Videos', href: '/videos', order: 2 },
    { label: 'All Access Pass', href: '/all-access-pass', order: 3 },
    { label: 'FAQ', href: '/faq', order: 4 },
    { label: 'Newsletter', href: '/newsletter', order: 5 },
    { label: 'Contact', href: '/contact', order: 6 },
  ]
  for (const nav of concertsNav) {
    await payload.create({
      collection: 'navigation',
      data: { ...nav, tenant: concertsId, openInNewTab: false } as never,
      overrideAccess: true,
    })
  }
  console.log(`  ${concertsNav.length} nav items created`)

  // ── Times Concerts: Pages ──────────────────────────────────
  console.log('\nCreating Times Concerts pages...')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home', slug: 'home', pageType: 'home', tenant: concertsId, _status: 'published',
      heroHeadline: 'TIMES Concerts',
      heroSubheadline: 'Live recorded concerts of some of the best traditional Irish musicians around.',
      metaTitle: 'TIMES Concerts — Traditional Irish Music',
      metaDescription: 'Watch over 80 professionally recorded traditional Irish music concerts. Searchable by instrument, year, or artist.',
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Live Recorded Concerts', [
            'TIMES Concerts brings you professionally recorded concerts of some of the best traditional Irish musicians around. Our videos are recorded by audio engineers and videographers on multiple cameras with audio directly from the mixing board.',
            'With over 80 videos in our library, you can search by instrument, year of performance, or artist name. New concerts are added regularly from the annual O\'Flaherty Retreat and other events.',
          ]),
        },
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Affordable Access', [
            'For just $30 per year, you get unlimited access to our entire video library. Your subscription helps cover the cost of professional recording equipment, site hosting, and supports the artists who make this music possible.',
          ]),
        },
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Featured Events', [
            'O\'Flaherty Retreat — Our flagship annual event featuring some of the finest traditional Irish musicians from around the world. Concerts have been professionally recorded since 2017.',
            'North Texas Irish Festival — Virtual concert sessions featuring international and local artists.',
            'House Concerts — Intimate performances recorded in home settings, capturing the spirit of the Irish session tradition.',
          ]),
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  Home page created')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Concert Videos', slug: 'videos', pageType: 'general', tenant: concertsId, _status: 'published',
      heroHeadline: 'Concert Videos',
      heroSubheadline: 'Over 80 professionally recorded traditional music videos. Search by instrument, year, or artist.',
      metaTitle: 'Concert Videos — TIMES Concerts',
      metaDescription: 'Browse and watch over 80 professionally recorded traditional Irish music concert videos.',
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richText(['Browse our full collection of professionally recorded traditional Irish music concerts. Use the filters below to search by instrument, year, or location. Click any video to watch, or use playlist mode to queue up a continuous concert experience.']),
        },
        {
          blockType: 'videoGrid',
          heading: 'Concert Video Library',
          columns: '3',
          itemsPerPage: 9,
          showFilters: true,
          showPlaylist: true,
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  Videos page created')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'All Access Pass', slug: 'all-access-pass', pageType: 'general', tenant: concertsId, _status: 'published',
      heroHeadline: 'All Access Pass',
      heroSubheadline: 'Get unlimited access to our entire video library.',
      metaTitle: 'All Access Pass — TIMES Concerts',
      metaDescription: 'Subscribe for $30/year and get unlimited access to over 80 professionally recorded traditional Irish music concerts.',
      requiresSubscription: true,
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Unlimited Access to Our Video Library', [
            'The TIMES Concerts All Access Pass gives you unlimited streaming access to our entire collection of over 80 professionally recorded traditional Irish music concerts.',
          ]),
        },
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('What You Get', [
            'Full access to all concert recordings from the O\'Flaherty Retreat (2017–2025), North Texas Irish Festival virtual events, house concerts, and more.',
            'New recordings added throughout the year as events happen.',
            'Search and filter videos by instrument, artist, year, or location.',
            'Playlist mode — queue up concerts and let them play back-to-back.',
          ]),
        },
        {
          blockType: 'richText', alignment: 'left',
          content: richTextWithHeading('Pricing', [
            '$30 per year — that\'s less than $2.50 per month for access to the finest traditional Irish music performances.',
            'Your subscription directly supports the cost of professional recording equipment, site hosting, and the artists who make this music possible.',
          ]),
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  All Access Pass page created')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'FAQ', slug: 'faq', pageType: 'general', tenant: concertsId, _status: 'published',
      heroHeadline: 'Frequently Asked Questions',
      heroSubheadline: 'Everything you need to know about TIMES Concerts.',
      metaTitle: 'FAQ — TIMES Concerts',
      metaDescription: 'Frequently asked questions about TIMES Concerts, subscriptions, and volunteer opportunities.',
      layout: [
        {
          blockType: 'accordion',
          items: [
            { title: 'What is TIMES?', content: richText(['TIMES stands for the Traditional Irish Music Education Society. We are a nonprofit organization dedicated to preserving and promoting traditional Irish music through high-quality concert recordings.']) },
            { title: 'How are the concerts recorded?', content: richText(['All concerts are professionally recorded with multiple cameras and audio taken directly from the mixing board. Our production team includes experienced audio engineers and videographers who specialize in live music.']) },
            { title: 'How much does a subscription cost?', content: richText(['$30 per year gives you unlimited access to our entire video library of over 80 concert recordings.']) },
            { title: 'Where does the money go?', content: richText(['Subscription fees cover the cost of recording equipment, video production, website hosting, and help support the artists who perform. We are a nonprofit and keep costs as low as possible.']) },
            { title: 'Can I volunteer?', content: richText(['Yes! We are always looking for volunteers to help with concert production, video editing, and event coordination. Please use our contact form to get in touch.']) },
            { title: 'How do I cancel my subscription?', content: richText(['You can cancel your subscription at any time from your account page. Your access will continue until the end of your current billing period.']) },
          ],
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  FAQ page created')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Newsletter', slug: 'newsletter', pageType: 'general', tenant: concertsId, _status: 'published',
      heroHeadline: 'Newsletter',
      heroSubheadline: 'Stay up to date with the latest concerts and events.',
      metaTitle: 'Newsletter — TIMES Concerts',
      metaDescription: 'Subscribe to the TIMES Concerts newsletter for updates on new concerts and events.',
      layout: [
        {
          blockType: 'richText', alignment: 'left',
          content: richText(['Stay connected with TIMES Concerts. Subscribe to our newsletter for updates on new concert recordings, upcoming events, and news from the traditional Irish music community.']),
        },
        {
          blockType: 'mailingList',
          heading: 'Subscribe to Our Newsletter',
          description: 'Get notified when new concert recordings are added and stay up to date with upcoming events.',
          buttonLabel: 'Subscribe',
        },
      ],
    } as never,
    overrideAccess: true,
  })
  console.log('  Newsletter page created')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact', slug: 'contact', pageType: 'contact', tenant: concertsId, _status: 'published',
      heroHeadline: 'Contact Us',
      heroSubheadline: 'Get in touch with the TIMES Concerts team.',
      metaTitle: 'Contact — TIMES Concerts',
      metaDescription: 'Contact the Traditional Irish Music Education Society about concerts, volunteering, or general inquiries.',
    } as never,
    overrideAccess: true,
  })
  console.log('  Contact page created')

  // Retreat pages
  const retreatYears = [
    { year: 2017, slug: '2017-oflaherty-retreat' },
    { year: 2018, slug: '2018-oflaherty-retreat' },
    { year: 2019, slug: '2019-oflaherty-retreat' },
    { year: 2020, slug: '2020-oflaherty-virtual' },
    { year: 2021, slug: '2021-oflaherty-retreat' },
    { year: 2022, slug: '2022-oflaherty-retreat' },
    { year: 2023, slug: '2023-oflaherty-retreat' },
    { year: 2024, slug: '2024-oflaherty-retreat' },
    { year: 2025, slug: '2025-oflaherty-retreat' },
  ]

  for (const retreat of retreatYears) {
    const isVirtual = retreat.year === 2020
    const label = `${retreat.year} O'Flaherty ${isVirtual ? 'Virtual ' : ''}Retreat`
    await payload.create({
      collection: 'pages',
      data: {
        title: label, slug: retreat.slug, pageType: 'general', tenant: concertsId, _status: 'published',
        heroHeadline: label,
        heroSubheadline: `Concert recordings from the ${label}.`,
        metaTitle: `${label} — TIMES Concerts`,
        metaDescription: `Watch professionally recorded concerts from the ${label}.`,
        requiresSubscription: true,
        gatedMessage: 'This content requires an All Access Pass. Subscribe for $30/year to watch all concert recordings.',
        layout: [
          {
            blockType: 'richText', alignment: 'left',
            content: richText([
              `Watch the professionally recorded concert performances from the ${label}. All videos feature multi-camera production with professional audio.`,
              isVirtual
                ? 'Due to the pandemic, the 2020 retreat was held virtually, bringing together musicians from around the world for online concert sessions.'
                : `The ${retreat.year} retreat brought together some of the finest traditional Irish musicians for an unforgettable weekend of music, workshops, and fellowship.`,
            ]),
          },
          {
            blockType: 'videoGrid',
            columns: '3',
            itemsPerPage: 12,
            showFilters: true,
            showPlaylist: true,
          },
        ],
      } as never,
      overrideAccess: true,
    })
    console.log(`  ${label} page created`)
  }

  // ── Video Grid: Seed instruments & locations ───────────────
  console.log('\nSeeding video grid instruments & locations...')
  const instruments = [
    'Fiddle', 'Mandolin', 'Vocals', 'Dance', 'Guitar', 'Bouzouki',
    'Bodhrán', 'Concertina', 'Button Accordion', 'Piano Accordion',
    'Piano', 'Flute', 'Whistle', 'Uilleann Pipes', 'Harp', 'Banjo', 'Tenor Guitar',
  ]
  for (const name of instruments) {
    await payload.create({
      collection: 'video-grid-instruments',
      data: { name, tenant: concertsId } as never,
      overrideAccess: true,
    })
  }
  console.log(`  ${instruments.length} instruments created`)

  const locations = ['O\'Flaherty Retreat', 'House Concert']
  for (const name of locations) {
    await payload.create({
      collection: 'video-grid-locations',
      data: { name, tenant: concertsId } as never,
      overrideAccess: true,
    })
  }
  console.log(`  ${locations.length} locations created`)

  // ── Update super-admin user with tenant ────────────────────
  console.log('\nUpdating super-admin user...')
  const { docs: users } = await payload.find({
    collection: 'users',
    where: { email: { equals: 'tim@erinshoreprod.com' } },
    limit: 1,
    overrideAccess: true,
  })
  if (users.length > 0) {
    await payload.update({
      collection: 'users',
      id: users[0].id,
      data: { role: 'super-admin', tenant: erinId } as never,
      overrideAccess: true,
    })
    console.log('  Updated tim@erinshoreprod.com as super-admin')
  }

  console.log('\n═══ Production seed complete! ═══\n')
  console.log(`Erin Shore Productions: tenant ID ${erinId}`)
  console.log(`TIMES Concerts: tenant ID ${concertsId}`)
  console.log('\nNext steps:')
  console.log('  1. Add erinshorewebman.com domain in Coolify')
  console.log('  2. Add erinshoreprod.com and timesconcerts.com as additional domains')
  console.log('  3. Configure Cloudflare DNS for all domains')

  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
