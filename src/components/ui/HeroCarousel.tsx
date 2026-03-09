'use client'

import Image from 'next/image'
import { Carousel } from 'react-bootstrap'

type Slide = {
  src: string
  alt: string
}

type HeroCarouselProps = {
  slides: Slide[]
  headline?: string
  subheadline?: string
}

export default function HeroCarousel({ slides, headline, subheadline }: HeroCarouselProps) {
  return (
    <Carousel className="hero-carousel" fade interval={5000} controls={slides.length > 1}>
      {slides.map((slide, idx) => (
        <Carousel.Item key={idx}>
          <Image
            src={slide.src}
            alt={slide.alt}
            width={1920}
            height={800}
            priority={idx === 0}
            sizes="100vw"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          {idx === 0 && (headline || subheadline) && (
            <Carousel.Caption>
              {headline && <h1>{headline}</h1>}
              {subheadline && <p className="lead">{subheadline}</p>}
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
