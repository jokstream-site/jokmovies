# JOK NOIR

Responsive movie, series and anime discovery website.

## Current implementation

- Dark cinematic, mobile-first interface with desktop navigation and mobile bottom navigation.
- English, Arabic (RTL), Spanish and French UI language selection.
- TMDB discovery through the existing Cloudflare Worker proxy; no TMDB token is exposed in the browser.
- Home sections: trending, popular movies, popular series, top-rated movies/series, Japanese animation discovery.
- Search with debounce, paginated browsing, genre filtering and session caching.
- Detail dialog with synopsis, similar titles, TV seasons/episodes, and an official YouTube trailer when TMDB provides one.
- Separate full-title player dialog with VidSrc and VidLink source selection.
- VidSrc latest movie and TV feeds, paginated on demand, refreshed every five minutes while a visitor has the page open.
- Subtitle language selection for VidSrc, and optional external HTTPS VTT/SRT URL for VidSrc / HTTPS VTT for VidLink as supported by their documentation.
- VidSrc player progress events are saved locally and used to resume playback.
- Anime playback uses VidLink's MAL-based endpoint. The app queries Jikan for candidate MAL IDs and requires a user choice if more than one match is returned. Sub/Dub and fallback are supported.

## Existing TMDB Worker

The frontend calls:

`https://jokflix.abdonarjah.workers.dev/api/tmdb?path=/trending/all/week&language=en-US`

The Worker receives the TMDB API path in the `path` query parameter. Keep the bearer token in the Worker secret. Do not put it in browser JavaScript.

Do not deploy any sample Worker over the existing `jokflix` Worker.

## Provider integrations

### VidSrc.sh

- Movie: `/embed/movie/{id}`
- TV series picker: `/embed/tv/{id}`
- Episode: `/embed/tv/{id}/{season}/{episode}`
- Latest feeds: `/movies/latest/page-{N}.json`, `/tvshows/latest/page-{N}.json`
- Availability: `/info/movie/{id}.json`, `/info/tv/{id}.json`
- Subtitles: `ds_lang`, `sub_url`, `sub_label`, `sub_lang`
- Player events: `PLAYER_EVENT` from the VidSrc origin.

### VidLink.pro

- Movie: `/movie/{tmdbId}`
- TV episode: `/tv/{tmdbId}/{season}/{episode}`
- Anime: `/anime/{MALid}/{episode}/{subOrDub}`
- Anime uses a MyAnimeList ID, not a TMDB ID. The app resolves candidate MAL IDs through Jikan and lets the viewer select the match.
- External subtitle: `sub_file` (direct HTTPS VTT URL) and `sub_label`.

## Catalogue refresh behaviour

The home page requests the first page of the latest VidSrc movie and TV feeds and enriches up to 10 entries per feed with TMDB metadata. It refreshes those first pages every five minutes while the page remains open. Additional feed pages can be loaded manually.

This is periodic client-side refresh, not a full server-side mirror of every catalogue ID. VidSrc reports 50 records per feed page and provides daily ID lists. A truly complete searchable catalogue for all visitors requires a scheduled server-side importer and persistent database (for example, a Cloudflare Cron Worker plus D1 or Supabase). That requires a separate backend deployment and storage configuration; this static site does not pretend to have imported every page.

## Deploy

Configure Netlify to build from `jokstream-site/jokmovies`, branch `jok-noir-rebuild`, publish directory `/` (repository root), and no build command. Verify the Netlify deploy preview on desktop and mobile before public launch.

## Validation still required on the live deploy

- Confirm the Worker endpoint is reachable from the Netlify domain and all requested TMDB routes are allowed.
- Confirm VidSrc feed CORS and player playback in the target browsers.
- Confirm VidLink anime MAL matches for real titles; ambiguous matches require viewer selection.
- Test subtitles, fullscreen, TV episode selection and player switching on Android Chrome, iOS Safari and desktop.
- External providers control their own playback availability, quality, ads and player behaviour. JOK NOIR does not bypass their security controls.
