import * as i0 from '@angular/core';
import { inject, ElementRef, computed, contentChildren, input, booleanAttribute, model, signal, afterRenderEffect, Directive, linkedSignal } from '@angular/core';
import { ToolbarRadioGroupPattern, RadioGroupPattern, RadioButtonPattern } from '@angular/aria/private';
import { Directionality } from '@angular/cdk/bidi';
import { _IdGenerator } from '@angular/cdk/a11y';
import * as i1 from '@angular/aria/toolbar';
import { ToolbarWidgetGroup } from '@angular/aria/toolbar';

function mapSignal(originalSignal, operations) {
  const mappedSignal = linkedSignal(() => operations.transform(originalSignal()));
  const updateMappedSignal = mappedSignal.update;
  const setMappedSignal = mappedSignal.set;
  mappedSignal.set = newValue => {
    setMappedSignal(newValue);
    originalSignal.set(operations.reverse(newValue));
  };
  mappedSignal.update = updateFn => {
    updateMappedSignal(oldValue => updateFn(oldValue));
    originalSignal.update(oldValue => operations.reverse(updateFn(operations.transform(oldValue))));
  };
  return mappedSignal;
}
class RadioGroup {
  _elementRef = inject(ElementRef);
  _toolbarWidgetGroup = inject(ToolbarWidgetGroup);
  _hasToolbar = computed(() => !!this._toolbarWidgetGroup.toolbar(), ...(ngDevMode ? [{
    debugName: "_hasToolbar"
  }] : []));
  _radioButtons = contentChildren(RadioButton, ...(ngDevMode ? [{
    debugName: "_radioButtons",
    descendants: true
  }] : [{
    descendants: true
  }]));
  textDirection = inject(Directionality).valueSignal;
  items = computed(() => this._radioButtons().map(radio => radio._pattern), ...(ngDevMode ? [{
    debugName: "items"
  }] : []));
  orientation = input('vertical', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
  skipDisabled = input(true, ...(ngDevMode ? [{
    debugName: "skipDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  focusMode = input('roving', ...(ngDevMode ? [{
    debugName: "focusMode"
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
  value = model(null, ...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  _value = mapSignal(this.value, {
    transform: value => value !== null ? [value] : [],
    reverse: values => values.length === 0 ? null : values[0]
  });
  _pattern;
  _hasFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasFocused"
  }] : []));
  constructor() {
    const inputs = {
      ...this,
      items: this.items,
      value: this._value,
      activeItem: signal(undefined),
      textDirection: this.textDirection,
      element: () => this._elementRef.nativeElement,
      getItem: e => {
        if (!(e.target instanceof HTMLElement)) {
          return undefined;
        }
        const element = e.target.closest('[role="radio"]');
        return this.items().find(i => i.element() === element);
      },
      toolbar: this._toolbarWidgetGroup.toolbar
    };
    this._pattern = this._hasToolbar() ? new ToolbarRadioGroupPattern(inputs) : new RadioGroupPattern(inputs);
    if (this._hasToolbar()) {
      this._toolbarWidgetGroup.controls.set(this._pattern);
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
      if (!this._hasFocused() && !this._hasToolbar()) {
        this._pattern.setDefaultState();
      }
    });
  }
  onFocus() {
    this._hasFocused.set(true);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: RadioGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: RadioGroup,
    isStandalone: true,
    selector: "[ngRadioGroup]",
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
      focusMode: {
        classPropertyName: "focusMode",
        publicName: "focusMode",
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
        "role": "radiogroup"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "onFocus()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabindex()",
        "attr.aria-readonly": "_pattern.readonly()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()",
        "attr.aria-activedescendant": "_pattern.activedescendant()"
      },
      classAttribute: "ng-radio-group"
    },
    queries: [{
      propertyName: "_radioButtons",
      predicate: RadioButton,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngRadioGroup"],
    hostDirectives: [{
      directive: i1.ToolbarWidgetGroup,
      inputs: ["disabled", "disabled"]
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: RadioGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngRadioGroup]',
      exportAs: 'ngRadioGroup',
      host: {
        'role': 'radiogroup',
        'class': 'ng-radio-group',
        '[attr.tabindex]': '_pattern.tabindex()',
        '[attr.aria-readonly]': '_pattern.readonly()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '[attr.aria-activedescendant]': '_pattern.activedescendant()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': 'onFocus()'
      },
      hostDirectives: [{
        directive: ToolbarWidgetGroup,
        inputs: ['disabled']
      }]
    }]
  }],
  ctorParameters: () => []
});
class RadioButton {
  _elementRef = inject(ElementRef);
  _radioGroup = inject(RadioGroup);
  _generatedId = inject(_IdGenerator).getId('ng-radio-button-', true);
  id = computed(() => this._generatedId, ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  group = computed(() => this._radioGroup._pattern, ...(ngDevMode ? [{
    debugName: "group"
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
  selected = computed(() => this._pattern.selected(), ...(ngDevMode ? [{
    debugName: "selected"
  }] : []));
  _pattern = new RadioButtonPattern({
    ...this,
    id: this.id,
    value: this.value,
    group: this.group,
    element: this.element
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: RadioButton,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: RadioButton,
    isStandalone: true,
    selector: "[ngRadioButton]",
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
      }
    },
    host: {
      attributes: {
        "role": "radio"
      },
      properties: {
        "attr.data-active": "_pattern.active()",
        "attr.tabindex": "_pattern.tabindex()",
        "attr.aria-checked": "_pattern.selected()",
        "attr.aria-disabled": "_pattern.disabled()",
        "id": "_pattern.id()"
      },
      classAttribute: "ng-radio-button"
    },
    exportAs: ["ngRadioButton"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: RadioButton,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngRadioButton]',
      exportAs: 'ngRadioButton',
      host: {
        'role': 'radio',
        'class': 'ng-radio-button',
        '[attr.data-active]': '_pattern.active()',
        '[attr.tabindex]': '_pattern.tabindex()',
        '[attr.aria-checked]': '_pattern.selected()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[id]': '_pattern.id()'
      }
    }]
  }]
});

export { RadioButton, RadioGroup };
//# sourceMappingURL=radio-group.mjs.map
