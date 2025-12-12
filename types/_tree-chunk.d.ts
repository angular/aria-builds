import { SignalLike, WritableSignalLike } from './_list-navigation-chunk.js';
import { ListItem, ListInputs, List } from './_list-chunk.js';
import { ExpansionItem, ListExpansion } from './_expansion-chunk.js';
import { KeyboardEventManager } from './_keyboard-event-manager-chunk.js';
import { PointerEventManager } from './_pointer-event-manager-chunk.js';

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
    readonly index: SignalLike<number>;
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
    readonly setsize: SignalLike<number>;
    /** The position of this item among its siblings (1-based). */
    readonly posinset: SignalLike<number>;
    /** Whether the item is active. */
    readonly active: SignalLike<boolean>;
    /** The tab index of the item. */
    readonly tabIndex: SignalLike<0 | -1>;
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
    readonly activeDescendant: SignalLike<string | undefined>;
    /** The direct children of the root (top-level tree items). */
    readonly children: SignalLike<TreeItemPattern<V>[]>;
    /** All currently visible tree items. An item is visible if their parent is expanded. */
    readonly visibleItems: SignalLike<TreeItemPattern<V>[]>;
    /** Whether the tree selection follows focus. */
    readonly followFocus: SignalLike<boolean>;
    /** Whether the tree direction is RTL. */
    readonly isRtl: SignalLike<boolean>;
    /** The key for navigating to the previous item. */
    readonly prevKey: SignalLike<"ArrowUp" | "ArrowRight" | "ArrowLeft">;
    /** The key for navigating to the next item. */
    readonly nextKey: SignalLike<"ArrowRight" | "ArrowLeft" | "ArrowDown">;
    /** The key for collapsing an item or moving to its parent. */
    readonly collapseKey: SignalLike<"ArrowUp" | "ArrowRight" | "ArrowLeft">;
    /** The key for expanding an item or moving to its first child. */
    readonly expandKey: SignalLike<"ArrowRight" | "ArrowLeft" | "ArrowDown">;
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    readonly dynamicSpaceKey: SignalLike<"" | " ">;
    /** Regular expression to match characters for typeahead. */
    readonly typeaheadRegexp: RegExp;
    /** The keydown event manager for the tree. */
    readonly keydown: SignalLike<KeyboardEventManager<KeyboardEvent>>;
    /** The pointerdown event manager for the tree. */
    pointerdown: SignalLike<PointerEventManager<PointerEvent>>;
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

export { TreeItemPattern, TreePattern };
export type { TreeInputs, TreeItemInputs };
