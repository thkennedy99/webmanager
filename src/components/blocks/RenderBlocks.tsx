import type { Page } from '@/payload-types'
import { RichTextBlockComponent } from './RichTextBlock'
import { ImageBlockComponent } from './ImageBlock'
import { ImageGalleryBlockComponent } from './ImageGalleryBlock'
import { VideoEmbedBlockComponent } from './VideoEmbedBlock'
import { MusicPlaylistBlockComponent } from './MusicPlaylistBlock'
import { ColumnsBlockComponent } from './ColumnsBlock'
import { SectionBlockComponent } from './SectionBlock'
import { GridBlockComponent } from './GridBlock'
import { CTABlockComponent } from './CTABlock'
import { SpacerBlockComponent } from './SpacerBlock'
import { AccordionBlockComponent } from './AccordionBlock'
import { CardGridBlockComponent } from './CardGridBlock'
import { ArtistListBlockComponent } from './ArtistListBlock'
import { EventListBlockComponent } from './EventListBlock'
import { ButtonBlockComponent } from './ButtonBlock'
import { MailingListBlockComponent } from './MailingListBlock'
import { DonationBlockComponent } from './DonationBlock'
import { TipJarBlockComponent } from './TipJarBlock'
import { EmbedBlockComponent } from './EmbedBlock'
import { CalendarBlockComponent } from './CalendarBlock'
import { FileDownloadBlockComponent } from './FileDownloadBlock'
import VideoGridBlockComponent from './VideoGridBlock'

// Use unknown[] to handle both top-level and nested block arrays
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBlock = any

type Props = {
  blocks: AnyBlock[]
  tenantId?: string | number
  tenantSlug?: string
}

export function RenderBlocks({ blocks, tenantId, tenantSlug }: Props) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block: AnyBlock, index: number) => {
        if (!block?.blockType) return null
        const key = `${block.blockType}-${block.id || index}`
        switch (block.blockType) {
          case 'richText':
            return <RichTextBlockComponent key={key} block={block} />
          case 'image':
            return <ImageBlockComponent key={key} block={block} />
          case 'imageGallery':
            return <ImageGalleryBlockComponent key={key} block={block} />
          case 'videoEmbed':
            return <VideoEmbedBlockComponent key={key} block={block} />
          case 'musicPlaylist':
            return <MusicPlaylistBlockComponent key={key} block={block} tenantId={tenantId} />
          case 'columns':
            return <ColumnsBlockComponent key={key} block={block} tenantId={tenantId} tenantSlug={tenantSlug} />
          case 'section':
            return <SectionBlockComponent key={key} block={block} tenantId={tenantId} tenantSlug={tenantSlug} />
          case 'grid':
            return <GridBlockComponent key={key} block={block} tenantId={tenantId} tenantSlug={tenantSlug} />
          case 'cta':
            return <CTABlockComponent key={key} block={block} />
          case 'spacer':
            return <SpacerBlockComponent key={key} block={block} />
          case 'accordion':
            return <AccordionBlockComponent key={key} block={block} />
          case 'cardGrid':
            return <CardGridBlockComponent key={key} block={block} />
          case 'artistList':
            return <ArtistListBlockComponent key={key} block={block} tenantId={tenantId} tenantSlug={tenantSlug} />
          case 'eventList':
            return <EventListBlockComponent key={key} block={block} tenantId={tenantId} />
          case 'button':
            return <ButtonBlockComponent key={key} block={block} />
          case 'mailingList':
            return <MailingListBlockComponent key={key} block={block} />
          case 'donation':
            return <DonationBlockComponent key={key} block={block} />
          case 'tipJar':
            return <TipJarBlockComponent key={key} block={block} />
          case 'embed':
            return <EmbedBlockComponent key={key} block={block} />
          case 'calendar':
            return <CalendarBlockComponent key={key} block={block} tenantId={tenantId} />
          case 'fileDownload':
            return <FileDownloadBlockComponent key={key} block={block} />
          case 'videoGrid':
            return (
              <VideoGridBlockComponent
                key={key}
                tenantId={tenantId || ''}
                heading={block.heading}
                columns={Number(block.columns) || 3}
                itemsPerPage={block.itemsPerPage || 9}
                showFilters={block.showFilters !== false}
                showPlaylist={block.showPlaylist !== false}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
