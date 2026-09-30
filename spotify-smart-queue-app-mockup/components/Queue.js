"use client";

import styles from "./Queue.module.css";

export default function Queue({ queue, onSelect }) {
  return (
    <div className={styles.list}>
      {queue.map((track) => (
        <button
          key={track.queueKey}
          className={styles.item}
          onClick={() => onSelect(track)}
        >
          <div
            className={styles.swatch}
            style={{
              background: `linear-gradient(150deg, ${track.colors[0]}, ${track.colors[1]})`,
            }}
          />
          <div className={styles.info}>
            <p className={styles.title}>{track.title}</p>
            <p className={styles.artist}>
              {track.artist}
              {track.injected ? <span className={styles.injected}> · via Smart Queue</span> : null}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
