import { useRef } from 'react';
import { GenericListener, GenericListenerCb } from './utils/GenericListener';

type Key = string | number | symbol

export class RefSet4<V, K extends Key = Key> {
    private setterMap = new Map<K, (val: V) => void>();
    private valueMap = new Map<K, V>();
    private listeners = new GenericListener();

    get(k: K) {
        return this.valueMap.get(k);
    }

    getter(k: K) {
        return () => {
            return this.valueMap.get(k);
        };
    }

    set(k: K, v: V) {
        this.valueMap.set(k, v);
        this.listeners.emit();
    }

    setter<Value = V>(k: K) {
        let setter = this.setterMap.get(k);
        if (!setter) {
            setter = (v: V) => {
                this.set(k, v);
            };
            this.setterMap.set(k, setter);
        }
        return setter as unknown as (val: Value) => void;
    }

    getKeysArray() {
        const arr = Array.from(this.valueMap.keys());
        return arr;
    }

    getValuesArray() {
        const arr = Array.from(this.valueMap.values());
        return arr;
    }

    getObjectMap() {
        const obj = {} as Record<K, V>;
        this.valueMap.forEach((v, k) => {
            obj[k] = v;
        });
        return obj;
    }

    listenChanges(cb: GenericListenerCb) {
        this.listeners.add(cb);
        return () => {
            this.listeners.remove(cb);
        };
    }
}


export function useRefSet4<V, K extends Key = Key>() {
    const ref = useRef<null | RefSet4<V, K>>(null);
    if (ref.current === null) {
        ref.current = new RefSet4();
    }
    return ref.current;
}