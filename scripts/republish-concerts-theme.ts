import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config: await config })
  await payload.update({
    collection: 'site-themes',
    id: 4,
    data: { name: 'Times Concerts Theme', _status: 'published' } as never,
    draft: false,
    overrideAccess: true,
  })
  console.log('Re-published Times Concerts theme with hero slides')

  // Verify
  const result = await payload.db.pool.query(
    `SELECT COUNT(*) FROM _site_themes_v_version_hero_slides vs
     JOIN _site_themes_v v ON vs._parent_id = v.id
     WHERE v.parent_id = 4 AND v.latest = true`,
  )
  console.log('Version hero slides count:', result.rows[0].count)

  process.exit(0)
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})
