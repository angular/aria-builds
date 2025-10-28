import * as i0 from '@angular/core';
import { inject, ElementRef, computed, contentChildren, input, booleanAttribute, model, signal, afterRenderEffect, Directive, linkedSignal } from '@angular/core';
import { ToolbarRadioGroupPattern, RadioGroupPattern, RadioButtonPattern } from '@angular/aria/private';
import { Directionality } from '@angular/cdk/bidi';
import { _IdGenerator } from '@angular/cdk/a11y';
import * as i1 from '@angular/aria/toolbar';
import { ToolbarWidgetGroup } from '@angular/aria/toolbar';

// TODO: Move mapSignal to it's own file so it can be reused across components.
/**
 * Creates a new writable signal (signal V) whose value is connected to the given original
 * writable signal (signal T) such that updating signal V updates signal T and vice-versa.
 *
 * This function establishes a two-way synchronization between the source signal and the new mapped
 * signal. When the source signal changes, the mapped signal updates by applying the `transform`
 * function. When the mapped signal is explicitly set or updated, the change is propagated back to
 * the source signal by applying the `reverse` function.
 */
function mapSignal(originalSignal, operations) {
    const mappedSignal = linkedSignal(() => operations.transform(originalSignal()));
    const updateMappedSignal = mappedSignal.update;
    const setMappedSignal = mappedSignal.set;
    mappedSignal.set = (newValue) => {
        setMappedSignal(newValue);
        originalSignal.set(operations.reverse(newValue));
    };
    mappedSignal.update = (updateFn) => {
        updateMappedSignal(oldValue => updateFn(oldValue));
        originalSignal.update(oldValue => operations.reverse(updateFn(operations.transform(oldValue))));
    };
    return mappedSignal;
}
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
class RadioGroup {
    /** A reference to the radio group element. */
    _elementRef = inject(ElementRef);
    /** A reference to the ToolbarWidgetGroup, if the radio group is in a toolbar. */
    _toolbarWidgetGroup = inject(ToolbarWidgetGroup);
    /** Whether the radio group is inside of a Toolbar. */
    _hasToolbar = computed(() => !!this._toolbarWidgetGroup.toolbar(), ...(ngDevMode ? [{ debugName: "_hasToolbar" }] : []));
    /** The RadioButtons nested inside of the RadioGroup. */
    _radioButtons = contentChildren(RadioButton, ...(ngDevMode ? [{ debugName: "_radioButtons", descendants: true }] : [{ descendants: true }]));
    /** A signal wrapper for directionality. */
    textDirection = inject(Directionality).valueSignal;
    /** The RadioButton UIPatterns of the child RadioButtons. */
    items = computed(() => this._radioButtons().map(radio => radio._pattern), ...(ngDevMode ? [{ debugName: "items" }] : []));
    /** Whether the radio group is vertically or horizontally oriented. */
    orientation = input('vertical', ...(ngDevMode ? [{ debugName: "orientation" }] : []));
    /** Whether disabled items in the group should be skipped when navigating. */
    skipDisabled = input(true, ...(ngDevMode ? [{ debugName: "skipDisabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The focus strategy used by the radio group. */
    focusMode = input('roving', ...(ngDevMode ? [{ debugName: "focusMode" }] : []));
    /** Whether the radio group is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether the radio group is readonly. */
    readonly = input(false, ...(ngDevMode ? [{ debugName: "readonly", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The value of the currently selected radio button. */
    value = model(null, ...(ngDevMode ? [{ debugName: "value" }] : []));
    /** The internal selection state for the radio group. */
    _value = mapSignal(this.value, {
        transform: value => (value !== null ? [value] : []),
        reverse: values => (values.length === 0 ? null : values[0]),
    });
    /** The RadioGroup UIPattern. */
    _pattern;
    /** Whether the radio group has received focus yet. */
    _hasFocused = signal(false, ...(ngDevMode ? [{ debugName: "_hasFocused" }] : []));
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
            toolbar: this._toolbarWidgetGroup.toolbar,
        };
        this._pattern = this._hasToolbar()
            ? new ToolbarRadioGroupPattern(inputs)
            : new RadioGroupPattern(inputs);
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: RadioGroup, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.2.0", version: "20.2.0-next.2", type: RadioGroup, isStandalone: true, selector: "[ngRadioGroup]", inputs: { orientation: { classPropertyName: "orientation", publicName: "orientation", isSignal: true, isRequired: false, transformFunction: null }, skipDisabled: { classPropertyName: "skipDisabled", publicName: "skipDisabled", isSignal: true, isRequired: false, transformFunction: null }, focusMode: { classPropertyName: "focusMode", publicName: "focusMode", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, readonly: { classPropertyName: "readonly", publicName: "readonly", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange" }, host: { attributes: { "role": "radiogroup" }, listeners: { "keydown": "_pattern.onKeydown($event)", "pointerdown": "_pattern.onPointerdown($event)", "focusin": "onFocus()" }, properties: { "attr.tabindex": "_pattern.tabindex()", "attr.aria-readonly": "_pattern.readonly()", "attr.aria-disabled": "_pattern.disabled()", "attr.aria-orientation": "_pattern.orientation()", "attr.aria-activedescendant": "_pattern.activedescendant()" }, classAttribute: "ng-radio-group" }, queries: [{ propertyName: "_radioButtons", predicate: RadioButton, descendants: true, isSignal: true }], exportAs: ["ngRadioGroup"], hostDirectives: [{ directive: i1.ToolbarWidgetGroup, inputs: ["disabled", "disabled"] }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: RadioGroup, decorators: [{
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
                        '(focusin)': 'onFocus()',
                    },
                    hostDirectives: [
                        {
                            directive: ToolbarWidgetGroup,
                            inputs: ['disabled'],
                        },
                    ],
                }]
        }], ctorParameters: () => [] });
/** A selectable radio button in a RadioGroup. */
class RadioButton {
    /** A reference to the radio button element. */
    _elementRef = inject(ElementRef);
    /** The parent RadioGroup. */
    _radioGroup = inject(RadioGroup);
    /** A unique identifier for the radio button. */
    _generatedId = inject(_IdGenerator).getId('ng-radio-button-', true);
    /** A unique identifier for the radio button. */
    id = computed(() => this._generatedId, ...(ngDevMode ? [{ debugName: "id" }] : []));
    /** The value associated with the radio button. */
    value = input.required(...(ngDevMode ? [{ debugName: "value" }] : []));
    /** The parent RadioGroup UIPattern. */
    group = computed(() => this._radioGroup._pattern, ...(ngDevMode ? [{ debugName: "group" }] : []));
    /** A reference to the radio button element to be focused on navigation. */
    element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{ debugName: "element" }] : []));
    /** Whether the radio button is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether the radio button is selected. */
    selected = computed(() => this._pattern.selected(), ...(ngDevMode ? [{ debugName: "selected" }] : []));
    /** The RadioButton UIPattern. */
    _pattern = new RadioButtonPattern({
        ...this,
        id: this.id,
        value: this.value,
        group: this.group,
        element: this.element,
    });
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: RadioButton, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: RadioButton, isStandalone: true, selector: "[ngRadioButton]", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: true, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, host: { attributes: { "role": "radio" }, properties: { "attr.data-active": "_pattern.active()", "attr.tabindex": "_pattern.tabindex()", "attr.aria-checked": "_pattern.selected()", "attr.aria-disabled": "_pattern.disabled()", "id": "_pattern.id()" }, classAttribute: "ng-radio-button" }, exportAs: ["ngRadioButton"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: RadioButton, decorators: [{
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
                        '[id]': '_pattern.id()',
                    },
                }]
        }] });

export { RadioButton, RadioGroup };
//# sourceMappingURL=radio-group.mjs.map
