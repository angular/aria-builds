import * as i0 from '@angular/core';
import { inject, ElementRef, signal, computed, input, booleanAttribute, model, afterRenderEffect, Directive, contentChildren } from '@angular/core';
import { ToolbarPattern, ToolbarWidgetPattern, ToolbarWidgetGroupPattern } from '@angular/aria/private';
import { Directionality } from '@angular/cdk/bidi';
import { _IdGenerator } from '@angular/cdk/a11y';

function sortDirectives(a, b) {
  return (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}
class Toolbar {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _widgets = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_widgets"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  _itemPatterns = computed(() => [...this._widgets()].sort(sortDirectives).map(widget => widget._pattern), ...(ngDevMode ? [{
    debugName: "_itemPatterns"
  }] : []));
  orientation = input('horizontal', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
  softDisabled = input(true, ...(ngDevMode ? [{
    debugName: "softDisabled",
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
  wrap = input(true, ...(ngDevMode ? [{
    debugName: "wrap",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  values = model([], ...(ngDevMode ? [{
    debugName: "values"
  }] : []));
  _pattern = new ToolbarPattern({
    ...this,
    items: this._itemPatterns,
    activeItem: signal(undefined),
    textDirection: this.textDirection,
    element: () => this._elementRef.nativeElement,
    getItem: e => this._getItem(e),
    values: this.values
  });
  _hasBeenFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasBeenFocused"
  }] : []));
  constructor() {
    afterRenderEffect(() => {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        const violations = this._pattern.validate();
        for (const violation of violations) {
          console.error(violation);
        }
      }
    });
    afterRenderEffect(() => {
      if (!this._hasBeenFocused()) {
        this._pattern.setDefaultState();
      }
    });
  }
  _onFocus() {
    this._hasBeenFocused.set(true);
  }
  _register(widget) {
    const widgets = this._widgets();
    if (!widgets.has(widget)) {
      widgets.add(widget);
      this._widgets.set(new Set(widgets));
    }
  }
  _unregister(widget) {
    const widgets = this._widgets();
    if (widgets.delete(widget)) {
      this._widgets.set(new Set(widgets));
    }
  }
  _getItem(element) {
    return this._itemPatterns().find(item => item.element()?.contains(element));
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: Toolbar,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: Toolbar,
    isStandalone: true,
    selector: "[ngToolbar]",
    inputs: {
      orientation: {
        classPropertyName: "orientation",
        publicName: "orientation",
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
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
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
      values: {
        classPropertyName: "values",
        publicName: "values",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      values: "valuesChange"
    },
    host: {
      attributes: {
        "role": "toolbar"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "click": "_pattern.onClick($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "_onFocus()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()"
      }
    },
    exportAs: ["ngToolbar"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: Toolbar,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngToolbar]',
      exportAs: 'ngToolbar',
      host: {
        'role': 'toolbar',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(click)': '_pattern.onClick($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': '_onFocus()'
      }
    }]
  }],
  ctorParameters: () => []
});
class ToolbarWidget {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _toolbar = inject(Toolbar);
  id = input(inject(_IdGenerator).getId('ng-toolbar-widget-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  _toolbarPattern = computed(() => this._toolbar._pattern, ...(ngDevMode ? [{
    debugName: "_toolbarPattern"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  hardDisabled = computed(() => this._pattern.disabled() && !this._toolbar.softDisabled(), ...(ngDevMode ? [{
    debugName: "hardDisabled"
  }] : []));
  _group = inject(ToolbarWidgetGroup, {
    optional: true
  });
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  selected = () => this._pattern.selected();
  _groupPattern = () => this._group?._pattern;
  _pattern = new ToolbarWidgetPattern({
    ...this,
    group: this._groupPattern,
    toolbar: this._toolbarPattern,
    id: this.id,
    value: this.value,
    element: () => this.element
  });
  ngOnInit() {
    this._toolbar._register(this);
  }
  ngOnDestroy() {
    this._toolbar._unregister(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: ToolbarWidget,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: ToolbarWidget,
    isStandalone: true,
    selector: "[ngToolbarWidget]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
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
      value: {
        classPropertyName: "value",
        publicName: "value",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    host: {
      properties: {
        "attr.data-active": "active()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.inert": "hardDisabled() ? true : null",
        "attr.disabled": "hardDisabled() ? true : null",
        "attr.aria-disabled": "_pattern.disabled()",
        "id": "_pattern.id()"
      }
    },
    exportAs: ["ngToolbarWidget"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: ToolbarWidget,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngToolbarWidget]',
      exportAs: 'ngToolbarWidget',
      host: {
        '[attr.data-active]': 'active()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.inert]': 'hardDisabled() ? true : null',
        '[attr.disabled]': 'hardDisabled() ? true : null',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[id]': '_pattern.id()'
      }
    }]
  }]
});
class ToolbarWidgetGroup {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _toolbar = inject(Toolbar, {
    optional: true
  });
  _widgets = contentChildren(ToolbarWidget, ...(ngDevMode ? [{
    debugName: "_widgets",
    descendants: true
  }] : [{
    descendants: true
  }]));
  _toolbarPattern = computed(() => this._toolbar?._pattern, ...(ngDevMode ? [{
    debugName: "_toolbarPattern"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  _itemPatterns = () => this._widgets().map(w => w._pattern);
  multi = input(false, ...(ngDevMode ? [{
    debugName: "multi",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  _pattern = new ToolbarWidgetGroupPattern({
    ...this,
    items: this._itemPatterns,
    toolbar: this._toolbarPattern
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: ToolbarWidgetGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: ToolbarWidgetGroup,
    isStandalone: true,
    selector: "[ngToolbarWidgetGroup]",
    inputs: {
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
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
      }
    },
    queries: [{
      propertyName: "_widgets",
      predicate: ToolbarWidget,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngToolbarWidgetGroup"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: ToolbarWidgetGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngToolbarWidgetGroup]',
      exportAs: 'ngToolbarWidgetGroup'
    }]
  }]
});

export { Toolbar, ToolbarWidget, ToolbarWidgetGroup };
//# sourceMappingURL=toolbar.mjs.map
