import { type DBSchema, type IDBPDatabase, openDB } from "idb";

export type VisitRecord = Required<chrome.history.HistoryItem>;
export interface DeletionRecord {
  deleteTime: number;
  type: "auto" | "manual";
}

interface HistoryDB extends DBSchema {
  visit: {
    key: string;
    value: VisitRecord;
    indexes: {
      "by-url": string;
    };
  };
  deletion: {
    key: number;
    value: DeletionRecord;
    indexes: {
      "by-type": "auto" | "manual";
    };
  };
}

// Singleton mode, caches IndexedDB instances to prevent frequent opening of IndexedDB.
let historyDB: IDBPDatabase<HistoryDB> | null = null;
async function getHistoryDB() {
  historyDB ??= await openDB<HistoryDB>("history-db", 1, {
    upgrade(db) {
      const visitStore = db.createObjectStore("visit", {
        keyPath: "id",
      });
      visitStore.createIndex("by-url", "url");

      const deletionStore = db.createObjectStore("deletion", {
        keyPath: "deleteTime",
      });
      deletionStore.createIndex("by-type", "type");
    },
  });

  return historyDB;
}

export async function putVisit(visitRecord: VisitRecord) {
  const db = await getHistoryDB();
  const tx = db.transaction("visit", "readwrite");
  const store = tx.store;
  await store.put(visitRecord);
  await tx.done;
}

export async function removeVisitByUrl(url: string) {
  const db = await getHistoryDB();
  const tx = db.transaction("visit", "readwrite");
  const store = tx.store;
  const index = store.index("by-url");
  let cursor = await index.openCursor(IDBKeyRange.only(url));
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

export async function addDeletion(deletionRecord: DeletionRecord) {
  const db = await getHistoryDB();
  const tx = db.transaction("deletion", "readwrite");
  const store = tx.store;
  await store.add(deletionRecord);
  await tx.done;
}
