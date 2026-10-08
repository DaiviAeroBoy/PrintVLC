import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'PrintVLC_Storage';
const DB_VERSION = 1;
const STORE_PRESETS = 'presets';
const STORE_HISTORY = 'history';
const STORE_SETTINGS = 'settings';

export type StorageMode = 'workspace' | 'ephemeral';

interface StorageState {
  mode: StorageMode;
  hasConsented: boolean;
}

let ephemeralBlobs: Set<string> = new Set();
let ephemeralWorkers: Set<Worker> = new Set();

class StorageService {
  private dbPromise: Promise<IDBPDatabase> | null = null;
  private currentMode: StorageMode = 'workspace';

  constructor() {
    this.initLifecycle();
  }

  private initLifecycle() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        if (this.currentMode === 'ephemeral') {
          this.purgeAllEphemeralData();
        }
      });
    }
  }

  private getDB(): Promise<IDBPDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_PRESETS)) {
            db.createObjectStore(STORE_PRESETS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORE_HISTORY)) {
            db.createObjectStore(STORE_HISTORY, { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
            db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
          }
        },
      });
    }
    return this.dbPromise;
  }

  public getConsent(): StorageState {
    if (typeof window === 'undefined') return { mode: 'workspace', hasConsented: false };
    const saved = localStorage.getItem('printvlc_consent');
    if (!saved) return { mode: 'workspace', hasConsented: false };
    try {
      const parsed = JSON.parse(saved);
      this.currentMode = parsed.mode;
      return { mode: parsed.mode, hasConsented: true };
    } catch {
      return { mode: 'workspace', hasConsented: false };
    }
  }

  public setConsent(mode: StorageMode) {
    this.currentMode = mode;
    if (mode === 'workspace') {
      localStorage.setItem('printvlc_consent', JSON.stringify({ mode, hasConsented: true, timestamp: Date.now() }));
    } else {
      // Ephemeral RAM-Only: Do not save to localStorage
      sessionStorage.setItem('printvlc_consent', JSON.stringify({ mode, hasConsented: true }));
      this.clearWorkspaceDB();
    }
  }

  public async savePreset(id: string, data: any) {
    if (this.currentMode === 'ephemeral') return; // Do not persist in ephemeral mode
    const db = await this.getDB();
    await db.put(STORE_PRESETS, { id, data, updatedAt: Date.now() });
  }

  public async getPreset(id: string) {
    if (this.currentMode === 'ephemeral') return null;
    const db = await this.getDB();
    return await db.get(STORE_PRESETS, id);
  }

  public async saveSetting(key: string, value: any) {
    if (this.currentMode === 'ephemeral') return;
    const db = await this.getDB();
    await db.put(STORE_SETTINGS, { key, value });
  }

  public async getSetting(key: string) {
    if (this.currentMode === 'ephemeral') return null;
    const db = await this.getDB();
    const item = await db.get(STORE_SETTINGS, key);
    return item ? item.value : null;
  }

  public registerEphemeralBlob(url: string) {
    ephemeralBlobs.add(url);
  }

  public registerEphemeralWorker(worker: Worker) {
    ephemeralWorkers.add(worker);
  }

  public purgeAllEphemeralData() {
    // Revoke all Blob URLs
    ephemeralBlobs.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Error revoking blob url', e);
      }
    });
    ephemeralBlobs.clear();

    // Terminate all Web Workers
    ephemeralWorkers.forEach((w) => {
      try {
        w.terminate();
      } catch (e) {
        console.warn('Error terminating worker', e);
      }
    });
    ephemeralWorkers.clear();

    if (this.currentMode === 'ephemeral') {
      this.clearWorkspaceDB();
    }
  }

  public async clearWorkspaceDB() {
    try {
      const db = await this.getDB();
      const tx = db.transaction([STORE_PRESETS, STORE_HISTORY, STORE_SETTINGS], 'readwrite');
      await tx.objectStore(STORE_PRESETS).clear();
      await tx.objectStore(STORE_HISTORY).clear();
      await tx.objectStore(STORE_SETTINGS).clear();
      await tx.done;
    } catch (e) {
      console.warn('Error clearing IndexedDB:', e);
    }
  }
}

export const storageService = new StorageService();
