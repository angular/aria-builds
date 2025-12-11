import * as _angular_core from '@angular/core';
import { WritableSignal } from '@angular/core';
import { KeyboardEventManager } from './_keyboard-event-manager-chunk.js';
import { PointerEventManager } from './_pointer-event-manager-chunk.js';
import { ExpansionItem, ListExpansionInputs, ListExpansion } from './_expansion-chunk.js';
import { SignalLike, ListNavigationItem, WritableSignalLike, ListNavigationInputs, ListFocus, ListNavigation } from './_list-navigation-chunk.js';

/** Represents the required inputs for the label control. */
interface LabelControlInputs {
    /** The default `aria-labelledby` ids. */
    defaultLabelledBy: SignalLike<string[]>;
}
/** Represents the optional inputs for the label control. */
interface LabelControlOptionalInputs {
    /** The `aria-label`. */
    label?: SignalLike<string | undefined>;
    /** The user-provided `aria-labelledby` ids. */
    labelledBy?: SignalLike<string[]>;
}
/** Controls label and description of an element. */
declare class LabelControl {
    readonly inputs: LabelControlInputs & LabelControlOptionalInputs;
    /** The `aria-label`. */
    readonly label: _angular_core.Signal<string | undefined>;
    /** The `aria-labelledby` ids. */
    readonly labelledBy: _angular_core.Signal<string[]>;
    constructor(inputs: LabelControlInputs & LabelControlOptionalInputs);
}

/** The required inputs to tabs. */
interface TabInputs extends Omit<ListNavigationItem, 'index'>, Omit<ExpansionItem, 'expandable'> {
    /** The parent tablist that controls the tab. */
    tablist: SignalLike<TabListPattern>;
    /** The remote tabpanel controlled by the tab. */
    tabpanel: SignalLike<TabPanelPattern | undefined>;
    /** The remote tabpanel unique identifier. */
    value: SignalLike<string>;
}
/** A tab in a tablist. */
declare class TabPattern {
    readonly inputs: TabInputs;
    /** A global unique identifier for the tab. */
    readonly id: SignalLike<string>;
    /** The index of the tab. */
    readonly index: _angular_core.Signal<number>;
    /** The remote tabpanel unique identifier. */
    readonly value: SignalLike<string>;
    /** Whether the tab is disabled. */
    readonly disabled: SignalLike<boolean>;
    /** The html element that should receive focus. */
    readonly element: SignalLike<HTMLElement>;
    /** Whether this tab has expandable panel. */
    readonly expandable: SignalLike<boolean>;
    /** Whether the tab panel is expanded. */
    readonly expanded: WritableSignalLike<boolean>;
    /** Whether the tab is active. */
    readonly active: _angular_core.Signal<boolean>;
    /** Whether the tab is selected. */
    readonly selected: _angular_core.Signal<boolean>;
    /** The tab index of the tab. */
    readonly tabIndex: _angular_core.Signal<0 | -1>;
    /** The id of the tabpanel associated with the tab. */
    readonly controls: _angular_core.Signal<string | undefined>;
    constructor(inputs: TabInputs);
    /** Opens the tab. */
    open(): boolean;
}
/** The required inputs for the tabpanel. */
interface TabPanelInputs extends LabelControlOptionalInputs {
    /** A global unique identifier for the tabpanel. */
    id: SignalLike<string>;
    /** The tab that controls this tabpanel. */
    tab: SignalLike<TabPattern | undefined>;
    /** A local unique identifier for the tabpanel. */
    value: SignalLike<string>;
}
/** A tabpanel associated with a tab. */
declare class TabPanelPattern {
    readonly inputs: TabPanelInputs;
    /** A global unique identifier for the tabpanel. */
    readonly id: SignalLike<string>;
    /** A local unique identifier for the tabpanel. */
    readonly value: SignalLike<string>;
    /** Controls label for this tabpanel. */
    readonly labelManager: LabelControl;
    /** Whether the tabpanel is hidden. */
    readonly hidden: _angular_core.Signal<boolean>;
    /** The tab index of this tabpanel. */
    readonly tabIndex: _angular_core.Signal<-1 | 0>;
    /** The aria-labelledby value for this tabpanel. */
    readonly labelledBy: _angular_core.Signal<string | undefined>;
    constructor(inputs: TabPanelInputs);
}
/** The required inputs for the tablist. */
interface TabListInputs extends Omit<ListNavigationInputs<TabPattern>, 'multi'>, Omit<ListExpansionInputs, 'multiExpandable' | 'items'> {
    /** The selection strategy used by the tablist. */
    selectionMode: SignalLike<'follow' | 'explicit'>;
}
/** Controls the state of a tablist. */
declare class TabListPattern {
    readonly inputs: TabListInputs;
    /** The list focus behavior for the tablist. */
    readonly focusBehavior: ListFocus<TabPattern>;
    /** The list navigation behavior for the tablist. */
    readonly navigationBehavior: ListNavigation<TabPattern>;
    /** Controls expansion for the tablist. */
    readonly expansionBehavior: ListExpansion;
    /** The currently active tab. */
    readonly activeTab: SignalLike<TabPattern | undefined>;
    /** The currently selected tab. */
    readonly selectedTab: WritableSignal<TabPattern | undefined>;
    /** Whether the tablist is vertically or horizontally oriented. */
    readonly orientation: SignalLike<'vertical' | 'horizontal'>;
    /** Whether the tablist is disabled. */
    readonly disabled: SignalLike<boolean>;
    /** The tab index of the tablist. */
    readonly tabIndex: _angular_core.Signal<0 | -1>;
    /** The id of the current active tab. */
    readonly activeDescendant: _angular_core.Signal<string | undefined>;
    /** Whether selection should follow focus. */
    readonly followFocus: _angular_core.Signal<boolean>;
    /** The key used to navigate to the previous tab in the tablist. */
    readonly prevKey: _angular_core.Signal<"ArrowUp" | "ArrowRight" | "ArrowLeft">;
    /** The key used to navigate to the next item in the list. */
    readonly nextKey: _angular_core.Signal<"ArrowRight" | "ArrowLeft" | "ArrowDown">;
    /** The keydown event manager for the tablist. */
    readonly keydown: _angular_core.Signal<KeyboardEventManager<KeyboardEvent>>;
    /** The pointerdown event manager for the tablist. */
    readonly pointerdown: _angular_core.Signal<PointerEventManager<PointerEvent>>;
    constructor(inputs: TabListInputs);
    /**
     * Sets the tablist to its default initial state.
     *
     * Sets the active index of the tablist to the first focusable selected
     * tab if one exists. Otherwise, sets focus to the first focusable tab.
     *
     * This method should be called once the tablist and its tabs are properly initialized.
     */
    setDefaultState(): void;
    /** Handles keydown events for the tablist. */
    onKeydown(event: KeyboardEvent): void;
    /** The pointerdown event manager for the tablist. */
    onPointerdown(event: PointerEvent): void;
    /** Opens the tab by given value. */
    open(value: string): boolean;
    /** Opens the given tab or the current active tab. */
    open(tab?: TabPattern): boolean;
    /** Executes a navigation operation and expand the active tab if needed. */
    private _navigate;
    /** Returns the tab item associated with the given pointer event. */
    private _getItem;
}

export { TabListPattern, TabPanelPattern, TabPattern };
export type { TabInputs, TabListInputs, TabPanelInputs };
