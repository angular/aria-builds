import * as _angular_core from '@angular/core';
import { Signal } from '@angular/core';
import * as _angular_cdk_bidi from '@angular/cdk/bidi';
import { GridPattern, GridRowPattern, GridCellPattern, GridCellWidgetPattern } from './_grid-chunk.js';

/** A directive that provides grid-based navigation and selection behavior. */
declare class Grid {
    /** A reference to the host element. */
    private readonly _elementRef;
    /** The rows that make up the grid. */
    private readonly _rows;
    /** The UI patterns for the rows in the grid. */
    private readonly _rowPatterns;
    /** Text direction. */
    readonly textDirection: _angular_core.WritableSignal<_angular_cdk_bidi.Direction>;
    /** The host native element. */
    readonly element: Signal<any>;
    /** Whether selection is enabled for the grid. */
    readonly enableSelection: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the grid is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether to allow disabled items to receive focus. */
    readonly softDisabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The focus strategy used by the grid. */
    readonly focusMode: _angular_core.InputSignal<"roving" | "activedescendant">;
    /** The wrapping behavior for keyboard navigation along the row axis. */
    readonly rowWrap: _angular_core.InputSignal<"continuous" | "loop" | "nowrap">;
    /** The wrapping behavior for keyboard navigation along the column axis. */
    readonly colWrap: _angular_core.InputSignal<"continuous" | "loop" | "nowrap">;
    /** Whether multiple cells in the grid can be selected. */
    readonly multi: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The selection strategy used by the grid. */
    readonly selectionMode: _angular_core.InputSignal<"follow" | "explicit">;
    /** Whether enable range selections (with modifier keys or dragging). */
    readonly enableRangeSelection: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** The UI pattern for the grid. */
    readonly _pattern: GridPattern;
    constructor();
    /** Gets the cell pattern for a given element. */
    private _getCell;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<Grid, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<Grid, "[ngGrid]", ["ngGrid"], { "enableSelection": { "alias": "enableSelection"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "softDisabled": { "alias": "softDisabled"; "required": false; "isSignal": true; }; "focusMode": { "alias": "focusMode"; "required": false; "isSignal": true; }; "rowWrap": { "alias": "rowWrap"; "required": false; "isSignal": true; }; "colWrap": { "alias": "colWrap"; "required": false; "isSignal": true; }; "multi": { "alias": "multi"; "required": false; "isSignal": true; }; "selectionMode": { "alias": "selectionMode"; "required": false; "isSignal": true; }; "enableRangeSelection": { "alias": "enableRangeSelection"; "required": false; "isSignal": true; }; }, {}, ["_rows"], never, true, never>;
}
/** A directive that represents a row in a grid. */
declare class GridRow {
    /** A reference to the host element. */
    private readonly _elementRef;
    /** The cells that make up this row. */
    private readonly _cells;
    /** The UI patterns for the cells in this row. */
    private readonly _cellPatterns;
    /** The parent grid. */
    private readonly _grid;
    /** The parent grid UI pattern. */
    readonly grid: Signal<GridPattern>;
    /** The host native element. */
    readonly element: Signal<any>;
    /** The ARIA role for the row. */
    readonly role: _angular_core.InputSignal<"row" | "rowheader">;
    /** The index of this row within the grid. */
    readonly rowIndex: _angular_core.InputSignal<number | undefined>;
    /** The UI pattern for the grid row. */
    readonly _pattern: GridRowPattern;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<GridRow, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<GridRow, "[ngGridRow]", ["ngGridRow"], { "role": { "alias": "role"; "required": false; "isSignal": true; }; "rowIndex": { "alias": "rowIndex"; "required": false; "isSignal": true; }; }, {}, ["_cells"], never, true, never>;
}
/** A directive that represents a cell in a grid. */
declare class GridCell {
    /** A reference to the host element. */
    private readonly _elementRef;
    /** The widget contained within this cell, if any. */
    private readonly _widgets;
    /** The UI pattern for the widget in this cell. */
    private readonly _widgetPattern;
    /** The parent row. */
    private readonly _row;
    /** A unique identifier for the cell. */
    private readonly _id;
    /** The host native element. */
    readonly element: Signal<any>;
    /** The ARIA role for the cell. */
    readonly role: _angular_core.InputSignal<"gridcell" | "columnheader">;
    /** The number of rows the cell should span. */
    readonly rowSpan: _angular_core.InputSignal<number>;
    /** The number of columns the cell should span. */
    readonly colSpan: _angular_core.InputSignal<number>;
    /** The index of this cell's row within the grid. */
    readonly rowIndex: _angular_core.InputSignal<number | undefined>;
    /** The index of this cell's column within the grid. */
    readonly colIndex: _angular_core.InputSignal<number | undefined>;
    /** Whether the cell is disabled. */
    readonly disabled: _angular_core.InputSignalWithTransform<boolean, unknown>;
    /** Whether the cell is selected. */
    readonly selected: _angular_core.ModelSignal<boolean>;
    /** Whether the cell is selectable. */
    readonly selectable: _angular_core.InputSignal<boolean>;
    /** The UI pattern for the grid cell. */
    readonly _pattern: GridCellPattern;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<GridCell, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<GridCell, "[ngGridCell]", ["ngGridCell"], { "role": { "alias": "role"; "required": false; "isSignal": true; }; "rowSpan": { "alias": "rowSpan"; "required": false; "isSignal": true; }; "colSpan": { "alias": "colSpan"; "required": false; "isSignal": true; }; "rowIndex": { "alias": "rowIndex"; "required": false; "isSignal": true; }; "colIndex": { "alias": "colIndex"; "required": false; "isSignal": true; }; "disabled": { "alias": "disabled"; "required": false; "isSignal": true; }; "selected": { "alias": "selected"; "required": false; "isSignal": true; }; "selectable": { "alias": "selectable"; "required": false; "isSignal": true; }; }, { "selected": "selectedChange"; }, ["_widgets"], never, true, never>;
}
/** A directive that represents a widget inside a grid cell. */
declare class GridCellWidget {
    /** A reference to the host element. */
    private readonly _elementRef;
    /** The parent cell. */
    private readonly _cell;
    /** The host native element. */
    readonly element: Signal<any>;
    /** Whether the widget is activated and the grid navigation should be paused. */
    readonly activate: _angular_core.ModelSignal<boolean>;
    /** The UI pattern for the grid cell widget. */
    readonly _pattern: GridCellWidgetPattern;
    /** Focuses the widget. */
    focus(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<GridCellWidget, never>;
    static ɵdir: _angular_core.ɵɵDirectiveDeclaration<GridCellWidget, "[ngGridCellWidget]", ["ngGridCellWidget"], { "activate": { "alias": "activate"; "required": false; "isSignal": true; }; }, { "activate": "activateChange"; }, never, never, true, never>;
}

export { Grid, GridCell, GridCellWidget, GridRow };
