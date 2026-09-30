# Smart Queue — Spotify Clone (PA Portfolio Demo)

Rudimentary Spotify mockup built to demo the "Smart Queue" A/B test for my
Product Analyst portfolio project. No real audio for this mockup; playback is simulated
on a compressed timescale so the full flow (including the Smart Queue
banner) is visible in seconds.

- **Control variant:** passive autoplay only (no banner).
- **Treatment variant:** an interactive "Next Recommended Songs" banner
  appears once the current track crosses ~65% played, offering 3
  context-aware suggestions the user can tap to queue immediately.

The event log at the bottom of the page mirrors the tracking plan
(`session_start`, `track_started` / `track_autoplayed`, `smart_queue_shown`,
`smart_queue_tap`, `track_completed`) — this is a visual aid for portfolio
reviewers, not a real live Mixpanel connection. Actual analysis data is generated
separately (Faker/numpy) and imported into Mixpanel via its Import API, per
the project's data-simulation step.

## Local setup

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

Note that the app is already deployed to Vercel.

## Project structure

```
app/            Next.js app router — layout, page, global styles
components/     Player, Queue sidebar, Smart Queue banner, event log
data/tracks.js  Mock track catalog + naive genre-based recommender
```
