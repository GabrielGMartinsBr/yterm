import { useRef } from 'react';

export default function useRefObject<T>(obj: T) {
    const ref = useRef(obj);
    return ref.current;
}