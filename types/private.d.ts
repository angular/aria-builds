import * as _angular_core from '@angular/core';
import { Signal, OnDestroy } from '@angular/core';
import { SignalLike, WritableSignalLike, KeyboardEventManager, PointerEventManager } from './_grid-chunk.js';
export { GridCellInputs, GridCellPattern, GridCellWidgetInputs, GridCellWidgetPattern, GridInputs, GridPattern, GridRowInputs, GridRowPattern, convertGetterSetterToWritableSignalLike } from './_grid-chunk.js';

/** Represents an item in a collection, such as a listbox option, than may receive focus. */
interface ListFocusItem {
    /** A unique identifier for the item. */
    id: SignalLike<string>;
    /** The html element that should receive focus. */
    element: SignalLike<HTMLElement | undefined>;
    /** Whether an item is disabled. */
    disabled: SignalLike<boolean>;
    /** The index of the item in the list. */
    index: SignalLike<number>;
}
/** Represents the required inputs for a collection that contains focusable items. */
interface ListFocusInputs<T extends ListFocusItem> {
    /** The focus strategy used by the list. */
    focusMode: SignalLike<'roving' | 'activedescendant'>;
    /** Whether the list is disabled. */
    disabled: SignalLike<boolean>;
    /** The items in the list. */
    items: SignalLike<T[]>;
    /** The active item. */
    activeItem: WritableSignalLike<T | undefined>;
    /** Whether disabled items in the list should be focusable. */
    softDisabled: SignalLike<boolean>;
    element: SignalLike<HTMLElement | undefined>;
}
/** Controls focus for a list of items. */
declare class ListFocus<T extends ListFocusItem> {
    readonly inputs: ListFocusInputs<T>;
    /** The last item that was active. */
    prevActiveItem: _angular_core.WritableSignal<T | undefined>;
    /** The index of the last item that was active. */
    prevActiveIndex: _angular_core.Signal<number>;
    /** The current active index in the list. */
    activeIndex: _angular_core.Signal<number>;
    constructor(inputs: ListFocusInputs<T>);
    /** Whether the list is in a disabled state. */
    isListDisabled(): boolean;
    /** The id of the current active item. */
    getActiveDescendant(): string | undefined;
    /** The tab index for the list. */
    getListTabIndex(): -1 | 0;
    /** Returns the tab index for the given item. */
    getItemTabIndex(item: T): -1 | 0;
    /** Moves focus to the given item if it is focusable. */
    focus(item: T, opts?: {
        focusElement?: boolean;
    }): boolean;
    /** Returns true if the given item can be navigated to. */
    isFocusable(item: T): boolean;
}

/** Represents an item in a collection, such as a listbox option, than can be navigated to. */
interface ListNavigationItem extends ListFocusItem {
}
/** Represents the required inputs for a collection that has navigable items. */
interface ListNavigationInputs<T extends ListNavigationItem> extends ListFocusInputs<T> {
    /** Whether focus should wrap when navigating. */
    wrap: SignalLike<boolean>;
    /** Whether the list is vertically or horizontally oriented. */
    orientation: SignalLike<'vertical' | 'horizontal'>;
    /** The direction that text is read based on the users locale. */
    textDirection: SignalLike<'rtl' | 'ltr'>;
}
/** Controls navigation for a list of items. */
declare class ListNavigation<T extends ListNavigationItem> {
    readonly inputs: ListNavigationInputs<T> & {
        focusManager: ListFocus<T>;
    };
    constructor(inputs: ListNavigationInputs<T> & {
        focusManager: ListFocus<T>;
    });
    /** Navigates to the given item. */
    goto(item?: T, opts?: {
        focusElement?: boolean;
    }): boolean;
    /** Navigates to the next item in the list. */
    next(opts?: {
        focusElement?: boolean;
    }): boolean;
    /** Peeks the next item in the list. */
    peekNext(): T | undefined;
    /** Navigates to the previous item in the list. */
    prev(opts?: {
        focusElement?: boolean;
    }): boolean;
    /** Peeks the previous item in the list. */
    peekPrev(): T | undefined;
    /** Navigates to the first item in the list. */
    first(opts?: {
        focusElement?: boolean;
    }): boolean;
    /** Navigates to the last item in the list. */
    last(opts?: {
        focusElement?: boolean;
    }): boolean;
    /** Gets the first focusable item from the given list of items. */
    peekFirst(items?: T[]): T | undefined;
    /** Gets the last focusable item from the given list of items. */
    peekLast(items?: T[]): T | undefined;
    /** Advances to the next or previous focusable item in the list based on the given delta. */
    private _advance;
    /** Peeks the next or previous focusable item in the list based on the given delta. */
    private _peek;
}

/** Represents an item in a collection, such as a listbox option, that can be selected. */
interface ListSelectionItem<V> extends ListFocusItem {
    /** The value of the item. */
    value: SignalLike<V>;
    /** Whether the item is selectable. */
    selectable: SignalLike<boolean>;
}
/** Represents the required inputs for a collection that contains selectable items. */
interface ListSelectionInputs<T extends ListSelectionItem<V>, V> extends ListFocusInputs<T> {
    /** Whether multiple items in the list can be selected at once. */
    multi: SignalLike<boolean>;
    /** The current value of the list selection. */
    values: WritableSignalLike<V[]>;
    /** The selection strategy used by the list. */
    selectionMode: SignalLike<'follow' | 'explicit'>;
}
/** Controls selection for a list of items. */
declare class ListSelection<T extends ListSelectionItem<V>, V> {
    readonly inputs: ListSelectionInputs<T, V> & {
        focusManager: ListFocus<T>;
    };
    /** The start index to use for range selection. */
    rangeStartIndex: _angular_core.WritableSignal<number>;
    /** The end index to use for range selection. */
    rangeEndIndex: _angular_core.WritableSignal<number>;
    /** The currently selected items. */
    selectedItems: _angular_core.Signal<T[]>;
    constructor(inputs: ListSelectionInputs<T, V> & {
        focusManager: ListFocus<T>;
    });
    /** Selects the item at the current active index. */
    select(item?: ListSelectionItem<V>, opts?: {
        anchor: boolean;
    }): void;
    /** Deselects the item at the current active index. */
    deselect(item?: ListSelectionItem<V>): void;
    /** Toggles the item at the current active index. */
    toggle(item?: ListSelectionItem<V>): void;
    /** Toggles only the item at the current active index. */
    toggleOne(): void;
    /** Selects all items in the list. */
    selectAll(): void;
    /** Deselects all items in the list. */
    deselectAll(): void;
    /**
     * Selects all items in the list or deselects all
     * items in the list if all items are already selected.
     */
    toggleAll(): void;
    /** Sets the selection to only the current active item. */
    selectOne(): void;
    /**
     * Selects all items in the list up to the anchor item.
     *
     * Deselects all items that were previously within the
     * selected range that are now outside of the selected range
     */
    selectRange(opts?: {
        anchor: boolean;
    }): void;
    /** Marks the given index as the start of a range selection. */
    beginRangeSelection(index?: number): void;
    /** Returns the items in the list starting from the given index.  */
    private _getItemsFromIndex;
}

/**
 * Represents an item in a collection, such as a listbox option, than can be navigated to by
 * typeahead.
 */
interface ListTypeaheadItem extends ListFocusItem {
    /** The text used by the typeahead search. */
    searchTerm: SignalLike<string>;
}
/**
 * Represents the required inputs for a collection that contains items that can be navigated to by
 * typeahead.
 */
interface ListTypeaheadInputs<T extends ListTypeaheadItem> extends ListFocusInputs<T> {
    /** The amount of time before the typeahead search is reset. */
    typeaheadDelay: SignalLike<number>;
}
/** Controls typeahead for a list of items. */
declare class ListTypeahead<T extends ListTypeaheadItem> {
    readonly inputs: ListTypeaheadInputs<T> & {
        focusManager: ListFocus<T>;
    };
    /** A reference to the timeout for resetting the typeahead search. */
    timeout?: ReturnType<typeof setTimeout> | undefined;
    /** The focus controller of the parent list. */
    focusManager: ListFocus<T>;
    /** Whether the user is actively typing a typeahead search query. */
    isTyping: _angular_core.Signal<boolean>;
    /** Keeps track of the characters that typeahead search is being called with. */
    private _query;
    /** The index where that the typeahead search was initiated from. */
    private _startIndex;
    constructor(inputs: ListTypeaheadInputs<T> & {
        focusManager: ListFocus<T>;
    });
    /** Performs a typeahead search, appending the given character to the search string. */
    search(char: string): boolean;
    /**
     * Returns the first item whose search term matches the
     * current query starting from the the current anchor index.
     */
    private _getItem;
}

/** The operations that the list can perform after navigation. */
interface NavOptions {
    toggle?: boolean;
    select?: boolean;
    selectOne?: boolean;
    selectRange?: boolean;
    anchor?: boolean;
    focusElement?: boolean;
}
/** Represents an item in the list. */
type ListItem<V> = ListTypeaheadItem & ListNavigationItem & ListSelectionItem<V> & ListFocusItem;
/** The necessary inputs for the list behavior. */
type ListInputs<T extends ListItem<V>, V> = ListFocusInputs<T> & ListNavigationInputs<T> & ListSelectionInputs<T, V> & ListTypeaheadInputs<T>;
/** Controls the state of a list. */
declare class List<T extends ListItem<V>, V> {
    readonly inputs: ListInputs<T, V>;
    /** Controls navigation for the list. */
    navigationBehavior: ListNavigation<T>;
    /** Controls selection for the list. */
    selectionBehavior: ListSelection<T, V>;
    /** Controls typeahead for the list. */
    typeaheadBehavior: ListTypeahead<T>;
    /** Controls focus for the list. */
    focusBehavior: ListFocus<T>;
    /** Whether the list is disabled. */
    disabled: _angular_core.Signal<boolean>;
    /** The id of the current active item. */
    activeDescendant: _angular_core.Signal<string | undefined>;
    /** The tab index of the list. */
    tabIndex: _angular_core.Signal<0 | -1>;
    /** The index of the currently active item in the list. */
    activeIndex: _angular_core.Signal<number>;
    /**
     * The uncommitted index for selecting a range of options.
     *
     * NOTE: This is subtly distinct from the "rangeStartIndex" in the ListSelection behavior.
     * The anchorIndex does not necessarily represent the start of a range, but represents the most
     * recent index where the user showed intent to begin a range selection. Usually, this is wherever
     * the user most recently pressed the "Shift" key, but if the user presses shift + space to select
     * from the anchor, the user is not intending to start a new range from this index.
     *
     * In other words, "rangeStartIndex" is only set when a user commits to starting a range selection
     * while "anchorIndex" is set whenever a user indicates they may be starting a range selection.
     */
    private _anchorIndex;
    /** Whether the list should wrap. Used to disable wrapping while range selecting. */
    private _wrap;
    constructor(inputs: ListInputs<T, V>);
    /** Returns the tab index for the given item. */
    getItemTabindex(item: T): 0 | -1;
    /** Navigates to the first option in the list. */
    first(opts?: NavOptions): void;
    /** Navigates to the last option in the list. */
    last(opts?: NavOptions): void;
    /** Navigates to the next option in the list. */
    next(opts?: NavOptions): void;
    /** Navigates to the previous option in the list. */
    prev(opts?: NavOptions): void;
    /** Navigates to the given item in the list. */
    goto(item: T, opts?: NavOptions): void;
    /** Removes focus from the list. */
    unfocus(): void;
    /** Marks the given index as the potential start of a range selection. */
    anchor(index: number): void;
    /** Handles typeahead search navigation for the list. */
    search(char: string, opts?: NavOptions): void;
    /** Checks if the list is currently typing for typeahead search. */
    isTyping(): boolean;
    /** Selects the currently active item in the list. */
    select(item?: T): void;
    /** Sets the selection to only the current active item. */
    selectOne(): void;
    /** Deselects the currently active item in the list. */
    deselect(item?: T): void;
    /** Deselects all items in the list. */
    deselectAll(): void;
    /** Toggles the currently active item in the list. */
    toggle(item?: T): void;
    /** Toggles the currently active item in the list, deselecting all other items. */
    toggleOne(): void;
    /** Toggles the selection of all items in the list. */
    toggleAll(): void;
    /** Checks if the given item is able to receive focus. */
    isFocusable(item: T): boolean;
    /** Handles updating selection for the list. */
    updateSelection(opts?: NavOptions): void;
    /**
     * Safely performs a navigation operation.
     *
     * Handles conditionally disabling wrapping for when a navigation
     * operation is occurring while the user is selecting a range of options.
     *
     * Handles boilerplate calling of focus & selection operations. Also ensures these
     * additional operations are only called if the navigation operation moved focus to a new option.
     */
    private _navigate;
}

/** Represents the required inputs for a combobox. */
interface ComboboxInputs<T extends ListItem<V>, V> {
    /** The controls for the popup associated with the combobox. */
    popupControls: SignalLike<ComboboxListboxControls<T, V> | ComboboxTreeControls<T, V> | ComboboxDialogPattern | undefined>;
    /** The HTML input element that serves as the combobox input. */
    inputEl: SignalLike<HTMLInputElement | undefined>;
    /** The HTML element that serves as the combobox container. */
    containerEl: SignalLike<HTMLElement | undefined>;
    /** The filtering mode for the combobox. */
    filterMode: SignalLike<'manual' | 'auto-select' | 'highlight'>;
    /** The current value of the combobox. */
    inputValue?: WritableSignalLike<string>;
    /** The value of the first matching item in the popup. */
    firstMatch: SignalLike<V | undefined>;
    /** Whether the combobox is disabled. */
    disabled: SignalLike<boolean>;
    /** Whether the combobox is read-only. */
    readonly: SignalLike<boolean>;
    /** Whether the combobox is in a right-to-left context. */
    textDirection: SignalLike<'rtl' | 'ltr'>;
    /** Whether the combobox is always expanded. */
    alwaysExpanded: SignalLike<boolean>;
}
/** An interface that allows combobox popups to expose the necessary controls for the combobox. */
interface ComboboxListboxControls<T extends ListItem<V>, V> {
    /** A unique identifier for the popup. */
    id: () => string;
    /** The ARIA role for the popup. */
    role: SignalLike<'listbox' | 'tree' | 'grid'>;
    /** Whether multiple items in the popup can be selected at once. */
    multi: SignalLike<boolean>;
    /** The ID of the active item in the popup. */
    activeId: SignalLike<string | undefined>;
    /** The list of items in the popup. */
    items: SignalLike<T[]>;
    /** Navigates to the given item in the popup. */
    focus: (item: T, opts?: {
        focusElement?: boolean;
    }) => void;
    /** Navigates to the next item in the popup. */
    next: () => void;
    /** Navigates to the previous item in the popup. */
    prev: () => void;
    /** Navigates to the first item in the popup. */
    first: () => void;
    /** Navigates to the last item in the popup. */
    last: () => void;
    /** Selects the current item in the popup. */
    select: (item?: T) => void;
    /** Toggles the selection state of the given item in the popup. */
    toggle: (item?: T) => void;
    /** Clears the selection state of the popup. */
    clearSelection: () => void;
    /** Removes focus from any item in the popup. */
    unfocus: () => void;
    /** Returns the item corresponding to the given event. */
    getItem: (e: PointerEvent) => T | undefined;
    /** Returns the currently active (focused) item in the popup. */
    getActiveItem: () => T | undefined;
    /** Returns the currently selected items in the popup. */
    getSelectedItems: () => T[];
    /** Sets the value of the combobox based on the selected item. */
    setValue: (value: V | undefined) => void;
}
interface ComboboxTreeControls<T extends ListItem<V>, V> extends ComboboxListboxControls<T, V> {
    /** Whether the currently active item in the popup is collapsible. */
    isItemCollapsible: () => boolean;
    /** Expands the currently active item in the popup. */
    expandItem: () => void;
    /** Collapses the currently active item in the popup. */
    collapseItem: () => void;
    /** Checks if the currently active item in the popup is expandable. */
    isItemExpandable: (item?: T) => boolean;
    /** Expands all nodes in the tree. */
    expandAll: () => void;
    /** Collapses all nodes in the tree. */
    collapseAll: () => void;
    /** Toggles the expansion state of the currently active item in the popup. */
    toggleExpansion: (item?: T) => void;
    /** Whether the current active item is selectable. */
    isItemSelectable: (item?: T) => boolean;
}
/** Controls the state of a combobox. */
declare class ComboboxPattern<T extends ListItem<V>, V> {
    readonly inputs: ComboboxInputs<T, V>;
    /** Whether the combobox is expanded. */
    expanded: _angular_core.WritableSignal<boolean>;
    /** The ID of the active item in the combobox. */
    activeDescendant: _angular_core.Signal<string | null>;
    /** The currently highlighted item in the combobox. */
    highlightedItem: _angular_core.WritableSignal<T | undefined>;
    /** Whether the most recent input event was a deletion. */
    isDeleting: boolean;
    /** Whether the combobox is focused. */
    isFocused: _angular_core.WritableSignal<boolean>;
    /** Whether the combobox has ever been focused. */
    hasBeenFocused: _angular_core.WritableSignal<boolean>;
    /** The key used to navigate to the previous item in the list. */
    expandKey: _angular_core.Signal<"ArrowLeft" | "ArrowRight">;
    /** The key used to navigate to the next item in the list. */
    collapseKey: _angular_core.Signal<"ArrowLeft" | "ArrowRight">;
    /** The ID of the popup associated with the combobox. */
    popupId: _angular_core.Signal<string | null>;
    /** The autocomplete behavior of the combobox. */
    autocomplete: _angular_core.Signal<"both" | "list">;
    /** The ARIA role of the popup associated with the combobox. */
    hasPopup: _angular_core.Signal<"listbox" | "tree" | "grid" | "dialog" | null>;
    /** Whether the combobox is read-only. */
    readonly: _angular_core.Signal<true | null>;
    /** Returns the listbox controls for the combobox. */
    listControls: () => ComboboxListboxControls<T, V> | null | undefined;
    /** Returns the tree controls for the combobox. */
    treeControls: () => ComboboxTreeControls<T, V> | null;
    /** The keydown event manager for the combobox. */
    keydown: _angular_core.Signal<KeyboardEventManager<KeyboardEvent>>;
    /** The pointerup event manager for the combobox. */
    pointerup: _angular_core.Signal<PointerEventManager<PointerEvent>>;
    constructor(inputs: ComboboxInputs<T, V>);
    /** Handles keydown events for the combobox. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles pointerup events for the combobox. */
    onPointerup(event: PointerEvent): void;
    /** Handles input events for the combobox. */
    onInput(event: Event): void;
    /** Handles focus in events for the combobox. */
    onFocusIn(): void;
    /** Handles focus out events for the combobox. */
    onFocusOut(event: FocusEvent): void;
    /** The first matching item in the combobox. */
    firstMatch: _angular_core.Signal<T | undefined>;
    /** Handles filtering logic for the combobox. */
    onFilter(): void;
    /** Highlights the currently selected item in the combobox. */
    highlight(): void;
    /** Closes the combobox. */
    close(opts?: {
        reset: boolean;
    }): void;
    /** Opens the combobox. */
    open(nav?: {
        first?: boolean;
        last?: boolean;
        selected?: boolean;
    }): void;
    /** Navigates to the next focusable item in the combobox popup. */
    next(): void;
    /** Navigates to the previous focusable item in the combobox popup. */
    prev(): void;
    /** Navigates to the first focusable item in the combobox popup. */
    first(): void;
    /** Navigates to the last focusable item in the combobox popup. */
    last(): void;
    /** Collapses the currently focused item in the combobox. */
    collapseItem(): void;
    /** Expands the currently focused item in the combobox. */
    expandItem(): void;
    /** Selects an item in the combobox popup. */
    select(opts?: {
        item?: T;
        commit?: boolean;
        close?: boolean;
    }): void;
    /** Updates the value of the input based on the currently selected item. */
    commit(): void;
    /** Navigates and handles additional actions based on filter mode. */
    private _navigate;
}
declare class ComboboxDialogPattern {
    readonly inputs: {
        combobox: ComboboxPattern<any, any>;
        element: SignalLike<HTMLDialogElement>;
        id: SignalLike<string>;
    };
    id: () => string;
    role: () => "dialog";
    keydown: _angular_core.Signal<KeyboardEventManager<KeyboardEvent>>;
    constructor(inputs: {
        combobox: ComboboxPattern<any, any>;
        element: SignalLike<HTMLDialogElement>;
        id: SignalLike<string>;
    });
    onKeydown(event: KeyboardEvent): void;
    onClick(event: MouseEvent): void;
}

/**
 * Represents the properties exposed by a listbox that need to be accessed by an option.
 * This exists to avoid circular dependency errors between the listbox and option.
 */
interface ListboxPattern$1<V> {
    inputs: ListInputs<OptionPattern<V>, V>;
    listBehavior: List<OptionPattern<V>, V>;
}
/** Represents the required inputs for an option in a listbox. */
interface OptionInputs<V> extends Omit<ListItem<V>, 'index' | 'selectable'> {
    listbox: SignalLike<ListboxPattern$1<V> | undefined>;
}
/** Represents an option in a listbox. */
declare class OptionPattern<V> {
    /** A unique identifier for the option. */
    id: SignalLike<string>;
    /** The value of the option. */
    value: SignalLike<V>;
    /** The position of the option in the list. */
    index: _angular_core.Signal<number>;
    /** Whether the option is active. */
    active: _angular_core.Signal<boolean>;
    /** Whether the option is selected. */
    selected: _angular_core.Signal<boolean | undefined>;
    /** Whether the option is selectable. */
    selectable: () => boolean;
    /** Whether the option is disabled. */
    disabled: SignalLike<boolean>;
    /** The text used by the typeahead search. */
    searchTerm: SignalLike<string>;
    /** A reference to the parent listbox. */
    listbox: SignalLike<ListboxPattern$1<V> | undefined>;
    /** The tab index of the option. */
    tabIndex: _angular_core.Signal<0 | -1 | undefined>;
    /** The html element that should receive focus. */
    element: SignalLike<HTMLElement | undefined>;
    constructor(args: OptionInputs<V>);
}

/** Represents the required inputs for a listbox. */
type ListboxInputs<V> = ListInputs<OptionPattern<V>, V> & {
    /** A unique identifier for the listbox. */
    id: SignalLike<string>;
    /** Whether the listbox is readonly. */
    readonly: SignalLike<boolean>;
};
/** Controls the state of a listbox. */
declare class ListboxPattern<V> {
    readonly inputs: ListboxInputs<V>;
    listBehavior: List<OptionPattern<V>, V>;
    /** Whether the list is vertically or horizontally oriented. */
    orientation: SignalLike<'vertical' | 'horizontal'>;
    /** Whether the listbox is disabled. */
    disabled: _angular_core.Signal<boolean>;
    /** Whether the listbox is readonly. */
    readonly: SignalLike<boolean>;
    /** The tab index of the listbox. */
    tabIndex: SignalLike<-1 | 0>;
    /** The id of the current active item. */
    activeDescendant: _angular_core.Signal<string | undefined>;
    /** Whether multiple items in the list can be selected at once. */
    multi: SignalLike<boolean>;
    /** The number of items in the listbox. */
    setsize: _angular_core.Signal<number>;
    /** Whether the listbox selection follows focus. */
    followFocus: _angular_core.Signal<boolean>;
    /** Whether the listbox should wrap. Used to disable wrapping while range selecting. */
    wrap: _angular_core.WritableSignal<boolean>;
    /** The key used to navigate to the previous item in the list. */
    prevKey: _angular_core.Signal<"ArrowUp" | "ArrowRight" | "ArrowLeft">;
    /** The key used to navigate to the next item in the list. */
    nextKey: _angular_core.Signal<"ArrowRight" | "ArrowLeft" | "ArrowDown">;
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey: _angular_core.Signal<"" | " ">;
    /** The regexp used to decide if a key should trigger typeahead. */
    typeaheadRegexp: RegExp;
    /** The keydown event manager for the listbox. */
    keydown: _angular_core.Signal<KeyboardEventManager<KeyboardEvent>>;
    /** The pointerdown event manager for the listbox. */
    pointerdown: _angular_core.Signal<PointerEventManager<PointerEvent>>;
    constructor(inputs: ListboxInputs<V>);
    /** Returns a set of violations */
    validate(): string[];
    /** Handles keydown events for the listbox. */
    onKeydown(event: KeyboardEvent): void;
    onPointerdown(event: PointerEvent): void;
    /**
     * Sets the listbox to it's default initial state.
     *
     * Sets the active index of the listbox to the first focusable selected
     * item if one exists. Otherwise, sets focus to the first focusable item.
     *
     * This method should be called once the listbox and it's options are properly initialized,
     * meaning the ListboxPattern and OptionPatterns should have references to each other before this
     * is called.
     */
    setDefaultState(): void;
    protected _getItem(e: PointerEvent): OptionPattern<V> | undefined;
}

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
interface MenuBarInputs<V> extends Omit<ListInputs<MenuItemPattern<V>, V>, 'disabled'> {
    /** The menu items contained in the menu. */
    items: SignalLike<MenuItemPattern<V>[]>;
    /** Callback function triggered when a menu item is selected. */
    onSelect?: (value: V) => void;
    /** The text direction of the menu bar. */
    textDirection: SignalLike<'ltr' | 'rtl'>;
}
/** The inputs for the MenuPattern class. */
interface MenuInputs<V> extends Omit<ListInputs<MenuItemPattern<V>, V>, 'values' | 'disabled'> {
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
    /** Whether the menu is visible. */
    isVisible: Signal<boolean>;
    /** Controls list behavior for the menu items. */
    listBehavior: List<MenuItemPattern<V>, V>;
    /** Whether the menu or any of its child elements are currently focused. */
    isFocused: _angular_core.WritableSignal<boolean>;
    /** Whether the menu has received focus. */
    hasBeenFocused: _angular_core.WritableSignal<boolean>;
    /** Timeout used to open sub-menus on hover. */
    _openTimeout: any;
    /** Timeout used to close sub-menus on hover out. */
    _closeTimeout: any;
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
    disabled: SignalLike<boolean>;
    /** The search term for the menu item. */
    searchTerm: SignalLike<string>;
    /** The element of the menu item. */
    element: SignalLike<HTMLElement | undefined>;
    /** Whether the menu item is active. */
    isActive: Signal<boolean>;
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
    /** Used to uniquely identify an expansion item. */
    expansionId: SignalLike<string>;
    /** Whether the expansion is disabled. */
    disabled: SignalLike<boolean>;
}
interface ExpansionControl extends ExpansionItem {
}
/**
 * Controls a single item's expansion state and interactions,
 * delegating actual state changes to an Expansion manager.
 */
declare class ExpansionControl {
    readonly inputs: ExpansionItem & {
        expansionManager: ListExpansion;
    };
    /** Whether this specific item is currently expanded. Derived from the Expansion manager. */
    readonly isExpanded: _angular_core.Signal<boolean>;
    /** Whether this item can be expanded. */
    readonly isExpandable: _angular_core.Signal<boolean>;
    constructor(inputs: ExpansionItem & {
        expansionManager: ListExpansion;
    });
    /** Requests the Expansion manager to open this item. */
    open(): void;
    /** Requests the Expansion manager to close this item. */
    close(): void;
    /** Requests the Expansion manager to toggle this item. */
    toggle(): void;
}
/** Represents the required inputs for an expansion behavior. */
interface ListExpansionInputs {
    /** Whether multiple items can be expanded at once. */
    multiExpandable: SignalLike<boolean>;
    /** An array of ids of the currently expanded items. */
    expandedIds: WritableSignalLike<string[]>;
    /** An array of expansion items. */
    items: SignalLike<ExpansionItem[]>;
    /** Whether all expansions are disabled. */
    disabled: SignalLike<boolean>;
}
/** Manages the expansion state of a list of items. */
declare class ListExpansion {
    readonly inputs: ListExpansionInputs;
    /** A signal holding an array of ids of the currently expanded items. */
    expandedIds: WritableSignalLike<string[]>;
    constructor(inputs: ListExpansionInputs);
    /** Opens the specified item. */
    open(item: ExpansionItem): void;
    /** Closes the specified item. */
    close(item: ExpansionItem): void;
    /** Toggles the expansion state of the specified item. */
    toggle(item: ExpansionItem): void;
    /** Opens all focusable items in the list. */
    openAll(): void;
    /** Closes all focusable items in the list. */
    closeAll(): void;
    /** Checks whether the specified item is expandable / collapsible. */
    isExpandable(item: ExpansionItem): boolean;
    /** Checks whether the specified item is currently expanded. */
    isExpanded(item: ExpansionItem): boolean;
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
interface TabInputs extends Omit<ListItem<string>, 'searchTerm' | 'index' | 'selectable'>, Omit<ExpansionItem, 'expansionId' | 'expandable'> {
    /** The parent tablist that controls the tab. */
    tablist: SignalLike<TabListPattern>;
    /** The remote tabpanel controlled by the tab. */
    tabpanel: SignalLike<TabPanelPattern | undefined>;
}
/** A tab in a tablist. */
declare class TabPattern {
    readonly inputs: TabInputs;
    /** Controls expansion for this tab. */
    readonly expansion: ExpansionControl;
    /** A global unique identifier for the tab. */
    readonly id: SignalLike<string>;
    /** The index of the tab. */
    readonly index: _angular_core.Signal<number>;
    /** A local unique identifier for the tab. */
    readonly value: SignalLike<string>;
    /** Whether the tab is disabled. */
    readonly disabled: SignalLike<boolean>;
    /** The html element that should receive focus. */
    readonly element: SignalLike<HTMLElement | undefined>;
    /** Whether the tab is selectable. */
    readonly selectable: () => boolean;
    /** The text used by the typeahead search. */
    readonly searchTerm: () => string;
    /** Whether this tab has expandable content. */
    readonly expandable: _angular_core.Signal<boolean>;
    /** The unique identifier used by the expansion behavior. */
    readonly expansionId: _angular_core.Signal<string>;
    /** Whether the tab is expanded. */
    readonly expanded: _angular_core.Signal<boolean>;
    /** Whether the tab is active. */
    readonly active: _angular_core.Signal<boolean>;
    /** Whether the tab is selected. */
    readonly selected: _angular_core.Signal<boolean>;
    /** The tab index of the tab. */
    readonly tabIndex: _angular_core.Signal<0 | -1>;
    /** The id of the tabpanel associated with the tab. */
    readonly controls: _angular_core.Signal<string | undefined>;
    constructor(inputs: TabInputs);
}
/** The required inputs for the tabpanel. */
interface TabPanelInputs extends LabelControlOptionalInputs {
    id: SignalLike<string>;
    tab: SignalLike<TabPattern | undefined>;
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
    readonly tabIndex: _angular_core.Signal<0 | -1>;
    /** The aria-labelledby value for this tabpanel. */
    readonly labelledBy: _angular_core.Signal<string | undefined>;
    constructor(inputs: TabPanelInputs);
}
/** The required inputs for the tablist. */
type TabListInputs = Omit<ListInputs<TabPattern, string>, 'multi' | 'typeaheadDelay'> & Omit<ListExpansionInputs, 'multiExpandable' | 'expandedIds' | 'items'>;
/** Controls the state of a tablist. */
declare class TabListPattern {
    readonly inputs: TabListInputs;
    /** The list behavior for the tablist. */
    readonly listBehavior: List<TabPattern, string>;
    /** Controls expansion for the tablist. */
    readonly expansionManager: ListExpansion;
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
type ToolbarInputs<V> = Omit<ListInputs<ToolbarWidgetPattern<V>, V>, 'multi' | 'typeaheadDelay' | 'values' | 'selectionMode' | 'focusMode'> & {
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
type AccordionGroupInputs = Omit<ListNavigationInputs<AccordionTriggerPattern> & ListFocusInputs<AccordionTriggerPattern> & Omit<ListExpansionInputs, 'items'>, 'focusMode'>;
interface AccordionGroupPattern extends AccordionGroupInputs {
}
/** A pattern controls the nested Accordions. */
declare class AccordionGroupPattern {
    readonly inputs: AccordionGroupInputs;
    /** Controls navigation for the group. */
    navigation: ListNavigation<AccordionTriggerPattern>;
    /** Controls focus for the group. */
    focusManager: ListFocus<AccordionTriggerPattern>;
    /** Controls expansion for the group. */
    expansionManager: ListExpansion;
    constructor(inputs: AccordionGroupInputs);
}
/** Inputs for the AccordionTriggerPattern. */
type AccordionTriggerInputs = Omit<ListNavigationItem & ListFocusItem, 'index'> & Omit<ExpansionItem, 'expansionId' | 'expandable'> & {
    /** A local unique identifier for the trigger's corresponding panel. */
    panelId: SignalLike<string>;
    /** The parent accordion group that controls this trigger. */
    accordionGroup: SignalLike<AccordionGroupPattern>;
    /** The accordion panel controlled by this trigger. */
    accordionPanel: SignalLike<AccordionPanelPattern | undefined>;
};
interface AccordionTriggerPattern extends AccordionTriggerInputs {
}
/** A pattern controls the expansion state of an accordion. */
declare class AccordionTriggerPattern {
    readonly inputs: AccordionTriggerInputs;
    /** Whether this tab has expandable content. */
    expandable: SignalLike<boolean>;
    /** The unique identifier used by the expansion behavior. */
    expansionId: SignalLike<string>;
    /** Whether an accordion is expanded. */
    expanded: SignalLike<boolean>;
    /** Controls the expansion state for the trigger. */
    expansionControl: ExpansionControl;
    /** Whether the trigger is active. */
    active: _angular_core.Signal<boolean>;
    /** Id of the accordion panel controlled by the trigger. */
    controls: _angular_core.Signal<string | undefined>;
    /** The tab index of the trigger. */
    tabIndex: _angular_core.Signal<-1 | 0>;
    /** Whether the trigger is disabled. Disabling an accordion group disables all the triggers. */
    disabled: _angular_core.Signal<boolean>;
    /** The index of the trigger within its accordion group. */
    index: _angular_core.Signal<number>;
    constructor(inputs: AccordionTriggerInputs);
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
    private _getItem;
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
interface AccordionPanelPattern extends AccordionPanelInputs {
}
/** Represents an accordion panel. */
declare class AccordionPanelPattern {
    readonly inputs: AccordionPanelInputs;
    /** Whether the accordion panel is hidden. True if the associated trigger is not expanded. */
    hidden: SignalLike<boolean>;
    constructor(inputs: AccordionPanelInputs);
}

/** Represents the required inputs for a tree item. */
interface TreeItemInputs<V> extends Omit<ListItem<V>, 'index'> {
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
    readonly element: SignalLike<HTMLElement | undefined>;
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
    /** The unique identifier used by the expansion behavior. */
    readonly expansionId: SignalLike<string>;
    /** Controls expansion for child items. */
    readonly expansionManager: ListExpansion;
    /** Controls expansion for this item. */
    readonly expansion: ExpansionControl;
    /** Whether the item is expandable. It's expandable if children item exist. */
    readonly expandable: SignalLike<boolean>;
    /** Whether the item is selectable. */
    readonly selectable: SignalLike<boolean>;
    /** The level of the current item in a tree. */
    readonly level: SignalLike<number>;
    /** Whether this item is currently expanded. */
    readonly expanded: _angular_core.Signal<boolean>;
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
interface TreePattern<V> extends TreeInputs<V> {
}
/** Controls the state and interactions of a tree view. */
declare class TreePattern<V> {
    readonly inputs: TreeInputs<V>;
    /** The list behavior for the tree. */
    readonly listBehavior: List<TreeItemPattern<V>, V>;
    /** Controls expansion for direct children of the tree root (top-level items). */
    readonly expansionManager: ListExpansion;
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
    id: SignalLike<string>;
    /** Whether the tree is in navigation mode. */
    nav: SignalLike<boolean>;
    /** The aria-current type. */
    currentType: SignalLike<'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'>;
    /** All items in the tree, in document order (DFS-like, a flattened list). */
    allItems: SignalLike<TreeItemPattern<V>[]>;
    /** Whether the tree is disabled. */
    disabled: SignalLike<boolean>;
    /** The currently active item in the tree. */
    activeItem: WritableSignalLike<TreeItemPattern<V> | undefined>;
    /** Whether disabled items should be focusable. */
    softDisabled: SignalLike<boolean>;
    /** Whether the focus should wrap when navigating past the first or last item. */
    wrap: SignalLike<boolean>;
    /** The orientation of the tree. */
    orientation: SignalLike<'vertical' | 'horizontal'>;
    /** The text direction of the tree. */
    textDirection: SignalLike<'ltr' | 'rtl'>;
    /** Whether multiple items can be selected at the same time. */
    multi: SignalLike<boolean>;
    /** The selection mode of the tree. */
    selectionMode: SignalLike<'follow' | 'explicit'>;
    /** The delay in milliseconds to wait before clearing the typeahead buffer. */
    typeaheadDelay: SignalLike<number>;
    /** The current selected items of the tree. */
    values: WritableSignalLike<V[]>;
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

export { AccordionGroupPattern, AccordionPanelPattern, AccordionTriggerPattern, ComboboxDialogPattern, ComboboxListboxPattern, ComboboxPattern, ComboboxTreePattern, DeferredContent, DeferredContentAware, ListboxPattern, MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern, OptionPattern, SignalLike, TabListPattern, TabPanelPattern, TabPattern, ToolbarPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern, TreeItemPattern, TreePattern, WritableSignalLike };
export type { AccordionGroupInputs, AccordionPanelInputs, AccordionTriggerInputs, ComboboxInputs, ComboboxListboxControls, ComboboxListboxInputs, ComboboxTreeControls, ComboboxTreeInputs, ListboxInputs, MenuBarInputs, MenuInputs, MenuItemInputs, MenuTriggerInputs, OptionInputs, TabInputs, TabListInputs, TabPanelInputs, ToolbarInputs, ToolbarWidgetGroupInputs, ToolbarWidgetInputs, TreeInputs, TreeItemInputs };
