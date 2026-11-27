import { EMPTY_SESSION_LOG, isSessionLog, type AliveSessionLog } from "@/lib/alive/appearance-policy";
import { createPersistentStore } from "@/lib/storage";

/**
 * Lives in sessionStorage: a new visit (a new tab, the next juntada) starts fresh,
 * while navigating or reloading inside the same session keeps the frequency rules.
 */
export const aliveSessionStore = createPersistentStore<AliveSessionLog>({
  key: "calesita:alive-session",
  version: 1,
  fallback: EMPTY_SESSION_LOG,
  validate: isSessionLog,
  getStorage: () => (typeof window === "undefined" ? undefined : window.sessionStorage),
});
