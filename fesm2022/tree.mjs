import * as i0 from '@angular/core';
import { inject, computed, ElementRef, signal, input, booleanAttribute, model, afterRenderEffect, untracked, Directive, afterNextRender } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import * as i1 from '@angular/aria/private';
import { ComboboxTreePattern, TreePattern, DeferredContentAware, TreeItemPattern, DeferredContent } from '@angular/aria/private';
import { ComboboxPopup } from './combobox.mjs';
import '@angular/core/rxjs-interop';

function sortDirectives(a, b) {
  return (a.element().compareDocumentPosition(b.element()) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}
class Tree {
  _generatedId = inject(_IdGenerator).getId('ng-tree-', true);
  id = computed(() => this._generatedId, ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  _popup = inject(ComboboxPopup, {
    optional: true
  });
  _elementRef = inject(ElementRef);
  _unorderedItems = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_unorderedItems"
  }] : []));
  orientation = input('vertical', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
  multi = input(false, ...(ngDevMode ? [{
    debugName: "multi",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  selectionMode = input('explicit', ...(ngDevMode ? [{
    debugName: "selectionMode"
  }] : []));
  focusMode = input('roving', ...(ngDevMode ? [{
    debugName: "focusMode"
  }] : []));
  wrap = input(true, ...(ngDevMode ? [{
    debugName: "wrap",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  softDisabled = input(false, ...(ngDevMode ? [{
    debugName: "softDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  typeaheadDelay = input(0.5, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  value = model([], ...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  nav = input(false, ...(ngDevMode ? [{
    debugName: "nav"
  }] : []));
  currentType = input('page', ...(ngDevMode ? [{
    debugName: "currentType"
  }] : []));
  _pattern;
  _hasFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasFocused"
  }] : []));
  constructor() {
    const inputs = {
      ...this,
      id: this.id,
      allItems: computed(() => [...this._unorderedItems()].sort(sortDirectives).map(item => item._pattern)),
      activeItem: signal(undefined),
      element: () => this._elementRef.nativeElement,
      combobox: () => this._popup?.combobox?._pattern
    };
    this._pattern = this._popup?.combobox ? new ComboboxTreePattern(inputs) : new TreePattern(inputs);
    if (this._popup?.combobox) {
      this._popup?.controls?.set(this._pattern);
    }
    afterRenderEffect(() => {
      if (!this._hasFocused()) {
        this._pattern.setDefaultState();
      }
    });
    afterRenderEffect(() => {
      const items = inputs.allItems();
      const activeItem = untracked(() => inputs.activeItem());
      if (!items.some(i => i === activeItem) && activeItem) {
        this._pattern.listBehavior.unfocus();
      }
    });
    afterRenderEffect(() => {
      const items = inputs.allItems();
      const value = untracked(() => this.value());
      if (items && value.some(v => !items.some(i => i.value() === v))) {
        this.value.set(value.filter(v => items.some(i => i.value() === v)));
      }
    });
  }
  onFocus() {
    this._hasFocused.set(true);
  }
  register(child) {
    this._unorderedItems().add(child);
    this._unorderedItems.set(new Set(this._unorderedItems()));
  }
  unregister(child) {
    this._unorderedItems().delete(child);
    this._unorderedItems.set(new Set(this._unorderedItems()));
  }
  scrollActiveItemIntoView(options = {
    block: 'nearest'
  }) {
    this._pattern.inputs.activeItem()?.element().scrollIntoView(options);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: Tree,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: Tree,
    isStandalone: true,
    selector: "[ngTree]",
    inputs: {
      orientation: {
        classPropertyName: "orientation",
        publicName: "orientation",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      multi: {
        classPropertyName: "multi",
        publicName: "multi",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selectionMode: {
        classPropertyName: "selectionMode",
        publicName: "selectionMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      focusMode: {
        classPropertyName: "focusMode",
        publicName: "focusMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      wrap: {
        classPropertyName: "wrap",
        publicName: "wrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      softDisabled: {
        classPropertyName: "softDisabled",
        publicName: "softDisabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      typeaheadDelay: {
        classPropertyName: "typeaheadDelay",
        publicName: "typeaheadDelay",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      value: {
        classPropertyName: "value",
        publicName: "value",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      nav: {
        classPropertyName: "nav",
        publicName: "nav",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      currentType: {
        classPropertyName: "currentType",
        publicName: "currentType",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      value: "valueChange"
    },
    host: {
      attributes: {
        "role": "tree"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "onFocus()"
      },
      properties: {
        "attr.id": "id()",
        "attr.aria-orientation": "_pattern.orientation()",
        "attr.aria-multiselectable": "_pattern.multi()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-activedescendant": "_pattern.activedescendant()",
        "tabindex": "_pattern.tabindex()"
      },
      classAttribute: "ng-tree"
    },
    exportAs: ["ngTree"],
    hostDirectives: [{
      directive: ComboboxPopup
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: Tree,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTree]',
      exportAs: 'ngTree',
      host: {
        'class': 'ng-tree',
        'role': 'tree',
        '[attr.id]': 'id()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '[attr.aria-multiselectable]': '_pattern.multi()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-activedescendant]': '_pattern.activedescendant()',
        '[tabindex]': '_pattern.tabindex()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': 'onFocus()'
      },
      hostDirectives: [{
        directive: ComboboxPopup
      }]
    }]
  }],
  ctorParameters: () => []
});
class TreeItem extends DeferredContentAware {
  _elementRef = inject(ElementRef);
  _id = inject(_IdGenerator).getId('ng-tree-item-', true);
  _group = signal(undefined, ...(ngDevMode ? [{
    debugName: "_group"
  }] : []));
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  parent = input.required(...(ngDevMode ? [{
    debugName: "parent"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  selectable = input(true, ...(ngDevMode ? [{
    debugName: "selectable"
  }] : []));
  label = input(...(ngDevMode ? [undefined, {
    debugName: "label"
  }] : []));
  searchTerm = computed(() => this.label() ?? this.element().textContent, ...(ngDevMode ? [{
    debugName: "searchTerm"
  }] : []));
  tree = computed(() => {
    if (this.parent() instanceof Tree) {
      return this.parent();
    }
    return this.parent().ownedBy().tree();
  }, ...(ngDevMode ? [{
    debugName: "tree"
  }] : []));
  _pattern;
  constructor() {
    super();
    afterNextRender(() => {
      if (this.tree()._pattern instanceof ComboboxTreePattern) {
        this.preserveContent.set(true);
      }
    });
    afterRenderEffect(() => {
      this.tree()._pattern instanceof ComboboxTreePattern ? this.contentVisible.set(true) : this.contentVisible.set(this._pattern.expanded());
    });
  }
  ngOnInit() {
    this.parent().register(this);
    this.tree().register(this);
    const treePattern = computed(() => this.tree()._pattern, ...(ngDevMode ? [{
      debugName: "treePattern"
    }] : []));
    const parentPattern = computed(() => {
      if (this.parent() instanceof Tree) {
        return treePattern();
      }
      return this.parent().ownedBy()._pattern;
    }, ...(ngDevMode ? [{
      debugName: "parentPattern"
    }] : []));
    this._pattern = new TreeItemPattern({
      ...this,
      id: () => this._id,
      tree: treePattern,
      parent: parentPattern,
      children: computed(() => this._group()?.children() ?? []),
      hasChildren: computed(() => !!this._group())
    });
  }
  ngOnDestroy() {
    this.parent().unregister(this);
    this.tree().unregister(this);
  }
  register(group) {
    this._group.set(group);
  }
  unregister() {
    this._group.set(undefined);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: TreeItem,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: TreeItem,
    isStandalone: true,
    selector: "[ngTreeItem]",
    inputs: {
      value: {
        classPropertyName: "value",
        publicName: "value",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      },
      parent: {
        classPropertyName: "parent",
        publicName: "parent",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selectable: {
        classPropertyName: "selectable",
        publicName: "selectable",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      label: {
        classPropertyName: "label",
        publicName: "label",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "treeitem"
      },
      properties: {
        "attr.data-active": "_pattern.active()",
        "id": "_pattern.id()",
        "attr.aria-expanded": "_pattern.expandable() ? _pattern.expanded() : null",
        "attr.aria-selected": "_pattern.selected()",
        "attr.aria-current": "_pattern.current()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-level": "_pattern.level()",
        "attr.aria-setsize": "_pattern.setsize()",
        "attr.aria-posinset": "_pattern.posinset()",
        "attr.tabindex": "_pattern.tabindex()"
      },
      classAttribute: "ng-treeitem"
    },
    exportAs: ["ngTreeItem"],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: TreeItem,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTreeItem]',
      exportAs: 'ngTreeItem',
      host: {
        'class': 'ng-treeitem',
        '[attr.data-active]': '_pattern.active()',
        'role': 'treeitem',
        '[id]': '_pattern.id()',
        '[attr.aria-expanded]': '_pattern.expandable() ? _pattern.expanded() : null',
        '[attr.aria-selected]': '_pattern.selected()',
        '[attr.aria-current]': '_pattern.current()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-level]': '_pattern.level()',
        '[attr.aria-setsize]': '_pattern.setsize()',
        '[attr.aria-posinset]': '_pattern.posinset()',
        '[attr.tabindex]': '_pattern.tabindex()'
      }
    }]
  }],
  ctorParameters: () => []
});
class TreeItemGroup {
  _deferredContent = inject(DeferredContent);
  _unorderedItems = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_unorderedItems"
  }] : []));
  children = computed(() => [...this._unorderedItems()].sort(sortDirectives).map(c => c._pattern), ...(ngDevMode ? [{
    debugName: "children"
  }] : []));
  ownedBy = input.required(...(ngDevMode ? [{
    debugName: "ownedBy"
  }] : []));
  ngOnInit() {
    this._deferredContent.deferredContentAware.set(this.ownedBy());
    this.ownedBy().register(this);
  }
  ngOnDestroy() {
    this.ownedBy().unregister();
  }
  register(child) {
    this._unorderedItems().add(child);
    this._unorderedItems.set(new Set(this._unorderedItems()));
  }
  unregister(child) {
    this._unorderedItems().delete(child);
    this._unorderedItems.set(new Set(this._unorderedItems()));
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: TreeItemGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: TreeItemGroup,
    isStandalone: true,
    selector: "ng-template[ngTreeItemGroup]",
    inputs: {
      ownedBy: {
        classPropertyName: "ownedBy",
        publicName: "ownedBy",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    exportAs: ["ngTreeItemGroup"],
    hostDirectives: [{
      directive: i1.DeferredContent
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: TreeItemGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngTreeItemGroup]',
      exportAs: 'ngTreeItemGroup',
      hostDirectives: [DeferredContent]
    }]
  }]
});

export { Tree, TreeItem, TreeItemGroup };
//# sourceMappingURL=tree.mjs.map
