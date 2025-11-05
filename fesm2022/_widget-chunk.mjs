import { computed, signal, linkedSignal } from '@angular/core';

var Modifier;
(function (Modifier) {
  Modifier[Modifier["None"] = 0] = "None";
  Modifier[Modifier["Ctrl"] = 1] = "Ctrl";
  Modifier[Modifier["Shift"] = 2] = "Shift";
  Modifier[Modifier["Alt"] = 4] = "Alt";
  Modifier[Modifier["Meta"] = 8] = "Meta";
  Modifier["Any"] = "Any";
})(Modifier || (Modifier = {}));
class EventManager {
  configs = [];
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
function getModifiers(event) {
  return (+event.ctrlKey && Modifier.Ctrl) | (+event.shiftKey && Modifier.Shift) | (+event.altKey && Modifier.Alt) | (+event.metaKey && Modifier.Meta);
}
function hasModifiers(event, modifiers) {
  const eventModifiers = getModifiers(event);
  const modifiersList = Array.isArray(modifiers) ? modifiers : [modifiers];
  if (modifiersList.includes(Modifier.Any)) {
    return true;
  }
  return modifiersList.some(modifiers => eventModifiers === modifiers);
}

class KeyboardEventManager extends EventManager {
  options = {
    preventDefault: true,
    stopPropagation: true
  };
  on(...args) {
    const {
      modifiers,
      key,
      handler,
      options
    } = this._normalizeInputs(...args);
    this.configs.push({
      handler: handler,
      matcher: event => this._isMatch(event, key, modifiers),
      ...this.options,
      ...options
    });
    return this;
  }
  _normalizeInputs(...args) {
    const withModifiers = Array.isArray(args[0]) || args[0] in Modifier;
    const modifiers = withModifiers ? args[0] : Modifier.None;
    const key = withModifiers ? args[1] : args[0];
    const handler = withModifiers ? args[2] : args[1];
    const options = withModifiers ? args[3] : args[2];
    return {
      key: key,
      handler: handler,
      modifiers: modifiers,
      options: options ?? {}
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

var MouseButton;
(function (MouseButton) {
  MouseButton[MouseButton["Main"] = 0] = "Main";
  MouseButton[MouseButton["Auxiliary"] = 1] = "Auxiliary";
  MouseButton[MouseButton["Secondary"] = 2] = "Secondary";
})(MouseButton || (MouseButton = {}));
class PointerEventManager extends EventManager {
  options = {
    preventDefault: false,
    stopPropagation: false
  };
  on(...args) {
    const {
      button,
      handler,
      modifiers
    } = this._normalizeInputs(...args);
    this.configs.push({
      handler,
      matcher: event => this._isMatch(event, button, modifiers),
      ...this.options
    });
    return this;
  }
  _normalizeInputs(...args) {
    if (args.length === 3) {
      return {
        button: args[0],
        modifiers: args[1],
        handler: args[2]
      };
    }
    if (args.length === 2) {
      return {
        button: MouseButton.Main,
        modifiers: args[0],
        handler: args[1]
      };
    }
    return {
      button: MouseButton.Main,
      modifiers: Modifier.None,
      handler: args[0]
    };
  }
  _isMatch(event, button, modifiers) {
    return button === (event.button ?? 0) && hasModifiers(event, modifiers);
  }
}

class GridData {
  inputs;
  cells;
  maxRowCount = computed(() => Math.max(...this._rowCountByCol().values(), 0));
  maxColCount = computed(() => Math.max(...this._colCountsByRow().values(), 0));
  _coordsMap = computed(() => {
    const coordsMap = new Map();
    const visitedCoords = new Set();
    for (let rowIndex = 0; rowIndex < this.cells().length; rowIndex++) {
      let colIndex = 0;
      const row = this.cells()[rowIndex];
      for (const cell of row) {
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
            spanCoords.push({
              row,
              col
            });
          }
        }
        coordsMap.set(cell, {
          coords: spanCoords[0],
          spanCoords
        });
        colIndex += colspan;
      }
    }
    return coordsMap;
  });
  _cellMap = computed(() => {
    const cellMap = new Map();
    for (const [cell, {
      spanCoords
    }] of this._coordsMap().entries()) {
      for (const {
        row,
        col
      } of spanCoords) {
        cellMap.set(`${row}:${col}`, cell);
      }
    }
    return cellMap;
  });
  _colCountsByRow = computed(() => {
    const colCountByRow = new Map();
    for (const [_, {
      spanCoords
    }] of this._coordsMap().entries()) {
      for (const {
        row,
        col
      } of spanCoords) {
        const colCount = colCountByRow.get(row);
        const newColCount = col + 1;
        if (colCount === undefined || colCount < newColCount) {
          colCountByRow.set(row, newColCount);
        }
      }
    }
    return colCountByRow;
  });
  _rowCountByCol = computed(() => {
    const rowCountByCol = new Map();
    for (const [_, {
      spanCoords
    }] of this._coordsMap().entries()) {
      for (const {
        row,
        col
      } of spanCoords) {
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
  getCell(rowCol) {
    return this._cellMap().get(`${rowCol.row}:${rowCol.col}`);
  }
  getCoords(cell) {
    return this._coordsMap().get(cell)?.coords;
  }
  getAllCoords(cell) {
    return this._coordsMap().get(cell)?.spanCoords;
  }
  getRowCount(col) {
    return this._rowCountByCol().get(col);
  }
  getColCount(row) {
    return this._colCountsByRow().get(row);
  }
}

class GridFocus {
  inputs;
  activeCell = signal(undefined);
  activeCoords = signal({
    row: -1,
    col: -1
  });
  stateEmpty = computed(() => this.activeCell() === undefined || this.activeCoords().row === -1 && this.activeCoords().col === -1);
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
  activeDescendant = computed(() => {
    if (this.gridDisabled() || this.inputs.focusMode() === 'roving') {
      return undefined;
    }
    const currentActiveCell = this.activeCell();
    return currentActiveCell ? currentActiveCell.id() : undefined;
  });
  gridDisabled = computed(() => {
    if (this.inputs.disabled()) {
      return true;
    }
    const gridCells = this.inputs.grid.cells();
    return gridCells.length === 0 || gridCells.every(row => row.every(cell => cell.disabled()));
  });
  gridTabIndex = computed(() => {
    if (this.gridDisabled()) {
      return 0;
    }
    return this.inputs.focusMode() === 'activedescendant' ? 0 : -1;
  });
  constructor(inputs) {
    this.inputs = inputs;
  }
  getCellTabIndex(cell) {
    if (this.gridDisabled()) {
      return -1;
    }
    if (this.inputs.focusMode() === 'activedescendant') {
      return -1;
    }
    return this.activeCell() === cell ? 0 : -1;
  }
  isFocusable(cell) {
    return !cell.disabled() || this.inputs.softDisabled();
  }
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

const direction = {
  Up: {
    row: -1
  },
  Down: {
    row: 1
  },
  Left: {
    col: -1
  },
  Right: {
    col: 1
  }
};
class GridNavigation {
  inputs;
  _maxSteps = computed(() => this.inputs.grid.maxRowCount() * this.inputs.grid.maxColCount());
  constructor(inputs) {
    this.inputs = inputs;
  }
  gotoCell(cell) {
    return this.inputs.gridFocus.focusCell(cell);
  }
  gotoCoords(coords) {
    return this.inputs.gridFocus.focusCoordinates(coords);
  }
  peek(direction, fromCoords, wrap, allowDisabled) {
    wrap = wrap ?? (direction.row !== undefined ? this.inputs.rowWrap() : this.inputs.colWrap());
    return this._peekDirectional(direction, fromCoords, wrap, allowDisabled);
  }
  advance(direction) {
    const nextCoords = this.peek(direction, this.inputs.gridFocus.activeCoords());
    return !!nextCoords && this.gotoCoords(nextCoords);
  }
  peekFirst(row, allowDisabled) {
    const fromCoords = {
      row: row ?? 0,
      col: -1
    };
    return row === undefined ? this._peekDirectional(direction.Right, fromCoords, 'continuous', allowDisabled) : this._peekDirectional(direction.Right, fromCoords, 'nowrap', allowDisabled);
  }
  first(row) {
    const nextCoords = this.peekFirst(row);
    return !!nextCoords && this.gotoCoords(nextCoords);
  }
  peekLast(row, allowDisabled) {
    const fromCoords = {
      row: row ?? this.inputs.grid.maxRowCount() - 1,
      col: this.inputs.grid.maxColCount()
    };
    return row === undefined ? this._peekDirectional(direction.Left, fromCoords, 'continuous', allowDisabled) : this._peekDirectional(direction.Left, fromCoords, 'nowrap', allowDisabled);
  }
  last(row) {
    const nextCoords = this.peekLast(row);
    return !!nextCoords && this.gotoCoords(nextCoords);
  }
  _peekDirectional(delta, fromCoords, wrap, allowDisabled = false) {
    if (this.inputs.gridFocus.gridDisabled()) return undefined;
    const fromCell = this.inputs.grid.getCell(fromCoords);
    const maxRowCount = this.inputs.grid.maxRowCount();
    const maxColCount = this.inputs.grid.maxColCount();
    const rowDelta = delta.row ?? 0;
    const colDelta = delta.col ?? 0;
    let nextCoords = {
      ...fromCoords
    };
    for (let step = 0; step < this._maxSteps(); step++) {
      const isWrapping = nextCoords.col + colDelta < 0 || nextCoords.col + colDelta >= maxColCount || nextCoords.row + rowDelta < 0 || nextCoords.row + rowDelta >= maxRowCount;
      if (wrap === 'nowrap' && isWrapping) return;
      if (wrap === 'continuous') {
        const generalDelta = delta.row ?? delta.col;
        const rowStep = isWrapping ? generalDelta : rowDelta;
        const colStep = isWrapping ? generalDelta : colDelta;
        nextCoords = {
          row: (nextCoords.row + rowStep + maxRowCount) % maxRowCount,
          col: (nextCoords.col + colStep + maxColCount) % maxColCount
        };
      }
      if (wrap === 'loop') {
        nextCoords = {
          row: (nextCoords.row + rowDelta + maxRowCount) % maxRowCount,
          col: (nextCoords.col + colDelta + maxColCount) % maxColCount
        };
      }
      if (wrap === 'nowrap') {
        nextCoords = {
          row: nextCoords.row + rowDelta,
          col: nextCoords.col + colDelta
        };
      }
      if (nextCoords.row === fromCoords.row && nextCoords.col === fromCoords.col) {
        return undefined;
      }
      const nextCell = this.inputs.grid.getCell(nextCoords);
      if (nextCell !== undefined && nextCell !== fromCell && (allowDisabled || this.inputs.gridFocus.isFocusable(nextCell))) {
        return nextCoords;
      }
    }
    return undefined;
  }
}

class GridSelection {
  inputs;
  _undoList = signal([]);
  constructor(inputs) {
    this.inputs = inputs;
  }
  undo() {
    for (const [cell, oldState] of this._undoList()) {
      cell.selected.set(oldState);
    }
    this._undoList.set([]);
  }
  select(fromCoords, toCoords) {
    this._updateState(fromCoords, toCoords ?? fromCoords, () => true);
  }
  deselect(fromCoords, toCoords) {
    this._updateState(fromCoords, toCoords ?? fromCoords, () => false);
  }
  toggle(fromCoords, toCoords) {
    this._updateState(fromCoords, toCoords ?? fromCoords, oldState => !oldState);
  }
  selectAll() {
    this._updateState({
      row: 0,
      col: 0
    }, {
      row: this.inputs.grid.maxRowCount(),
      col: this.inputs.grid.maxColCount()
    }, () => true);
  }
  deselectAll() {
    this._updateState({
      row: 0,
      col: 0
    }, {
      row: this.inputs.grid.maxRowCount(),
      col: this.inputs.grid.maxColCount()
    }, () => false);
  }
  isSelectable(cell) {
    return cell.selectable() && !cell.disabled();
  }
  *_validCells(fromCoords, toCoords) {
    const startRow = Math.min(fromCoords.row, toCoords.row);
    const startCol = Math.min(fromCoords.col, toCoords.col);
    const endRow = Math.max(fromCoords.row, toCoords.row);
    const endCol = Math.max(fromCoords.col, toCoords.col);
    const visited = new Set();
    for (let row = startRow; row < endRow + 1; row++) {
      for (let col = startCol; col < endCol + 1; col++) {
        const cell = this.inputs.grid.getCell({
          row,
          col
        });
        if (cell === undefined) continue;
        if (!this.isSelectable(cell)) continue;
        if (visited.has(cell)) continue;
        visited.add(cell);
        yield cell;
      }
    }
  }
  _updateState(fromCoords, toCoords, stateFn) {
    const undoList = [];
    for (const cell of this._validCells(fromCoords, toCoords)) {
      const oldState = cell.selected();
      undoList.push([cell, oldState]);
      cell.selected.set(stateFn(oldState));
    }
    this._undoList.set(undoList);
  }
}

class Grid {
  inputs;
  data;
  focusBehavior;
  navigationBehavior;
  selectionBehavior;
  selectionAnchor = linkedSignal(() => this.focusBehavior.activeCoords());
  selectionAnchorCell = computed(() => this.data.getCell(this.selectionAnchor()));
  selectionStabled = signal(true);
  allSelected = computed(() => this.data.cells().flat().filter(c => this.selectionBehavior.isSelectable(c)).every(c => c.selected()));
  gridTabIndex = () => this.focusBehavior.gridTabIndex();
  gridDisabled = () => this.focusBehavior.gridDisabled();
  activeDescendant = () => this.focusBehavior.activeDescendant();
  constructor(inputs) {
    this.inputs = inputs;
    this.data = new GridData(inputs);
    this.focusBehavior = new GridFocus({
      ...inputs,
      grid: this.data
    });
    this.navigationBehavior = new GridNavigation({
      ...inputs,
      grid: this.data,
      gridFocus: this.focusBehavior
    });
    this.selectionBehavior = new GridSelection({
      ...inputs,
      grid: this.data,
      gridFocus: this.focusBehavior
    });
  }
  rowIndex(cell) {
    const index = this.data.getCoords(cell)?.row;
    return index !== undefined ? index + 1 : undefined;
  }
  colIndex(cell) {
    const index = this.data.getCoords(cell)?.col;
    return index !== undefined ? index + 1 : undefined;
  }
  cellTabIndex(cell) {
    return this.focusBehavior.getCellTabIndex(cell);
  }
  up(opts = {}) {
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.navigationBehavior.peek(direction.Up, this.selectionAnchor(), 'nowrap', true)) : this.navigationBehavior.advance(direction.Up), opts);
  }
  down(opts = {}) {
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.navigationBehavior.peek(direction.Down, this.selectionAnchor(), 'nowrap', true)) : this.navigationBehavior.advance(direction.Down), opts);
  }
  left(opts = {}) {
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.navigationBehavior.peek(direction.Left, this.selectionAnchor(), 'nowrap', true)) : this.navigationBehavior.advance(direction.Left), opts);
  }
  right(opts = {}) {
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.navigationBehavior.peek(direction.Right, this.selectionAnchor(), 'nowrap', true)) : this.navigationBehavior.advance(direction.Right), opts);
  }
  first(opts = {}) {
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.navigationBehavior.peekFirst(undefined, true)) : this.navigationBehavior.first(), opts);
  }
  firstInRow(opts = {}) {
    const row = this.focusBehavior.activeCoords().row;
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.navigationBehavior.peekFirst(row, true)) : this.navigationBehavior.first(row), opts);
  }
  last(opts = {}) {
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.navigationBehavior.peekLast(undefined, true)) : this.navigationBehavior.last(), opts);
  }
  lastInRow(opts = {}) {
    const row = this.focusBehavior.activeCoords().row;
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.navigationBehavior.peekLast(row, true)) : this.navigationBehavior.last(row), opts);
  }
  selectRow() {
    const row = this.focusBehavior.activeCoords().row;
    this.selectionBehavior.deselectAll();
    this.selectionBehavior.select({
      row,
      col: 0
    }, {
      row,
      col: this.data.maxColCount()
    });
  }
  selectCol() {
    const col = this.focusBehavior.activeCoords().col;
    this.selectionBehavior.deselectAll();
    this.selectionBehavior.select({
      row: 0,
      col
    }, {
      row: this.data.maxRowCount(),
      col
    });
  }
  select() {
    this.selectionBehavior.select(this.focusBehavior.activeCoords());
  }
  deselect() {
    this.selectionBehavior.deselect(this.focusBehavior.activeCoords());
  }
  toggle() {
    this.selectionBehavior.toggle(this.focusBehavior.activeCoords());
  }
  toggleOne() {
    const selected = !!this.focusBehavior.activeCell()?.selected();
    if (selected) {
      this.deselect();
      return;
    }
    this.deselectAll();
    this.select();
  }
  selectAll() {
    this.selectionBehavior.selectAll();
  }
  deselectAll() {
    this.selectionBehavior.deselectAll();
  }
  gotoCell(cell, opts = {}) {
    return this._navigateWithSelection(() => opts.anchor ? this._updateSelectionAnchor(() => this.data.getCoords(cell)) : this.navigationBehavior.gotoCell(cell), opts);
  }
  setDefaultState() {
    const focusableSelectedCell = this.data.cells().flat().filter(c => this.focusBehavior.isFocusable(c)).find(c => c.selected());
    if (focusableSelectedCell !== undefined) {
      this.focusBehavior.focusCell(focusableSelectedCell);
      return true;
    }
    const firstFocusableCoords = this.navigationBehavior.peekFirst();
    if (firstFocusableCoords !== undefined) {
      return this.focusBehavior.focusCoordinates(firstFocusableCoords);
    }
    return false;
  }
  resetState() {
    if (this.focusBehavior.stateEmpty()) {
      return this.setDefaultState();
    }
    if (this.focusBehavior.stateStale()) {
      if (this.focusBehavior.focusCell(this.focusBehavior.activeCell())) {
        return true;
      }
      if (this.focusBehavior.focusCoordinates(this.focusBehavior.activeCoords())) {
        return true;
      }
      if (this.focusBehavior.focusCoordinates(this.navigationBehavior.peekFirst())) {
        return true;
      }
    }
    return false;
  }
  _updateSelectionAnchor(peekFn) {
    const coords = peekFn();
    const success = coords !== undefined;
    if (!success) return false;
    this.selectionAnchor.set(coords);
    return success;
  }
  _updateRangeSelection() {
    if (!this.selectionStabled()) {
      this.selectionBehavior.undo();
    }
    this.selectionBehavior.select(...this._getSelectionCoords(this.focusBehavior.activeCoords(), this.selectionAnchor()));
  }
  _getSelectionCoords(startCoords, endCoords) {
    const startCell = this.data.getCell(startCoords);
    const endCell = this.data.getCell(endCoords);
    const allCoords = [...this.data.getAllCoords(startCell), ...this.data.getAllCoords(endCell)];
    const allRows = allCoords.map(c => c.row);
    const allCols = allCoords.map(c => c.col);
    const fromCoords = {
      row: Math.min(...allRows),
      col: Math.min(...allCols)
    };
    const toCoords = {
      row: Math.max(...allRows),
      col: Math.max(...allCols)
    };
    return [fromCoords, toCoords];
  }
  _navigateWithSelection(op, opts = {}) {
    const success = op();
    if (!success) return false;
    if (opts.anchor) {
      this._updateRangeSelection();
      this.selectionStabled.set(false);
      return success;
    }
    this.selectionStabled.set(true);
    if (opts.select) {
      this.select();
      return success;
    }
    if (opts.selectOne) {
      this.deselectAll();
      this.select();
      return success;
    }
    if (opts.toggle) {
      this.toggle();
      return success;
    }
    if (opts.toggleOne) {
      const selected = !!this.focusBehavior.activeCell()?.selected();
      this.deselectAll();
      if (!selected) {
        this.select();
      }
      return success;
    }
    return success;
  }
}

class GridPattern {
  inputs;
  gridBehavior;
  cells = computed(() => this.gridBehavior.data.cells());
  tabIndex = computed(() => this.gridBehavior.gridTabIndex());
  disabled = computed(() => this.gridBehavior.gridDisabled());
  activeDescendant = computed(() => this.gridBehavior.activeDescendant());
  activeCell = computed(() => this.gridBehavior.focusBehavior.activeCell());
  anchorCell = computed(() => this.inputs.enableSelection() && this.inputs.multi() ? this.gridBehavior.selectionAnchorCell() : undefined);
  pauseNavigation = computed(() => this.gridBehavior.data.cells().flat().reduce((res, c) => res || c.widgetActivated(), false));
  isFocused = signal(false);
  hasBeenFocused = signal(false);
  dragging = signal(false);
  prevColKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
  nextColKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    if (this.pauseNavigation()) {
      return manager;
    }
    const opts = {
      selectOne: this.inputs.enableSelection() && this.inputs.selectionMode() === 'follow'
    };
    manager.on('ArrowUp', () => this.gridBehavior.up(opts)).on('ArrowDown', () => this.gridBehavior.down(opts)).on(this.prevColKey(), () => this.gridBehavior.left(opts)).on(this.nextColKey(), () => this.gridBehavior.right(opts)).on('Home', () => this.gridBehavior.firstInRow(opts)).on('End', () => this.gridBehavior.lastInRow(opts)).on([Modifier.Ctrl], 'Home', () => this.gridBehavior.first(opts)).on([Modifier.Ctrl], 'End', () => this.gridBehavior.last(opts));
    if (this.inputs.enableSelection() && this.inputs.selectionMode() === 'explicit') {
      manager.on('Enter', () => this.inputs.multi() ? this.gridBehavior.toggle() : this.gridBehavior.toggleOne()).on(' ', () => this.inputs.multi() ? this.gridBehavior.toggle() : this.gridBehavior.toggleOne());
    }
    if (this.inputs.enableSelection() && this.inputs.enableRangeSelection()) {
      manager.on(Modifier.Shift, 'ArrowUp', () => this.gridBehavior.up({
        anchor: true
      })).on(Modifier.Shift, 'ArrowDown', () => this.gridBehavior.down({
        anchor: true
      })).on(Modifier.Shift, this.prevColKey(), () => this.gridBehavior.left({
        anchor: true
      })).on(Modifier.Shift, this.nextColKey(), () => this.gridBehavior.right({
        anchor: true
      })).on(Modifier.Shift, 'Home', () => this.gridBehavior.firstInRow({
        anchor: true
      })).on(Modifier.Shift, 'End', () => this.gridBehavior.lastInRow({
        anchor: true
      })).on([Modifier.Ctrl | Modifier.Shift], 'Home', () => this.gridBehavior.first({
        anchor: true
      })).on([Modifier.Ctrl | Modifier.Shift], 'End', () => this.gridBehavior.last({
        anchor: true
      })).on([Modifier.Ctrl, Modifier.Meta], 'A', () => {
        if (this.gridBehavior.allSelected()) {
          this.gridBehavior.deselectAll();
        } else {
          this.gridBehavior.selectAll();
        }
      }).on([Modifier.Shift], ' ', () => this.gridBehavior.selectRow()).on([Modifier.Ctrl, Modifier.Meta], ' ', () => this.gridBehavior.selectCol());
    }
    return manager;
  });
  pointerdown = computed(() => {
    const manager = new PointerEventManager();
    if (!this.inputs.enableSelection()) {
      manager.on(e => {
        const cell = this.inputs.getCell(e.target);
        if (!cell || !this.gridBehavior.focusBehavior.isFocusable(cell)) return;
        this.gridBehavior.gotoCell(cell);
      });
    }
    if (this.inputs.enableSelection()) {
      manager.on(e => {
        const cell = this.inputs.getCell(e.target);
        if (!cell || !this.gridBehavior.focusBehavior.isFocusable(cell)) return;
        this.gridBehavior.gotoCell(cell, {
          selectOne: this.inputs.selectionMode() === 'follow',
          toggleOne: this.inputs.selectionMode() === 'explicit' && !this.inputs.multi(),
          toggle: this.inputs.selectionMode() === 'explicit' && this.inputs.multi()
        });
        if (this.inputs.multi() && this.inputs.enableRangeSelection()) {
          this.dragging.set(true);
        }
      });
      if (this.inputs.multi()) {
        manager.on([Modifier.Ctrl, Modifier.Meta], e => {
          const cell = this.inputs.getCell(e.target);
          if (!cell || !this.gridBehavior.focusBehavior.isFocusable(cell)) return;
          this.gridBehavior.gotoCell(cell, {
            toggle: true
          });
          if (this.inputs.enableRangeSelection()) {
            this.dragging.set(true);
          }
        });
        if (this.inputs.enableRangeSelection()) {
          manager.on(Modifier.Shift, e => {
            const cell = this.inputs.getCell(e.target);
            if (!cell) return;
            this.gridBehavior.gotoCell(cell, {
              anchor: true
            });
            this.dragging.set(true);
          });
        }
      }
    }
    return manager;
  });
  pointerup = computed(() => {
    const manager = new PointerEventManager();
    if (this.inputs.enableSelection() && this.inputs.enableRangeSelection()) {
      manager.on([Modifier.Shift, Modifier.Ctrl, Modifier.Meta, Modifier.None], () => {
        this.dragging.set(false);
      });
    }
    return manager;
  });
  _maybeDeletion = signal(false);
  _deletion = signal(false);
  constructor(inputs) {
    this.inputs = inputs;
    this.gridBehavior = new Grid({
      ...inputs,
      cells: computed(() => this.inputs.rows().map(row => row.inputs.cells()))
    });
  }
  onKeydown(event) {
    if (!this.disabled()) {
      this.keydown().handle(event);
    }
  }
  onPointerdown(event) {
    if (!this.disabled()) {
      this.pointerdown().handle(event);
    }
  }
  onPointermove(event) {
    if (this.disabled()) return;
    if (!this.inputs.enableSelection()) return;
    if (!this.inputs.enableRangeSelection()) return;
    if (!this.dragging()) return;
    const cell = this.inputs.getCell(event.target);
    if (!cell) return;
    this.gridBehavior.gotoCell(cell, {
      anchor: true
    });
  }
  onPointerup(event) {
    if (!this.disabled()) {
      this.pointerup().handle(event);
    }
  }
  onFocusIn() {
    this.isFocused.set(true);
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    const parentEl = this.inputs.element();
    const targetEl = event.relatedTarget;
    if (targetEl === null) {
      this._maybeDeletion.set(true);
    }
    if (parentEl.contains(targetEl)) return;
    this.isFocused.set(false);
  }
  setDefaultStateEffect() {
    if (this.hasBeenFocused()) return;
    this.gridBehavior.setDefaultState();
  }
  resetStateEffect() {
    const hasReset = this.gridBehavior.resetState();
    if (hasReset && this._maybeDeletion()) {
      this._deletion.set(true);
    }
    this._maybeDeletion.set(false);
  }
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

class GridRowPattern {
  inputs;
  rowIndex;
  constructor(inputs) {
    this.inputs = inputs;
    this.rowIndex = inputs.rowIndex;
  }
}

class GridCellPattern {
  inputs;
  id;
  disabled;
  selected;
  selectable;
  rowSpan;
  colSpan;
  ariaSelected = computed(() => this.inputs.grid().inputs.enableSelection() && this.selectable() ? this.selected() : undefined);
  ariaRowIndex = computed(() => this.inputs.row().rowIndex() ?? this.inputs.rowIndex() ?? this.inputs.grid().gridBehavior.rowIndex(this));
  ariaColIndex = computed(() => this.inputs.colIndex() ?? this.inputs.grid().gridBehavior.colIndex(this));
  element = computed(() => this.inputs.widget()?.element() ?? this.inputs.element());
  active = computed(() => this.inputs.grid().activeCell() === this);
  anchor = computed(() => this.inputs.grid().anchorCell() === this ? true : undefined);
  _tabIndex = computed(() => this.inputs.grid().gridBehavior.cellTabIndex(this));
  tabIndex = computed(() => this.inputs.widget() !== undefined ? -1 : this._tabIndex());
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
  widgetTabIndex() {
    return this._tabIndex();
  }
}

class GridCellWidgetPattern {
  inputs;
  element;
  tabIndex = computed(() => this.inputs.cell().widgetTabIndex());
  active = computed(() => this.inputs.cell().active());
  constructor(inputs) {
    this.inputs = inputs;
    this.element = inputs.element;
  }
}

export { GridCellPattern, GridCellWidgetPattern, GridPattern, GridRowPattern, KeyboardEventManager, Modifier, PointerEventManager };
//# sourceMappingURL=_widget-chunk.mjs.map
