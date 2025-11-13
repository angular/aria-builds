import * as i0 from '@angular/core';
import { signal, computed, model, Directive, inject, TemplateRef, ViewContainerRef, afterRenderEffect } from '@angular/core';
import { PointerEventManager, KeyboardEventManager, ListFocus, ListNavigation, Modifier } from './_widget-chunk.mjs';
export { GridCellPattern, GridCellWidgetPattern, GridPattern, GridRowPattern } from './_widget-chunk.mjs';

class ComboboxPattern {
  inputs;
  expanded = signal(false);
  disabled = () => this.inputs.disabled();
  activeDescendant = computed(() => {
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return null;
    }
    return popupControls?.activeId() ?? null;
  });
  highlightedItem = signal(undefined);
  isDeleting = false;
  isFocused = signal(false);
  hasBeenFocused = signal(false);
  expandKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
  collapseKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
  popupId = computed(() => this.inputs.popupControls()?.id() || null);
  autocomplete = computed(() => this.inputs.filterMode() === 'highlight' ? 'both' : 'list');
  hasPopup = computed(() => this.inputs.popupControls()?.role() || null);
  readonly = computed(() => this.inputs.readonly() || this.inputs.disabled() || null);
  listControls = () => {
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return null;
    }
    return popupControls;
  };
  treeControls = () => {
    const popupControls = this.inputs.popupControls();
    if (popupControls?.role() === 'tree') {
      return popupControls;
    }
    return null;
  };
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    const popupControls = this.inputs.popupControls();
    if (!popupControls) {
      return manager;
    }
    if (popupControls instanceof ComboboxDialogPattern) {
      if (!this.expanded()) {
        manager.on('ArrowUp', () => this.open()).on('ArrowDown', () => this.open());
        if (this.readonly()) {
          manager.on('Enter', () => this.open()).on(' ', () => this.open());
        }
      }
      return manager;
    }
    if (!this.inputs.alwaysExpanded()) {
      manager.on('Escape', () => this.close({
        reset: !this.readonly()
      }));
    }
    if (!this.expanded()) {
      manager.on('ArrowDown', () => this.open({
        first: true
      })).on('ArrowUp', () => this.open({
        last: true
      }));
      if (this.readonly()) {
        manager.on('Enter', () => this.open({
          selected: true
        })).on(' ', () => this.open({
          selected: true
        }));
      }
      return manager;
    }
    manager.on('ArrowDown', () => this.next()).on('ArrowUp', () => this.prev()).on('Home', () => this.first()).on('End', () => this.last());
    if (this.readonly()) {
      manager.on(' ', () => this.select({
        commit: true,
        close: !popupControls.multi()
      }));
    }
    if (popupControls.role() === 'listbox') {
      manager.on('Enter', () => {
        this.select({
          commit: true,
          close: !popupControls.multi()
        });
      });
    }
    const treeControls = this.treeControls();
    if (treeControls?.isItemSelectable()) {
      manager.on('Enter', () => this.select({
        commit: true,
        close: true
      }));
    }
    if (treeControls?.isItemExpandable()) {
      manager.on(this.expandKey(), () => this.expandItem()).on(this.collapseKey(), () => this.collapseItem());
      if (!treeControls.isItemSelectable()) {
        manager.on('Enter', () => this.expandItem());
      }
    }
    if (treeControls?.isItemCollapsible()) {
      manager.on(this.collapseKey(), () => this.collapseItem());
    }
    return manager;
  });
  click = computed(() => new PointerEventManager().on(e => {
    if (e.target === this.inputs.inputEl()) {
      if (this.readonly()) {
        this.expanded() ? this.close() : this.open({
          selected: true
        });
      }
    }
    const controls = this.inputs.popupControls();
    if (controls instanceof ComboboxDialogPattern) {
      return;
    }
    const item = controls?.getItem(e);
    if (item) {
      if (controls?.role() === 'tree') {
        const treeControls = controls;
        if (treeControls.isItemExpandable(item) && !treeControls.isItemSelectable(item)) {
          treeControls.toggleExpansion(item);
          this.inputs.inputEl()?.focus();
          return;
        }
      }
      this.select({
        item,
        commit: true,
        close: !controls?.multi()
      });
      this.inputs.inputEl()?.focus();
    }
  }));
  constructor(inputs) {
    this.inputs = inputs;
  }
  onKeydown(event) {
    if (!this.inputs.disabled()) {
      this.keydown().handle(event);
    }
  }
  onClick(event) {
    if (!this.inputs.disabled()) {
      this.click().handle(event);
    }
  }
  onInput(event) {
    if (this.inputs.disabled() || this.inputs.readonly()) {
      return;
    }
    const inputEl = this.inputs.inputEl();
    if (!inputEl) {
      return;
    }
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return;
    }
    this.open();
    this.inputs.inputValue?.set(inputEl.value);
    this.isDeleting = event instanceof InputEvent && !!event.inputType.match(/^delete/);
    if (this.inputs.filterMode() === 'highlight' && !this.isDeleting) {
      this.highlight();
    }
  }
  onFocusIn() {
    if (this.inputs.alwaysExpanded() && !this.hasBeenFocused()) {
      const firstSelectedItem = this.listControls()?.getSelectedItems()[0];
      firstSelectedItem ? this.listControls()?.focus(firstSelectedItem) : this.first();
    }
    this.isFocused.set(true);
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    if (this.inputs.disabled()) {
      return;
    }
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return;
    }
    if (!(event.relatedTarget instanceof HTMLElement) || !this.inputs.containerEl()?.contains(event.relatedTarget)) {
      this.isFocused.set(false);
      if (this.readonly()) {
        this.close();
        return;
      }
      if (this.inputs.filterMode() !== 'manual') {
        this.commit();
      } else {
        const item = popupControls?.items().find(i => i.searchTerm() === this.inputs.inputEl()?.value);
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
    if (this.listControls()?.role() === 'listbox') {
      return this.listControls()?.items()[0];
    }
    return this.listControls()?.items().find(i => i.value() === this.inputs.firstMatch());
  });
  onFilter() {
    if (this.readonly()) {
      return;
    }
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return;
    }
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
      popupControls?.clearSelection();
      popupControls?.unfocus();
      return;
    }
    popupControls?.focus(item);
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
    const selectedItems = this.listControls()?.getSelectedItems();
    const item = selectedItems?.[0];
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
  close(opts) {
    const popupControls = this.inputs.popupControls();
    if (this.inputs.alwaysExpanded()) {
      return;
    }
    if (popupControls instanceof ComboboxDialogPattern) {
      this.expanded.set(false);
      return;
    }
    if (this.readonly()) {
      this.expanded.set(false);
      popupControls?.unfocus();
      return;
    }
    if (!opts?.reset) {
      if (this.inputs.filterMode() === 'manual') {
        if (!this.listControls()?.items().some(i => i.searchTerm() === this.inputs.inputEl()?.value)) {
          this.listControls()?.clearSelection();
        }
      }
      this.expanded.set(false);
      popupControls?.unfocus();
      return;
    }
    if (!this.expanded()) {
      this.inputs.inputValue?.set('');
      popupControls?.clearSelection();
      const inputEl = this.inputs.inputEl();
      if (inputEl) {
        inputEl.value = '';
      }
    } else if (this.expanded()) {
      this.close();
      const selectedItem = popupControls?.getSelectedItems()?.[0];
      if (selectedItem?.searchTerm() !== this.inputs.inputValue()) {
        popupControls?.clearSelection();
      }
    }
    this.close();
    if (!this.readonly()) {
      popupControls?.clearSelection();
    }
  }
  open(nav) {
    this.expanded.set(true);
    const popupControls = this.inputs.popupControls();
    if (popupControls instanceof ComboboxDialogPattern) {
      return;
    }
    const inputEl = this.inputs.inputEl();
    if (inputEl && this.inputs.filterMode() === 'highlight') {
      const isHighlighting = inputEl.selectionStart !== inputEl.value.length;
      this.inputs.inputValue?.set(inputEl.value.slice(0, inputEl.selectionStart || 0));
      if (!isHighlighting) {
        this.highlightedItem.set(undefined);
      }
    }
    if (nav?.first) {
      this.first();
    }
    if (nav?.last) {
      this.last();
    }
    if (nav?.selected) {
      const selectedItem = popupControls?.items().find(i => popupControls?.getSelectedItems().includes(i));
      selectedItem ? popupControls?.focus(selectedItem) : this.first();
    }
  }
  next() {
    this._navigate(() => this.listControls()?.next());
  }
  prev() {
    this._navigate(() => this.listControls()?.prev());
  }
  first() {
    this._navigate(() => this.listControls()?.first());
  }
  last() {
    this._navigate(() => this.listControls()?.last());
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
    const controls = this.listControls();
    if (opts.item) {
      controls?.focus(opts.item, {
        focusElement: false
      });
    }
    controls?.multi() ? controls.toggle(opts.item) : controls?.select(opts.item);
    if (opts.commit) {
      this.commit();
    }
    if (opts.close) {
      this.close();
    }
  }
  commit() {
    const inputEl = this.inputs.inputEl();
    const selectedItems = this.listControls()?.getSelectedItems();
    if (!inputEl) {
      return;
    }
    inputEl.value = selectedItems?.map(i => i.searchTerm()).join(', ') || '';
    this.inputs.inputValue?.set(inputEl.value);
    if (this.inputs.filterMode() === 'highlight' && !this.readonly()) {
      const length = inputEl.value.length;
      inputEl.setSelectionRange(length, length);
    }
  }
  _navigate(operation) {
    operation();
    if (this.inputs.filterMode() !== 'manual') {
      this.select();
    }
    if (this.inputs.filterMode() === 'highlight') {
      const selectedItem = this.listControls()?.getSelectedItems()[0];
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
class ComboboxDialogPattern {
  inputs;
  id = () => this.inputs.id();
  role = () => 'dialog';
  keydown = computed(() => {
    return new KeyboardEventManager().on('Escape', () => this.inputs.combobox.close());
  });
  constructor(inputs) {
    this.inputs = inputs;
  }
  onKeydown(event) {
    this.keydown().handle(event);
  }
  onClick(event) {
    if (event.target === this.inputs.element()) {
      this.inputs.combobox.close();
    }
  }
}

class ListSelection {
  inputs;
  rangeStartIndex = signal(0);
  rangeEndIndex = signal(0);
  selectedItems = computed(() => this.inputs.items().filter(item => this.inputs.values().includes(item.value())));
  constructor(inputs) {
    this.inputs = inputs;
  }
  select(item, opts = {
    anchor: true
  }) {
    item = item ?? this.inputs.focusManager.inputs.activeItem();
    if (!item || item.disabled() || !item.selectable() || this.inputs.values().includes(item.value())) {
      return;
    }
    if (!this.inputs.multi()) {
      this.deselectAll();
    }
    const index = this.inputs.items().findIndex(i => i === item);
    if (opts.anchor) {
      this.beginRangeSelection(index);
    }
    this.inputs.values.update(values => values.concat(item.value()));
  }
  deselect(item) {
    item = item ?? this.inputs.focusManager.inputs.activeItem();
    if (item && !item.disabled() && item.selectable()) {
      this.inputs.values.update(values => values.filter(value => value !== item.value()));
    }
  }
  toggle(item) {
    item = item ?? this.inputs.focusManager.inputs.activeItem();
    if (item) {
      this.inputs.values().includes(item.value()) ? this.deselect(item) : this.select(item);
    }
  }
  toggleOne() {
    const item = this.inputs.focusManager.inputs.activeItem();
    if (item) {
      this.inputs.values().includes(item.value()) ? this.deselect() : this.selectOne();
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
    for (const value of this.inputs.values()) {
      const item = this.inputs.items().find(i => i.value() === value);
      item ? this.deselect(item) : this.inputs.values.update(values => values.filter(v => v !== value));
    }
  }
  toggleAll() {
    const selectableValues = this.inputs.items().filter(i => !i.disabled() && i.selectable()).map(i => i.value());
    selectableValues.every(i => this.inputs.values().includes(i)) ? this.deselectAll() : this.selectAll();
  }
  selectOne() {
    const item = this.inputs.focusManager.inputs.activeItem();
    if (item && (item.disabled() || !item.selectable())) {
      return;
    }
    this.deselectAll();
    if (this.inputs.values().length > 0 && !this.inputs.multi()) {
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
    }, this.inputs.typeaheadDelay());
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
  activeDescendant = computed(() => this.focusBehavior.getActiveDescendant());
  tabIndex = computed(() => this.focusBehavior.getListTabIndex());
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
    return this.focusBehavior.getItemTabIndex(item);
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
  deselect(item) {
    this.selectionBehavior.deselect(item);
  }
  deselectAll() {
    this.selectionBehavior.deselectAll();
  }
  toggle(item) {
    this.selectionBehavior.toggle(item);
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
  tabIndex = computed(() => this.listBehavior.tabIndex());
  activeDescendant = computed(() => this.listBehavior.activeDescendant());
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
    if (!this.inputs.multi() && this.inputs.values().length > 1) {
      violations.push(`A single-select listbox should not have multiple selected options. Selected options: ${this.inputs.values().join(', ')}`);
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
  selected = computed(() => this.listbox()?.inputs.values().includes(this.value()));
  selectable = () => true;
  disabled;
  searchTerm;
  listbox;
  tabIndex = computed(() => this.listbox()?.listBehavior.getItemTabindex(this));
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
  activeId = computed(() => this.listBehavior.activeDescendant());
  items = computed(() => this.inputs.items());
  tabIndex = () => -1;
  multi = computed(() => {
    return this.inputs.combobox()?.readonly() ? this.inputs.multi() : false;
  });
  constructor(inputs) {
    if (inputs.combobox()) {
      inputs.focusMode = () => 'activedescendant';
      inputs.element = inputs.combobox().inputs.inputEl;
    }
    super(inputs);
    this.inputs = inputs;
  }
  onKeydown(_) {}
  onPointerdown(_) {}
  setDefaultState() {}
  focus = (item, opts) => {
    this.listBehavior.goto(item, opts);
  };
  getActiveItem = () => this.inputs.activeItem();
  next = () => this.listBehavior.next();
  prev = () => this.listBehavior.prev();
  last = () => this.listBehavior.last();
  first = () => this.listBehavior.first();
  unfocus = () => this.listBehavior.unfocus();
  select = item => this.listBehavior.select(item);
  toggle = item => this.listBehavior.toggle(item);
  clearSelection = () => this.listBehavior.deselectAll();
  getItem = e => this._getItem(e);
  getSelectedItems = () => {
    const items = [];
    for (const value of this.inputs.values()) {
      const item = this.items().find(i => i.value() === value);
      if (item) {
        items.push(item);
      }
    }
    return items;
  };
  setValue = value => this.inputs.values.set(value ? [value] : []);
}

class MenuPattern {
  inputs;
  id;
  role = () => 'menu';
  disabled = () => this.inputs.disabled();
  isVisible = computed(() => this.inputs.parent() ? !!this.inputs.parent()?.expanded() : true);
  listBehavior;
  isFocused = signal(false);
  hasBeenFocused = signal(false);
  _openTimeout;
  _closeTimeout;
  tabIndex = () => this.listBehavior.tabIndex();
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
      values: signal([])
    });
  }
  setDefaultState() {
    if (!this.inputs.parent()) {
      this.listBehavior.goto(this.inputs.items()[0], {
        focusElement: false
      });
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
    const parent = this.inputs.parent();
    const activeItem = this?.inputs.activeItem();
    if (parent instanceof MenuItemPattern) {
      const grandparent = parent.inputs.parent();
      if (grandparent instanceof MenuPattern) {
        grandparent._clearTimeouts();
        grandparent.listBehavior.goto(parent, {
          focusElement: false
        });
      }
    }
    if (activeItem && activeItem !== item) {
      this._closeItem(activeItem);
    }
    if (item.expanded()) {
      this._clearCloseTimeout();
    }
    this._openItem(item);
    this.listBehavior.goto(item, {
      focusElement: this.shouldFocus()
    });
  }
  _closeItem(item) {
    this._clearOpenTimeout();
    if (!this._closeTimeout) {
      this._closeTimeout = setTimeout(() => {
        item.close();
        this._closeTimeout = undefined;
      }, this.inputs.expansionDelay());
    }
  }
  _openItem(item) {
    this._clearOpenTimeout();
    this._openTimeout = setTimeout(() => {
      item.open();
      this._openTimeout = undefined;
    }, this.inputs.expansionDelay());
  }
  onMouseOut(event) {
    this._clearOpenTimeout();
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
      const item = siblings?.find(i => i.element()?.contains(relatedTarget));
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
      if (!item.submenu() && isMenuTrigger) {
        root.close({
          refocus: true
        });
      }
      if (!item.submenu() && isMenuBar) {
        root.close();
        root?.inputs.onSelect?.(item.value());
      }
      if (!item.submenu() && isMenu) {
        root.inputs.activeItem()?.close({
          refocus: true
        });
        root?.inputs.onSelect?.(item.value());
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
  close() {
    this.inputs.parent()?.close();
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
  _clearTimeouts() {
    this._clearOpenTimeout();
    this._clearCloseTimeout();
  }
  _clearOpenTimeout() {
    if (this._openTimeout) {
      clearTimeout(this._openTimeout);
      this._openTimeout = undefined;
    }
  }
  _clearCloseTimeout() {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = undefined;
    }
  }
}
class MenuBarPattern {
  inputs;
  listBehavior;
  tabIndex = () => this.listBehavior.tabIndex();
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
  disabled = () => this.inputs.disabled();
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
    this.listBehavior = new List(inputs);
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
  hasBeenFocused = signal(false);
  role = () => 'button';
  hasPopup = () => true;
  menu;
  tabIndex = computed(() => this.expanded() && this.menu()?.inputs.activeItem() ? -1 : 0);
  disabled = () => this.inputs.disabled();
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
    this.menu = this.inputs.menu;
  }
  onKeydown(event) {
    if (!this.inputs.disabled()) {
      this.keydownManager().handle(event);
    }
  }
  onClick() {
    if (!this.inputs.disabled()) {
      this.expanded() ? this.close() : this.open({
        first: true
      });
    }
  }
  onFocusIn() {
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    const element = this.inputs.element();
    const relatedTarget = event.relatedTarget;
    if (this.expanded() && !element?.contains(relatedTarget) && !this.inputs.menu()?.inputs.element()?.contains(relatedTarget)) {
      this.close();
    }
  }
  open(opts) {
    this.expanded.set(true);
    if (opts?.first) {
      this.inputs.menu()?.first();
    } else if (opts?.last) {
      this.inputs.menu()?.last();
    }
  }
  close(opts = {}) {
    this.expanded.set(false);
    this.menu()?.listBehavior.unfocus();
    if (opts.refocus) {
      this.inputs.element()?.focus();
    }
    let menuitems = this.inputs.menu()?.inputs.items() ?? [];
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
  disabled = () => this.inputs.parent()?.disabled() || this.inputs.disabled();
  searchTerm;
  element;
  isActive = computed(() => this.inputs.parent()?.inputs.activeItem() === this);
  hasBeenFocused = signal(false);
  tabIndex = computed(() => {
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
    this.submenu = this.inputs.submenu;
    this.searchTerm = inputs.searchTerm;
    this.selectable = computed(() => !this.submenu());
  }
  open(opts) {
    if (this.disabled()) {
      return;
    }
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
      const parent = menuitem?.inputs.parent();
      if (parent instanceof MenuPattern) {
        parent._clearTimeouts();
      }
    }
  }
  onFocusIn() {
    this.hasBeenFocused.set(true);
  }
}

function convertGetterSetterToWritableSignalLike(getter, setter) {
  return Object.assign(getter, {
    set: setter,
    update: updateCallback => setter(updateCallback(getter()))
  });
}

class ListExpansion {
  inputs;
  constructor(inputs) {
    this.inputs = inputs;
  }
  open(item) {
    if (!this.isExpandable(item)) return false;
    if (item.expanded()) return false;
    if (!this.inputs.multiExpandable()) {
      this.closeAll();
    }
    item.expanded.set(true);
    return true;
  }
  close(item) {
    if (!this.isExpandable(item)) return false;
    item.expanded.set(false);
    return true;
  }
  toggle(item) {
    return item.expanded() ? this.close(item) : this.open(item);
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
  id = () => this.inputs.id();
  index = computed(() => this.inputs.tablist().inputs.items().indexOf(this));
  value = () => this.inputs.value();
  disabled = () => this.inputs.disabled();
  element = () => this.inputs.element();
  expandable = () => true;
  expanded;
  active = computed(() => this.inputs.tablist().inputs.activeItem() === this);
  selected = computed(() => this.inputs.tablist().selectedTab() === this);
  tabIndex = computed(() => this.inputs.tablist().focusBehavior.getItemTabIndex(this));
  controls = computed(() => this.inputs.tabpanel()?.id());
  constructor(inputs) {
    this.inputs = inputs;
    this.expanded = inputs.expanded;
  }
  open() {
    return this.inputs.tablist().open(this);
  }
}
class TabPanelPattern {
  inputs;
  id = () => this.inputs.id();
  value = () => this.inputs.value();
  labelManager;
  hidden = computed(() => this.inputs.tab()?.expanded() === false);
  tabIndex = computed(() => this.hidden() ? -1 : 0);
  labelledBy = computed(() => this.labelManager.labelledBy().length > 0 ? this.labelManager.labelledBy().join(' ') : undefined);
  constructor(inputs) {
    this.inputs = inputs;
    this.labelManager = new LabelControl({
      ...inputs,
      defaultLabelledBy: computed(() => this.inputs.tab() ? [this.inputs.tab().id()] : [])
    });
  }
}
class TabListPattern {
  inputs;
  focusBehavior;
  navigationBehavior;
  expansionBehavior;
  activeTab = () => this.inputs.activeItem();
  selectedTab = signal(undefined);
  orientation = () => this.inputs.orientation();
  disabled = () => this.inputs.disabled();
  tabIndex = computed(() => this.focusBehavior.getListTabIndex());
  activeDescendant = computed(() => this.focusBehavior.getActiveDescendant());
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
    return new KeyboardEventManager().on(this.prevKey, () => this._navigate(() => this.navigationBehavior.prev(), this.followFocus())).on(this.nextKey, () => this._navigate(() => this.navigationBehavior.next(), this.followFocus())).on('Home', () => this._navigate(() => this.navigationBehavior.first(), this.followFocus())).on('End', () => this._navigate(() => this.navigationBehavior.last(), this.followFocus())).on(' ', () => this.open()).on('Enter', () => this.open());
  });
  pointerdown = computed(() => {
    return new PointerEventManager().on(e => this._navigate(() => this.navigationBehavior.goto(this._getItem(e)), true));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.focusBehavior = new ListFocus(inputs);
    this.navigationBehavior = new ListNavigation({
      ...inputs,
      focusManager: this.focusBehavior
    });
    this.expansionBehavior = new ListExpansion({
      ...inputs,
      multiExpandable: () => false
    });
  }
  setDefaultState() {
    let firstItem;
    for (const item of this.inputs.items()) {
      if (!this.focusBehavior.isFocusable(item)) continue;
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
  open(tab) {
    tab ??= this.activeTab();
    if (typeof tab === 'string') {
      tab = this.inputs.items().find(t => t.value() === tab);
    }
    if (tab === undefined) return false;
    const success = this.expansionBehavior.open(tab);
    if (success) {
      this.selectedTab.set(tab);
    }
    return success;
  }
  _navigate(op, shouldExpand = false) {
    const success = op();
    if (success && shouldExpand) {
      this.open();
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

class ToolbarPattern {
  inputs;
  listBehavior;
  orientation;
  softDisabled;
  disabled = computed(() => this.listBehavior.disabled());
  tabIndex = computed(() => this.listBehavior.tabIndex());
  activeDescendant = computed(() => this.listBehavior.activeDescendant());
  activeItem = () => this.listBehavior.inputs.activeItem();
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
    return manager.on(this._nextKey, () => this.listBehavior.next()).on(this._prevKey, () => this.listBehavior.prev()).on(this._altNextKey, () => this._groupNext()).on(this._altPrevKey, () => this._groupPrev()).on(' ', () => this.select()).on('Enter', () => this.select()).on('Home', () => this.listBehavior.first()).on('End', () => this.listBehavior.last());
  });
  _groupNext() {
    const currGroup = this.inputs.activeItem()?.group();
    const nextGroup = this.listBehavior.navigationBehavior.peekNext()?.group();
    if (!currGroup) {
      return;
    }
    if (currGroup !== nextGroup) {
      this.listBehavior.goto(this.listBehavior.navigationBehavior.peekFirst(currGroup.inputs.items()));
      return;
    }
    this.listBehavior.next();
  }
  _groupPrev() {
    const currGroup = this.inputs.activeItem()?.group();
    const nextGroup = this.listBehavior.navigationBehavior.peekPrev()?.group();
    if (!currGroup) {
      return;
    }
    if (currGroup !== nextGroup) {
      this.listBehavior.goto(this.listBehavior.navigationBehavior.peekLast(currGroup.inputs.items()));
      return;
    }
    this.listBehavior.prev();
  }
  _goto(e) {
    const item = this.inputs.getItem(e.target);
    if (item) {
      this.listBehavior.goto(item);
      this.select();
    }
  }
  select() {
    const group = this.inputs.activeItem()?.group();
    if (!group?.multi()) {
      group?.inputs.items().forEach(i => this.listBehavior.deselect(i));
    }
    this.listBehavior.toggle();
  }
  constructor(inputs) {
    this.inputs = inputs;
    this.orientation = inputs.orientation;
    this.softDisabled = inputs.softDisabled;
    this.listBehavior = new List({
      ...inputs,
      multi: () => true,
      focusMode: () => 'roving',
      selectionMode: () => 'explicit',
      values: signal([]),
      typeaheadDelay: () => 0
    });
  }
  onKeydown(event) {
    if (this.disabled()) return;
    this._keydown().handle(event);
  }
  onPointerdown(event) {
    event.preventDefault();
  }
  onClick(event) {
    if (this.disabled()) return;
    this._goto(event);
  }
  setDefaultState() {
    const firstItem = this.listBehavior.navigationBehavior.peekFirst(this.inputs.items());
    if (firstItem) {
      this.inputs.activeItem.set(firstItem);
    }
  }
  validate() {
    const violations = [];
    return violations;
  }
}

class ToolbarWidgetPattern {
  inputs;
  id = () => this.inputs.id();
  element = () => this.inputs.element();
  disabled = () => this.inputs.disabled() || this.group()?.disabled() || false;
  group = () => this.inputs.group();
  toolbar = () => this.inputs.toolbar();
  tabIndex = computed(() => this.toolbar().listBehavior.getItemTabindex(this));
  searchTerm = () => '';
  value = () => this.inputs.value();
  selectable = () => true;
  index = computed(() => this.toolbar().inputs.items().indexOf(this) ?? -1);
  selected = computed(() => this.toolbar().listBehavior.inputs.values().includes(this.value()));
  active = computed(() => this.toolbar().activeItem() === this);
  constructor(inputs) {
    this.inputs = inputs;
  }
}

class ToolbarWidgetGroupPattern {
  inputs;
  disabled = () => this.inputs.disabled();
  toolbar = () => this.inputs.toolbar();
  multi = () => this.inputs.multi();
  searchTerm = () => '';
  value = () => '';
  selectable = () => true;
  element = () => undefined;
  constructor(inputs) {
    this.inputs = inputs;
  }
}

const focusMode = () => 'roving';
class AccordionGroupPattern {
  inputs;
  navigationBehavior;
  focusBehavior;
  expansionBehavior;
  constructor(inputs) {
    this.inputs = inputs;
    this.focusBehavior = new ListFocus({
      ...inputs,
      focusMode
    });
    this.navigationBehavior = new ListNavigation({
      ...inputs,
      focusMode,
      focusManager: this.focusBehavior
    });
    this.expansionBehavior = new ListExpansion({
      ...inputs
    });
  }
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
    return new KeyboardEventManager().on(this.prevKey, () => this.navigationBehavior.prev()).on(this.nextKey, () => this.navigationBehavior.next()).on('Home', () => this.navigationBehavior.first()).on('End', () => this.navigationBehavior.last()).on(' ', () => this.toggle()).on('Enter', () => this.toggle());
  });
  pointerdown = computed(() => {
    return new PointerEventManager().on(e => {
      const item = this.inputs.getItem(e.target);
      if (!item) return;
      this.navigationBehavior.goto(item);
      this.expansionBehavior.toggle(item);
    });
  });
  onKeydown(event) {
    this.keydown().handle(event);
  }
  onPointerdown(event) {
    this.pointerdown().handle(event);
  }
  onFocus(event) {
    const item = this.inputs.getItem(event.target);
    if (!item) return;
    if (!this.focusBehavior.isFocusable(item)) return;
    this.focusBehavior.focus(item);
  }
  toggle() {
    const activeItem = this.inputs.activeItem();
    if (activeItem === undefined) return;
    this.expansionBehavior.toggle(activeItem);
  }
}
class AccordionTriggerPattern {
  inputs;
  id = () => this.inputs.id();
  element = () => this.inputs.element();
  expandable = () => true;
  expanded;
  active = computed(() => this.inputs.accordionGroup().inputs.activeItem() === this);
  controls = computed(() => this.inputs.accordionPanel()?.inputs.id());
  tabIndex = computed(() => this.inputs.accordionGroup().focusBehavior.isFocusable(this) ? 0 : -1);
  disabled = computed(() => this.inputs.disabled() || this.inputs.accordionGroup().inputs.disabled());
  hardDisabled = computed(() => this.disabled() && !this.inputs.accordionGroup().inputs.softDisabled());
  index = computed(() => this.inputs.accordionGroup().inputs.items().indexOf(this));
  constructor(inputs) {
    this.inputs = inputs;
    this.expanded = inputs.expanded;
  }
  open() {
    this.inputs.accordionGroup().expansionBehavior.open(this);
  }
  close() {
    this.inputs.accordionGroup().expansionBehavior.close(this);
  }
  toggle() {
    this.inputs.accordionGroup().expansionBehavior.toggle(this);
  }
}
class AccordionPanelPattern {
  inputs;
  id;
  accordionTrigger;
  hidden;
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.accordionTrigger = inputs.accordionTrigger;
    this.hidden = computed(() => inputs.accordionTrigger()?.expanded() === false);
  }
}

class TreeItemPattern {
  inputs;
  id = () => this.inputs.id();
  value = () => this.inputs.value();
  element = () => this.inputs.element();
  disabled = () => this.inputs.disabled();
  searchTerm = () => this.inputs.searchTerm();
  tree = () => this.inputs.tree();
  parent = () => this.inputs.parent();
  children = () => this.inputs.children();
  index = computed(() => this.tree().visibleItems().indexOf(this));
  expansionBehavior;
  expandable = () => this.inputs.hasChildren();
  selectable = () => this.inputs.selectable();
  expanded;
  level = computed(() => this.parent().level() + 1);
  visible = computed(() => this.parent().expanded() && this.parent().visible());
  setsize = computed(() => this.parent().children().length);
  posinset = computed(() => this.parent().children().indexOf(this) + 1);
  active = computed(() => this.tree().activeItem() === this);
  tabIndex = computed(() => this.tree().listBehavior.getItemTabindex(this));
  selected = computed(() => {
    if (this.tree().nav()) {
      return undefined;
    }
    if (!this.selectable()) {
      return undefined;
    }
    return this.tree().values().includes(this.value());
  });
  current = computed(() => {
    if (!this.tree().nav()) {
      return undefined;
    }
    if (!this.selectable()) {
      return undefined;
    }
    return this.tree().values().includes(this.value()) ? this.tree().currentType() : undefined;
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.expanded = inputs.expanded;
    this.expansionBehavior = new ListExpansion({
      ...inputs,
      multiExpandable: () => true,
      items: this.children,
      disabled: computed(() => this.tree()?.disabled() ?? false)
    });
  }
}
class TreePattern {
  inputs;
  listBehavior;
  expansionBehavior;
  level = () => 0;
  expanded = () => true;
  visible = () => true;
  tabIndex = computed(() => this.listBehavior.tabIndex());
  activeDescendant = computed(() => this.listBehavior.activeDescendant());
  children = computed(() => this.inputs.allItems().filter(item => item.level() === this.level() + 1));
  visibleItems = computed(() => this.inputs.allItems().filter(item => item.visible()));
  followFocus = computed(() => this.inputs.selectionMode() === 'follow');
  isRtl = computed(() => this.inputs.textDirection() === 'rtl');
  prevKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowUp';
    }
    return this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
  });
  nextKey = computed(() => {
    if (this.inputs.orientation() === 'vertical') {
      return 'ArrowDown';
    }
    return this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
  });
  collapseKey = computed(() => {
    if (this.inputs.orientation() === 'horizontal') {
      return 'ArrowUp';
    }
    return this.isRtl() ? 'ArrowRight' : 'ArrowLeft';
  });
  expandKey = computed(() => {
    if (this.inputs.orientation() === 'horizontal') {
      return 'ArrowDown';
    }
    return this.isRtl() ? 'ArrowLeft' : 'ArrowRight';
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
      manager.on(this.dynamicSpaceKey, () => list.toggle()).on('Enter', () => list.toggle(), {
        preventDefault: !this.nav()
      }).on([Modifier.Ctrl, Modifier.Meta], 'A', () => list.toggleAll());
    }
    if (!this.followFocus() && !this.inputs.multi()) {
      manager.on(this.dynamicSpaceKey, () => list.selectOne());
      manager.on('Enter', () => list.selectOne(), {
        preventDefault: !this.nav()
      });
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
  id = () => this.inputs.id();
  element = () => this.inputs.element();
  nav = () => this.inputs.nav();
  currentType = () => this.inputs.currentType();
  allItems = () => this.inputs.allItems();
  focusMode = () => this.inputs.focusMode();
  disabled = () => this.inputs.disabled();
  activeItem;
  softDisabled = () => this.inputs.softDisabled();
  wrap = () => this.inputs.wrap();
  orientation = () => this.inputs.orientation();
  textDirection = () => this.textDirection();
  multi = computed(() => this.nav() ? false : this.inputs.multi());
  selectionMode = () => this.inputs.selectionMode();
  typeaheadDelay = () => this.inputs.typeaheadDelay();
  values;
  constructor(inputs) {
    this.inputs = inputs;
    this.activeItem = inputs.activeItem;
    this.values = inputs.values;
    this.listBehavior = new List({
      ...inputs,
      items: this.visibleItems,
      multi: this.multi
    });
    this.expansionBehavior = new ListExpansion({
      multiExpandable: () => true,
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
      this.expansionBehavior.open(item);
    }
  }
  expand(opts) {
    const item = this.activeItem();
    if (!item || !this.listBehavior.isFocusable(item)) return;
    if (item.expandable() && !item.expanded()) {
      this.expansionBehavior.open(item);
    } else if (item.expanded() && item.children().some(item => this.listBehavior.isFocusable(item))) {
      this.listBehavior.next(opts);
    }
  }
  expandSiblings(item) {
    item ??= this.activeItem();
    const siblings = item?.parent()?.children();
    siblings?.forEach(item => this.expansionBehavior.open(item));
  }
  collapse(opts) {
    const item = this.activeItem();
    if (!item || !this.listBehavior.isFocusable(item)) return;
    if (item.expandable() && item.expanded()) {
      this.expansionBehavior.close(item);
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
  activeId = computed(() => this.listBehavior.activeDescendant());
  getActiveItem = () => this.inputs.activeItem();
  items = computed(() => this.inputs.allItems());
  tabIndex = () => -1;
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
  toggle = item => this.listBehavior.toggle(item);
  clearSelection = () => this.listBehavior.deselectAll();
  getItem = e => this._getItem(e);
  getSelectedItems = () => this.inputs.allItems().filter(item => item.selected());
  setValue = value => this.inputs.values.set(value ? [value] : []);
  expandItem = () => this.expand();
  collapseItem = () => this.collapse();
  isItemExpandable(item = this.inputs.activeItem()) {
    return item ? item.expandable() : false;
  }
  expandAll = () => this.items().forEach(item => this.expansionBehavior.open(item));
  collapseAll = () => this.items().forEach(item => item.expansionBehavior.close(item));
  isItemSelectable = (item = this.inputs.activeItem()) => {
    return item ? item.selectable() : false;
  };
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

export { AccordionGroupPattern, AccordionPanelPattern, AccordionTriggerPattern, ComboboxDialogPattern, ComboboxListboxPattern, ComboboxPattern, ComboboxTreePattern, DeferredContent, DeferredContentAware, ListboxPattern, MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern, OptionPattern, TabListPattern, TabPanelPattern, TabPattern, ToolbarPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern, TreeItemPattern, TreePattern, convertGetterSetterToWritableSignalLike };
//# sourceMappingURL=private.mjs.map
