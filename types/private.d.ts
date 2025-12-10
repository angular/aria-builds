import { ComboboxPattern, ComboboxListboxControls, ComboboxTreeControls } from './_combobox-chunk.d2.ts';
export { ComboboxDialogPattern, ComboboxInputs } from './_combobox-chunk.d2.ts';
import { ListboxInputs, OptionPattern, ListboxPattern } from './_listbox-chunk.js';
export { OptionInputs } from './_listbox-chunk.js';
import * as _angular_core from '@angular/core';
import { Signal, WritableSignal, OnDestroy } from '@angular/core';
import { SignalLike, KeyboardEventManager, WritableSignalLike, ListNavigationItem, ListNavigationInputs, ListFocus, ListNavigation, PointerEventManager, ListFocusInputs, ListFocusItem } from './_list-navigation-chunk.js';
export { convertGetterSetterToWritableSignalLike } from './_list-navigation-chunk.js';
import { ListInputs, ListItem, List } from './_list-chunk.js';
export { GridCellInputs, GridCellPattern, GridCellWidgetInputs, GridCellWidgetPattern, GridInputs, GridPattern, GridRowInputs, GridRowPattern } from './_grid-chunk.js';

type ComboboxListboxInputs<V> = ListboxInputs<V> & {
    /** The combobox controlling the listbox. */
    combobox: SignalLike<ComboboxPattern<OptionPattern<V>, V> | undefined>;
};
declare class ComboboxListboxPattern<V> extends ListboxPattern<V> implements ComboboxListboxControls<OptionPattern<V>, V> {
    readonly inputs: ComboboxListboxInputs<V>;
    /** A unique identifier for the popup. */
    id: _angular_core.Signal<string>;
    /** The ARIA role for the listbox. */
    role: _angular_core.Signal<"listbox">;
    /** The id of the active (focused) item in the listbox. */
    activeId: _angular_core.Signal<string | undefined>;
    /** The list of options in the listbox. */
    items: SignalLike<OptionPattern<V>[]>;
    /** The tab index for the listbox. Always -1 because the combobox handles focus. */
    tabIndex: SignalLike<-1 | 0>;
    /** Whether multiple items in the list can be selected at once. */
    multi: _angular_core.Signal<boolean>;
    constructor(inputs: ComboboxListboxInputs<V>);
    /** Noop. The combobox handles keydown events. */
    onKeydown(_: KeyboardEvent): void;
    /** Noop. The combobox handles pointerdown events. */
    onPointerdown(_: PointerEvent): void;
    /** Noop. The combobox controls the open state. */
    setDefaultState(): void;
    /** Navigates to the specified item in the listbox. */
    focus: (item: OptionPattern<V>, opts?: {
        focusElement?: boolean;
    }) => void;
    /** Navigates to the previous focusable item in the listbox. */
    getActiveItem: () => OptionPattern<V> | undefined;
    /** Navigates to the next focusable item in the listbox. */
    next: () => void;
    /** Navigates to the previous focusable item in the listbox. */
    prev: () => void;
    /** Navigates to the last focusable item in the listbox. */
    last: () => void;
    /** Navigates to the first focusable item in the listbox. */
    first: () => void;
    /** Unfocuses the currently focused item in the listbox. */
    unfocus: () => void;
    /** Selects the specified item in the listbox. */
    select: (item?: OptionPattern<V>) => void;
    /** Toggles the selection state of the given item in the listbox. */
    toggle: (item?: OptionPattern<V>) => void;
    /** Clears the selection in the listbox. */
    clearSelection: () => void;
    /** Retrieves the OptionPattern associated with a pointer event. */
    getItem: (e: PointerEvent) => OptionPattern<V> | undefined;
    /** Retrieves the currently selected items in the listbox. */
    getSelectedItems: () => OptionPattern<V>[];
    /** Sets the value of the combobox listbox. */
    setValue: (value: V | undefined) => void;
}

/** The inputs for the MenuBarPattern class. */
interface MenuBarInputs<V> extends ListInputs<MenuItemPattern<V>, V> {
    /** The menu items contained in the menu. */
    items: SignalLike<MenuItemPattern<V>[]>;
    /** Callback function triggered when a menu item is selected. */
    onSelect?: (value: V) => void;
    /** The text direction of the menu bar. */
    textDirection: SignalLike<'ltr' | 'rtl'>;
}
/** The inputs for the MenuPattern class. */
interface MenuInputs<V> extends Omit<ListInputs<MenuItemPattern<V>, V>, 'values'> {
    /** The unique ID of the menu. */
    id: SignalLike<string>;
    /** The menu items contained in the menu. */
    items: SignalLike<MenuItemPattern<V>[]>;
    /** A reference to the parent menu or menu trigger. */
    parent: SignalLike<MenuTriggerPattern<V> | MenuItemPattern<V> | undefined>;
    /** Callback function triggered when a menu item is selected. */
    onSelect?: (value: V) => void;
    /** The text direction of the menu bar. */
    textDirection: SignalLike<'ltr' | 'rtl'>;
    /** The delay in milliseconds before expanding sub-menus on hover. */
    expansionDelay: SignalLike<number>;
}
/** The inputs for the MenuTriggerPattern class. */
interface MenuTriggerInputs<V> {
    /** A reference to the menu trigger element. */
    element: SignalLike<HTMLElement | undefined>;
    /** A reference to the menu associated with the trigger. */
    menu: SignalLike<MenuPattern<V> | undefined>;
    /** The text direction of the menu bar. */
    textDirection: SignalLike<'ltr' | 'rtl'>;
    /** Whether the menu trigger is disabled. */
    disabled: SignalLike<boolean>;
}
/** The inputs for the MenuItemPattern class. */
interface MenuItemInputs<V> extends Omit<ListItem<V>, 'index' | 'selectable'> {
    /** A reference to the parent menu or menu trigger. */
    parent: SignalLike<MenuPattern<V> | MenuBarPattern<V> | undefined>;
    /** A reference to the submenu associated with the menu item. */
    submenu: SignalLike<MenuPattern<V> | undefined>;
}
/** The menu ui pattern class. */
declare class MenuPattern<V> {
    readonly inputs: MenuInputs<V>;
    /** The unique ID of the menu. */
    id: SignalLike<string>;
    /** The role of the menu. */
    role: () => string;
    /** Whether the menu is disabled. */
    disabled: () => boolean;
    /** Whether the menu is visible. */
    visible: Signal<boolean>;
    /** Controls list behavior for the menu items. */
    listBehavior: List<MenuItemPattern<V>, V>;
    /** Whether the menu or any of its child elements are currently focused. */
    isFocused: _angular_core.WritableSignal<boolean>;
    /** Whether the menu has received focus. */
    hasBeenFocused: _angular_core.WritableSignal<boolean>;
    /** Whether the menu trigger has been hovered. */
    hasBeenHovered: _angular_core.WritableSignal<boolean>;
    /** Timeout used to open sub-menus on hover. */
    _openTimeout: any;
    /** Timeout used to close sub-menus on hover out. */
    _closeTimeout: any;
    /** The tab index of the menu. */
    tabIndex: () => 0 | -1;
    /** Whether the menu should be focused on mouse over. */
    shouldFocus: Signal<boolean>;
    /** The key used to expand sub-menus. */
    private _expandKey;
    /** The key used to collapse sub-menus. */
    private _collapseKey;
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey: Signal<"" | " ">;
    /** The regexp used to decide if a key should trigger typeahead. */
    typeaheadRegexp: RegExp;
    /** The root of the menu. */
    root: Signal<MenuTriggerPattern<V> | MenuBarPattern<V> | MenuPattern<V> | undefined>;
    /** Handles keyboard events for the menu. */
    keydownManager: Signal<KeyboardEventManager<KeyboardEvent>>;
    constructor(inputs: MenuInputs<V>);
    /** Sets the default state for the menu. */
    setDefaultState(): void;
    /** Handles keyboard events for the menu. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles mouseover events for the menu. */
    onMouseOver(event: MouseEvent): void;
    /** Closes the specified menu item after a delay. */
    private _closeItem;
    /** Opens the specified menu item after a delay. */
    private _openItem;
    /** Handles mouseout events for the menu. */
    onMouseOut(event: MouseEvent): void;
    /** Handles click events for the menu. */
    onClick(event: MouseEvent): void;
    /** Handles focusin events for the menu. */
    onFocusIn(): void;
    /** Handles the focusout event for the menu. */
    onFocusOut(event: FocusEvent): void;
    /** Focuses the previous menu item. */
    prev(): void;
    /** Focuses the next menu item. */
    next(): void;
    /** Focuses the first menu item. */
    first(): void;
    /** Focuses the last menu item. */
    last(): void;
    /** Triggers the active menu item. */
    trigger(): void;
    /** Submits the menu. */
    submit(item?: MenuItemPattern<V> | undefined): void;
    /** Collapses the current menu or focuses the previous item in the menubar. */
    collapse(): void;
    /** Expands the current menu or focuses the next item in the menubar. */
    expand(): void;
    /** Closes the menu. */
    close(): void;
    /** Closes the menu and all parent menus. */
    closeAll(): void;
    /** Clears any open or close timeouts for sub-menus. */
    _clearTimeouts(): void;
    /** Clears the open timeout. */
    _clearOpenTimeout(): void;
    /** Clears the close timeout. */
    _clearCloseTimeout(): void;
}
/** The menubar ui pattern class. */
declare class MenuBarPattern<V> {
    readonly inputs: MenuBarInputs<V>;
    /** Controls list behavior for the menu items. */
    listBehavior: List<MenuItemPattern<V>, V>;
    /** The tab index of the menu. */
    tabIndex: () => 0 | -1;
    /** The key used to navigate to the next item. */
    private _nextKey;
    /** The key used to navigate to the previous item. */
    private _previousKey;
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey: Signal<"" | " ">;
    /** The regexp used to decide if a key should trigger typeahead. */
    typeaheadRegexp: RegExp;
    /** Whether the menubar or any of its children are currently focused. */
    isFocused: _angular_core.WritableSignal<boolean>;
    /** Whether the menubar has been focused. */
    hasBeenFocused: _angular_core.WritableSignal<boolean>;
    /** Whether the menubar is disabled. */
    disabled: () => boolean;
    /** Handles keyboard events for the menu. */
    keydownManager: Signal<KeyboardEventManager<KeyboardEvent>>;
    constructor(inputs: MenuBarInputs<V>);
    /** Sets the default state for the menubar. */
    setDefaultState(): void;
    /** Handles keyboard events for the menu. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles click events for the menu bar. */
    onClick(event: MouseEvent): void;
    /** Handles mouseover events for the menu bar. */
    onMouseOver(event: MouseEvent): void;
    /** Handles focusin events for the menu bar. */
    onFocusIn(): void;
    /** Handles focusout events for the menu bar. */
    onFocusOut(event: FocusEvent): void;
    /** Goes to and optionally focuses the specified menu item. */
    goto(item: MenuItemPattern<V>, opts?: {
        focusElement?: boolean;
    }): void;
    /** Focuses the next menu item. */
    next(): void;
    /** Focuses the previous menu item. */
    prev(): void;
    /** Closes the menubar and refocuses the root menu bar item. */
    close(): void;
}
/** The menu trigger ui pattern class. */
declare class MenuTriggerPattern<V> {
    readonly inputs: MenuTriggerInputs<V>;
    /** Whether the menu is expanded. */
    expanded: _angular_core.WritableSignal<boolean>;
    /** Whether the menu trigger has received focus. */
    hasBeenFocused: _angular_core.WritableSignal<boolean>;
    /** The role of the menu trigger. */
    role: () => string;
    /** Whether the menu trigger has a popup. */
    hasPopup: () => boolean;
    /** The menu associated with the trigger. */
    menu: SignalLike<MenuPattern<V> | undefined>;
    /** The tab index of the menu trigger. */
    tabIndex: Signal<-1 | 0>;
    /** Whether the menu trigger is disabled. */
    disabled: () => boolean;
    /** Handles keyboard events for the menu trigger. */
    keydownManager: Signal<KeyboardEventManager<KeyboardEvent>>;
    constructor(inputs: MenuTriggerInputs<V>);
    /** Handles keyboard events for the menu trigger. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles click events for the menu trigger. */
    onClick(): void;
    /** Handles focusin events for the menu trigger. */
    onFocusIn(): void;
    /** Handles focusout events for the menu trigger. */
    onFocusOut(event: FocusEvent): void;
    /** Opens the menu. */
    open(opts?: {
        first?: boolean;
        last?: boolean;
    }): void;
    /** Closes the menu. */
    close(opts?: {
        refocus?: boolean;
    }): void;
}
/** The menu item ui pattern class. */
declare class MenuItemPattern<V> implements ListItem<V> {
    readonly inputs: MenuItemInputs<V>;
    /** The value of the menu item. */
    value: SignalLike<V>;
    /** The unique ID of the menu item. */
    id: SignalLike<string>;
    /** Whether the menu item is disabled. */
    disabled: () => boolean;
    /** The search term for the menu item. */
    searchTerm: SignalLike<string>;
    /** The element of the menu item. */
    element: SignalLike<HTMLElement | undefined>;
    /** Whether the menu item is active. */
    active: Signal<boolean>;
    /** Whether the menu item has received focus. */
    hasBeenFocused: _angular_core.WritableSignal<boolean>;
    /** The tab index of the menu item. */
    tabIndex: Signal<0 | -1>;
    /** The position of the menu item in the menu. */
    index: Signal<number>;
    /** Whether the menu item is expanded. */
    expanded: Signal<boolean | null>;
    /** Whether the menu item is expanded. */
    _expanded: _angular_core.WritableSignal<boolean>;
    /** The ID of the menu that the menu item controls. */
    controls: _angular_core.WritableSignal<string | undefined>;
    /** The role of the menu item. */
    role: () => string;
    /** Whether the menu item has a popup. */
    hasPopup: Signal<boolean>;
    /** The submenu associated with the menu item. */
    submenu: SignalLike<MenuPattern<V> | undefined>;
    /** Whether the menu item is selectable. */
    selectable: SignalLike<boolean>;
    constructor(inputs: MenuItemInputs<V>);
    /** Opens the submenu. */
    open(opts?: {
        first?: boolean;
        last?: boolean;
    }): void;
    /** Closes the submenu. */
    close(opts?: {
        refocus?: boolean;
    }): void;
    /** Handles focusin events for the menu item. */
    onFocusIn(): void;
}

/** Represents an item that can be expanded or collapsed. */
interface ExpansionItem {
    /** Whether the item is expandable. */
    expandable: SignalLike<boolean>;
    /** Whether the item is expanded. */
    expanded: WritableSignalLike<boolean>;
    /** Whether the expansion is disabled. */
    disabled: SignalLike<boolean>;
}
/** Represents the required inputs for an expansion behavior. */
interface ListExpansionInputs {
    /** Whether multiple items can be expanded at once. */
    multiExpandable: SignalLike<boolean>;
    /** An array of expansion items. */
    items: SignalLike<ExpansionItem[]>;
    /** Whether all expansions are disabled. */
    disabled: SignalLike<boolean>;
}
/** Manages the expansion state of a list of items. */
declare class ListExpansion {
    readonly inputs: ListExpansionInputs;
    constructor(inputs: ListExpansionInputs);
    /** Opens the specified item. */
    open(item: ExpansionItem): boolean;
    /** Closes the specified item. */
    close(item: ExpansionItem): boolean;
    /** Toggles the expansion state of the specified item. */
    toggle(item: ExpansionItem): boolean;
    /** Opens all focusable items in the list. */
    openAll(): void;
    /** Closes all focusable items in the list. */
    closeAll(): void;
    /** Checks whether the specified item is expandable / collapsible. */
    isExpandable(item: ExpansionItem): boolean;
}

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

/** Represents the required inputs for a toolbar widget group. */
interface ToolbarWidgetGroupInputs<T extends ListItem<V>, V> {
    /** A reference to the parent toolbar. */
    toolbar: SignalLike<ToolbarPattern<V> | undefined>;
    /** Whether the widget group is disabled. */
    disabled: SignalLike<boolean>;
    /** The list of items within the widget group. */
    items: SignalLike<T[]>;
    /** Whether the group allows multiple widgets to be selected. */
    multi: SignalLike<boolean>;
}
/** A group of widgets within a toolbar that provides nested navigation. */
declare class ToolbarWidgetGroupPattern<T extends ListItem<V>, V> {
    readonly inputs: ToolbarWidgetGroupInputs<T, V>;
    /** Whether the widget is disabled. */
    readonly disabled: () => boolean;
    /** A reference to the parent toolbar. */
    readonly toolbar: () => ToolbarPattern<V> | undefined;
    /** Whether the group allows multiple widgets to be selected. */
    readonly multi: () => boolean;
    readonly searchTerm: () => string;
    readonly value: () => V;
    readonly selectable: () => boolean;
    readonly element: () => undefined;
    constructor(inputs: ToolbarWidgetGroupInputs<T, V>);
}

/** Represents the required inputs for a toolbar widget in a toolbar. */
interface ToolbarWidgetInputs<V> extends Omit<ListItem<V>, 'searchTerm' | 'index' | 'selectable'> {
    /** A reference to the parent toolbar. */
    toolbar: SignalLike<ToolbarPattern<V>>;
    /** A reference to the parent widget group. */
    group: SignalLike<ToolbarWidgetGroupPattern<ToolbarWidgetPattern<V>, V> | undefined>;
}
declare class ToolbarWidgetPattern<V> implements ListItem<V> {
    readonly inputs: ToolbarWidgetInputs<V>;
    /** A unique identifier for the widget. */
    readonly id: () => string;
    /** The html element that should receive focus. */
    readonly element: () => HTMLElement | undefined;
    /** Whether the widget is disabled. */
    readonly disabled: () => boolean;
    /** A reference to the parent toolbar. */
    readonly group: () => ToolbarWidgetGroupPattern<ToolbarWidgetPattern<V>, V> | undefined;
    /** A reference to the toolbar containing the widget. */
    readonly toolbar: () => ToolbarPattern<V>;
    /** The tabindex of the widget. */
    readonly tabIndex: _angular_core.Signal<0 | -1>;
    /** The text used by the typeahead search. */
    readonly searchTerm: () => string;
    /** The value associated with the widget. */
    readonly value: () => V;
    /** Whether the widget is selectable. */
    readonly selectable: () => boolean;
    /** The position of the widget within the toolbar. */
    readonly index: _angular_core.Signal<number>;
    /** Whether the widget is selected (only relevant in a selection group). */
    readonly selected: _angular_core.Signal<boolean>;
    /** Whether the widget is currently the active one (focused). */
    readonly active: SignalLike<boolean>;
    constructor(inputs: ToolbarWidgetInputs<V>);
}

/** Represents the required inputs for a toolbar. */
type ToolbarInputs<V> = Omit<ListInputs<ToolbarWidgetPattern<V>, V>, 'multi' | 'typeaheadDelay' | 'selectionMode' | 'focusMode'> & {
    /** A function that returns the toolbar item associated with a given element. */
    getItem: (e: Element) => ToolbarWidgetPattern<V> | undefined;
};
/** Controls the state of a toolbar. */
declare class ToolbarPattern<V> {
    readonly inputs: ToolbarInputs<V>;
    /** The list behavior for the toolbar. */
    readonly listBehavior: List<ToolbarWidgetPattern<V>, V>;
    /** Whether the tablist is vertically or horizontally oriented. */
    readonly orientation: SignalLike<'vertical' | 'horizontal'>;
    /** Whether disabled items in the group should be focusable. */
    readonly softDisabled: SignalLike<boolean>;
    /** Whether the toolbar is disabled. */
    readonly disabled: _angular_core.Signal<boolean>;
    /** The tab index of the toolbar (if using activedescendant). */
    readonly tabIndex: _angular_core.Signal<0 | -1>;
    /** The id of the current active widget (if using activedescendant). */
    readonly activeDescendant: _angular_core.Signal<string | undefined>;
    /** The currently active item in the toolbar. */
    readonly activeItem: () => ToolbarWidgetPattern<V> | undefined;
    /** The key used to navigate to the previous widget. */
    private readonly _prevKey;
    /** The key used to navigate to the next widget. */
    private readonly _nextKey;
    /** The alternate key used to navigate to the previous widget. */
    private readonly _altPrevKey;
    /** The alternate key used to navigate to the next widget. */
    private readonly _altNextKey;
    /** The keydown event manager for the toolbar. */
    private readonly _keydown;
    /** Navigates to the next widget in a widget group. */
    private _groupNext;
    /** Navigates to the previous widget in a widget group. */
    private _groupPrev;
    /** Navigates to the widget targeted by a pointer event. */
    private _goto;
    select(): void;
    constructor(inputs: ToolbarInputs<V>);
    /** Handles keydown events for the toolbar. */
    onKeydown(event: KeyboardEvent): void;
    onPointerdown(event: PointerEvent): void;
    /** Handles click events for the toolbar. */
    onClick(event: MouseEvent): void;
    /**
     * Sets the toolbar to its default initial state.
     *
     * Sets the active index to the selected widget if one exists and is focusable.
     * Otherwise, sets the active index to the first focusable widget.
     */
    setDefaultState(): void;
    /** Validates the state of the toolbar and returns a list of accessibility violations. */
    validate(): string[];
}

/** Inputs of the AccordionGroupPattern. */
interface AccordionGroupInputs extends Omit<ListNavigationInputs<AccordionTriggerPattern> & ListFocusInputs<AccordionTriggerPattern> & Omit<ListExpansionInputs, 'items'>, 'focusMode'> {
    /** A function that returns the trigger associated with a given element. */
    getItem: (e: Element | null | undefined) => AccordionTriggerPattern | undefined;
}
/** A pattern controls the nested Accordions. */
declare class AccordionGroupPattern {
    readonly inputs: AccordionGroupInputs;
    /** Controls navigation for the group. */
    readonly navigationBehavior: ListNavigation<AccordionTriggerPattern>;
    /** Controls focus for the group. */
    readonly focusBehavior: ListFocus<AccordionTriggerPattern>;
    /** Controls expansion for the group. */
    readonly expansionBehavior: ListExpansion;
    constructor(inputs: AccordionGroupInputs);
    /** The key used to navigate to the previous accordion trigger. */
    prevKey: _angular_core.Signal<"ArrowUp" | "ArrowRight" | "ArrowLeft">;
    /** The key used to navigate to the next accordion trigger. */
    nextKey: _angular_core.Signal<"ArrowRight" | "ArrowLeft" | "ArrowDown">;
    /** The keydown event manager for the accordion trigger. */
    keydown: _angular_core.Signal<KeyboardEventManager<KeyboardEvent>>;
    /** The pointerdown event manager for the accordion trigger. */
    pointerdown: _angular_core.Signal<PointerEventManager<PointerEvent>>;
    /** Handles keydown events on the trigger, delegating to the group if not disabled. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles pointerdown events on the trigger, delegating to the group if not disabled. */
    onPointerdown(event: PointerEvent): void;
    /** Handles focus events on the trigger. This ensures the tabbing changes the active index. */
    onFocus(event: FocusEvent): void;
    /** Toggles the expansion state of the active accordion item. */
    toggle(): void;
}
/** Inputs for the AccordionTriggerPattern. */
interface AccordionTriggerInputs extends Omit<ListNavigationItem & ListFocusItem, 'index'>, Omit<ExpansionItem, 'expandable'> {
    /** A local unique identifier for the trigger's corresponding panel. */
    panelId: SignalLike<string>;
    /** The parent accordion group that controls this trigger. */
    accordionGroup: SignalLike<AccordionGroupPattern>;
    /** The accordion panel controlled by this trigger. */
    accordionPanel: SignalLike<AccordionPanelPattern | undefined>;
}
/** A pattern controls the expansion state of an accordion. */
declare class AccordionTriggerPattern implements ListNavigationItem, ListFocusItem, ExpansionItem {
    readonly inputs: AccordionTriggerInputs;
    /** A unique identifier for this trigger. */
    readonly id: SignalLike<string>;
    /** A reference to the trigger element. */
    readonly element: SignalLike<HTMLElement>;
    /** Whether this trigger has expandable panel. */
    readonly expandable: SignalLike<boolean>;
    /** Whether the corresponding panel is expanded. */
    readonly expanded: WritableSignalLike<boolean>;
    /** Whether the trigger is active. */
    readonly active: _angular_core.Signal<boolean>;
    /** Id of the accordion panel controlled by the trigger. */
    readonly controls: _angular_core.Signal<string | undefined>;
    /** The tabindex of the trigger. */
    readonly tabIndex: _angular_core.Signal<-1 | 0>;
    /** Whether the trigger is disabled. Disabling an accordion group disables all the triggers. */
    readonly disabled: _angular_core.Signal<boolean>;
    /** Whether the trigger is hard disabled.  */
    readonly hardDisabled: _angular_core.Signal<boolean>;
    /** The index of the trigger within its accordion group. */
    readonly index: _angular_core.Signal<number>;
    constructor(inputs: AccordionTriggerInputs);
    /** Opens the accordion panel. */
    open(): void;
    /** Closes the accordion panel. */
    close(): void;
    /** Toggles the accordion panel. */
    toggle(): void;
}
/** Represents the required inputs for the AccordionPanelPattern. */
interface AccordionPanelInputs {
    /** A global unique identifier for the panel. */
    id: SignalLike<string>;
    /** A local unique identifier for the panel, matching its trigger's panelId. */
    panelId: SignalLike<string>;
    /** The parent accordion trigger that controls this panel. */
    accordionTrigger: SignalLike<AccordionTriggerPattern | undefined>;
}
/** Represents an accordion panel. */
declare class AccordionPanelPattern {
    readonly inputs: AccordionPanelInputs;
    /** A global unique identifier for the panel. */
    id: SignalLike<string>;
    /** The parent accordion trigger that controls this panel. */
    accordionTrigger: SignalLike<AccordionTriggerPattern | undefined>;
    /** Whether the accordion panel is hidden. True if the associated trigger is not expanded. */
    hidden: SignalLike<boolean>;
    constructor(inputs: AccordionPanelInputs);
}

/** Represents the required inputs for a tree item. */
interface TreeItemInputs<V> extends Omit<ListItem<V>, 'index'>, Omit<ExpansionItem, 'expandable'> {
    /** The parent item. */
    parent: SignalLike<TreeItemPattern<V> | TreePattern<V>>;
    /** Whether this item has children. Children can be lazily loaded. */
    hasChildren: SignalLike<boolean>;
    /** The children items. */
    children: SignalLike<TreeItemPattern<V>[]>;
    /** The tree pattern this item belongs to. */
    tree: SignalLike<TreePattern<V>>;
}
/**
 * Represents an item in a Tree.
 */
declare class TreeItemPattern<V> implements ListItem<V>, ExpansionItem {
    readonly inputs: TreeItemInputs<V>;
    /** A unique identifier for this item. */
    readonly id: SignalLike<string>;
    /** The value of this item. */
    readonly value: SignalLike<V>;
    /** A reference to the item element. */
    readonly element: SignalLike<HTMLElement>;
    /** Whether the item is disabled. */
    readonly disabled: SignalLike<boolean>;
    /** The text used by the typeahead search. */
    readonly searchTerm: SignalLike<string>;
    /** The tree pattern this item belongs to. */
    readonly tree: SignalLike<TreePattern<V>>;
    /** The parent item. */
    readonly parent: SignalLike<TreeItemPattern<V> | TreePattern<V>>;
    /** The children items. */
    readonly children: SignalLike<TreeItemPattern<V>[]>;
    /** The position of this item among its siblings. */
    readonly index: _angular_core.Signal<number>;
    /** Controls expansion for child items. */
    readonly expansionBehavior: ListExpansion;
    /** Whether the item is expandable. It's expandable if children item exist. */
    readonly expandable: SignalLike<boolean>;
    /** Whether the item is selectable. */
    readonly selectable: SignalLike<boolean>;
    /** Whether the item is expanded. */
    readonly expanded: WritableSignalLike<boolean>;
    /** The level of the current item in a tree. */
    readonly level: SignalLike<number>;
    /** Whether this item is visible. */
    readonly visible: SignalLike<boolean>;
    /** The number of items under the same parent at the same level. */
    readonly setsize: _angular_core.Signal<number>;
    /** The position of this item among its siblings (1-based). */
    readonly posinset: _angular_core.Signal<number>;
    /** Whether the item is active. */
    readonly active: _angular_core.Signal<boolean>;
    /** The tab index of the item. */
    readonly tabIndex: _angular_core.Signal<0 | -1>;
    /** Whether the item is selected. */
    readonly selected: SignalLike<boolean | undefined>;
    /** The current type of this item. */
    readonly current: SignalLike<string | undefined>;
    constructor(inputs: TreeItemInputs<V>);
}
/** The selection operations that the tree can perform. */
interface SelectOptions {
    toggle?: boolean;
    selectOne?: boolean;
    selectRange?: boolean;
    anchor?: boolean;
}
/** Represents the required inputs for a tree. */
interface TreeInputs<V> extends Omit<ListInputs<TreeItemPattern<V>, V>, 'items'> {
    /** A unique identifier for the tree. */
    id: SignalLike<string>;
    /** All items in the tree, in document order (DFS-like, a flattened list). */
    allItems: SignalLike<TreeItemPattern<V>[]>;
    /** Whether the tree is in navigation mode. */
    nav: SignalLike<boolean>;
    /** The aria-current type. */
    currentType: SignalLike<'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'>;
}
/** Controls the state and interactions of a tree view. */
declare class TreePattern<V> implements TreeInputs<V> {
    readonly inputs: TreeInputs<V>;
    /** The list behavior for the tree. */
    readonly listBehavior: List<TreeItemPattern<V>, V>;
    /** Controls expansion for direct children of the tree root (top-level items). */
    readonly expansionBehavior: ListExpansion;
    /** The root level is 0. */
    readonly level: () => number;
    /** The root is always expanded. */
    readonly expanded: () => boolean;
    /** The root is always visible. */
    readonly visible: () => boolean;
    /** The tab index of the tree. */
    readonly tabIndex: SignalLike<-1 | 0>;
    /** The id of the current active item. */
    readonly activeDescendant: _angular_core.Signal<string | undefined>;
    /** The direct children of the root (top-level tree items). */
    readonly children: _angular_core.Signal<TreeItemPattern<V>[]>;
    /** All currently visible tree items. An item is visible if their parent is expanded. */
    readonly visibleItems: _angular_core.Signal<TreeItemPattern<V>[]>;
    /** Whether the tree selection follows focus. */
    readonly followFocus: _angular_core.Signal<boolean>;
    /** Whether the tree direction is RTL. */
    readonly isRtl: _angular_core.Signal<boolean>;
    /** The key for navigating to the previous item. */
    readonly prevKey: _angular_core.Signal<"ArrowUp" | "ArrowRight" | "ArrowLeft">;
    /** The key for navigating to the next item. */
    readonly nextKey: _angular_core.Signal<"ArrowRight" | "ArrowLeft" | "ArrowDown">;
    /** The key for collapsing an item or moving to its parent. */
    readonly collapseKey: _angular_core.Signal<"ArrowUp" | "ArrowRight" | "ArrowLeft">;
    /** The key for expanding an item or moving to its first child. */
    readonly expandKey: _angular_core.Signal<"ArrowRight" | "ArrowLeft" | "ArrowDown">;
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    readonly dynamicSpaceKey: _angular_core.Signal<"" | " ">;
    /** Regular expression to match characters for typeahead. */
    readonly typeaheadRegexp: RegExp;
    /** The keydown event manager for the tree. */
    readonly keydown: _angular_core.Signal<KeyboardEventManager<KeyboardEvent>>;
    /** The pointerdown event manager for the tree. */
    pointerdown: _angular_core.Signal<PointerEventManager<PointerEvent>>;
    /** A unique identifier for the tree. */
    readonly id: SignalLike<string>;
    /** The host native element. */
    readonly element: SignalLike<HTMLElement>;
    /** Whether the tree is in navigation mode. */
    readonly nav: SignalLike<boolean>;
    /** The aria-current type. */
    readonly currentType: SignalLike<'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'>;
    /** All items in the tree, in document order (DFS-like, a flattened list). */
    readonly allItems: SignalLike<TreeItemPattern<V>[]>;
    /** The focus strategy used by the tree. */
    readonly focusMode: SignalLike<'roving' | 'activedescendant'>;
    /** Whether the tree is disabled. */
    readonly disabled: SignalLike<boolean>;
    /** The currently active item in the tree. */
    readonly activeItem: WritableSignalLike<TreeItemPattern<V> | undefined>;
    /** Whether disabled items should be focusable. */
    readonly softDisabled: SignalLike<boolean>;
    /** Whether the focus should wrap when navigating past the first or last item. */
    readonly wrap: SignalLike<boolean>;
    /** The orientation of the tree. */
    readonly orientation: SignalLike<'vertical' | 'horizontal'>;
    /** The text direction of the tree. */
    readonly textDirection: SignalLike<'ltr' | 'rtl'>;
    /** Whether multiple items can be selected at the same time. */
    readonly multi: SignalLike<boolean>;
    /** The selection mode of the tree. */
    readonly selectionMode: SignalLike<'follow' | 'explicit'>;
    /** The delay in milliseconds to wait before clearing the typeahead buffer. */
    readonly typeaheadDelay: SignalLike<number>;
    /** The current selected items of the tree. */
    readonly values: WritableSignalLike<V[]>;
    constructor(inputs: TreeInputs<V>);
    /**
     * Sets the tree to it's default initial state.
     *
     * Sets the active index of the tree to the first focusable selected tree item if one exists.
     * Otherwise, sets focus to the first focusable tree item.
     */
    setDefaultState(): void;
    /** Handles keydown events on the tree. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles pointerdown events on the tree. */
    onPointerdown(event: PointerEvent): void;
    /** Navigates to the given tree item in the tree. */
    goto(e: PointerEvent, opts?: SelectOptions): void;
    /** Toggles to expand or collapse a tree item. */
    toggleExpansion(item?: TreeItemPattern<V>): void;
    /** Expands a tree item. */
    expand(opts?: SelectOptions): void;
    /** Expands all sibling tree items including itself. */
    expandSiblings(item?: TreeItemPattern<V>): void;
    /** Collapses a tree item. */
    collapse(opts?: SelectOptions): void;
    /** Retrieves the TreeItemPattern associated with a DOM event, if any. */
    protected _getItem(event: Event): TreeItemPattern<V> | undefined;
}

type ComboboxTreeInputs<V> = TreeInputs<V> & {
    /** The combobox controlling the tree. */
    combobox: SignalLike<ComboboxPattern<TreeItemPattern<V>, V> | undefined>;
};
declare class ComboboxTreePattern<V> extends TreePattern<V> implements ComboboxTreeControls<TreeItemPattern<V>, V> {
    readonly inputs: ComboboxTreeInputs<V>;
    /** Whether the currently focused item is collapsible. */
    isItemCollapsible: () => boolean;
    /** The ARIA role for the tree. */
    role: () => "tree";
    activeId: _angular_core.Signal<string | undefined>;
    /** Returns the currently active (focused) item in the tree. */
    getActiveItem: () => TreeItemPattern<V> | undefined;
    /** The list of items in the tree. */
    items: _angular_core.Signal<TreeItemPattern<V>[]>;
    /** The tab index for the tree. Always -1 because the combobox handles focus. */
    tabIndex: SignalLike<-1 | 0>;
    constructor(inputs: ComboboxTreeInputs<V>);
    /** Noop. The combobox handles keydown events. */
    onKeydown(_: KeyboardEvent): void;
    /** Noop. The combobox handles pointerdown events. */
    onPointerdown(_: PointerEvent): void;
    /** Noop. The combobox controls the open state. */
    setDefaultState(): void;
    /** Navigates to the specified item in the tree. */
    focus: (item: TreeItemPattern<V>) => void;
    /** Navigates to the next focusable item in the tree. */
    next: () => void;
    /** Navigates to the previous focusable item in the tree. */
    prev: () => void;
    /** Navigates to the last focusable item in the tree. */
    last: () => void;
    /** Navigates to the first focusable item in the tree. */
    first: () => void;
    /** Unfocuses the currently focused item in the tree. */
    unfocus: () => void;
    /** Selects the specified item in the tree or the current active item if not provided. */
    select: (item?: TreeItemPattern<V>) => void;
    /** Toggles the selection state of the given item in the tree or the current active item if not provided. */
    toggle: (item?: TreeItemPattern<V>) => void;
    /** Clears the selection in the tree. */
    clearSelection: () => void;
    /** Retrieves the TreeItemPattern associated with a pointer event. */
    getItem: (e: PointerEvent) => TreeItemPattern<V> | undefined;
    /** Retrieves the currently selected items in the tree */
    getSelectedItems: () => TreeItemPattern<V>[];
    /** Sets the value of the combobox tree. */
    setValue: (value: V | undefined) => void;
    /** Expands the currently focused item if it is expandable. */
    expandItem: () => void;
    /** Collapses the currently focused item if it is expandable. */
    collapseItem: () => void;
    /** Whether the specified item or the currently active item is expandable. */
    isItemExpandable(item?: TreeItemPattern<V> | undefined): boolean;
    /** Expands all of the tree items. */
    expandAll: () => void;
    /** Collapses all of the tree items. */
    collapseAll: () => void;
    /** Whether the currently active item is selectable. */
    isItemSelectable: (item?: TreeItemPattern<V> | undefined) => boolean;
}

/**
 * A container directive controls the visibility of its content.
 */
declare class DeferredContentAware {
    readonly contentVisible: _angular_core.WritableSignal<boolean>;
    readonly preserveContent: _angular_core.ModelSignal<boolean>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<DeferredContentAware, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<DeferredContentAware, never, never, { "preserveContent": { "alias": "preserveContent"; "required": false; "isSignal": true; }; }, { "preserveContent": "preserveContentChange"; }, never, never, true, never>;
}
/**
 * DeferredContent loads/unloads the content based on the visibility.
 * The visibilty signal is sent from a parent directive implements
 * DeferredContentAware.
 *
 * Use this directive as a host directive. For example:
 *
 * ```ts
 *   @Directive({
 *     selector: 'ng-template[AccordionContent]',
 *     hostDirectives: [DeferredContent],
 *   })
 *   class AccordionContent {}
 * ```
 */
declare class DeferredContent implements OnDestroy {
    private readonly _deferredContentAware;
    private readonly _templateRef;
    private readonly _viewContainerRef;
    private _currentViewRef;
    private _isRendered;
    readonly deferredContentAware: _angular_core.WritableSignal<DeferredContentAware | null>;
    constructor();
    ngOnDestroy(): void;
    private _destroyContent;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<DeferredContent, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<DeferredContent, never, never, {}, {}, never, never, true, never>;
}

export { AccordionGroupPattern, AccordionPanelPattern, AccordionTriggerPattern, ComboboxListboxControls, ComboboxListboxPattern, ComboboxPattern, ComboboxTreeControls, ComboboxTreePattern, DeferredContent, DeferredContentAware, ListboxInputs, ListboxPattern, MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern, OptionPattern, SignalLike, TabListPattern, TabPanelPattern, TabPattern, ToolbarPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern, TreeItemPattern, TreePattern, WritableSignalLike };
export type { AccordionGroupInputs, AccordionPanelInputs, AccordionTriggerInputs, ComboboxListboxInputs, ComboboxTreeInputs, MenuBarInputs, MenuInputs, MenuItemInputs, MenuTriggerInputs, TabInputs, TabListInputs, TabPanelInputs, ToolbarInputs, ToolbarWidgetGroupInputs, ToolbarWidgetInputs, TreeInputs, TreeItemInputs };
