import { useRef } from 'react';
import { GenericListener, GenericListenerCb } from './utils/GenericListener';

interface Constructable<T> {
    new(...args: any[]): T;
}

type ClassConstructor<T> = new (...args: any[]) => T;

type IRefSet3<T> = T & {
    get<K extends keyof T>(k: K): T[K];
    getter<K extends keyof T>(k: K): () => T[K];
    set<K extends keyof T>(k: K, val: T[K]): void;
    setter<K extends keyof T>(k: K): (val: T[K]) => void;
    listenChanges(cb: GenericListenerCb): () => void;
}

function createRefSet<T>(constructor: Constructable<T>) {
    type RefVal = any;

    class RefSet3<T> extends (constructor as Constructable<RefVal>) {
        private setterMap = new Map<keyof T, any>();
        private listeners = new GenericListener();

        constructor(...args: any[]) {
            super(...args);
        }

        get<K extends keyof T>(k: K) {
            const desc = Object.getOwnPropertyDescriptor(this, k);
            return desc?.value as T[K];
        }

        getter<K extends keyof T>(k: K) {
            return () => {
                const desc = Object.getOwnPropertyDescriptor(this, k);
                return desc?.value as T[K];
            };
        }

        set<K extends keyof T>(k: K, v: T[K]) {
            this[k as any] = v;
            this.listeners.emit();
        }

        setter<K extends keyof T>(k: K) {
            let setter = this.setterMap.get(k);
            if (!setter) {
                setter = (v: T[K]) => {
                    const desc = Object.getOwnPropertyDescriptor(this, k);
                    if (desc && desc.writable) {
                        this.set(k, v);
                    }
                };
                this.setterMap.set(k, setter);
            }
            return setter;
        }

        listenChanges(cb: GenericListenerCb) {
            this.listeners.add(cb);
            return () => {
                this.listeners.remove(cb);
            };
        }
    }

    return new RefSet3() as RefSet3<T> & T;
}

export type RefSet3<T> = IRefSet3<T>;

export function useRefSet3<T>(constructor: ClassConstructor<T>) {
    const ref = useRef<null | RefSet3<T>>(null);
    if (ref.current === null) {
        ref.current = createRefSet(constructor);
    }
    return ref.current;
}