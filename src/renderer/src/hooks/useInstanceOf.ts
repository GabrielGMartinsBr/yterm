import { useRef } from 'react';

interface Constructor<T> {
    new(a?: any): T;
}

export default function useInstanceOf<T>(constructor: Constructor<T>) {
    const ref = useRef<T | null>(null);
    if (ref.current === null) {
        ref.current = new constructor();
    }
    return ref.current;
}
