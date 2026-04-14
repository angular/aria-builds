import { ComboboxPattern, ComboboxListboxControls, ComboboxTreeControls } from './_combobox-chunk.js';
export { ComboboxDialogPattern, ComboboxInputs } from './_combobox-chunk.js';
import { ListboxInputs, OptionPattern, ListboxPattern } from './_listbox-chunk.js';
export { OptionInputs } from './_listbox-chunk.js';
import { SignalLike } from './_signal-like-chunk.js';
export { WritableSignalLike, computed, convertGetterSetterToWritableSignalLike, linkedSignal, signal } from './_signal-like-chunk.js';
export { MenuBarInputs, MenuBarPattern, MenuInputs, MenuItemInputs, MenuItemPattern, MenuPattern, MenuTriggerInputs, MenuTriggerPattern } from './_menu-chunk.js';
export { TabInputs, TabListInputs, TabListPattern, TabPanelInputs, TabPanelPattern, TabPattern } from './_tabs-chunk.js';
export { ToolbarInputs, ToolbarPattern, ToolbarWidgetGroupInputs, ToolbarWidgetGroupPattern, ToolbarWidgetInputs, ToolbarWidgetPattern } from './_toolbar-chunk.js';
export { AccordionGroupInputs, AccordionGroupPattern, AccordionTriggerInputs, AccordionTriggerPattern } from './_accordion-chunk.js';
import { TreeInputs, TreeItemPattern, TreePattern } from './_tree-chunk.js';
export { TreeItemInputs } from './_tree-chunk.js';
export { GridCellInputs, GridCellPattern, GridCellWidgetInputs, GridCellWidgetPattern, GridInputs, GridPattern, GridRowInputs, GridRowPattern } from './_grid-chunk.js';
export { DeferredContent, DeferredContentAware } from './_deferred-content-chunk.js';
export { untracked } from '@angular/core/primitives/signals';
import './_keyboard-event-manager-chunk.js';
import './_pointer-event-manager-chunk.js';
import './_list-chunk.js';
import './_list-navigation-chunk.js';
import './_click-event-manager-chunk.js';
import './_expansion-chunk.js';
import '@angular/core';

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

export { ComboboxListboxControls, ComboboxListboxPattern, ComboboxPattern, ComboboxTreeControls, ComboboxTreePattern, ListboxInputs, ListboxPattern, OptionPattern, SignalLike, TreeInputs, TreeItemPattern, TreePattern };
export type { ComboboxListboxInputs, ComboboxTreeInputs };
