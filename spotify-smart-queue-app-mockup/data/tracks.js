// Mock catalog for the demo. No real audio is played — progress is simulated
// on a compressed timescale (simulatedSeconds) so a portfolio viewer can see
// a full "song" and the Smart Queue banner without waiting minutes.

export const TRACKS = [
  { id: "t1", title: "Amber Static", artist: "Little Fox Parade", genre: "indie", simulatedSeconds: 18, colors: ["#1DB954", "#0B4A26"] },
  { id: "t2", title: "Glass Corridor", artist: "Nightbus", genre: "electronic", simulatedSeconds: 16, colors: ["#5B3EF5", "#1A1140"] },
  { id: "t3", title: "Low Tide", artist: "Coastal Static", genre: "chill", simulatedSeconds: 20, colors: ["#2E9CB0", "#0E3A42"] },
  { id: "t4", title: "Rusted Gold", artist: "Marlowe & Vine", genre: "folk", simulatedSeconds: 17, colors: ["#C97B3F", "#4A2A10"] },
  { id: "t5", title: "Fault Line", artist: "Nightbus", genre: "electronic", simulatedSeconds: 15, colors: ["#E23E57", "#4A0F1C"] },
  { id: "t6", title: "Paper Weather", artist: "June Static", genre: "indie", simulatedSeconds: 19, colors: ["#1DB954", "#123B22"] },
  { id: "t7", title: "Slow Signal", artist: "Coastal Static", genre: "chill", simulatedSeconds: 21, colors: ["#2E9CB0", "#123138"] },
  { id: "t8", title: "Wire & Bone", artist: "Marlowe & Vine", genre: "folk", simulatedSeconds: 16, colors: ["#C97B3F", "#3A2410"] },
  { id: "t9", title: "Halflight", artist: "Little Fox Parade", genre: "indie", simulatedSeconds: 18, colors: ["#1DB954", "#0E3320"] },
  { id: "t10", title: "Static Bloom", artist: "Nightbus", genre: "electronic", simulatedSeconds: 14, colors: ["#5B3EF5", "#211A4A"] },
  { id: "t11", title: "Quiet Traffic", artist: "June Static", genre: "indie", simulatedSeconds: 17, colors: ["#1DB954", "#0F2E1B"] },
  { id: "t12", title: "Backlit", artist: "Nightbus", genre: "electronic", simulatedSeconds: 15, colors: ["#5B3EF5", "#241A5C"] },
  { id: "t13", title: "Driftwood", artist: "Coastal Static", genre: "chill", simulatedSeconds: 19, colors: ["#2E9CB0", "#0B2A30"] },
  { id: "t14", title: "Copper Line", artist: "Marlowe & Vine", genre: "folk", simulatedSeconds: 18, colors: ["#C97B3F", "#331E0B"] },
  { id: "t15", title: "Faded Signal", artist: "Little Fox Parade", genre: "indie", simulatedSeconds: 16, colors: ["#1DB954", "#154227"] },
  { id: "t16", title: "Undertow", artist: "Coastal Static", genre: "chill", simulatedSeconds: 20, colors: ["#2E9CB0", "#0D3138"] },
  { id: "t17", title: "Night Bus Home", artist: "Nightbus", genre: "electronic", simulatedSeconds: 17, colors: ["#5B3EF5", "#1D154A"] },
  { id: "t18", title: "Split Rail", artist: "Marlowe & Vine", genre: "folk", simulatedSeconds: 15, colors: ["#C97B3F", "#3D2510"] },
  { id: "t19", title: "Porchlight", artist: "June Static", genre: "indie", simulatedSeconds: 19, colors: ["#1DB954", "#123B22"] },
  { id: "t20", title: "Static Tide", artist: "Coastal Static", genre: "chill", simulatedSeconds: 18, colors: ["#2E9CB0", "#123138"] },
];

// Only the first few tracks are preloaded into the initial queue — the rest
// of the catalog is left as a real pool for Smart Queue to recommend from.
// (Preloading the whole catalog was the bug: nothing was ever left over to
// suggest by the time the banner showed.)
export const DEFAULT_QUEUE_ORDER = ["t1", "t2", "t3", "t4", "t5"];

// Naive "recommender": 3 tracks sharing genre with the current track,
// falling back to random catalog picks. Stands in for a real ML recommender.
export function getSmartQueueSuggestions(currentTrackId, excludeIds = []) {
  const current = TRACKS.find((t) => t.id === currentTrackId);
  const pool = TRACKS.filter(
    (t) => t.id !== currentTrackId && !excludeIds.includes(t.id)
  );
  const sameGenre = pool.filter((t) => t.genre === current?.genre);
  const rest = pool.filter((t) => t.genre !== current?.genre);
  const ordered = [...sameGenre, ...rest];
  return ordered.slice(0, 3);
}
