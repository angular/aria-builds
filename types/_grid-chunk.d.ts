import * as _angular_core from '@angular/core';

/**
 * Options that are applicable to all event handlers.
 *
 * This library has not yet had a need for stopPropagationImmediate.
 */
interface EventHandlerOptions {
    stopPropagation: boolean;
    preventDefault: boolean;
}
/** A basic event handler. */
type EventHandler<T extends Event> = (event: T) => void;
/** A function that determines whether an event is to be handled. */
type EventMatcher<T extends Event> = (event: T) => boolean;
/** A config that specifies how to handle a particular event. */
interface EventHandlerConfig<T extends Event> extends EventHandlerOptions {
    matcher: EventMatcher<T>;
    handler: EventHandler<T>;
}
/** Bit flag representation of the possible modifier keys that can be present on an event. */
declare enum Modifier {
    None = 0,
    Ctrl = 1,
    Shift = 2,
    Alt = 4,
    Meta = 8,
    Any = "Any"
}
type ModifierInputs = Modifier | Modifier[];
/**
 * Abstract base class for all event managers.
 *
 * Event managers are designed to normalize how event handlers are authored and create a safety net
 * for common event handling gotchas like remembering to call preventDefault or stopPropagation.
 */
declare abstract class EventManager<T extends Event> {
    protected configs: EventHandlerConfig<T>[];
    abstract options: EventHandlerOptions;
    /** Runs the handlers that match with the given event. */
    handle(event: T): void;
    /** Configures the event manager to handle specific events. (See subclasses for more). */
    abstract on(...args: [...unknown[]]): this;
}

type SignalLike<T> = () => T;
interface WritableSignalLike<T> extends SignalLike<T> {
    set(value: T): void;
    update(updateFn: (value: T) => T): void;
}
/** Converts a getter setter style signal to a WritableSignalLike. */
declare function convertGetterSetterToWritableSignalLike<T>(getter: () => T, setter: (v: T) => void): WritableSignalLike<T>;

/**
 * Used to represent a keycode.
 *
 * This is used to match whether an events keycode should be handled. The ability to match using a
 * string, SignalLike, or Regexp gives us more flexibility when authoring event handlers.
 */
type KeyCode = string | SignalLike<string> | RegExp;
/**
 * An event manager that is specialized for handling keyboard events. By default this manager stops
 * propagation and prevents default on all events it handles.
 */
declare class KeyboardEventManager<T extends KeyboardEvent> extends EventManager<T> {
    options: EventHandlerOptions;
    /** Configures this event manager to handle events with a specific key and no modifiers. */
    on(key: KeyCode, handler: EventHandler<T>, options?: Partial<EventHandlerOptions>): this;
    /**  Configures this event manager to handle events with a specific modifer and key combination. */
    on(modifiers: ModifierInputs, key: KeyCode, handler: EventHandler<T>, options?: Partial<EventHandlerOptions>): this;
    private _normalizeInputs;
    private _isMatch;
}

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
    options: EventHandlerOptions;
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

/** Represents coordinates in a grid. */
interface RowCol {
    /** The row index. */
    row: number;
    /** The column index. */
    col: number;
}
/** The base interface for a cell in a grid. */
interface BaseGridCell {
    /** The number of rows the cell should span. */
    rowSpan: SignalLike<number>;
    /** The number of columns the cell should span. */
    colSpan: SignalLike<number>;
}
/** Represents the required inputs for GridData. */
interface GridDataInputs<T extends BaseGridCell> {
    /** The two-dimensional array of cells that represents the grid. */
    cells: SignalLike<T[][]>;
}
/** Controls internal coordinates for a grid of items. */
declare class GridData<T extends BaseGridCell> {
    readonly inputs: GridDataInputs<T>;
    /** The two-dimensional array of cells that represents the grid. */
    readonly cells: SignalLike<T[][]>;
    /** The maximum number of rows in the grid, accounting for row spans. */
    readonly maxRowCount: _angular_core.Signal<number>;
    /** The maximum number of columns in the grid, accounting for column spans. */
    readonly maxColCount: _angular_core.Signal<number>;
    /** A map from a cell to its primary and spanned coordinates. */
    private readonly _coordsMap;
    /** A map from a coordinate string to the cell at that coordinate. */
    private readonly _cellMap;
    /** A map from a row index to the number of columns in that row. */
    private readonly _colCountsByRow;
    /** A map from a column index to the number of rows in that column. */
    private readonly _rowCountByCol;
    constructor(inputs: GridDataInputs<T>);
    /** Gets the cell at the given coordinates. */
    getCell(rowCol: RowCol): T | undefined;
    /** Gets the primary coordinates of the given cell. */
    getCoords(cell: T): RowCol | undefined;
    /** Gets all coordinates that the given cell spans. */
    getAllCoords(cell: T): RowCol[] | undefined;
    /** Gets the number of rows in the given column. */
    getRowCount(col: number): number | undefined;
    /** Gets the number of columns in the given row. */
    getColCount(row: number): number | undefined;
}

/** Represents an cell in a grid, such as a grid cell, that may receive focus. */
interface GridFocusCell extends BaseGridCell {
    /** A unique identifier for the cell. */
    id: SignalLike<string>;
    /** The html element that should receive focus. */
    element: SignalLike<HTMLElement>;
    /** Whether a cell is disabled. */
    disabled: SignalLike<boolean>;
}
/** Represents the required inputs for a grid that contains focusable cells. */
interface GridFocusInputs {
    /** The focus strategy used by the grid. */
    focusMode: SignalLike<'roving' | 'activedescendant'>;
    /** Whether the grid is disabled. */
    disabled: SignalLike<boolean>;
    /** Whether disabled cells in the grid should be skipped when navigating. */
    skipDisabled: SignalLike<boolean>;
}
/** Dependencies for the `GridFocus` class. */
interface GridFocusDeps<T extends GridFocusCell> {
    /** The `GridData` instance that this focus manager operates on. */
    grid: GridData<T>;
}
/** Controls focus for a 2D grid of cells. */
declare class GridFocus<T extends GridFocusCell> {
    readonly inputs: GridFocusInputs & GridFocusDeps<T>;
    /** The current active cell. */
    readonly activeCell: _angular_core.WritableSignal<T | undefined>;
    /** The current active cell coordinates. */
    readonly activeCoords: _angular_core.WritableSignal<RowCol>;
    /** Whether the grid active state is empty (no active cell or coordinates). */
    readonly stateEmpty: _angular_core.Signal<boolean>;
    /**
     * Whether the grid focus state is stale.
     *
     * A stale state means the active cell or coordinates are no longer valid based on the
     * current grid data, for example if the underlying cells have changed.
     * A stale state should be re-initialized.
     */
    readonly stateStale: _angular_core.Signal<boolean>;
    /** The id of the current active cell, for ARIA activedescendant. */
    readonly activeDescendant: _angular_core.Signal<string | undefined>;
    /** Whether the grid is in a disabled state. */
    readonly gridDisabled: _angular_core.Signal<boolean>;
    /** The tabindex for the grid container. */
    readonly gridTabIndex: _angular_core.Signal<0 | -1>;
    constructor(inputs: GridFocusInputs & GridFocusDeps<T>);
    /** Returns the tabindex for the given grid cell cell. */
    getCellTabindex(cell: T): -1 | 0;
    /** Returns true if the given cell can be navigated to. */
    isFocusable(cell: T): boolean;
    /** Focuses the given cell. */
    focusCell(cell: T): boolean;
    /** Moves focus to the cell at the given coordinates if it's part of a focusable cell. */
    focusCoordinates(coords: RowCol): boolean;
}

/** A utility type that ensures an object has exactly one key from a given set. */
type ExactlyOneKey<T, K extends keyof T = keyof T> = {
    [P in K]: Record<P, T[P]> & Partial<Record<Exclude<K, P>, never>>;
}[K];
/** Represents a directional change in the grid, either by row or by column. */
type Delta = ExactlyOneKey<{
    row: -1 | 1;
    col: -1 | 1;
}>;
/** The wrapping behavior for keyboard navigation. */
type WrapStrategy = 'continuous' | 'loop' | 'nowrap';
/** Represents an item in a collection, such as a listbox option, than can be navigated to. */
interface GridNavigationCell extends GridFocusCell {
}
/** Represents the required inputs for a collection that has navigable items. */
interface GridNavigationInputs extends GridFocusInputs {
    /** The wrapping behavior for keyboard navigation along the row axis. */
    rowWrap: SignalLike<WrapStrategy>;
    /** The wrapping behavior for keyboard navigation along the column axis. */
    colWrap: SignalLike<WrapStrategy>;
}
/** Dependencies for the `GridNavigation` class. */
interface GridNavigationDeps<T extends GridNavigationCell> {
    /** The `GridData` instance that this navigation manager operates on. */
    grid: GridData<T>;
    /** The `GridFocus` instance that this navigation manager uses to manage focus. */
    gridFocus: GridFocus<T>;
}
/** Controls navigation for a grid of items. */
declare class GridNavigation<T extends GridNavigationCell> {
    readonly inputs: GridNavigationInputs & GridNavigationDeps<T>;
    /** The maximum number of steps to take when searching for the next cell. */
    private _maxSteps;
    constructor(inputs: GridNavigationInputs & GridNavigationDeps<T>);
    /** Navigates to the given item. */
    gotoCell(cell: T): boolean;
    /** Navigates to the given coordinates. */
    gotoCoords(coords: RowCol): boolean;
    /**
     * Gets the coordinates of the next focusable cell in a given direction, without changing focus.
     */
    peek(direction: Delta, fromCoords: RowCol, wrap?: WrapStrategy): RowCol | undefined;
    /**
     * Navigates to the next focusable cell in a given direction.
     */
    advance(direction: Delta): boolean;
    /**
     * Gets the coordinates of the first focusable cell.
     * If a row is not provided, searches the entire grid.
     */
    peekFirst(row?: number): RowCol | undefined;
    /**
     * Navigates to the first focusable cell.
     * If a row is not provided, searches the entire grid.
     */
    first(row?: number): boolean;
    /**
     * Gets the coordinates of the last focusable cell.
     * If a row is not provided, searches the entire grid.
     */
    peekLast(row?: number): RowCol | undefined;
    /**
     * Navigates to the last focusable cell.
     * If a row is not provided, searches the entire grid.
     */
    last(row?: number): boolean;
    /**
     * Finds the next focusable cell in a given direction based on the wrapping behavior.
     */
    private _peekDirectional;
}

/** Represents a cell in a grid that can be selected. */
interface GridSelectionCell extends GridFocusCell {
    /** Whether the cell is selected. */
    selected: WritableSignalLike<boolean>;
    /** Whether the cell is selectable. */
    selectable: SignalLike<boolean>;
}
/** Represents the required inputs for a grid that has selectable cells. */
interface GridSelectionInputs extends GridFocusInputs {
}
/** Dependencies for the `GridSelection` class. */
interface GridSelectionDeps<T extends GridSelectionCell> {
    /** The `GridData` instance that this selection manager operates on. */
    grid: GridData<T>;
    /** The `GridFocus` instance that this selection manager uses to manage focus. */
    gridFocus: GridFocus<T>;
}
/** Controls selection for a grid of items. */
declare class GridSelection<T extends GridSelectionCell> {
    readonly inputs: GridSelectionInputs & GridSelectionDeps<T>;
    constructor(inputs: GridSelectionInputs & GridSelectionDeps<T>);
    /** Selects one or more cells in a given range. */
    select(fromCoords: RowCol, toCoords?: RowCol): void;
    /** Deselects one or more cells in a given range. */
    deselect(fromCoords: RowCol, toCoords?: RowCol): void;
    /** Toggles the selection state of one or more cells in a given range. */
    toggle(fromCoords: RowCol, toCoords?: RowCol): void;
    /** Selects all valid cells in the grid. */
    selectAll(): void;
    /** Deselects all valid cells in the grid. */
    deselectAll(): void;
    /** A generator that yields all valid (selectable and not disabled) cells within a given range. */
    _validCells(fromCoords: RowCol, toCoords: RowCol): Generator<T>;
}

/** A type that represents a cell in a grid, combining all cell-related interfaces. */
type GridCell = BaseGridCell & GridFocusCell & GridNavigationCell & GridSelectionCell;
/** Represents the required inputs for a grid. */
interface GridInputs$1<T extends GridCell> extends GridDataInputs<T>, GridFocusInputs, GridNavigationInputs, GridSelectionInputs {
    /** Whether selection is enabled for the grid. */
    enableSelection: SignalLike<boolean>;
}
/** The main class that orchestrates the grid behaviors. */
declare class Grid<T extends GridCell> {
    readonly inputs: GridInputs$1<T>;
    /** The underlying data structure for the grid. */
    readonly data: GridData<T>;
    /** Controls focus for the grid. */
    readonly focusBehavior: GridFocus<T>;
    /** Controls navigation for the grid. */
    readonly navigationBehavior: GridNavigation<T>;
    /** Controls selection for the grid. */
    readonly selectionBehavior: GridSelection<T>;
    /** The anchor point for range selection, linked to the active coordinates. */
    readonly selectionAnchor: _angular_core.WritableSignal<RowCol>;
    /** The `tabindex` for the grid container. */
    readonly gridTabIndex: _angular_core.Signal<0 | -1>;
    /** Whether the grid is in a disabled state. */
    readonly gridDisabled: _angular_core.Signal<boolean>;
    /** The ID of the active descendant for ARIA `activedescendant` focus management. */
    readonly activeDescendant: _angular_core.Signal<string | undefined>;
    constructor(inputs: GridInputs$1<T>);
    /** Gets the 1-based row index of a cell. */
    rowIndex(cell: T): number | undefined;
    /** Gets the 1-based column index of a cell. */
    colIndex(cell: T): number | undefined;
    /** Gets the `tabindex` for a given cell. */
    cellTabIndex(cell: T): -1 | 0;
    /** Navigates to the cell above the currently active cell. */
    up(): boolean;
    /** Extends the selection to the cell above the selection anchor. */
    rangeSelectUp(): void;
    /** Navigates to the cell below the currently active cell. */
    down(): boolean;
    /** Extends the selection to the cell below the selection anchor. */
    rangeSelectDown(): void;
    /** Navigates to the cell to the left of the currently active cell. */
    left(): boolean;
    /** Extends the selection to the cell to the left of the selection anchor. */
    rangeSelectLeft(): void;
    /** Navigates to the cell to the right of the currently active cell. */
    right(): boolean;
    /** Extends the selection to the cell to the right of the selection anchor. */
    rangeSelectRight(): void;
    /** Navigates to the first focusable cell in the grid. */
    first(): boolean;
    /** Navigates to the first focusable cell in the current row. */
    firstInRow(): boolean;
    /** Navigates to the last focusable cell in the grid. */
    last(): boolean;
    /** Navigates to the last focusable cell in the current row. */
    lastInRow(): boolean;
    /** Selects all cells in the current row. */
    selectRow(): void;
    /** Selects all cells in the current column. */
    selectCol(): void;
    /** Selects all selectable cells in the grid. */
    selectAll(): void;
    /** Navigates to and focuses the given cell. */
    gotoCell(cell: T): boolean;
    /** Toggles the selection state of the given cell. */
    toggleSelect(cell: T): void;
    /** Extends the selection from the anchor to the given cell. */
    rangeSelect(cell: T): void;
    /** Extends the selection to the given coordinates. */
    private _rangeSelectCoords;
    /** Resets the active state of the grid if it is empty or stale. */
    resetState(): boolean;
}

/** The inputs for the `GridCellWidgetPattern`. */
interface GridCellWidgetInputs {
    /** The `GridCellPattern` that this widget belongs to. */
    cell: SignalLike<GridCellPattern>;
    /** The html element that should receive focus. */
    element: SignalLike<HTMLElement>;
    /**
     * Whether the widget is activated, which pauses grid navigation to allow interaction
     * with the widget.
     */
    activate: WritableSignalLike<boolean>;
}
/** The UI pattern for a widget inside a grid cell. */
declare class GridCellWidgetPattern {
    readonly inputs: GridCellWidgetInputs;
    /** The html element that should receive focus. */
    readonly element: SignalLike<HTMLElement>;
    /** The `tabindex` for the widget. */
    readonly tabIndex: SignalLike<-1 | 0>;
    /** Whether the widget is in an active state (i.e. its containing cell is active). */
    readonly active: SignalLike<boolean>;
    constructor(inputs: GridCellWidgetInputs);
}

/** The inputs for the `GridCellPattern`. */
interface GridCellInputs extends GridCell {
    /** The `GridPattern` that this cell belongs to. */
    grid: SignalLike<GridPattern>;
    /** The `GridRowPattern` that this cell belongs to. */
    row: SignalLike<GridRowPattern>;
    /** The widget pattern contained within this cell, if any. */
    widget: SignalLike<GridCellWidgetPattern | undefined>;
    /** The index of this cell's row within the grid. */
    rowIndex: SignalLike<number | undefined>;
    /** The index of this cell's column within the grid. */
    colIndex: SignalLike<number | undefined>;
}
/** The UI pattern for a grid cell. */
declare class GridCellPattern implements GridCell {
    readonly inputs: GridCellInputs;
    /** A unique identifier for the cell. */
    readonly id: SignalLike<string>;
    /** Whether a cell is disabled. */
    readonly disabled: SignalLike<boolean>;
    /** Whether the cell is selected. */
    readonly selected: WritableSignalLike<boolean>;
    /** Whether the cell is selectable. */
    readonly selectable: SignalLike<boolean>;
    /** The number of rows the cell should span. */
    readonly rowSpan: SignalLike<number>;
    /** The number of columns the cell should span. */
    readonly colSpan: SignalLike<number>;
    /** The `aria-selected` attribute for the cell. */
    readonly ariaSelected: _angular_core.Signal<boolean | undefined>;
    /** The `aria-rowindex` attribute for the cell. */
    readonly ariaRowIndex: _angular_core.Signal<number | undefined>;
    /** The `aria-colindex` attribute for the cell. */
    readonly ariaColIndex: _angular_core.Signal<number | undefined>;
    /** The html element that should receive focus. */
    readonly element: SignalLike<HTMLElement>;
    /** Whether the cell is active. */
    readonly active: _angular_core.Signal<boolean>;
    /** The internal tab index calculation for the cell. */
    private readonly _tabIndex;
    /** The `tabindex` for the cell. If the cell contains a widget, the cell's tabindex is -1. */
    readonly tabIndex: SignalLike<-1 | 0>;
    /** Whether the widget within the cell is activated. */
    readonly widgetActivated: SignalLike<boolean>;
    constructor(inputs: GridCellInputs);
    /** Gets the `tabindex` for the widget within the cell. */
    widgetTabIndex(): -1 | 0;
}

/** The inputs for the `GridRowPattern`. */
interface GridRowInputs {
    /** The `GridPattern` that this row belongs to. */
    grid: SignalLike<GridPattern>;
    /** The cells that make up this row. */
    cells: SignalLike<GridCellPattern[]>;
    /** The index of this row within the grid. */
    rowIndex: SignalLike<number | undefined>;
}
/** The UI pattern for a grid row. */
declare class GridRowPattern {
    readonly inputs: GridRowInputs;
    /** The index of this row within the grid. */
    rowIndex: SignalLike<number | undefined>;
    constructor(inputs: GridRowInputs);
}

/** Represents the required inputs for the grid pattern. */
interface GridInputs extends Omit<GridInputs$1<GridCellPattern>, 'cells'> {
    /** The html element of the grid. */
    element: SignalLike<HTMLElement>;
    /** The rows that make up the grid. */
    rows: SignalLike<GridRowPattern[]>;
    /** A function that returns the grid cell associated with a given element. */
    getCell: (e: Element) => GridCellPattern | undefined;
}
/** The UI pattern for a grid, handling keyboard navigation, focus, and selection. */
declare class GridPattern {
    readonly inputs: GridInputs;
    /** The underlying grid behavior that this pattern is built on. */
    readonly gridBehavior: Grid<GridCellPattern>;
    /** The cells in the grid. */
    readonly cells: _angular_core.Signal<GridCellPattern[][]>;
    /** The tab index for the grid. */
    readonly tabIndex: _angular_core.Signal<0 | -1>;
    /** Whether the grid is disabled. */
    readonly disabled: _angular_core.Signal<boolean>;
    /** The ID of the currently active descendant cell. */
    readonly activeDescendant: _angular_core.Signal<string | undefined>;
    /** The currently active cell. */
    readonly activeCell: _angular_core.Signal<GridCellPattern | undefined>;
    /** Whether to pause grid navigation. */
    readonly pauseNavigation: _angular_core.Signal<boolean>;
    /** Whether the focus is in the grid. */
    readonly isFocused: _angular_core.WritableSignal<boolean>;
    /** Whether the user is currently dragging to select a range of cells. */
    readonly dragging: _angular_core.WritableSignal<boolean>;
    /** The keydown event manager for the grid. */
    readonly keydown: _angular_core.Signal<KeyboardEventManager<KeyboardEvent>>;
    /** The pointerdown event manager for the grid. */
    readonly pointerdown: _angular_core.Signal<PointerEventManager<PointerEvent>>;
    /** The pointerup event manager for the grid. */
    readonly pointerup: _angular_core.Signal<PointerEventManager<PointerEvent>>;
    constructor(inputs: GridInputs);
    /** Handles keydown events on the grid. */
    onKeydown(event: KeyboardEvent): void;
    /** Handles pointerdown events on the grid. */
    onPointerdown(event: PointerEvent): void;
    /** Handles pointermove events on the grid. */
    onPointermove(event: PointerEvent): void;
    /** Handles pointerup events on the grid. */
    onPointerup(event: PointerEvent): void;
    /** Handles focusin events on the grid. */
    onFocusIn(): void;
    /** Indicates maybe the losing focus is caused by row/cell deletion. */
    private readonly _maybeDeletion;
    /** Handles focusout events on the grid. */
    onFocusOut(event: FocusEvent): void;
    /** Indicates the losing focus is certainly caused by row/cell deletion. */
    private readonly _deletion;
    /** Resets the active state of the grid if it is empty or stale. */
    resetStateEffect(): void;
    /** Focuses on the active cell element. */
    focusEffect(): void;
}

export { GridCellPattern, GridCellWidgetPattern, GridPattern, GridRowPattern, KeyboardEventManager, PointerEventManager, convertGetterSetterToWritableSignalLike };
export type { GridCellInputs, GridCellWidgetInputs, GridInputs, GridRowInputs, SignalLike, WritableSignalLike };
