# ADR-010: Swiper for Carousel Components

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
Multiple blocks require carousel/slider functionality: product carousels, hero slides, testimonial sliders, and image galleries. A consistent carousel solution was needed.

## Decision
Use Swiper v11+ loaded via CDN for all carousel blocks:

### CDN Loading
```php
// Loaded in functions.php
wp_enqueue_style('swiper-css', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
wp_enqueue_script('swiper-js', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
```

### Standard Carousel Configuration
```javascript
import Swiper from 'swiper';

const carousel = new Swiper('.sc-carousel__swiper-container__swiper', {
  slidesPerView: 1.8,
  spaceBetween: 16,
  autoplay: { delay: 3000 },
  navigation: {
    nextEl: '.sc-carousel__swiper-container__navigation__next-button',
    prevEl: '.sc-carousel__swiper-container__navigation__prev-button'
  },
  breakpoints: {
    726: { slidesPerView: 3 },
    1024: { slidesPerView: 6 }
  }
});
```

### Blocks Using Swiper
- sc-carousel — Product/category carousel
- sc-hero-template — Hero section with slides
- sc-disfrutamos — Testimonial slider
- sc-oportunidades-laborales — Job opportunities slider

### Animation Integration
Combined with anime.js for scroll-triggered animations:
```javascript
import anime from 'animejs';

const animateCarousel = (el) => {
  anime({
    targets: el,
    translateX: [200, 0],
    opacity: [0, 1],
    duration: 500,
    easing: 'easeOutExpo'
  });
};
```

## Consequences
- Single carousel library for all slider blocks
- CDN loading reduces theme bundle size
- Swiper atom component wraps configuration for editor preview
- Responsive breakpoints standardized (726px, 1024px)
- View.js files handle Swiper initialization on frontend
