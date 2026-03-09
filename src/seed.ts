import { getPayload } from 'payload'
import config from './payload.config'

// Lexical node helpers
function text(t: string, format?: number) {
  return { type: 'text', text: t, version: 1, ...(format ? { format } : {}) }
}
function paragraph(...children: ReturnType<typeof text>[]) {
  return {
    type: 'paragraph',
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}
function heading(tag: 'h1' | 'h2' | 'h3' | 'h4', ...children: ReturnType<typeof text>[]) {
  return {
    type: 'heading',
    tag,
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  }
}
function list(items: string[]) {
  return {
    type: 'list',
    tag: 'ul' as const,
    listType: 'bullet' as const,
    start: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: items.map((item) => ({
      type: 'listitem',
      children: [text(item)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      value: 1,
    })),
  }
}
function richText(children: unknown[]) {
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config: await config })

  console.log('Seeding Erin Shore Productions...')

  // 1. Create Tenant
  const existingTenants = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: 'erinshore' } },
    limit: 1,
  })

  let tenant
  if (existingTenants.docs.length > 0) {
    tenant = existingTenants.docs[0]
    console.log('Tenant already exists, updating...')
    tenant = await payload.update({
      collection: 'tenants',
      id: tenant.id,
      data: {
        name: 'Erin Shore Productions',
        slug: 'erinshore',
        domain: 'erinshoreprod.com',
        theme: {
          colorPrimary: '#1a1a2e',
          colorAccent: '#1fa85d',
          fontFamily: 'Assistant, sans-serif',
        },
      },
    })
  } else {
    tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'Erin Shore Productions',
        slug: 'erinshore',
        domain: 'erinshoreprod.com',
        theme: {
          colorPrimary: '#1a1a2e',
          colorAccent: '#1fa85d',
          fontFamily: 'Assistant, sans-serif',
        },
      },
    })
  }
  console.log(`Tenant: ${tenant.name} (ID: ${tenant.id})`)

  // 2. Create Navigation Items
  const existingNav = await payload.find({
    collection: 'navigation',
    where: { tenant: { equals: tenant.id } },
    limit: 100,
  })
  for (const doc of existingNav.docs) {
    await payload.delete({ collection: 'navigation', id: doc.id })
  }

  const navItems = [
    { label: 'Home', href: '/', order: 0 },
    { label: 'Livestream Video', href: '/livestream-video', order: 1 },
    { label: 'Video/Audio', href: '/video-audio', order: 2 },
    { label: 'Artists', href: '/artists', order: 3 },
    { label: 'About', href: '/about', order: 4 },
    { label: 'Contact', href: '/contact', order: 5 },
    { label: 'Awards', href: '/awards', order: 6 },
  ]

  for (const item of navItems) {
    await payload.create({
      collection: 'navigation',
      data: { ...item, tenant: tenant.id },
    })
  }
  console.log(`Created ${navItems.length} navigation items`)

  // 3. Create Pages
  const existingPages = await payload.find({
    collection: 'pages',
    where: { tenant: { equals: tenant.id } },
    limit: 100,
  })
  for (const doc of existingPages.docs) {
    await payload.delete({ collection: 'pages', id: doc.id })
  }

  const pages = [
    {
      title: 'Live Streaming',
      slug: 'livestream-video',
      pageType: 'general' as const,
      heroSubheadline:
        'Erin Shore Productions provides sound, video, and live streaming production services to the entertainment industry.',
      content: richText([
        heading('h2', text('Live Streamed Concerts')),
        paragraph(
          text(
            'Erin Shore Productions has focused on live streaming concerts for over 8 years, offering hybrid concert experiences where live audiences energize performers while remote viewers watch simultaneously.',
          ),
        ),
        list([
          'Multi-platform social media streaming',
          'Remote audience ticket sales',
          'In-stream CD and digital music availability',
          'On-demand merchandise through Printful',
          'Moderated online chat for your audience',
        ]),
        heading('h2', text('Major Live Streamed Events')),
        heading('h3', text('In-Person & Live Streamed Concerts')),
        list([
          'Record label CD release events streamed internationally',
          'Bob Moog Museum events celebrating synthesizer history',
          'School choir/band/orchestra concerts reaching global audiences',
          'Texas folk music festivals with Grammy winners',
          '100+ concerts from The Celt Irish Pub, McKinney, TX',
          '2021 & 2024 Dallas Pride events (6-person team, 5,000 attendees)',
        ]),
        heading('h3', text('Live Streamed-Only Concerts')),
        paragraph(
          text(
            'Virtual North Texas Irish Festival 2021: 39 hours of programming, 30,000 viewers across 25 countries, 30 ensembles.',
          ),
        ),
        paragraph(
          text('Gulf Coast Cruinniu 2021-2022: 16 international artists.'),
        ),
        paragraph(
          text(
            "Virtual O'Flaherty Irish Music Retreat 2020: 26 musicians, four 2-hour concerts.",
          ),
        ),
      ]),
    },
    {
      title: 'Video and Audio Production',
      slug: 'video-audio',
      pageType: 'general' as const,
      heroSubheadline:
        'Professional video and audio production services for the entertainment industry.',
      content: richText([
        heading('h2', text('Video Production')),
        paragraph(
          text(
            'Erin Shore Productions operates with $60,000 in production video equipment supporting up to 4 concurrent 4K camera shoots with Pro Panasonic cameras. Services include professional editing for consumer, industry, and festival submissions. We have recorded full concert productions for bands and ensembles.',
          ),
        ),
        paragraph(
          text(
            'Our Irish pub film was selected as "Irish Hospitality Global - America\'s Irish Pub of the Year," and our award-winning music video for band 2002, "She Moved Through the Faire," has received multiple festival selections.',
          ),
        ),
        heading('h2', text('CD Recordings')),
        paragraph(
          text(
            'Our studio facilities support CD recording, live show documentation, and live CD production. Services include music licensing and digital music distribution.',
          ),
        ),
        heading('h2', text('Live Sound')),
        paragraph(
          text(
            'We provide live sound engineering services for concerts and events, specializing in folk, classical, and acoustic music performances across the D/FW region.',
          ),
        ),
      ]),
    },
    {
      title: 'Artists',
      slug: 'artists',
      pageType: 'artists' as const,
    },
    {
      title: 'About',
      slug: 'about',
      pageType: 'general' as const,
      content: richText([
        heading('h2', text('Bio')),
        paragraph(
          text(
            'Erin Shore Productions, nestled in the heart of D/FW, is your premier destination for exceptional concert live streaming and recording services. We specialize in folk, acoustic, choral, and classical music for high schools, nonprofits, and independent artists.',
          ),
        ),
        heading('h3', text('Live Streaming Excellence')),
        paragraph(
          text(
            'We focus on digital reach and real-time audience engagement using state-of-the-art technology to bring live performances to viewers worldwide.',
          ),
        ),
        heading('h3', text('Professional Video Recording')),
        paragraph(
          text(
            'Our expertise in camera work, lighting, and editing delivers stunning results for performances ranging from intimate acoustic sessions to orchestral events.',
          ),
        ),
        heading('h3', text('Pristine Audio Recordings')),
        paragraph(
          text(
            'We deliver crystal-clear audio using the latest equipment to capture the authentic musical sound of every performance.',
          ),
        ),
        heading('h3', text('Live Music Audio Engineering')),
        paragraph(
          text(
            'We specialize in adapting audio solutions to unique venues -- churches, pubs, outdoor spaces -- ensuring the best possible sound for every setting.',
          ),
        ),
        heading('h2', text('Artist Management')),
        paragraph(
          text(
            'Over our 10-year history, we have worked with young emerging artists, providing live music bookings, livestreaming, website development, social media management, album recording, and music video production. We help young artists advance their careers without creating financial burden.',
          ),
        ),
        paragraph(
          text(
            'Notable outcomes include artists achieving 1 billion+ Spotify/Amazon streams, contestants on major talent shows, and Grammy nomination qualifications.',
          ),
        ),
        paragraph(
          text(
            'Ready to take your concert experience to the next level? Contact Erin Shore Productions today.',
          ),
        ),
      ]),
    },
    {
      title: 'Contact Us',
      slug: 'contact',
      pageType: 'contact' as const,
    },
    {
      title: 'Awards',
      slug: 'awards',
      pageType: 'general' as const,
      content: richText([
        paragraph(
          text(
            'Erin Shore Productions has been recognized for excellence in video and audio production:',
          ),
        ),
        list([
          'Winner -- Best Music Video, Indie FanFilmFest',
          'Official Selection -- Southern States IndieFanFilmFest',
          'Selected -- Kapow Intergalactic Film Festival',
          'Selected -- Big Apple Film Festival (BAFF)',
          'Finalist -- European Cinematography Awards (Amsterdam)',
          'Finalist -- California Music Video Awards',
        ]),
      ]),
    },
    {
      title: 'Terms of Use',
      slug: 'terms-of-use',
      pageType: 'general' as const,
      content: richText([
        paragraph(
          text(
            'Terms of use for the Erin Shore Productions website. All content is copyright Erin Shore Productions, LLC. Unauthorized reproduction is prohibited.',
          ),
        ),
      ]),
    },
  ]

  for (const page of pages) {
    await payload.create({
      collection: 'pages',
      data: {
        ...page,
        tenant: tenant.id,
      } as never,
    })
    console.log(`Created page: ${page.title}`)
  }

  // 4. Create Artists
  const existingArtists = await payload.find({
    collection: 'artists',
    where: { tenant: { equals: tenant.id } },
    limit: 100,
  })
  for (const doc of existingArtists.docs) {
    await payload.delete({ collection: 'artists', id: doc.id })
  }

  const artists = [
    {
      name: '2002',
      slug: '2002',
      genre: 'Ambient / Progressive / New Age',
      website: 'https://2002music.com',
      bio: richText([
        paragraph(
          text(
            'Award-winning, progressive band that placed 12 albums on the Billboard Charts alongside artists like Yanni and Mannheim Steamroller. The ensemble garnered 1 billion songs streamed across major platforms in 2022, spanning ambient soundscapes to progressive rock.',
          ),
        ),
      ]),
      socialLinks: [
        { platform: 'facebook' as const, url: 'https://facebook.com/2002music' },
        { platform: 'youtube' as const, url: 'https://youtube.com/2002music' },
        {
          platform: 'spotify' as const,
          url: 'https://open.spotify.com/artist/6zVSYiNDYelMzhMiZQJU7W',
        },
      ],
    },
    {
      name: 'Harber Row',
      slug: 'harber-row',
      genre: 'Bluegrass / Roots / Folk',
      bio: richText([
        paragraph(
          text(
            'Twin siblings Declan and Ireland Harber perform an eclectic fusion of bluegrass, roots, and folk -- from contemporary chart hits to classic covers, including creative reinterpretations. They have completed over 100 shows in the last 8 years at D/FW venues including restaurants, coffee houses, wineries, and folk festivals.',
          ),
        ),
      ]),
      socialLinks: [
        {
          platform: 'youtube' as const,
          url: 'https://youtube.com/channel/UC59WrzLxbjvBoOuidnsuQbw',
        },
        { platform: 'instagram' as const, url: 'https://instagram.com/harberrow/' },
        { platform: 'facebook' as const, url: 'https://facebook.com/HarberRow/' },
      ],
    },
    {
      name: 'Misty Posey',
      slug: 'misty-posey',
      genre: 'Celtic / Classical Crossover',
      website: 'https://www.mistyposeymusic.com',
      bio: richText([
        paragraph(
          text(
            'Celtic/Classical Crossover vocalist blending Irish heritage with tribal and percussive elements. She performs as soprano soloist with Florida orchestras, including the Space Coast Symphony and Brevard Symphony Orchestra.',
          ),
        ),
      ]),
      socialLinks: [
        { platform: 'facebook' as const, url: 'https://facebook.com/MistyPoseyMusic/' },
        { platform: 'twitter' as const, url: 'https://twitter.com/mistyposeymusic' },
        { platform: 'youtube' as const, url: 'https://youtube.com/user/mistylp2000' },
      ],
    },
    {
      name: 'Sarah Copus',
      slug: 'sarah-copus',
      genre: 'Celtic / New Age',
      website: 'http://www.sarahcopus.com',
      bio: richText([
        paragraph(
          text(
            'Lead vocalist with 7+ years performing history. Three albums hit the Billboard top 20 featuring her voice. Recipient of Best Vocal Album award (2015). She has performed with Celtic Woman, The Irish Tenors, and Teada.',
          ),
        ),
      ]),
      socialLinks: [],
    },
  ]

  for (const artist of artists) {
    await payload.create({
      collection: 'artists',
      data: {
        ...artist,
        tenant: tenant.id,
      } as never,
    })
    console.log(`Created artist: ${artist.name}`)
  }

  // 5. Create Awards
  const existingAwards = await payload.find({
    collection: 'awards',
    where: { tenant: { equals: tenant.id } },
    limit: 100,
  })
  for (const doc of existingAwards.docs) {
    await payload.delete({ collection: 'awards', id: doc.id })
  }

  const awards = [
    { title: 'Best Music Video', organization: 'Indie FanFilmFest', year: 2023 },
    {
      title: 'Official Selection',
      organization: 'Southern States IndieFanFilmFest',
      year: 2023,
    },
    {
      title: 'Selected',
      organization: 'Kapow Intergalactic Film Festival',
      year: 2023,
    },
    {
      title: 'Selected',
      organization: 'Big Apple Film Festival (BAFF)',
      year: 2023,
    },
    {
      title: 'Finalist',
      organization: 'European Cinematography Awards',
      year: 2023,
      category: 'Amsterdam',
    },
    { title: 'Finalist', organization: 'California Music Video Awards', year: 2023 },
  ]

  for (const award of awards) {
    await payload.create({
      collection: 'awards',
      data: {
        ...award,
        tenant: tenant.id,
      },
    })
    console.log(`Created award: ${award.title} -- ${award.organization}`)
  }

  console.log('\nSeed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
