import * as i0 from '@angular/core';
import { inject, ElementRef, contentChild, input, computed, signal, afterRenderEffect, Directive, model, untracked } from '@angular/core';
import * as i1 from '@angular/aria/private';
import { DeferredContentAware, ComboboxPattern, ComboboxDialogPattern, DeferredContent } from '@angular/aria/private';
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
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled"
  }] : []));
  readonly = input(false, ...(ngDevMode ? [{
    debugName: "readonly"
  }] : []));
  firstMatch = input(undefined, ...(ngDevMode ? [{
    debugName: "firstMatch"
  }] : []));
  expanded = computed(() => this.alwaysExpanded() || this._pattern.expanded(), ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  alwaysExpanded = input(false, ...(ngDevMode ? [{
    debugName: "alwaysExpanded"
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
      if (this.alwaysExpanded()) {
        this._pattern.expanded.set(true);
      }
    });
    afterRenderEffect(() => {
      if (!this._deferredContentAware?.contentVisible() && (this._pattern.isFocused() || this.alwaysExpanded())) {
        this._deferredContentAware?.contentVisible.set(true);
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
      },
      alwaysExpanded: {
        classPropertyName: "alwaysExpanded",
        publicName: "alwaysExpanded",
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
    const controls = this.combobox.popup()?.controls();
    if (controls instanceof ComboboxDialogPattern) {
      return;
    }
    afterRenderEffect(() => {
      this.value();
      controls?.items();
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
        "attr.aria-activedescendant": "combobox._pattern.activeDescendant()",
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
        '[attr.aria-activedescendant]': 'combobox._pattern.activeDescendant()',
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
class ComboboxDialog {
  element = inject(ElementRef);
  combobox = inject(Combobox);
  _popup = inject(ComboboxPopup, {
    optional: true
  });
  _pattern;
  constructor() {
    this._pattern = new ComboboxDialogPattern({
      id: () => '',
      element: () => this.element.nativeElement,
      combobox: this.combobox._pattern
    });
    if (this._popup) {
      this._popup.controls.set(this._pattern);
    }
    afterRenderEffect(() => {
      if (this.element) {
        this.combobox._pattern.expanded() ? this.element.nativeElement.showModal() : this.element.nativeElement.close();
      }
    });
  }
  close() {
    this._popup?.combobox?._pattern.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: ComboboxDialog,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "20.2.0-next.2",
    type: ComboboxDialog,
    isStandalone: true,
    selector: "dialog[ngComboboxDialog]",
    host: {
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "click": "_pattern.onClick($event)"
      },
      properties: {
        "attr.data-open": "combobox._pattern.expanded()"
      }
    },
    exportAs: ["ngComboboxDialog"],
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
  type: ComboboxDialog,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'dialog[ngComboboxDialog]',
      exportAs: 'ngComboboxDialog',
      host: {
        '[attr.data-open]': 'combobox._pattern.expanded()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(click)': '_pattern.onClick($event)'
      },
      hostDirectives: [ComboboxPopup]
    }]
  }],
  ctorParameters: () => []
});

export { Combobox, ComboboxDialog, ComboboxInput, ComboboxPopup, ComboboxPopupContainer };
//# sourceMappingURL=combobox.mjs.map
