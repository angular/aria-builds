import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import * as _angular_core from '@angular/core';
import { OptionPattern, ListboxPattern } from '@angular/aria/private';
import { ComboboxPopup } from './combobox.js';

/**
 * A listbox container.
 *
 * Listboxes are used to display a list of items for a user to select from. The Listbox is meant
 * to be used in conjunction with Option as follows:
 *
 * ```html
 * <ul ngListbox>
 *   <li [value]="1" ngOption>Item 1</li>
 *   <li [value]="2" ngOption>Item 2</li>
 *   <li [value]="3" ngOption>Item 3</li>
 * </ul>
 * ```
 */
declare class Listbox<V> {
    /** A unique identifier for the listbox. */
    private readonly _generatedId;
    /** A unique identifier for the listbox. */
    protected id: _angular_core.Signal<string>;
    /** A reference to the parent combobox popup, if one exists. */
    private readonly _popup;
    /** A reference to the listbox element. */
    private readonly _elementRef;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    private readonly _directionality;
    /** The Options nested inside of the Listbox. */
    private readonly _options;
    /** A signal wrapper for directionality. */
    protected textDirection: _angular_core.Signal<_angular_cdk_bidi.Direction>;
    /** The Option UIPatterns of the child Options. */
    protected items: _angular_core.Signal<OptionPattern<any>[]>;
    /** Whether the list is vertically or horizontally oriented. */
    orientation: _angular_core.InputSignal<"vertical" | "horizontal">;
    /** Whether multiple items in the list can be selected at once. */
    multi: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether focus should wrap when navigating. */
    wrap: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether to allow disabled items in the list to receive focus. */
    softDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The focus strategy used by the list. */
    focusMode: _angular_core.InputSignal<"roving" | "activedescendant">;
    /** The selection strategy used by the list. */
    selectionMode: _angular_core.InputSignal<"follow" | "explicit">;
    /** The amount of time before the typeahead search is reset. */
    typeaheadDelay: _angular_core.InputSignal<number>;
    /** Whether the listbox is disabled. */
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the listbox is readonly. */
    readonly: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The values of the current selected items. */
    values: _angular_core.ModelSignal<V[]>;
    /** The Listbox UIPattern. */
    readonly _pattern: ListboxPattern<V>;
    /** Whether the listbox has received focus yet. */
    private _hasFocused;
    constructor();
    onFocus(): void;
    scrollActiveItemIntoView(options?: ScrollIntoViewOptions): void;
    /** Navigates to the first item in the listbox. */
    gotoFirst(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Listbox<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Listbox<any>, "[ngListbox]", ["ngListbox"], { "orientation": { "alias": "orientation"; "required": false; "isSignal": true; }; "multi": { "alias": "multi"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "softDisabled": { "alias": "softDisabled"; "required": false; "isSignal": true; }; "focusMode": { "alias": "focusMode"; "required": false; "isSignal": true; }; "selectionMode": { "alias": "selectionMode"; "required": false; "isSignal": true; }; "typeaheadDelay": { "alias": "typeaheadDelay"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "readonly": { "alias": "readonly"; "required": false; "isSignal": true; }; "values": { "alias": "values"; "required": false; "isSignal": true; }; }, { "values": "valuesChange"; }, ["_options"], never, true, [{ directive: typeof ComboboxPopup; inputs: {}; outputs: {}; }]>;
}
/** A selectable option in a Listbox. */
declare class Option<V> {
    /** A reference to the option element. */
    private readonly _elementRef;
    /** The parent Listbox. */
    private readonly _listbox;
    /** A unique identifier for the option. */
    private readonly _generatedId;
    /** A unique identifier for the option. */
    protected id: _angular_core.Signal<string>;
    /** The text used by the typeahead search. */
    protected searchTerm: _angular_core.Signal<any>;
    /** The parent Listbox UIPattern. */
    protected listbox: _angular_core.Signal<ListboxPattern<any>>;
    /** A reference to the option element to be focused on navigation. */
    protected element: _angular_core.Signal<any>;
    /** The value of the option. */
    value: _angular_core.InputSignal<V>;
    /** Whether an item is disabled. */
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The text used by the typeahead search. */
    label: _angular_core.InputSignal<string | undefined>;
    /** Whether the option is selected. */
    readonly selected: _angular_core.Signal<boolean | undefined>;
    /** The Option UIPattern. */
    readonly _pattern: OptionPattern<V>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Option<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Option<any>, "[ngOption]", ["ngOption"], { "value": { "alias": "value"; "required": true; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { Listbox, Option };
