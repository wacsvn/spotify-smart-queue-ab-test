"use client";

import styles from "./Player.module.css";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Player({
  track,
  progressPct,
  elapsedSeconds,
  isPlaying,
  onTogglePlay,
  onSkip,
}) {
  return (
    <>
      <div
        className={styles.cover}
        style={{
          background: `linear-gradient(150deg, ${track.colors[0]}, ${track.colors[1]})`,
        }}
        aria-hidden
      />

      <div className={styles.meta}>
        <p className={`${styles.title} display`}>{track.title}</p>
        <p className={styles.artist}>{track.artist}</p>
      </div>

      <div className={styles.progressRow}>
        <span className={styles.time}>{formatTime(elapsedSeconds)}</span>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progressPct}%` }} />
        </div>
        <span className={styles.time}>{formatTime(track.simulatedSeconds)}</span>
      </div>

      <div className={styles.controls}>
        <button className={styles.skipBtn} aria-label="Previous" disabled>
          ⏮
        </button>
        <button
          className={styles.playBtn}
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button
          className={styles.skipBtn}
          onClick={() => onSkip("user")}
          aria-label="Skip"
        >
          ⏭
        </button>
      </div>
    </>
  );
}
