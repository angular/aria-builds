import { EventManager, EventHandlerOptions, ModifierInputs, EventHandler, KeyboardEventManager } from './_keyboard-event-manager-chunk.js';
import { SignalLike, WritableSignalLike } from './_signal-like-chunk.js';
import { ListItem } from './_list-chunk.js';

/**
 * The different mouse buttons that may appear on a pointer event.
 */
declare enum MouseButton {
    Main = 0,
    Auxiliary = 1,
    Secondary = 2
}
/** An event manager that is specialized for handling pointer events. */
declare class PointerEventManager<T extends PointerEvent> extends EventManager<T> {
    readonly options: EventHandlerOptions;
    /**
     * Configures this event manager to handle events with a specific modifer and mouse button
     * combination.
     */
    on(button: MouseButton, modifiers: ModifierInputs, handler: EventHandler<T>): this;
    /**
     * Configures this event manager to handle events with a specific mouse button and no modifiers.
     */
    on(modifiers: ModifierInputs, handler: EventHandler<T>): this;
    /**
     * Configures this event manager to handle events with the main mouse button and no modifiers.
     *
     * @param handler The handler function
     * @param options Options for whether to stop propagation or prevent default.
     */
    on(handler: EventHandler<T>): this;
    private _normalizeInputs;
    _isMatch(event: PointerEvent, button: MouseButton, modifiers: ModifierInputs): boolean;
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
    readonly id: () => string;
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
    readonly expanded: WritableSignalLike<boolean>;
    /** Whether the combobox is disabled. */
    readonly disabled: () => boolean;
    /** The ID of the active item in the combobox. */
    readonly activeDescendant: SignalLike<string | null>;
    /** The currently highlighted item in the combobox. */
    readonly highlightedItem: WritableSignalLike<T | undefined>;
    /** Whether the most recent input event was a deletion. */
    private _isDeleting;
    /** Whether the combobox is focused. */
    readonly isFocused: WritableSignalLike<boolean>;
    /** Whether the combobox has ever been focused. */
    readonly hasBeenInteracted: WritableSignalLike<boolean>;
    /** The key used to navigate to the previous item in the list. */
    readonly expandKey: SignalLike<"ArrowLeft" | "ArrowRight">;
    /** The key used to navigate to the next item in the list. */
    readonly collapseKey: SignalLike<"ArrowLeft" | "ArrowRight">;
    /** The ID of the popup associated with the combobox. */
    readonly popupId: SignalLike<string | null>;
    /** The autocomplete behavior of the combobox. */
    readonly autocomplete: SignalLike<"both" | "list">;
    /** The ARIA role of the popup associated with the combobox. */
    readonly hasPopup: SignalLike<"listbox" | "tree" | "grid" | "dialog" | null>;
    /** Whether the combobox is read-only. */
    readonly readonly: SignalLike<true | null>;
    /** Returns the listbox controls for the combobox. */
    readonly listControls: () => ComboboxListboxControls<T, V> | null | undefined;
    /** Returns the tree controls for the combobox. */
    readonly treeControls: () => ComboboxTreeControls<T, V> | null;
    /** The keydown event manager for the combobox. */
    readonly keydown: SignalLike<KeyboardEventManager<KeyboardEvent>>;
    /** The click event manager for the combobox. */
    readonly click: SignalLike<PointerEventManager<PointerEvent>>;
    constructor(inputs: ComboboxInputs<T, V>);
    /** Handles keydown events for the combobox. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles click events for the combobox. */
    onClick(event: MouseEvent): void;
    /** Handles input events for the combobox. */
    onInput(event: Event): void;
    /** Handles focus in events for the combobox. */
    onFocusIn(): void;
    /** Handles focus out events for the combobox. */
    onFocusOut(event: FocusEvent): void;
    /** The first matching item in the combobox. */
    readonly firstMatch: SignalLike<T | undefined>;
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
    readonly id: () => string;
    readonly role: () => "dialog";
    readonly keydown: SignalLike<KeyboardEventManager<KeyboardEvent>>;
    constructor(inputs: {
        combobox: ComboboxPattern<any, any>;
        element: SignalLike<HTMLDialogElement>;
        id: SignalLike<string>;
    });
    onKeydown(event: KeyboardEvent): void;
    onClick(event: MouseEvent): void;
}

export { ComboboxDialogPattern, ComboboxPattern };
export type { ComboboxInputs, ComboboxListboxControls, ComboboxTreeControls };
