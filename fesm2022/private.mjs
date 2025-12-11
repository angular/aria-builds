export { ComboboxDialogPattern, ComboboxPattern } from './_combobox-chunk.mjs';
export { ComboboxListboxPattern, ListboxPattern, OptionPattern } from './_combobox-listbox-chunk.mjs';
export { MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern } from './_menu-chunk.mjs';
export { TabListPattern, TabPanelPattern, TabPattern } from './_tabs-chunk.mjs';
export { ToolbarPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern } from './_toolbar-widget-group-chunk.mjs';
export { AccordionGroupPattern, AccordionPanelPattern, AccordionTriggerPattern } from './_accordion-chunk.mjs';
export { ComboboxTreePattern, TreeItemPattern, TreePattern } from './_combobox-tree-chunk.mjs';
export { GridCellPattern, GridCellWidgetPattern, GridPattern, GridRowPattern } from './_widget-chunk.mjs';
export { DeferredContent, DeferredContentAware } from './_deferred-content-chunk.mjs';
import '@angular/core';
import './_pointer-event-manager-chunk.mjs';
import './_keyboard-event-manager-chunk.mjs';
import './_list-chunk.mjs';
import './_list-navigation-chunk.mjs';
import './_expansion-chunk.mjs';

function convertGetterSetterToWritableSignalLike(getter, setter) {
  return Object.assign(getter, {
    set: setter,
    update: updateCallback => setter(updateCallback(getter()))
  });
}

export { convertGetterSetterToWritableSignalLike };
//# sourceMappingURL=private.mjs.map
