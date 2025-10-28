import { computed, signal, linkedSignal } from '@angular/core';

/** Bit flag representation of the possible modifier keys that can be present on an event. */
var Modifier;
(function (Modifier) {
    Modifier[Modifier["None"] = 0] = "None";
    Modifier[Modifier["Ctrl"] = 1] = "Ctrl";
    Modifier[Modifier["Shift"] = 2] = "Shift";
    Modifier[Modifier["Alt"] = 4] = "Alt";
    Modifier[Modifier["Meta"] = 8] = "Meta";
    Modifier["Any"] = "Any";
})(Modifier || (Modifier = {}));
/**
 * Abstract base class for all event managers.
 *
 * Event managers are designed to normalize how event handlers are authored and create a safety net
 * for common event handling gotchas like remembering to call preventDefault or stopPropagation.
 */
class EventManager {
    configs = [];
    /** Runs the handlers that match with the given event. */
    handle(event) {
        for (const config of this.configs) {
            if (config.matcher(event)) {
                config.handler(event);
                if (config.preventDefault) {
                    event.preventDefault();
                }
                if (config.stopPropagation) {
                    event.stopPropagation();
                }
            }
        }
    }
}
/** Gets bit flag representation of the modifier keys present on the given event. */
function getModifiers(event) {
    return ((+event.ctrlKey && Modifier.Ctrl) |
        (+event.shiftKey && Modifier.Shift) |
        (+event.altKey && Modifier.Alt) |
        (+event.metaKey && Modifier.Meta));
}
/**
 * Checks if the given event has modifiers that are an exact match for any of the given modifier
 * flag combinations.
 */
function hasModifiers(event, modifiers) {
    const eventModifiers = getModifiers(event);
    const modifiersList = Array.isArray(modifiers) ? modifiers : [modifiers];
    if (modifiersList.includes(Modifier.Any)) {
        return true;
    }
    return modifiersList.some(modifiers => eventModifiers === modifiers);
}

/**
 * An event manager that is specialized for handling keyboard events. By default this manager stops
 * propagation and prevents default on all events it handles.
 */
class KeyboardEventManager extends EventManager {
    options = {
        preventDefault: true,
        stopPropagation: true,
    };
    on(...args) {
        const { modifiers, key, handler } = this._normalizeInputs(...args);
        this.configs.push({
            handler: handler,
            matcher: event => this._isMatch(event, key, modifiers),
            ...this.options,
        });
        return this;
    }
    _normalizeInputs(...args) {
        const key = args.length === 3 ? args[1] : args[0];
        const handler = args.length === 3 ? args[2] : args[1];
        const modifiers = args.length === 3 ? args[0] : Modifier.None;
        return {
            key: key,
            handler: handler,
            modifiers: modifiers,
        };
    }
    _isMatch(event, key, modifiers) {
        if (!hasModifiers(event, modifiers)) {
            return false;
        }
        if (key instanceof RegExp) {
            return key.test(event.key);
        }
        const keyStr = typeof key === 'string' ? key : key();
        return keyStr.toLowerCase() === event.key.toLowerCase();
    }
}

/**
 * The different mouse buttons that may appear on a pointer event.
 */
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Main"] = 0] = "Main";
    MouseButton[MouseButton["Auxiliary"] = 1] = "Auxiliary";
    MouseButton[MouseButton["Secondary"] = 2] = "Secondary";
})(MouseButton || (MouseButton = {}));
/** An event manager that is specialized for handling pointer events. */
class PointerEventManager extends EventManager {
    options = {
        preventDefault: false,
        stopPropagation: false,
    };
    on(...args) {
        const { button, handler, modifiers } = this._normalizeInputs(...args);
        this.configs.push({
            handler,
            matcher: event => this._isMatch(event, button, modifiers),
            ...this.options,
        });
        return this;
    }
    _normalizeInputs(...args) {
        if (args.length === 3) {
            return {
                button: args[0],
                modifiers: args[1],
                handler: args[2],
            };
        }
        if (args.length === 2) {
            return {
                button: MouseButton.Main,
                modifiers: args[0],
                handler: args[1],
            };
        }
        return {
            button: MouseButton.Main,
            modifiers: Modifier.None,
            handler: args[0],
        };
    }
    _isMatch(event, button, modifiers) {
        return button === (event.button ?? 0) && hasModifiers(event, modifiers);
    }
}

/** Controls internal coordinates for a grid of items. */
class GridData {
    inputs;
    /** The two-dimensional array of cells that represents the grid. */
    cells;
    /** The number of rows in the grid. */
    rowCount = computed(() => this.cells().length);
    /** The maximum number of rows in the grid, accounting for row spans. */
    maxRowCount = computed(() => Math.max(...this._rowCountByCol().values(), 0));
    /** The maximum number of columns in the grid, accounting for column spans. */
    maxColCount = computed(() => Math.max(...this._colCountsByRow().values(), 0));
    /** A map from a cell to its primary and spanned coordinates. */
    _coordsMap = computed(() => {
        const coordsMap = new Map();
        const visitedCoords = new Set();
        for (let rowIndex = 0; rowIndex < this.cells().length; rowIndex++) {
            let colIndex = 0;
            const row = this.cells()[rowIndex];
            for (const cell of row) {
                // Skip past cells that are already taken.
                while (visitedCoords.has(`${rowIndex}:${colIndex}`)) {
                    colIndex++;
                }
                const rowspan = cell.rowSpan();
                const colspan = cell.colSpan();
                const spanCoords = [];
                for (let rowOffset = 0; rowOffset < rowspan; rowOffset++) {
                    const row = rowIndex + rowOffset;
                    for (let colOffset = 0; colOffset < colspan; colOffset++) {
                        const col = colIndex + colOffset;
                        visitedCoords.add(`${row}:${col}`);
                        spanCoords.push({ row, col });
                    }
                }
                coordsMap.set(cell, { coords: spanCoords[0], spanCoords });
                colIndex += colspan;
            }
        }
        return coordsMap;
    });
    /** A map from a coordinate string to the cell at that coordinate. */
    _cellMap = computed(() => {
        const cellMap = new Map();
        for (const [cell, { spanCoords }] of this._coordsMap().entries()) {
            for (const { row, col } of spanCoords) {
                cellMap.set(`${row}:${col}`, cell);
            }
        }
        return cellMap;
    });
    /** A map from a row index to the number of columns in that row. */
    _colCountsByRow = computed(() => {
        const colCountByRow = new Map();
        for (const [_, { spanCoords }] of this._coordsMap().entries()) {
            for (const { row, col } of spanCoords) {
                const colCount = colCountByRow.get(row);
                const newColCount = col + 1;
                if (colCount === undefined || colCount < newColCount) {
                    colCountByRow.set(row, newColCount);
                }
            }
        }
        return colCountByRow;
    });
    /** A map from a column index to the number of rows in that column. */
    _rowCountByCol = computed(() => {
        const rowCountByCol = new Map();
        for (const [_, { spanCoords }] of this._coordsMap().entries()) {
            for (const { row, col } of spanCoords) {
                const rowCount = rowCountByCol.get(col);
                const newRowCount = row + 1;
                if (rowCount === undefined || rowCount < newRowCount) {
                    rowCountByCol.set(col, newRowCount);
                }
            }
        }
        return rowCountByCol;
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.cells = this.inputs.cells;
    }
    /** Gets the cell at the given coordinates. */
    getCell(rowCol) {
        return this._cellMap().get(`${rowCol.row}:${rowCol.col}`);
    }
    /** Gets the primary coordinates of the given cell. */
    getCoords(cell) {
        return this._coordsMap().get(cell)?.coords;
    }
    /** Gets all coordinates that the given cell spans. */
    getAllCoords(cell) {
        return this._coordsMap().get(cell)?.spanCoords;
    }
    /** Gets the number of rows in the given column. */
    getRowCount(col) {
        return this._rowCountByCol().get(col);
    }
    /** Gets the number of columns in the given row. */
    getColCount(row) {
        return this._colCountsByRow().get(row);
    }
}

/** Controls focus for a 2D grid of cells. */
class GridFocus {
    inputs;
    /** The current active cell. */
    activeCell = signal(undefined);
    /** The current active cell coordinates. */
    activeCoords = signal({ row: -1, col: -1 });
    /** Whether the grid active state is empty (no active cell or coordinates). */
    stateEmpty = computed(() => this.activeCell() === undefined ||
        (this.activeCoords().row === -1 && this.activeCoords().col === -1));
    /**
     * Whether the grid focus state is stale.
     *
     * A stale state means the active cell or coordinates are no longer valid based on the
     * current grid data, for example if the underlying cells have changed.
     * A stale state should be re-initialized.
     */
    stateStale = computed(() => {
        if (this.stateEmpty()) {
            return true;
        }
        const activeCell = this.activeCell();
        const activeCellCoords = this.inputs.grid.getCoords(activeCell);
        const activeCoords = this.activeCoords();
        const activeCoordsCell = this.inputs.grid.getCell(activeCoords);
        const activeCellNotValid = activeCellCoords === undefined;
        const activeCellMismatch = activeCell !== activeCoordsCell;
        return activeCellNotValid || activeCellMismatch;
    });
    /** The id of the current active cell, for ARIA activedescendant. */
    activeDescendant = computed(() => {
        if (this.gridDisabled() || this.inputs.focusMode() === 'roving') {
            return undefined;
        }
        const currentActiveCell = this.activeCell();
        return currentActiveCell ? currentActiveCell.id() : undefined;
    });
    /** Whether the grid is in a disabled state. */
    gridDisabled = computed(() => {
        if (this.inputs.disabled()) {
            return true;
        }
        const gridCells = this.inputs.grid.cells();
        return gridCells.length === 0 || gridCells.every(row => row.every(cell => cell.disabled()));
    });
    /** The tabindex for the grid container. */
    gridTabIndex = computed(() => {
        if (this.gridDisabled()) {
            return 0;
        }
        return this.inputs.focusMode() === 'activedescendant' ? 0 : -1;
    });
    constructor(inputs) {
        this.inputs = inputs;
    }
    /** Returns the tabindex for the given grid cell cell. */
    getCellTabindex(cell) {
        if (this.gridDisabled()) {
            return -1;
        }
        if (this.inputs.focusMode() === 'activedescendant') {
            return -1;
        }
        return this.activeCell() === cell ? 0 : -1;
    }
    /** Returns true if the given cell can be navigated to. */
    isFocusable(cell) {
        return !cell.disabled() || !this.inputs.skipDisabled();
    }
    /** Focuses the given cell. */
    focusCell(cell) {
        if (this.gridDisabled()) {
            return false;
        }
        if (!this.isFocusable(cell)) {
            return false;
        }
        if (this.inputs.grid.getCoords(cell) === undefined) {
            return false;
        }
        this.activeCoords.set(this.inputs.grid.getCoords(cell));
        this.activeCell.set(cell);
        return true;
    }
    /** Moves focus to the cell at the given coordinates if it's part of a focusable cell. */
    focusCoordinates(coords) {
        if (this.gridDisabled()) {
            return false;
        }
        const cell = this.inputs.grid.getCell(coords);
        if (!cell || !this.isFocusable(cell)) {
            return false;
        }
        if (this.inputs.grid.getCell(coords) === undefined) {
            return false;
        }
        this.activeCoords.set(coords);
        this.activeCell.set(this.inputs.grid.getCell(coords));
        return true;
    }
}

/** Constants for the four cardinal directions. */
const direction = {
    Up: { row: -1 },
    Down: { row: 1 },
    Left: { col: -1 },
    Right: { col: 1 },
};
/** Controls navigation for a grid of items. */
class GridNavigation {
    inputs;
    /** The maximum number of steps to take when searching for the next cell. */
    _maxSteps = computed(() => this.inputs.grid.maxRowCount() * this.inputs.grid.maxColCount());
    constructor(inputs) {
        this.inputs = inputs;
    }
    /** Navigates to the given item. */
    gotoCell(cell) {
        return this.inputs.gridFocus.focusCell(cell);
    }
    /** Navigates to the given coordinates. */
    gotoCoords(coords) {
        return this.inputs.gridFocus.focusCoordinates(coords);
    }
    /**
     * Gets the coordinates of the next focusable cell in a given direction, without changing focus.
     */
    peek(direction, fromCoords, wrap) {
        wrap = wrap ?? (direction.row !== undefined ? this.inputs.rowWrap() : this.inputs.colWrap());
        return this._peekDirectional(direction, fromCoords, wrap);
    }
    /**
     * Navigates to the next focusable cell in a given direction.
     */
    advance(direction) {
        const nextCoords = this.peek(direction, this.inputs.gridFocus.activeCoords());
        return !!nextCoords && this.gotoCoords(nextCoords);
    }
    /**
     * Gets the coordinates of the first focusable cell.
     * If a row is not provided, searches the entire grid.
     */
    peekFirst(row) {
        const fromCoords = {
            row: row ?? 0,
            col: -1,
        };
        return row === undefined
            ? this._peekDirectional(direction.Right, fromCoords, 'continuous')
            : this._peekDirectional(direction.Right, fromCoords, 'nowrap');
    }
    /**
     * Navigates to the first focusable cell.
     * If a row is not provided, searches the entire grid.
     */
    first(row) {
        const nextCoords = this.peekFirst(row);
        return !!nextCoords && this.gotoCoords(nextCoords);
    }
    /**
     * Gets the coordinates of the last focusable cell.
     * If a row is not provided, searches the entire grid.
     */
    peekLast(row) {
        const fromCoords = {
            row: row ?? this.inputs.grid.maxRowCount() - 1,
            col: this.inputs.grid.maxColCount(),
        };
        return row === undefined
            ? this._peekDirectional(direction.Left, fromCoords, 'continuous')
            : this._peekDirectional(direction.Left, fromCoords, 'nowrap');
    }
    /**
     * Navigates to the last focusable cell.
     * If a row is not provided, searches the entire grid.
     */
    last(row) {
        const nextCoords = this.peekLast(row);
        return !!nextCoords && this.gotoCoords(nextCoords);
    }
    /**
     * Finds the next focusable cell in a given direction based on the wrapping behavior.
     */
    _peekDirectional(delta, fromCoords, wrap) {
        const fromCell = this.inputs.grid.getCell(fromCoords);
        const maxRowCount = this.inputs.grid.maxRowCount();
        const maxColCount = this.inputs.grid.maxColCount();
        const rowDelta = delta.row ?? 0;
        const colDelta = delta.col ?? 0;
        let nextCoords = { ...fromCoords };
        for (let step = 0; step < this._maxSteps(); step++) {
            const isWrapping = nextCoords.col + colDelta < 0 ||
                nextCoords.col + colDelta >= maxColCount ||
                nextCoords.row + rowDelta < 0 ||
                nextCoords.row + rowDelta >= maxRowCount;
            if (wrap === 'nowrap' && isWrapping)
                return;
            if (wrap === 'continuous') {
                const generalDelta = delta.row ?? delta.col;
                const rowStep = isWrapping ? generalDelta : rowDelta;
                const colStep = isWrapping ? generalDelta : colDelta;
                nextCoords = {
                    row: (nextCoords.row + rowStep + maxRowCount) % maxRowCount,
                    col: (nextCoords.col + colStep + maxColCount) % maxColCount,
                };
            }
            if (wrap === 'loop') {
                nextCoords = {
                    row: (nextCoords.row + rowDelta + maxRowCount) % maxRowCount,
                    col: (nextCoords.col + colDelta + maxColCount) % maxColCount,
                };
            }
            // Back to original coordinates.
            if (nextCoords.row === fromCoords.row && nextCoords.col === fromCoords.col) {
                return undefined;
            }
            const nextCell = this.inputs.grid.getCell(nextCoords);
            if (nextCell !== undefined &&
                nextCell !== fromCell &&
                this.inputs.gridFocus.isFocusable(nextCell)) {
                return nextCoords;
            }
        }
        return undefined;
    }
}

/** Controls selection for a grid of items. */
class GridSelection {
    inputs;
    constructor(inputs) {
        this.inputs = inputs;
    }
    /** Selects one or more cells in a given range. */
    select(fromCoords, toCoords) {
        for (const cell of this._validCells(fromCoords, toCoords ?? fromCoords)) {
            cell.selected.set(true);
        }
    }
    /** Deselects one or more cells in a given range. */
    deselect(fromCoords, toCoords) {
        for (const cell of this._validCells(fromCoords, toCoords ?? fromCoords)) {
            cell.selected.set(false);
        }
    }
    /** Toggles the selection state of one or more cells in a given range. */
    toggle(fromCoords, toCoords) {
        for (const cell of this._validCells(fromCoords, toCoords ?? fromCoords)) {
            cell.selected.update(state => !state);
        }
    }
    /** Selects all valid cells in the grid. */
    selectAll() {
        for (const cell of this._validCells({ row: 0, col: 0 }, { row: this.inputs.grid.maxRowCount(), col: this.inputs.grid.maxColCount() })) {
            cell.selected.set(true);
        }
    }
    /** Deselects all valid cells in the grid. */
    deselectAll() {
        for (const cell of this._validCells({ row: 0, col: 0 }, { row: this.inputs.grid.maxRowCount(), col: this.inputs.grid.maxColCount() })) {
            cell.selected.set(false);
        }
    }
    /** A generator that yields all valid (selectable and not disabled) cells within a given range. */
    *_validCells(fromCoords, toCoords) {
        const startRow = Math.min(fromCoords.row, toCoords.row);
        const startCol = Math.min(fromCoords.col, toCoords.col);
        const endRow = Math.max(fromCoords.row, toCoords.row);
        const endCol = Math.max(fromCoords.col, toCoords.col);
        const visited = new Set();
        for (let row = startRow; row < endRow + 1; row++) {
            for (let col = startCol; col < endCol + 1; col++) {
                const cell = this.inputs.grid.getCell({ row, col });
                if (cell === undefined)
                    continue;
                if (!cell.selectable())
                    continue;
                if (cell.disabled())
                    continue;
                if (visited.has(cell))
                    continue;
                visited.add(cell);
                yield cell;
            }
        }
    }
}

/** The main class that orchestrates the grid behaviors. */
class Grid {
    inputs;
    /** The underlying data structure for the grid. */
    data;
    /** Controls focus for the grid. */
    focusBehavior;
    /** Controls navigation for the grid. */
    navigationBehavior;
    /** Controls selection for the grid. */
    selectionBehavior;
    /** The anchor point for range selection, linked to the active coordinates. */
    selectionAnchor = linkedSignal(() => this.focusBehavior.activeCoords());
    /** The `tabindex` for the grid container. */
    gridTabIndex = computed(() => this.focusBehavior.gridTabIndex());
    /** Whether the grid is in a disabled state. */
    gridDisabled = computed(() => this.focusBehavior.gridDisabled());
    /** The ID of the active descendant for ARIA `activedescendant` focus management. */
    activeDescendant = computed(() => this.focusBehavior.activeDescendant());
    constructor(inputs) {
        this.inputs = inputs;
        this.data = new GridData(inputs);
        this.focusBehavior = new GridFocus({ ...inputs, grid: this.data });
        this.navigationBehavior = new GridNavigation({
            ...inputs,
            grid: this.data,
            gridFocus: this.focusBehavior,
        });
        this.selectionBehavior = new GridSelection({
            ...inputs,
            grid: this.data,
            gridFocus: this.focusBehavior,
        });
    }
    /** Gets the 1-based row index of a cell. */
    rowIndex(cell) {
        const index = this.data.getCoords(cell)?.row;
        return index !== undefined ? index + 1 : undefined;
    }
    /** Gets the 1-based column index of a cell. */
    colIndex(cell) {
        const index = this.data.getCoords(cell)?.col;
        return index !== undefined ? index + 1 : undefined;
    }
    /** Gets the `tabindex` for a given cell. */
    cellTabIndex(cell) {
        return this.focusBehavior.getCellTabindex(cell);
    }
    /** Navigates to the cell above the currently active cell. */
    up() {
        return this.navigationBehavior.advance(direction.Up);
    }
    /** Extends the selection to the cell above the selection anchor. */
    rangeSelectUp() {
        const coords = this.navigationBehavior.peek(direction.Up, this.selectionAnchor());
        if (coords === undefined)
            return;
        this._rangeSelectCoords(coords);
    }
    /** Navigates to the cell below the currently active cell. */
    down() {
        return this.navigationBehavior.advance(direction.Down);
    }
    /** Extends the selection to the cell below the selection anchor. */
    rangeSelectDown() {
        const coords = this.navigationBehavior.peek(direction.Down, this.selectionAnchor());
        if (coords === undefined)
            return;
        this._rangeSelectCoords(coords);
    }
    /** Navigates to the cell to the left of the currently active cell. */
    left() {
        return this.navigationBehavior.advance(direction.Left);
    }
    /** Extends the selection to the cell to the left of the selection anchor. */
    rangeSelectLeft() {
        const coords = this.navigationBehavior.peek(direction.Left, this.selectionAnchor());
        if (coords === undefined)
            return;
        this._rangeSelectCoords(coords);
    }
    /** Navigates to the cell to the right of the currently active cell. */
    right() {
        return this.navigationBehavior.advance(direction.Right);
    }
    /** Extends the selection to the cell to the right of the selection anchor. */
    rangeSelectRight() {
        const coords = this.navigationBehavior.peek(direction.Right, this.selectionAnchor());
        if (coords === undefined)
            return;
        this._rangeSelectCoords(coords);
    }
    /** Navigates to the first focusable cell in the grid. */
    first() {
        return this.navigationBehavior.first();
    }
    /** Navigates to the first focusable cell in the current row. */
    firstInRow() {
        return this.navigationBehavior.first(this.focusBehavior.activeCoords().row);
    }
    /** Navigates to the last focusable cell in the grid. */
    last() {
        return this.navigationBehavior.last();
    }
    /** Navigates to the last focusable cell in the current row. */
    lastInRow() {
        return this.navigationBehavior.last(this.focusBehavior.activeCoords().row);
    }
    /** Selects all cells in the current row. */
    selectRow() {
        const row = this.focusBehavior.activeCoords().row;
        this.selectionBehavior.deselectAll();
        this.selectionBehavior.select({ row, col: 0 }, { row, col: this.data.maxColCount() });
    }
    /** Selects all cells in the current column. */
    selectCol() {
        const col = this.focusBehavior.activeCoords().col;
        this.selectionBehavior.deselectAll();
        this.selectionBehavior.select({ row: 0, col }, { row: this.data.maxRowCount(), col });
    }
    /** Selects all selectable cells in the grid. */
    selectAll() {
        this.selectionBehavior.selectAll();
    }
    /** Navigates to and focuses the given cell. */
    gotoCell(cell) {
        return this.navigationBehavior.gotoCell(cell);
    }
    /** Toggles the selection state of the given cell. */
    toggleSelect(cell) {
        const coords = this.data.getCoords(cell);
        if (coords === undefined)
            return;
        this.selectionBehavior.toggle(coords);
    }
    /** Extends the selection from the anchor to the given cell. */
    rangeSelect(cell) {
        const coords = this.data.getCoords(cell);
        if (coords === undefined)
            return;
        this._rangeSelectCoords(coords);
    }
    /** Extends the selection to the given coordinates. */
    _rangeSelectCoords(coords) {
        const activeCell = this.focusBehavior.activeCell();
        const anchorCell = this.data.getCell(coords);
        if (activeCell === undefined || anchorCell === undefined) {
            return;
        }
        const allCoords = [
            ...this.data.getAllCoords(activeCell),
            ...this.data.getAllCoords(anchorCell),
        ];
        const allRows = allCoords.map(c => c.row);
        const allCols = allCoords.map(c => c.col);
        const fromCoords = {
            row: Math.min(...allRows),
            col: Math.min(...allCols),
        };
        const toCoords = {
            row: Math.max(...allRows),
            col: Math.max(...allCols),
        };
        this.selectionBehavior.deselectAll();
        this.selectionBehavior.select(fromCoords, toCoords);
        this.selectionAnchor.set(coords);
    }
    /** Resets the active state of the grid if it is empty or stale. */
    resetState() {
        if (this.focusBehavior.stateEmpty()) {
            const firstFocusableCoords = this.navigationBehavior.peekFirst();
            if (firstFocusableCoords === undefined) {
                return false;
            }
            return this.focusBehavior.focusCoordinates(firstFocusableCoords);
        }
        if (this.focusBehavior.stateStale()) {
            // Try focus on the same active cell after if a reordering happened.
            if (this.focusBehavior.focusCell(this.focusBehavior.activeCell())) {
                return true;
            }
            // If the active cell is no longer exist, focus on the coordinates instead.
            if (this.focusBehavior.focusCoordinates(this.focusBehavior.activeCoords())) {
                return true;
            }
            // If the cooridnates no longer valid, go back to the first available cell.
            if (this.focusBehavior.focusCoordinates(this.navigationBehavior.peekFirst())) {
                return true;
            }
        }
        return false;
    }
}

/** The UI pattern for a grid, handling keyboard navigation, focus, and selection. */
class GridPattern {
    inputs;
    /** The underlying grid behavior that this pattern is built on. */
    gridBehavior;
    /** The cells in the grid. */
    cells = computed(() => this.gridBehavior.data.cells());
    /** The tab index for the grid. */
    tabIndex = computed(() => this.gridBehavior.gridTabIndex());
    /** Whether the grid is disabled. */
    disabled = computed(() => this.gridBehavior.gridDisabled());
    /** The ID of the currently active descendant cell. */
    activeDescendant = computed(() => this.gridBehavior.activeDescendant());
    /** The currently active cell. */
    activeCell = computed(() => this.gridBehavior.focusBehavior.activeCell());
    /** Whether to pause grid navigation. */
    pauseNavigation = computed(() => this.gridBehavior.data
        .cells()
        .flat()
        .reduce((res, c) => res || c.widgetActivated(), false));
    /** Whether the focus is in the grid. */
    isFocused = signal(false);
    /** Whether the user is currently dragging to select a range of cells. */
    dragging = signal(false);
    /** The keydown event manager for the grid. */
    keydown = computed(() => {
        const manager = new KeyboardEventManager();
        if (this.pauseNavigation()) {
            return manager;
        }
        manager
            .on('ArrowUp', () => this.gridBehavior.up())
            .on('ArrowDown', () => this.gridBehavior.down())
            .on('ArrowLeft', () => this.gridBehavior.left())
            .on('ArrowRight', () => this.gridBehavior.right())
            .on('Home', () => this.gridBehavior.firstInRow())
            .on('End', () => this.gridBehavior.lastInRow())
            .on([Modifier.Ctrl], 'Home', () => this.gridBehavior.first())
            .on([Modifier.Ctrl], 'End', () => this.gridBehavior.last());
        if (this.inputs.enableSelection()) {
            manager
                .on(Modifier.Shift, 'ArrowUp', () => this.gridBehavior.rangeSelectUp())
                .on(Modifier.Shift, 'ArrowDown', () => this.gridBehavior.rangeSelectDown())
                .on(Modifier.Shift, 'ArrowLeft', () => this.gridBehavior.rangeSelectLeft())
                .on(Modifier.Shift, 'ArrowRight', () => this.gridBehavior.rangeSelectRight())
                .on([Modifier.Ctrl, Modifier.Meta], 'A', () => this.gridBehavior.selectAll())
                .on([Modifier.Shift], ' ', () => this.gridBehavior.selectRow())
                .on([Modifier.Ctrl, Modifier.Meta], ' ', () => this.gridBehavior.selectCol());
        }
        return manager;
    });
    /** The pointerdown event manager for the grid. */
    pointerdown = computed(() => {
        const manager = new PointerEventManager();
        manager.on(e => {
            const cell = this.inputs.getCell(e.target);
            if (!cell)
                return;
            this.gridBehavior.gotoCell(cell);
            if (this.inputs.enableSelection()) {
                this.dragging.set(true);
            }
        });
        if (this.inputs.enableSelection()) {
            manager
                .on([Modifier.Ctrl, Modifier.Meta], e => {
                const cell = this.inputs.getCell(e.target);
                if (!cell)
                    return;
                this.gridBehavior.toggleSelect(cell);
            })
                .on(Modifier.Shift, e => {
                const cell = this.inputs.getCell(e.target);
                if (!cell)
                    return;
                this.gridBehavior.rangeSelect(cell);
                this.dragging.set(true);
            });
        }
        return manager;
    });
    /** The pointerup event manager for the grid. */
    pointerup = computed(() => {
        const manager = new PointerEventManager();
        if (this.inputs.enableSelection()) {
            manager.on([Modifier.Shift, Modifier.None], () => {
                this.dragging.set(false);
            });
        }
        return manager;
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.gridBehavior = new Grid({
            ...inputs,
            cells: computed(() => this.inputs.rows().map(row => row.inputs.cells())),
        });
    }
    /** Handles keydown events on the grid. */
    onKeydown(event) {
        if (!this.disabled()) {
            this.keydown().handle(event);
        }
    }
    /** Handles pointerdown events on the grid. */
    onPointerdown(event) {
        if (!this.disabled()) {
            this.pointerdown().handle(event);
        }
    }
    /** Handles pointermove events on the grid. */
    onPointermove(event) {
        if (this.disabled())
            return;
        if (!this.inputs.enableSelection())
            return;
        if (!this.dragging())
            return;
        const cell = this.inputs.getCell(event.target);
        if (!cell)
            return;
        this.gridBehavior.rangeSelect(cell);
    }
    /** Handles pointerup events on the grid. */
    onPointerup(event) {
        if (!this.disabled()) {
            this.pointerup().handle(event);
        }
    }
    /** Handles focusin events on the grid. */
    onFocusIn(event) {
        this.isFocused.set(true);
        const cell = this.inputs.getCell(event.target);
        if (!cell)
            return;
        this.gridBehavior.gotoCell(cell);
    }
    /** Indicates maybe the losing focus is caused by row/cell deletion. */
    _maybeDeletion = signal(false);
    /** Handles focusout events on the grid. */
    onFocusOut(event) {
        const parentEl = this.inputs.element();
        const targetEl = event.relatedTarget;
        // If a `relatedTarget` is null, then it can be caused by either
        // - Clicking on a non-focusable element, or
        // - The focused element is removed from the page.
        if (targetEl === null) {
            this._maybeDeletion.set(true);
        }
        if (parentEl.contains(targetEl))
            return;
        this.isFocused.set(false);
    }
    /** Indicates the losing focus is certainly caused by row/cell deletion. */
    _deletion = signal(false);
    /** Resets the active state of the grid if it is empty or stale. */
    resetStateEffect() {
        const hasReset = this.gridBehavior.resetState();
        // If the active state has been reset right after a focusout event, then
        // we know it's caused by a row/cell deletion.
        if (hasReset && this._maybeDeletion()) {
            this._deletion.set(true);
        }
        if (this._maybeDeletion()) {
            this._maybeDeletion.set(false);
        }
    }
    /** Focuses on the active cell element. */
    focusEffect() {
        const activeCell = this.activeCell();
        const hasFocus = this.isFocused();
        const deletion = this._deletion();
        const isRoving = this.inputs.focusMode() === 'roving';
        if (activeCell !== undefined && isRoving && (hasFocus || deletion)) {
            activeCell.element().focus();
            if (deletion) {
                this._deletion.set(false);
            }
        }
    }
}

/** The UI pattern for a grid row. */
class GridRowPattern {
    inputs;
    /** The index of this row within the grid. */
    rowIndex;
    constructor(inputs) {
        this.inputs = inputs;
        this.rowIndex = inputs.rowIndex;
    }
}

/** The UI pattern for a grid cell. */
class GridCellPattern {
    inputs;
    /** A unique identifier for the cell. */
    id;
    /** Whether a cell is disabled. */
    disabled;
    /** Whether the cell is selected. */
    selected;
    /** Whether the cell is selectable. */
    selectable;
    /** The number of rows the cell should span. */
    rowSpan;
    /** The number of columns the cell should span. */
    colSpan;
    /** The `aria-selected` attribute for the cell. */
    ariaSelected = computed(() => this.inputs.grid().inputs.enableSelection() && this.selectable() ? this.selected() : undefined);
    /** The `aria-rowindex` attribute for the cell. */
    ariaRowIndex = computed(() => this.inputs.row().rowIndex() ??
        this.inputs.rowIndex() ??
        this.inputs.grid().gridBehavior.rowIndex(this));
    /** The `aria-colindex` attribute for the cell. */
    ariaColIndex = computed(() => this.inputs.colIndex() ?? this.inputs.grid().gridBehavior.colIndex(this));
    /** The html element that should receive focus. */
    element = computed(() => this.inputs.widget()?.element() ?? this.inputs.element());
    /** Whether the cell is active. */
    active = computed(() => this.inputs.grid().activeCell() === this);
    /** The internal tab index calculation for the cell. */
    _tabIndex = computed(() => this.inputs.grid().gridBehavior.cellTabIndex(this));
    /** The `tabindex` for the cell. If the cell contains a widget, the cell's tabindex is -1. */
    tabIndex = computed(() => this.inputs.widget() !== undefined ? -1 : this._tabIndex());
    /** Whether the widget within the cell is activated. */
    widgetActivated = computed(() => this.inputs.widget()?.inputs.activate() ?? false);
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.disabled = inputs.disabled;
        this.rowSpan = inputs.rowSpan;
        this.colSpan = inputs.colSpan;
        this.selected = inputs.selected;
        this.selectable = inputs.selectable;
    }
    /** Gets the `tabindex` for the widget within the cell. */
    widgetTabIndex() {
        return this._tabIndex();
    }
}

/** The UI pattern for a widget inside a grid cell. */
class GridCellWidgetPattern {
    inputs;
    /** The html element that should receive focus. */
    element;
    /** The `tabindex` for the widget. */
    tabIndex = computed(() => this.inputs.cell().widgetTabIndex());
    /** Whether the widget is in an active state (i.e. its containing cell is active). */
    active = computed(() => this.inputs.cell().active());
    constructor(inputs) {
        this.inputs = inputs;
        this.element = inputs.element;
    }
}

export { GridCellPattern, GridCellWidgetPattern, GridPattern, GridRowPattern, KeyboardEventManager, Modifier, PointerEventManager };
//# sourceMappingURL=_widget-chunk.mjs.map
