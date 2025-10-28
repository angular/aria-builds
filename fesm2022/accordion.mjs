import * as i0 from '@angular/core';
import { inject, input, signal, afterRenderEffect, Directive, ElementRef, booleanAttribute, computed, contentChildren, model } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import * as i1 from '@angular/aria/deferred-content';
import { DeferredContentAware, DeferredContent } from '@angular/aria/deferred-content';
import { AccordionPanelPattern, AccordionTriggerPattern, AccordionGroupPattern } from '@angular/aria/private';

/**
 * Represents the content panel of an accordion item. It is controlled by an
 * associated `AccordionTrigger`.
 */
class AccordionPanel {
    /** The DeferredContentAware host directive. */
    _deferredContentAware = inject(DeferredContentAware);
    /** A global unique identifier for the panel. */
    _id = inject(_IdGenerator).getId('accordion-trigger-', true);
    /** A local unique identifier for the panel, used to match with its trigger's value. */
    value = input.required(...(ngDevMode ? [{ debugName: "value" }] : []));
    /** The parent accordion trigger pattern that controls this panel. This is set by AccordionGroup. */
    accordionTrigger = signal(undefined, ...(ngDevMode ? [{ debugName: "accordionTrigger" }] : []));
    /** The UI pattern instance for this panel. */
    _pattern = new AccordionPanelPattern({
        id: () => this._id,
        value: this.value,
        accordionTrigger: () => this.accordionTrigger(),
    });
    constructor() {
        // Connect the panel's hidden state to the DeferredContentAware's visibility.
        afterRenderEffect(() => {
            this._deferredContentAware.contentVisible.set(!this._pattern.hidden());
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: AccordionPanel, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: AccordionPanel, isStandalone: true, selector: "[ngAccordionPanel]", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: true, transformFunction: null } }, host: { attributes: { "role": "region" }, properties: { "attr.id": "_pattern.id()", "attr.aria-labelledby": "_pattern.accordionTrigger()?.id()", "attr.inert": "_pattern.hidden() ? true : null" }, classAttribute: "ng-accordion-panel" }, exportAs: ["ngAccordionPanel"], hostDirectives: [{ directive: i1.DeferredContentAware, inputs: ["preserveContent", "preserveContent"] }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: AccordionPanel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngAccordionPanel]',
                    exportAs: 'ngAccordionPanel',
                    hostDirectives: [
                        {
                            directive: DeferredContentAware,
                            inputs: ['preserveContent'],
                        },
                    ],
                    host: {
                        'class': 'ng-accordion-panel',
                        'role': 'region',
                        '[attr.id]': '_pattern.id()',
                        '[attr.aria-labelledby]': '_pattern.accordionTrigger()?.id()',
                        '[attr.inert]': '_pattern.hidden() ? true : null',
                    },
                }]
        }], ctorParameters: () => [] });
/**
 * Represents the trigger button for an accordion item. It controls the expansion
 * state of an associated `AccordionPanel`.
 */
class AccordionTrigger {
    /** A global unique identifier for the trigger. */
    _id = inject(_IdGenerator).getId('ng-accordion-trigger-', true);
    /** A reference to the trigger element. */
    _elementRef = inject(ElementRef);
    /** The parent AccordionGroup. */
    _accordionGroup = inject(AccordionGroup);
    /** A local unique identifier for the trigger, used to match with its panel's value. */
    value = input.required(...(ngDevMode ? [{ debugName: "value" }] : []));
    /** Whether the trigger is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /**
     * Whether this trigger is completely inaccessible.
     *
     * TODO(ok7sai): Consider move this to UI patterns.
     */
    hardDisabled = computed(() => this._pattern.disabled() && this._pattern.tabindex() < 0, ...(ngDevMode ? [{ debugName: "hardDisabled" }] : []));
    /** The accordion panel pattern controlled by this trigger. This is set by AccordionGroup. */
    accordionPanel = signal(undefined, ...(ngDevMode ? [{ debugName: "accordionPanel" }] : []));
    /** The UI pattern instance for this trigger. */
    _pattern = new AccordionTriggerPattern({
        id: () => this._id,
        value: this.value,
        disabled: this.disabled,
        element: () => this._elementRef.nativeElement,
        accordionGroup: computed(() => this._accordionGroup._pattern),
        accordionPanel: this.accordionPanel,
    });
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: AccordionTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: AccordionTrigger, isStandalone: true, selector: "[ngAccordionTrigger]", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: true, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null } }, host: { attributes: { "role": "button" }, listeners: { "keydown": "_pattern.onKeydown($event)", "pointerdown": "_pattern.onPointerdown($event)", "focusin": "_pattern.onFocus($event)" }, properties: { "attr.data-active": "_pattern.active()", "id": "_pattern.id()", "attr.aria-expanded": "_pattern.expanded()", "attr.aria-controls": "_pattern.controls()", "attr.aria-disabled": "_pattern.disabled()", "attr.disabled": "hardDisabled() ? true : null", "attr.tabindex": "_pattern.tabindex()" }, classAttribute: "ng-accordion-trigger" }, exportAs: ["ngAccordionTrigger"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: AccordionTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngAccordionTrigger]',
                    exportAs: 'ngAccordionTrigger',
                    host: {
                        'class': 'ng-accordion-trigger',
                        '[attr.data-active]': '_pattern.active()',
                        'role': 'button',
                        '[id]': '_pattern.id()',
                        '[attr.aria-expanded]': '_pattern.expanded()',
                        '[attr.aria-controls]': '_pattern.controls()',
                        '[attr.aria-disabled]': '_pattern.disabled()',
                        '[attr.disabled]': 'hardDisabled() ? true : null',
                        '[attr.tabindex]': '_pattern.tabindex()',
                        '(keydown)': '_pattern.onKeydown($event)',
                        '(pointerdown)': '_pattern.onPointerdown($event)',
                        '(focusin)': '_pattern.onFocus($event)',
                    },
                }]
        }] });
/**
 * Container for a group of accordion items. It manages the overall state and
 * interactions of the accordion, such as keyboard navigation and expansion mode.
 */
class AccordionGroup {
    /** A reference to the group element. */
    _elementRef = inject(ElementRef);
    /** The AccordionTriggers nested inside this group. */
    _triggers = contentChildren(AccordionTrigger, ...(ngDevMode ? [{ debugName: "_triggers", descendants: true }] : [{ descendants: true }]));
    /** The AccordionPanels nested inside this group. */
    _panels = contentChildren(AccordionPanel, ...(ngDevMode ? [{ debugName: "_panels", descendants: true }] : [{ descendants: true }]));
    /** The text direction (ltr or rtl). */
    textDirection = inject(Directionality).valueSignal;
    /** Whether the entire accordion group is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether multiple accordion items can be expanded simultaneously. */
    multiExpandable = input(true, ...(ngDevMode ? [{ debugName: "multiExpandable", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The values of the current selected/expanded accordions. */
    value = model([], ...(ngDevMode ? [{ debugName: "value" }] : []));
    /** Whether disabled items should be skipped during keyboard navigation. */
    skipDisabled = input(true, ...(ngDevMode ? [{ debugName: "skipDisabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether keyboard navigation should wrap around from the last item to the first, and vice-versa. */
    wrap = input(false, ...(ngDevMode ? [{ debugName: "wrap", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The UI pattern instance for this accordion group. */
    _pattern = new AccordionGroupPattern({
        ...this,
        // TODO(ok7sai): Consider making `activeItem` an internal state in the pattern and call
        // `setDefaultState` in the CDK.
        activeItem: signal(undefined),
        items: computed(() => this._triggers().map(trigger => trigger._pattern)),
        expandedIds: this.value,
        // TODO(ok7sai): Investigate whether an accordion should support horizontal mode.
        orientation: () => 'vertical',
        element: () => this._elementRef.nativeElement,
    });
    constructor() {
        // Effect to link triggers with their corresponding panels and update the group's items.
        afterRenderEffect(() => {
            const triggers = this._triggers();
            const panels = this._panels();
            for (const trigger of triggers) {
                const panel = panels.find(p => p.value() === trigger.value());
                trigger.accordionPanel.set(panel?._pattern);
                if (panel) {
                    panel.accordionTrigger.set(trigger._pattern);
                }
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: AccordionGroup, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.2.0", version: "20.2.0-next.2", type: AccordionGroup, isStandalone: true, selector: "[ngAccordionGroup]", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, multiExpandable: { classPropertyName: "multiExpandable", publicName: "multiExpandable", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, skipDisabled: { classPropertyName: "skipDisabled", publicName: "skipDisabled", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange" }, host: { classAttribute: "ng-accordion-group" }, queries: [{ propertyName: "_triggers", predicate: AccordionTrigger, descendants: true, isSignal: true }, { propertyName: "_panels", predicate: AccordionPanel, descendants: true, isSignal: true }], exportAs: ["ngAccordionGroup"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: AccordionGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngAccordionGroup]',
                    exportAs: 'ngAccordionGroup',
                    host: {
                        'class': 'ng-accordion-group',
                    },
                }]
        }], ctorParameters: () => [] });
/**
 * A structural directive that marks the `ng-template` to be used as the content
 * for a `AccordionPanel`. This content can be lazily loaded.
 */
class AccordionContent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: AccordionContent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: AccordionContent, isStandalone: true, selector: "ng-template[ngAccordionContent]", hostDirectives: [{ directive: i1.DeferredContent }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: AccordionContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[ngAccordionContent]',
                    hostDirectives: [DeferredContent],
                }]
        }] });

export { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger };
//# sourceMappingURL=accordion.mjs.map
