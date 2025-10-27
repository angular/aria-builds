import * as i0 from '@angular/core';
import { inject, computed, ElementRef, contentChildren, input, booleanAttribute, model, signal, afterRenderEffect, untracked, Directive } from '@angular/core';
import { ComboboxListboxPattern, ListboxPattern, OptionPattern } from '@angular/aria/private';
import { Directionality } from '@angular/cdk/bidi';
import { toSignal } from '@angular/core/rxjs-interop';
import { _IdGenerator } from '@angular/cdk/a11y';
import { ComboboxPopup } from './combobox.mjs';
import '@angular/aria/deferred-content';

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
class Listbox {
    /** A unique identifier for the listbox. */
    _generatedId = inject(_IdGenerator).getId('ng-listbox-');
    // TODO(wagnermaciel): https://github.com/angular/components/pull/30495#discussion_r1972601144.
    /** A unique identifier for the listbox. */
    id = computed(() => this._generatedId, ...(ngDevMode ? [{ debugName: "id" }] : []));
    /** A reference to the parent combobox popup, if one exists. */
    _popup = inject(ComboboxPopup, {
        optional: true,
    });
    /** A reference to the listbox element. */
    _elementRef = inject(ElementRef);
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    _directionality = inject(Directionality);
    /** The Options nested inside of the Listbox. */
    _options = contentChildren(Option, ...(ngDevMode ? [{ debugName: "_options", descendants: true }] : [{ descendants: true }]));
    /** A signal wrapper for directionality. */
    textDirection = toSignal(this._directionality.change, {
        initialValue: this._directionality.value,
    });
    /** The Option UIPatterns of the child Options. */
    items = computed(() => this._options().map(option => option._pattern), ...(ngDevMode ? [{ debugName: "items" }] : []));
    /** Whether the list is vertically or horizontally oriented. */
    orientation = input('vertical', ...(ngDevMode ? [{ debugName: "orientation" }] : []));
    /** Whether multiple items in the list can be selected at once. */
    multi = input(false, ...(ngDevMode ? [{ debugName: "multi", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether focus should wrap when navigating. */
    wrap = input(true, ...(ngDevMode ? [{ debugName: "wrap", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether disabled items in the list should be skipped when navigating. */
    skipDisabled = input(true, ...(ngDevMode ? [{ debugName: "skipDisabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The focus strategy used by the list. */
    focusMode = input('roving', ...(ngDevMode ? [{ debugName: "focusMode" }] : []));
    /** The selection strategy used by the list. */
    selectionMode = input('follow', ...(ngDevMode ? [{ debugName: "selectionMode" }] : []));
    /** The amount of time before the typeahead search is reset. */
    typeaheadDelay = input(0.5, ...(ngDevMode ? [{ debugName: "typeaheadDelay" }] : [])); // Picked arbitrarily.
    /** Whether the listbox is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether the listbox is readonly. */
    readonly = input(false, ...(ngDevMode ? [{ debugName: "readonly", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The values of the current selected items. */
    value = model([], ...(ngDevMode ? [{ debugName: "value" }] : []));
    /** The Listbox UIPattern. */
    _pattern;
    /** Whether the listbox has received focus yet. */
    _hasFocused = signal(false, ...(ngDevMode ? [{ debugName: "_hasFocused" }] : []));
    constructor() {
        const inputs = {
            ...this,
            id: this.id,
            items: this.items,
            activeItem: signal(undefined),
            textDirection: this.textDirection,
            element: () => this._elementRef.nativeElement,
            combobox: () => this._popup?.combobox?._pattern,
        };
        this._pattern = this._popup?.combobox
            ? new ComboboxListboxPattern(inputs)
            : new ListboxPattern(inputs);
        if (this._popup) {
            this._popup.controls.set(this._pattern);
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
            if (!this._hasFocused()) {
                this._pattern.setDefaultState();
            }
        });
        // Ensure that if the active item is removed from
        // the list, the listbox updates it's focus state.
        afterRenderEffect(() => {
            const items = inputs.items();
            const activeItem = untracked(() => inputs.activeItem());
            if (!items.some(i => i === activeItem) && activeItem) {
                this._pattern.listBehavior.unfocus();
            }
        });
        // Ensure that the value is always in sync with the available options.
        afterRenderEffect(() => {
            const items = inputs.items();
            const value = untracked(() => this.value());
            if (items && value.some(v => !items.some(i => i.value() === v))) {
                this.value.set(value.filter(v => items.some(i => i.value() === v)));
            }
        });
    }
    onFocus() {
        this._hasFocused.set(true);
    }
    scrollActiveItemIntoView(options = { block: 'nearest' }) {
        this._pattern.inputs.activeItem()?.element().scrollIntoView(options);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Listbox, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.2.0", version: "20.2.0-next.2", type: Listbox, isStandalone: true, selector: "[ngListbox]", inputs: { orientation: { classPropertyName: "orientation", publicName: "orientation", isSignal: true, isRequired: false, transformFunction: null }, multi: { classPropertyName: "multi", publicName: "multi", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null }, skipDisabled: { classPropertyName: "skipDisabled", publicName: "skipDisabled", isSignal: true, isRequired: false, transformFunction: null }, focusMode: { classPropertyName: "focusMode", publicName: "focusMode", isSignal: true, isRequired: false, transformFunction: null }, selectionMode: { classPropertyName: "selectionMode", publicName: "selectionMode", isSignal: true, isRequired: false, transformFunction: null }, typeaheadDelay: { classPropertyName: "typeaheadDelay", publicName: "typeaheadDelay", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, readonly: { classPropertyName: "readonly", publicName: "readonly", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange" }, host: { attributes: { "role": "listbox" }, listeners: { "keydown": "_pattern.onKeydown($event)", "pointerdown": "_pattern.onPointerdown($event)", "focusin": "onFocus()" }, properties: { "attr.id": "id()", "attr.tabindex": "_pattern.tabindex()", "attr.aria-readonly": "_pattern.readonly()", "attr.aria-disabled": "_pattern.disabled()", "attr.aria-orientation": "_pattern.orientation()", "attr.aria-multiselectable": "_pattern.multi()", "attr.aria-activedescendant": "_pattern.activedescendant()" }, classAttribute: "ng-listbox" }, queries: [{ propertyName: "_options", predicate: Option, descendants: true, isSignal: true }], exportAs: ["ngListbox"], hostDirectives: [{ directive: ComboboxPopup }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Listbox, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngListbox]',
                    exportAs: 'ngListbox',
                    host: {
                        'role': 'listbox',
                        'class': 'ng-listbox',
                        '[attr.id]': 'id()',
                        '[attr.tabindex]': '_pattern.tabindex()',
                        '[attr.aria-readonly]': '_pattern.readonly()',
                        '[attr.aria-disabled]': '_pattern.disabled()',
                        '[attr.aria-orientation]': '_pattern.orientation()',
                        '[attr.aria-multiselectable]': '_pattern.multi()',
                        '[attr.aria-activedescendant]': '_pattern.activedescendant()',
                        '(keydown)': '_pattern.onKeydown($event)',
                        '(pointerdown)': '_pattern.onPointerdown($event)',
                        '(focusin)': 'onFocus()',
                    },
                    hostDirectives: [{ directive: ComboboxPopup }],
                }]
        }], ctorParameters: () => [] });
/** A selectable option in a Listbox. */
class Option {
    /** A reference to the option element. */
    _elementRef = inject(ElementRef);
    /** The parent Listbox. */
    _listbox = inject(Listbox);
    /** A unique identifier for the option. */
    _generatedId = inject(_IdGenerator).getId('ng-option-');
    // TODO(wagnermaciel): https://github.com/angular/components/pull/30495#discussion_r1972601144.
    /** A unique identifier for the option. */
    id = computed(() => this._generatedId, ...(ngDevMode ? [{ debugName: "id" }] : []));
    // TODO(wagnermaciel): See if we want to change how we handle this since textContent is not
    // reactive. See https://github.com/angular/components/pull/30495#discussion_r1961260216.
    /** The text used by the typeahead search. */
    searchTerm = computed(() => this.label() ?? this.element().textContent, ...(ngDevMode ? [{ debugName: "searchTerm" }] : []));
    /** The parent Listbox UIPattern. */
    listbox = computed(() => this._listbox._pattern, ...(ngDevMode ? [{ debugName: "listbox" }] : []));
    /** A reference to the option element to be focused on navigation. */
    element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{ debugName: "element" }] : []));
    /** The value of the option. */
    value = input.required(...(ngDevMode ? [{ debugName: "value" }] : []));
    /** Whether an item is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The text used by the typeahead search. */
    label = input(...(ngDevMode ? [undefined, { debugName: "label" }] : []));
    /** Whether the option is selected. */
    selected = computed(() => this._pattern.selected(), ...(ngDevMode ? [{ debugName: "selected" }] : []));
    /** The Option UIPattern. */
    _pattern = new OptionPattern({
        ...this,
        id: this.id,
        value: this.value,
        listbox: this.listbox,
        element: this.element,
        searchTerm: this.searchTerm,
    });
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Option, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: Option, isStandalone: true, selector: "[ngOption]", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: true, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, host: { attributes: { "role": "option" }, properties: { "attr.data-active": "_pattern.active()", "attr.id": "_pattern.id()", "attr.tabindex": "_pattern.tabindex()", "attr.aria-selected": "_pattern.selected()", "attr.aria-disabled": "_pattern.disabled()" }, classAttribute: "ng-option" }, exportAs: ["ngOption"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Option, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngOption]',
                    exportAs: 'ngOption',
                    host: {
                        'role': 'option',
                        'class': 'ng-option',
                        '[attr.data-active]': '_pattern.active()',
                        '[attr.id]': '_pattern.id()',
                        '[attr.tabindex]': '_pattern.tabindex()',
                        '[attr.aria-selected]': '_pattern.selected()',
                        '[attr.aria-disabled]': '_pattern.disabled()',
                    },
                }]
        }] });

export { Listbox, Option };
//# sourceMappingURL=listbox.mjs.map
