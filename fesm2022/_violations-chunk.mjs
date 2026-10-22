import { createComputed, SIGNAL, createSignal, createLinkedSignal, linkedSignalUpdateFn, linkedSignalSetFn } from '@angular/core/primitives/signals';
import { signal as signal$1 } from '@angular/core';

function convertGetterSetterToWritableSignalLike(getter, setter) {
  return Object.assign(getter, {
    set: setter,
    update: updateCallback => setter(updateCallback(getter())),
    asReadonly: () => getter
  });
}
function computed(computation) {
  const computed = createComputed(computation);
  computed[SIGNAL].debugName = '';
  return computed;
}
function signal(initialValue) {
  const [get, set, update] = createSignal(initialValue);
  get[SIGNAL].debugName = '';
  return Object.assign(get, {
    set,
    update,
    asReadonly: () => get
  });
}
function linkedSignal(sourceFn) {
  const getter = createLinkedSignal(sourceFn, s => s);
  getter[SIGNAL].debugName = '';
  return Object.assign(getter, {
    set: v => linkedSignalSetFn(getter[SIGNAL], v),
    update: updater => linkedSignalUpdateFn(getter[SIGNAL], updater),
    asReadonly: () => getter
  });
}

function sortDirectives(a, b) {
  return (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}

class SortedCollection {
  _items = new Set();
  _sortedItems = signal$1([]);
  _observer;
  orderedItems = this._sortedItems.asReadonly();
  register(item) {
    if (!this._items.has(item)) {
      this._items.add(item);
      this._sortedItems.set(this._getSortedItems());
    }
  }
  unregister(item) {
    if (this._items.has(item)) {
      this._items.delete(item);
      this._sortedItems.set(this._getSortedItems());
    }
  }
  startObserving(element) {
    this.stopObserving();
    this._observer = new MutationObserver(mutations => {
      const hasStructuralChange = mutations.some(m => m.addedNodes.length || m.removedNodes.length);
      if (hasStructuralChange) {
        const newItems = this._getSortedItems();
        const currentItems = this._sortedItems();
        const hasChanged = newItems.length !== currentItems.length || newItems.some((item, index) => currentItems[index] !== item);
        if (hasChanged) {
          this._sortedItems.set(newItems);
        }
      }
    });
    this._observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: false
    });
  }
  stopObserving() {
    this._observer?.disconnect();
    this._observer = undefined;
  }
  _getSortedItems() {
    return Array.from(this._items).sort(sortDirectives);
  }
}

function reportViolations(violations, element) {
  if (violations.length) {
    console.warn('Violations found on element: %o:', element);
    violations.forEach(violation => {
      console.warn(violation);
    });
  }
}

export { SortedCollection, computed, convertGetterSetterToWritableSignalLike, linkedSignal, reportViolations, signal, sortDirectives };
//# sourceMappingURL=_violations-chunk.mjs.map
