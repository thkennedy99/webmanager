import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const images = [
  {
    file: 'cx350-orchestra.jpg',
    alt: 'Camera operator filming an orchestra performance with a Panasonic CX-350 in a concert hall',
  },
  {
    file: 'cx350-recording.jpg',
    alt: 'Camera operator recording an orchestra with a Panasonic CX-350 professional camera',
  },
  {
    file: 'cx350-choir.jpg',
    alt: 'Camera operator filming a choir performance on stage with a Panasonic CX-350',
  },
]

async function run() {
  const payload = await getPayload({ config: await config })

  const ids: number[] = []

  for (const img of images) {
    const filePath = path.resolve(__dirname, '../public/images/erinshore', img.file)
    const buffer = fs.readFileSync(filePath)

    const doc = await payload.create({
      collection: 'media',
      data: {
        alt: img.alt,
        tenant: 1,
      } as never,
      file: {
        data: buffer,
        name: img.file,
        mimetype: 'image/jpeg',
        size: buffer.length,
      },
      overrideAccess: true,
    })

    console.log(`Uploaded: ${img.file} -> ID ${doc.id}`)
    ids.push(doc.id as number)
  }

  console.log('\nMedia IDs:', ids)

  // Now assign images to pages
  // Livestreaming page (10):
  //   Hero -> cx350-orchestra (ids[0])
  //   "Setup" card -> cx350-recording (ids[1])
  //   "Broadcast" card -> cx350-orchestra (ids[0])
  // Concert Recording page (11):
  //   Hero -> cx350-recording (ids[1])
  //   "Student Recruitment" card -> cx350-choir (ids[2])

  // Set hero images
  await payload.update({
    collection: 'pages',
    id: 10,
    data: { heroImage: ids[0] } as never,
    overrideAccess: true,
  })
  console.log('Set livestreaming hero -> cx350-orchestra')

  await payload.update({
    collection: 'pages',
    id: 11,
    data: { heroImage: ids[1] } as never,
    overrideAccess: true,
  })
  console.log('Set concert-recording hero -> cx350-recording')

  // Update card grid cards directly via SQL (Payload doesn't expose block sub-records easily)
  // Livestreaming "Setup" card
  await payload.db.pool.query(
    `UPDATE pages_blocks_card_grid_cards SET image_id = $1 WHERE id = '69adbf9611cdec6690f42ff5'`,
    [ids[1]],
  )
  console.log('Set "Setup" card -> cx350-recording')

  // Livestreaming "Broadcast" card
  await payload.db.pool.query(
    `UPDATE pages_blocks_card_grid_cards SET image_id = $1 WHERE id = '69adbf9611cdec6690f42ff6'`,
    [ids[0]],
  )
  console.log('Set "Broadcast" card -> cx350-orchestra')

  // Livestreaming "Deliver" card -> cx350-recording (different angle)
  await payload.db.pool.query(
    `UPDATE pages_blocks_card_grid_cards SET image_id = $1 WHERE id = '69adbf9611cdec6690f42ff7'`,
    [ids[1]],
  )
  console.log('Set "Deliver" card -> cx350-recording')

  // Concert Recording "Student Recruitment" card -> cx350-choir
  await payload.db.pool.query(
    `UPDATE pages_blocks_card_grid_cards SET image_id = $1 WHERE id = '69adbf9611cdec6690f43013'`,
    [ids[2]],
  )
  console.log('Set "Student Recruitment" card -> cx350-choir')

  // Concert Recording "Program Archives" card -> cx350-orchestra
  await payload.db.pool.query(
    `UPDATE pages_blocks_card_grid_cards SET image_id = $1 WHERE id = '69adbf9611cdec6690f43011'`,
    [ids[0]],
  )
  console.log('Set "Program Archives" card -> cx350-orchestra')

  // Concert Recording "Album Production" card -> cx350-recording
  await payload.db.pool.query(
    `UPDATE pages_blocks_card_grid_cards SET image_id = $1 WHERE id = '69adbf9611cdec6690f43015'`,
    [ids[1]],
  )
  console.log('Set "Album Production" card -> cx350-recording')

  console.log('\nDone! All CX-350 images assigned.')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
