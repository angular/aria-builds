import { signal, computed } from '@angular/core';

function sortDirectives(a, b) {
  return (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}

class SortedCollection {
  _items = signal(new Set());
  _version = signal(0);
  _observer;
  orderedItems = computed(() => {
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

export { SortedCollection, sortDirectives };
//# sourceMappingURL=_collection-chunk.mjs.map
