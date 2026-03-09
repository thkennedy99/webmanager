import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config: await config })

  // Find all pages (including drafts)
  const { docs } = await payload.find({
    collection: 'pages',
    limit: 100,
    overrideAccess: true,
    where: {
      tenant: { equals: 1 },
    },
  })

  console.log(`Found ${docs.length} pages`)

  for (const doc of docs) {
    try {
      await payload.update({
        collection: 'pages',
        id: doc.id,
        data: {
          title: doc.title,
          _status: 'published',
        } as never,
        draft: false,
        overrideAccess: true,
      })
      console.log(`Published: ${doc.title} (ID: ${doc.id})`)
    } catch (err) {
      console.error(`Failed to publish ${doc.title}:`, err)
    }
  }

  console.log('Done')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
