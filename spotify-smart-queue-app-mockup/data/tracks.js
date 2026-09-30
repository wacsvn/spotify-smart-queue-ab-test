// Mock catalog for the demo. No real audio is played — progress is simulated
// on a compressed timescale (simulatedSeconds) so a portfolio viewer can see
// a full "song" and the Smart Queue banner without waiting minutes.

export const TRACKS = [
  { id: "t1", title: "Coconut Mall", artist: "Asuka Ohta", genre: "electronic", simulatedSeconds: 15, colors: ["#5B3EF5", "#241A5C"] },
  { id: "t2", title: "Secunda", artist: "Jeremy Soule", genre: "electronic", simulatedSeconds: 16, colors: ["#C97B3F", "#1A1140"] },
  { id: "t3", title: "Ruins", artist: "Toby Fox", genre: "chill", simulatedSeconds: 20, colors: ["#2E9CB0", "#0E3A42"] },
  { id: "t4", title: "Another Medium", artist: "Toby Fox", genre: "folk", simulatedSeconds: 17, colors: ["#2E9CB0", "#4A2A10"] },
  { id: "t5", title: "Sweden", artist: "C418", genre: "indie", simulatedSeconds: 18, colors: ["#1DB954", "#0E3320"] },
  { id: "t6", title: "Zelda's Lullaby", artist: "Koji Kondo", genre: "electronic", simulatedSeconds: 15, colors: ["#E23E57", "#4A0F1C"] },
  { id: "t7", title: "One-Winged Angel", artist: "Nobuo Uematsu", genre: "indie", simulatedSeconds: 19, colors: ["#1DB954", "#123B22"] },
  { id: "t8", title: "Corridors of Time", artist: "Yasunori Mitsuda", genre: "chill", simulatedSeconds: 21, colors: ["#2E9CB0", "#123138"] },
  { id: "t9", title: "Beneath the Mask", artist: "Shoji Meguro", genre: "folk", simulatedSeconds: 16, colors: ["#C97B3F", "#3A2410"] },
  { id: "t10", title: "Dragonborn", artist: "Jeremy Soule", genre: "indie", simulatedSeconds: 18, colors: ["#1DB954", "#0B4A26"] },
  { id: "t11", title: "Greenpath", artist: "Christopher Larkin", genre: "electronic", simulatedSeconds: 14, colors: ["#2E9CB0", "#211A4A"] },
  { id: "t12", title: "Resurrections", artist: "Lena Raine", genre: "indie", simulatedSeconds: 17, colors: ["#1DB954", "#0F2E1B"] },
  { id: "t13", title: "BFG Division", artist: "Mick Gordon", genre: "chill", simulatedSeconds: 19, colors: ["#2E9CB0", "#0B2A30"] },
  { id: "t14", title: "Ezio's Family", artist: "Jesper Kyd", genre: "folk", simulatedSeconds: 18, colors: ["#C97B3F", "#331E0B"] },
  { id: "t15", title: "Gerudo Valley", artist: "Koji Kondo", genre: "indie", simulatedSeconds: 16, colors: ["#1DB954", "#154227"] },
  { id: "t16", title: "The Path of the Wind", artist: "Joe Hisaishi", genre: "chill", simulatedSeconds: 20, colors: ["#2E9CB0", "#0D3138"] },
  { id: "t17", title: "Hades", artist: "Darren Korb", genre: "electronic", simulatedSeconds: 17, colors: ["#5B3EF5", "#1D154A"] },
  { id: "t18", title: "Nascence", artist: "Austin Wintory", genre: "folk", simulatedSeconds: 15, colors: ["#C97B3F", "#3D2510"] },
  { id: "t19", title: "Ori, Lost in the Storm", artist: "Gareth Coker", genre: "indie", simulatedSeconds: 19, colors: ["#1DB954", "#123B22"] },
  { id: "t20", title: "The Last of Us", artist: "Gustavo Santaolalla", genre: "chill", simulatedSeconds: 18, colors: ["#2E9CB0", "#123138"] },
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
