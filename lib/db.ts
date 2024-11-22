import { type DBSchema, type IDBPDatabase, openDB } from "idb";

export type HistoryItem = Required<chrome.history.HistoryItem>;

interface HistoryDB extends DBSchema {
  history: {
    key: string;
    value: HistoryItem;
    indexes: {
      "by-last-visit-time": number;
      "by-url": string;
    };
  };
}
// Singleton mode, caches IndexedDB instances to prevent frequent opening of IndexedDB.
let db: IDBPDatabase<HistoryDB> | null = null;
async function getHistoryDB() {
  db ??= await openDB<HistoryDB>("history-db", 1, {
    upgrade(db) {
      const historyStore = db.createObjectStore("history", {
        keyPath: "id",
      });
      historyStore.createIndex("by-last-visit-time", "lastVisitTime");
      historyStore.createIndex("by-url", "url");
    },
  });

  return db;
}

export async function putHistoryItem(historyItem: HistoryItem) {
  const db = await getHistoryDB();
  const tx = db.transaction("history", "readwrite");
  const store = tx.store;
  await store.put(historyItem);
  await tx.done;
}
