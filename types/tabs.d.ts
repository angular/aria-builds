import * as _angular_core from '@angular/core';
import { Signal, OnInit, OnDestroy } from '@angular/core';
import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import * as i1 from '@angular/aria/private';
import { TabPattern, TabPanelPattern, TabListPattern } from '@angular/aria/private';

interface HasElement {
    element: Signal<HTMLElement>;
}
/**
 * A Tabs container.
 *
 * The `ngTabs` directive represents a set of layered sections of content. It acts as the
 * overarching container for a tabbed interface, coordinating the behavior of `ngTabList`,
 * `ngTab`, and `ngTabPanel` directives.
 *
 * ```html
 * <div ngTabs>
 *   <ul ngTabList [(selectedTab)]="selectedTabValue">
 *     <li ngTab value="tab1">Tab 1</li>
 *     <li ngTab value="tab2">Tab 2</li>
 *     <li ngTab value="tab3">Tab 3</li>
 *   </ul>
 *
 *   <div ngTabPanel value="tab1">
 *      <ng-template ngTabContent>Content for Tab 1</ng-template>
 *   </div>
 *   <div ngTabPanel value="tab2">
 *      <ng-template ngTabContent>Content for Tab 2</ng-template>
 *   </div>
 *   <div ngTabPanel value="tab3">
 *      <ng-template ngTabContent>Content for Tab 3</ng-template>
 *   </div>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 */
declare class Tabs {
    /** The TabList nested inside of the container. */
    private readonly _tablist;
    /** The TabPanels nested inside of the container. */
    private readonly _unorderedPanels;
    /** The Tab UIPattern of the child Tabs. */
    tabs: Signal<TabPattern[] | undefined>;
    /** The TabPanel UIPattern of the child TabPanels. */
    unorderedTabpanels: Signal<TabPanelPattern[]>;
    register(child: TabList | TabPanel): void;
    deregister(child: TabList | TabPanel): void;
    /** Opens the tab panel with the specified value. */
    open(value: string): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Tabs, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Tabs, "[ngTabs]", ["ngTabs"], {}, {}, never, never, true, never>;
}
/**
 * A TabList container.
 *
 * The `ngTabList` directive controls a list of `ngTab` elements. It manages keyboard
 * navigation, selection, and the overall orientation of the tabs. It should be placed
 * within an `ngTabs` container.
 *
 * ```html
 * <ul ngTabList [(selectedTab)]="mySelectedTab" orientation="horizontal" selectionMode="explicit">
 *   <li ngTab value="first">First Tab</li>
 *   <li ngTab value="second">Second Tab</li>
 * </ul>
 * ```
 *
 * @developerPreview 21.0
 */
declare class TabList implements OnInit, OnDestroy {
    /** A reference to the tab list element. */
    private readonly _elementRef;
    /** The parent Tabs. */
    private readonly _tabs;
    /** The Tabs nested inside of the TabList. */
    private readonly _unorderedTabs;
    /** The internal tab selection state. */
    private readonly _selection;
    /** Text direction. */
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
    /** The Tab UIPatterns of the child Tabs. */
    readonly tabs: Signal<TabPattern[]>;
    /** Whether the tablist is vertically or horizontally oriented. */
    readonly orientation: _angular_core.InputSignal<"vertical" | "horizontal">;
    /** Whether focus should wrap when navigating. */
    readonly wrap: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /**
     * Whether to allow disabled items to receive focus. When `true`, disabled items are
     * focusable but not interactive. When `false`, disabled items are skipped during navigation.
     */
    readonly softDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /**
     * The focus strategy used by the tablist.
     * - `roving`: Focus is moved to the active tab using `tabindex`.
     * - `activedescendant`: Focus remains on the tablist container, and `aria-activedescendant` is used to indicate the active tab.
     */
    readonly focusMode: _angular_core.InputSignal<"roving" | "activedescendant">;
    /**
     * The selection strategy used by the tablist.
     * - `follow`: The focused tab is automatically selected.
     * - `explicit`: Tabs are selected explicitly by the user (e.g., via click or spacebar).
     */
    readonly selectionMode: _angular_core.InputSignal<"follow" | "explicit">;
    /** Whether the tablist is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The currently selected tab. */
    readonly selectedTab: _angular_core.ModelSignal<string | undefined>;
    /** The TabList UIPattern. */
    readonly _pattern: TabListPattern;
    /** Whether the tree has received focus yet. */
    private _hasFocused;
    constructor();
    onFocus(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    register(child: Tab): void;
    deregister(child: Tab): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<TabList, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<TabList, "[ngTabList]", ["ngTabList"], { "orientation": { "alias": "orientation"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "softDisabled": { "alias": "softDisabled"; "required": false; "isSignal": true; }; "focusMode": { "alias": "focusMode"; "required": false; "isSignal": true; }; "selectionMode": { "alias": "selectionMode"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "selectedTab": { "alias": "selectedTab"; "required": false; "isSignal": true; }; }, { "selectedTab": "selectedTabChange"; }, never, never, true, never>;
}
/**
 * A selectable tab in a TabList.
 *
 * The `ngTab` directive represents an individual tab control within an `ngTabList`. It
 * requires a `value` that uniquely identifies it and links it to a corresponding `ngTabPanel`.
 *
 * ```html
 * <li ngTab value="myTabId" [disabled]="isTabDisabled">
 *   My Tab Label
 * </li>
 * ```
 *
 * @developerPreview 21.0
 */
declare class Tab implements HasElement, OnInit, OnDestroy {
    /** A reference to the tab element. */
    private readonly _elementRef;
    /** The parent Tabs. */
    private readonly _tabs;
    /** The parent TabList. */
    private readonly _tabList;
    /** A global unique identifier for the tab. */
    private readonly _id;
    /** The host native element. */
    readonly element: Signal<any>;
    /** The parent TabList UIPattern. */
    readonly tablist: Signal<TabListPattern>;
    /** The TabPanel UIPattern associated with the tab */
    readonly tabpanel: Signal<TabPanelPattern | undefined>;
    /** Whether a tab is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** A local unique identifier for the tab. */
    readonly value: _angular_core.InputSignal<string>;
    /** Whether the tab is active. */
    readonly active: Signal<boolean>;
    /** Whether the tab is expanded. */
    readonly expanded: Signal<boolean>;
    /** Whether the tab is selected. */
    readonly selected: Signal<boolean>;
    /** The Tab UIPattern. */
    readonly _pattern: TabPattern;
    /** Opens this tab panel. */
    open(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Tab, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Tab, "[ngTab]", ["ngTab"], { "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}
/**
 * A TabPanel container for the resources of layered content associated with a tab.
 *
 * The `ngTabPanel` directive holds the content for a specific tab. It is linked to an
 * `ngTab` by a matching `value`. If a tab panel is hidden, the `inert` attribute will be
 * applied to remove it from the accessibility tree. Proper styling is required for visual hiding.
 *
 * ```html
 * <div ngTabPanel value="myTabId">
 *   <ng-template ngTabContent>
 *     <!-- Content for the tab panel -->
 *   </ng-template>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 */
declare class TabPanel implements OnInit, OnDestroy {
    /** The DeferredContentAware host directive. */
    private readonly _deferredContentAware;
    /** The parent Tabs. */
    private readonly _Tabs;
    /** A global unique identifier for the tab. */
    private readonly _id;
    /** The Tab UIPattern associated with the tabpanel */
    readonly tab: Signal<TabPattern | undefined>;
    /** A local unique identifier for the tabpanel. */
    readonly value: _angular_core.InputSignal<string>;
    /** Whether the tab panel is visible. */
    readonly visible: Signal<boolean>;
    /** The TabPanel UIPattern. */
    readonly _pattern: TabPanelPattern;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<TabPanel, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<TabPanel, "[ngTabPanel]", ["ngTabPanel"], { "value": { "alias": "value"; "required": true; "isSignal": true; }; }, {}, never, never, true, [{ directive: typeof i1.DeferredContentAware; inputs: { "preserveContent": "preserveContent"; }; outputs: {}; }]>;
}
/**
 * A TabContent container for the lazy-loaded content.
 *
 * This structural directive should be applied to an `ng-template` within an `ngTabPanel`.
 * It enables lazy loading of the tab's content, meaning the content is only rendered
 * when the tab is activated for the first time.
 *
 * ```html
 * <div ngTabPanel value="myTabId">
 *   <ng-template ngTabContent>
 *     <p>This content will be loaded when 'myTabId' is selected.</p>
 *   </ng-template>
 * </div>
 * ```
 *
 * @developerPreview 21.0
 */
declare class TabContent {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<TabContent, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<TabContent, "ng-template[ngTabContent]", ["ngTabContent"], {}, {}, never, never, true, [{ directive: typeof i1.DeferredContent; inputs: {}; outputs: {}; }]>;
}

export { Tab, TabContent, TabList, TabPanel, Tabs };
