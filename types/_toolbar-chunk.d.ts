import { SignalLike, WritableSignalLike } from './_collection-chunk.js';
import { ListFocusItem, ListNavigationItem, ListFocus, ListNavigation } from './_list-navigation-chunk.js';

/** Represents the required inputs for a toolbar widget group. */
interface ToolbarWidgetGroupInputs {
    /** A reference to the parent toolbar. */
    toolbar: SignalLike<ToolbarPattern | undefined>;
    /** Whether the widget group is disabled. */
    disabled: SignalLike<boolean>;
    /** The list of items within the widget group. */
    items: SignalLike<ToolbarWidgetPattern[]>;
}
/** A group of widgets within a toolbar that provides nested navigation. */
declare class ToolbarWidgetGroupPattern {
    readonly inputs: ToolbarWidgetGroupInputs;
    /** Whether the widget is disabled. */
    readonly disabled: () => boolean;
    /** A reference to the parent toolbar. */
    readonly toolbar: () => ToolbarPattern | undefined;
    constructor(inputs: ToolbarWidgetGroupInputs);
}

/** Represents the required inputs for a toolbar widget in a toolbar. */
interface ToolbarWidgetInputs {
    /** A unique identifier for the widget. */
    id: SignalLike<string>;
    /** The html element that should receive focus. */
    element: SignalLike<HTMLElement | undefined>;
    /** Whether the widget is disabled. */
    disabled: SignalLike<boolean>;
    /** A reference to the parent toolbar. */
    toolbar: SignalLike<ToolbarPattern>;
    /** A reference to the parent widget group. */
    group: SignalLike<ToolbarWidgetGroupPattern | undefined>;
}
declare class ToolbarWidgetPattern implements ListFocusItem, ListNavigationItem {
    readonly inputs: ToolbarWidgetInputs;
    /** A unique identifier for the widget. */
    readonly id: () => string;
    /** The html element that should receive focus. */
    readonly element: () => HTMLElement | undefined;
    /** Whether the widget is disabled. */
    readonly disabled: () => boolean;
    /** A reference to the parent toolbar. */
    readonly group: () => ToolbarWidgetGroupPattern | undefined;
    /** A reference to the toolbar containing the widget. */
    readonly toolbar: () => ToolbarPattern;
    /** The tabindex of the widget. */
    readonly tabIndex: SignalLike<-1 | 0>;
    /** The position of the widget within the toolbar. */
    readonly index: SignalLike<number>;
    /** Whether the widget is currently the active one (focused). */
    readonly active: SignalLike<boolean>;
    constructor(inputs: ToolbarWidgetInputs);
}

/** Represents the required inputs for a toolbar. */
type ToolbarInputs = {
    /** The html element that should receive focus. */
    element: SignalLike<HTMLElement | undefined>;
    /** The active item. */
    activeItem: WritableSignalLike<ToolbarWidgetPattern | undefined>;
    /** The items in the toolbar. */
    items: SignalLike<ToolbarWidgetPattern[]>;
    /** Whether disabled items in the toolbar should be focusable. */
    softDisabled: SignalLike<boolean>;
    /** Whether the toolbar is disabled. */
    disabled: SignalLike<boolean>;
    /** Whether the toolbar is vertically or horizontally oriented. */
    orientation: SignalLike<'vertical' | 'horizontal'>;
    /** The direction that text is read based on the users locale. */
    textDirection: SignalLike<'rtl' | 'ltr'>;
    /** Whether focus should wrap when navigating. */
    wrap: SignalLike<boolean>;
    /** A function that returns the toolbar item associated with a given element. */
    getItem: (e: Element) => ToolbarWidgetPattern | undefined;
};
/** Controls the state of a toolbar. */
declare class ToolbarPattern {
    readonly inputs: ToolbarInputs;
    /** Controls focus for the toolbar. */
    readonly focusManager: ListFocus<ToolbarWidgetPattern>;
    /** Controls navigation for the toolbar. */
    readonly navigationBehavior: ListNavigation<ToolbarWidgetPattern>;
    /** Whether the toolbar has been interacted with. */
    readonly hasBeenInteracted: WritableSignalLike<boolean>;
    /** Whether the toolbar is vertically or horizontally oriented. */
    readonly orientation: SignalLike<'vertical' | 'horizontal'>;
    /** Whether disabled items in the group should be focusable. */
    readonly softDisabled: SignalLike<boolean>;
    /** Whether the toolbar is disabled. */
    readonly disabled: SignalLike<boolean>;
    /** The tab index of the toolbar. */
    readonly tabIndex: SignalLike<-1 | 0>;
    /** The id of the current active widget. */
    readonly activeDescendant: SignalLike<string | undefined>;
    /** The currently active item in the toolbar. */
    readonly activeItem: () => ToolbarWidgetPattern | undefined;
    /** The key used to navigate to the previous widget. */
    private readonly _prevKey;
    /** The key used to navigate to the next widget. */
    private readonly _nextKey;
    /** The alternate key used to navigate to the previous widget. */
    private readonly _altPrevKey;
    /** The alternate key used to navigate to the next widget. */
    private readonly _altNextKey;
    /** The keydown event manager for the toolbar. */
    private readonly _keydown;
    /** Navigates to the next widget in a widget group. */
    private _groupNext;
    /** Navigates to the previous widget in a widget group. */
    private _groupPrev;
    /** Navigates to the widget targeted by a pointer event. */
    private _goto;
    constructor(inputs: ToolbarInputs);
    /** Handles keydown events for the toolbar. */
    onKeydown(event: KeyboardEvent): void;
    onPointerdown(event: PointerEvent): void;
    onFocusIn(): void;
    /** Handles click events for the toolbar. */
    onClick(event: MouseEvent): void;
    /**
     * Sets the toolbar to its default initial state.
     *
     * Sets the active index to the first focusable widget.
     */
    setDefaultState(): void;
    /** Sets the default active state of the toolbar before receiving interaction for the first time. */
    setDefaultStateEffect(): void;
}

export { ToolbarPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern };
export type { ToolbarInputs, ToolbarWidgetGroupInputs, ToolbarWidgetInputs };
