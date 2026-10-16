import { createComputed, SIGNAL, createSignal, createLinkedSignal, linkedSignalUpdateFn, linkedSignalSetFn } from '@angular/core/primitives/signals';
import { signal as signal$1, computed as computed$1 } from '@angular/core';

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
  _items = signal$1(new Set());
  _version = signal$1(0);
  _observer;
  orderedItems = computed$1(() => {
    this._version();
    const itemsArray = Array.from(this._items());
    return itemsArray.sort(sortDirectives);
  });
  register(item) {
    this._items.update(set => {
      const newSet = new Set(set);
      newSet.add(item);
      return newSet;
    });
  }
  unregister(item) {
    this._items.update(set => {
      const newSet = new Set(set);
      newSet.delete(item);
      return newSet;
    });
  }
  startObserving(element) {
    if (this._observer) {
      this._observer.disconnect();
    }
    this._observer = new MutationObserver(mutations => {
      const hasStructuralChange = mutations.some(m => m.addedNodes.length || m.removedNodes.length);
      if (hasStructuralChange) {
        this._version.update(v => v + 1);
      }
    });
    this._observer.observe(element, {
      childList: true,
      subtree: true
    });
  }
  stopObserving() {
    this._observer?.disconnect();
    this._observer = undefined;
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
