import * as _angular_core from '@angular/core';
import { WritableSignal } from '@angular/core';
import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import { RadioButtonPattern, RadioGroupPattern } from '@angular/aria/private';
import * as i1 from '@angular/aria/toolbar';

/**
 * A radio button group container.
 *
 * Radio groups are used to group multiple radio buttons or radio group labels so they function as
 * a single form control. The RadioGroup is meant to be used in conjunction with RadioButton
 * as follows:
 *
 * ```html
 * <div ngRadioGroup>
 *   <div ngRadioButton value="1">Option 1</div>
 *   <div ngRadioButton value="2">Option 2</div>
 *   <div ngRadioButton value="3">Option 3</div>
 * </div>
 * ```
 */
declare class RadioGroup<V> {
    /** A reference to the radio group element. */
    private readonly _elementRef;
    /** A reference to the ToolbarWidgetGroup, if the radio group is in a toolbar. */
    private readonly _toolbarWidgetGroup;
    /** Whether the radio group is inside of a Toolbar. */
    private readonly _hasToolbar;
    /** The RadioButtons nested inside of the RadioGroup. */
    private readonly _radioButtons;
    /** A signal wrapper for directionality. */
    protected textDirection: WritableSignal<_angular_cdk_bidi.Direction>;
    /** The RadioButton UIPatterns of the child RadioButtons. */
    protected items: _angular_core.Signal<RadioButtonPattern<any>[]>;
    /** Whether the radio group is vertically or horizontally oriented. */
    readonly orientation: _angular_core.InputSignal<"vertical" | "horizontal">;
    /** Whether disabled items in the group should be focusable. */
    readonly softDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The focus strategy used by the radio group. */
    readonly focusMode: _angular_core.InputSignal<"roving" | "activedescendant">;
    /** Whether the radio group is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the radio group is readonly. */
    readonly readonly: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The value of the currently selected radio button. */
    readonly value: _angular_core.ModelSignal<V | null>;
    /** The internal selection state for the radio group. */
    private readonly _value;
    /** The RadioGroup UIPattern. */
    readonly _pattern: RadioGroupPattern<V>;
    /** Whether the radio group has received focus yet. */
    private _hasFocused;
    constructor();
    onFocus(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<RadioGroup<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<RadioGroup<any>, "[ngRadioGroup]", ["ngRadioGroup"], { "orientation": { "alias": "orientation"; "required": false; "isSignal": true; }; "softDisabled": { "alias": "softDisabled"; "required": false; "isSignal": true; }; "focusMode": { "alias": "focusMode"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "readonly": { "alias": "readonly"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; }, ["_radioButtons"], never, true, [{ directive: typeof i1.ToolbarWidgetGroup; inputs: { "disabled": "disabled"; }; outputs: {}; }]>;
}
/** A selectable radio button in a RadioGroup. */
declare class RadioButton<V> {
    /** A reference to the radio button element. */
    private readonly _elementRef;
    /** The parent RadioGroup. */
    private readonly _radioGroup;
    /** A unique identifier for the radio button. */
    private readonly _generatedId;
    /** A unique identifier for the radio button. */
    readonly id: _angular_core.Signal<string>;
    /** The value associated with the radio button. */
    readonly value: _angular_core.InputSignal<V>;
    /** The parent RadioGroup UIPattern. */
    readonly group: _angular_core.Signal<RadioGroupPattern<any>>;
    /** A reference to the radio button element to be focused on navigation. */
    element: _angular_core.Signal<any>;
    /** Whether the radio button is disabled. */
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the radio button is selected. */
    readonly selected: _angular_core.Signal<boolean>;
    /** The RadioButton UIPattern. */
    readonly _pattern: RadioButtonPattern<V>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<RadioButton<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<RadioButton<any>, "[ngRadioButton]", ["ngRadioButton"], { "value": { "alias": "value"; "required": true; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { RadioButton, RadioGroup };
