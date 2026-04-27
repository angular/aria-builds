import { ComboboxPattern, ComboboxListboxControls, ComboboxTreeControls } from './_combobox-chunk.js';
export { ComboboxDialogPattern, ComboboxInputs } from './_combobox-chunk.js';
import { ListboxInputs, OptionPattern, ListboxPattern } from './_listbox-chunk.js';
export { OptionInputs } from './_listbox-chunk.js';
import { SignalLike, WritableSignalLike } from './_signal-like-chunk.js';
export { computed, convertGetterSetterToWritableSignalLike, linkedSignal, signal } from './_signal-like-chunk.js';
export { MenuBarInputs, MenuBarPattern, MenuInputs, MenuItemInputs, MenuItemPattern, MenuPattern, MenuTriggerInputs, MenuTriggerPattern } from './_menu-chunk.js';
export { TabInputs, TabListInputs, TabListPattern, TabPanelInputs, TabPanelPattern, TabPattern } from './_tabs-chunk.js';
export { ToolbarInputs, ToolbarPattern, ToolbarWidgetGroupInputs, ToolbarWidgetGroupPattern, ToolbarWidgetInputs, ToolbarWidgetPattern } from './_toolbar-chunk.js';
export { AccordionGroupInputs, AccordionGroupPattern, AccordionTriggerInputs, AccordionTriggerPattern } from './_accordion-chunk.js';
import { TreeInputs, TreeItemPattern, TreePattern } from './_tree-chunk.js';
export { TreeItemInputs } from './_tree-chunk.js';
export { ElementResolver, GridCellInputs, GridCellPattern, GridCellWidgetInputs, GridCellWidgetPattern, GridInputs, GridPattern, GridRowInputs, GridRowPattern, resolveElement } from './_grid-chunk.js';
export { DeferredContent, DeferredContentAware } from './_deferred-content-chunk.js';
export { HasElement, sortDirectives } from './_element-chunk.js';
import * as _angular_core from '@angular/core';
import { KeyboardEventManager } from './_keyboard-event-manager-chunk.js';
import { ClickEventManager } from './_click-event-manager-chunk.js';
import { ExpansionItem } from './_expansion-chunk.js';
export { untracked } from '@angular/core/primitives/signals';
import './_list-chunk.js';
import './_list-navigation-chunk.js';

type ComboboxListboxInputs<V> = ListboxInputs<V> & {
    /** The combobox controlling the listbox. */
    combobox: SignalLike<ComboboxPattern<OptionPattern<V>, V> | undefined>;
};
declare class ComboboxListboxPattern<V> extends ListboxPattern<V> implements ComboboxListboxControls<OptionPattern<V>, V> {
    readonly inputs: ComboboxListboxInputs<V>;
    /** A unique identifier for the popup. */
    readonly id: SignalLike<string>;
    /** The ARIA role for the listbox. */
    readonly role: SignalLike<"listbox">;
    /** The id of the active (focused) item in the listbox. */
    readonly activeId: SignalLike<string | undefined>;
    /** The list of options in the listbox. */
    readonly items: SignalLike<OptionPattern<V>[]>;
    /** The tab index for the listbox. Always -1 because the combobox handles focus. */
    tabIndex: SignalLike<-1 | 0>;
    /** Whether multiple items in the list can be selected at once. */
    multi: SignalLike<boolean>;
    constructor(inputs: ComboboxListboxInputs<V>);
    /** Noop. The combobox handles keydown events. */
    onKeydown(_: KeyboardEvent): void;
    /** Noop. The combobox handles pointerdown events. */
    onClick(_: PointerEvent): void;
    /** Noop. The combobox controls the open state. */
    setDefaultState(): void;
    /** Navigates to the specified item in the listbox. */
    readonly focus: (item: OptionPattern<V>, opts?: {
        focusElement?: boolean;
    }) => void;
    /** Navigates to the previous focusable item in the listbox. */
    readonly getActiveItem: () => OptionPattern<V> | undefined;
    /** Navigates to the next focusable item in the listbox. */
    readonly next: () => void;
    /** Navigates to the previous focusable item in the listbox. */
    readonly prev: () => void;
    /** Navigates to the last focusable item in the listbox. */
    readonly last: () => void;
    /** Navigates to the first focusable item in the listbox. */
    readonly first: () => void;
    /** Unfocuses the currently focused item in the listbox. */
    readonly unfocus: () => void;
    /** Selects the specified item in the listbox. */
    readonly select: (item?: OptionPattern<V>) => void;
    /** Toggles the selection state of the given item in the listbox. */
    readonly toggle: (item?: OptionPattern<V>) => void;
    /** Clears the selection in the listbox. */
    readonly clearSelection: () => void;
    /** Retrieves the OptionPattern associated with a pointer event. */
    readonly getItem: (e: PointerEvent) => OptionPattern<V> | undefined;
    /** Retrieves the currently selected items in the listbox. */
    readonly getSelectedItems: () => OptionPattern<V>[];
    /** Sets the value of the combobox listbox. */
    readonly setValue: (value: V | undefined) => void;
}

type ComboboxTreeInputs<V> = TreeInputs<V> & {
    /** The combobox controlling the tree. */
    combobox: SignalLike<ComboboxPattern<TreeItemPattern<V>, V> | undefined>;
};
declare class ComboboxTreePattern<V> extends TreePattern<V> implements ComboboxTreeControls<TreeItemPattern<V>, V> {
    readonly inputs: ComboboxTreeInputs<V>;
    /** Toggles to expand or collapse a tree item. */
    readonly toggleExpansion: (item?: TreeItemPattern<V>) => void;
    /** Whether the currently focused item is collapsible. */
    readonly isItemCollapsible: () => boolean;
    /** The ARIA role for the tree. */
    readonly role: () => "tree";
    readonly activeId: SignalLike<string | undefined>;
    /** Returns the currently active (focused) item in the tree. */
    readonly getActiveItem: () => TreeItemPattern<V> | undefined;
    /** The list of items in the tree. */
    items: SignalLike<TreeItemPattern<V>[]>;
    /** The tab index for the tree. Always -1 because the combobox handles focus. */
    readonly tabIndex: SignalLike<-1 | 0>;
    constructor(inputs: ComboboxTreeInputs<V>);
    /** Noop. The combobox handles keydown events. */
    onKeydown(_: KeyboardEvent): void;
    /** Noop. The combobox handles click events. */
    onClick(_: PointerEvent): void;
    /** Noop. The combobox controls the open state. */
    setDefaultState(): void;
    /** Navigates to the specified item in the tree. */
    readonly focus: (item: TreeItemPattern<V>) => void;
    /** Navigates to the next focusable item in the tree. */
    readonly next: () => void;
    /** Navigates to the previous focusable item in the tree. */
    readonly prev: () => void;
    /** Navigates to the last focusable item in the tree. */
    readonly last: () => void;
    /** Navigates to the first focusable item in the tree. */
    readonly first: () => void;
    /** Unfocuses the currently focused item in the tree. */
    readonly unfocus: () => void;
    /** Selects the specified item in the tree or the current active item if not provided. */
    readonly select: (item?: TreeItemPattern<V>) => void;
    /** Toggles the selection state of the given item in the tree or the current active item if not provided. */
    readonly toggle: (item?: TreeItemPattern<V>) => void;
    /** Clears the selection in the tree. */
    readonly clearSelection: () => void;
    /** Retrieves the TreeItemPattern associated with a pointer event. */
    readonly getItem: (e: PointerEvent) => TreeItemPattern<V> | undefined;
    /** Retrieves the currently selected items in the tree */
    readonly getSelectedItems: () => TreeItemPattern<V>[];
    /** Sets the value of the combobox tree. */
    readonly setValue: (value: V | undefined) => void;
    /** Expands the currently focused item if it is expandable, or navigates to the first child. */
    readonly expandItem: () => void;
    /** Collapses the currently focused item if it is expandable, or navigates to the parent. */
    readonly collapseItem: () => void;
    /** Whether the specified item or the currently active item is expandable. */
    isItemExpandable(item?: TreeItemPattern<V> | undefined): boolean;
    /** Expands all of the tree items. */
    readonly expandAll: () => void;
    /** Collapses all of the tree items. */
    readonly collapseAll: () => void;
    /** Whether the currently active item is selectable. */
    readonly isItemSelectable: (item?: TreeItemPattern<V> | undefined) => boolean;
}

/** Represents the required inputs for a simple combobox. */
interface SimpleComboboxInputs extends ExpansionItem {
    /** Whether the combobox should always remain expanded. */
    alwaysExpanded: SignalLike<boolean>;
    /** The value of the combobox. */
    value: WritableSignalLike<string>;
    /** The element that the combobox is attached to. */
    element: SignalLike<HTMLElement>;
    /** The popup associated with the combobox. */
    popup: SignalLike<SimpleComboboxPopupPattern | undefined>;
    /** An inline suggestion to be displayed in the input. */
    inlineSuggestion: SignalLike<string | undefined>;
    /** Whether the combobox is disabled. */
    disabled: SignalLike<boolean>;
}
/** Controls the state of a simple combobox. */
declare class SimpleComboboxPattern {
    readonly inputs: SimpleComboboxInputs;
    /** The expanded state of the combobox. */
    readonly isExpanded: _angular_core.Signal<boolean>;
    /** The value of the combobox. */
    readonly value: WritableSignalLike<string>;
    /** The element that the combobox is attached to. */
    readonly element: () => HTMLElement;
    /** Whether the combobox is disabled. */
    readonly disabled: () => boolean;
    /** An inline suggestion to be displayed in the input. */
    readonly inlineSuggestion: () => string | undefined;
    /** The ID of the active descendant in the popup. */
    readonly activeDescendant: _angular_core.Signal<string | undefined>;
    /** The ID of the popup. */
    readonly popupId: _angular_core.Signal<string | undefined>;
    /** The type of the popup. */
    readonly popupType: _angular_core.Signal<"listbox" | "tree" | "grid" | "dialog" | undefined>;
    /** The autocomplete behavior of the combobox. */
    readonly autocomplete: _angular_core.Signal<"none" | "inline" | "list" | "both">;
    /** A relay for keyboard events to the popup. */
    readonly keyboardEventRelay: _angular_core.WritableSignal<KeyboardEvent | undefined>;
    /** Whether the combobox is focused. */
    readonly isFocused: _angular_core.WritableSignal<boolean>;
    /** Whether the most recent input event was a deletion. */
    readonly isDeleting: _angular_core.WritableSignal<boolean>;
    /** Whether the combobox is editable (i.e., an input or textarea). */
    readonly isEditable: _angular_core.Signal<boolean>;
    /** The keydown event manager for the combobox. */
    keydown: _angular_core.Signal<KeyboardEventManager<KeyboardEvent>>;
    /** The click event manager for the combobox. */
    click: _angular_core.Signal<ClickEventManager<PointerEvent>>;
    constructor(inputs: SimpleComboboxInputs);
    /** Handles keydown events for the combobox. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles click events for the combobox. */
    onClick(event: PointerEvent): void;
    /** Handles focus in events for the combobox. */
    onFocusin(): void;
    /** Handles focus out events for the combobox. */
    onFocusout(event: FocusEvent): void;
    /** Handles input events for the combobox. */
    onInput(event: Event): void;
    /** Highlights the currently selected item in the combobox. */
    highlightEffect(): void;
    /** Relays keyboard events to the popup. */
    keyboardEventRelayEffect(): void;
    /** Closes the popup when focus leaves the combobox and popup. */
    closePopupOnBlurEffect(): void;
}
/** Represents the required inputs for a simple combobox popup. */
interface SimpleComboboxPopupInputs {
    /** The type of the popup. */
    popupType: SignalLike<'listbox' | 'tree' | 'grid' | 'dialog'>;
    /** The element that serves as the control target for the popup. */
    controlTarget: SignalLike<HTMLElement | undefined>;
    /** The ID of the active descendant in the popup. */
    activeDescendant: SignalLike<string | undefined>;
    /** The ID of the popup. */
    popupId: SignalLike<string | undefined>;
}
/** Controls the state of a simple combobox popup. */
declare class SimpleComboboxPopupPattern {
    readonly inputs: SimpleComboboxPopupInputs;
    /** The type of the popup. */
    readonly popupType: () => "listbox" | "tree" | "grid" | "dialog";
    /** The element that serves as the control target for the popup. */
    readonly controlTarget: () => HTMLElement | undefined;
    /** The ID of the active descendant in the popup. */
    readonly activeDescendant: () => string | undefined;
    /** The ID of the popup. */
    readonly popupId: () => string | undefined;
    /** Whether the popup is focused. */
    readonly isFocused: _angular_core.WritableSignal<boolean>;
    constructor(inputs: SimpleComboboxPopupInputs);
    /** Handles focus in events for the popup. */
    onFocusin(): void;
    /** Handles focus out events for the popup. */
    onFocusout(event: FocusEvent): void;
}

export { ComboboxListboxControls, ComboboxListboxPattern, ComboboxPattern, ComboboxTreeControls, ComboboxTreePattern, ListboxInputs, ListboxPattern, OptionPattern, SignalLike, SimpleComboboxPattern, SimpleComboboxPopupPattern, TreeInputs, TreeItemPattern, TreePattern, WritableSignalLike };
export type { ComboboxListboxInputs, ComboboxTreeInputs, SimpleComboboxInputs, SimpleComboboxPopupInputs };
