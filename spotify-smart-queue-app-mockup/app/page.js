"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import Player from "../components/Player";
import Queue from "../components/Queue";
import SmartQueueBanner from "../components/SmartQueueBanner";
import EventLog from "../components/EventLog";
import {
  TRACKS,
  DEFAULT_QUEUE_ORDER,
  getSmartQueueSuggestions,
} from "../data/tracks";
import { track as trackEvent } from "../lib/analytics";

// TRACKING: the crash/error-rate guardrail isn't fired from here - a real
// app would call trackError() (see lib/analytics.js) from a top-level error
// boundary or window.onerror handler, not from feature-specific code like
// this page. Not wired up in this demo since there's nothing to actually
// crash.

// Banner appears once a track crosses this % of its (simulated) duration.
// DEV VALUE: set low (fires shortly after start) for faster demo iteration.
const BANNER_THRESHOLD_PCT = 8;
const TICK_MS = 100;

let queueKeySeed = 0;
function toQueueItem(track, injected = false) {
  queueKeySeed += 1;
  return { ...track, queueKey: `${track.id}-${queueKeySeed}`, injected };
}

function buildInitialUpNext() {
  return DEFAULT_QUEUE_ORDER.slice(1).map((id) =>
    toQueueItem(TRACKS.find((t) => t.id === id))
  );
}

export default function Home() {
  const [variant, setVariant] = useState("treatment");
  const [nowPlaying, setNowPlaying] = useState(() => toQueueItem(TRACKS[0]));
  const [upNext, setUpNext] = useState(buildInitialUpNext);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerResolvedForKey, setBannerResolvedForKey] = useState(null);
  const [events, setEvents] = useState([]);
  const startedLogged = useRef(false);

  const progressPct = Math.min(100, (elapsed / nowPlaying.simulatedSeconds) * 100);

  // TRACKING: every call to logEvent() below corresponds to one row in the
  // tracking plan (event/property/trigger). This is where a real SDK call
  // would fire — see lib/analytics.js for the swap-in point. Kept as a
  // single function so there's exactly one place to point at Mixpanel/GA4
  // later instead of hunting through each handler.
  function logEvent(name, payload = "") {
    const ts = new Date().toLocaleTimeString([], {
      hour12: false,
      minute: "2-digit",
      second: "2-digit",
    });
    setEvents((prev) => [...prev.slice(-49), { ts, name, payload }]);
    trackEvent(name, { payload, variant }); // → real SDK call goes here eventually
  }

  // session_start fires once, on first mount.
  useEffect(() => {
    if (!startedLogged.current) {
      logEvent("session_start", `variant=${variant}`);
      logEvent("track_autoplayed", nowPlaying.title);
      startedLogged.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Playback timer — ONLY increments elapsed. Deliberately does not call
  // any other setState here: doing so from inside setElapsed's updater was
  // the bug that suppressed the banner (see completion-check effect below).
  useEffect(() => {
    if (!isPlaying) return undefined;
    const id = setInterval(() => {
      setElapsed((prev) => prev + TICK_MS / 1000);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  // Track-completion check — separate effect reacting to elapsed crossing
  // the track's duration. Keeping this apart from the tick effect above is
  // what makes progressPct reliably pass through the banner threshold
  // instead of the two state updates racing each other.
  useEffect(() => {
    if (elapsed >= nowPlaying.simulatedSeconds) {
      advanceTrack("autoplay");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  // Smart Queue banner trigger — treatment variant only, once per track.
  useEffect(() => {
    if (variant !== "treatment") return;
    if (bannerResolvedForKey === nowPlaying.queueKey) return;
    if (progressPct >= BANNER_THRESHOLD_PCT) {
      setBannerVisible(true);
      logEvent("smart_queue_shown", nowPlaying.title);
      setBannerResolvedForKey(nowPlaying.queueKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressPct, variant, nowPlaying.queueKey]);

  function advanceTrack(source) {
    setUpNext((prevQueue) => {
      if (prevQueue.length === 0) {
        // TRACKING: edge case, not in the original tracking plan — worth
        // adding as its own event if this ever goes past a demo, since a
        // silently-empty queue is a real UX dead end worth measuring.
        logEvent("queue_exhausted", "");
        return prevQueue;
      }
      const [next, ...rest] = prevQueue;
      setNowPlaying(next);
      setBannerVisible(false);
      logEvent(
        source === "user" ? "track_started" : "track_autoplayed",
        next.title
      );
      return rest;
    });
    setElapsed(0);
  }

  function handleTogglePlay() {
    setIsPlaying((v) => !v);
  }

  function handleSkip(source) {
    logEvent("track_completed", `${nowPlaying.title} (skipped)`);
    advanceTrack(source);
  }

  function handleQueueSelect(track) {
    logEvent("track_started", track.title);
    setUpNext((prev) => prev.filter((t) => t.queueKey !== track.queueKey));
    setNowPlaying(track);
    setElapsed(0);
    setBannerVisible(false);
  }

  function handleBannerPick(track) {
    // TRACKING: this is the adoption event — feeds Smart Queue Interaction
    // Rate (diagnostic metric) and the ITT/CACE adjustment in the analysis
    // plan. Property worth adding for real: which of the 3 slots was
    // tapped (position bias is a common confound in recommendation UIs).
    logEvent("smart_queue_tap", track.title);
    setUpNext((prev) => [toQueueItem(track, true), ...prev]);
    setBannerVisible(false);
  }

  function handleBannerDismiss() {
    setBannerVisible(false);
  }

  function switchVariant(next) {
    if (next === variant) return;
    queueKeySeed = 0;
    setVariant(next);
    setNowPlaying(toQueueItem(TRACKS[0]));
    setUpNext(buildInitialUpNext());
    setElapsed(0);
    setIsPlaying(true);
    setBannerVisible(false);
    setBannerResolvedForKey(null);
    setEvents([]);
    startedLogged.current = false;
    logEvent("session_start", `variant=${next}`);
    logEvent("track_autoplayed", TRACKS[0].title);
    startedLogged.current = true;
  }

  const suggestions = bannerVisible
    ? getSmartQueueSuggestions(
        nowPlaying.id,
        upNext.map((t) => t.id)
      )
    : [];

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1>Smart Queue</h1>
          <span>Spotify clone — PA portfolio demo</span>
        </div>
        <div className={styles.variantToggle}>
          Demo variant
          <button
            onClick={() => switchVariant("control")}
            style={
              variant === "control"
                ? { background: "var(--accent)", color: "#0b0b0d" }
                : undefined
            }
          >
            Control
          </button>
          <button
            onClick={() => switchVariant("treatment")}
            style={
              variant === "treatment"
                ? { background: "var(--accent)", color: "#0b0b0d" }
                : undefined
            }
          >
            Treatment
          </button>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.stage}>
          <Player
            track={nowPlaying}
            progressPct={progressPct}
            elapsedSeconds={elapsed}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onSkip={handleSkip}
          />

          {variant === "treatment" && bannerVisible && (
            <SmartQueueBanner
              suggestions={suggestions}
              onPick={handleBannerPick}
              onDismiss={handleBannerDismiss}
            />
          )}
        </div>

        <aside className={styles.sidebar}>
          <p className={styles.sidebarTitle}>Up next</p>
          <Queue queue={upNext} onSelect={handleQueueSelect} />
        </aside>
      </div>

      <EventLog events={events} />
    </div>
  );
}
