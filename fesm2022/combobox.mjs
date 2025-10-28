import * as i0 from '@angular/core';
import { inject, ElementRef, contentChild, input, signal, computed, afterRenderEffect, Directive, model, untracked } from '@angular/core';
import * as i1 from '@angular/aria/deferred-content';
import { DeferredContentAware, DeferredContent } from '@angular/aria/deferred-content';
import { ComboboxPattern } from '@angular/aria/private';
import { Directionality } from '@angular/cdk/bidi';
import { toSignal } from '@angular/core/rxjs-interop';

class Combobox {
  _directionality = inject(Directionality);
  textDirection = toSignal(this._directionality.change, {
    initialValue: this._directionality.value
  });
  _elementRef = inject(ElementRef);
  _deferredContentAware = inject(DeferredContentAware, {
    optional: true
  });
  popup = contentChild(ComboboxPopup, ...(ngDevMode ? [{
    debugName: "popup"
  }] : []));
  filterMode = input('manual', ...(ngDevMode ? [{
    debugName: "filterMode"
  }] : []));
  isFocused = signal(false, ...(ngDevMode ? [{
    debugName: "isFocused"
  }] : []));
  _hasBeenFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasBeenFocused"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled"
  }] : []));
  readonly = input(false, ...(ngDevMode ? [{
    debugName: "readonly"
  }] : []));
  firstMatch = input(undefined, ...(ngDevMode ? [{
    debugName: "firstMatch"
  }] : []));
  expanded = computed(() => this._pattern.expanded(), ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  inputElement = computed(() => this._pattern.inputs.inputEl(), ...(ngDevMode ? [{
    debugName: "inputElement"
  }] : []));
  _pattern = new ComboboxPattern({
    ...this,
    textDirection: this.textDirection,
    disabled: this.disabled,
    readonly: this.readonly,
    inputValue: signal(''),
    inputEl: signal(undefined),
    containerEl: () => this._elementRef.nativeElement,
    popupControls: () => this.popup()?.controls()
  });
  constructor() {
    afterRenderEffect(() => {
      if (!this._deferredContentAware?.contentVisible() && this._pattern.isFocused()) {
        this._deferredContentAware?.contentVisible.set(true);
      }
    });
    afterRenderEffect(() => {
      if (!this._hasBeenFocused() && this._pattern.isFocused()) {
        this._hasBeenFocused.set(true);
      }
    });
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: Combobox,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: Combobox,
    isStandalone: true,
    selector: "[ngCombobox]",
    inputs: {
      filterMode: {
        classPropertyName: "filterMode",
        publicName: "filterMode",
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
      firstMatch: {
        classPropertyName: "firstMatch",
        publicName: "firstMatch",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      listeners: {
        "input": "_pattern.onInput($event)",
        "keydown": "_pattern.onKeydown($event)",
        "pointerup": "_pattern.onPointerup($event)",
        "focusin": "_pattern.onFocusIn()",
        "focusout": "_pattern.onFocusOut($event)"
      },
      properties: {
        "attr.data-expanded": "expanded()"
      }
    },
    queries: [{
      propertyName: "popup",
      first: true,
      predicate: ComboboxPopup,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngCombobox"],
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
  type: Combobox,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngCombobox]',
      exportAs: 'ngCombobox',
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
      }],
      host: {
        '[attr.data-expanded]': 'expanded()',
        '(input)': '_pattern.onInput($event)',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerup)': '_pattern.onPointerup($event)',
        '(focusin)': '_pattern.onFocusIn()',
        '(focusout)': '_pattern.onFocusOut($event)'
      }
    }]
  }],
  ctorParameters: () => []
});
class ComboboxInput {
  _elementRef = inject(ElementRef);
  combobox = inject(Combobox);
  value = model('', ...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  constructor() {
    this.combobox._pattern.inputs.inputEl.set(this._elementRef.nativeElement);
    this.combobox._pattern.inputs.inputValue = this.value;
    afterRenderEffect(() => {
      this.value();
      this.combobox.popup()?.controls()?.items();
      untracked(() => this.combobox._pattern.onFilter());
    });
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: ComboboxInput,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: ComboboxInput,
    isStandalone: true,
    selector: "input[ngComboboxInput]",
    inputs: {
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
        "role": "combobox"
      },
      properties: {
        "value": "value()",
        "attr.aria-expanded": "combobox._pattern.expanded()",
        "attr.aria-activedescendant": "combobox._pattern.activedescendant()",
        "attr.aria-controls": "combobox._pattern.popupId()",
        "attr.aria-haspopup": "combobox._pattern.hasPopup()",
        "attr.aria-autocomplete": "combobox._pattern.autocomplete()",
        "attr.readonly": "combobox._pattern.readonly()"
      }
    },
    exportAs: ["ngComboboxInput"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: ComboboxInput,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[ngComboboxInput]',
      exportAs: 'ngComboboxInput',
      host: {
        'role': 'combobox',
        '[value]': 'value()',
        '[attr.aria-expanded]': 'combobox._pattern.expanded()',
        '[attr.aria-activedescendant]': 'combobox._pattern.activedescendant()',
        '[attr.aria-controls]': 'combobox._pattern.popupId()',
        '[attr.aria-haspopup]': 'combobox._pattern.hasPopup()',
        '[attr.aria-autocomplete]': 'combobox._pattern.autocomplete()',
        '[attr.readonly]': 'combobox._pattern.readonly()'
      }
    }]
  }],
  ctorParameters: () => []
});
class ComboboxPopupContainer {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: ComboboxPopupContainer,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "20.2.0-next.2",
    type: ComboboxPopupContainer,
    isStandalone: true,
    selector: "ng-template[ngComboboxPopupContainer]",
    exportAs: ["ngComboboxPopupContainer"],
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
  type: ComboboxPopupContainer,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngComboboxPopupContainer]',
      exportAs: 'ngComboboxPopupContainer',
      hostDirectives: [DeferredContent]
    }]
  }]
});
class ComboboxPopup {
  combobox = inject(Combobox, {
    optional: true
  });
  controls = signal(undefined, ...(ngDevMode ? [{
    debugName: "controls"
  }] : []));
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: ComboboxPopup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "20.2.0-next.2",
    type: ComboboxPopup,
    isStandalone: true,
    selector: "[ngComboboxPopup]",
    exportAs: ["ngComboboxPopup"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: ComboboxPopup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngComboboxPopup]',
      exportAs: 'ngComboboxPopup'
    }]
  }]
});

export { Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer };
//# sourceMappingURL=combobox.mjs.map
