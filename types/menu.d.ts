import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import * as _angular_core from '@angular/core';
import { Signal } from '@angular/core';
import { MenuTriggerPattern, MenuPattern, MenuItemPattern, SignalLike, MenuBarPattern } from '@angular/aria/private';

/**
 * A trigger for a menu.
 *
 * The menu trigger is used to open and close menus, and can be placed on menu items to connect
 * sub-menus.
 */
declare class MenuTrigger<V> {
    /** A reference to the menu trigger element. */
    private readonly _elementRef;
    /** A reference to the menu element. */
    readonly element: HTMLButtonElement;
    /** The submenu associated with the menu trigger. */
    submenu: _angular_core.InputSignal<Menu<V> | undefined>;
    /** A callback function triggered when a menu item is selected. */
    onSubmit: _angular_core.OutputEmitterRef<V>;
    /** The menu trigger ui pattern instance. */
    readonly _pattern: MenuTriggerPattern<V>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuTrigger<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuTrigger<any>, "button[ngMenuTrigger]", ["ngMenuTrigger"], { "submenu": { "alias": "submenu"; "required": false; "isSignal": true; }; }, { "onSubmit": "onSubmit"; }, never, never, true, never>;
}
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
declare class Menu<V> {
    /** The menu items contained in the menu. */
    readonly _allItems: Signal<readonly MenuItem<V>[]>;
    /** The menu items that are direct children of this menu. */
    readonly _items: Signal<MenuItem<V>[]>;
    /** A reference to the menu element. */
    private readonly _elementRef;
    /** A reference to the menu element. */
    readonly element: HTMLElement;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    private readonly _directionality;
    /** A signal wrapper for directionality. */
    readonly textDirection: Signal<_angular_cdk_bidi.Direction>;
    /** The submenu associated with the menu. */
    readonly submenu: _angular_core.InputSignal<Menu<V> | undefined>;
    /** The unique ID of the menu. */
    readonly id: _angular_core.InputSignal<string>;
    /** Whether the menu should wrap its items. */
    readonly wrap: _angular_core.InputSignal<boolean>;
    /** The delay in seconds before the typeahead buffer is cleared. */
    readonly typeaheadDelay: _angular_core.InputSignal<number>;
    /** A reference to the parent menu item or menu trigger. */
    readonly parent: _angular_core.InputSignal<MenuItem<V> | MenuTrigger<V> | undefined>;
    /** The menu ui pattern instance. */
    readonly _pattern: MenuPattern<V>;
    /**
     * The menu items as a writable signal.
     *
     * TODO(wagnermaciel): This would normally be a computed, but using a computed causes a bug where
     * sometimes the items array is empty. The bug can be reproduced by switching this to use a
     * computed and then quickly opening and closing menus in the dev app.
     */
    readonly items: () => MenuItemPattern<V>[];
    /** Whether the menu is visible. */
    isVisible: Signal<boolean>;
    /** A callback function triggered when a menu item is selected. */
    onSubmit: _angular_core.OutputEmitterRef<V>;
    constructor();
    /** Closes the menu. */
    close(opts?: {
        refocus?: boolean;
    }): void;
    /** Closes all parent menus. */
    closeAll(opts?: {
        refocus?: boolean;
    }): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Menu<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Menu<any>, "[ngMenu]", ["ngMenu"], { "submenu": { "alias": "submenu"; "required": false; "isSignal": true; }; "id": { "alias": "id"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "typeaheadDelay": { "alias": "typeaheadDelay"; "required": false; "isSignal": true; }; "parent": { "alias": "parent"; "required": false; "isSignal": true; }; }, { "onSubmit": "onSubmit"; }, ["_allItems"], never, true, never>;
}
/**
 * A menu bar of menu items.
 *
 * Like the menu, a menubar is used to offer a list of menu item choices to users. However, a
 * menubar is used to display a persistent, top-level,
 * always-visible set of menu item choices.
 */
declare class MenuBar<V> {
    /** The menu items contained in the menubar. */
    readonly _allItems: Signal<readonly MenuItem<V>[]>;
    readonly _items: SignalLike<MenuItem<V>[]>;
    /** A reference to the menu element. */
    private readonly _elementRef;
    /** A reference to the menubar element. */
    readonly element: HTMLElement;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    private readonly _directionality;
    /** A signal wrapper for directionality. */
    readonly textDirection: Signal<_angular_cdk_bidi.Direction>;
    /** The value of the menu. */
    readonly value: _angular_core.ModelSignal<V[]>;
    /** Whether the menu should wrap its items. */
    readonly wrap: _angular_core.InputSignal<boolean>;
    /** The delay in seconds before the typeahead buffer is cleared. */
    readonly typeaheadDelay: _angular_core.InputSignal<number>;
    /** The menu ui pattern instance. */
    readonly _pattern: MenuBarPattern<V>;
    /** The menu items as a writable signal. */
    readonly items: _angular_core.WritableSignal<MenuItemPattern<V>[]>;
    /** A callback function triggered when a menu item is selected. */
    onSubmit: _angular_core.OutputEmitterRef<V>;
    constructor();
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuBar<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuBar<any>, "[ngMenuBar]", ["ngMenuBar"], { "value": { "alias": "value"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "typeaheadDelay": { "alias": "typeaheadDelay"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; "onSubmit": "onSubmit"; }, ["_allItems"], never, true, never>;
}
/**
 * An item in a Menu.
 *
 * Menu items can be used in menus and menubars to represent a choice or action a user can take.
 */
declare class MenuItem<V> {
    /** A reference to the menu item element. */
    private readonly _elementRef;
    /** A reference to the menu element. */
    readonly element: HTMLElement;
    /** The unique ID of the menu item. */
    readonly id: _angular_core.InputSignal<string>;
    /** The value of the menu item. */
    readonly value: _angular_core.InputSignal<V>;
    /** Whether the menu item is disabled. */
    readonly disabled: _angular_core.InputSignal<boolean>;
    /** The search term associated with the menu item. */
    readonly searchTerm: _angular_core.ModelSignal<string>;
    /** A reference to the parent menu. */
    private readonly _menu;
    /** A reference to the parent menu bar. */
    private readonly _menuBar;
    /** A reference to the parent menu or menubar. */
    readonly parent: Menu<V> | MenuBar<V> | null;
    /** The submenu associated with the menu item. */
    readonly submenu: _angular_core.InputSignal<Menu<V> | undefined>;
    /** The menu item ui pattern instance. */
    readonly _pattern: MenuItemPattern<V>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuItem<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuItem<any>, "[ngMenuItem]", ["ngMenuItem"], { "id": { "alias": "id"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": true; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "searchTerm": { "alias": "searchTerm"; "required": false; "isSignal": true; }; "submenu": { "alias": "submenu"; "required": false; "isSignal": true; }; }, { "searchTerm": "searchTermChange"; }, never, never, true, never>;
}

export { Menu, MenuBar, MenuItem, MenuTrigger };
