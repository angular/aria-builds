import * as i0 from '@angular/core';
import { inject, computed, ElementRef, signal, input, booleanAttribute, model, afterRenderEffect, untracked, Directive } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import * as i1 from '@angular/aria/deferred-content';
import { DeferredContentAware, DeferredContent } from '@angular/aria/deferred-content';
import { ComboboxTreePattern, TreePattern, TreeItemPattern } from '@angular/aria/private';
import { ComboboxPopup } from './combobox.mjs';
import '@angular/core/rxjs-interop';

/**
 * Sort directives by their document order.
 */
function sortDirectives(a, b) {
    return (a.element().compareDocumentPosition(b.element()) & Node.DOCUMENT_POSITION_PRECEDING) > 0
        ? 1
        : -1;
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
class Tree {
    /** A unique identifier for the tree. */
    _generatedId = inject(_IdGenerator).getId('ng-tree-');
    // TODO(wagnermaciel): https://github.com/angular/components/pull/30495#discussion_r1972601144.
    /** A unique identifier for the tree. */
    id = computed(() => this._generatedId, ...(ngDevMode ? [{ debugName: "id" }] : []));
    /** A reference to the parent combobox popup, if one exists. */
    _popup = inject(ComboboxPopup, {
        optional: true,
    });
    /** A reference to the tree element. */
    _elementRef = inject(ElementRef);
    /** All TreeItem instances within this tree. */
    _unorderedItems = signal(new Set(), ...(ngDevMode ? [{ debugName: "_unorderedItems" }] : []));
    /** Orientation of the tree. */
    orientation = input('vertical', ...(ngDevMode ? [{ debugName: "orientation" }] : []));
    /** Whether multi-selection is allowed. */
    multi = input(false, ...(ngDevMode ? [{ debugName: "multi", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether the tree is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** The selection strategy used by the tree. */
    selectionMode = input('explicit', ...(ngDevMode ? [{ debugName: "selectionMode" }] : []));
    /** The focus strategy used by the tree. */
    focusMode = input('roving', ...(ngDevMode ? [{ debugName: "focusMode" }] : []));
    /** Whether navigation wraps. */
    wrap = input(true, ...(ngDevMode ? [{ debugName: "wrap", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether to skip disabled items during navigation. */
    skipDisabled = input(true, ...(ngDevMode ? [{ debugName: "skipDisabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Typeahead delay. */
    typeaheadDelay = input(0.5, ...(ngDevMode ? [{ debugName: "typeaheadDelay" }] : []));
    /** Selected item values. */
    value = model([], ...(ngDevMode ? [{ debugName: "value" }] : []));
    /** Text direction. */
    textDirection = inject(Directionality).valueSignal;
    /** Whether the tree is in navigation mode. */
    nav = input(false, ...(ngDevMode ? [{ debugName: "nav" }] : []));
    /** The aria-current type. */
    currentType = input('page', ...(ngDevMode ? [{ debugName: "currentType" }] : []));
    /** The UI pattern for the tree. */
    _pattern;
    /** Whether the tree has received focus yet. */
    _hasFocused = signal(false, ...(ngDevMode ? [{ debugName: "_hasFocused" }] : []));
    constructor() {
        const inputs = {
            ...this,
            id: this.id,
            allItems: computed(() => [...this._unorderedItems()].sort(sortDirectives).map(item => item._pattern)),
            activeItem: signal(undefined),
            element: () => this._elementRef.nativeElement,
            combobox: () => this._popup?.combobox?._pattern,
        };
        this._pattern = this._popup?.combobox
            ? new ComboboxTreePattern(inputs)
            : new TreePattern(inputs);
        if (this._popup?.combobox) {
            this._popup?.controls?.set(this._pattern);
        }
        afterRenderEffect(() => {
            if (!this._hasFocused()) {
                this._pattern.setDefaultState();
            }
        });
        afterRenderEffect(() => {
            const items = inputs.allItems();
            const activeItem = untracked(() => inputs.activeItem());
            if (!items.some(i => i === activeItem) && activeItem) {
                this._pattern.listBehavior.unfocus();
            }
        });
        afterRenderEffect(() => {
            const items = inputs.allItems();
            const value = untracked(() => this.value());
            if (items && value.some(v => !items.some(i => i.value() === v))) {
                this.value.set(value.filter(v => items.some(i => i.value() === v)));
            }
        });
    }
    onFocus() {
        this._hasFocused.set(true);
    }
    register(child) {
        this._unorderedItems().add(child);
        this._unorderedItems.set(new Set(this._unorderedItems()));
    }
    unregister(child) {
        this._unorderedItems().delete(child);
        this._unorderedItems.set(new Set(this._unorderedItems()));
    }
    scrollActiveItemIntoView(options = { block: 'nearest' }) {
        this._pattern.inputs.activeItem()?.element().scrollIntoView(options);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Tree, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: Tree, isStandalone: true, selector: "[ngTree]", inputs: { orientation: { classPropertyName: "orientation", publicName: "orientation", isSignal: true, isRequired: false, transformFunction: null }, multi: { classPropertyName: "multi", publicName: "multi", isSignal: true, isRequired: false, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, selectionMode: { classPropertyName: "selectionMode", publicName: "selectionMode", isSignal: true, isRequired: false, transformFunction: null }, focusMode: { classPropertyName: "focusMode", publicName: "focusMode", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null }, skipDisabled: { classPropertyName: "skipDisabled", publicName: "skipDisabled", isSignal: true, isRequired: false, transformFunction: null }, typeaheadDelay: { classPropertyName: "typeaheadDelay", publicName: "typeaheadDelay", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, nav: { classPropertyName: "nav", publicName: "nav", isSignal: true, isRequired: false, transformFunction: null }, currentType: { classPropertyName: "currentType", publicName: "currentType", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange" }, host: { attributes: { "role": "tree" }, listeners: { "keydown": "_pattern.onKeydown($event)", "pointerdown": "_pattern.onPointerdown($event)", "focusin": "onFocus()" }, properties: { "attr.id": "id()", "attr.aria-orientation": "_pattern.orientation()", "attr.aria-multiselectable": "_pattern.multi()", "attr.aria-disabled": "_pattern.disabled()", "attr.aria-activedescendant": "_pattern.activedescendant()", "tabindex": "_pattern.tabindex()" }, classAttribute: "ng-tree" }, exportAs: ["ngTree"], hostDirectives: [{ directive: ComboboxPopup }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Tree, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngTree]',
                    exportAs: 'ngTree',
                    host: {
                        'class': 'ng-tree',
                        'role': 'tree',
                        '[attr.id]': 'id()',
                        '[attr.aria-orientation]': '_pattern.orientation()',
                        '[attr.aria-multiselectable]': '_pattern.multi()',
                        '[attr.aria-disabled]': '_pattern.disabled()',
                        '[attr.aria-activedescendant]': '_pattern.activedescendant()',
                        '[tabindex]': '_pattern.tabindex()',
                        '(keydown)': '_pattern.onKeydown($event)',
                        '(pointerdown)': '_pattern.onPointerdown($event)',
                        '(focusin)': 'onFocus()',
                    },
                    hostDirectives: [{ directive: ComboboxPopup }],
                }]
        }], ctorParameters: () => [] });
/**
 * A selectable and expandable Tree Item in a Tree.
 */
class TreeItem extends DeferredContentAware {
    /** A reference to the tree item element. */
    _elementRef = inject(ElementRef);
    /** A unique identifier for the tree item. */
    _id = inject(_IdGenerator).getId('ng-tree-item-');
    /** The owned tree item group. */
    _group = signal(undefined, ...(ngDevMode ? [{ debugName: "_group" }] : []));
    /** The host native element. */
    element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{ debugName: "element" }] : []));
    /** The value of the tree item. */
    value = input.required(...(ngDevMode ? [{ debugName: "value" }] : []));
    /** The parent tree root or tree item group. */
    parent = input.required(...(ngDevMode ? [{ debugName: "parent" }] : []));
    /** Whether the tree item is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled", transform: booleanAttribute }] : [{ transform: booleanAttribute }]));
    /** Whether the tree item is selectable. */
    selectable = input(true, ...(ngDevMode ? [{ debugName: "selectable" }] : []));
    /** Optional label for typeahead. Defaults to the element's textContent. */
    label = input(...(ngDevMode ? [undefined, { debugName: "label" }] : []));
    /** Search term for typeahead. */
    searchTerm = computed(() => this.label() ?? this.element().textContent, ...(ngDevMode ? [{ debugName: "searchTerm" }] : []));
    /** The tree root. */
    tree = computed(() => {
        if (this.parent() instanceof Tree) {
            return this.parent();
        }
        return this.parent().ownedBy().tree();
    }, ...(ngDevMode ? [{ debugName: "tree" }] : []));
    /** The UI pattern for this item. */
    _pattern;
    constructor() {
        super();
        this.preserveContent.set(true);
        // Connect the group's hidden state to the DeferredContentAware's visibility.
        afterRenderEffect(() => {
            this.tree()._pattern instanceof ComboboxTreePattern
                ? this.contentVisible.set(true)
                : this.contentVisible.set(this._pattern.expanded());
        });
    }
    ngOnInit() {
        this.parent().register(this);
        this.tree().register(this);
        const treePattern = computed(() => this.tree()._pattern, ...(ngDevMode ? [{ debugName: "treePattern" }] : []));
        const parentPattern = computed(() => {
            if (this.parent() instanceof Tree) {
                return treePattern();
            }
            return this.parent().ownedBy()._pattern;
        }, ...(ngDevMode ? [{ debugName: "parentPattern" }] : []));
        this._pattern = new TreeItemPattern({
            ...this,
            id: () => this._id,
            tree: treePattern,
            parent: parentPattern,
            children: computed(() => this._group()?.children() ?? []),
            hasChildren: computed(() => !!this._group()),
        });
    }
    ngOnDestroy() {
        this.parent().unregister(this);
        this.tree().unregister(this);
    }
    register(group) {
        this._group.set(group);
    }
    unregister() {
        this._group.set(undefined);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TreeItem, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: TreeItem, isStandalone: true, selector: "[ngTreeItem]", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: true, transformFunction: null }, parent: { classPropertyName: "parent", publicName: "parent", isSignal: true, isRequired: true, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, selectable: { classPropertyName: "selectable", publicName: "selectable", isSignal: true, isRequired: false, transformFunction: null }, label: { classPropertyName: "label", publicName: "label", isSignal: true, isRequired: false, transformFunction: null } }, host: { attributes: { "role": "treeitem" }, properties: { "attr.data-active": "_pattern.active()", "id": "_pattern.id()", "attr.aria-expanded": "_pattern.expandable() ? _pattern.expanded() : null", "attr.aria-selected": "_pattern.selected()", "attr.aria-current": "_pattern.current()", "attr.aria-disabled": "_pattern.disabled()", "attr.aria-level": "_pattern.level()", "attr.aria-setsize": "_pattern.setsize()", "attr.aria-posinset": "_pattern.posinset()", "attr.tabindex": "_pattern.tabindex()" }, classAttribute: "ng-treeitem" }, exportAs: ["ngTreeItem"], usesInheritance: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TreeItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngTreeItem]',
                    exportAs: 'ngTreeItem',
                    host: {
                        'class': 'ng-treeitem',
                        '[attr.data-active]': '_pattern.active()',
                        'role': 'treeitem',
                        '[id]': '_pattern.id()',
                        '[attr.aria-expanded]': '_pattern.expandable() ? _pattern.expanded() : null',
                        '[attr.aria-selected]': '_pattern.selected()',
                        '[attr.aria-current]': '_pattern.current()',
                        '[attr.aria-disabled]': '_pattern.disabled()',
                        '[attr.aria-level]': '_pattern.level()',
                        '[attr.aria-setsize]': '_pattern.setsize()',
                        '[attr.aria-posinset]': '_pattern.posinset()',
                        '[attr.tabindex]': '_pattern.tabindex()',
                    },
                }]
        }], ctorParameters: () => [] });
/**
 * Contains children tree itmes.
 */
class TreeItemGroup {
    /** The DeferredContent host directive. */
    _deferredContent = inject(DeferredContent);
    /** All groupable items that are descendants of the group. */
    _unorderedItems = signal(new Set(), ...(ngDevMode ? [{ debugName: "_unorderedItems" }] : []));
    /** Child items within this group. */
    children = computed(() => [...this._unorderedItems()].sort(sortDirectives).map(c => c._pattern), ...(ngDevMode ? [{ debugName: "children" }] : []));
    /** Tree item that owns the group. */
    ownedBy = input.required(...(ngDevMode ? [{ debugName: "ownedBy" }] : []));
    ngOnInit() {
        this._deferredContent.deferredContentAware.set(this.ownedBy());
        this.ownedBy().register(this);
    }
    ngOnDestroy() {
        this.ownedBy().unregister();
    }
    register(child) {
        this._unorderedItems().add(child);
        this._unorderedItems.set(new Set(this._unorderedItems()));
    }
    unregister(child) {
        this._unorderedItems().delete(child);
        this._unorderedItems.set(new Set(this._unorderedItems()));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TreeItemGroup, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: TreeItemGroup, isStandalone: true, selector: "ng-template[ngTreeItemGroup]", inputs: { ownedBy: { classPropertyName: "ownedBy", publicName: "ownedBy", isSignal: true, isRequired: true, transformFunction: null } }, exportAs: ["ngTreeItemGroup"], hostDirectives: [{ directive: i1.DeferredContent }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: TreeItemGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[ngTreeItemGroup]',
                    exportAs: 'ngTreeItemGroup',
                    hostDirectives: [DeferredContent],
                }]
        }] });

export { Tree, TreeItem, TreeItemGroup };
//# sourceMappingURL=tree.mjs.map
