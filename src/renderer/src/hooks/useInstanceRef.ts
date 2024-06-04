import { useEffect, useMemo, useRef } from 'react';

export interface OnInit {
    onInit(): void;
}

export interface OnDestroy {
    onDestroy(): void;
}

type Constructable<T> = new (...args: any[]) => T;

export function useInstanceRef<T>(
    constructor: Constructable<T>,
    deps?: any
) {
    type Instance = T & Partial<OnInit & OnDestroy>

    const ref = useRef<any>(null);

    if (ref.current === null) {
        ref.current = new constructor();
    }

    useEffect(() => {
        ref.current = new constructor();
        if (ref.current?.onInit) {
            ref.current.onInit();
        }
        return () => {
            if (ref.current?.onDestroy) {
                ref.current.onDestroy();
            }
        };
    }, deps);

    return useMemo(() => () => ref.current as Instance, []);
}
