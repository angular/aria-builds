import { computed, Modifier, KeyboardEventManager } from './_signal-like-chunk.mjs';
import { List } from './_list-chunk.mjs';
import { ListExpansion } from './_expansion-chunk.mjs';
import { PointerEventManager } from './_pointer-event-manager-chunk.mjs';

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

export { ComboboxTreePattern, TreeItemPattern, TreePattern };
//# sourceMappingURL=_combobox-tree-chunk.mjs.map
