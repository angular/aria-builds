export { AccordionGroupPattern, AccordionTriggerPattern } from './_accordion-chunk.mjs';
export { ComboboxDialogPattern, ComboboxPattern } from './_combobox-chunk.mjs';
export { ComboboxListboxPattern, ListboxPattern, OptionPattern } from './_combobox-listbox-chunk.mjs';
export { ComboboxTreePattern, TreeItemPattern, TreePattern } from './_combobox-tree-chunk.mjs';
export { DeferredContent, DeferredContentAware } from './_deferred-content-chunk.mjs';
export { GridCellPattern, GridCellWidgetPattern, GridPattern, GridRowPattern, resolveElement } from './_widget-chunk.mjs';
export { MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern } from './_menu-chunk.mjs';
import { computed, signal, untracked } from '@angular/core';
import { KeyboardEventManager } from './_signal-like-chunk.mjs';
export { computed, convertGetterSetterToWritableSignalLike, linkedSignal, signal } from './_signal-like-chunk.mjs';
import { ClickEventManager } from './_click-event-manager-chunk.mjs';
export { TabListPattern, TabPanelPattern, TabPattern } from './_tabs-chunk.mjs';
export { ToolbarPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern } from './_toolbar-widget-group-chunk.mjs';
export { sortDirectives } from './_element-chunk.mjs';
export { untracked } from '@angular/core/primitives/signals';
import './_expansion-chunk.mjs';
import './_list-navigation-chunk.mjs';
import './_list-chunk.mjs';
import './_list-typeahead-chunk.mjs';

class SimpleComboboxPattern {
  inputs;
  isExpanded = computed(() => this.inputs.alwaysExpanded() || this.inputs.expanded());
  value;
  element = () => this.inputs.element();
  disabled = () => this.inputs.disabled();
  inlineSuggestion = () => this.inputs.inlineSuggestion();
  activeDescendant = computed(() => this.inputs.popup()?.activeDescendant());
  popupId = computed(() => this.inputs.popup()?.popupId());
  popupType = computed(() => this.inputs.popup()?.popupType());
  autocomplete = computed(() => {
    const popupType = this.popupType();
    const hasAutocompletePopup = !!this.inputs.popup() && popupType !== 'dialog';
    const hasInlineSuggestion = !!this.inlineSuggestion();
    if (hasAutocompletePopup && hasInlineSuggestion) {
      return 'both';
    }
    if (hasAutocompletePopup) {
      return 'list';
    }
    if (hasInlineSuggestion) {
      return 'inline';
    }
    return 'none';
  });
  keyboardEventRelay = signal(undefined);
  isFocused = signal(false);
  isDeleting = signal(false);
  isEditable = computed(() => this.element().tagName.toLowerCase() === 'input' || this.element().tagName.toLowerCase() === 'textarea');
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    if (!this.isExpanded()) {
      manager.on('ArrowDown', () => this.inputs.expanded.set(true));
      if (!this.isEditable()) {
        manager.on(/^(Enter| )$/, () => this.inputs.expanded.set(true));
      }
      return manager;
    }
    manager.on('ArrowLeft', e => {
      this.keyboardEventRelay.set(e);
    }, {
      preventDefault: this.popupType() !== 'listbox',
      ignoreRepeat: false
    }).on('ArrowRight', e => {
      this.keyboardEventRelay.set(e);
    }, {
      preventDefault: this.popupType() !== 'listbox',
      ignoreRepeat: false
    }).on('ArrowUp', e => this.keyboardEventRelay.set(e), {
      ignoreRepeat: false
    }).on('ArrowDown', e => this.keyboardEventRelay.set(e), {
      ignoreRepeat: false
    }).on('Home', e => this.keyboardEventRelay.set(e)).on('End', e => this.keyboardEventRelay.set(e)).on('Enter', e => this.keyboardEventRelay.set(e)).on('PageUp', e => this.keyboardEventRelay.set(e)).on('PageDown', e => this.keyboardEventRelay.set(e)).on('Escape', () => {
      if (!this.inputs.alwaysExpanded()) {
        this.inputs.expanded.set(false);
      }
    });
    if (!this.isEditable()) {
      manager.on(' ', e => this.keyboardEventRelay.set(e)).on(/^.$/, e => {
        this.keyboardEventRelay.set(e);
      });
    }
    return manager;
  });
  click = computed(() => {
    const manager = new ClickEventManager();
    if (this.isEditable()) return manager;
    manager.on(() => this.inputs.expanded.update(v => !v));
    return manager;
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.value = inputs.value;
  }
  onKeydown(event) {
    if (!this.inputs.disabled()) {
      this.keydown().handle(event);
    }
  }
  onClick(event) {
    if (!this.disabled()) {
      this.click().handle(event);
    }
  }
  onFocusin() {
    this.isFocused.set(true);
  }
  onFocusout(event) {
    this.isFocused.set(false);
  }
  onInput(event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (this.disabled()) return;
    this.inputs.expanded.set(true);
    this.value.set(event.target.value);
    this.isDeleting.set(event instanceof InputEvent && !!event.inputType.match(/^delete/));
  }
  highlightEffect() {
    const value = this.value();
    const inlineSuggestion = this.inlineSuggestion();
    const isDeleting = untracked(() => this.isDeleting());
    const isFocused = untracked(() => this.isFocused());
    const isExpanded = this.isExpanded();
    if (!inlineSuggestion || !isFocused || !isExpanded || isDeleting) return;
    const inputEl = this.element();
    const isHighlightable = inlineSuggestion.toLowerCase().startsWith(value.toLowerCase());
    if (isHighlightable) {
      inputEl.value = value + inlineSuggestion.slice(value.length);
      inputEl.setSelectionRange(value.length, inlineSuggestion.length);
    }
  }
  keyboardEventRelayEffect() {
    const event = this.keyboardEventRelay();
    if (event === undefined) return;
    const popup = untracked(() => this.inputs.popup());
    const popupExpanded = untracked(() => this.isExpanded());
    if (popupExpanded) {
      popup?.controlTarget()?.dispatchEvent(event);
    }
  }
  closePopupOnBlurEffect() {
    const expanded = this.isExpanded();
    const comboboxFocused = this.isFocused();
    const popupFocused = !!this.inputs.popup()?.isFocused();
    if (expanded && !this.inputs.alwaysExpanded() && !comboboxFocused && !popupFocused) {
      this.inputs.expanded.set(false);
    }
  }
}
class SimpleComboboxPopupPattern {
  inputs;
  popupType = () => this.inputs.popupType();
  controlTarget = () => this.inputs.controlTarget();
  activeDescendant = () => this.inputs.activeDescendant();
  popupId = () => this.inputs.popupId();
  isFocused = signal(false);
  constructor(inputs) {
    this.inputs = inputs;
  }
  onFocusin() {
    this.isFocused.set(true);
  }
  onFocusout(event) {
    const focusTarget = event.relatedTarget;
    if (this.controlTarget()?.contains(focusTarget)) return;
    this.isFocused.set(false);
  }
}

export { SimpleComboboxPattern, SimpleComboboxPopupPattern };
//# sourceMappingURL=private.mjs.map
