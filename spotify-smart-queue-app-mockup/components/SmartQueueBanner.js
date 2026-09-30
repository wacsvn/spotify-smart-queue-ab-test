"use client";

import styles from "./SmartQueueBanner.module.css";

export default function SmartQueueBanner({ suggestions, onPick, onDismiss }) {
  return (
    <div className={styles.banner} role="dialog" aria-label="Smart Queue suggestions">
      <div className={styles.head}>
        <p>
          Next Recommended Songs
          <span>Tap a track to queue it up next</span>
        </p>
        <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>
      <div className={styles.choices}>
        {suggestions.map((track) => (
          <button
            key={track.id}
            className={styles.choice}
            onClick={() => onPick(track)}
          >
            <div
              className={styles.swatch}
              style={{
                background: `linear-gradient(150deg, ${track.colors[0]}, ${track.colors[1]})`,
              }}
            />
            <p className={styles.choiceTitle}>{track.title}</p>
            <p className={styles.choiceArtist}>{track.artist}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
