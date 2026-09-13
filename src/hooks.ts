import { useEffect, useState } from 'react';

export function useIsMobile(bp = 720) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < bp : false));
  useEffect(() => {
    const on = () => setM(window.innerWidth < bp);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [bp]);
  return m;
}

export function useLocal<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const set = (nv: T | ((p: T) => T)) => {
    setV((p) => {
      const next = typeof nv === 'function' ? (nv as (p: T) => T)(p) : nv;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* sem storage */
      }
      return next;
    });
  };
  return [v, set];
}
