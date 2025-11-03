import * as i0 from '@angular/core';
import { signal, computed, model, Directive, inject, TemplateRef, ViewContainerRef, afterRenderEffect } from '@angular/core';
import { KeyboardEventManager, PointerEventManager, Modifier } from './_widget-chunk.mjs';
export { GridCellPattern, GridCellWidgetPattern, GridPattern, GridRowPattern } from './_widget-chunk.mjs';

class ComboboxPattern {
  inputs;
  expanded = signal(false);
  activedescendant = computed(() => this.inputs.popupControls()?.activeId() ?? null);
  highlightedItem = signal(undefined);
  isDeleting = false;
  isFocused = signal(false);
  expandKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
  collapseKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
  popupId = computed(() => this.inputs.popupControls()?.id() || null);
  autocomplete = computed(() => this.inputs.filterMode() === 'highlight' ? 'both' : 'list');
  hasPopup = computed(() => this.inputs.popupControls()?.role() || null);
  isInteractive = computed(() => !this.inputs.disabled() && !this.inputs.readonly());
  keydown = computed(() => {
    if (!this.expanded()) {
      return new KeyboardEventManager().on('ArrowDown', () => this.open({
        first: true
      })).on('ArrowUp', () => this.open({
        last: true
      }));
    }
    const popupControls = this.inputs.popupControls();
    if (!popupControls) {
      return new KeyboardEventManager();
    }
    const manager = new KeyboardEventManager().on('ArrowDown', () => this.next()).on('ArrowUp', () => this.prev()).on('Home', () => this.first()).on('End', () => this.last()).on('Escape', () => {
      if (this.inputs.filterMode() === 'highlight' && popupControls.activeId()) {
        popupControls.unfocus();
        popupControls.clearSelection();
        const inputEl = this.inputs.inputEl();
        if (inputEl) {
          inputEl.value = this.inputs.inputValue();
        }
      } else {
        this.close();
        this.inputs.popupControls()?.clearSelection();
      }
    }).on('Enter', () => this.select({
      commit: true,
      close: true
    }));
    if (popupControls.role() === 'tree') {
      const treeControls = popupControls;
      if (treeControls.isItemExpandable() || treeControls.isItemCollapsible()) {
        manager.on(this.collapseKey(), () => this.collapseItem());
      }
      if (treeControls.isItemExpandable()) {
        manager.on(this.expandKey(), () => this.expandItem());
      }
    }
    return manager;
  });
  pointerup = computed(() => new PointerEventManager().on(e => {
    const item = this.inputs.popupControls()?.getItem(e);
    if (item) {
      this.select({
        item,
        commit: true,
        close: true
      });
      this.inputs.inputEl()?.focus();
    }
    if (e.target === this.inputs.inputEl()) {
      this.open();
    }
  }));
  constructor(inputs) {
    this.inputs = inputs;
  }
  onKeydown(event) {
    if (this.isInteractive()) {
      this.keydown().handle(event);
    }
  }
  onPointerup(event) {
    if (this.isInteractive()) {
      this.pointerup().handle(event);
    }
  }
  onInput(event) {
    if (!this.isInteractive()) {
      return;
    }
    const inputEl = this.inputs.inputEl();
    if (!inputEl) {
      return;
    }
    this.open();
    this.inputs.inputValue?.set(inputEl.value);
    this.isDeleting = event instanceof InputEvent && !!event.inputType.match(/^delete/);
    if (this.inputs.filterMode() === 'manual') {
      const searchTerm = this.inputs.popupControls()?.getSelectedItem()?.searchTerm();
      if (searchTerm && this.inputs.inputValue() !== searchTerm) {
        this.inputs.popupControls()?.clearSelection();
      }
    }
  }
  onFocusIn() {
    this.isFocused.set(true);
  }
  onFocusOut(event) {
    if (this.inputs.disabled() || this.inputs.readonly()) {
      return;
    }
    if (!(event.relatedTarget instanceof HTMLElement) || !this.inputs.containerEl()?.contains(event.relatedTarget)) {
      this.isFocused.set(false);
      if (this.inputs.filterMode() !== 'manual') {
        this.commit();
      } else {
        const item = this.inputs.popupControls()?.items().find(i => i.searchTerm() === this.inputs.inputEl()?.value);
        if (item) {
          this.select({
            item
          });
        }
      }
      this.close();
    }
  }
  firstMatch = computed(() => {
    if (this.inputs.popupControls()?.role() === 'listbox') {
      return this.inputs.popupControls()?.items()[0];
    }
    return this.inputs.popupControls()?.items().find(i => i.value() === this.inputs.firstMatch());
  });
  onFilter() {
    const isInitialRender = !this.inputs.inputValue?.().length && !this.isDeleting;
    if (isInitialRender) {
      return;
    }
    if (!this.isFocused()) {
      return;
    }
    if (this.inputs.popupControls()?.role() === 'tree') {
      const treeControls = this.inputs.popupControls();
      this.inputs.inputValue?.().length ? treeControls.expandAll() : treeControls.collapseAll();
    }
    const item = this.firstMatch();
    if (!item) {
      this.inputs.popupControls()?.clearSelection();
      this.inputs.popupControls()?.unfocus();
      return;
    }
    this.inputs.popupControls()?.focus(item);
    if (this.inputs.filterMode() !== 'manual') {
      this.select({
        item
      });
    }
    if (this.inputs.filterMode() === 'highlight' && !this.isDeleting) {
      this.highlight();
    }
  }
  highlight() {
    const inputEl = this.inputs.inputEl();
    const item = this.inputs.popupControls()?.getSelectedItem();
    if (!inputEl || !item) {
      return;
    }
    const isHighlightable = item.searchTerm().toLowerCase().startsWith(this.inputs.inputValue().toLowerCase());
    if (isHighlightable) {
      inputEl.value = this.inputs.inputValue() + item.searchTerm().slice(this.inputs.inputValue().length);
      inputEl.setSelectionRange(this.inputs.inputValue().length, item.searchTerm().length);
      this.highlightedItem.set(item);
    }
  }
  close() {
    this.expanded.set(false);
    this.inputs.popupControls()?.unfocus();
  }
  open(nav) {
    this.expanded.set(true);
    if (nav?.first) {
      this.first();
    }
    if (nav?.last) {
      this.last();
    }
  }
  next() {
    this._navigate(() => this.inputs.popupControls()?.next());
  }
  prev() {
    this._navigate(() => this.inputs.popupControls()?.prev());
  }
  first() {
    this._navigate(() => this.inputs.popupControls()?.first());
  }
  last() {
    this._navigate(() => this.inputs.popupControls()?.last());
  }
  collapseItem() {
    const controls = this.inputs.popupControls();
    this._navigate(() => controls?.collapseItem());
  }
  expandItem() {
    const controls = this.inputs.popupControls();
    this._navigate(() => controls?.expandItem());
  }
  select(opts = {}) {
    this.inputs.popupControls()?.select(opts.item);
    if (opts.commit) {
      this.commit();
    }
    if (opts.close) {
      this.close();
    }
  }
  commit() {
    const inputEl = this.inputs.inputEl();
    const item = this.inputs.popupControls()?.getSelectedItem();
    if (inputEl && item) {
      inputEl.value = item.searchTerm();
      this.inputs.inputValue?.set(item.searchTerm());
      if (this.inputs.filterMode() === 'highlight') {
        const length = inputEl.value.length;
        inputEl.setSelectionRange(length, length);
      }
    }
  }
  _navigate(operation) {
    operation();
    if (this.inputs.filterMode() !== 'manual') {
      this.select();
    }
    if (this.inputs.filterMode() === 'highlight') {
      const selectedItem = this.inputs.popupControls()?.getSelectedItem();
      if (!selectedItem) {
        return;
      }
      if (selectedItem === this.highlightedItem()) {
        this.highlight();
      } else {
        const inputEl = this.inputs.inputEl();
        inputEl.value = selectedItem?.searchTerm();
      }
    }
  }
}

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
  getListTabindex() {
    if (this.isListDisabled()) {
      return 0;
    }
    return this.inputs.focusMode() === 'activedescendant' ? 0 : -1;
  }
  getItemTabindex(item) {
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
      this.inputs.focusMode() === 'roving' ? item.element().focus() : this.inputs.element()?.focus();
    }
    return true;
  }
  isFocusable(item) {
    return !item.disabled() || !this.inputs.skipDisabled();
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
    const item = this.inputs.items().find(i => this.inputs.focusManager.isFocusable(i));
    return item ? this.goto(item, opts) : false;
  }
  last(opts) {
    const items = this.inputs.items();
    for (let i = items.length - 1; i >= 0; i--) {
      if (this.inputs.focusManager.isFocusable(items[i])) {
        return this.goto(items[i], opts);
      }
    }
    return false;
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

class ListSelection {
  inputs;
  rangeStartIndex = signal(0);
  rangeEndIndex = signal(0);
  selectedItems = computed(() => this.inputs.items().filter(item => this.inputs.value().includes(item.value())));
  constructor(inputs) {
    this.inputs = inputs;
  }
  select(item, opts = {
    anchor: true
  }) {
    item = item ?? this.inputs.focusManager.inputs.activeItem();
    if (!item || item.disabled() || !item.selectable() || this.inputs.value().includes(item.value())) {
      return;
    }
    if (!this.inputs.multi()) {
      this.deselectAll();
    }
    const index = this.inputs.items().findIndex(i => i === item);
    if (opts.anchor) {
      this.beginRangeSelection(index);
    }
    this.inputs.value.update(values => values.concat(item.value()));
  }
  deselect(item) {
    item = item ?? this.inputs.focusManager.inputs.activeItem();
    if (item && !item.disabled() && item.selectable()) {
      this.inputs.value.update(values => values.filter(value => value !== item.value()));
    }
  }
  toggle() {
    const item = this.inputs.focusManager.inputs.activeItem();
    if (item) {
      this.inputs.value().includes(item.value()) ? this.deselect() : this.select();
    }
  }
  toggleOne() {
    const item = this.inputs.focusManager.inputs.activeItem();
    if (item) {
      this.inputs.value().includes(item.value()) ? this.deselect() : this.selectOne();
    }
  }
  selectAll() {
    if (!this.inputs.multi()) {
      return;
    }
    for (const item of this.inputs.items()) {
      this.select(item, {
        anchor: false
      });
    }
    this.beginRangeSelection();
  }
  deselectAll() {
    for (const value of this.inputs.value()) {
      const item = this.inputs.items().find(i => i.value() === value);
      item ? this.deselect(item) : this.inputs.value.update(values => values.filter(v => v !== value));
    }
  }
  toggleAll() {
    const selectableValues = this.inputs.items().filter(i => !i.disabled() && i.selectable()).map(i => i.value());
    selectableValues.every(i => this.inputs.value().includes(i)) ? this.deselectAll() : this.selectAll();
  }
  selectOne() {
    const item = this.inputs.focusManager.inputs.activeItem();
    if (item && (item.disabled() || !item.selectable())) {
      return;
    }
    this.deselectAll();
    if (this.inputs.value().length > 0 && !this.inputs.multi()) {
      return;
    }
    this.select();
  }
  selectRange(opts = {
    anchor: true
  }) {
    const isStartOfRange = this.inputs.focusManager.prevActiveIndex() === this.rangeStartIndex();
    if (isStartOfRange && opts.anchor) {
      this.beginRangeSelection(this.inputs.focusManager.prevActiveIndex());
    }
    const itemsInRange = this._getItemsFromIndex(this.rangeStartIndex());
    const itemsOutOfRange = this._getItemsFromIndex(this.rangeEndIndex()).filter(i => !itemsInRange.includes(i));
    for (const item of itemsOutOfRange) {
      this.deselect(item);
    }
    for (const item of itemsInRange) {
      this.select(item, {
        anchor: false
      });
    }
    if (itemsInRange.length) {
      const item = itemsInRange.pop();
      const index = this.inputs.items().findIndex(i => i === item);
      this.rangeEndIndex.set(index);
    }
  }
  beginRangeSelection(index = this.inputs.focusManager.activeIndex()) {
    this.rangeStartIndex.set(index);
    this.rangeEndIndex.set(index);
  }
  _getItemsFromIndex(index) {
    if (index === -1) {
      return [];
    }
    const upper = Math.max(this.inputs.focusManager.activeIndex(), index);
    const lower = Math.min(this.inputs.focusManager.activeIndex(), index);
    const items = [];
    for (let i = lower; i <= upper; i++) {
      items.push(this.inputs.items()[i]);
    }
    if (this.inputs.focusManager.activeIndex() < index) {
      return items.reverse();
    }
    return items;
  }
}

class ListTypeahead {
  inputs;
  timeout;
  focusManager;
  isTyping = computed(() => this._query().length > 0);
  _query = signal('');
  _startIndex = signal(undefined);
  constructor(inputs) {
    this.inputs = inputs;
    this.focusManager = inputs.focusManager;
  }
  search(char) {
    if (char.length !== 1) {
      return false;
    }
    if (!this.isTyping() && char === ' ') {
      return false;
    }
    if (this._startIndex() === undefined) {
      this._startIndex.set(this.focusManager.activeIndex());
    }
    clearTimeout(this.timeout);
    this._query.update(q => q + char.toLowerCase());
    const item = this._getItem();
    if (item) {
      this.focusManager.focus(item);
    }
    this.timeout = setTimeout(() => {
      this._query.set('');
      this._startIndex.set(undefined);
    }, this.inputs.typeaheadDelay() * 1000);
    return true;
  }
  _getItem() {
    let items = this.focusManager.inputs.items();
    const after = items.slice(this._startIndex() + 1);
    const before = items.slice(0, this._startIndex());
    items = after.concat(before);
    items.push(this.inputs.items()[this._startIndex()]);
    const focusableItems = [];
    for (const item of items) {
      if (this.focusManager.isFocusable(item)) {
        focusableItems.push(item);
      }
    }
    return focusableItems.find(i => i.searchTerm().toLowerCase().startsWith(this._query()));
  }
}

class List {
  inputs;
  navigationBehavior;
  selectionBehavior;
  typeaheadBehavior;
  focusBehavior;
  disabled = computed(() => this.focusBehavior.isListDisabled());
  activedescendant = computed(() => this.focusBehavior.getActiveDescendant());
  tabindex = computed(() => this.focusBehavior.getListTabindex());
  activeIndex = computed(() => this.focusBehavior.activeIndex());
  _anchorIndex = signal(0);
  _wrap = signal(true);
  constructor(inputs) {
    this.inputs = inputs;
    this.focusBehavior = new ListFocus(inputs);
    this.selectionBehavior = new ListSelection({
      ...inputs,
      focusManager: this.focusBehavior
    });
    this.typeaheadBehavior = new ListTypeahead({
      ...inputs,
      focusManager: this.focusBehavior
    });
    this.navigationBehavior = new ListNavigation({
      ...inputs,
      focusManager: this.focusBehavior,
      wrap: computed(() => this._wrap() && this.inputs.wrap())
    });
  }
  getItemTabindex(item) {
    return this.focusBehavior.getItemTabindex(item);
  }
  first(opts) {
    this._navigate(opts, () => this.navigationBehavior.first(opts));
  }
  last(opts) {
    this._navigate(opts, () => this.navigationBehavior.last(opts));
  }
  next(opts) {
    this._navigate(opts, () => this.navigationBehavior.next(opts));
  }
  prev(opts) {
    this._navigate(opts, () => this.navigationBehavior.prev(opts));
  }
  goto(item, opts) {
    this._navigate(opts, () => this.navigationBehavior.goto(item, opts));
  }
  unfocus() {
    this.inputs.activeItem.set(undefined);
  }
  anchor(index) {
    this._anchorIndex.set(index);
  }
  search(char, opts) {
    this._navigate(opts, () => this.typeaheadBehavior.search(char));
  }
  isTyping() {
    return this.typeaheadBehavior.isTyping();
  }
  select(item) {
    this.selectionBehavior.select(item);
  }
  selectOne() {
    this.selectionBehavior.selectOne();
  }
  deselect() {
    this.selectionBehavior.deselect();
  }
  deselectAll() {
    this.selectionBehavior.deselectAll();
  }
  toggle() {
    this.selectionBehavior.toggle();
  }
  toggleOne() {
    this.selectionBehavior.toggleOne();
  }
  toggleAll() {
    this.selectionBehavior.toggleAll();
  }
  isFocusable(item) {
    return this.focusBehavior.isFocusable(item);
  }
  updateSelection(opts = {
    anchor: true
  }) {
    if (opts.toggle) {
      this.selectionBehavior.toggle();
    }
    if (opts.select) {
      this.selectionBehavior.select();
    }
    if (opts.selectOne) {
      this.selectionBehavior.selectOne();
    }
    if (opts.selectRange) {
      this.selectionBehavior.selectRange();
    }
    if (!opts.anchor) {
      this.anchor(this.selectionBehavior.rangeStartIndex());
    }
  }
  _navigate(opts = {}, operation) {
    if (opts?.selectRange) {
      this._wrap.set(false);
      this.selectionBehavior.rangeStartIndex.set(this._anchorIndex());
    }
    const moved = operation();
    if (moved) {
      this.updateSelection(opts);
    }
    this._wrap.set(true);
  }
}

class ListboxPattern {
  inputs;
  listBehavior;
  orientation;
  disabled = computed(() => this.listBehavior.disabled());
  readonly;
  tabindex = computed(() => this.listBehavior.tabindex());
  activedescendant = computed(() => this.listBehavior.activedescendant());
  multi;
  setsize = computed(() => this.inputs.items().length);
  followFocus = computed(() => this.inputs.selectionMode() === 'follow');
  wrap = signal(true);
  prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  dynamicSpaceKey = computed(() => this.listBehavior.isTyping() ? '' : ' ');
  typeaheadRegexp = /^.$/;
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    if (this.readonly()) {
      return manager.on(this.prevKey, () => this.listBehavior.prev()).on(this.nextKey, () => this.listBehavior.next()).on('Home', () => this.listBehavior.first()).on('End', () => this.listBehavior.last()).on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
    }
    if (!this.followFocus()) {
      manager.on(this.prevKey, () => this.listBehavior.prev()).on(this.nextKey, () => this.listBehavior.next()).on('Home', () => this.listBehavior.first()).on('End', () => this.listBehavior.last()).on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
    }
    if (this.followFocus()) {
      manager.on(this.prevKey, () => this.listBehavior.prev({
        selectOne: true
      })).on(this.nextKey, () => this.listBehavior.next({
        selectOne: true
      })).on('Home', () => this.listBehavior.first({
        selectOne: true
      })).on('End', () => this.listBehavior.last({
        selectOne: true
      })).on(this.typeaheadRegexp, e => this.listBehavior.search(e.key, {
        selectOne: true
      }));
    }
    if (this.inputs.multi()) {
      manager.on(Modifier.Any, 'Shift', () => this.listBehavior.anchor(this.listBehavior.activeIndex())).on(Modifier.Shift, this.prevKey, () => this.listBehavior.prev({
        selectRange: true
      })).on(Modifier.Shift, this.nextKey, () => this.listBehavior.next({
        selectRange: true
      })).on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'Home', () => this.listBehavior.first({
        selectRange: true,
        anchor: false
      })).on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'End', () => this.listBehavior.last({
        selectRange: true,
        anchor: false
      })).on(Modifier.Shift, 'Enter', () => this.listBehavior.updateSelection({
        selectRange: true,
        anchor: false
      })).on(Modifier.Shift, this.dynamicSpaceKey, () => this.listBehavior.updateSelection({
        selectRange: true,
        anchor: false
      }));
    }
    if (!this.followFocus() && this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => this.listBehavior.toggle()).on('Enter', () => this.listBehavior.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'A', () => this.listBehavior.toggleAll());
    }
    if (!this.followFocus() && !this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => this.listBehavior.toggleOne());
      manager.on('Enter', () => this.listBehavior.toggleOne());
    }
    if (this.inputs.multi() && this.followFocus()) {
      manager.on([Modifier.Ctrl, Modifier.Meta], this.prevKey, () => this.listBehavior.prev()).on([Modifier.Ctrl, Modifier.Meta], this.nextKey, () => this.listBehavior.next()).on([Modifier.Ctrl, Modifier.Meta], ' ', () => this.listBehavior.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'Enter', () => this.listBehavior.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'Home', () => this.listBehavior.first()).on([Modifier.Ctrl, Modifier.Meta], 'End', () => this.listBehavior.last()).on([Modifier.Ctrl, Modifier.Meta], 'A', () => {
        this.listBehavior.toggleAll();
        this.listBehavior.select();
      });
    }
    return manager;
  });
  pointerdown = computed(() => {
    const manager = new PointerEventManager();
    if (this.readonly()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e)));
    }
    if (this.multi()) {
      manager.on(Modifier.Shift, e => this.listBehavior.goto(this._getItem(e), {
        selectRange: true
      }));
    }
    if (!this.multi() && this.followFocus()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e), {
        selectOne: true
      }));
    }
    if (!this.multi() && !this.followFocus()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e), {
        toggle: true
      }));
    }
    if (this.multi() && this.followFocus()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e), {
        selectOne: true
      })).on(Modifier.Ctrl, e => this.listBehavior.goto(this._getItem(e), {
        toggle: true
      }));
    }
    if (this.multi() && !this.followFocus()) {
      return manager.on(e => this.listBehavior.goto(this._getItem(e), {
        toggle: true
      }));
    }
    return manager;
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.readonly = inputs.readonly;
    this.orientation = inputs.orientation;
    this.multi = inputs.multi;
    this.listBehavior = new List(inputs);
  }
  validate() {
    const violations = [];
    if (!this.inputs.multi() && this.inputs.value().length > 1) {
      violations.push(`A single-select listbox should not have multiple selected options. Selected options: ${this.inputs.value().join(', ')}`);
    }
    return violations;
  }
  onKeydown(event) {
    if (!this.disabled()) {
      this.keydown().handle(event);
    }
  }
  onPointerdown(event) {
    if (!this.disabled()) {
      this.pointerdown().handle(event);
    }
  }
  setDefaultState() {
    let firstItem = null;
    for (const item of this.inputs.items()) {
      if (this.listBehavior.isFocusable(item)) {
        if (!firstItem) {
          firstItem = item;
        }
        if (item.selected()) {
          this.inputs.activeItem.set(item);
          return;
        }
      }
    }
    if (firstItem) {
      this.inputs.activeItem.set(firstItem);
    }
  }
  _getItem(e) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const element = e.target.closest('[role="option"]');
    return this.inputs.items().find(i => i.element() === element);
  }
}

class OptionPattern {
  id;
  value;
  index = computed(() => this.listbox()?.inputs.items().indexOf(this) ?? -1);
  active = computed(() => this.listbox()?.inputs.activeItem() === this);
  selected = computed(() => this.listbox()?.inputs.value().includes(this.value()));
  selectable = () => true;
  disabled;
  searchTerm;
  listbox;
  tabindex = computed(() => this.listbox()?.listBehavior.getItemTabindex(this));
  element;
  constructor(args) {
    this.id = args.id;
    this.value = args.value;
    this.listbox = args.listbox;
    this.element = args.element;
    this.disabled = args.disabled;
    this.searchTerm = args.searchTerm;
  }
}

class ComboboxListboxPattern extends ListboxPattern {
  inputs;
  id = computed(() => this.inputs.id());
  role = computed(() => 'listbox');
  activeId = computed(() => this.listBehavior.activedescendant());
  items = computed(() => this.inputs.items());
  tabindex = () => -1;
  constructor(inputs) {
    if (inputs.combobox()) {
      inputs.multi = () => false;
      inputs.focusMode = () => 'activedescendant';
      inputs.element = inputs.combobox().inputs.inputEl;
    }
    super(inputs);
    this.inputs = inputs;
  }
  onKeydown(_) {}
  onPointerdown(_) {}
  setDefaultState() {}
  focus = item => this.listBehavior.goto(item);
  next = () => this.listBehavior.next();
  prev = () => this.listBehavior.prev();
  last = () => this.listBehavior.last();
  first = () => this.listBehavior.first();
  unfocus = () => this.listBehavior.unfocus();
  select = item => this.listBehavior.select(item);
  clearSelection = () => this.listBehavior.deselectAll();
  getItem = e => this._getItem(e);
  getSelectedItem = () => this.inputs.items().find(i => i.selected());
  setValue = value => this.inputs.value.set(value ? [value] : []);
}

class MenuPattern {
  inputs;
  id;
  role = () => 'menu';
  isVisible = computed(() => this.inputs.parent() ? !!this.inputs.parent()?.expanded() : true);
  listBehavior;
  isFocused = signal(false);
  hasBeenFocused = signal(false);
  shouldFocus = computed(() => {
    const root = this.root();
    if (root instanceof MenuTriggerPattern) {
      return true;
    }
    if (root instanceof MenuBarPattern || root instanceof MenuPattern) {
      return root.isFocused();
    }
    return false;
  });
  _expandKey = computed(() => {
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  _collapseKey = computed(() => {
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  dynamicSpaceKey = computed(() => this.listBehavior.isTyping() ? '' : ' ');
  typeaheadRegexp = /^.$/;
  root = computed(() => {
    const parent = this.inputs.parent();
    if (!parent) {
      return this;
    }
    if (parent instanceof MenuTriggerPattern) {
      return parent;
    }
    const grandparent = parent.inputs.parent();
    if (grandparent instanceof MenuBarPattern) {
      return grandparent;
    }
    return grandparent?.root();
  });
  keydownManager = computed(() => {
    return new KeyboardEventManager().on('ArrowDown', () => this.next()).on('ArrowUp', () => this.prev()).on('Home', () => this.first()).on('End', () => this.last()).on('Enter', () => this.trigger()).on('Escape', () => this.closeAll()).on(this._expandKey, () => this.expand()).on(this._collapseKey, () => this.collapse()).on(this.dynamicSpaceKey, () => this.trigger()).on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.listBehavior = new List({
      ...inputs,
      value: signal([]),
      disabled: () => false
    });
  }
  setDefaultState() {
    if (!this.inputs.parent()) {
      this.inputs.activeItem.set(this.inputs.items()[0]);
    }
  }
  onKeydown(event) {
    this.keydownManager().handle(event);
  }
  onMouseOver(event) {
    if (!this.isVisible()) {
      return;
    }
    const item = this.inputs.items().find(i => i.element()?.contains(event.target));
    if (!item) {
      return;
    }
    const activeItem = this?.inputs.activeItem();
    if (activeItem && activeItem !== item) {
      activeItem.close();
    }
    if (item.expanded() && item.submenu()?.inputs.activeItem()) {
      item.submenu()?.inputs.activeItem()?.close();
      item.submenu()?.listBehavior.unfocus();
    }
    item.open();
    this.listBehavior.goto(item, {
      focusElement: this.shouldFocus()
    });
  }
  onMouseOut(event) {
    if (this.isFocused()) {
      return;
    }
    const root = this.root();
    const parent = this.inputs.parent();
    const relatedTarget = event.relatedTarget;
    if (!root || !parent || parent instanceof MenuTriggerPattern) {
      return;
    }
    const grandparent = parent.inputs.parent();
    if (!grandparent || grandparent instanceof MenuBarPattern) {
      return;
    }
    if (!grandparent.inputs.element()?.contains(relatedTarget)) {
      parent.close();
    }
  }
  onClick(event) {
    const relatedTarget = event.target;
    const item = this.inputs.items().find(i => i.element()?.contains(relatedTarget));
    if (item) {
      item.open();
      this.listBehavior.goto(item);
      this.submit(item);
    }
  }
  onFocusIn() {
    this.isFocused.set(true);
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    const parent = this.inputs.parent();
    const parentEl = parent?.inputs.element();
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget) {
      this.isFocused.set(false);
      this.inputs.parent()?.close({
        refocus: true
      });
    }
    if (parent instanceof MenuItemPattern) {
      const grandparent = parent.inputs.parent();
      const siblings = grandparent?.inputs.items().filter(i => i !== parent);
      const item = siblings?.find(i => i.element().contains(relatedTarget));
      if (item) {
        return;
      }
    }
    if (this.isVisible() && !parentEl?.contains(relatedTarget) && !this.inputs.element()?.contains(relatedTarget)) {
      this.isFocused.set(false);
      this.inputs.parent()?.close();
    }
  }
  prev() {
    this.inputs.activeItem()?.close();
    this.listBehavior.prev();
  }
  next() {
    this.inputs.activeItem()?.close();
    this.listBehavior.next();
  }
  first() {
    this.inputs.activeItem()?.close();
    this.listBehavior.first();
  }
  last() {
    this.inputs.activeItem()?.close();
    this.listBehavior.last();
  }
  trigger() {
    this.inputs.activeItem()?.hasPopup() ? this.inputs.activeItem()?.open({
      first: true
    }) : this.submit();
  }
  submit(item = this.inputs.activeItem()) {
    const root = this.root();
    if (item && !item.disabled()) {
      const isMenu = root instanceof MenuPattern;
      const isMenuBar = root instanceof MenuBarPattern;
      const isMenuTrigger = root instanceof MenuTriggerPattern;
      if (!item.submenu() && (isMenuTrigger || isMenuBar)) {
        root.close({
          refocus: true
        });
        root?.inputs.onSubmit?.(item.value());
      }
      if (!item.submenu() && isMenu) {
        root.inputs.activeItem()?.close({
          refocus: true
        });
        root?.inputs.onSubmit?.(item.value());
      }
    }
  }
  collapse() {
    const root = this.root();
    const parent = this.inputs.parent();
    if (parent instanceof MenuItemPattern && !(parent.inputs.parent() instanceof MenuBarPattern)) {
      parent.close({
        refocus: true
      });
    } else if (root instanceof MenuBarPattern) {
      root.prev();
    }
  }
  expand() {
    const root = this.root();
    const activeItem = this.inputs.activeItem();
    if (activeItem?.submenu()) {
      activeItem.open({
        first: true
      });
    } else if (root instanceof MenuBarPattern) {
      root.next();
    }
  }
  closeAll() {
    const root = this.root();
    if (root instanceof MenuTriggerPattern) {
      root.close({
        refocus: true
      });
    }
    if (root instanceof MenuBarPattern) {
      root.close();
    }
    if (root instanceof MenuPattern) {
      root.inputs.activeItem()?.close({
        refocus: true
      });
    }
  }
}
class MenuBarPattern {
  inputs;
  listBehavior;
  _nextKey = computed(() => {
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  _previousKey = computed(() => {
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  dynamicSpaceKey = computed(() => this.listBehavior.isTyping() ? '' : ' ');
  typeaheadRegexp = /^.$/;
  isFocused = signal(false);
  hasBeenFocused = signal(false);
  keydownManager = computed(() => {
    return new KeyboardEventManager().on(this._nextKey, () => this.next()).on(this._previousKey, () => this.prev()).on('End', () => this.listBehavior.last()).on('Home', () => this.listBehavior.first()).on('Enter', () => this.inputs.activeItem()?.open({
      first: true
    })).on('ArrowUp', () => this.inputs.activeItem()?.open({
      last: true
    })).on('ArrowDown', () => this.inputs.activeItem()?.open({
      first: true
    })).on(this.dynamicSpaceKey, () => this.inputs.activeItem()?.open({
      first: true
    })).on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.listBehavior = new List({
      ...inputs,
      disabled: () => false
    });
  }
  setDefaultState() {
    this.inputs.activeItem.set(this.inputs.items()[0]);
  }
  onKeydown(event) {
    this.keydownManager().handle(event);
  }
  onClick(event) {
    const item = this.inputs.items().find(i => i.element()?.contains(event.target));
    if (!item) {
      return;
    }
    this.goto(item);
    item.expanded() ? item.close() : item.open();
  }
  onMouseOver(event) {
    const item = this.inputs.items().find(i => i.element()?.contains(event.target));
    if (item) {
      this.goto(item, {
        focusElement: this.isFocused()
      });
    }
  }
  onFocusIn() {
    this.isFocused.set(true);
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    const relatedTarget = event.relatedTarget;
    if (!this.inputs.element()?.contains(relatedTarget)) {
      this.isFocused.set(false);
      this.close();
    }
  }
  goto(item, opts) {
    const prevItem = this.inputs.activeItem();
    this.listBehavior.goto(item, opts);
    if (prevItem?.expanded()) {
      prevItem?.close();
      this.inputs.activeItem()?.open();
    }
    if (item === prevItem) {
      if (item.expanded() && item.submenu()?.inputs.activeItem()) {
        item.submenu()?.inputs.activeItem()?.close();
        item.submenu()?.listBehavior.unfocus();
      }
    }
  }
  next() {
    const prevItem = this.inputs.activeItem();
    this.listBehavior.next();
    if (prevItem?.expanded()) {
      prevItem?.close();
      this.inputs.activeItem()?.open({
        first: true
      });
    }
  }
  prev() {
    const prevItem = this.inputs.activeItem();
    this.listBehavior.prev();
    if (prevItem?.expanded()) {
      prevItem?.close();
      this.inputs.activeItem()?.open({
        first: true
      });
    }
  }
  close() {
    this.inputs.activeItem()?.close({
      refocus: this.isFocused()
    });
  }
}
class MenuTriggerPattern {
  inputs;
  expanded = signal(false);
  role = () => 'button';
  hasPopup = () => true;
  submenu;
  tabindex = computed(() => this.expanded() && this.submenu()?.inputs.activeItem() ? -1 : 0);
  keydownManager = computed(() => {
    return new KeyboardEventManager().on(' ', () => this.open({
      first: true
    })).on('Enter', () => this.open({
      first: true
    })).on('ArrowDown', () => this.open({
      first: true
    })).on('ArrowUp', () => this.open({
      last: true
    })).on('Escape', () => this.close({
      refocus: true
    }));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.submenu = this.inputs.submenu;
  }
  onKeydown(event) {
    this.keydownManager().handle(event);
  }
  onClick() {
    this.expanded() ? this.close() : this.open({
      first: true
    });
  }
  onFocusOut(event) {
    const element = this.inputs.element();
    const relatedTarget = event.relatedTarget;
    if (this.expanded() && !element?.contains(relatedTarget) && !this.inputs.submenu()?.inputs.element()?.contains(relatedTarget)) {
      this.close();
    }
  }
  open(opts) {
    this.expanded.set(true);
    if (opts?.first) {
      this.inputs.submenu()?.first();
    } else if (opts?.last) {
      this.inputs.submenu()?.last();
    }
  }
  close(opts = {}) {
    this.expanded.set(false);
    this.submenu()?.listBehavior.unfocus();
    if (opts.refocus) {
      this.inputs.element()?.focus();
    }
    let menuitems = this.inputs.submenu()?.inputs.items() ?? [];
    while (menuitems.length) {
      const menuitem = menuitems.pop();
      menuitem?._expanded.set(false);
      menuitem?.inputs.parent()?.listBehavior.unfocus();
      menuitems = menuitems.concat(menuitem?.submenu()?.inputs.items() ?? []);
    }
  }
}
class MenuItemPattern {
  inputs;
  value;
  id;
  disabled;
  searchTerm;
  element;
  isActive = computed(() => this.inputs.parent()?.inputs.activeItem() === this);
  tabindex = computed(() => {
    if (this.submenu() && this.submenu()?.inputs.activeItem()) {
      return -1;
    }
    return this.inputs.parent()?.listBehavior.getItemTabindex(this) ?? -1;
  });
  index = computed(() => this.inputs.parent()?.inputs.items().indexOf(this) ?? -1);
  expanded = computed(() => this.submenu() ? this._expanded() : null);
  _expanded = signal(false);
  controls = signal(undefined);
  role = () => 'menuitem';
  hasPopup = computed(() => !!this.submenu());
  submenu;
  selectable;
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.value = inputs.value;
    this.element = inputs.element;
    this.disabled = inputs.disabled;
    this.submenu = this.inputs.submenu;
    this.searchTerm = inputs.searchTerm;
    this.selectable = computed(() => !this.submenu());
  }
  open(opts) {
    this._expanded.set(true);
    if (opts?.first) {
      this.submenu()?.first();
    }
    if (opts?.last) {
      this.submenu()?.last();
    }
  }
  close(opts = {}) {
    this._expanded.set(false);
    if (opts.refocus) {
      this.inputs.parent()?.listBehavior.goto(this);
    }
    let menuitems = this.inputs.submenu()?.inputs.items() ?? [];
    while (menuitems.length) {
      const menuitem = menuitems.pop();
      menuitem?._expanded.set(false);
      menuitem?.inputs.parent()?.listBehavior.unfocus();
      menuitems = menuitems.concat(menuitem?.submenu()?.inputs.items() ?? []);
    }
  }
}

class RadioGroupPattern {
  inputs;
  listBehavior;
  orientation;
  wrap = signal(false);
  selectionMode = signal('follow');
  disabled = computed(() => this.inputs.disabled() || this.listBehavior.disabled());
  selectedItem = computed(() => this.listBehavior.selectionBehavior.selectedItems()[0]);
  readonly = computed(() => this.selectedItem()?.disabled() || this.inputs.readonly());
  tabindex = computed(() => this.listBehavior.tabindex());
  activedescendant = computed(() => this.listBehavior.activedescendant());
  _prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  _nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    if (this.readonly()) {
      return manager.on(this._prevKey, () => this.listBehavior.prev()).on(this._nextKey, () => this.listBehavior.next()).on('Home', () => this.listBehavior.first()).on('End', () => this.listBehavior.last());
    }
    return manager.on(this._prevKey, () => this.listBehavior.prev({
      selectOne: true
    })).on(this._nextKey, () => this.listBehavior.next({
      selectOne: true
    })).on('Home', () => this.listBehavior.first({
      selectOne: true
    })).on('End', () => this.listBehavior.last({
      selectOne: true
    })).on(' ', () => this.listBehavior.selectOne()).on('Enter', () => this.listBehavior.selectOne());
  });
  pointerdown = computed(() => {
    const manager = new PointerEventManager();
    if (this.readonly()) {
      return manager.on(e => this.listBehavior.goto(this.inputs.getItem(e)));
    }
    return manager.on(e => this.listBehavior.goto(this.inputs.getItem(e), {
      selectOne: true
    }));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.orientation = inputs.orientation;
    this.listBehavior = new List({
      ...inputs,
      wrap: this.wrap,
      selectionMode: this.selectionMode,
      multi: () => false,
      typeaheadDelay: () => 0
    });
  }
  onKeydown(event) {
    if (!this.disabled()) {
      this.keydown().handle(event);
    }
  }
  onPointerdown(event) {
    if (!this.disabled()) {
      this.pointerdown().handle(event);
    }
  }
  setDefaultState() {
    let firstItem = null;
    for (const item of this.inputs.items()) {
      if (this.listBehavior.isFocusable(item)) {
        if (!firstItem) {
          firstItem = item;
        }
        if (item.selected()) {
          this.inputs.activeItem.set(item);
          return;
        }
      }
    }
    if (firstItem) {
      this.inputs.activeItem.set(firstItem);
    }
  }
  validate() {
    const violations = [];
    if (this.selectedItem()?.disabled() && this.inputs.skipDisabled()) {
      violations.push("Accessibility Violation: The selected radio button is disabled while 'skipDisabled' is true, making the selection unreachable via keyboard.");
    }
    return violations;
  }
}

class RadioButtonPattern {
  inputs;
  id;
  value;
  index = computed(() => this.group()?.listBehavior.inputs.items().indexOf(this) ?? -1);
  active = computed(() => this.group()?.listBehavior.inputs.activeItem() === this);
  selected = computed(() => !!this.group()?.listBehavior.inputs.value().includes(this.value()));
  selectable = () => true;
  disabled;
  group;
  tabindex = computed(() => this.group()?.listBehavior.getItemTabindex(this));
  element;
  searchTerm = () => '';
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.value = inputs.value;
    this.group = inputs.group;
    this.element = inputs.element;
    this.disabled = inputs.disabled;
  }
}

class ToolbarRadioGroupPattern extends RadioGroupPattern {
  inputs;
  constructor(inputs) {
    if (!!inputs.toolbar()) {
      inputs.orientation = inputs.toolbar().orientation;
      inputs.skipDisabled = inputs.toolbar().skipDisabled;
    }
    super(inputs);
    this.inputs = inputs;
  }
  onKeydown(_) {}
  onPointerdown(_) {}
  isOnFirstItem() {
    return this.listBehavior.navigationBehavior.peekPrev() === undefined;
  }
  isOnLastItem() {
    return this.listBehavior.navigationBehavior.peekNext() === undefined;
  }
  next(wrap) {
    this.wrap.set(wrap);
    this.listBehavior.next();
    this.wrap.set(false);
  }
  prev(wrap) {
    this.wrap.set(wrap);
    this.listBehavior.prev();
    this.wrap.set(false);
  }
  first() {
    this.listBehavior.first();
  }
  last() {
    this.listBehavior.last();
  }
  unfocus() {
    this.inputs.activeItem.set(undefined);
  }
  trigger() {
    if (this.readonly()) return;
    this.listBehavior.selectOne();
  }
  goto(e) {
    this.listBehavior.goto(this.inputs.getItem(e), {
      selectOne: !this.readonly()
    });
  }
}

function convertGetterSetterToWritableSignalLike(getter, setter) {
  return Object.assign(getter, {
    set: setter,
    update: updateCallback => setter(updateCallback(getter()))
  });
}

class ExpansionControl {
  inputs;
  isExpanded = computed(() => this.inputs.expansionManager.isExpanded(this));
  isExpandable = computed(() => this.inputs.expansionManager.isExpandable(this));
  constructor(inputs) {
    this.inputs = inputs;
    this.expansionId = inputs.expansionId;
    this.expandable = inputs.expandable;
    this.disabled = inputs.disabled;
  }
  open() {
    this.inputs.expansionManager.open(this);
  }
  close() {
    this.inputs.expansionManager.close(this);
  }
  toggle() {
    this.inputs.expansionManager.toggle(this);
  }
}
class ListExpansion {
  inputs;
  expandedIds;
  constructor(inputs) {
    this.inputs = inputs;
    this.expandedIds = inputs.expandedIds;
  }
  open(item) {
    if (!this.isExpandable(item)) return;
    if (this.isExpanded(item)) return;
    if (!this.inputs.multiExpandable()) {
      this.closeAll();
    }
    this.expandedIds.update(ids => ids.concat(item.expansionId()));
  }
  close(item) {
    if (this.isExpandable(item)) {
      this.expandedIds.update(ids => ids.filter(id => id !== item.expansionId()));
    }
  }
  toggle(item) {
    this.expandedIds().includes(item.expansionId()) ? this.close(item) : this.open(item);
  }
  openAll() {
    if (this.inputs.multiExpandable()) {
      for (const item of this.inputs.items()) {
        this.open(item);
      }
    }
  }
  closeAll() {
    for (const item of this.inputs.items()) {
      this.close(item);
    }
  }
  isExpandable(item) {
    return !this.inputs.disabled() && !item.disabled() && item.expandable();
  }
  isExpanded(item) {
    return this.expandedIds().includes(item.expansionId());
  }
}

class LabelControl {
  inputs;
  label = computed(() => this.inputs.label?.());
  labelledBy = computed(() => {
    const label = this.label();
    const labelledBy = this.inputs.labelledBy?.();
    const defaultLabelledBy = this.inputs.defaultLabelledBy();
    if (labelledBy && labelledBy.length > 0) {
      return labelledBy;
    }
    if (label) {
      return [];
    }
    return defaultLabelledBy;
  });
  constructor(inputs) {
    this.inputs = inputs;
  }
}

class TabPattern {
  inputs;
  expansion;
  id;
  index = computed(() => this.inputs.tablist().inputs.items().indexOf(this));
  value;
  disabled;
  element;
  selectable = () => true;
  searchTerm = () => '';
  expandable = computed(() => this.expansion.expandable());
  expansionId = computed(() => this.expansion.expansionId());
  expanded = computed(() => this.expansion.isExpanded());
  active = computed(() => this.inputs.tablist().inputs.activeItem() === this);
  selected = computed(() => !!this.inputs.tablist().inputs.value().includes(this.value()));
  tabindex = computed(() => this.inputs.tablist().listBehavior.getItemTabindex(this));
  controls = computed(() => this.inputs.tabpanel()?.id());
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.value = inputs.value;
    this.disabled = inputs.disabled;
    this.element = inputs.element;
    this.expansion = new ExpansionControl({
      ...inputs,
      expansionId: inputs.value,
      expandable: () => true,
      expansionManager: inputs.tablist().expansionManager
    });
  }
}
class TabPanelPattern {
  inputs;
  id;
  value;
  labelManager;
  hidden = computed(() => this.inputs.tab()?.expanded() === false);
  tabindex = computed(() => this.hidden() ? -1 : 0);
  labelledBy = computed(() => this.labelManager.labelledBy().length > 0 ? this.labelManager.labelledBy().join(' ') : undefined);
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.value = inputs.value;
    this.labelManager = new LabelControl({
      ...inputs,
      defaultLabelledBy: computed(() => this.inputs.tab() ? [this.inputs.tab().id()] : [])
    });
  }
}
class TabListPattern {
  inputs;
  listBehavior;
  expansionManager;
  orientation;
  disabled;
  tabindex = computed(() => this.listBehavior.tabindex());
  activedescendant = computed(() => this.listBehavior.activedescendant());
  followFocus = computed(() => this.inputs.selectionMode() === 'follow');
  prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  keydown = computed(() => {
    return new KeyboardEventManager().on(this.prevKey, () => this.listBehavior.prev({
      select: this.followFocus()
    })).on(this.nextKey, () => this.listBehavior.next({
      select: this.followFocus()
    })).on('Home', () => this.listBehavior.first({
      select: this.followFocus()
    })).on('End', () => this.listBehavior.last({
      select: this.followFocus()
    })).on(' ', () => this.listBehavior.select()).on('Enter', () => this.listBehavior.select());
  });
  pointerdown = computed(() => {
    return new PointerEventManager().on(e => this.listBehavior.goto(this._getItem(e), {
      select: true
    }));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.disabled = inputs.disabled;
    this.orientation = inputs.orientation;
    this.listBehavior = new List({
      ...inputs,
      multi: () => false,
      typeaheadDelay: () => 0
    });
    this.expansionManager = new ListExpansion({
      ...inputs,
      multiExpandable: () => false,
      expandedIds: this.inputs.value
    });
  }
  setDefaultState() {
    let firstItem;
    for (const item of this.inputs.items()) {
      if (!this.listBehavior.isFocusable(item)) continue;
      if (firstItem === undefined) {
        firstItem = item;
      }
      if (item.selected()) {
        this.inputs.activeItem.set(item);
        return;
      }
    }
    if (firstItem !== undefined) {
      this.inputs.activeItem.set(firstItem);
    }
  }
  onKeydown(event) {
    if (!this.disabled()) {
      this.keydown().handle(event);
    }
  }
  onPointerdown(event) {
    if (!this.disabled()) {
      this.pointerdown().handle(event);
    }
  }
  _getItem(e) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const element = e.target.closest('[role="tab"]');
    return this.inputs.items().find(i => i.element() === element);
  }
}

class ToolbarWidgetPattern {
  inputs;
  id;
  element;
  disabled;
  toolbar;
  tabindex = computed(() => this.toolbar().listBehavior.getItemTabindex(this));
  searchTerm = () => '';
  value = () => '';
  selectable = () => true;
  index = computed(() => this.toolbar().inputs.items().indexOf(this) ?? -1);
  active = computed(() => this.toolbar().inputs.activeItem() === this);
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.element = inputs.element;
    this.disabled = inputs.disabled;
    this.toolbar = inputs.toolbar;
  }
}

class ToolbarWidgetGroupPattern {
  inputs;
  id;
  element;
  disabled;
  toolbar;
  searchTerm = () => '';
  value = () => '';
  selectable = () => true;
  index = computed(() => this.toolbar()?.inputs.items().indexOf(this) ?? -1);
  controls = computed(() => this.inputs.controls() ?? this._defaultControls);
  _defaultControls = {
    isOnFirstItem: () => true,
    isOnLastItem: () => true,
    next: () => {},
    prev: () => {},
    first: () => {},
    last: () => {},
    unfocus: () => {},
    trigger: () => {},
    goto: () => {},
    setDefaultState: () => {}
  };
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.element = inputs.element;
    this.disabled = inputs.disabled;
    this.toolbar = inputs.toolbar;
  }
}

class ToolbarPattern {
  inputs;
  listBehavior;
  orientation;
  skipDisabled;
  disabled = computed(() => this.listBehavior.disabled());
  tabindex = computed(() => this.listBehavior.tabindex());
  activedescendant = computed(() => this.listBehavior.activedescendant());
  _prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  _nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  _altPrevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    }
    return 'ArrowUp';
  });
  _altNextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    }
    return 'ArrowDown';
  });
  _keydown = computed(() => {
    const manager = new KeyboardEventManager();
    return manager.on(this._nextKey, () => this._next()).on(this._prevKey, () => this._prev()).on(this._altNextKey, () => this._groupNext()).on(this._altPrevKey, () => this._groupPrev()).on(' ', () => this._trigger()).on('Enter', () => this._trigger()).on('Home', () => this._first()).on('End', () => this._last());
  });
  _pointerdown = computed(() => new PointerEventManager().on(e => this._goto(e)));
  _next() {
    const item = this.inputs.activeItem();
    if (item instanceof ToolbarWidgetGroupPattern) {
      if (!item.disabled() && !item.controls().isOnLastItem()) {
        item.controls().next(false);
        return;
      }
      item.controls().unfocus();
    }
    this.listBehavior.next();
    const newItem = this.inputs.activeItem();
    if (newItem instanceof ToolbarWidgetGroupPattern) {
      newItem.controls().first();
    }
  }
  _prev() {
    const item = this.inputs.activeItem();
    if (item instanceof ToolbarWidgetGroupPattern) {
      if (!item.disabled() && !item.controls().isOnFirstItem()) {
        item.controls().prev(false);
        return;
      }
      item.controls().unfocus();
    }
    this.listBehavior.prev();
    const newItem = this.inputs.activeItem();
    if (newItem instanceof ToolbarWidgetGroupPattern) {
      newItem.controls().last();
    }
  }
  _groupNext() {
    const item = this.inputs.activeItem();
    if (item instanceof ToolbarWidgetPattern) return;
    item?.controls().next(true);
  }
  _groupPrev() {
    const item = this.inputs.activeItem();
    if (item instanceof ToolbarWidgetPattern) return;
    item?.controls().prev(true);
  }
  _trigger() {
    const item = this.inputs.activeItem();
    if (item instanceof ToolbarWidgetGroupPattern) {
      item.controls().trigger();
    }
  }
  _first() {
    const item = this.inputs.activeItem();
    if (item instanceof ToolbarWidgetGroupPattern) {
      item.controls().unfocus();
    }
    this.listBehavior.first();
    const newItem = this.inputs.activeItem();
    if (newItem instanceof ToolbarWidgetGroupPattern) {
      newItem.controls().first();
    }
  }
  _last() {
    const item = this.inputs.activeItem();
    if (item instanceof ToolbarWidgetGroupPattern) {
      item.controls().unfocus();
    }
    this.listBehavior.last();
    const newItem = this.inputs.activeItem();
    if (newItem instanceof ToolbarWidgetGroupPattern) {
      newItem.controls().last();
    }
  }
  _goto(e) {
    const item = this.inputs.getItem(e.target);
    if (!item) return;
    this.listBehavior.goto(item);
    if (item instanceof ToolbarWidgetGroupPattern) {
      item.controls().goto(e);
    }
  }
  constructor(inputs) {
    this.inputs = inputs;
    this.orientation = inputs.orientation;
    this.skipDisabled = inputs.skipDisabled;
    this.listBehavior = new List({
      ...inputs,
      multi: () => false,
      focusMode: () => 'roving',
      selectionMode: () => 'explicit',
      value: signal([]),
      typeaheadDelay: () => 0
    });
  }
  onKeydown(event) {
    if (this.disabled()) return;
    this._keydown().handle(event);
  }
  onPointerdown(event) {
    if (this.disabled()) return;
    this._pointerdown().handle(event);
  }
  setDefaultState() {
    let firstItem = null;
    for (const item of this.inputs.items()) {
      if (this.listBehavior.isFocusable(item)) {
        if (!firstItem) {
          firstItem = item;
        }
      }
    }
    if (firstItem) {
      this.inputs.activeItem.set(firstItem);
    }
    if (firstItem instanceof ToolbarWidgetGroupPattern) {
      firstItem.controls().setDefaultState();
    }
  }
  validate() {
    const violations = [];
    return violations;
  }
}

const focusMode = () => 'roving';
class AccordionGroupPattern {
  inputs;
  navigation;
  focusManager;
  expansionManager;
  constructor(inputs) {
    this.inputs = inputs;
    this.wrap = inputs.wrap;
    this.orientation = inputs.orientation;
    this.textDirection = inputs.textDirection;
    this.activeItem = inputs.activeItem;
    this.disabled = inputs.disabled;
    this.multiExpandable = inputs.multiExpandable;
    this.items = inputs.items;
    this.expandedIds = inputs.expandedIds;
    this.skipDisabled = inputs.skipDisabled;
    this.focusManager = new ListFocus({
      ...inputs,
      focusMode
    });
    this.navigation = new ListNavigation({
      ...inputs,
      focusMode,
      focusManager: this.focusManager
    });
    this.expansionManager = new ListExpansion({
      ...inputs
    });
  }
}
class AccordionTriggerPattern {
  inputs;
  expandable;
  expansionId;
  expanded;
  expansionControl;
  active = computed(() => this.inputs.accordionGroup().activeItem() === this);
  controls = computed(() => this.inputs.accordionPanel()?.id());
  tabindex = computed(() => this.inputs.accordionGroup().focusManager.isFocusable(this) ? 0 : -1);
  disabled = computed(() => this.inputs.disabled() || this.inputs.accordionGroup().disabled());
  index = computed(() => this.inputs.accordionGroup().items().indexOf(this));
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.element = inputs.element;
    this.value = inputs.value;
    this.expansionControl = new ExpansionControl({
      ...inputs,
      expansionId: inputs.value,
      expandable: () => true,
      expansionManager: inputs.accordionGroup().expansionManager
    });
    this.expandable = this.expansionControl.isExpandable;
    this.expansionId = this.expansionControl.expansionId;
    this.expanded = this.expansionControl.isExpanded;
  }
  prevKey = computed(() => {
    if (this.inputs.accordionGroup().orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.inputs.accordionGroup().textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  nextKey = computed(() => {
    if (this.inputs.accordionGroup().orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.inputs.accordionGroup().textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  keydown = computed(() => {
    return new KeyboardEventManager().on(this.prevKey, () => this.inputs.accordionGroup().navigation.prev()).on(this.nextKey, () => this.inputs.accordionGroup().navigation.next()).on('Home', () => this.inputs.accordionGroup().navigation.first()).on('End', () => this.inputs.accordionGroup().navigation.last()).on(' ', () => this.expansionControl.toggle()).on('Enter', () => this.expansionControl.toggle());
  });
  pointerdown = computed(() => {
    return new PointerEventManager().on(e => {
      const item = this._getItem(e);
      if (item) {
        this.inputs.accordionGroup().navigation.goto(item);
        this.expansionControl.toggle();
      }
    });
  });
  onKeydown(event) {
    this.keydown().handle(event);
  }
  onPointerdown(event) {
    this.pointerdown().handle(event);
  }
  onFocus(event) {
    const item = this._getItem(event);
    if (item && this.inputs.accordionGroup().focusManager.isFocusable(item)) {
      this.inputs.accordionGroup().focusManager.focus(item);
    }
  }
  _getItem(e) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const element = e.target.closest('[role="button"]');
    return this.inputs.accordionGroup().items().find(i => i.element() === element);
  }
}
class AccordionPanelPattern {
  inputs;
  hidden;
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.value = inputs.value;
    this.accordionTrigger = inputs.accordionTrigger;
    this.hidden = computed(() => inputs.accordionTrigger()?.expanded() === false);
  }
}

class TreeItemPattern {
  inputs;
  id;
  value;
  element;
  disabled;
  searchTerm;
  tree;
  parent;
  children;
  index = computed(() => this.tree().visibleItems().indexOf(this));
  expansionId;
  expansionManager;
  expansion;
  expandable;
  selectable;
  level = computed(() => this.parent().level() + 1);
  expanded = computed(() => this.expansion.isExpanded());
  visible = computed(() => this.parent().expanded());
  setsize = computed(() => this.parent().children().length);
  posinset = computed(() => this.parent().children().indexOf(this) + 1);
  active = computed(() => this.tree().activeItem() === this);
  tabindex = computed(() => this.tree().listBehavior.getItemTabindex(this));
  selected = computed(() => {
    if (this.tree().nav()) {
      return undefined;
    }
    if (!this.selectable()) {
      return undefined;
    }
    return this.tree().value().includes(this.value());
  });
  current = computed(() => {
    if (!this.tree().nav()) {
      return undefined;
    }
    if (!this.selectable()) {
      return undefined;
    }
    return this.tree().value().includes(this.value()) ? this.tree().currentType() : undefined;
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.value = inputs.value;
    this.element = inputs.element;
    this.disabled = inputs.disabled;
    this.searchTerm = inputs.searchTerm;
    this.expansionId = inputs.id;
    this.tree = inputs.tree;
    this.parent = inputs.parent;
    this.children = inputs.children;
    this.expandable = inputs.hasChildren;
    this.selectable = inputs.selectable;
    this.expansion = new ExpansionControl({
      ...inputs,
      expandable: this.expandable,
      expansionId: this.expansionId,
      expansionManager: this.parent().expansionManager
    });
    this.expansionManager = new ListExpansion({
      ...inputs,
      multiExpandable: () => true,
      expandedIds: signal([]),
      items: this.children,
      disabled: computed(() => this.tree()?.disabled() ?? false)
    });
  }
}
class TreePattern {
  inputs;
  listBehavior;
  expansionManager;
  level = () => 0;
  expanded = () => true;
  tabindex = computed(() => this.listBehavior.tabindex());
  activedescendant = computed(() => this.listBehavior.activedescendant());
  children = computed(() => this.inputs.allItems().filter(item => item.level() === this.level() + 1));
  visibleItems = computed(() => this.inputs.allItems().filter(item => item.visible()));
  followFocus = computed(() => this.inputs.selectionMode() === 'follow');
  prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  collapseKey = computed(() => {
    if (this.inputs.orientation() === 'horizontal') {
      return 'ArrowUp';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  });
  expandKey = computed(() => {
    if (this.inputs.orientation() === 'horizontal') {
      return 'ArrowDown';
    }
    return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  });
  dynamicSpaceKey = computed(() => this.listBehavior.isTyping() ? '' : ' ');
  typeaheadRegexp = /^.$/;
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    const list = this.listBehavior;
    manager.on(this.prevKey, () => list.prev({
      selectOne: this.followFocus()
    })).on(this.nextKey, () => list.next({
      selectOne: this.followFocus()
    })).on('Home', () => list.first({
      selectOne: this.followFocus()
    })).on('End', () => list.last({
      selectOne: this.followFocus()
    })).on(this.typeaheadRegexp, e => list.search(e.key, {
      selectOne: this.followFocus()
    })).on(this.expandKey, () => this.expand({
      selectOne: this.followFocus()
    })).on(this.collapseKey, () => this.collapse({
      selectOne: this.followFocus()
    })).on(Modifier.Shift, '*', () => this.expandSiblings());
    if (this.inputs.multi()) {
      manager.on(Modifier.Any, 'Shift', () => list.anchor(this.listBehavior.activeIndex())).on(Modifier.Shift, this.prevKey, () => list.prev({
        selectRange: true
      })).on(Modifier.Shift, this.nextKey, () => list.next({
        selectRange: true
      })).on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'Home', () => list.first({
        selectRange: true,
        anchor: false
      })).on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'End', () => list.last({
        selectRange: true,
        anchor: false
      })).on(Modifier.Shift, 'Enter', () => list.updateSelection({
        selectRange: true,
        anchor: false
      })).on(Modifier.Shift, this.dynamicSpaceKey, () => list.updateSelection({
        selectRange: true,
        anchor: false
      }));
    }
    if (!this.followFocus() && this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => list.toggle()).on('Enter', () => list.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'A', () => list.toggleAll());
    }
    if (!this.followFocus() && !this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => list.selectOne());
      manager.on('Enter', () => list.selectOne());
    }
    if (this.inputs.multi() && this.followFocus()) {
      manager.on([Modifier.Ctrl, Modifier.Meta], this.prevKey, () => list.prev()).on([Modifier.Ctrl, Modifier.Meta], this.nextKey, () => list.next()).on([Modifier.Ctrl, Modifier.Meta], this.expandKey, () => this.expand()).on([Modifier.Ctrl, Modifier.Meta], this.collapseKey, () => this.collapse()).on([Modifier.Ctrl, Modifier.Meta], ' ', () => list.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'Enter', () => list.toggle()).on([Modifier.Ctrl, Modifier.Meta], 'Home', () => list.first()).on([Modifier.Ctrl, Modifier.Meta], 'End', () => list.last()).on([Modifier.Ctrl, Modifier.Meta], 'A', () => {
        list.toggleAll();
        list.select();
      });
    }
    return manager;
  });
  pointerdown = computed(() => {
    const manager = new PointerEventManager();
    if (this.multi()) {
      manager.on(Modifier.Shift, e => this.goto(e, {
        selectRange: true
      }));
    }
    if (!this.multi()) {
      return manager.on(e => this.goto(e, {
        selectOne: true
      }));
    }
    if (this.multi() && this.followFocus()) {
      return manager.on(e => this.goto(e, {
        selectOne: true
      })).on(Modifier.Ctrl, e => this.goto(e, {
        toggle: true
      }));
    }
    if (this.multi() && !this.followFocus()) {
      return manager.on(e => this.goto(e, {
        toggle: true
      }));
    }
    return manager;
  });
  id;
  nav;
  currentType;
  allItems;
  disabled;
  activeItem = signal(undefined);
  skipDisabled;
  wrap;
  orientation;
  textDirection;
  multi;
  selectionMode;
  typeaheadDelay;
  value;
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.nav = inputs.nav;
    this.currentType = inputs.currentType;
    this.allItems = inputs.allItems;
    this.focusMode = inputs.focusMode;
    this.disabled = inputs.disabled;
    this.activeItem = inputs.activeItem;
    this.skipDisabled = inputs.skipDisabled;
    this.wrap = inputs.wrap;
    this.orientation = inputs.orientation;
    this.textDirection = inputs.textDirection;
    this.multi = computed(() => this.nav() ? false : this.inputs.multi());
    this.selectionMode = inputs.selectionMode;
    this.typeaheadDelay = inputs.typeaheadDelay;
    this.value = inputs.value;
    this.listBehavior = new List({
      ...inputs,
      items: this.visibleItems,
      multi: this.multi
    });
    this.expansionManager = new ListExpansion({
      multiExpandable: () => true,
      expandedIds: signal([]),
      items: this.children,
      disabled: this.disabled
    });
  }
  setDefaultState() {
    let firstItem;
    for (const item of this.allItems()) {
      if (!item.visible()) continue;
      if (!this.listBehavior.isFocusable(item)) continue;
      if (firstItem === undefined) {
        firstItem = item;
      }
      if (item.selected()) {
        this.activeItem.set(item);
        return;
      }
    }
    if (firstItem !== undefined) {
      this.activeItem.set(firstItem);
    }
  }
  onKeydown(event) {
    if (!this.disabled()) {
      this.keydown().handle(event);
    }
  }
  onPointerdown(event) {
    if (!this.disabled()) {
      this.pointerdown().handle(event);
    }
  }
  goto(e, opts) {
    const item = this._getItem(e);
    if (!item) return;
    this.listBehavior.goto(item, opts);
    this.toggleExpansion(item);
  }
  toggleExpansion(item) {
    item ??= this.activeItem();
    if (!item || !this.listBehavior.isFocusable(item)) return;
    if (!item.expandable()) return;
    if (item.expanded()) {
      this.collapse();
    } else {
      item.expansion.open();
    }
  }
  expand(opts) {
    const item = this.activeItem();
    if (!item || !this.listBehavior.isFocusable(item)) return;
    if (item.expandable() && !item.expanded()) {
      item.expansion.open();
    } else if (item.expanded() && item.children().some(item => this.listBehavior.isFocusable(item))) {
      this.listBehavior.next(opts);
    }
  }
  expandSiblings(item) {
    item ??= this.activeItem();
    const siblings = item?.parent()?.children();
    siblings?.forEach(item => item.expansion.open());
  }
  collapse(opts) {
    const item = this.activeItem();
    if (!item || !this.listBehavior.isFocusable(item)) return;
    if (item.expandable() && item.expanded()) {
      item.expansion.close();
    } else if (item.parent() && item.parent() !== this) {
      const parentItem = item.parent();
      if (parentItem instanceof TreeItemPattern && this.listBehavior.isFocusable(parentItem)) {
        this.listBehavior.goto(parentItem, opts);
      }
    }
  }
  _getItem(event) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    const element = event.target.closest('[role="treeitem"]');
    return this.inputs.allItems().find(i => i.element() === element);
  }
}

class ComboboxTreePattern extends TreePattern {
  inputs;
  isItemCollapsible = () => this.inputs.activeItem()?.parent() instanceof TreeItemPattern;
  role = () => 'tree';
  activeId = computed(() => this.listBehavior.activedescendant());
  items = computed(() => this.inputs.allItems());
  tabindex = () => -1;
  constructor(inputs) {
    if (inputs.combobox()) {
      inputs.multi = () => false;
      inputs.focusMode = () => 'activedescendant';
      inputs.element = inputs.combobox().inputs.inputEl;
    }
    super(inputs);
    this.inputs = inputs;
  }
  onKeydown(_) {}
  onPointerdown(_) {}
  setDefaultState() {}
  focus = item => this.listBehavior.goto(item);
  next = () => this.listBehavior.next();
  prev = () => this.listBehavior.prev();
  last = () => this.listBehavior.last();
  first = () => this.listBehavior.first();
  unfocus = () => this.listBehavior.unfocus();
  select = item => this.listBehavior.select(item);
  clearSelection = () => this.listBehavior.deselectAll();
  getItem = e => this._getItem(e);
  getSelectedItem = () => this.inputs.allItems().find(i => i.selected());
  setValue = value => this.inputs.value.set(value ? [value] : []);
  expandItem = () => this.expand();
  collapseItem = () => this.collapse();
  isItemExpandable(item = this.inputs.activeItem()) {
    return item ? item.expandable() : false;
  }
  expandAll = () => this.items().forEach(item => item.expansion.open());
  collapseAll = () => this.items().forEach(item => item.expansion.close());
}

class DeferredContentAware {
  contentVisible = signal(false, ...(ngDevMode ? [{
    debugName: "contentVisible"
  }] : []));
  preserveContent = model(false, ...(ngDevMode ? [{
    debugName: "preserveContent"
  }] : []));
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: DeferredContentAware,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: DeferredContentAware,
    isStandalone: true,
    inputs: {
      preserveContent: {
        classPropertyName: "preserveContent",
        publicName: "preserveContent",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      preserveContent: "preserveContentChange"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: DeferredContentAware,
  decorators: [{
    type: Directive
  }]
});
class DeferredContent {
  _deferredContentAware = inject(DeferredContentAware, {
    optional: true
  });
  _templateRef = inject(TemplateRef);
  _viewContainerRef = inject(ViewContainerRef);
  _currentViewRef = null;
  _isRendered = false;
  deferredContentAware = signal(this._deferredContentAware, ...(ngDevMode ? [{
    debugName: "deferredContentAware"
  }] : []));
  constructor() {
    afterRenderEffect(() => {
      if (this.deferredContentAware()?.contentVisible()) {
        if (!this._isRendered) {
          this._destroyContent();
          this._currentViewRef = this._viewContainerRef.createEmbeddedView(this._templateRef);
          this._isRendered = true;
        }
      } else if (!this.deferredContentAware()?.preserveContent()) {
        this._destroyContent();
        this._isRendered = false;
      }
    });
  }
  ngOnDestroy() {
    this._destroyContent();
  }
  _destroyContent() {
    const ref = this._currentViewRef;
    if (ref && !ref.destroyed) {
      ref.destroy();
      this._currentViewRef = null;
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: DeferredContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "20.2.0-next.2",
    type: DeferredContent,
    isStandalone: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: DeferredContent,
  decorators: [{
    type: Directive
  }],
  ctorParameters: () => []
});

export { AccordionGroupPattern, AccordionPanelPattern, AccordionTriggerPattern, ComboboxListboxPattern, ComboboxPattern, ComboboxTreePattern, DeferredContent, DeferredContentAware, ListboxPattern, MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern, OptionPattern, RadioButtonPattern, RadioGroupPattern, TabListPattern, TabPanelPattern, TabPattern, ToolbarPattern, ToolbarRadioGroupPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern, TreeItemPattern, TreePattern, convertGetterSetterToWritableSignalLike };
//# sourceMappingURL=private.mjs.map
