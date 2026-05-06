# Performance Testing Policy — Angular

> Mandatory when critical user flows, rendering-heavy screens, or API-intensive experiences are introduced or changed materially.

## 1. When to Run

Run performance validation when:
- A critical route is added or heavily modified
- Rendering complexity increases
- Large lists, dashboards, or heavy forms are introduced
- Backend interaction volume changes materially
- A release candidate needs UX performance evidence

## 2. Minimum Metrics

Capture when possible:
- First meaningful render or equivalent app startup observation
- Interaction latency for critical user action
- API-heavy flow duration
- Error rate under load
- Browser or runtime observations if available

## 3. Gate Rules

Performance blocks delivery when:
- Critical UX flow regresses beyond the approved baseline
- Error rate is unacceptable
- No evidence exists for a performance-sensitive flow

## 4. Reporting

Each report must state:
- route or flow tested
- environment
- device/browser assumptions
- baseline and current result
- recommendation
