type ReadWriteStorage = Pick<Storage, "getItem" | "setItem">;

type StoreOptions<T> = {
  key: string;
  /** Bump when the stored shape changes; older data is discarded. */
  version: number;
  fallback: T;
  validate: (value: unknown) => value is T;
  getStorage?: () => ReadWriteStorage | undefined;
};

export type PersistentStore<T> = {
  get: () => T;
  getFallback: () => T;
  set: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
};

function getBrowserStorage(): ReadWriteStorage | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function createPersistentStore<T>({
  key,
  version,
  fallback,
  validate,
  getStorage = getBrowserStorage,
}: StoreOptions<T>): PersistentStore<T> {
  const listeners = new Set<() => void>();
  let cached: { value: T } | null = null;

  function read(): T {
    try {
      const raw = getStorage()?.getItem(key);
      if (!raw) return fallback;

      const envelope: unknown = JSON.parse(raw);
      if (
        typeof envelope === "object" &&
        envelope !== null &&
        "version" in envelope &&
        "data" in envelope &&
        envelope.version === version &&
        validate(envelope.data)
      ) {
        return envelope.data;
      }
    } catch {
      // Corrupt or blocked storage must never break a game.
    }
    return fallback;
  }

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function handleStorageEvent(event: StorageEvent) {
    if (event.key === key) {
      cached = null;
      notify();
    }
  }

  return {
    get() {
      cached ??= { value: read() };
      return cached.value;
    },
    getFallback: () => fallback,
    set(value) {
      cached = { value };
      try {
        getStorage()?.setItem(key, JSON.stringify({ version, data: value }));
      } catch {
        // The value stays available in memory for this session.
      }
      notify();
    },
    subscribe(listener) {
      if (listeners.size === 0 && typeof window !== "undefined") {
        window.addEventListener("storage", handleStorageEvent);
      }
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && typeof window !== "undefined") {
          window.removeEventListener("storage", handleStorageEvent);
        }
      };
    },
  };
}
