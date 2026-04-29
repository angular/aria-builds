import { Signal } from '@angular/core';
import { HasElement } from './_element-chunk.js';

/**
 * A collection that lazily sorts its items based on their DOM position.
 * It uses manual registration and updates its order when items are added/removed
 * or when structural DOM changes are detected via MutationObserver.
 *
 * TODO(ok7sai): replace Mutation Observer with internal API.
 */
declare class SortedCollection<T extends HasElement> {
    private readonly _items;
    private readonly _version;
    private _observer?;
    readonly orderedItems: Signal<T[]>;
    register(item: T): void;
    unregister(item: T): void;
    startObserving(element: HTMLElement): void;
    stopObserving(): void;
}

export { SortedCollection };
