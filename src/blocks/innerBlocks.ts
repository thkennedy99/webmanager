/**
 * Blocks that can be nested inside Columns, Section, and Grid containers.
 * This prevents circular nesting (columns inside columns) while allowing
 * rich content inside layout containers.
 */
import { RichTextBlock } from './RichTextBlock'
import { ImageBlock } from './ImageBlock'
import { ImageGalleryBlock } from './ImageGalleryBlock'
import { VideoEmbedBlock } from './VideoEmbedBlock'
import { MusicPlaylistBlock } from './MusicPlaylistBlock'
import { CTABlock } from './CTABlock'
import { SpacerBlock } from './SpacerBlock'
import { AccordionBlock } from './AccordionBlock'
import { CardGridBlock } from './CardGridBlock'
import { ArtistListBlock } from './ArtistListBlock'
import { EventListBlock } from './EventListBlock'
import { ButtonBlock } from './ButtonBlock'
import { MailingListBlock } from './MailingListBlock'
import { DonationBlock } from './DonationBlock'
import { TipJarBlock } from './TipJarBlock'
import { EmbedBlock } from './EmbedBlock'
import { CalendarBlock } from './CalendarBlock'
import { FileDownloadBlock } from './FileDownloadBlock'
import type { Block } from 'payload'

export const innerBlocks: Block[] = [
  RichTextBlock,
  ImageBlock,
  ImageGalleryBlock,
  VideoEmbedBlock,
  MusicPlaylistBlock,
  CTABlock,
  SpacerBlock,
  AccordionBlock,
  CardGridBlock,
  ArtistListBlock,
  EventListBlock,
  ButtonBlock,
  MailingListBlock,
  DonationBlock,
  TipJarBlock,
  EmbedBlock,
  CalendarBlock,
  FileDownloadBlock,
]
