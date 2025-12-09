import * as _angular_core from '@angular/core';
import { ListFocusItem, SignalLike, ListFocusInputs, WritableSignalLike, ListFocus, ListNavigationItem, ListNavigationInputs, ListNavigation, KeyboardEventManager, PointerEventManager } from './_list-navigation-chunk.js';

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

export { List, ListboxPattern, OptionPattern };
export type { ListInputs, ListItem, ListboxInputs, OptionInputs };
