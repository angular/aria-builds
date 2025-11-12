import * as _angular_core from '@angular/core';
import { WritableSignal, ElementRef } from '@angular/core';
import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import * as i1 from '@angular/aria/private';
import { ComboboxPattern, ComboboxDialogPattern, ComboboxListboxControls, ComboboxTreeControls } from '@angular/aria/private';

/**
 * @developerPreview 21.0
 */
declare class Combobox<V> {
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    private readonly _directionality;
    /** A signal wrapper for directionality. */
    protected textDirection: _angular_core.Signal<_angular_cdk_bidi.Direction>;
    /** The element that the combobox is attached to. */
    private readonly _elementRef;
    /** The DeferredContentAware host directive. */
    private readonly _deferredContentAware;
    /** The combobox popup. */
    readonly popup: _angular_core.Signal<ComboboxPopup<V> | undefined>;
    /** The filter mode for the combobox. */
    filterMode: _angular_core.InputSignal<"manual" | "auto-select" | "highlight">;
    /** Whether the combobox is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the combobox is read-only. */
    readonly readonly: _angular_core.InputSignal<boolean>;
    /** The value of the first matching item in the popup. */
    readonly firstMatch: _angular_core.InputSignal<V | undefined>;
    /** Whether the combobox is expanded. */
    readonly expanded: _angular_core.Signal<boolean>;
    /** Whether the combobox popup is always expanded. */
    readonly alwaysExpanded: _angular_core.InputSignal<boolean>;
    /** Input element connected to the combobox, if any. */
    readonly inputElement: _angular_core.Signal<HTMLInputElement | undefined>;
    /** The combobox ui pattern. */
    readonly _pattern: ComboboxPattern<any, V>;
    constructor();
    /** Opens the combobox to the selected item. */
    open(): void;
    /** Closes the combobox. */
    close(): void;
    /** Expands the combobox popup. */
    expand(): void;
    /** Collapses the combobox popup. */
    collapse(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Combobox<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Combobox<any>, "[ngCombobox]", ["ngCombobox"], { "filterMode": { "alias": "filterMode"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "readonly": { "alias": "readonly"; "required": false; "isSignal": true; }; "firstMatch": { "alias": "firstMatch"; "required": false; "isSignal": true; }; "alwaysExpanded": { "alias": "alwaysExpanded"; "required": false; "isSignal": true; }; }, {}, ["popup"], never, true, [{ directive: typeof i1.DeferredContentAware; inputs: { "preserveContent": "preserveContent"; }; outputs: {}; }]>;
}
/**
 * @developerPreview 21.0
 */
declare class ComboboxInput {
    /** The element that the combobox is attached to. */
    private readonly _elementRef;
    /** The combobox that the input belongs to. */
    readonly combobox: Combobox<any>;
    /** The value of the input. */
    value: _angular_core.ModelSignal<string>;
    constructor();
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxInput, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxInput, "input[ngComboboxInput]", ["ngComboboxInput"], { "value": { "alias": "value"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; }, never, never, true, never>;
}
/**
 * @developerPreview 21.0
 */
declare class ComboboxPopupContainer {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxPopupContainer, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxPopupContainer, "ng-template[ngComboboxPopupContainer]", ["ngComboboxPopupContainer"], {}, {}, never, never, true, [{ directive: typeof i1.DeferredContent; inputs: {}; outputs: {}; }]>;
}
/**
 * @developerPreview 21.0
 */
declare class ComboboxPopup<V> {
    /** The combobox that the popup belongs to. */
    readonly combobox: Combobox<V> | null;
    /** The controls the popup exposes to the combobox. */
    readonly controls: WritableSignal<ComboboxDialogPattern | ComboboxListboxControls<any, V> | ComboboxTreeControls<any, V> | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxPopup<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxPopup<any>, "[ngComboboxPopup]", ["ngComboboxPopup"], {}, {}, never, never, true, never>;
}
/**
 * @developerPreview 21.0
 */
declare class ComboboxDialog {
    /** The dialog element. */
    readonly element: ElementRef<any>;
    /** The combobox that the dialog belongs to. */
    readonly combobox: Combobox<any>;
    /** A reference to the parent combobox popup, if one exists. */
    private readonly _popup;
    _pattern: ComboboxDialogPattern;
    constructor();
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxDialog, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxDialog, "dialog[ngComboboxDialog]", ["ngComboboxDialog"], {}, {}, never, never, true, [{ directive: typeof ComboboxPopup; inputs: {}; outputs: {}; }]>;
}

export { Combobox, ComboboxDialog, ComboboxInput, ComboboxPopup, ComboboxPopupContainer };
