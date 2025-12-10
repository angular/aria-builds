import { signal, computed } from '@angular/core';
import { ListFocus, ListNavigation } from './_list-navigation-chunk.mjs';
import { Modifier, KeyboardEventManager, PointerEventManager } from './_pointer-event-manager-chunk.mjs';

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

export { ComboboxListboxPattern, List, ListboxPattern, OptionPattern };
//# sourceMappingURL=_combobox-listbox-chunk.mjs.map
