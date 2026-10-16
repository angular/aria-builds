export { ListboxInputs, ListboxPattern, OptionInputs, OptionPattern } from './_listbox-chunk.js';
export { MenuBarInputs, MenuBarPattern, MenuInputs, MenuItemInputs, MenuItemPattern, MenuPattern, MenuTriggerInputs, MenuTriggerPattern } from './_menu-chunk.js';
export { SignalLike, WritableSignalLike, computed, convertGetterSetterToWritableSignalLike, linkedSignal, signal } from './_signal-like-chunk.js';
export { TabInputs, TabListInputs, TabListPattern, TabPanelInputs, TabPanelPattern, TabPattern } from './_tabs-chunk.js';
export { ToolbarInputs, ToolbarPattern, ToolbarWidgetGroupInputs, ToolbarWidgetGroupPattern, ToolbarWidgetInputs, ToolbarWidgetPattern } from './_toolbar-chunk.js';
export { AccordionGroupInputs, AccordionGroupPattern, AccordionTriggerInputs, AccordionTriggerPattern } from './_accordion-chunk.js';
export { TreeInputs, TreeItemInputs, TreeItemPattern, TreePattern } from './_tree-chunk.js';
export { ElementResolver, GridCellInputs, GridCellPattern, GridCellWidgetInputs, GridCellWidgetPattern, GridInputs, GridPattern, GridRowInputs, GridRowPattern, resolveElement } from './_grid-chunk.js';
export { DeferredContent, DeferredContentAware } from './_deferred-content-chunk.js';
export { HasElement, SortedCollection, sortDirectives } from './_collection-chunk.js';
export { ComboboxInputs, ComboboxPattern, ComboboxPopupInputs, ComboboxPopupPattern } from './_combobox-chunk.js';
export { untracked } from '@angular/core/primitives/signals';
import './_list-chunk.js';
import './_list-navigation-chunk.js';
import './_keyboard-event-manager-chunk.js';
import './_click-event-manager-chunk.js';
import './_expansion-chunk.js';
import '@angular/core';

/**
 * Transform function for tabIndex inputs.
 * Returns undefined if the value is undefined, otherwise converts it to a number.
 */
declare function tabIndexTransform(v: string | number | undefined): number | undefined;

/** Logs each of the violations to the console as errors, optionally with the host element context. */
declare function reportViolations(violations: string[], element: Element): void;

export { reportViolations, tabIndexTransform };
