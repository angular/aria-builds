import * as i0 from '@angular/core';
import { inject, ElementRef, input, output, computed, Directive, contentChildren, signal, afterRenderEffect, untracked, model } from '@angular/core';
import { MenuTriggerPattern, MenuPattern, MenuBarPattern, MenuItemPattern } from '@angular/aria/private';
import { _IdGenerator } from '@angular/cdk/a11y';
import { toSignal } from '@angular/core/rxjs-interop';
import { Directionality } from '@angular/cdk/bidi';

/**
 * A trigger for a menu.
 *
 * The menu trigger is used to open and close menus, and can be placed on menu items to connect
 * sub-menus.
 */
class MenuTrigger {
    /** A reference to the menu trigger element. */
    _elementRef = inject(ElementRef);
    /** A reference to the menu element. */
    element = this._elementRef.nativeElement;
    // TODO(wagnermaciel): See we can remove the need to pass in a submenu.
    /** The submenu associated with the menu trigger. */
    submenu = input(undefined, ...(ngDevMode ? [{ debugName: "submenu" }] : []));
    /** A callback function triggered when a menu item is selected. */
    onSubmit = output();
    /** The menu trigger ui pattern instance. */
    _pattern = new MenuTriggerPattern({
        onSubmit: (value) => this.onSubmit.emit(value),
        element: computed(() => this._elementRef.nativeElement),
        submenu: computed(() => this.submenu()?._pattern),
    });
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MenuTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: MenuTrigger, isStandalone: true, selector: "button[ngMenuTrigger]", inputs: { submenu: { classPropertyName: "submenu", publicName: "submenu", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { onSubmit: "onSubmit" }, host: { listeners: { "click": "_pattern.onClick()", "keydown": "_pattern.onKeydown($event)", "focusout": "_pattern.onFocusOut($event)" }, properties: { "attr.tabindex": "_pattern.tabindex()", "attr.aria-haspopup": "_pattern.hasPopup()", "attr.aria-expanded": "_pattern.expanded()", "attr.aria-controls": "_pattern.submenu()?.id()" }, classAttribute: "ng-menu-trigger" }, exportAs: ["ngMenuTrigger"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MenuTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[ngMenuTrigger]',
                    exportAs: 'ngMenuTrigger',
                    host: {
                        'class': 'ng-menu-trigger',
                        '[attr.tabindex]': '_pattern.tabindex()',
                        '[attr.aria-haspopup]': '_pattern.hasPopup()',
                        '[attr.aria-expanded]': '_pattern.expanded()',
                        '[attr.aria-controls]': '_pattern.submenu()?.id()',
                        '(click)': '_pattern.onClick()',
                        '(keydown)': '_pattern.onKeydown($event)',
                        '(focusout)': '_pattern.onFocusOut($event)',
                    },
                }]
        }] });
/**
 * A list of menu items.
 *
 * A menu is used to offer a list of menu item choices to users. Menus can be nested within other
 * menus to create sub-menus.
 *
 * ```html
 * <button ngMenuTrigger menu="menu">Options</button>
 *
 * <div ngMenu #menu="ngMenu">
 *   <div ngMenuItem>Star</div>
 *   <div ngMenuItem>Edit</div>
 *   <div ngMenuItem>Delete</div>
 * </div>
 * ```
 */
class Menu {
    /** The menu items contained in the menu. */
    _allItems = contentChildren(MenuItem, ...(ngDevMode ? [{ debugName: "_allItems", descendants: true }] : [{ descendants: true }]));
    /** The menu items that are direct children of this menu. */
    _items = computed(() => this._allItems().filter(i => i.parent === this), ...(ngDevMode ? [{ debugName: "_items" }] : []));
    /** A reference to the menu element. */
    _elementRef = inject(ElementRef);
    /** A reference to the menu element. */
    element = this._elementRef.nativeElement;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    _directionality = inject(Directionality);
    /** A signal wrapper for directionality. */
    textDirection = toSignal(this._directionality.change, {
        initialValue: this._directionality.value,
    });
    /** The submenu associated with the menu. */
    submenu = input(undefined, ...(ngDevMode ? [{ debugName: "submenu" }] : []));
    /** The unique ID of the menu. */
    id = input(inject(_IdGenerator).getId('ng-menu-', true), ...(ngDevMode ? [{ debugName: "id" }] : []));
    /** Whether the menu should wrap its items. */
    wrap = input(true, ...(ngDevMode ? [{ debugName: "wrap" }] : []));
    /** The delay in seconds before the typeahead buffer is cleared. */
    typeaheadDelay = input(0.5, ...(ngDevMode ? [{ debugName: "typeaheadDelay" }] : [])); // Picked arbitrarily.
    /** A reference to the parent menu item or menu trigger. */
    parent = input(...(ngDevMode ? [undefined, { debugName: "parent" }] : []));
    /** The menu ui pattern instance. */
    _pattern;
    /**
     * The menu items as a writable signal.
     *
     * TODO(wagnermaciel): This would normally be a computed, but using a computed causes a bug where
     * sometimes the items array is empty. The bug can be reproduced by switching this to use a
     * computed and then quickly opening and closing menus in the dev app.
     */
    items = () => this._items().map(i => i._pattern);
    /** Whether the menu is visible. */
    isVisible = computed(() => this._pattern.isVisible(), ...(ngDevMode ? [{ debugName: "isVisible" }] : []));
    /** A callback function triggered when a menu item is selected. */
    onSubmit = output();
    constructor() {
        this._pattern = new MenuPattern({
            ...this,
            parent: computed(() => this.parent()?._pattern),
            multi: () => false,
            skipDisabled: () => false,
            focusMode: () => 'roving',
            orientation: () => 'vertical',
            selectionMode: () => 'explicit',
            activeItem: signal(undefined),
            element: computed(() => this._elementRef.nativeElement),
            onSubmit: (value) => this.onSubmit.emit(value),
        });
        // TODO(wagnermaciel): This is a redundancy needed for if the user uses display: none to hide
        // submenus. In those cases, the ui pattern is calling focus() before the ui has a chance to
        // update the display property. The result is focus() being called on an element that is not
        // focusable. This simply retries focusing the element after render.
        afterRenderEffect(() => {
            if (this._pattern.isVisible()) {
                const activeItem = untracked(() => this._pattern.inputs.activeItem());
                this._pattern.listBehavior.goto(activeItem);
            }
        });
        afterRenderEffect(() => {
            if (!this._pattern.hasBeenFocused()) {
                this._pattern.setDefaultState();
            }
        });
    }
    // TODO(wagnermaciel): Author close, closeAll, and open methods for each directive.
    /** Closes the menu. */
    close(opts) {
        this._pattern.inputs.parent()?.close(opts);
    }
    /** Closes all parent menus. */
    closeAll(opts) {
        const root = this._pattern.root();
        if (root instanceof MenuTriggerPattern) {
            root.close(opts);
        }
        if (root instanceof MenuPattern || root instanceof MenuBarPattern) {
            root.inputs.activeItem()?.close(opts);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Menu, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.2.0", version: "20.2.0-next.2", type: Menu, isStandalone: true, selector: "[ngMenu]", inputs: { submenu: { classPropertyName: "submenu", publicName: "submenu", isSignal: true, isRequired: false, transformFunction: null }, id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null }, typeaheadDelay: { classPropertyName: "typeaheadDelay", publicName: "typeaheadDelay", isSignal: true, isRequired: false, transformFunction: null }, parent: { classPropertyName: "parent", publicName: "parent", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { onSubmit: "onSubmit" }, host: { attributes: { "role": "menu" }, listeners: { "keydown": "_pattern.onKeydown($event)", "mouseover": "_pattern.onMouseOver($event)", "mouseout": "_pattern.onMouseOut($event)", "focusout": "_pattern.onFocusOut($event)", "focusin": "_pattern.onFocusIn()", "click": "_pattern.onClick($event)" }, properties: { "attr.id": "_pattern.id()", "attr.data-visible": "_pattern.isVisible()" }, classAttribute: "ng-menu" }, queries: [{ propertyName: "_allItems", predicate: MenuItem, descendants: true, isSignal: true }], exportAs: ["ngMenu"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: Menu, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngMenu]',
                    exportAs: 'ngMenu',
                    host: {
                        'role': 'menu',
                        'class': 'ng-menu',
                        '[attr.id]': '_pattern.id()',
                        '[attr.data-visible]': '_pattern.isVisible()',
                        '(keydown)': '_pattern.onKeydown($event)',
                        '(mouseover)': '_pattern.onMouseOver($event)',
                        '(mouseout)': '_pattern.onMouseOut($event)',
                        '(focusout)': '_pattern.onFocusOut($event)',
                        '(focusin)': '_pattern.onFocusIn()',
                        '(click)': '_pattern.onClick($event)',
                    },
                }]
        }], ctorParameters: () => [] });
/**
 * A menu bar of menu items.
 *
 * Like the menu, a menubar is used to offer a list of menu item choices to users. However, a
 * menubar is used to display a persistent, top-level,
 * always-visible set of menu item choices.
 */
class MenuBar {
    /** The menu items contained in the menubar. */
    _allItems = contentChildren(MenuItem, ...(ngDevMode ? [{ debugName: "_allItems", descendants: true }] : [{ descendants: true }]));
    _items = () => this._allItems().filter(i => i.parent === this);
    /** A reference to the menu element. */
    _elementRef = inject(ElementRef);
    /** A reference to the menubar element. */
    element = this._elementRef.nativeElement;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    _directionality = inject(Directionality);
    /** A signal wrapper for directionality. */
    textDirection = toSignal(this._directionality.change, {
        initialValue: this._directionality.value,
    });
    /** The value of the menu. */
    value = model([], ...(ngDevMode ? [{ debugName: "value" }] : []));
    /** Whether the menu should wrap its items. */
    wrap = input(true, ...(ngDevMode ? [{ debugName: "wrap" }] : []));
    /** The delay in seconds before the typeahead buffer is cleared. */
    typeaheadDelay = input(0.5, ...(ngDevMode ? [{ debugName: "typeaheadDelay" }] : []));
    /** The menu ui pattern instance. */
    _pattern;
    /** The menu items as a writable signal. */
    items = signal([], ...(ngDevMode ? [{ debugName: "items" }] : []));
    /** A callback function triggered when a menu item is selected. */
    onSubmit = output();
    constructor() {
        this._pattern = new MenuBarPattern({
            ...this,
            multi: () => false,
            skipDisabled: () => false,
            focusMode: () => 'roving',
            orientation: () => 'horizontal',
            selectionMode: () => 'explicit',
            onSubmit: (value) => this.onSubmit.emit(value),
            activeItem: signal(undefined),
            element: computed(() => this._elementRef.nativeElement),
        });
        afterRenderEffect(() => {
            this.items.set(this._items().map(i => i._pattern));
        });
        afterRenderEffect(() => {
            if (!this._pattern.hasBeenFocused()) {
                this._pattern.setDefaultState();
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MenuBar, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.2.0", version: "20.2.0-next.2", type: MenuBar, isStandalone: true, selector: "[ngMenuBar]", inputs: { value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: false, transformFunction: null }, wrap: { classPropertyName: "wrap", publicName: "wrap", isSignal: true, isRequired: false, transformFunction: null }, typeaheadDelay: { classPropertyName: "typeaheadDelay", publicName: "typeaheadDelay", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { value: "valueChange", onSubmit: "onSubmit" }, host: { attributes: { "role": "menubar" }, listeners: { "keydown": "_pattern.onKeydown($event)", "mouseover": "_pattern.onMouseOver($event)", "click": "_pattern.onClick($event)", "focusin": "_pattern.onFocusIn()", "focusout": "_pattern.onFocusOut($event)" }, classAttribute: "ng-menu-bar" }, queries: [{ propertyName: "_allItems", predicate: MenuItem, descendants: true, isSignal: true }], exportAs: ["ngMenuBar"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MenuBar, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngMenuBar]',
                    exportAs: 'ngMenuBar',
                    host: {
                        'role': 'menubar',
                        'class': 'ng-menu-bar',
                        '(keydown)': '_pattern.onKeydown($event)',
                        '(mouseover)': '_pattern.onMouseOver($event)',
                        '(click)': '_pattern.onClick($event)',
                        '(focusin)': '_pattern.onFocusIn()',
                        '(focusout)': '_pattern.onFocusOut($event)',
                    },
                }]
        }], ctorParameters: () => [] });
/**
 * An item in a Menu.
 *
 * Menu items can be used in menus and menubars to represent a choice or action a user can take.
 */
class MenuItem {
    /** A reference to the menu item element. */
    _elementRef = inject(ElementRef);
    /** A reference to the menu element. */
    element = this._elementRef.nativeElement;
    /** The unique ID of the menu item. */
    id = input(inject(_IdGenerator).getId('ng-menu-item-', true), ...(ngDevMode ? [{ debugName: "id" }] : []));
    /** The value of the menu item. */
    value = input.required(...(ngDevMode ? [{ debugName: "value" }] : []));
    /** Whether the menu item is disabled. */
    disabled = input(false, ...(ngDevMode ? [{ debugName: "disabled" }] : []));
    // TODO(wagnermaciel): Discuss whether all inputs should be models.
    /** The search term associated with the menu item. */
    searchTerm = model('', ...(ngDevMode ? [{ debugName: "searchTerm" }] : []));
    /** A reference to the parent menu. */
    _menu = inject(Menu, { optional: true });
    /** A reference to the parent menu bar. */
    _menuBar = inject(MenuBar, { optional: true });
    /** A reference to the parent menu or menubar. */
    parent = this._menu ?? this._menuBar;
    /** The submenu associated with the menu item. */
    submenu = input(undefined, ...(ngDevMode ? [{ debugName: "submenu" }] : []));
    /** The menu item ui pattern instance. */
    _pattern = new MenuItemPattern({
        id: this.id,
        value: this.value,
        element: computed(() => this._elementRef.nativeElement),
        disabled: this.disabled,
        searchTerm: this.searchTerm,
        parent: computed(() => this.parent?._pattern),
        submenu: computed(() => this.submenu()?._pattern),
    });
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MenuItem, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "20.2.0-next.2", type: MenuItem, isStandalone: true, selector: "[ngMenuItem]", inputs: { id: { classPropertyName: "id", publicName: "id", isSignal: true, isRequired: false, transformFunction: null }, value: { classPropertyName: "value", publicName: "value", isSignal: true, isRequired: true, transformFunction: null }, disabled: { classPropertyName: "disabled", publicName: "disabled", isSignal: true, isRequired: false, transformFunction: null }, searchTerm: { classPropertyName: "searchTerm", publicName: "searchTerm", isSignal: true, isRequired: false, transformFunction: null }, submenu: { classPropertyName: "submenu", publicName: "submenu", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { searchTerm: "searchTermChange" }, host: { attributes: { "role": "menuitem" }, properties: { "attr.tabindex": "_pattern.tabindex()", "attr.data-active": "_pattern.isActive()", "attr.aria-haspopup": "_pattern.hasPopup()", "attr.aria-expanded": "_pattern.expanded()", "attr.aria-disabled": "_pattern.disabled()", "attr.aria-controls": "_pattern.submenu()?.id()" }, classAttribute: "ng-menu-item" }, exportAs: ["ngMenuItem"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MenuItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngMenuItem]',
                    exportAs: 'ngMenuItem',
                    host: {
                        'role': 'menuitem',
                        'class': 'ng-menu-item',
                        '[attr.tabindex]': '_pattern.tabindex()',
                        '[attr.data-active]': '_pattern.isActive()',
                        '[attr.aria-haspopup]': '_pattern.hasPopup()',
                        '[attr.aria-expanded]': '_pattern.expanded()',
                        '[attr.aria-disabled]': '_pattern.disabled()',
                        '[attr.aria-controls]': '_pattern.submenu()?.id()',
                    },
                }]
        }] });

export { Menu, MenuBar, MenuItem, MenuTrigger };
//# sourceMappingURL=menu.mjs.map
