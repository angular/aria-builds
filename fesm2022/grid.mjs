import { _IdGenerator } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import { inject, ElementRef, contentChildren, computed, input, booleanAttribute, afterRenderEffect, Directive, contentChild, model } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { GridPattern, GridRowPattern, GridCellPattern, GridCellWidgetPattern } from './_widget-chunk.mjs';

class Grid {
  _elementRef = inject(ElementRef);
  _rows = contentChildren(GridRow, ...(ngDevMode ? [{
    debugName: "_rows",
    descendants: true
  }] : [{
    descendants: true
  }]));
  _rowPatterns = computed(() => this._rows().map(r => r._pattern), ...(ngDevMode ? [{
    debugName: "_rowPatterns"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  enableSelection = input(false, ...(ngDevMode ? [{
    debugName: "enableSelection",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  softDisabled = input(true, ...(ngDevMode ? [{
    debugName: "softDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  focusMode = input('roving', ...(ngDevMode ? [{
    debugName: "focusMode"
  }] : []));
  rowWrap = input('loop', ...(ngDevMode ? [{
    debugName: "rowWrap"
  }] : []));
  colWrap = input('loop', ...(ngDevMode ? [{
    debugName: "colWrap"
  }] : []));
  multi = input(false, ...(ngDevMode ? [{
    debugName: "multi",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  selectionMode = input('follow', ...(ngDevMode ? [{
    debugName: "selectionMode"
  }] : []));
  enableRangeSelection = input(false, ...(ngDevMode ? [{
    debugName: "enableRangeSelection",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  _pattern = new GridPattern({
    ...this,
    rows: this._rowPatterns,
    getCell: e => this._getCell(e)
  });
  constructor() {
    afterRenderEffect(() => this._pattern.setDefaultStateEffect());
    afterRenderEffect(() => this._pattern.resetStateEffect());
    afterRenderEffect(() => this._pattern.focusEffect());
  }
  _getCell(element) {
    const cellElement = element.closest('[ngGridCell]');
    if (cellElement === undefined) return;
    const widgetElement = element.closest('[ngGridCellWidget]');
    for (const row of this._rowPatterns()) {
      for (const cell of row.inputs.cells()) {
        if (cell.element() === cellElement || widgetElement !== undefined && cell.element() === widgetElement) {
          return cell;
        }
      }
    }
    return;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: Grid,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: Grid,
    isStandalone: true,
    selector: "[ngGrid]",
    inputs: {
      enableSelection: {
        classPropertyName: "enableSelection",
        publicName: "enableSelection",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      softDisabled: {
        classPropertyName: "softDisabled",
        publicName: "softDisabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      focusMode: {
        classPropertyName: "focusMode",
        publicName: "focusMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      rowWrap: {
        classPropertyName: "rowWrap",
        publicName: "rowWrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      colWrap: {
        classPropertyName: "colWrap",
        publicName: "colWrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      multi: {
        classPropertyName: "multi",
        publicName: "multi",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selectionMode: {
        classPropertyName: "selectionMode",
        publicName: "selectionMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      enableRangeSelection: {
        classPropertyName: "enableRangeSelection",
        publicName: "enableRangeSelection",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "grid"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "pointermove": "_pattern.onPointermove($event)",
        "pointerup": "_pattern.onPointerup($event)",
        "focusin": "_pattern.onFocusIn()",
        "focusout": "_pattern.onFocusOut($event)"
      },
      properties: {
        "tabindex": "_pattern.tabIndex()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-activedescendant": "_pattern.activeDescendant()"
      },
      classAttribute: "grid"
    },
    queries: [{
      propertyName: "_rows",
      predicate: GridRow,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngGrid"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: Grid,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngGrid]',
      exportAs: 'ngGrid',
      host: {
        'class': 'grid',
        'role': 'grid',
        '[tabindex]': '_pattern.tabIndex()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-activedescendant]': '_pattern.activeDescendant()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(pointermove)': '_pattern.onPointermove($event)',
        '(pointerup)': '_pattern.onPointerup($event)',
        '(focusin)': '_pattern.onFocusIn()',
        '(focusout)': '_pattern.onFocusOut($event)'
      }
    }]
  }],
  ctorParameters: () => []
});
class GridRow {
  _elementRef = inject(ElementRef);
  _cells = contentChildren(GridCell, ...(ngDevMode ? [{
    debugName: "_cells",
    descendants: true
  }] : [{
    descendants: true
  }]));
  _cellPatterns = computed(() => this._cells().map(c => c._pattern), ...(ngDevMode ? [{
    debugName: "_cellPatterns"
  }] : []));
  _grid = inject(Grid);
  grid = computed(() => this._grid._pattern, ...(ngDevMode ? [{
    debugName: "grid"
  }] : []));
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  role = input('row', ...(ngDevMode ? [{
    debugName: "role"
  }] : []));
  rowIndex = input(...(ngDevMode ? [undefined, {
    debugName: "rowIndex"
  }] : []));
  _pattern = new GridRowPattern({
    ...this,
    cells: this._cellPatterns
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: GridRow,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: GridRow,
    isStandalone: true,
    selector: "[ngGridRow]",
    inputs: {
      role: {
        classPropertyName: "role",
        publicName: "role",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      rowIndex: {
        classPropertyName: "rowIndex",
        publicName: "rowIndex",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      properties: {
        "attr.role": "role()"
      },
      classAttribute: "grid-row"
    },
    queries: [{
      propertyName: "_cells",
      predicate: GridCell,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngGridRow"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: GridRow,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngGridRow]',
      exportAs: 'ngGridRow',
      host: {
        'class': 'grid-row',
        '[attr.role]': 'role()'
      }
    }]
  }]
});
class GridCell {
  _elementRef = inject(ElementRef);
  _widgets = contentChild(GridCellWidget, ...(ngDevMode ? [{
    debugName: "_widgets"
  }] : []));
  _widgetPattern = computed(() => this._widgets()?._pattern, ...(ngDevMode ? [{
    debugName: "_widgetPattern"
  }] : []));
  _row = inject(GridRow);
  _id = inject(_IdGenerator).getId('ng-grid-cell-', true);
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  role = input('gridcell', ...(ngDevMode ? [{
    debugName: "role"
  }] : []));
  rowSpan = input(1, ...(ngDevMode ? [{
    debugName: "rowSpan"
  }] : []));
  colSpan = input(1, ...(ngDevMode ? [{
    debugName: "colSpan"
  }] : []));
  rowIndex = input(...(ngDevMode ? [undefined, {
    debugName: "rowIndex"
  }] : []));
  colIndex = input(...(ngDevMode ? [undefined, {
    debugName: "colIndex"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  selected = model(false, ...(ngDevMode ? [{
    debugName: "selected"
  }] : []));
  selectable = input(true, ...(ngDevMode ? [{
    debugName: "selectable"
  }] : []));
  _pattern = new GridCellPattern({
    ...this,
    id: () => this._id,
    grid: this._row.grid,
    row: () => this._row._pattern,
    widget: this._widgetPattern
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: GridCell,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: GridCell,
    isStandalone: true,
    selector: "[ngGridCell]",
    inputs: {
      role: {
        classPropertyName: "role",
        publicName: "role",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      rowSpan: {
        classPropertyName: "rowSpan",
        publicName: "rowSpan",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      colSpan: {
        classPropertyName: "colSpan",
        publicName: "colSpan",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      rowIndex: {
        classPropertyName: "rowIndex",
        publicName: "rowIndex",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      colIndex: {
        classPropertyName: "colIndex",
        publicName: "colIndex",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selected: {
        classPropertyName: "selected",
        publicName: "selected",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selectable: {
        classPropertyName: "selectable",
        publicName: "selectable",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      selected: "selectedChange"
    },
    host: {
      properties: {
        "attr.role": "role()",
        "attr.id": "_pattern.id()",
        "attr.rowspan": "_pattern.rowSpan()",
        "attr.colspan": "_pattern.colSpan()",
        "attr.data-active": "_pattern.active()",
        "attr.data-anchor": "_pattern.anchor()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-rowspan": "_pattern.rowSpan()",
        "attr.aria-colspan": "_pattern.colSpan()",
        "attr.aria-rowindex": "_pattern.ariaRowIndex()",
        "attr.aria-colindex": "_pattern.ariaColIndex()",
        "attr.aria-selected": "_pattern.ariaSelected()",
        "tabindex": "_pattern.tabIndex()"
      },
      classAttribute: "grid-cell"
    },
    queries: [{
      propertyName: "_widgets",
      first: true,
      predicate: GridCellWidget,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngGridCell"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: GridCell,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngGridCell]',
      exportAs: 'ngGridCell',
      host: {
        'class': 'grid-cell',
        '[attr.role]': 'role()',
        '[attr.id]': '_pattern.id()',
        '[attr.rowspan]': '_pattern.rowSpan()',
        '[attr.colspan]': '_pattern.colSpan()',
        '[attr.data-active]': '_pattern.active()',
        '[attr.data-anchor]': '_pattern.anchor()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-rowspan]': '_pattern.rowSpan()',
        '[attr.aria-colspan]': '_pattern.colSpan()',
        '[attr.aria-rowindex]': '_pattern.ariaRowIndex()',
        '[attr.aria-colindex]': '_pattern.ariaColIndex()',
        '[attr.aria-selected]': '_pattern.ariaSelected()',
        '[tabindex]': '_pattern.tabIndex()'
      }
    }]
  }]
});
class GridCellWidget {
  _elementRef = inject(ElementRef);
  _cell = inject(GridCell);
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  activate = model(false, ...(ngDevMode ? [{
    debugName: "activate"
  }] : []));
  _pattern = new GridCellWidgetPattern({
    ...this,
    cell: () => this._cell._pattern
  });
  focus() {
    this.element().focus();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: GridCellWidget,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: GridCellWidget,
    isStandalone: true,
    selector: "[ngGridCellWidget]",
    inputs: {
      activate: {
        classPropertyName: "activate",
        publicName: "activate",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      activate: "activateChange"
    },
    host: {
      properties: {
        "attr.data-active": "_pattern.active()",
        "tabindex": "_pattern.tabIndex()"
      },
      classAttribute: "grid-cell-widget"
    },
    exportAs: ["ngGridCellWidget"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: GridCellWidget,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngGridCellWidget]',
      exportAs: 'ngGridCellWidget',
      host: {
        'class': 'grid-cell-widget',
        '[attr.data-active]': '_pattern.active()',
        '[tabindex]': '_pattern.tabIndex()'
      }
    }]
  }]
});

export { Grid, GridCell, GridCellWidget, GridRow };
//# sourceMappingURL=grid.mjs.map
