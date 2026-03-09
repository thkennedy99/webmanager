/**
 * Rebuild Erin Shore Productions website from scratch
 * Target: non-profit & education music directors (choir & orchestra)
 * Focus: livestreaming, concert recording, live sound
 * Run with: npx tsx scripts/rebuild-erinshore.ts
 */
// @ts-nocheck
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function rebuild() {
  const payload = await getPayload({ config: await config })
  const tenantId = 1

  console.log('Rebuilding Erin Shore Productions website...\n')

  // ── Helpers ──────────────────────────────────────────────────

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

  function richTextWithHeading(headingText: string, paragraphs: string[], tag: 'h2' | 'h3' = 'h2') {
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

  // ── 1. Upload images as Media ───────────────────────────────

  console.log('Uploading images to Media collection...')

  // Delete existing media for this tenant
  const oldMedia = await payload.find({ collection: 'media', where: { tenant: { equals: tenantId } }, limit: 100 })
  for (const m of oldMedia.docs) {
    await payload.delete({ collection: 'media', id: m.id })
  }

  const fs = await import('fs')
  const path = await import('path')
  const { fileURLToPath } = await import('url')
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const imageDir = path.resolve(__dirname, '../public/images/erinshore')

  const imageUploads: Record<string, number> = {}

  const imagesToUpload = [
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

  for (const img of imagesToUpload) {
    const filePath = path.resolve(imageDir, img.file)
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${img.file} (not found)`)
      continue
    }
    const buffer = fs.readFileSync(filePath)
    const media = await payload.create({
      collection: 'media',
      data: {
        name: img.name,
        alt: img.alt,
        tenant: tenantId,
      },
      file: {
        data: buffer,
        name: img.file,
        mimetype: 'image/jpeg',
        size: buffer.length,
      },
    })
    imageUploads[img.file] = media.id
    console.log(`  Uploaded: ${img.file} → ID ${media.id}`)
  }

  // ── 2. Site Theme ──────────────────────────────────────────

  console.log('\nSetting site theme...')
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
        h1Size: 48,
        h2Size: 36,
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
        height: 80,
        minHeight: 500,
        maxHeight: 800,
        overlayOpacity: '0.5',
        headlineSize: 3.5,
        subheadlineSize: 1.4,
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

  // ── 3. Navigation ──────────────────────────────────────────

  console.log('Updating navigation...')
  const oldNav = await payload.find({ collection: 'navigation', where: { tenant: { equals: tenantId } }, limit: 50 })
  for (const item of oldNav.docs) {
    await payload.delete({ collection: 'navigation', id: item.id })
  }

  const navItems = [
    { label: 'Home', href: '/', order: 0 },
    { label: 'Livestreaming', href: '/livestreaming', order: 1 },
    { label: 'Concert Recording', href: '/concert-recording', order: 2 },
    { label: 'Live Sound', href: '/live-sound', order: 3 },
    { label: 'Portfolio', href: '/portfolio', order: 4 },
    { label: 'About', href: '/about', order: 5 },
    { label: 'Contact', href: '/contact', order: 6 },
  ]

  for (const item of navItems) {
    await payload.create({
      collection: 'navigation',
      data: { ...item, openInNewTab: false, tenant: tenantId },
    })
  }
  console.log('  Navigation updated.\n')

  // ── 4. Delete old pages ────────────────────────────────────

  console.log('Deleting old pages...')
  const oldPages = await payload.find({ collection: 'pages', where: { tenant: { equals: tenantId } }, limit: 50 })
  for (const page of oldPages.docs) {
    await payload.delete({ collection: 'pages', id: page.id })
  }

  // ── 5. HOME PAGE ──────────────────────────────────────────

  console.log('Creating pages...')
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      pageType: 'home',
      heroHeadline: 'Professional Concert Livestreaming',
      heroSubheadline: 'Bringing orchestras, choirs, and ensembles to global audiences through expert multi-camera production.',
      metaTitle: 'Erin Shore Productions | Concert Livestreaming & Production',
      metaDescription: 'Professional concert livestreaming, video recording, and audio production for orchestras, choirs, and music education programs across D/FW.',
      tenant: tenantId,
      layout: [
        // ── Hero intro section
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading(
                'Your Performance. Their Living Room.',
                [
                  'We help non-profit orchestras, school choirs, and community ensembles reach audiences beyond the concert hall. Our multi-camera livestreaming brings the energy and emotion of live performance to families, donors, and supporters watching from anywhere in the world.',
                ],
              ),
              maxWidth: '800',
              alignment: 'center',
            },
          ],
        },

        // ── Image: livestream setup
        {
          blockType: 'image',
          image: imageUploads['livestream-setup.jpg'] || null,
          caption: 'Our multi-camera production setup ready for a symphony concert broadcast',
          size: 'full',
          alignment: 'center',
        },

        // ── Services overview cards
        {
          blockType: 'section',
          style: 'muted',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('What We Do', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'cardGrid',
              columns: '3',
              cards: [
                {
                  image: imageUploads['streaming-monitors.jpg'] || null,
                  title: 'Concert Livestreaming',
                  description: 'Multi-camera, multi-platform broadcasts that bring your orchestra or choir concert to audiences worldwide in real time. YouTube, Facebook, Vimeo, and private ticketed streams.',
                  link: '/livestreaming',
                  linkLabel: 'Learn More',
                },
                {
                  image: imageUploads['camera-operator.jpg'] || null,
                  title: 'Concert Recording',
                  description: 'Professional 4K multi-camera video and high-fidelity audio recording for archival, distribution, grant applications, and festival submissions.',
                  link: '/concert-recording',
                  linkLabel: 'Learn More',
                },
                {
                  image: imageUploads['sound-engineer.jpg'] || null,
                  title: 'Live Sound',
                  description: 'Expert sound reinforcement for concert halls, auditoriums, and outdoor venues. We specialize in the nuance that orchestral and choral performances demand.',
                  link: '/live-sound',
                  linkLabel: 'Learn More',
                },
              ],
            },
          ],
        },

        // ── Stats bar
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
                { blocks: [{ blockType: 'richText', content: richTextWithHeading('200+', ['Concerts Streamed'], 'h2'), maxWidth: 'full', alignment: 'center' }] },
                { blocks: [{ blockType: 'richText', content: richTextWithHeading('30,000', ['Global Viewers'], 'h2'), maxWidth: 'full', alignment: 'center' }] },
                { blocks: [{ blockType: 'richText', content: richTextWithHeading('25', ['Countries Reached'], 'h2'), maxWidth: 'full', alignment: 'center' }] },
                { blocks: [{ blockType: 'richText', content: richTextWithHeading('8+', ['Years Experience'], 'h2'), maxWidth: 'full', alignment: 'center' }] },
              ],
            },
          ],
        },

        // ── Who we serve
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Who We Serve', [
                'We work exclusively with organizations where audio quality and musical nuance matter most.',
              ]),
              maxWidth: '800',
              alignment: 'center',
            },
            {
              blockType: 'columns',
              layout: 'thirds',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['orchestra-performance.jpg'] || null,
                      size: 'full',
                      alignment: 'center',
                    },
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Orchestras & Ensembles', [
                        'Symphony orchestras, chamber groups, and school orchestras. Multi-camera coverage captures the full scope of the performance — from conductor gestures to individual soloists.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['choir-concert.jpg'] || null,
                      size: 'full',
                      alignment: 'center',
                    },
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Choirs & Vocal Ensembles', [
                        'Community choirs, school choruses, and collegiate vocal groups. We understand the unique audio requirements of choral recording — balanced room acoustics and crystal-clear vocal capture.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['school-concert.jpg'] || null,
                      size: 'full',
                      alignment: 'center',
                    },
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Music Education Programs', [
                        'High school and university music departments. We help you share student performances with families who cannot attend, build program archives, and create compelling content for recruitment.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Why livestream section
        {
          blockType: 'section',
          style: 'muted',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'half-half',
              verticalAlignment: 'center',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['livestream-viewer.jpg'] || null,
                      size: 'full',
                      alignment: 'center',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Why Livestream Your Concerts?', [
                        'Grandparents who live across the country. Alumni who moved away. Donors who want to see their investment in action. Families with members who have mobility challenges.',
                        'Livestreaming expands your audience beyond the seats in your venue. It generates additional revenue through virtual tickets and donations. And it creates a permanent archive of every performance.',
                        'Our clients consistently report 30-50% increases in total audience reach after adding livestreaming to their concert series.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Featured work
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Featured Work', []),
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
                      caption: 'She Moves Through the Fair — Award-winning music video',
                      size: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Award-Winning Production', [
                        'Our music video for the band 2002 was selected for the European Cinematography Awards in Amsterdam, the Big Apple Film Festival, and won Best Music Video at the Indie FanFilmFest.',
                        'We bring this same attention to quality and storytelling to every concert we stream and record.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                    {
                      blockType: 'button',
                      buttons: [{ label: 'See Our Portfolio', link: '/portfolio', style: 'accent', size: 'normal' }],
                      alignment: 'left',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Testimonial / social proof
        {
          blockType: 'section',
          style: 'dark',
          padding: 'large',
          containerWidth: 'narrow',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Trusted by Music Directors Across North Texas', [
                '"Erin Shore Productions transformed how we share our concerts. Families who could never attend in person now watch every performance. Our donor engagement has increased significantly since we started livestreaming." — Orchestra Program Director',
                '"The video quality was outstanding. We used the concert recording in our grant application and it made a real impact. They understand classical music and know how to capture it properly." — Choral Director',
                '"Working with Tim and his team is effortless. They handle all the technical complexity so we can focus entirely on the music." — High School Band Director',
              ]),
              maxWidth: '800',
              alignment: 'center',
            },
          ],
        },

        // ── CTA
        {
          blockType: 'cta',
          heading: 'Ready to Reach a Wider Audience?',
          text: 'Tell us about your upcoming concert season. We offer flexible packages for single events or full season coverage.',
          buttonLabel: 'Get a Free Consultation',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'accent',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: Home')

  // ── 6. LIVESTREAMING PAGE ─────────────────────────────────

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Concert Livestreaming',
      slug: 'livestreaming',
      pageType: 'general',
      heroHeadline: 'Concert Livestreaming',
      heroSubheadline: 'Multi-camera, multi-platform broadcast production for orchestras, choirs, and ensembles.',
      metaTitle: 'Concert Livestreaming Services | Erin Shore Productions',
      metaDescription: 'Professional multi-camera concert livestreaming for orchestras, choirs, and school music programs. YouTube, Facebook, Vimeo, and private ticketed streams.',
      tenant: tenantId,
      layout: [
        // Intro
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'half-half',
              verticalAlignment: 'center',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Bring Your Concert to Every Living Room', [
                        'Erin Shore Productions has been pioneering concert livestreaming in the Dallas-Fort Worth area for over 8 years. We deliver hybrid concert experiences where your live audience energizes the performers while remote viewers participate from anywhere in the world.',
                        'Our team handles every technical detail — cameras, switching, audio mixing, graphics, and platform delivery — so your musicians and directors can focus entirely on the performance.',
                      ]),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['streaming-monitors.jpg'] || null,
                      caption: 'Live switching between multiple camera feeds during a concert broadcast',
                      size: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // How it works
        {
          blockType: 'section',
          style: 'muted',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('How It Works', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'cardGrid',
              columns: '4',
              cards: [
                { title: '1. Plan', description: 'We visit your venue, plan camera positions, assess audio requirements, and coordinate with your team on the run of show.' },
                { title: '2. Setup', description: 'Our crew arrives 3-4 hours before showtime to set up cameras, audio, streaming equipment, and run full technical checks.' },
                { title: '3. Broadcast', description: 'During the performance, our director switches between camera angles in real time while our audio engineer manages the live mix.' },
                { title: '4. Deliver', description: 'After the show, you receive the full concert recording edited and ready for your website, social media, or archive.' },
              ],
            },
          ],
        },

        // Equipment & capabilities
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'half-half',
              verticalAlignment: 'center',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['livestream-setup.jpg'] || null,
                      caption: '$60,000+ in professional production equipment',
                      size: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Professional-Grade Equipment', [
                        'We invest in the same equipment used by broadcast television networks. Our kit includes multiple Panasonic 4K cameras, professional video switchers, broadcast-quality audio interfaces, and redundant streaming encoders.',
                        'Redundancy is built into every part of our workflow. Dual internet connections, backup encoders, and local recording ensure your broadcast never drops — even if the venue Wi-Fi struggles.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Platform options
        {
          blockType: 'section',
          style: 'dark',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Stream Everywhere', [
                'We broadcast simultaneously to multiple platforms so your audience can watch wherever they are most comfortable.',
              ]),
              maxWidth: '800',
              alignment: 'center',
            },
            {
              blockType: 'cardGrid',
              columns: '4',
              cards: [
                { title: 'YouTube Live', description: 'The largest video platform. Perfect for reaching new audiences and building a permanent video library.' },
                { title: 'Facebook Live', description: 'Meet your audience where they already are. Ideal for community engagement and donor visibility.' },
                { title: 'Vimeo', description: 'Premium quality with no ads. Excellent for embedding on your own website.' },
                { title: 'Private / Ticketed', description: 'Password-protected or pay-per-view streams for fundraising galas and exclusive performances.' },
              ],
            },
          ],
        },

        // Use cases
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Perfect For', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'columns',
              layout: 'thirds',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['orchestra-performance.jpg'] || null,
                      size: 'full',
                    },
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Season Concert Series', [
                        'Stream every concert in your season. Offer virtual season tickets alongside in-person subscriptions. Build a video archive that demonstrates your program\'s growth over time.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['school-concert.jpg'] || null,
                      size: 'full',
                    },
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('School & University Concerts', [
                        'Let every family watch their student perform — even grandparents across the country. Concert recordings also serve as powerful recruitment material for prospective students.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['festival-stage.jpg'] || null,
                      size: 'full',
                    },
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Festivals & Galas', [
                        'Multi-day festivals, fundraising galas, and special events. We handle the complexity of back-to-back performances, multiple stages, and high-profile productions.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Notable events
        {
          blockType: 'section',
          style: 'muted',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Notable Livestream Productions', [
                'Virtual North Texas Irish Festival 2021 — 39 hours of programming, 30,000 viewers across 25 countries, 30 ensembles performing live.',
                'Dallas Pride 2021 & 2024 — 6-person production team, 5,000+ live attendees, simultaneous multi-platform streaming.',
                'Bob Moog Museum celebrations — International synthesizer history events streamed worldwide.',
                '100+ concerts from The Celt Irish Pub in McKinney, TX — a landmark venue for folk and Irish music in North Texas.',
                'Gulf Coast Cruinniu 2021-2022 — 16 international artists across multiple virtual concert sessions.',
              ]),
              maxWidth: '800',
            },
          ],
        },

        // FAQ
        {
          blockType: 'accordion',
          heading: 'Frequently Asked Questions',
          defaultOpen: true,
          items: [
            { title: 'What internet speed do we need at the venue?', content: richText(['We recommend a minimum of 20 Mbps upload speed for reliable streaming. However, we always bring our own bonded cellular backup to ensure the stream stays live regardless of venue internet quality.']) },
            { title: 'How many cameras do you typically use?', content: richText(['Our standard concert setup uses 2-4 professional Panasonic 4K cameras. We position them strategically to capture wide shots, close-ups of soloists, conductor shots, and audience reactions. Larger events can use additional cameras.']) },
            { title: 'Can viewers interact during the livestream?', content: richText(['Yes. We can enable live chat, Q&A, and real-time donation/tip features depending on the platform. Many of our clients use the chat for program notes, song introductions, and audience engagement between pieces.']) },
            { title: 'Do we get a recording after the livestream?', content: richText(['Absolutely. Every livestream is simultaneously recorded locally in full quality. You receive the edited concert recording within 5-10 business days, ready for your website, social media, or archive.']) },
            { title: 'What does livestreaming cost?', content: richText(['Pricing depends on the number of cameras, length of the event, venue complexity, and streaming platforms needed. Contact us for a free consultation and custom quote. We offer season packages with significant savings for multi-concert commitments.']) },
          ],
        },

        // CTA
        {
          blockType: 'cta',
          heading: 'Start Streaming Your Concerts',
          text: 'Tell us about your upcoming concert season. We will design a custom livestreaming package that fits your budget and goals.',
          buttonLabel: 'Get a Free Quote',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'dark',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: Livestreaming')

  // ── 7. CONCERT RECORDING PAGE ─────────────────────────────

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Concert Recording',
      slug: 'concert-recording',
      pageType: 'general',
      heroHeadline: 'Concert Recording',
      heroSubheadline: 'Professional 4K video and high-fidelity audio recording for orchestras, choirs, and ensembles.',
      metaTitle: 'Concert Recording Services | Erin Shore Productions',
      metaDescription: 'Professional multi-camera concert video recording and audio capture for orchestras, choirs, and school music programs.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'half-half',
              verticalAlignment: 'center',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Preserve Every Performance', [
                        'A great concert deserves more than a phone recording from the back row. Our professional multi-camera setups and dedicated audio capture produce recordings that do justice to the months of rehearsal your musicians invest.',
                        'Whether you need a concert archive for your program, video content for grant applications, promotional material for recruitment, or a professionally produced recording for distribution — we deliver broadcast-quality results.',
                      ]),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['camera-operator.jpg'] || null,
                      caption: 'Professional camera operator capturing a concert performance',
                      size: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Video recording
        {
          blockType: 'section',
          style: 'muted',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'half-half',
              verticalAlignment: 'center',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['concert-hall-stage.jpg'] || null,
                      size: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Multi-Camera Video', [
                        'Our standard concert recording uses 2-4 Panasonic 4K cameras positioned for comprehensive coverage. We capture wide establishing shots, section close-ups, soloist features, and conductor coverage.',
                        'Post-production includes professional editing, color correction, title cards, and credits. Delivered in broadcast-ready formats suitable for YouTube, Vimeo, social media, and physical media.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Audio recording
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'half-half',
              verticalAlignment: 'center',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('High-Fidelity Audio', [
                        'Audio quality makes or breaks a concert recording. We use professional condenser microphones, multi-channel recording interfaces, and techniques refined over hundreds of classical and choral recordings.',
                        'We capture the natural acoustics of your venue while ensuring every section and soloist is clearly represented. Post-production mixing and mastering delivers a polished final product ready for distribution.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['mixing-desk-detail.jpg'] || null,
                      caption: 'Professional audio capture with dedicated multi-channel recording',
                      size: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Use cases
        {
          blockType: 'section',
          style: 'dark',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Recording Applications', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'cardGrid',
              columns: '3',
              cards: [
                { title: 'Program Archives', description: 'Build a permanent library of your ensemble\'s performances. Document your program\'s artistic growth year over year.' },
                { title: 'Grant Applications', description: 'High-quality video and audio demonstrate your organization\'s artistic merit to funding bodies and grant committees.' },
                { title: 'Student Recruitment', description: 'Show prospective students and families what your music program achieves. Nothing recruits like seeing a great performance.' },
                { title: 'Social Media Content', description: 'Short clips and highlights from concert recordings make powerful social media content that builds awareness and engagement.' },
                { title: 'Album Production', description: 'Live concert recordings can be mixed and mastered into albums for distribution on Spotify, Apple Music, and other platforms.' },
                { title: 'Festival Submissions', description: 'Our award-winning video production has been selected for international film festivals. Your recording could be next.' },
              ],
            },
          ],
        },

        {
          blockType: 'cta',
          heading: 'Record Your Next Concert',
          text: 'Contact us to discuss recording your upcoming performance. We offer packages for single concerts and full season coverage.',
          buttonLabel: 'Get a Quote',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'accent',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: Concert Recording')

  // ── 8. LIVE SOUND PAGE ────────────────────────────────────

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Live Sound',
      slug: 'live-sound',
      pageType: 'general',
      heroHeadline: 'Live Sound Engineering',
      heroSubheadline: 'Expert sound reinforcement for concert halls, auditoriums, and outdoor venues.',
      metaTitle: 'Live Sound Engineering | Erin Shore Productions',
      metaDescription: 'Professional live sound engineering for orchestras, choirs, and acoustic ensembles. Expert audio reinforcement for any venue.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'half-half',
              verticalAlignment: 'center',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Sound That Serves the Music', [
                        'Orchestral and choral performances demand a different approach to live sound than amplified music. The goal is not volume — it is clarity, balance, and natural presence. Your audience should hear the music as the composer and conductor intended.',
                        'Our engineers specialize in acoustic, orchestral, and choral sound reinforcement. We understand the dynamics of a 60-piece orchestra, the delicate balance of a four-part choir, and the acoustic challenges of every venue type.',
                      ]),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['sound-engineer.jpg'] || null,
                      caption: 'Live mixing during a concert performance',
                      size: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          blockType: 'section',
          style: 'muted',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Venue Expertise', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'cardGrid',
              columns: '3',
              cards: [
                {
                  image: imageUploads['concert-hall-stage.jpg'] || null,
                  title: 'Concert Halls',
                  description: 'Acoustic optimization for purpose-built concert spaces. We work with the hall\'s natural reverb rather than fighting it.',
                },
                {
                  image: imageUploads['school-concert.jpg'] || null,
                  title: 'School Auditoriums',
                  description: 'Many school auditoriums present acoustic challenges. We bring the right equipment and techniques to make every student ensemble sound professional.',
                },
                {
                  image: imageUploads['outdoor-concert.jpg'] || null,
                  title: 'Outdoor Venues',
                  description: 'Parks, amphitheaters, and festival grounds. Outdoor sound requires different equipment and techniques — we have the experience and gear for open-air events.',
                },
              ],
            },
          ],
        },

        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('What We Provide', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'columns',
              layout: 'half-half',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('For Orchestras', [
                        'Spot microphones for soloists and featured instruments. Main stereo or surround arrays for full ensemble capture. Monitor mixes for conductors and performers as needed. PA reinforcement for large or acoustically challenging spaces.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('For Choirs', [
                        'Overhead microphone arrays optimized for choral balance. Section microphones when needed for large ensembles. Monitor systems for director and accompanist. Careful gain staging to capture dynamic range from pianissimo to fortissimo.',
                      ], 'h3'),
                      maxWidth: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          blockType: 'cta',
          heading: 'Need Sound for Your Next Event?',
          text: 'Whether it is a small recital or a large outdoor festival, we bring the right equipment and expertise.',
          buttonLabel: 'Contact Us',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'dark',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: Live Sound')

  // ── 9. PORTFOLIO PAGE ─────────────────────────────────────

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Portfolio',
      slug: 'portfolio',
      pageType: 'general',
      heroHeadline: 'Our Work',
      heroSubheadline: 'Concert recordings, livestream productions, and music videos from our portfolio.',
      metaTitle: 'Portfolio | Erin Shore Productions',
      metaDescription: 'Watch concert recordings, livestream productions, and award-winning music videos by Erin Shore Productions.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Selected Productions', [
                'From intimate choral performances to large-scale festival broadcasts, here is a selection of our recent work.',
              ]),
              maxWidth: '800',
              alignment: 'center',
            },
          ],
        },

        // Video 1
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
                  size: 'full',
                },
              ],
            },
            {
              blocks: [
                {
                  blockType: 'richText',
                  content: richTextWithHeading('She Moves Through the Fair', [
                    'Award-winning music video for the band 2002. Selected for the European Cinematography Awards (Amsterdam), Big Apple Film Festival, and winner of Best Music Video at the Indie FanFilmFest.',
                  ], 'h3'),
                  maxWidth: 'full',
                },
              ],
            },
          ],
        },

        { blockType: 'spacer', size: 'medium', showDivider: true },

        // Video 2
        {
          blockType: 'columns',
          layout: 'half-half',
          verticalAlignment: 'center',
          gap: 'large',
          columns: [
            {
              blocks: [
                {
                  blockType: 'richText',
                  content: richTextWithHeading('The Celt — Irish Pub of the Year', [
                    'Promotional video for The Celt in McKinney, TX celebrating their designation as International Irish Pub of the Year. Produced with multi-camera coverage capturing the venue\'s unique atmosphere and live music culture.',
                  ], 'h3'),
                  maxWidth: 'full',
                },
              ],
            },
            {
              blocks: [
                {
                  blockType: 'videoEmbed',
                  url: 'https://vimeo.com/355436316',
                  size: 'full',
                },
              ],
            },
          ],
        },

        { blockType: 'spacer', size: 'large', showDivider: false },

        // Image gallery of production
        {
          blockType: 'section',
          style: 'muted',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Behind the Scenes', [
                'A look at our production process — from camera setup to the final broadcast.',
              ]),
              maxWidth: '800',
              alignment: 'center',
            },
            {
              blockType: 'imageGallery',
              columns: '3',
              images: [
                { image: imageUploads['livestream-setup.jpg'] || null, caption: 'Multi-camera setup' },
                { image: imageUploads['camera-operator.jpg'] || null, caption: 'Camera operator' },
                { image: imageUploads['streaming-monitors.jpg'] || null, caption: 'Live switching' },
                { image: imageUploads['sound-engineer.jpg'] || null, caption: 'Audio mixing' },
                { image: imageUploads['mixing-desk-detail.jpg'] || null, caption: 'Mixing desk' },
                { image: imageUploads['conductor-leading.jpg'] || null, caption: 'Capturing the conductor' },
              ],
            },
          ],
        },

        // Awards
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Awards & Recognition', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'cardGrid',
              columns: '3',
              cards: [
                { title: 'Best Music Video', description: 'Winner — Indie FanFilmFest 2023' },
                { title: 'Official Selection', description: 'Southern States IndieFanFilmFest 2023' },
                { title: 'Selected', description: 'Kapow Intergalactic Film Festival 2023' },
                { title: 'Selected', description: 'Big Apple Film Festival (BAFF) 2023' },
                { title: 'Finalist', description: 'European Cinematography Awards, Amsterdam 2023' },
                { title: 'Finalist', description: 'California Music Video Awards 2023' },
              ],
            },
          ],
        },

        {
          blockType: 'cta',
          heading: 'Let Us Capture Your Next Performance',
          text: 'Contact us to discuss livestreaming, recording, or video production for your upcoming concerts.',
          buttonLabel: 'Get in Touch',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'dark',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: Portfolio')

  // ── 10. ABOUT PAGE ────────────────────────────────────────

  await payload.create({
    collection: 'pages',
    data: {
      title: 'About',
      slug: 'about',
      pageType: 'general',
      heroHeadline: 'About Erin Shore Productions',
      heroSubheadline: 'Helping music programs share their performances with the world since 2014.',
      metaTitle: 'About | Erin Shore Productions',
      metaDescription: 'Learn about Erin Shore Productions — D/FW\'s leading concert livestreaming and production company serving orchestras, choirs, and music education programs.',
      tenant: tenantId,
      layout: [
        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'columns',
              layout: 'half-half',
              verticalAlignment: 'center',
              gap: 'large',
              columns: [
                {
                  blocks: [
                    {
                      blockType: 'richText',
                      content: richTextWithHeading('Our Story', [
                        'Erin Shore Productions was founded in the Dallas-Fort Worth area with a simple mission: help musicians share their performances with audiences who cannot be in the room.',
                        'What started as livestreaming Irish folk sessions from a pub in McKinney has grown into a full-service concert production company serving orchestras, choirs, and music education programs across North Texas.',
                        'Over 8 years and 200+ productions, we have refined our craft to meet the specific needs of classical, choral, and acoustic music — genres where audio quality and artistic nuance are everything.',
                      ]),
                      maxWidth: 'full',
                    },
                  ],
                },
                {
                  blocks: [
                    {
                      blockType: 'image',
                      image: imageUploads['conductor-leading.jpg'] || null,
                      caption: 'Capturing the art of live performance',
                      size: 'full',
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          blockType: 'section',
          style: 'muted',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Why Music Directors Choose Us', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'cardGrid',
              columns: '3',
              cards: [
                { title: 'We Understand Classical Music', description: 'Our team knows the difference between a concerto and a sonata. We understand phrasing, dynamics, and structure — and we capture them on camera and in audio.' },
                { title: 'Zero Disruption', description: 'We set up before your rehearsal and stay invisible during the performance. No crew members blocking sight lines, no distracting lights, no noise.' },
                { title: 'Reliable Technology', description: 'Redundant streaming, backup recording, bonded internet. In 200+ productions, we have never lost a broadcast to a technical failure.' },
                { title: 'Budget Friendly', description: 'We work with non-profit and education budgets. Our season packages make professional production affordable for programs of any size.' },
                { title: 'End-to-End Service', description: 'From venue assessment to final edited delivery, we handle every detail. You focus on the music — we handle the technology.' },
                { title: 'Proven Track Record', description: '200+ concerts, 30,000+ viewers, 25 countries. Award-winning video production recognized at international film festivals.' },
              ],
            },
          ],
        },

        {
          blockType: 'section',
          style: 'dark',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Our Equipment', [
                'We invest in broadcast-quality equipment because your music deserves it. Our production kit includes:',
                'Multiple Panasonic 4K professional cameras with broadcast lenses. Professional video switcher for real-time multi-camera editing. Broadcast-quality audio interfaces and condenser microphones. Redundant streaming encoders with bonded cellular backup. Professional lighting and grip equipment for optimal camera exposure.',
                'Total equipment investment: over $60,000 dedicated to concert production.',
              ]),
              maxWidth: '800',
              alignment: 'center',
            },
          ],
        },

        {
          blockType: 'section',
          style: 'light',
          padding: 'large',
          containerWidth: 'default',
          blocks: [
            {
              blockType: 'richText',
              content: richTextWithHeading('Awards & Recognition', []),
              maxWidth: '600',
              alignment: 'center',
            },
            {
              blockType: 'cardGrid',
              columns: '3',
              cards: [
                { title: 'Best Music Video', description: 'Winner — Indie FanFilmFest 2023' },
                { title: 'Official Selection', description: 'Southern States IndieFanFilmFest 2023' },
                { title: 'Selected', description: 'Kapow Intergalactic Film Festival 2023' },
                { title: 'Selected', description: 'Big Apple Film Festival (BAFF) 2023' },
                { title: 'Finalist', description: 'European Cinematography Awards, Amsterdam 2023' },
                { title: 'Finalist', description: 'California Music Video Awards 2023' },
              ],
            },
          ],
        },

        {
          blockType: 'cta',
          heading: 'Ready to Work Together?',
          text: 'Contact us to discuss livestreaming, recording, or production for your upcoming concert season.',
          buttonLabel: 'Schedule a Consultation',
          buttonLink: '/contact',
          buttonStyle: 'accent',
          style: 'accent',
          alignment: 'center',
        },
      ],
    },
  })
  console.log('  Created: About')

  // ── 11. CONTACT PAGE ──────────────────────────────────────

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact Us',
      slug: 'contact',
      pageType: 'contact',
      heroHeadline: 'Get in Touch',
      heroSubheadline: 'Tell us about your upcoming concert season. We will design a production package that fits your program and budget.',
      metaTitle: 'Contact | Erin Shore Productions',
      metaDescription: 'Contact Erin Shore Productions for concert livestreaming, video recording, and audio production quotes.',
      tenant: tenantId,
      layout: [],
    },
  })
  console.log('  Created: Contact')

  // ── 12. TERMS OF USE PAGE ─────────────────────────────────

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

  // ── 13. Update default user to super-admin ────────────────

  console.log('\nUpdating user roles...')
  const users = await payload.find({ collection: 'users', where: { email: { equals: 'tim@erinshoreprod.com' } }, limit: 1 })
  if (users.docs.length > 0) {
    await payload.update({
      collection: 'users',
      id: users.docs[0].id,
      data: {
        role: 'super-admin',
        firstName: 'Tim',
        lastName: 'Kennedy',
      },
    })
    console.log('  Updated tim@erinshoreprod.com to super-admin (Tim Kennedy)')
  } else {
    console.log('  User tim@erinshoreprod.com not found — create manually in admin')
  }

  console.log('\nRebuild complete!')
  process.exit(0)
}

rebuild().catch((err) => {
  console.error('Rebuild failed:', err)
  process.exit(1)
})
