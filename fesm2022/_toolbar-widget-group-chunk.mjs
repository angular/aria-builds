import { _getEventTarget } from '@angular/cdk/platform';
import { signal, computed, KeyboardEventManager } from './_violations-chunk.mjs';
import { ListFocus, ListNavigation } from './_list-navigation-chunk.mjs';

class ToolbarPattern {
  inputs;
  focusManager;
  navigationBehavior;
  hasBeenInteracted = signal(false);
  orientation;
  softDisabled;
  disabled = computed(() => this.focusManager.isListDisabled());
  tabIndex = computed(() => this.focusManager.getListTabIndex());
  activeDescendant = computed(() => this.focusManager.getActiveDescendant());
  activeItem = () => this.inputs.activeItem();
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
    const activeItem = this.inputs.activeItem();
    manager.on(this._nextKey, () => this.navigationBehavior.next(), {
      ignoreRepeat: false
    }).on(this._prevKey, () => this.navigationBehavior.prev(), {
      ignoreRepeat: false
    }).on('Home', () => this.navigationBehavior.first()).on('End', () => this.navigationBehavior.last());
    if (activeItem?.group()) {
      manager.on(this._altNextKey, () => this._groupNext(), {
        ignoreRepeat: false
      }).on(this._altPrevKey, () => this._groupPrev(), {
        ignoreRepeat: false
      });
    }
    return manager;
  });
  _groupNext() {
    const currGroup = this.inputs.activeItem()?.group();
    const nextGroup = this.navigationBehavior.peekNext()?.group();
    if (!currGroup) {
      return;
    }
    if (currGroup !== nextGroup) {
      this.navigationBehavior.goto(this.navigationBehavior.peekFirst({
        items: currGroup.inputs.items()
      }));
      return;
    }
    this.navigationBehavior.next();
  }
  _groupPrev() {
    const currGroup = this.inputs.activeItem()?.group();
    const nextGroup = this.navigationBehavior.peekPrev()?.group();
    if (!currGroup) {
      return;
    }
    if (currGroup !== nextGroup) {
      this.navigationBehavior.goto(this.navigationBehavior.peekLast({
        items: currGroup.inputs.items()
      }));
      return;
    }
    this.navigationBehavior.prev();
  }
  _goto(e) {
    const item = this.inputs.getItem(_getEventTarget(e));
    if (item) {
      this.navigationBehavior.goto(item);
    }
  }
  constructor(inputs) {
    this.inputs = inputs;
    this.orientation = inputs.orientation;
    this.softDisabled = inputs.softDisabled;
    this.focusManager = new ListFocus({
      ...inputs,
      focusMode: () => 'roving'
    });
    this.navigationBehavior = new ListNavigation({
      ...inputs,
      focusMode: () => 'roving',
      focusManager: this.focusManager
    });
  }
  onKeydown(event) {
    if (this.disabled()) return;
    this.hasBeenInteracted.set(true);
    this._keydown().handle(event);
  }
  onPointerdown(event) {
    this.hasBeenInteracted.set(true);
  }
  onFocusIn() {
    this.hasBeenInteracted.set(true);
  }
  onClick(event) {
    if (this.disabled() || event.pointerType === '') return;
    this._goto(event);
  }
  setDefaultState() {
    const firstItem = this.navigationBehavior.peekFirst({
      items: this.inputs.items()
    });
    if (firstItem) {
      this.inputs.activeItem.set(firstItem);
    }
  }
  setDefaultStateEffect() {
    if (this.hasBeenInteracted()) return;
    if (this.inputs.items().length > 0) {
      this.setDefaultState();
    }
  }
}

class ToolbarWidgetPattern {
  inputs;
  id = () => this.inputs.id();
  element = () => this.inputs.element();
  disabled = () => this.inputs.disabled() || this.group()?.disabled() || false;
  group = () => this.inputs.group();
  toolbar = () => this.inputs.toolbar();
  tabIndex = computed(() => this.toolbar().focusManager.getItemTabIndex(this));
  index = computed(() => this.toolbar().inputs.items().indexOf(this) ?? -1);
  active = computed(() => this.toolbar().activeItem() === this);
  constructor(inputs) {
    this.inputs = inputs;
  }
}

class ToolbarWidgetGroupPattern {
  inputs;
  disabled = () => this.inputs.disabled();
  toolbar = () => this.inputs.toolbar();
  constructor(inputs) {
    this.inputs = inputs;
  }
}

export { ToolbarPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern };
//# sourceMappingURL=_toolbar-widget-group-chunk.mjs.map
