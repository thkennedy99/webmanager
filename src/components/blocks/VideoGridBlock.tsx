'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type VideoItem = {
  id: number
  title: string
  videoUrl: string
  platform: string
  year?: number
  instruments: { id: number; name: string }[]
  location: { id: number; name: string } | null
  thumbnailUrl: string | null
}

type Filters = {
  years: number[]
  instruments: { id: number; name: string }[]
  locations: { id: number; name: string }[]
}

type VideoGridProps = {
  tenantId: number | string
  heading?: string
  columns?: number
  itemsPerPage?: number
  showFilters?: boolean
  showPlaylist?: boolean
}

export default function VideoGridBlockComponent({
  tenantId,
  heading,
  columns = 3,
  itemsPerPage = 9,
  showFilters = true,
  showPlaylist = true,
}: VideoGridProps) {
  const [items, setItems] = useState<VideoItem[]>([])
  const [filters, setFilters] = useState<Filters>({ years: [], instruments: [], locations: [] })
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(itemsPerPage)

  // Filter state
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [selectedInstruments, setSelectedInstruments] = useState<number[]>([])
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)

  // Modal state
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Playlist state
  const [playlistMode, setPlaylistMode] = useState(false)
  const [playlistIndex, setPlaylistIndex] = useState(0)
  const [allFilteredItems, setAllFilteredItems] = useState<VideoItem[]>([])
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      tenantId: String(tenantId),
      page: String(currentPage),
      limit: String(perPage),
    })

    if (selectedYears.length === 1) params.set('year', String(selectedYears[0]))
    if (selectedInstruments.length > 0) params.set('instruments', selectedInstruments.join(','))
    if (selectedLocation) params.set('location', String(selectedLocation))

    try {
      const res = await fetch(`/api/video-grid?${params}`)
      const json = await res.json()
      if (json.success) {
        setItems(json.data.items)
        setTotalPages(json.data.totalPages)
        setFilters(json.data.filters)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [tenantId, currentPage, perPage, selectedYears, selectedInstruments, selectedLocation])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // Fetch all filtered items for playlist
  const fetchAllForPlaylist = useCallback(async () => {
    const params = new URLSearchParams({
      tenantId: String(tenantId),
      page: '1',
      limit: '1000',
    })
    if (selectedYears.length === 1) params.set('year', String(selectedYears[0]))
    if (selectedInstruments.length > 0) params.set('instruments', selectedInstruments.join(','))
    if (selectedLocation) params.set('location', String(selectedLocation))

    const res = await fetch(`/api/video-grid?${params}`)
    const json = await res.json()
    if (json.success) {
      setAllFilteredItems(json.data.items)
    }
  }, [tenantId, selectedYears, selectedInstruments, selectedLocation])

  const openVideo = (video: VideoItem) => {
    setActiveVideo(video)
    setPlaylistMode(false)
    setShowModal(true)
  }

  const startPlaylist = async () => {
    await fetchAllForPlaylist()
    setPlaylistMode(true)
    setPlaylistIndex(0)
    setShowModal(true)
  }

  // When playlist mode starts, set the first video
  useEffect(() => {
    if (playlistMode && allFilteredItems.length > 0) {
      setActiveVideo(allFilteredItems[playlistIndex])
    }
  }, [playlistMode, allFilteredItems, playlistIndex])

  const nextInPlaylist = () => {
    if (playlistIndex < allFilteredItems.length - 1) {
      setPlaylistIndex(playlistIndex + 1)
    } else {
      setShowModal(false)
      setPlaylistMode(false)
    }
  }

  const prevInPlaylist = () => {
    if (playlistIndex > 0) {
      setPlaylistIndex(playlistIndex - 1)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setActiveVideo(null)
    setPlaylistMode(false)
  }

  const getEmbedUrl = (video: VideoItem) => {
    if (video.platform === 'youtube') {
      const id = extractYouTubeId(video.videoUrl)
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null
    }
    if (video.platform === 'vimeo') {
      const id = extractVimeoId(video.videoUrl)
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null
    }
    return null
  }

  const toggleYear = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    )
    setCurrentPage(1)
  }

  const toggleInstrument = (id: number) => {
    setSelectedInstruments((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
    setCurrentPage(1)
  }

  // Per-page options: multiples of columns
  const perPageOptions = Array.from({ length: 5 }, (_, i) => columns * (i + 1))

  return (
    <div className="container py-4">
      {heading && <h2 className="mb-4">{heading}</h2>}

      {/* Filters */}
      {showFilters && (
        <div className="row mb-4 g-3">
          {/* Year filter */}
          {filters.years.length > 0 && (
            <div className="col-md-4">
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Year</label>
              <div className="d-flex flex-wrap gap-1">
                {filters.years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    className={`btn btn-sm ${selectedYears.includes(year) ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => toggleYear(year)}
                    style={{ fontSize: 12 }}
                  >
                    {year}
                  </button>
                ))}
                {selectedYears.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => { setSelectedYears([]); setCurrentPage(1) }}
                    style={{ fontSize: 11 }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Instrument filter */}
          {filters.instruments.length > 0 && (
            <div className="col-md-4">
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Instrument</label>
              <div className="d-flex flex-wrap gap-1">
                {filters.instruments.map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    className={`btn btn-sm ${selectedInstruments.includes(inst.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => toggleInstrument(inst.id)}
                    style={{ fontSize: 12 }}
                  >
                    {inst.name}
                  </button>
                ))}
                {selectedInstruments.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => { setSelectedInstruments([]); setCurrentPage(1) }}
                    style={{ fontSize: 11 }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Location filter */}
          {filters.locations.length > 0 && (
            <div className="col-md-4">
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Location</label>
              <div className="d-flex flex-wrap gap-1">
                {filters.locations.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    className={`btn btn-sm ${selectedLocation === loc.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => {
                      setSelectedLocation(selectedLocation === loc.id ? null : loc.id)
                      setCurrentPage(1)
                    }}
                    style={{ fontSize: 12 }}
                  >
                    {loc.name}
                  </button>
                ))}
                {selectedLocation && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => { setSelectedLocation(null); setCurrentPage(1) }}
                    style={{ fontSize: 11 }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          {showPlaylist && items.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={startPlaylist}
            >
              Play All
            </button>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0" style={{ fontSize: 12 }}>Per page:</label>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto', fontSize: 12 }}
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1) }}
          >
            {perPageOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Video Grid */}
      {!loading && (
        <div className="row g-3">
          {items.length === 0 && (
            <div className="col-12 text-center text-muted py-5">
              No videos found matching your filters.
            </div>
          )}
          {items.map((video) => (
            <div key={video.id} className={`col-${12 / columns}`}>
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ cursor: 'pointer', overflow: 'hidden' }}
                onClick={() => openVideo(video)}
                role="button"
                tabIndex={0}
                aria-label={`Play ${video.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter') openVideo(video) }}
              >
                <div className="position-relative" style={{ paddingTop: '56.25%', background: '#111' }}>
                  {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes={`(max-width: 768px) 100vw, ${Math.round(100 / columns)}vw`}
                      unoptimized={video.thumbnailUrl.startsWith('https://')}
                    />
                  ) : (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ background: '#1a1a2e' }}
                    >
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <polygon points="5,3 19,12 5,21" fill="white" />
                      </svg>
                    </div>
                  )}
                  {/* Play overlay */}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(0,0,0,0.2)', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.4)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.2)' }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.8">
                      <polygon points="8,5 19,12 8,19" />
                    </svg>
                  </div>
                </div>
                <div className="card-body p-2">
                  <h6 className="card-title mb-1" style={{ fontSize: 14, lineHeight: 1.3 }}>
                    {video.title}
                  </h6>
                  <div className="d-flex flex-wrap gap-1 align-items-center" style={{ fontSize: 11, color: '#888' }}>
                    {video.year && <span>{video.year}</span>}
                    {video.location && (
                      <>
                        {video.year && <span>·</span>}
                        <span>{video.location.name}</span>
                      </>
                    )}
                  </div>
                  {video.instruments.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {video.instruments.map((inst) => (
                        <span
                          key={inst.id}
                          className="badge bg-light text-dark"
                          style={{ fontSize: 10, fontWeight: 400 }}
                        >
                          {inst.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4 d-flex justify-content-center">
          <ul className="pagination pagination-sm">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                Prev
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(p)}>
                  {p}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Video Modal */}
      {showModal && activeVideo && (
        <>
          <div
            className="modal-backdrop show"
            style={{ zIndex: 1050 }}
            onClick={closeModal}
          />
          <div
            className="modal show d-block"
            style={{ zIndex: 1055 }}
            tabIndex={-1}
            role="dialog"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content bg-dark text-white border-0">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title" style={{ fontSize: 16 }}>
                    {activeVideo.title}
                    {playlistMode && (
                      <span className="ms-2 badge bg-secondary" style={{ fontSize: 11 }}>
                        {playlistIndex + 1} / {allFilteredItems.length}
                      </span>
                    )}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body pt-2">
                  <div className="ratio ratio-16x9">
                    {getEmbedUrl(activeVideo) ? (
                      <iframe
                        ref={iframeRef}
                        src={getEmbedUrl(activeVideo)!}
                        title={activeVideo.title}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center bg-black">
                        <p>Unable to embed this video.</p>
                      </div>
                    )}
                  </div>
                  {/* Video info */}
                  <div className="mt-2 d-flex flex-wrap gap-2 align-items-center" style={{ fontSize: 13 }}>
                    {activeVideo.year && (
                      <span className="badge bg-secondary">{activeVideo.year}</span>
                    )}
                    {activeVideo.location && (
                      <span className="badge bg-secondary">{activeVideo.location.name}</span>
                    )}
                    {activeVideo.instruments.map((inst) => (
                      <span key={inst.id} className="badge bg-outline-light border">
                        {inst.name}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Playlist controls */}
                {playlistMode && (
                  <div className="modal-footer border-0 pt-0 d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={prevInPlaylist}
                      disabled={playlistIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={nextInPlaylist}
                    >
                      {playlistIndex < allFilteredItems.length - 1 ? 'Next' : 'Close'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}
