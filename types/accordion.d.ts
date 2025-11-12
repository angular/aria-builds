import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import * as _angular_core from '@angular/core';
import { WritableSignal } from '@angular/core';
import * as i1 from '@angular/aria/private';
import { AccordionTriggerPattern, AccordionPanelPattern, AccordionGroupPattern } from '@angular/aria/private';

/**
 * Represents the content panel of an accordion item. It is controlled by an
 * associated `AccordionTrigger`.
 *
 * @developerPreview 21.0
 */
declare class AccordionPanel {
    /** The DeferredContentAware host directive. */
    private readonly _deferredContentAware;
    /** A global unique identifier for the panel. */
    private readonly _id;
    /** A local unique identifier for the panel, used to match with its trigger's `panelId`. */
    panelId: _angular_core.InputSignal<string>;
    /** Whether the accordion panel is visible. True if the associated trigger is expanded. */
    readonly visible: _angular_core.Signal<boolean>;
    /** The parent accordion trigger pattern that controls this panel. This is set by AccordionGroup. */
    readonly accordionTrigger: WritableSignal<AccordionTriggerPattern | undefined>;
    /** The UI pattern instance for this panel. */
    readonly _pattern: AccordionPanelPattern;
    constructor();
    /** Expands this item. */
    expand(): void;
    /** Collapses this item. */
    collapse(): void;
    /** Toggles the expansion state of this item. */
    toggle(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<AccordionPanel, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<AccordionPanel, "[ngAccordionPanel]", ["ngAccordionPanel"], { "panelId": { "alias": "panelId"; "required": true; "isSignal": true; }; }, {}, never, never, true, [{ directive: typeof i1.DeferredContentAware; inputs: { "preserveContent": "preserveContent"; }; outputs: {}; }]>;
}
/**
 * Represents the trigger button for an accordion item. It controls the expansion
 * state of an associated `AccordionPanel`.
 *
 * @developerPreview 21.0
 */
declare class AccordionTrigger {
    /** A global unique identifier for the trigger. */
    private readonly _id;
    /** A reference to the trigger element. */
    private readonly _elementRef;
    /** The parent AccordionGroup. */
    private readonly _accordionGroup;
    /** A local unique identifier for the trigger, used to match with its panel's `panelId`. */
    panelId: _angular_core.InputSignal<string>;
    /** Whether the trigger is disabled. */
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the trigger is active. */
    readonly active: _angular_core.Signal<boolean>;
    /** Whether the trigger is expanded. */
    readonly expanded: _angular_core.Signal<boolean>;
    /**
     * Whether this trigger is completely inaccessible.
     *
     * TODO(ok7sai): Consider move this to UI patterns.
     */
    readonly hardDisabled: _angular_core.Signal<boolean>;
    /** The accordion panel pattern controlled by this trigger. This is set by AccordionGroup. */
    readonly accordionPanel: WritableSignal<AccordionPanelPattern | undefined>;
    /** The UI pattern instance for this trigger. */
    readonly _pattern: AccordionTriggerPattern;
    /** Expands this item. */
    expand(): void;
    /** Collapses this item. */
    collapse(): void;
    /** Toggles the expansion state of this item. */
    toggle(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<AccordionTrigger, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<AccordionTrigger, "[ngAccordionTrigger]", ["ngAccordionTrigger"], { "panelId": { "alias": "panelId"; "required": true; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
/**
 * Container for a group of accordion items. It manages the overall state and
 * interactions of the accordion, such as keyboard navigation and expansion mode.
 *
 * @developerPreview 21.0
 */
declare class AccordionGroup {
    /** A reference to the group element. */
    private readonly _elementRef;
    /** The AccordionTriggers nested inside this group. */
    protected readonly _triggers: _angular_core.Signal<readonly AccordionTrigger[]>;
    /** The AccordionPanels nested inside this group. */
    protected readonly _panels: _angular_core.Signal<readonly AccordionPanel[]>;
    /** The text direction (ltr or rtl). */
    readonly textDirection: WritableSignal<_angular_cdk_bidi.Direction>;
    /** Whether the entire accordion group is disabled. */
    disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether multiple accordion items can be expanded simultaneously. */
    multiExpandable: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The ids of the current expanded accordion panels. */
    expandedPanels: _angular_core.ModelSignal<string[]>;
    /** Whether to allow disabled items to receive focus. */
    softDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether keyboard navigation should wrap around from the last item to the first, and vice-versa. */
    wrap: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The UI pattern instance for this accordion group. */
    readonly _pattern: AccordionGroupPattern;
    constructor();
    /** Expands all accordion panels if multi-expandable. */
    expandAll(): void;
    /** Collapses all accordion panels. */
    collapseAll(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<AccordionGroup, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<AccordionGroup, "[ngAccordionGroup]", ["ngAccordionGroup"], { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "multiExpandable": { "alias": "multiExpandable"; "required": false; "isSignal": true; }; "expandedPanels": { "alias": "expandedPanels"; "required": false; "isSignal": true; }; "softDisabled": { "alias": "softDisabled"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; }, { "expandedPanels": "expandedPanelsChange"; }, ["_triggers", "_panels"], never, true, never>;
}
/**
 * A structural directive that marks the `ng-template` to be used as the content
 * for a `AccordionPanel`. This content can be lazily loaded.
 *
 * @developerPreview 21.0
 */
declare class AccordionContent {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<AccordionContent, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<AccordionContent, "ng-template[ngAccordionContent]", never, {}, {}, never, never, true, [{ directive: typeof i1.DeferredContent; inputs: {}; outputs: {}; }]>;
}

export { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger };
