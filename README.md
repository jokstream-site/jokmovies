# JOK — Watch Beyond Limits

A single-file, responsive movie and TV discovery interface powered by TMDB.

## Setup

1. Open `index.html`.
2. Replace `YOUR_TMDB_API_KEY_HERE` with your TMDB API key.
3. Enable GitHub Pages from **Settings → Pages**, selecting the `main` branch and root folder.

## Included

- Responsive desktop, mobile, and TV-friendly layout.
- English, Arabic (RTL), Spanish, and French UI/API language selection.
- TMDB discovery rows for latest movies, latest series, Netflix, Hulu, and Korean-language series.
- Search, genre filters, title details, cast, seasons, episodes, and similar titles.
- Session caching and lazy-loaded TMDB poster images.
- On-demand player initialization, availability check, quality badge, language-priority subtitles, and local watch-progress storage.

## Configuration and rights

The first playback option uses the provider integration configured in `PLAYER_SERVERS`. Keep it enabled only where you hold the required rights and the provider permits embedding. Additional server slots are intentionally left blank until you configure your own authorized HTTPS player URLs.

The iframe sandbox is deliberately restrictive. Some providers may require additional iframe permissions; change it only after checking the provider's security and integration documentation.

## API key security

This is a static front-end, so a TMDB API key placed in the HTML is visible to visitors. For a public production deployment, use a small server-side proxy and restrict/rotate the key as appropriate.
