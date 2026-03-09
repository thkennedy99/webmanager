import { getPayload } from 'payload'
import config from '../src/payload.config'

const TENANT_ID = 1

const DEFAULT_INSTRUMENTS = [
  'Fiddle',
  'Mandolin',
  'Vocals',
  'Dance',
  'Guitar',
  'Bouzouki',
  'Bodhrán',
  'Concertina',
  'Button Accordion',
  'Piano Accordion',
  'Piano',
  'Flute',
  'Whistle',
  'Uilleann Pipes',
  'Harp',
  'Banjo',
  'Tenor Guitar',
]

const DEFAULT_LOCATIONS = [
  "O'Flaherty Retreat",
  'House Concert',
]

async function run() {
  const payload = await getPayload({ config: await config })

  console.log('Seeding instruments...')
  for (const name of DEFAULT_INSTRUMENTS) {
    const existing = await payload.find({
      collection: 'video-grid-instruments',
      where: {
        name: { equals: name },
        tenant: { equals: TENANT_ID },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'video-grid-instruments',
        data: { name, tenant: TENANT_ID } as never,
        overrideAccess: true,
      })
      console.log(`  Created: ${name}`)
    } else {
      console.log(`  Exists: ${name}`)
    }
  }

  console.log('Seeding locations...')
  for (const name of DEFAULT_LOCATIONS) {
    const existing = await payload.find({
      collection: 'video-grid-locations',
      where: {
        name: { equals: name },
        tenant: { equals: TENANT_ID },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'video-grid-locations',
        data: { name, tenant: TENANT_ID } as never,
        overrideAccess: true,
      })
      console.log(`  Created: ${name}`)
    } else {
      console.log(`  Exists: ${name}`)
    }
  }

  console.log('Done!')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
