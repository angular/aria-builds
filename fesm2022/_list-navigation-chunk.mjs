import { signal, computed } from './_signal-like-chunk.mjs';

class ListFocus {
  inputs;
  prevActiveItem = signal(undefined);
  prevActiveIndex = computed(() => {
    return this.prevActiveItem() ? this.inputs.items().indexOf(this.prevActiveItem()) : -1;
  });
  activeIndex = computed(() => {
    return this.inputs.activeItem() ? this.inputs.items().indexOf(this.inputs.activeItem()) : -1;
  });
  constructor(inputs) {
    this.inputs = inputs;
  }
  isListDisabled() {
    return this.inputs.disabled() || this.inputs.items().every(i => i.disabled());
  }
  getActiveDescendant() {
    if (this.isListDisabled()) {
      return undefined;
    }
    if (this.inputs.focusMode() === 'roving') {
      return undefined;
    }
    return this.inputs.activeItem()?.id() ?? undefined;
  }
  getListTabIndex() {
    if (this.isListDisabled()) {
      return 0;
    }
    return this.inputs.focusMode() === 'activedescendant' ? 0 : -1;
  }
  getItemTabIndex(item) {
    if (this.isListDisabled()) {
      return -1;
    }
    if (this.inputs.focusMode() === 'activedescendant') {
      return -1;
    }
    return this.inputs.activeItem() === item ? 0 : -1;
  }
  focus(item, opts) {
    if (this.isListDisabled() || !this.isFocusable(item)) {
      return false;
    }
    this.prevActiveItem.set(this.inputs.activeItem());
    this.inputs.activeItem.set(item);
    if (opts?.focusElement || opts?.focusElement === undefined) {
      this.inputs.focusMode() === 'roving' ? item.element()?.focus() : this.inputs.element()?.focus();
    }
    return true;
  }
  isFocusable(item) {
    return !item.disabled() || this.inputs.softDisabled();
  }
}

class ListNavigation {
  inputs;
  constructor(inputs) {
    this.inputs = inputs;
  }
  goto(item, opts) {
    return item ? this.inputs.focusManager.focus(item, opts) : false;
  }
  next(opts) {
    return this._advance(1, opts);
  }
  peekNext() {
    return this._peek(1);
  }
  prev(opts) {
    return this._advance(-1, opts);
  }
  peekPrev() {
    return this._peek(-1);
  }
  first(opts) {
    const item = this.peekFirst();
    return item ? this.goto(item, opts) : false;
  }
  last(opts) {
    const item = this.peekLast();
    return item ? this.goto(item, opts) : false;
  }
  peekFirst(items = this.inputs.items()) {
    return items.find(i => this.inputs.focusManager.isFocusable(i));
  }
  peekLast(items = this.inputs.items()) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (this.inputs.focusManager.isFocusable(items[i])) {
        return items[i];
      }
    }
    return;
  }
  _advance(delta, opts) {
    const item = this._peek(delta);
    return item ? this.goto(item, opts) : false;
  }
  _peek(delta) {
    const items = this.inputs.items();
    const itemCount = items.length;
    const startIndex = this.inputs.focusManager.activeIndex();
    const step = i => this.inputs.wrap() ? (i + delta + itemCount) % itemCount : i + delta;
    for (let i = step(startIndex); i !== startIndex && i < itemCount && i >= 0; i = step(i)) {
      if (this.inputs.focusManager.isFocusable(items[i])) {
        return items[i];
      }
    }
    return;
  }
}

export { ListFocus, ListNavigation };
//# sourceMappingURL=_list-navigation-chunk.mjs.map
