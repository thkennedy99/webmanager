import { Container, Row, Col } from 'react-bootstrap'
import Link from 'next/link'

type FileDoc = {
  id: number | string
  name: string
  filename: string
  url: string
  mimeType?: string
  filesize?: number
}

type FileItem = {
  file: FileDoc | number | string
  label?: string | null
}

type Props = {
  block: {
    heading?: string | null
    files: FileItem[]
    style?: 'list' | 'cards' | null
  }
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType?: string): string {
  if (!mimeType) return 'bi-file-earmark'
  if (mimeType.startsWith('image/')) return 'bi-file-earmark-image'
  if (mimeType.startsWith('audio/')) return 'bi-file-earmark-music'
  if (mimeType.startsWith('video/')) return 'bi-file-earmark-play'
  if (mimeType.includes('pdf')) return 'bi-file-earmark-pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'bi-file-earmark-word'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'bi-file-earmark-spreadsheet'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'bi-file-earmark-slides'
  if (mimeType.includes('zip')) return 'bi-file-earmark-zip'
  return 'bi-file-earmark'
}

export function FileDownloadBlockComponent({ block }: Props) {
  const validFiles = block.files.filter(
    (item): item is FileItem & { file: FileDoc } =>
      typeof item.file === 'object' && item.file !== null,
  )

  if (validFiles.length === 0) return null

  const isCards = block.style === 'cards'

  return (
    <section className="py-4">
      <Container>
        {block.heading && <h2 className="mb-4">{block.heading}</h2>}

        {isCards ? (
          <Row className="g-3">
            {validFiles.map((item, i) => {
              const file = item.file
              const displayName = item.label || file.name
              const size = formatFileSize(file.filesize)

              return (
                <Col key={i} sm={6} md={4} lg={3}>
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    download
                  >
                    <div className="border rounded p-3 h-100 d-flex flex-column align-items-center text-center file-download-card">
                      <i
                        className={`bi ${getFileIcon(file.mimeType)} fs-1 mb-2`}
                        style={{ color: 'var(--color-accent, #1fa85d)' }}
                      />
                      <span className="fw-semibold" style={{ color: 'var(--color-body-text, #222)' }}>
                        {displayName}
                      </span>
                      {size && (
                        <small className="text-muted mt-1">{size}</small>
                      )}
                    </div>
                  </Link>
                </Col>
              )
            })}
          </Row>
        ) : (
          <ul className="list-unstyled">
            {validFiles.map((item, i) => {
              const file = item.file
              const displayName = item.label || file.name
              const size = formatFileSize(file.filesize)

              return (
                <li key={i} className="mb-2">
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-inline-flex align-items-center gap-2 file-download-link"
                    download
                  >
                    <i className={`bi ${getFileIcon(file.mimeType)}`} />
                    <span>{displayName}</span>
                    {size && <small className="text-muted">({size})</small>}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </Container>
    </section>
  )
}
