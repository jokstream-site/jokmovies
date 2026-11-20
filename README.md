# JOK NOIR

A responsive movie, series, and anime discovery website powered by TMDB metadata through the existing Cloudflare Worker proxy.

## Included

- Mobile-first dark cinema interface with desktop sidebar and mobile bottom navigation.
- English, Arabic (RTL), Spanish, and French interface and TMDB language selection.
- Trending, popular, top-rated movies and series, Japanese animation discovery, genres, and multi-search.
- Debounced search, paginated browse/search results, lazy-loaded poster images, and session caching.
- Title details, similar titles, cast placeholder (the current proxy allowlist does not expose credits), TV seasons and episodes.
- Player selection for VidSrc and VidLink, with episode selection for TV.
- Page-level popup guard and a restrictive iframe sandbox. Some third-party players may not support all sandbox settings.

## Existing TMDB proxy

The frontend calls the existing Worker:

`https://jokflix.abdonarjah.workers.dev/api/tmdb?path=/trending/all/week&language=en-US`

It sends the requested TMDB API path in the `path` query parameter. The TMDB bearer token remains in the Worker secret and is never included in browser code.

Do not deploy the sample Worker in this repository over the existing `jokflix` Worker.

## Player integrations

- VidLink movie and TV embed formats follow its published documentation:
  - `/movie/{tmdbId}`
  - `/tv/{tmdbId}/{season}/{episode}`
- VidLink's dedicated anime endpoint requires a MyAnimeList ID; the current catalogue integration does not automatically resolve MAL IDs, so the site does not fabricate them.
- VidSrc is kept as a selectable provider using the existing project's embed URL convention. Its documentation endpoint was not accessible during this revision; verify its current URL requirements and playback behavior before public launch.

TMDB discovery data is metadata, not a guarantee that a title is available from either player provider. Only use third-party embeds where permitted and appropriate.

## Deploy

Configure the Netlify site to build from this repository's `jok-noir-rebuild` branch with the repository root as the publish directory. This is a static site and has no build command. Verify the deploy preview on desktop and mobile before promoting it.

## Important limitations to verify before public launch

- The current Worker allowlist does not include TMDB credits, so cast names are not shown yet.
- Playback availability depends on external providers and may vary by title, territory, and time.
- Test iframe fullscreen, subtitle behavior, episode playback, and sandbox compatibility on the actual Netlify deploy preview.
