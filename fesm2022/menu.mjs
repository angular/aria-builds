import * as i0 from '@angular/core';
import { inject, ElementRef, input, output, computed, Directive, contentChildren, signal, afterRenderEffect, untracked, model } from '@angular/core';
import { MenuTriggerPattern, MenuPattern, MenuBarPattern, MenuItemPattern } from '@angular/aria/private';
import { toSignal } from '@angular/core/rxjs-interop';
import { Directionality } from '@angular/cdk/bidi';

class MenuTrigger {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  submenu = input(undefined, ...(ngDevMode ? [{
    debugName: "submenu"
  }] : []));
  onSubmit = output();
  _pattern = new MenuTriggerPattern({
    onSubmit: value => this.onSubmit.emit(value),
    element: computed(() => this._elementRef.nativeElement),
    submenu: computed(() => this.submenu()?._pattern)
  });
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
      submenu: {
        classPropertyName: "submenu",
        publicName: "submenu",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      onSubmit: "onSubmit"
    },
    host: {
      listeners: {
        "click": "_pattern.onClick()",
        "keydown": "_pattern.onKeydown($event)",
        "focusout": "_pattern.onFocusOut($event)"
      },
      properties: {
        "attr.tabindex": "_pattern.tabindex()",
        "attr.aria-haspopup": "_pattern.hasPopup()",
        "attr.aria-expanded": "_pattern.expanded()",
        "attr.aria-controls": "_pattern.submenu()?.id()"
      },
      classAttribute: "ng-menu-trigger"
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
        'class': 'ng-menu-trigger',
        '[attr.tabindex]': '_pattern.tabindex()',
        '[attr.aria-haspopup]': '_pattern.hasPopup()',
        '[attr.aria-expanded]': '_pattern.expanded()',
        '[attr.aria-controls]': '_pattern.submenu()?.id()',
        '(click)': '_pattern.onClick()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(focusout)': '_pattern.onFocusOut($event)'
      }
    }]
  }]
});
class Menu {
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
  _directionality = inject(Directionality);
  textDirection = toSignal(this._directionality.change, {
    initialValue: this._directionality.value
  });
  submenu = input(undefined, ...(ngDevMode ? [{
    debugName: "submenu"
  }] : []));
  id = input(Math.random().toString(36).substring(2, 10), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  wrap = input(true, ...(ngDevMode ? [{
    debugName: "wrap"
  }] : []));
  typeaheadDelay = input(0.5, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  parent = input(...(ngDevMode ? [undefined, {
    debugName: "parent"
  }] : []));
  _pattern;
  items = () => this._items().map(i => i._pattern);
  isVisible = computed(() => this._pattern.isVisible(), ...(ngDevMode ? [{
    debugName: "isVisible"
  }] : []));
  onSubmit = output();
  constructor() {
    this._pattern = new MenuPattern({
      ...this,
      parent: computed(() => this.parent()?._pattern),
      multi: () => false,
      skipDisabled: () => false,
      focusMode: () => 'roving',
      orientation: () => 'vertical',
      selectionMode: () => 'explicit',
      activeItem: signal(undefined),
      element: computed(() => this._elementRef.nativeElement),
      onSubmit: value => this.onSubmit.emit(value)
    });
    afterRenderEffect(() => {
      if (this._pattern.isVisible()) {
        const activeItem = untracked(() => this._pattern.inputs.activeItem());
        this._pattern.listBehavior.goto(activeItem);
      }
    });
    afterRenderEffect(() => {
      if (!this._pattern.hasBeenFocused()) {
        this._pattern.setDefaultState();
      }
    });
  }
  close(opts) {
    this._pattern.inputs.parent()?.close(opts);
  }
  closeAll(opts) {
    const root = this._pattern.root();
    if (root instanceof MenuTriggerPattern) {
      root.close(opts);
    }
    if (root instanceof MenuPattern || root instanceof MenuBarPattern) {
      root.inputs.activeItem()?.close(opts);
    }
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
      submenu: {
        classPropertyName: "submenu",
        publicName: "submenu",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
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
      parent: {
        classPropertyName: "parent",
        publicName: "parent",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      onSubmit: "onSubmit"
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
        "attr.data-visible": "_pattern.isVisible()"
      },
      classAttribute: "ng-menu"
    },
    queries: [{
      propertyName: "_allItems",
      predicate: MenuItem,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngMenu"],
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
        'class': 'ng-menu',
        '[attr.id]': '_pattern.id()',
        '[attr.data-visible]': '_pattern.isVisible()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(mouseover)': '_pattern.onMouseOver($event)',
        '(mouseout)': '_pattern.onMouseOut($event)',
        '(focusout)': '_pattern.onFocusOut($event)',
        '(focusin)': '_pattern.onFocusIn()',
        '(click)': '_pattern.onClick($event)'
      }
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
  _directionality = inject(Directionality);
  textDirection = toSignal(this._directionality.change, {
    initialValue: this._directionality.value
  });
  value = model([], ...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  wrap = input(true, ...(ngDevMode ? [{
    debugName: "wrap"
  }] : []));
  typeaheadDelay = input(0.5, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  _pattern;
  items = signal([], ...(ngDevMode ? [{
    debugName: "items"
  }] : []));
  onSubmit = output();
  constructor() {
    this._pattern = new MenuBarPattern({
      ...this,
      multi: () => false,
      skipDisabled: () => false,
      focusMode: () => 'roving',
      orientation: () => 'horizontal',
      selectionMode: () => 'explicit',
      onSubmit: value => this.onSubmit.emit(value),
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
      value: {
        classPropertyName: "value",
        publicName: "value",
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
      value: "valueChange",
      onSubmit: "onSubmit"
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
      classAttribute: "ng-menu-bar"
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
        'class': 'ng-menu-bar',
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
  id = input(Math.random().toString(36).substring(2, 10), ...(ngDevMode ? [{
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
  _pattern = new MenuItemPattern({
    id: this.id,
    value: this.value,
    element: computed(() => this._elementRef.nativeElement),
    disabled: this.disabled,
    searchTerm: this.searchTerm,
    parent: computed(() => this.parent?._pattern),
    submenu: computed(() => this.submenu()?._pattern)
  });
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
      properties: {
        "attr.tabindex": "_pattern.tabindex()",
        "attr.data-active": "_pattern.isActive()",
        "attr.aria-haspopup": "_pattern.hasPopup()",
        "attr.aria-expanded": "_pattern.expanded()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-controls": "_pattern.submenu()?.id()"
      },
      classAttribute: "ng-menu-item"
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
        'class': 'ng-menu-item',
        '[attr.tabindex]': '_pattern.tabindex()',
        '[attr.data-active]': '_pattern.isActive()',
        '[attr.aria-haspopup]': '_pattern.hasPopup()',
        '[attr.aria-expanded]': '_pattern.expanded()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-controls]': '_pattern.submenu()?.id()'
      }
    }]
  }]
});

export { Menu, MenuBar, MenuItem, MenuTrigger };
//# sourceMappingURL=menu.mjs.map
