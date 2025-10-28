import * as i1 from '@angular/aria/deferred-content';
import { DeferredContentAware, DeferredContent } from '@angular/aria/deferred-content';
import { _IdGenerator } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import * as i0 from '@angular/core';
import { signal, computed, Directive, inject, ElementRef, linkedSignal, input, booleanAttribute, model, afterRenderEffect } from '@angular/core';
import { TabListPattern, TabPattern, TabPanelPattern } from '@angular/aria/private';

/**
 * Sort directives by their document order.
 */
function sortDirectives(a, b) {
    return (a.element().compareDocumentPosition(b.element()) & Node.DOCUMENT_POSITION_PRECEDING) > 0
        ? 1
        : -1;
}
/**
 * A Tabs container.
 *
 * Represents a set of layered sections of content. The Tabs is a container meant to be used with
 * TabList, Tab, and TabPanel as follows:
 *
 * ```html
 * <div ngTabs>
 *   <ul ngTabList>
 *     <li ngTab value="tab1">Tab 1</li>
 *     <li ngTab value="tab2">Tab 2</li>
 *     <li ngTab value="tab3">Tab 3</li>
 *   </ul>
 *
 *   <div ngTabPanel value="tab1">
 *      <ng-template ngTabContent>Tab content 1</ng-template>
 *   </div>
 *   <div ngTabPanel value="tab2">
 *      <ng-template ngTabContent>Tab content 2</ng-template>
 *   </div>
 *   <div ngTabPanel value="tab3">
 *      <ng-template ngTabContent>Tab content 3</ng-template>
 *   </div>
 * ```
 */
class Tabs {
    /** The TabList nested inside of the container. */
    _tablist = signal(undefined, ...(ngDevMode ? [{ debugName: "_tablist" }] : []));
    /** The TabPanels nested inside of the container. */
    _unorderedPanels = signal(new Set(), ...(ngDevMode ? [{ debugName: "_unorderedPanels" }] : []));
    /** The Tab UIPattern of the child Tabs. */
    tabs = computed(() => this._tablist()?.tabs(), ...(ngDevMode ? [{ debugName: "tabs" }] : []));
    /** The TabPanel UIPattern of the child TabPanels. */
    unorderedTabpanels = computed(() => [...this._unorderedPanels()].map(tabpanel => tabpanel._pattern), ...(ngDevMode ? [{ debugName: "unorderedTabpanels" }] : []));
    register(child) {
        if (child instanceof TabList) {
            this._tablist.set(child);
        }
        if (child instanceof TabPanel) {
            this._unorderedPanels().add(child);
            this._unorderedPanels.set(new Set(this._unorderedPanels()));
        }
    }
    deregister(child) {
        if (child instanceof TabList) {
            this._tablist.set(undefined);
        }
        if (child instanceof TabPanel) {
            this._unorderedPanels().delete(child);
            this._unorderedPanels.set(new Set(this._unorderedPanels()));
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Tabs, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: Tabs, isStandalone: true, selector: "[ngTabs]", host: { classAttribute: "ng-tabs" }, exportAs: ["ngTabs"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Tabs, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngTabs]',
                    exportAs: 'ngTabs',
                    host: {
                        'class': 'ng-tabs',
                    },
                }]
        }] });
/**
 * A TabList container.
 *
 * Controls a list of Tab(s).
 */
class TabList {
    /** A reference to the tab list element. */
    _elementRef = inject(ElementRef);
    /** The parent Tabs. */
    _tabs = inject(Tabs);
    /** The Tabs nested inside of the TabList. */
    _unorderedTabs = signal(new Set(), ...(ngDevMode ? [{ debugName: "_unorderedTabs" }] : []));
    /** The internal tab selection state. */
    _selection = linkedSignal(() => this.selectedTab() ? [this.selectedTab()] : []);
    /** Text direction. */
    textDirection = inject(Directionality).valueSignal;
    /** The Tab UIPatterns of the child Tabs. */
    tabs = computed(() => [...this._unorderedTabs()].sort(sortDirectives).map(tab => tab._pattern), ...(ngDevMode ? [{ debugName: "tabs" }] : []));
    /** Whether the tablist is vertically or horizontally oriented. */
    orientation = input('horizontal', ...(ngDevMode ? [{ debugName: "orientation" }] : []));
    /** Whether focus should wrap when navigating. */
    wrap = input(true, ...(ngDevMode ? [{ debugName: "wrap", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether disabled items in the list should be skipped when navigating. */
    skipDisabled = input(true, ...(ngDevMode ? [{ debugName: "skipDisabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The focus strategy used by the tablist. */
    focusMode = input('roving', ...(ngDevMode ? [{ debugName: "focusMode" }] : []));
    /** The selection strategy used by the tablist. */
    selectionMode = input('follow', ...(ngDevMode ? [{ debugName: "selectionMode" }] : []));
    /** Whether the tablist is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The current selected tab. */
    selectedTab = model(...(ngDevMode ? [undefined, { debugName: "selectedTab" }] : []));
    /** The TabList UIPattern. */
    _pattern = new TabListPattern({
        ...this,
        items: this.tabs,
        value: this._selection,
        activeItem: signal(undefined),
        element: () => this._elementRef.nativeElement,
    });
    /** Whether the tree has received focus yet. */
    _hasFocused = signal(false, ...(ngDevMode ? [{ debugName: "_hasFocused" }] : []));
    constructor() {
        afterRenderEffect(() => this.selectedTab.set(this._selection()[0]));
        afterRenderEffect(() => {
            if (!this._hasFocused()) {
                this._pattern.setDefaultState();
            }
        });
    }
    onFocus() {
        this._hasFocused.set(true);
    }
    ngOnInit() {
        this._tabs.register(this);
    }
    ngOnDestroy() {
        this._tabs.deregister(this);
    }
    register(child) {
        this._unorderedTabs().add(child);
        this._unorderedTabs.set(new Set(this._unorderedTabs()));
    }
    deregister(child) {
        this._unorderedTabs().delete(child);
        this._unorderedTabs.set(new Set(this._unorderedTabs()));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TabList, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: TabList, isStandalone: true, selector: "[ngTabList]", inputs: { orientation: { classPropertyName: "orientation", publicName: "orientation", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null }, skipDisabled: { classPropertyName: "skipDisabled", publicName: "skipDisabled", isSignal: true, isRequired: false, transformFunction: null }, focusMode: { classPropertyName: "focusMode", publicName: "focusMode", isSignal: true, isRequired: false, transformFunction: null }, selectionMode: { classPropertyName: "selectionMode", publicName: "selectionMode", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, selectedTab: { classPropertyName: "selectedTab", publicName: "selectedTab", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { selectedTab: "selectedTabChange" }, host: { attributes: { "role": "tablist" }, listeners: { "keydown": "_pattern.onKeydown($event)", "pointerdown": "_pattern.onPointerdown($event)", "focusin": "onFocus()" }, properties: { "attr.tabindex": "_pattern.tabindex()", "attr.aria-disabled": "_pattern.disabled()", "attr.aria-orientation": "_pattern.orientation()", "attr.aria-activedescendant": "_pattern.activedescendant()" }, classAttribute: "ng-tablist" }, exportAs: ["ngTabList"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TabList, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngTabList]',
                    exportAs: 'ngTabList',
                    host: {
                        'role': 'tablist',
                        'class': 'ng-tablist',
                        '[attr.tabindex]': '_pattern.tabindex()',
                        '[attr.aria-disabled]': '_pattern.disabled()',
                        '[attr.aria-orientation]': '_pattern.orientation()',
                        '[attr.aria-activedescendant]': '_pattern.activedescendant()',
                        '(keydown)': '_pattern.onKeydown($event)',
                        '(pointerdown)': '_pattern.onPointerdown($event)',
                        '(focusin)': 'onFocus()',
                    },
                }]
        }], ctorParameters: () => [] });
/** A selectable tab in a TabList. */
class Tab {
    /** A reference to the tab element. */
    _elementRef = inject(ElementRef);
    /** The parent Tabs. */
    _tabs = inject(Tabs);
    /** The parent TabList. */
    _tabList = inject(TabList);
    /** A global unique identifier for the tab. */
    _id = inject(_IdGenerator).getId('ng-tab-');
    /** The host native element. */
    element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{ debugName: "element" }] : []));
    /** The parent TabList UIPattern. */
    tablist = computed(() => this._tabList._pattern, ...(ngDevMode ? [{ debugName: "tablist" }] : []));
    /** The TabPanel UIPattern associated with the tab */
    tabpanel = computed(() => this._tabs.unorderedTabpanels().find(tabpanel => tabpanel.value() === this.value()), ...(ngDevMode ? [{ debugName: "tabpanel" }] : []));
    /** Whether a tab is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** A local unique identifier for the tab. */
    value = input.required(...(ngDevMode ? [{ debugName: "value" }] : []));
    /** The Tab UIPattern. */
    _pattern = new TabPattern({
        ...this,
        id: () => this._id,
        tablist: this.tablist,
        tabpanel: this.tabpanel,
        value: this.value,
    });
    ngOnInit() {
        this._tabList.register(this);
    }
    ngOnDestroy() {
        this._tabList.deregister(this);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Tab, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: Tab, isStandalone: true, selector: "[ngTab]", inputs: { disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: true, transformFunction: null } }, host: { attributes: { "role": "tab" }, properties: { "attr.data-active": "_pattern.active()", "attr.id": "_pattern.id()", "attr.tabindex": "_pattern.tabindex()", "attr.aria-selected": "_pattern.selected()", "attr.aria-disabled": "_pattern.disabled()", "attr.aria-controls": "_pattern.controls()" }, classAttribute: "ng-tab" }, exportAs: ["ngTab"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Tab, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngTab]',
                    exportAs: 'ngTab',
                    host: {
                        'role': 'tab',
                        'class': 'ng-tab',
                        '[attr.data-active]': '_pattern.active()',
                        '[attr.id]': '_pattern.id()',
                        '[attr.tabindex]': '_pattern.tabindex()',
                        '[attr.aria-selected]': '_pattern.selected()',
                        '[attr.aria-disabled]': '_pattern.disabled()',
                        '[attr.aria-controls]': '_pattern.controls()',
                    },
                }]
        }] });
/**
 * A TabPanel container for the resources of layered content associated with a tab.
 *
 * If a tabpanel is hidden due to its corresponding tab is not activated, the `inert` attribute
 * will be applied to the tabpanel element to remove it from the accessibility tree and stop
 * all the keyboard and pointer interactions. Note that this does not visually hide the tabpenl
 * and a proper styling is required.
 */
class TabPanel {
    /** The DeferredContentAware host directive. */
    _deferredContentAware = inject(DeferredContentAware);
    /** The parent Tabs. */
    _Tabs = inject(Tabs);
    /** A global unique identifier for the tab. */
    _id = inject(_IdGenerator).getId('ng-tabpanel-', true);
    /** The Tab UIPattern associated with the tabpanel */
    tab = computed(() => this._Tabs.tabs()?.find(tab => tab.value() === this.value()), ...(ngDevMode ? [{ debugName: "tab" }] : []));
    /** A local unique identifier for the tabpanel. */
    value = input.required(...(ngDevMode ? [{ debugName: "value" }] : []));
    /** The TabPanel UIPattern. */
    _pattern = new TabPanelPattern({
        ...this,
        id: () => this._id,
        tab: this.tab,
    });
    constructor() {
        afterRenderEffect(() => this._deferredContentAware.contentVisible.set(!this._pattern.hidden()));
    }
    ngOnInit() {
        this._Tabs.register(this);
    }
    ngOnDestroy() {
        this._Tabs.deregister(this);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TabPanel, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: TabPanel, isStandalone: true, selector: "[ngTabPanel]", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: true, transformFunction: null } }, host: { attributes: { "role": "tabpanel" }, properties: { "attr.id": "_pattern.id()", "attr.tabindex": "_pattern.tabindex()", "attr.inert": "_pattern.hidden() ? true : null", "attr.aria-labelledby": "_pattern.labelledBy()" }, classAttribute: "ng-tabpanel" }, exportAs: ["ngTabPanel"], hostDirectives: [{ directive: i1.DeferredContentAware, inputs: ["preserveContent", "preserveContent"] }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TabPanel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngTabPanel]',
                    exportAs: 'ngTabPanel',
                    host: {
                        'role': 'tabpanel',
                        'class': 'ng-tabpanel',
                        '[attr.id]': '_pattern.id()',
                        '[attr.tabindex]': '_pattern.tabindex()',
                        '[attr.inert]': '_pattern.hidden() ? true : null',
                        '[attr.aria-labelledby]': '_pattern.labelledBy()',
                    },
                    hostDirectives: [
                        {
                            directive: DeferredContentAware,
                            inputs: ['preserveContent'],
                        },
                    ],
                }]
        }], ctorParameters: () => [] });
/**
 * A TabContent container for the lazy-loaded content.
 */
class TabContent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TabContent, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: TabContent, isStandalone: true, selector: "ng-template[ngTabContent]", exportAs: ["ngTabContent"], hostDirectives: [{ directive: i1.DeferredContent }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TabContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[ngTabContent]',
                    exportAs: 'ngTabContent',
                    hostDirectives: [DeferredContent],
                }]
        }] });

export { Tab, TabContent, TabList, TabPanel, Tabs };
//# sourceMappingURL=tabs.mjs.map
