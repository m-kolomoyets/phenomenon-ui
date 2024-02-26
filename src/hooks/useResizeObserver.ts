import { type RefObject, useEffect } from 'react';
import { useSyncedRef } from './useSyncedRef';

export type UseResizeObserverCallback = (entry: ResizeObserverEntry) => void;

type ResizeObserverSingleton = {
    observer: ResizeObserver;
    subscribe: (target: Element, callback: UseResizeObserverCallback) => void;
    unsubscribe: (target: Element, callback: UseResizeObserverCallback) => void;
};

let observerSingleton: ResizeObserverSingleton;

const getResizeObserver = (): ResizeObserverSingleton | undefined => {
    if (observerSingleton) return observerSingleton;

    const callbacks = new Map<Element, Set<UseResizeObserverCallback>>();

    const observer = new ResizeObserver((entries) => {
        for (const entry of entries)
            callbacks.get(entry.target)?.forEach((cb) => {
                return setTimeout(() => {
                    cb(entry);
                }, 0);
            });
    });

    observerSingleton = {
        observer,
        subscribe(target, callback) {
            let cbs = callbacks.get(target);

            if (!cbs) {
                cbs = new Set<UseResizeObserverCallback>();
                callbacks.set(target, cbs);
                observer.observe(target);
            }

            cbs.add(callback);
        },
        unsubscribe(target, callback) {
            const cbs = callbacks.get(target);

            if (cbs) {
                cbs.delete(callback);

                if (cbs.size === 0) {
                    callbacks.delete(target);
                    observer.unobserve(target);
                }
            }
        },
    };

    return observerSingleton;
};

export const useResizeObserver = <T extends Element>(
    target: RefObject<T> | T | null,
    callback: UseResizeObserverCallback,
    enabled = true
): void => {
    const ro = enabled && getResizeObserver();
    const cb = useSyncedRef(callback);

    const tgt = target && 'current' in target ? target.current : target;

    useEffect(() => {
        const tgt = target && 'current' in target ? target.current : target;

        if (!ro || !tgt) return;

        let subscribed = true;

        const handler: UseResizeObserverCallback = (...args) => {
            if (subscribed) {
                cb.current(...args);
            }
        };

        ro.subscribe(tgt, handler);

        return () => {
            subscribed = false;
            ro.unsubscribe(tgt, handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tgt, ro]);
};
