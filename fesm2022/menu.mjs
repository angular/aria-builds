import * as i0 from '@angular/core';
import { inject, ElementRef, input, computed, booleanAttribute, effect, Directive, contentChildren, signal, output, afterRenderEffect, untracked, model } from '@angular/core';
import * as i1 from '@angular/aria/private';
import { MenuTriggerPattern, DeferredContentAware, MenuPattern, MenuBarPattern, MenuItemPattern, DeferredContent } from '@angular/aria/private';
import { _IdGenerator } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';

class MenuTrigger {
  _elementRef = inject(ElementRef);
  textDirection = inject(Directionality).valueSignal;
  element = this._elementRef.nativeElement;
  menu = input(undefined, ...(ngDevMode ? [{
    debugName: "menu"
  }] : []));
  expanded = computed(() => this._pattern.expanded(), ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  hasPopup = computed(() => this._pattern.hasPopup(), ...(ngDevMode ? [{
    debugName: "hasPopup"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  softDisabled = input(true, ...(ngDevMode ? [{
    debugName: "softDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  _pattern = new MenuTriggerPattern({
    textDirection: this.textDirection,
    element: computed(() => this._elementRef.nativeElement),
    menu: computed(() => this.menu()?._pattern),
    disabled: () => this.disabled()
  });
  constructor() {
    effect(() => this.menu()?.parent.set(this));
  }
  open() {
    this._pattern.open({
      first: true
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: MenuTrigger,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: MenuTrigger,
    isStandalone: true,
    selector: "button[ngMenuTrigger]",
    inputs: {
      menu: {
        classPropertyName: "menu",
        publicName: "menu",
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
      softDisabled: {
        classPropertyName: "softDisabled",
        publicName: "softDisabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      listeners: {
        "click": "_pattern.onClick()",
        "keydown": "_pattern.onKeydown($event)",
        "focusout": "_pattern.onFocusOut($event)",
        "focusin": "_pattern.onFocusIn()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.disabled": "!softDisabled() && _pattern.disabled() ? true : null",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-haspopup": "hasPopup()",
        "attr.aria-expanded": "expanded()",
        "attr.aria-controls": "_pattern.menu()?.id()"
      }
    },
    exportAs: ["ngMenuTrigger"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: MenuTrigger,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'button[ngMenuTrigger]',
      exportAs: 'ngMenuTrigger',
      host: {
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.disabled]': '!softDisabled() && _pattern.disabled() ? true : null',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-haspopup]': 'hasPopup()',
        '[attr.aria-expanded]': 'expanded()',
        '[attr.aria-controls]': '_pattern.menu()?.id()',
        '(click)': '_pattern.onClick()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(focusout)': '_pattern.onFocusOut($event)',
        '(focusin)': '_pattern.onFocusIn()'
      }
    }]
  }],
  ctorParameters: () => []
});
class Menu {
  _deferredContentAware = inject(DeferredContentAware, {
    optional: true
  });
  _allItems = contentChildren(MenuItem, ...(ngDevMode ? [{
    debugName: "_allItems",
    descendants: true
  }] : [{
    descendants: true
  }]));
  _items = computed(() => this._allItems().filter(i => i.parent === this), ...(ngDevMode ? [{
    debugName: "_items"
  }] : []));
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  textDirection = inject(Directionality).valueSignal;
  id = input(inject(_IdGenerator).getId('ng-menu-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  wrap = input(true, ...(ngDevMode ? [{
    debugName: "wrap",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  typeaheadDelay = input(500, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  parent = signal(undefined, ...(ngDevMode ? [{
    debugName: "parent"
  }] : []));
  _pattern;
  items = () => this._items().map(i => i._pattern);
  isVisible = computed(() => this._pattern.isVisible(), ...(ngDevMode ? [{
    debugName: "isVisible"
  }] : []));
  tabIndex = computed(() => this._pattern.tabIndex(), ...(ngDevMode ? [{
    debugName: "tabIndex"
  }] : []));
  onSelect = output();
  expansionDelay = input(100, ...(ngDevMode ? [{
    debugName: "expansionDelay"
  }] : []));
  constructor() {
    this._pattern = new MenuPattern({
      ...this,
      parent: computed(() => this.parent()?._pattern),
      multi: () => false,
      softDisabled: () => true,
      focusMode: () => 'roving',
      orientation: () => 'vertical',
      selectionMode: () => 'explicit',
      activeItem: signal(undefined),
      element: computed(() => this._elementRef.nativeElement),
      onSelect: value => this.onSelect.emit(value)
    });
    afterRenderEffect(() => {
      const parent = this.parent();
      if (parent instanceof MenuItem && parent.parent instanceof MenuBar) {
        this._deferredContentAware?.contentVisible.set(true);
      } else {
        this._deferredContentAware?.contentVisible.set(this._pattern.isVisible() || !!this.parent()?._pattern.hasBeenFocused());
      }
    });
    afterRenderEffect(() => {
      if (this._pattern.isVisible()) {
        const activeItem = untracked(() => this._pattern.inputs.activeItem());
        this._pattern.listBehavior.goto(activeItem);
      }
    });
    afterRenderEffect(() => {
      if (!this._pattern.hasBeenFocused() && this._items().length) {
        untracked(() => this._pattern.setDefaultState());
      }
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: Menu,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: Menu,
    isStandalone: true,
    selector: "[ngMenu]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
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
      typeaheadDelay: {
        classPropertyName: "typeaheadDelay",
        publicName: "typeaheadDelay",
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
      expansionDelay: {
        classPropertyName: "expansionDelay",
        publicName: "expansionDelay",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      onSelect: "onSelect"
    },
    host: {
      attributes: {
        "role": "menu"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "mouseover": "_pattern.onMouseOver($event)",
        "mouseout": "_pattern.onMouseOut($event)",
        "focusout": "_pattern.onFocusOut($event)",
        "focusin": "_pattern.onFocusIn()",
        "click": "_pattern.onClick($event)"
      },
      properties: {
        "attr.id": "_pattern.id()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.tabindex": "tabIndex()",
        "attr.data-visible": "isVisible()"
      }
    },
    queries: [{
      propertyName: "_allItems",
      predicate: MenuItem,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngMenu"],
    hostDirectives: [{
      directive: i1.DeferredContentAware,
      inputs: ["preserveContent", "preserveContent"]
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: Menu,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngMenu]',
      exportAs: 'ngMenu',
      host: {
        'role': 'menu',
        '[attr.id]': '_pattern.id()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.tabindex]': 'tabIndex()',
        '[attr.data-visible]': 'isVisible()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(mouseover)': '_pattern.onMouseOver($event)',
        '(mouseout)': '_pattern.onMouseOut($event)',
        '(focusout)': '_pattern.onFocusOut($event)',
        '(focusin)': '_pattern.onFocusIn()',
        '(click)': '_pattern.onClick($event)'
      },
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
      }]
    }]
  }],
  ctorParameters: () => []
});
class MenuBar {
  _allItems = contentChildren(MenuItem, ...(ngDevMode ? [{
    debugName: "_allItems",
    descendants: true
  }] : [{
    descendants: true
  }]));
  _items = () => this._allItems().filter(i => i.parent === this);
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  softDisabled = input(true, ...(ngDevMode ? [{
    debugName: "softDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  textDirection = inject(Directionality).valueSignal;
  values = model([], ...(ngDevMode ? [{
    debugName: "values"
  }] : []));
  wrap = input(true, ...(ngDevMode ? [{
    debugName: "wrap",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  typeaheadDelay = input(500, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  _pattern;
  items = signal([], ...(ngDevMode ? [{
    debugName: "items"
  }] : []));
  onSelect = output();
  constructor() {
    this._pattern = new MenuBarPattern({
      ...this,
      multi: () => false,
      softDisabled: () => true,
      focusMode: () => 'roving',
      orientation: () => 'horizontal',
      selectionMode: () => 'explicit',
      onSelect: value => this.onSelect.emit(value),
      activeItem: signal(undefined),
      element: computed(() => this._elementRef.nativeElement)
    });
    afterRenderEffect(() => {
      this.items.set(this._items().map(i => i._pattern));
    });
    afterRenderEffect(() => {
      if (!this._pattern.hasBeenFocused()) {
        this._pattern.setDefaultState();
      }
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: MenuBar,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: MenuBar,
    isStandalone: true,
    selector: "[ngMenuBar]",
    inputs: {
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
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
      values: {
        classPropertyName: "values",
        publicName: "values",
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
      typeaheadDelay: {
        classPropertyName: "typeaheadDelay",
        publicName: "typeaheadDelay",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      values: "valuesChange",
      onSelect: "onSelect"
    },
    host: {
      attributes: {
        "role": "menubar"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "mouseover": "_pattern.onMouseOver($event)",
        "click": "_pattern.onClick($event)",
        "focusin": "_pattern.onFocusIn()",
        "focusout": "_pattern.onFocusOut($event)"
      },
      properties: {
        "attr.disabled": "!softDisabled() && _pattern.disabled() ? true : null",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.tabindex": "_pattern.tabIndex()"
      }
    },
    queries: [{
      propertyName: "_allItems",
      predicate: MenuItem,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngMenuBar"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: MenuBar,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngMenuBar]',
      exportAs: 'ngMenuBar',
      host: {
        'role': 'menubar',
        '[attr.disabled]': '!softDisabled() && _pattern.disabled() ? true : null',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(mouseover)': '_pattern.onMouseOver($event)',
        '(click)': '_pattern.onClick($event)',
        '(focusin)': '_pattern.onFocusIn()',
        '(focusout)': '_pattern.onFocusOut($event)'
      }
    }]
  }],
  ctorParameters: () => []
});
class MenuItem {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  id = input(inject(_IdGenerator).getId('ng-menu-item-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled"
  }] : []));
  searchTerm = model('', ...(ngDevMode ? [{
    debugName: "searchTerm"
  }] : []));
  _menu = inject(Menu, {
    optional: true
  });
  _menuBar = inject(MenuBar, {
    optional: true
  });
  parent = this._menu ?? this._menuBar;
  submenu = input(undefined, ...(ngDevMode ? [{
    debugName: "submenu"
  }] : []));
  isActive = computed(() => this._pattern.isActive(), ...(ngDevMode ? [{
    debugName: "isActive"
  }] : []));
  expanded = computed(() => this._pattern.expanded(), ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  hasPopup = computed(() => this._pattern.hasPopup(), ...(ngDevMode ? [{
    debugName: "hasPopup"
  }] : []));
  _pattern = new MenuItemPattern({
    id: this.id,
    value: this.value,
    element: computed(() => this._elementRef.nativeElement),
    disabled: this.disabled,
    searchTerm: this.searchTerm,
    parent: computed(() => this.parent?._pattern),
    submenu: computed(() => this.submenu()?._pattern)
  });
  constructor() {
    effect(() => this.submenu()?.parent.set(this));
  }
  open() {
    this._pattern.open({
      first: true
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: MenuItem,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: MenuItem,
    isStandalone: true,
    selector: "[ngMenuItem]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      value: {
        classPropertyName: "value",
        publicName: "value",
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
      searchTerm: {
        classPropertyName: "searchTerm",
        publicName: "searchTerm",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      submenu: {
        classPropertyName: "submenu",
        publicName: "submenu",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      searchTerm: "searchTermChange"
    },
    host: {
      attributes: {
        "role": "menuitem"
      },
      listeners: {
        "focusin": "_pattern.onFocusIn()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.data-active": "isActive()",
        "attr.aria-haspopup": "hasPopup()",
        "attr.aria-expanded": "expanded()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-controls": "_pattern.submenu()?.id()"
      }
    },
    exportAs: ["ngMenuItem"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: MenuItem,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngMenuItem]',
      exportAs: 'ngMenuItem',
      host: {
        'role': 'menuitem',
        '(focusin)': '_pattern.onFocusIn()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.data-active]': 'isActive()',
        '[attr.aria-haspopup]': 'hasPopup()',
        '[attr.aria-expanded]': 'expanded()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-controls]': '_pattern.submenu()?.id()'
      }
    }]
  }],
  ctorParameters: () => []
});
class MenuContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: MenuContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "20.2.0-next.2",
    type: MenuContent,
    isStandalone: true,
    selector: "ng-template[ngMenuContent]",
    exportAs: ["ngMenuContent"],
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
  type: MenuContent,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngMenuContent]',
      exportAs: 'ngMenuContent',
      hostDirectives: [DeferredContent]
    }]
  }]
});

export { Menu, MenuBar, MenuContent, MenuItem, MenuTrigger };
//# sourceMappingURL=menu.mjs.map
