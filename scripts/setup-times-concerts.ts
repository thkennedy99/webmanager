import { getPayload } from 'payload'
import config from '../src/payload.config'

const TENANT_ID = 3 // Times Concerts

async function run() {
  const payload = await getPayload({ config: await config })

  // ── 1. Update Tenant record with theme + features ──────────────
  await payload.update({
    collection: 'tenants',
    id: TENANT_ID,
    data: {
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
  console.log('Updated tenant record with theme and features')

  // ── 2. Create Site Theme ────────────────────────────────────────
  const existingThemes = await payload.find({
    collection: 'site-themes',
    where: { tenant: { equals: TENANT_ID } },
    limit: 1,
    overrideAccess: true,
  })

  const themeData = {
    name: 'Times Concerts Theme',
    tenant: TENANT_ID,
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
      headingFont: 'Lato',
      bodyFont: 'Nunito',
      h1Size: 36,
      h2Size: 28,
      h3Size: 22,
      h4Size: 18,
      bodySize: 16,
      headingWeight: '700',
      lineHeight: '1.8',
    },
    colors: {
      primary: '#333333',
      accent: '#2EA3F2',
      accentHover: '#1a8cd8',
      bodyBackground: '#ffffff',
      bodyText: '#666666',
      navBackground: '#333333',
      navText: '#ffffffd9',
      footerBackground: '#222222',
      footerText: '#ffffffb3',
      darkSectionBg: '#2c2c2c',
    },
    navigation: {
      fontSize: 14,
      textTransform: 'uppercase',
      fontWeight: '600',
      letterSpacing: '0.5',
    },
    hero: {
      height: 60,
      minHeight: 350,
      maxHeight: 600,
      overlayOpacity: '0.5',
      headlineSize: 2.8,
      subheadlineSize: 1.2,
    },
    buttons: {
      borderRadius: '4',
      paddingX: '1.5',
      paddingY: '0.6',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    spacing: {
      sectionPadding: '4',
      containerWidth: '1200',
    },
  } as never

  if (existingThemes.docs.length > 0) {
    await payload.update({
      collection: 'site-themes',
      id: existingThemes.docs[0].id,
      data: themeData,
      overrideAccess: true,
    })
    console.log('Updated existing site theme')
  } else {
    await payload.create({
      collection: 'site-themes',
      data: themeData,
      overrideAccess: true,
    })
    console.log('Created site theme')
  }

  // ── 3. Create Navigation ────────────────────────────────────────
  const existingNav = await payload.find({
    collection: 'navigation',
    where: { tenant: { equals: TENANT_ID } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingNav.docs.length === 0) {
    const navItems = [
      { label: 'Home', href: '/', order: 1 },
      { label: 'Videos', href: '/videos', order: 2 },
      { label: 'All Access Pass', href: '/all-access-pass', order: 3 },
      { label: 'FAQ', href: '/faq', order: 4 },
      { label: 'Newsletter', href: '/newsletter', order: 5 },
      { label: 'Contact', href: '/contact', order: 6 },
    ]

    for (const nav of navItems) {
      await payload.create({
        collection: 'navigation',
        data: {
          ...nav,
          tenant: TENANT_ID,
          openInNewTab: false,
        } as never,
        overrideAccess: true,
      })
    }
    console.log('Created 6 navigation items')
  } else {
    console.log('Navigation already exists, skipping')
  }

  // ── 4. Create Pages ─────────────────────────────────────────────
  const existingPages = await payload.find({
    collection: 'pages',
    where: { tenant: { equals: TENANT_ID } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingPages.docs.length === 0) {
    // Home page
    await payload.create({
      collection: 'pages',
      data: {
        tenant: TENANT_ID,
        title: 'Home',
        slug: 'home',
        pageType: 'home',
        _status: 'published',
        heroHeadline: 'TIMES Concerts',
        heroSubheadline: 'Live recorded concerts of some of the best traditional Irish musicians around.',
        metaTitle: 'TIMES Concerts — Traditional Irish Music',
        metaDescription: 'Watch over 80 professionally recorded traditional Irish music concerts. Searchable by instrument, year, or artist.',
      } as never,
      overrideAccess: true,
    })
    console.log('Created: Home')

    // Videos page (with video grid block)
    await payload.create({
      collection: 'pages',
      data: {
        tenant: TENANT_ID,
        title: 'Concert Videos',
        slug: 'videos',
        pageType: 'general',
        _status: 'published',
        heroHeadline: 'Concert Videos',
        heroSubheadline: 'Over 80 professionally recorded traditional music videos. Search by instrument, year, or artist.',
        metaTitle: 'Concert Videos — TIMES Concerts',
        metaDescription: 'Browse and watch over 80 professionally recorded traditional Irish music concert videos.',
      } as never,
      overrideAccess: true,
    })
    console.log('Created: Concert Videos')

    // All Access Pass
    await payload.create({
      collection: 'pages',
      data: {
        tenant: TENANT_ID,
        title: 'All Access Pass',
        slug: 'all-access-pass',
        pageType: 'general',
        _status: 'published',
        heroHeadline: 'All Access Pass',
        heroSubheadline: 'Get unlimited access to our entire video library.',
        metaTitle: 'All Access Pass — TIMES Concerts',
        metaDescription: 'Subscribe for $30/year and get unlimited access to over 80 professionally recorded traditional Irish music concerts.',
      } as never,
      overrideAccess: true,
    })
    console.log('Created: All Access Pass')

    // FAQ
    await payload.create({
      collection: 'pages',
      data: {
        tenant: TENANT_ID,
        title: 'FAQ',
        slug: 'faq',
        pageType: 'general',
        _status: 'published',
        heroHeadline: 'Frequently Asked Questions',
        heroSubheadline: 'Everything you need to know about TIMES Concerts.',
        metaTitle: 'FAQ — TIMES Concerts',
        metaDescription: 'Frequently asked questions about TIMES Concerts, subscriptions, and volunteer opportunities.',
      } as never,
      overrideAccess: true,
    })
    console.log('Created: FAQ')

    // Newsletter
    await payload.create({
      collection: 'pages',
      data: {
        tenant: TENANT_ID,
        title: 'Newsletter',
        slug: 'newsletter',
        pageType: 'general',
        _status: 'published',
        heroHeadline: 'Newsletter',
        heroSubheadline: 'Stay up to date with the latest concerts and events.',
        metaTitle: 'Newsletter — TIMES Concerts',
        metaDescription: 'Subscribe to the TIMES Concerts newsletter for updates on new concerts and events.',
      } as never,
      overrideAccess: true,
    })
    console.log('Created: Newsletter')

    // Contact
    await payload.create({
      collection: 'pages',
      data: {
        tenant: TENANT_ID,
        title: 'Contact',
        slug: 'contact',
        pageType: 'contact',
        _status: 'published',
        heroHeadline: 'Contact Us',
        heroSubheadline: 'Get in touch with the TIMES Concerts team.',
        metaTitle: 'Contact — TIMES Concerts',
        metaDescription: 'Contact the Traditional Irish Music Education Society about concerts, volunteering, or general inquiries.',
      } as never,
      overrideAccess: true,
    })
    console.log('Created: Contact')

    // Yearly retreat pages
    const retreatYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
    for (const year of retreatYears) {
      const isVirtual = year === 2020
      const slugSuffix = isVirtual ? 'oflaherty-virtual' : 'oflaherty-retreat'
      await payload.create({
        collection: 'pages',
        data: {
          tenant: TENANT_ID,
          title: `${year} O'Flaherty Retreat`,
          slug: `${year}-${slugSuffix}`,
          pageType: 'general',
          _status: 'published',
          heroHeadline: `${year} O'Flaherty ${isVirtual ? 'Virtual ' : ''}Retreat`,
          heroSubheadline: `Concert recordings from the ${year} O'Flaherty ${isVirtual ? 'Virtual ' : ''}Retreat.`,
          requiresSubscription: true,
          gatedMessage: 'This content requires an All Access Pass. Subscribe for $30/year to watch all concert recordings.',
          metaTitle: `${year} O'Flaherty Retreat — TIMES Concerts`,
        } as never,
        overrideAccess: true,
      })
      console.log(`Created: ${year} O'Flaherty Retreat`)
    }
  } else {
    console.log('Pages already exist, skipping')
  }

  console.log('\nTimes Concerts setup complete!')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
