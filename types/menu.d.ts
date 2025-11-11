import * as _angular_core from '@angular/core';
import { Signal } from '@angular/core';
import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import * as i1 from '@angular/aria/private';
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
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
    /** A reference to the menu element. */
    readonly element: HTMLButtonElement;
    /** The menu associated with the trigger. */
    menu: _angular_core.InputSignal<Menu<V> | undefined>;
    /** Whether the menu is expanded. */
    readonly expanded: Signal<boolean>;
    /** Whether the menu trigger has a popup. */
    readonly hasPopup: Signal<boolean>;
    /** The menu trigger ui pattern instance. */
    _pattern: MenuTriggerPattern<V>;
    constructor();
    /** Opens the menu focusing on the first menu item. */
    open(): void;
    /** Closes the menu. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuTrigger<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuTrigger<any>, "button[ngMenuTrigger]", ["ngMenuTrigger"], { "menu": { "alias": "menu"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
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
    /** The DeferredContentAware host directive. */
    private readonly _deferredContentAware;
    /** The menu items contained in the menu. */
    readonly _allItems: Signal<readonly MenuItem<V>[]>;
    /** The menu items that are direct children of this menu. */
    readonly _items: Signal<MenuItem<V>[]>;
    /** A reference to the menu element. */
    private readonly _elementRef;
    /** A reference to the menu element. */
    readonly element: HTMLElement;
    /** The directionality (LTR / RTL) context for the application (or a subtree of it). */
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
    /** The unique ID of the menu. */
    readonly id: _angular_core.InputSignal<string>;
    /** Whether the menu should wrap its items. */
    readonly wrap: _angular_core.InputSignal<boolean>;
    /** The delay in seconds before the typeahead buffer is cleared. */
    readonly typeaheadDelay: _angular_core.InputSignal<number>;
    /** A reference to the parent menu item or menu trigger. */
    readonly parent: _angular_core.WritableSignal<MenuTrigger<V> | MenuItem<V> | undefined>;
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
    readonly isVisible: Signal<boolean>;
    /** A callback function triggered when a menu item is selected. */
    onSelect: _angular_core.OutputEmitterRef<V>;
    /** The delay in milliseconds before expanding sub-menus on hover. */
    readonly expansionDelay: _angular_core.InputSignal<number>;
    constructor();
    /** Closes the menu. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Menu<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Menu<any>, "[ngMenu]", ["ngMenu"], { "id": { "alias": "id"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "typeaheadDelay": { "alias": "typeaheadDelay"; "required": false; "isSignal": true; }; "expansionDelay": { "alias": "expansionDelay"; "required": false; "isSignal": true; }; }, { "onSelect": "onSelect"; }, ["_allItems"], never, true, [{ directive: typeof i1.DeferredContentAware; inputs: { "preserveContent": "preserveContent"; }; outputs: {}; }]>;
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
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
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
    onSelect: _angular_core.OutputEmitterRef<V>;
    constructor();
    /** Closes the menubar. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuBar<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuBar<any>, "[ngMenuBar]", ["ngMenuBar"], { "value": { "alias": "value"; "required": false; "isSignal": true; }; "wrap": { "alias": "wrap"; "required": false; "isSignal": true; }; "typeaheadDelay": { "alias": "typeaheadDelay"; "required": false; "isSignal": true; }; }, { "value": "valueChange"; "onSelect": "onSelect"; }, ["_allItems"], never, true, never>;
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
    /** Whether the menu item is active. */
    readonly isActive: Signal<boolean>;
    /** Whether the menu is expanded. */
    readonly expanded: Signal<boolean | null>;
    /** Whether the menu item has a popup. */
    readonly hasPopup: Signal<boolean>;
    /** The menu item ui pattern instance. */
    readonly _pattern: MenuItemPattern<V>;
    constructor();
    /** Opens the submenu focusing on the first menu item. */
    open(): void;
    /** Closes the submenu. */
    close(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuItem<any>, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuItem<any>, "[ngMenuItem]", ["ngMenuItem"], { "id": { "alias": "id"; "required": false; "isSignal": true; }; "value": { "alias": "value"; "required": true; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "searchTerm": { "alias": "searchTerm"; "required": false; "isSignal": true; }; "submenu": { "alias": "submenu"; "required": false; "isSignal": true; }; }, { "searchTerm": "searchTermChange"; }, never, never, true, never>;
}
/** Defers the rendering of the menu content. */
declare class MenuContent {
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<MenuContent, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<MenuContent, "ng-template[ngMenuContent]", ["ngMenuContent"], {}, {}, never, never, true, [{ directive: typeof i1.DeferredContent; inputs: {}; outputs: {}; }]>;
}

export { Menu, MenuBar, MenuContent, MenuItem, MenuTrigger };
