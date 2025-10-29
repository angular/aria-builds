import * as i0 from '@angular/core';
import { inject, ElementRef, signal, computed, input, booleanAttribute, afterRenderEffect, Directive } from '@angular/core';
import { ToolbarPattern, ToolbarWidgetPattern, ToolbarWidgetGroupPattern } from '@angular/aria/private';
import { Directionality } from '@angular/cdk/bidi';
import { _IdGenerator } from '@angular/cdk/a11y';

function sortDirectives(a, b) {
  return (a.element().compareDocumentPosition(b.element()) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}
class Toolbar {
  _elementRef = inject(ElementRef);
  _widgets = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_widgets"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  items = computed(() => [...this._widgets()].sort(sortDirectives).map(widget => widget._pattern), ...(ngDevMode ? [{
    debugName: "items"
  }] : []));
  orientation = input('horizontal', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
  skipDisabled = input(false, ...(ngDevMode ? [{
    debugName: "skipDisabled",
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
  _pattern = new ToolbarPattern({
    ...this,
    activeItem: signal(undefined),
    textDirection: this.textDirection,
    element: () => this._elementRef.nativeElement,
    getItem: e => this._getItem(e)
  });
  _hasFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasFocused"
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
      if (!this._hasFocused()) {
        this._pattern.setDefaultState();
      }
    });
  }
  onFocus() {
    this._hasFocused.set(true);
  }
  register(widget) {
    const widgets = this._widgets();
    if (!widgets.has(widget)) {
      widgets.add(widget);
      this._widgets.set(new Set(widgets));
    }
  }
  unregister(widget) {
    const widgets = this._widgets();
    if (widgets.delete(widget)) {
      this._widgets.set(new Set(widgets));
    }
  }
  _getItem(element) {
    const widgetTarget = element.closest('.ng-toolbar-widget');
    const groupTarget = element.closest('.ng-toolbar-widget-group');
    return this.items().find(widget => widget.element() === widgetTarget || widget.element() === groupTarget);
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
      skipDisabled: {
        classPropertyName: "skipDisabled",
        publicName: "skipDisabled",
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
      }
    },
    host: {
      attributes: {
        "role": "toolbar"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "onFocus()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabindex()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()"
      },
      classAttribute: "ng-toolbar"
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
        'class': 'ng-toolbar',
        '[attr.tabindex]': '_pattern.tabindex()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': 'onFocus()'
      }
    }]
  }],
  ctorParameters: () => []
});
class ToolbarWidget {
  _elementRef = inject(ElementRef);
  _toolbar = inject(Toolbar);
  _generatedId = inject(_IdGenerator).getId('ng-toolbar-widget-');
  id = computed(() => this._generatedId, ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  toolbar = computed(() => this._toolbar._pattern, ...(ngDevMode ? [{
    debugName: "toolbar"
  }] : []));
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  hardDisabled = computed(() => this._pattern.disabled() && this._toolbar.skipDisabled(), ...(ngDevMode ? [{
    debugName: "hardDisabled"
  }] : []));
  _pattern = new ToolbarWidgetPattern({
    ...this,
    id: this.id,
    element: this.element,
    disabled: computed(() => this._toolbar.disabled() || this.disabled())
  });
  ngOnInit() {
    this._toolbar.register(this);
  }
  ngOnDestroy() {
    this._toolbar.unregister(this);
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
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      properties: {
        "attr.data-active": "_pattern.active()",
        "attr.tabindex": "_pattern.tabindex()",
        "attr.inert": "hardDisabled() ? true : null",
        "attr.disabled": "hardDisabled() ? true : null",
        "attr.aria-disabled": "_pattern.disabled()",
        "id": "_pattern.id()"
      },
      classAttribute: "ng-toolbar-widget"
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
        'class': 'ng-toolbar-widget',
        '[attr.data-active]': '_pattern.active()',
        '[attr.tabindex]': '_pattern.tabindex()',
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
  _toolbar = inject(Toolbar, {
    optional: true
  });
  _generatedId = inject(_IdGenerator).getId('ng-toolbar-widget-group-');
  id = computed(() => this._generatedId, ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  toolbar = computed(() => this._toolbar?._pattern, ...(ngDevMode ? [{
    debugName: "toolbar"
  }] : []));
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  controls = signal(undefined, ...(ngDevMode ? [{
    debugName: "controls"
  }] : []));
  _pattern = new ToolbarWidgetGroupPattern({
    ...this,
    id: this.id,
    element: this.element
  });
  ngOnInit() {
    this._toolbar?.register(this);
  }
  ngOnDestroy() {
    this._toolbar?.unregister(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: ToolbarWidgetGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: ToolbarWidgetGroup,
    isStandalone: true,
    inputs: {
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      properties: {
        "class.ng-toolbar-widget-group": "!!toolbar()"
      }
    },
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
      host: {
        '[class.ng-toolbar-widget-group]': '!!toolbar()'
      }
    }]
  }]
});

export { Toolbar, ToolbarWidget, ToolbarWidgetGroup };
//# sourceMappingURL=toolbar.mjs.map
