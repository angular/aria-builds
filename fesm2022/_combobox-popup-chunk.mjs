import * as i0 from '@angular/core';
import { InjectionToken, inject, signal, Directive } from '@angular/core';

const COMBOBOX = new InjectionToken('COMBOBOX');

class ComboboxPopup {
  combobox = inject(COMBOBOX, {
    optional: true
  });
  _controls = signal(undefined, ...(ngDevMode ? [{
    debugName: "_controls"
  }] : []));
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: ComboboxPopup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: ComboboxPopup,
    isStandalone: true,
    selector: "[ngComboboxPopup]",
    exportAs: ["ngComboboxPopup"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
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

export { COMBOBOX, ComboboxPopup };
//# sourceMappingURL=_combobox-popup-chunk.mjs.map
