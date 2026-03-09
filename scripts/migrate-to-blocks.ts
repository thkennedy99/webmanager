/**
 * Migration script: Convert old pages to use layout blocks + set site theme
 * Run with: npx tsx scripts/migrate-to-blocks.ts
 */
// @ts-nocheck
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function migrate() {
  const payload = await getPayload({ config: await config })
  const tenantId = 1

  console.log('Starting migration to layout blocks...\n')

  // ──────────────────────────────────────────────────────
  // 1. Set Site Theme (per-tenant collection)
  // ──────────────────────────────────────────────────────
  console.log('Setting site theme...')

  // Delete existing theme for this tenant
  const oldThemes = await payload.find({ collection: 'site-themes', where: { tenant: { equals: tenantId } }, limit: 10 })
  for (const t of oldThemes.docs) {
    await payload.delete({ collection: 'site-themes', id: t.id })
  }

  await payload.create({
    collection: 'site-themes',
    data: {
      name: 'Erin Shore Theme',
      tenant: tenantId,
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Open Sans',
        h1Size: 44,
        h2Size: 34,
        h3Size: 26,
        h4Size: 22,
        bodySize: 17,
        headingWeight: '700',
        lineHeight: '1.6',
      },
      colors: {
        primary: '#0d1117',
        accent: '#c9a84c',
        accentHover: '#b8942f',
        bodyBackground: '#ffffff',
        bodyText: '#1a1a2e',
        navBackground: '#0d1117',
        navText: '#ffffffd9',
        footerBackground: '#0d1117',
        footerText: '#ffffff99',
        darkSectionBg: '#13161d',
      },
      navigation: {
        fontSize: 13,
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: '1',
      },
      hero: {
        height: 75,
        minHeight: 450,
        maxHeight: 750,
        overlayOpacity: '0.5',
        headlineSize: 3.2,
        subheadlineSize: 1.3,
      },
      buttons: {
        borderRadius: '4',
        paddingX: '2.5',
        paddingY: '0.6',
        fontWeight: '600',
        textTransform: 'uppercase',
      },
      spacing: {
        sectionPadding: '5',
        containerWidth: '1200',
      },
    },
  })
  console.log('  Theme set.\n')

  // ──────────────────────────────────────────────────────
  // 2. Update Navigation — reorganized for the redesign
  // ──────────────────────────────────────────────────────
  console.log('Updating navigation...')

  // Delete old nav items
  const oldNav = await payload.find({ collection: 'navigation', where: { tenant: { equals: tenantId } }, limit: 50 })
  for (const item of oldNav.docs) {
    await payload.delete({ collection: 'navigation', id: item.id })
  }

  const navItems = [
    { label: 'Home', href: '/', order: 0 },
    { label: 'Services', href: '/services', order: 1 },
    { label: 'Live Streaming', href: '/live-streaming', order: 2 },
    { label: 'Artists', href: '/artists', order: 3 },
    { label: 'Videos', href: '/videos', order: 4 },
    { label: 'About', href: '/about', order: 5 },
    { label: 'Contact', href: '/contact', order: 6 },
  ]

  for (const item of navItems) {
    await payload.create({
      collection: 'navigation',
      data: {
        ...item,
        openInNewTab: false,
        tenant: tenantId,
      },
    })
  }
  console.log('  Navigation updated.\n')

  // ──────────────────────────────────────────────────────
  // 3. Delete old pages and create new block-based pages
  // ──────────────────────────────────────────────────────
  console.log('Migrating pages...')

  const oldPages = await payload.find({ collection: 'pages', where: { tenant: { equals: tenantId } }, limit: 50 })
  for (const page of oldPages.docs) {
    await payload.delete({ collection: 'pages', id: page.id })
  }

  // Helper: create a Lexical richText node from plain text paragraphs
  function richText(paragraphs: string[]) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: paragraphs.map((text) => ({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textStyle: '',
          textFormat: 0,
          children: [{ text, type: 'text', version: 1 }],
        })),
      },
    }
  }

  function heading(text: string, tag: 'h2' | 'h3' = 'h2') {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            tag,
            type: 'heading',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [{ text, type: 'text', version: 1 }],
          },
        ],
      },
    }
  }

  function richTextWithHeadingAndParagraphs(headingText: string, paragraphs: string[], tag: 'h2' | 'h3' = 'h2') {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            tag,
            type: 'heading',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [{ text: headingText, type: 'text', version: 1 }],
          },
          ...paragraphs.map((text) => ({
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            textStyle: '',
            textFormat: 0,
            children: [{ text, type: 'text', version: 1 }],
          })),
        ],
      },
    }
  }

  // ── HOME PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      pageType: 'home',
      heroHeadline: 'Erin Shore Productions',
      heroSubheadline: 'D/FW concert livestreaming, video, and audio production for orchestras, choirs, and folk ensembles.',
      metaTitle: 'Erin Shore Productions | Concert Livestreaming & Production',
      metaDescription: 'D/FW\'s premier concert livestreaming and production company specializing in orchestras, choirs, and folk music.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'richText',
          content: richTextWithHeadingAndParagraphs(
            'What We Do',
            [
              'From intimate acoustic sessions to major festival productions, we capture every performance with care and precision.',
            ],
          ),
          maxWidth: '600',
          alignment: 'center',
        },
        {
          blockType: 'cardGrid',
          columns: '3',
          cards: [
            {
              title: 'Concert Livestreaming',
              description: 'Multi-camera, multi-platform broadcasts that bring your performance to audiences worldwide in real time.',
              image: null,
            },
            {
              title: 'Video Production',
              description: 'Professional 4K concert recording, music videos, and post-production editing for distribution or archival.',
              image: null,
            },
            {
              title: 'Audio Engineering',
              description: 'Crystal-clear live sound and studio recording for orchestras, choirs, and acoustic ensembles.',
              image: null,
            },
          ],
        },
        {
          blockType: 'button',
          buttons: [
            {
              label: 'View All Services',
              link: '/services',
              style: 'accent',
              size: 'normal',
            },
          ],
          alignment: 'center',
        },
        {
          blockType: 'spacer',
          size: 'medium',
          showDivider: false,
        },
        {
          blockType: 'section',
          style: 'dark',
          padding: 'medium',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'quarters',
              gap: 'medium',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeadingAndParagraphs('8+', ['Years of Experience'], 'h2'),
                      maxWidth: 'full',
                      alignment: 'center',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeadingAndParagraphs('100+', ['Concerts Streamed'], 'h2'),
                      maxWidth: 'full',
                      alignment: 'center',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeadingAndParagraphs('30,000', ['Global Viewers'], 'h2'),
                      maxWidth: 'full',
                      alignment: 'center',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeadingAndParagraphs('25', ['Countries Reached'], 'h2'),
                      maxWidth: 'full',
                      alignment: 'center',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'spacer',
          size: 'medium',
          showDivider: false,
        },
        {
          blockType: 'richText',
          content: richTextWithHeadingAndParagraphs(
            'Featured Work',
            [
              'Award-winning music video production and festival-quality concert recordings.',
            ],
          ),
          maxWidth: '600',
          alignment: 'center',
        },
        {
          blockType: 'columns',
          layout: 'half-half',
          verticalAlignment: 'center',
          gap: 'large',
          columns: [
            {
              blocks: [
                {
                  blockType: 'videoEmbed',
                  url: 'https://vimeo.com/903409939',
                  caption: 'She Moves Through the Fair — 2002',
                },
              ],
            },
            {
              blocks: [
                {
                  blockType: 'richText',
                  content: richTextWithHeadingAndParagraphs(
                    'She Moves Through the Fair',
                    [
                      'Our award-winning music video for the band 2002, selected for multiple international film festivals including the European Cinematography Awards in Amsterdam and the Big Apple Film Festival.',
                    ],
                    'h3',
                  ),
                  maxWidth: 'full',
                },
                {
                  blockType: 'button',
                  buttons: [
                    {
                      label: 'Watch More Videos',
                      link: '/videos',
                      style: 'accent',
                      size: 'normal',
                    },
                  ],
                  alignment: 'left',
                },
              ],
            },
          ],
        },
        {
          blockType: 'spacer',
          size: 'medium',
          showDivider: false,
        },
        {
          blockType: 'section',
          style: 'muted',
          padding: 'medium',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeadingAndParagraphs(
                'Who We Work With',
                [
                  'We specialize in genres where audio clarity and musical nuance matter most.',
                ],
              ),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'columns',
              layout: 'thirds',
              gap: 'medium',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeadingAndParagraphs(
                        'Orchestras & Ensembles',
                        ['Multi-camera recording and livestreaming for symphonies, chamber groups, and school orchestras.'],
                        'h3',
                      ),
                      maxWidth: 'full',
                      alignment: 'center',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeadingAndParagraphs(
                        'Choirs & Choral Groups',
                        ['Pristine audio capture for church choirs, school choruses, and community vocal ensembles.'],
                        'h3',
                      ),
                      maxWidth: 'full',
                      alignment: 'center',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeadingAndParagraphs(
                        'Folk & Acoustic Artists',
                        ['Intimate recording and streaming for singer-songwriters, Irish traditional, Celtic, and Americana music.'],
                        'h3',
                      ),
                      maxWidth: 'full',
                      alignment: 'center',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Let\'s Capture Your Next Performance',
          text: 'Whether you need a single-camera recording or a full multi-platform livestream production, we have the equipment and experience to make it happen.',
          buttonLabel: 'Get a Free Quote',
          buttonLink: '/contact',
          style: 'dark',
        },
      ],
    },
  })
  console.log('  Created: Home')

  // ── SERVICES PAGE (replaces livestream-video + video-audio) ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Our Services',
      slug: 'services',
      pageType: 'general',
      heroHeadline: 'Our Services',
      heroSubheadline: 'Professional livestreaming, video, and audio production for orchestras, choirs, and folk ensembles.',
      metaTitle: 'Services | Erin Shore Productions',
      metaDescription: 'Concert livestreaming, video recording, audio engineering, and live sound for D/FW orchestras, choirs, and folk music.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'richText',
          content: richTextWithHeadingAndParagraphs(
            'Concert Live Streaming',
            [
              'Erin Shore Productions has pioneered concert livestreaming in the D/FW area for over 8 years. We deliver hybrid concert experiences where live audiences energize performers while remote viewers watch simultaneously from anywhere in the world.',
              'Our multi-camera setups capture every angle of the performance, while our streaming infrastructure ensures reliable delivery to YouTube, Facebook, Vimeo, and private ticketed platforms.',
            ],
          ),
          maxWidth: '800',
        },
        {
          blockType: 'cardGrid',
          heading: 'What We Offer',
          columns: '3',
          cards: [
            {
              title: 'Multi-Camera Livestreaming',
              description: 'Up to 4 concurrent 4K camera shoots with professional switching, graphics overlay, and multi-platform streaming to YouTube, Facebook, and private ticketed platforms.',
            },
            {
              title: 'Concert Video Recording',
              description: '$60,000+ in professional Panasonic 4K camera equipment. Full concert recordings with professional editing for distribution, archival, or festival submission.',
            },
            {
              title: 'Live Sound Engineering',
              description: 'Expert audio engineering adapted to any venue \u2014 churches, pubs, concert halls, and outdoor spaces. We specialize in acoustic, choral, and orchestral sound.',
            },
            {
              title: 'CD & Album Recording',
              description: 'Studio and live recording services including mixing, mastering, and distribution. We handle music licensing and digital distribution to all major platforms.',
            },
            {
              title: 'Event Production',
              description: 'Full-service event management including marketing, ticketing, production coordination, and day-of technical management for concerts and festivals.',
            },
            {
              title: 'Artist Development',
              description: 'Website development, social media management, music video production, and career guidance for emerging artists in folk, acoustic, and classical genres.',
            },
          ],
        },
        {
          blockType: 'spacer',
          size: 'medium',
          showDivider: false,
        },
        {
          blockType: 'richText',
          content: richTextWithHeadingAndParagraphs(
            'Notable Livestream Events',
            [
              'Virtual North Texas Irish Festival 2021: 39 hours of programming, 30,000 viewers across 25 countries, 30 ensembles performing live.',
              'Dallas Pride 2021 & 2024: 6-person production team, 5,000+ live attendees, simultaneous multi-platform streaming.',
              'Bob Moog Museum events celebrating synthesizer history, streamed internationally.',
              '100+ concerts from The Celt Irish Pub in McKinney, TX \u2014 a landmark venue for folk and Irish music.',
              'Gulf Coast Cruinniu 2021\u20132022: 16 international artists across multiple virtual concert sessions.',
            ],
          ),
          maxWidth: '800',
        },
        {
          blockType: 'cta',
          heading: 'Ready to Bring Your Performance to the World?',
          text: 'Whether you need a single-camera recording or a full multi-platform livestream production, we have the equipment and experience to make it happen.',
          buttonLabel: 'Get a Quote',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'dark',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: Services')

  // ── LIVE STREAMING PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Live Streaming',
      slug: 'live-streaming',
      pageType: 'general',
      heroHeadline: 'Live Streaming',
      heroSubheadline: 'Broadcast your performance to the world in real time.',
      metaTitle: 'Live Streaming | Erin Shore Productions',
      metaDescription: 'Professional multi-camera concert livestreaming for orchestras, choirs, and folk ensembles in the D/FW area.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'richText',
          content: richTextWithHeadingAndParagraphs(
            'Hybrid & Virtual Concert Experiences',
            [
              'We bring concerts to audiences everywhere. Whether your event is in-person with a livestream component, or fully virtual, our team handles every technical detail so you can focus on the music.',
              'Our streaming infrastructure supports simultaneous delivery to multiple platforms \u2014 YouTube, Facebook, Vimeo, and private ticketed platforms \u2014 with real-time graphics, lower thirds, and audience chat moderation.',
            ],
          ),
          maxWidth: '800',
        },
        {
          blockType: 'columns',
          layout: 'half-half',
          verticalAlignment: 'top',
          gap: 'medium',
          columns: [
            {
              blocks: [
                {
                  blockType: 'richText',
                  content: richTextWithHeadingAndParagraphs(
                    'In-Person + Livestream',
                    [
                      'The hybrid model lets you sell both in-person and remote tickets. Live audiences energize performers while remote viewers experience the concert in real time with professional multi-camera coverage.',
                    ],
                    'h3',
                  ),
                  maxWidth: 'full',
                },
              ],
            },
            {
              blocks: [
                {
                  blockType: 'richText',
                  content: richTextWithHeadingAndParagraphs(
                    'Fully Virtual Events',
                    [
                      'For events without a physical audience, we create professional broadcasts from studios or empty venues. Full production quality with switching, graphics, and audience interaction tools.',
                    ],
                    'h3',
                  ),
                  maxWidth: 'full',
                },
              ],
            },
          ],
        },
        {
          blockType: 'accordion',
          heading: 'Frequently Asked Questions',
          defaultOpen: true,
          items: [
            {
              title: 'What platforms do you stream to?',
              content: richText(['We support simultaneous streaming to YouTube, Facebook Live, Vimeo, and private ticketed platforms. We can also stream to custom RTMP endpoints.']),
            },
            {
              title: 'How many cameras do you use?',
              content: richText(['Our standard setup uses 2\u20134 professional Panasonic 4K cameras. For larger events, we can scale up with additional operators.']),
            },
            {
              title: 'Do you provide ticketing for virtual attendees?',
              content: richText(['Yes. We integrate with Stripe for ticketed livestreams, giving you a private stream link that only paying attendees can access.']),
            },
            {
              title: 'What\u0027s the typical turnaround for a recorded video?',
              content: richText(['Live recordings are typically edited and delivered within 5\u201310 business days. Rush delivery is available for an additional fee.']),
            },
          ],
        },
        {
          blockType: 'videoEmbed',
          url: 'https://vimeo.com/903409939',
          caption: 'She Moves Through the Fair \u2014 Music video by 2002, produced by Erin Shore Productions',
          size: 'large',
        },
        {
          blockType: 'cta',
          heading: 'Book Your Livestream',
          text: 'Contact us to discuss your upcoming concert, festival, or recital.',
          buttonLabel: 'Contact Us',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'dark',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: Live Streaming')

  // ── VIDEOS PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Videos',
      slug: 'videos',
      pageType: 'video-gallery',
      heroHeadline: 'Our Work',
      heroSubheadline: 'Watch performances we have captured and produced.',
      metaTitle: 'Videos | Erin Shore Productions',
      metaDescription: 'Watch concert recordings and music videos produced by Erin Shore Productions.',
      tenant: tenantId,
      layout: [],
    },
  })
  console.log('  Created: Videos')

  // ── ARTISTS PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Artists',
      slug: 'artists',
      pageType: 'general',
      heroHeadline: 'Our Artists',
      heroSubheadline: 'Folk, acoustic, and classical musicians we work with and represent.',
      metaTitle: 'Artists | Erin Shore Productions',
      metaDescription: 'Meet the folk, acoustic, and classical artists we work with at Erin Shore Productions.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'richText',
          content: richText([
            'Over our 10-year history, we have worked with emerging and established artists across folk, acoustic, choral, and classical genres. We provide live music bookings, livestreaming, website development, social media management, album recording, and music video production.',
            'Our artists have achieved 1 billion+ Spotify/Amazon streams, appeared on major talent shows, and qualified for Grammy nominations.',
          ]),
          maxWidth: '800',
        },
        {
          blockType: 'artistList',
          heading: 'Featured Artists',
          limit: 12,
          columns: '3',
        },
      ],
    },
  })
  console.log('  Created: Artists')

  // ── ABOUT PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'About',
      slug: 'about',
      pageType: 'general',
      heroHeadline: 'About Erin Shore Productions',
      heroSubheadline: 'D/FW\u0027s premier concert livestreaming and production company since 2014.',
      metaTitle: 'About | Erin Shore Productions',
      metaDescription: 'Learn about Erin Shore Productions, D/FW\u0027s leading concert livestreaming and production company for orchestra, choir, and folk music.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'richText',
          content: richTextWithHeadingAndParagraphs(
            'Our Story',
            [
              'Erin Shore Productions, nestled in the heart of D/FW, is your premier destination for exceptional concert livestreaming and recording services. We specialize in folk, acoustic, choral, and classical music for high schools, nonprofits, and independent artists.',
              'Founded with a passion for preserving and sharing live musical performances, we have grown into a leading provider of concert production services across North Texas and beyond.',
            ],
          ),
          maxWidth: '800',
        },
        {
          blockType: 'columns',
          layout: 'half-half',
          columns: [
            {
              blocks: [
                {
                  blockType: 'richText',
                  content: richTextWithHeadingAndParagraphs(
                    'Live Streaming Excellence',
                    ['We focus on digital reach and real-time audience engagement using state-of-the-art technology to bring live performances to viewers worldwide. Our hybrid events combine the energy of a live audience with the reach of a global broadcast.'],
                    'h3',
                  ),
                  maxWidth: 'full',
                },
              ],
            },
            {
              blocks: [
                {
                  blockType: 'richText',
                  content: richTextWithHeadingAndParagraphs(
                    'Professional Production',
                    ['Our expertise in camera work, lighting, audio engineering, and editing delivers stunning results for performances ranging from intimate acoustic sessions to full orchestral events.'],
                    'h3',
                  ),
                  maxWidth: 'full',
                },
              ],
            },
          ],
        },
        {
          blockType: 'spacer',
          size: 'small',
          showDivider: true,
        },
        {
          blockType: 'richText',
          content: richTextWithHeadingAndParagraphs(
            'Artist Development',
            [
              'Over our 10-year history, we have worked with young emerging artists, providing live music bookings, livestreaming, website development, social media management, album recording, and music video production. We help young artists advance their careers without creating financial burden.',
              'Notable outcomes include artists achieving 1 billion+ Spotify/Amazon streams, contestants on major talent shows, and Grammy nomination qualifications.',
            ],
          ),
          maxWidth: '800',
        },
        {
          blockType: 'richText',
          content: richTextWithHeadingAndParagraphs(
            'Awards & Recognition',
            [],
          ),
          maxWidth: '800',
        },
        {
          blockType: 'cardGrid',
          columns: '3',
          cards: [
            { title: 'Best Music Video', description: 'Winner \u2014 Indie FanFilmFest 2023' },
            { title: 'Official Selection', description: 'Southern States IndieFanFilmFest 2023' },
            { title: 'Selected', description: 'Kapow Intergalactic Film Festival 2023' },
            { title: 'Selected', description: 'Big Apple Film Festival (BAFF) 2023' },
            { title: 'Finalist', description: 'European Cinematography Awards, Amsterdam 2023' },
            { title: 'Finalist', description: 'California Music Video Awards 2023' },
          ],
        },
        {
          blockType: 'cta',
          heading: 'Ready to Work Together?',
          text: 'Contact Erin Shore Productions to discuss your next concert, recording, or livestream project.',
          buttonLabel: 'Get in Touch',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'dark',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: About')

  // ── CONTACT PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact Us',
      slug: 'contact',
      pageType: 'contact',
      heroHeadline: 'Contact Us',
      heroSubheadline: 'Let\u0027s discuss your next project.',
      metaTitle: 'Contact | Erin Shore Productions',
      metaDescription: 'Get in touch with Erin Shore Productions for concert livestreaming, video recording, and audio production.',
      tenant: tenantId,
      layout: [],
    },
  })
  console.log('  Created: Contact')

  // ── TERMS OF USE PAGE ──
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Terms of Use',
      slug: 'terms-of-use',
      pageType: 'general',
      metaTitle: 'Terms of Use | Erin Shore Productions',
      tenant: tenantId,
      layout: [
        {
          blockType: 'richText',
          content: richText([
            'By using this website, you agree to the following terms and conditions. Erin Shore Productions reserves the right to update these terms at any time.',
            'All content on this website, including text, images, video, and audio, is the property of Erin Shore Productions or its content suppliers and is protected by copyright laws.',
            'For questions about these terms, please contact us.',
          ]),
          maxWidth: '800',
        },
      ],
    },
  })
  console.log('  Created: Terms of Use')

  console.log('\nMigration complete!')
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
