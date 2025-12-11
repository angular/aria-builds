import * as _angular_core from '@angular/core';
import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import { ComboboxListboxControls, ComboboxTreeControls, ComboboxDialogPattern, ComboboxPattern } from './_combobox-chunk.d2.ts';
import { DeferredContentAware } from './_deferred-content-chunk.js';

/**
 * Identifies an element as a popup for an `ngCombobox`.
 *
 * This directive acts as a bridge, allowing the `ngCombobox` to discover and interact
 * with the underlying control (e.g., `ngListbox`, `ngTree`, or `ngComboboxDialog`) that
 * manages the options. It's primarily used as a host directive and is responsible for
 * exposing the popup's control pattern to the parent combobox.
 *
 * @developerPreview 21.0
 */
declare class ComboboxPopup<V> {
    /** The combobox that the popup belongs to. */
    readonly combobox: Combobox<V> | null;
    /** The popup controls exposed to the combobox. */
    readonly _controls: _angular_core.WritableSignal<ComboboxListboxControls<any, V> | ComboboxTreeControls<any, V> | ComboboxDialogPattern | undefined>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxPopup<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxPopup<any>, "[ngComboboxPopup]", ["ngComboboxPopup"], {}, {}, never, never, true, never>;
}

/**
 * The container element that wraps a combobox input and popup, and orchestrates its behavior.
 *
 * The `ngCombobox` directive is the main entry point for creating a combobox and customizing its
 * behavior. It coordinates the interactions between the `ngComboboxInput` and the popup, which
 * is defined by a `ng-template` with the `ngComboboxPopupContainer` directive. If using the
 * `CdkOverlay`, the `cdkConnectedOverlay` directive takes the place of `ngComboboxPopupContainer`.
 *
 * ```html
 * <div ngCombobox filterMode="highlight">
 *   <input
 *     ngComboboxInput
 *     placeholder="Search for a state..."
 *     [(value)]="searchString"
 *   />
 *
 *   <ng-template ngComboboxPopupContainer>
 *     <div ngListbox [(value)]="selectedValue">
 *       @for (option of filteredOptions(); track option) {
 *         <div ngOption [value]="option" [label]="option">
 *           <span>{{option}}</span>
 *         </div>
 *       }
 *     </div>
 *   </ng-template>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 */
declare class Combobox<V> {
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    private readonly _directionality;
    /** A signal wrapper for directionality. */
    protected textDirection: _angular_core.Signal<_angular_cdk_bidi.Direction>;
    /** The element that the combobox is attached to. */
    private readonly _elementRef;
    /** A reference to the combobox element. */
    readonly element: HTMLElement;
    /** The DeferredContentAware host directive. */
    private readonly _deferredContentAware;
    /** The combobox popup. */
    readonly popup: _angular_core.Signal<ComboboxPopup<V> | undefined>;
    /**
     * The filter mode for the combobox.
     * - `manual`: The consumer is responsible for filtering the options.
     * - `auto-select`: The combobox automatically selects the first matching option.
     * - `highlight`: The combobox highlights matching text in the options without changing selection.
     */
    filterMode: _angular_core.InputSignal<"manual" | "auto-select" | "highlight">;
    /** Whether the combobox is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the combobox is read-only. */
    readonly readonly: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The value of the first matching item in the popup. */
    readonly firstMatch: _angular_core.InputSignal<V | undefined>;
    /** Whether the combobox is expanded. */
    readonly expanded: _angular_core.Signal<boolean>;
    /** Whether the combobox popup should always be expanded, regardless of user interaction. */
    readonly alwaysExpanded: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Input element connected to the combobox, if any. */
    readonly inputElement: _angular_core.Signal<HTMLInputElement | undefined>;
    /** The combobox ui pattern. */
    readonly _pattern: ComboboxPattern<any, V>;
    constructor();
    /** Opens the combobox to the selected item. */
    open(): void;
    /** Closes the combobox. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Combobox<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Combobox<any>, "[ngCombobox]", ["ngCombobox"], { "filterMode": { "alias": "filterMode"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "readonly": { "alias": "readonly"; "required": false; "isSignal": true; }; "firstMatch": { "alias": "firstMatch"; "required": false; "isSignal": true; }; "alwaysExpanded": { "alias": "alwaysExpanded"; "required": false; "isSignal": true; }; }, {}, ["popup"], never, true, [{ directive: typeof DeferredContentAware; inputs: { "preserveContent": "preserveContent"; }; outputs: {}; }]>;
}

export { Combobox, ComboboxPopup };
