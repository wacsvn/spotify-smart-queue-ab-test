// Tracking call site - this is where a real SDK integration would
// plug in. Everything else in the app calls track()/trackError() and never
// needs to know whether that ends up in Mixpanel, GA4, both, or (as here)
// just the in-app event log used for the portfolio demo.
//
// To wire this up for real:
//   import mixpanel from "mixpanel-browser";
//   mixpanel.init("YOUR_PROJECT_TOKEN");
//   export function track(name, properties = {}) {
//     mixpanel.track(name, properties);
//   }
//
// For this project specifically: production data isn't sent live from this
// app. Simulated data (Faker/numpy) is generated separately and pushed to
// Mixpanel in bulk via the Import API — see the data-simulation step of the
// project plan. This stub exists so the UI's event-firing logic (what fires,
// when, with what properties) is already correct and ready to point at a
// real SDK later, without re-deriving the trigger logic from scratch.

export function track(name, properties = {}) {
  // no-op in the portfolio demo — page.js's logEvent() renders these into
  // the visible Event Log panel instead. Swap in a real call here.
  return { name, properties };
}

export function trackError(error, context = {}) {
  // Placeholder for the crash/error-rate guardrail metric. A real
  // integration (Sentry, Bugsnag, or a custom window.onerror handler) would
  // call track("app_crash", {...}) or similar from here.
  return { error, context };
}
