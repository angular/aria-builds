import { Combobox, ComboboxPopup } from './_combobox-chunk.js';
import { ComboboxDialogPattern } from './_combobox-chunk.d2.ts';
import * as _angular_core from '@angular/core';
import { DeferredContent } from './_deferred-content-chunk.js';
import '@angular/cdk/bidi';
import './_keyboard-event-manager-chunk.js';
import './_list-navigation-chunk.js';
import './_pointer-event-manager-chunk.js';
import './_list-chunk.js';

/**
 * Integrates a native `<dialog>` element with the combobox, allowing for
 * a modal or non-modal popup experience. It handles the opening and closing of the dialog
 * based on the combobox's expanded state.
 *
 * ```html
 * <ng-template ngComboboxPopupContainer>
 *   <dialog ngComboboxDialog class="example-dialog">
 *     <!-- ... dialog content ... -->
 *   </dialog>
 * </ng-template>
 * ```
 *
 * @developerPreview 21.0
 */
declare class ComboboxDialog {
    /** The dialog element. */
    private readonly _elementRef;
    /** A reference to the dialog element. */
    readonly element: HTMLElement;
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

/**
 * An input that is part of a combobox. It is responsible for displaying the
 * current value and handling user input for filtering and selection.
 *
 * This directive should be applied to an `<input>` element within an `ngCombobox`
 * container. It automatically handles keyboard interactions, such as opening the
 * popup and navigating through the options.
 *
 * ```html
 * <input
 *   ngComboboxInput
 *   placeholder="Search..."
 *   [(value)]="searchString"
 * />
 * ```
 *
 * @developerPreview 21.0
 */
declare class ComboboxInput {
    /** The element that the combobox is attached to. */
    private readonly _elementRef;
    /** A reference to the input element. */
    readonly element: HTMLElement;
    /** The combobox that the input belongs to. */
    readonly combobox: Combobox<any>;
    /** The value of the input. */
    value: _angular_core.ModelSignal<string>;
    constructor();
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxInput, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxInput, "input[ngComboboxInput]", ["ngComboboxInput"], { "value": { "alias": "value"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; }, never, never, true, never>;
}

/**
 * A structural directive that marks the `ng-template` to be used as the popup
 * for a combobox. This content is conditionally rendered.
 *
 * The content of the popup can be a `ngListbox`, `ngTree`, or `role="dialog"`, allowing for
 * flexible and complex combobox implementations. The consumer is responsible for
 * implementing the filtering logic based on the `ngComboboxInput`'s value.
 *
 * ```html
 * <ng-template ngComboboxPopupContainer>
 *   <div ngListbox [(value)]="selectedValue">
 *     <!-- ... options ... -->
 *   </div>
 * </ng-template>
 * ```
 *
 * When using CdkOverlay, this directive can be replaced by `cdkConnectedOverlay`.
 *
 * ```html
 * <ng-template
 *     [cdkConnectedOverlay]="{origin: inputElement, usePopover: 'inline' matchWidth: true}"
 *     [cdkConnectedOverlayOpen]="combobox.expanded()">
 *   <div ngListbox [(value)]="selectedValue">
 *     <!-- ... options ... -->
 *   </div>
 * </ng-template>
 * ```
 *
 * @developerPreview 21.0
 */
declare class ComboboxPopupContainer {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ComboboxPopupContainer, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<ComboboxPopupContainer, "ng-template[ngComboboxPopupContainer]", ["ngComboboxPopupContainer"], {}, {}, never, never, true, [{ directive: typeof DeferredContent; inputs: {}; outputs: {}; }]>;
}

export { Combobox, ComboboxDialog, ComboboxInput, ComboboxPopup, ComboboxPopupContainer, DeferredContent as ɵɵDeferredContent };
