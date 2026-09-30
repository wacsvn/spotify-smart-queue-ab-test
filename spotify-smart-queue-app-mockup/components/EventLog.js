"use client";

import { useState } from "react";
import styles from "./EventLog.module.css";

export default function EventLog({ events }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrap}>
      <button className={styles.toggle} onClick={() => setOpen((v) => !v)}>
        <span className={styles.dot} />
        {open ? "Hide" : "Show"} simulated event log ({events.length} fired) - represents the
        tracking plan events sent to Mixpanel
      </button>
      {open && (
        <div className={styles.log}>
          {events
            .slice()
            .reverse()
            .map((e, i) => (
              <div className={styles.row} key={i}>
                <span className={styles.ts}>{e.ts}</span>
                <span className={styles.name}>{e.name}</span>
                <span className={styles.payload}>{e.payload}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
