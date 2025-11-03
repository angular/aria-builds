import * as i0 from '@angular/core';
import { inject, computed, ElementRef, contentChildren, input, booleanAttribute, model, signal, afterRenderEffect, untracked, Directive } from '@angular/core';
import { ComboboxListboxPattern, ListboxPattern, OptionPattern } from '@angular/aria/private';
import { Directionality } from '@angular/cdk/bidi';
import { toSignal } from '@angular/core/rxjs-interop';
import { _IdGenerator } from '@angular/cdk/a11y';
import { ComboboxPopup } from './combobox.mjs';

class Listbox {
  _generatedId = inject(_IdGenerator).getId('ng-listbox-');
  id = computed(() => this._generatedId, ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  _popup = inject(ComboboxPopup, {
    optional: true
  });
  _elementRef = inject(ElementRef);
  _directionality = inject(Directionality);
  _options = contentChildren(Option, ...(ngDevMode ? [{
    debugName: "_options",
    descendants: true
  }] : [{
    descendants: true
  }]));
  textDirection = toSignal(this._directionality.change, {
    initialValue: this._directionality.value
  });
  items = computed(() => this._options().map(option => option._pattern), ...(ngDevMode ? [{
    debugName: "items"
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
  wrap = input(true, ...(ngDevMode ? [{
    debugName: "wrap",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  skipDisabled = input(true, ...(ngDevMode ? [{
    debugName: "skipDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  focusMode = input('roving', ...(ngDevMode ? [{
    debugName: "focusMode"
  }] : []));
  selectionMode = input('follow', ...(ngDevMode ? [{
    debugName: "selectionMode"
  }] : []));
  typeaheadDelay = input(0.5, ...(ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  readonly = input(false, ...(ngDevMode ? [{
    debugName: "readonly",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  value = model([], ...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  _pattern;
  _hasFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasFocused"
  }] : []));
  constructor() {
    const inputs = {
      ...this,
      id: this.id,
      items: this.items,
      activeItem: signal(undefined),
      textDirection: this.textDirection,
      element: () => this._elementRef.nativeElement,
      combobox: () => this._popup?.combobox?._pattern
    };
    this._pattern = this._popup?.combobox ? new ComboboxListboxPattern(inputs) : new ListboxPattern(inputs);
    if (this._popup) {
      this._popup.controls.set(this._pattern);
    }
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
    afterRenderEffect(() => {
      const items = inputs.items();
      const activeItem = untracked(() => inputs.activeItem());
      if (!items.some(i => i === activeItem) && activeItem) {
        this._pattern.listBehavior.unfocus();
      }
    });
    afterRenderEffect(() => {
      const items = inputs.items();
      const value = untracked(() => this.value());
      if (items && value.some(v => !items.some(i => i.value() === v))) {
        this.value.set(value.filter(v => items.some(i => i.value() === v)));
      }
    });
  }
  onFocus() {
    this._hasFocused.set(true);
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
    type: Listbox,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: Listbox,
    isStandalone: true,
    selector: "[ngListbox]",
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
      wrap: {
        classPropertyName: "wrap",
        publicName: "wrap",
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
      focusMode: {
        classPropertyName: "focusMode",
        publicName: "focusMode",
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
      readonly: {
        classPropertyName: "readonly",
        publicName: "readonly",
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
      }
    },
    outputs: {
      value: "valueChange"
    },
    host: {
      attributes: {
        "role": "listbox"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "onFocus()"
      },
      properties: {
        "attr.id": "id()",
        "attr.tabindex": "_pattern.tabindex()",
        "attr.aria-readonly": "_pattern.readonly()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()",
        "attr.aria-multiselectable": "_pattern.multi()",
        "attr.aria-activedescendant": "_pattern.activedescendant()"
      },
      classAttribute: "ng-listbox"
    },
    queries: [{
      propertyName: "_options",
      predicate: Option,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngListbox"],
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
  type: Listbox,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngListbox]',
      exportAs: 'ngListbox',
      host: {
        'role': 'listbox',
        'class': 'ng-listbox',
        '[attr.id]': 'id()',
        '[attr.tabindex]': '_pattern.tabindex()',
        '[attr.aria-readonly]': '_pattern.readonly()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '[attr.aria-multiselectable]': '_pattern.multi()',
        '[attr.aria-activedescendant]': '_pattern.activedescendant()',
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
class Option {
  _elementRef = inject(ElementRef);
  _listbox = inject(Listbox);
  _generatedId = inject(_IdGenerator).getId('ng-option-');
  id = computed(() => this._generatedId, ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  searchTerm = computed(() => this.label() ?? this.element().textContent, ...(ngDevMode ? [{
    debugName: "searchTerm"
  }] : []));
  listbox = computed(() => this._listbox._pattern, ...(ngDevMode ? [{
    debugName: "listbox"
  }] : []));
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  label = input(...(ngDevMode ? [undefined, {
    debugName: "label"
  }] : []));
  selected = computed(() => this._pattern.selected(), ...(ngDevMode ? [{
    debugName: "selected"
  }] : []));
  _pattern = new OptionPattern({
    ...this,
    id: this.id,
    value: this.value,
    listbox: this.listbox,
    element: this.element,
    searchTerm: this.searchTerm
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: Option,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: Option,
    isStandalone: true,
    selector: "[ngOption]",
    inputs: {
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
        "role": "option"
      },
      properties: {
        "attr.data-active": "_pattern.active()",
        "attr.id": "_pattern.id()",
        "attr.tabindex": "_pattern.tabindex()",
        "attr.aria-selected": "_pattern.selected()",
        "attr.aria-disabled": "_pattern.disabled()"
      },
      classAttribute: "ng-option"
    },
    exportAs: ["ngOption"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: Option,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngOption]',
      exportAs: 'ngOption',
      host: {
        'role': 'option',
        'class': 'ng-option',
        '[attr.data-active]': '_pattern.active()',
        '[attr.id]': '_pattern.id()',
        '[attr.tabindex]': '_pattern.tabindex()',
        '[attr.aria-selected]': '_pattern.selected()',
        '[attr.aria-disabled]': '_pattern.disabled()'
      }
    }]
  }]
});

export { Listbox, Option };
//# sourceMappingURL=listbox.mjs.map
