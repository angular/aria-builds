import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import * as _angular_core from '@angular/core';
import { Signal, OnInit, OnDestroy } from '@angular/core';
import * as i1 from '@angular/aria/private';
import { TreePattern, DeferredContentAware, TreeItemPattern } from '@angular/aria/private';
import { ComboboxPopup } from './combobox.js';

interface HasElement {
    element: Signal<HTMLElement>;
}
/**
 * A Tree container.
 *
 * Transforms nested lists into an accessible, ARIA-compliant tree structure.
 *
 * ```html
 * <ul ngTree [(value)]="selectedItems" [multi]="true">
 *   <li ngTreeItem [value]="'leaf1'">Leaf Item 1</li>
 *   <li ngTreeItem [value]="'parent1'">
 *     Parent Item 1
 *     <ul ngTreeItemGroup [value]="'parent1'">
 *       <ng-template ngTreeItemGroupContent>
 *         <li ngTreeItem [value]="'child1.1'">Child Item 1.1</li>
 *         <li ngTreeItem [value]="'child1.2'">Child Item 1.2</li>
 *       </ng-template>
 *     </ul>
 *   </li>
 *   <li ngTreeItem [value]="'leaf2'" [disabled]="true">Disabled Leaf Item 2</li>
 * </ul>
 * ```
 */
declare class Tree<V> {
    /** A unique identifier for the tree. */
    private readonly _generatedId;
    /** A unique identifier for the tree. */
    protected id: Signal<string>;
    /** A reference to the parent combobox popup, if one exists. */
    private readonly _popup;
    /** A reference to the tree element. */
    private readonly _elementRef;
    /** All TreeItem instances within this tree. */
    private readonly _unorderedItems;
    /** Orientation of the tree. */
    readonly orientation: _angular_core.InputSignal<"vertical" | "horizontal">;
    /** Whether multi-selection is allowed. */
    readonly multi: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the tree is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The selection strategy used by the tree. */
    readonly selectionMode: _angular_core.InputSignal<"explicit" | "follow">;
    /** The focus strategy used by the tree. */
    readonly focusMode: _angular_core.InputSignal<"roving" | "activedescendant">;
    /** Whether navigation wraps. */
    readonly wrap: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether to skip disabled items during navigation. */
    readonly skipDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Typeahead delay. */
    readonly typeaheadDelay: _angular_core.InputSignal<number>;
    /** Selected item values. */
    readonly value: _angular_core.ModelSignal<V[]>;
    /** Text direction. */
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
    /** Whether the tree is in navigation mode. */
    readonly nav: _angular_core.InputSignal<boolean>;
    /** The aria-current type. */
    readonly currentType: _angular_core.InputSignal<"page" | "step" | "location" | "date" | "time" | "true" | "false">;
    /** The UI pattern for the tree. */
    readonly _pattern: TreePattern<V>;
    /** Whether the tree has received focus yet. */
    private _hasFocused;
    constructor();
    onFocus(): void;
    register(child: TreeItem<V>): void;
    unregister(child: TreeItem<V>): void;
    scrollActiveItemIntoView(options?: ScrollIntoViewOptions): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Tree<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Tree<any>, "[ngTree]", ["ngTree"], { "orientation": { "alias": "orientation"; "required": false; "isSignal": true; }; "multi": { "alias": "multi"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "selectionMode": { "alias": "selectionMode"; "required": false; "isSignal": true; }; "focusMode": { "alias": "focusMode"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "skipDisabled": { "alias": "skipDisabled"; "required": false; "isSignal": true; }; "typeaheadDelay": { "alias": "typeaheadDelay"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": false; "isSignal": true; }; "nav": { "alias": "nav"; "required": false; "isSignal": true; }; "currentType": { "alias": "currentType"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; }, never, never, true, [{ directive: typeof ComboboxPopup; inputs: {}; outputs: {}; }]>;
}
/**
 * A selectable and expandable Tree Item in a Tree.
 */
declare class TreeItem<V> extends DeferredContentAware implements OnInit, OnDestroy, HasElement {
    /** A reference to the tree item element. */
    private readonly _elementRef;
    /** A unique identifier for the tree item. */
    private readonly _id;
    /** The owned tree item group. */
    private readonly _group;
    /** The host native element. */
    readonly element: Signal<any>;
    /** The value of the tree item. */
    readonly value: _angular_core.InputSignal<V>;
    /** The parent tree root or tree item group. */
    readonly parent: _angular_core.InputSignal<TreeItemGroup<V> | Tree<V>>;
    /** Whether the tree item is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the tree item is selectable. */
    readonly selectable: _angular_core.InputSignal<boolean>;
    /** Optional label for typeahead. Defaults to the element's textContent. */
    readonly label: _angular_core.InputSignal<string | undefined>;
    /** Search term for typeahead. */
    readonly searchTerm: Signal<any>;
    /** The tree root. */
    readonly tree: Signal<Tree<V>>;
    /** The UI pattern for this item. */
    _pattern: TreeItemPattern<V>;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    register(group: TreeItemGroup<V>): void;
    unregister(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<TreeItem<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<TreeItem<any>, "[ngTreeItem]", ["ngTreeItem"], { "value": { "alias": "value"; "required": true; "isSignal": true; }; "parent": { "alias": "parent"; "required": true; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "selectable": { "alias": "selectable"; "required": false; "isSignal": true; }; "label": { "alias": "label"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
/**
 * Contains children tree itmes.
 */
declare class TreeItemGroup<V> implements OnInit, OnDestroy {
    /** The DeferredContent host directive. */
    private readonly _deferredContent;
    /** All groupable items that are descendants of the group. */
    private readonly _unorderedItems;
    /** Child items within this group. */
    readonly children: Signal<TreeItemPattern<V>[]>;
    /** Tree item that owns the group. */
    readonly ownedBy: _angular_core.InputSignal<TreeItem<V>>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    register(child: TreeItem<V>): void;
    unregister(child: TreeItem<V>): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<TreeItemGroup<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<TreeItemGroup<any>, "ng-template[ngTreeItemGroup]", ["ngTreeItemGroup"], { "ownedBy": { "alias": "ownedBy"; "required": true; "isSignal": true; }; }, {}, never, never, true, [{ directive: typeof i1.DeferredContent; inputs: {}; outputs: {}; }]>;
}

export { Tree, TreeItem, TreeItemGroup };
