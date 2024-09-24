import { useRef, useCallback, useEffect } from 'react';
import { Md5 } from 'ts-md5';
const getHashStr = (key: string) => {
  return Md5.hashStr(key).replace(/[0-9]/g, '');
};
export const useIndexedDb = <T extends any>(
  database: string,
  tableName: string,
  _key: string
) => {
  const db = useRef<IDBDatabase>();

  const getDb = useCallback(() => {
    if (!db.current) throw Error;
    return db.current;
  }, [db]);

  useEffect(() => {
    const rq = indexedDB.open(database);
    rq.onupgradeneeded = (ev) => {
      const key = getHashStr(_key);
      const db = rq.result;
      const os = db.createObjectStore(tableName);
      os.createIndex(key, key, { unique: true });
    };
    rq.onsuccess = () => {
      db.current = rq.result;
    };
  }, []);
  const create = (key: string, data: T) => {
    key = getHashStr(key);
    return new Promise<void>((res, rej) => {
      const trs = getDb().transaction([tableName], 'readwrite');
      const os = trs.objectStore(tableName);
      os.add({ key, data }, key);
      trs.oncomplete = () => {
        res();
      };
    });
  };
  const get = (key: string) => {
    key = getHashStr(key);
    return new Promise<T | undefined>((res, rej) => {
      const trs = getDb().transaction([tableName], 'readonly');
      const os = trs.objectStore(tableName);
      const req = os.getAll(key);
      req.onsuccess = () => {
        const result = req.result[0];
        if (!result) {
          res(undefined);
        } else {
          res(result.data);
        }
      };
    });
  };
  return { create, get };
};
