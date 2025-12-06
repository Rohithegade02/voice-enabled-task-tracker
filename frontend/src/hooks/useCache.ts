import { useRef } from 'react';

export function useCache<T>() {
    const cache = useRef(new Map<string, T>());

    return {
        get: (key: string) => cache.current.get(key),
        set: (key: string, value: T) => cache.current.set(key, value),
        has: (key: string) => cache.current.has(key),
        clear: () => cache.current.clear(),
        delete: (key: string) => cache.current.delete(key),
    };
}
