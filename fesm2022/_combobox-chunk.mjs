import { computed, signal, untracked } from '@angular/core';
import { _getEventTarget } from '@angular/cdk/platform';
import { KeyboardEventManager, Modifier } from './_keyboard-event-manager-chunk.mjs';
import { ClickEventManager } from './_click-event-manager-chunk.mjs';

class ComboboxPattern {
  inputs;
  isExpanded = computed(() => this.inputs.alwaysExpanded() || this.inputs.expanded());
  value;
  element = () => this.inputs.element();
  disabled = () => this.inputs.disabled();
  readonly = () => this.inputs.readonly();
  softDisabled = () => this.inputs.softDisabled?.() ?? true;
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
  keyboardEventRelay = signal([]);
  isFocused = signal(false);
  isDeleting = signal(false);
  isEditable = computed(() => this.element().tagName.toLowerCase() === 'input' || this.element().tagName.toLowerCase() === 'textarea');
  ariaReadonly = computed(() => this.readonly() && !this.isEditable() ? 'true' : null);
  nativeReadonly = computed(() => (this.readonly() || this.disabled()) && this.isEditable() ? '' : null);
  nativeDisabled = computed(() => this.disabled() && !this.softDisabled() ? '' : null);
  keydown = computed(() => {
    const manager = new KeyboardEventManager();
    if (!this.isExpanded()) {
      if (!this.readonly()) {
        manager.on('ArrowDown', () => this.inputs.expanded.set(true));
        if (!this.isEditable()) {
          manager.on('Enter', () => this.inputs.expanded.set(true));
          manager.on(' ', () => this.inputs.expanded.set(true));
        }
      }
      return manager;
    }
    manager.on('ArrowLeft', e => {
      this._relayKeydown(e);
    }, {
      preventDefault: this.popupType() !== 'listbox',
      ignoreRepeat: false
    }).on('ArrowRight', e => {
      this._relayKeydown(e);
    }, {
      preventDefault: this.popupType() !== 'listbox',
      ignoreRepeat: false
    }).on('ArrowUp', e => this._relayKeydown(e), {
      ignoreRepeat: false
    }).on('ArrowDown', e => this._relayKeydown(e), {
      ignoreRepeat: false
    }).on(Modifier.Shift, 'ArrowUp', e => this._relayKeydown(e), {
      ignoreRepeat: false
    }).on(Modifier.Shift, 'ArrowDown', e => this._relayKeydown(e), {
      ignoreRepeat: false
    }).on('Home', e => this._relayKeydown(e)).on('End', e => this._relayKeydown(e)).on('PageUp', e => this._relayKeydown(e)).on('PageDown', e => this._relayKeydown(e)).on('Escape', () => {
      if (!this.inputs.alwaysExpanded()) {
        this.inputs.expanded.set(false);
        this.keyboardEventRelay.set([]);
      }
    });
    if (!this.readonly()) {
      manager.on('Enter', e => this._relayKeydown(e));
    }
    if (!this.isEditable() && !this.readonly()) {
      manager.on([Modifier.Ctrl, Modifier.Meta], 'A', e => this._relayKeydown(e)).on(Modifier.Shift, 'Home', e => this._relayKeydown(e)).on(Modifier.Shift, 'End', e => this._relayKeydown(e)).on(/^.$/, e => {
        this._relayKeydown(e);
      });
    }
    return manager;
  });
  click = computed(() => {
    const manager = new ClickEventManager();
    if (this.isEditable() || this.readonly()) return manager;
    manager.on(() => this.inputs.expanded.update(v => !v));
    return manager;
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.value = inputs.value;
  }
  _relayKeydown(event) {
    this.keyboardEventRelay.update(events => [...events, event]);
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
  onFocusout() {
    this.isFocused.set(false);
    this.closePopupOnFocusout();
  }
  closePopupOnFocusout() {
    setTimeout(() => {
      const comboboxFocused = this.isFocused();
      const popupFocused = !!this.inputs.popup()?.isFocused();
      if (!this.inputs.alwaysExpanded() && !comboboxFocused && !popupFocused) {
        this.inputs.expanded.set(false);
      }
    });
  }
  onInput(event) {
    const target = _getEventTarget(event);
    if (!(target instanceof HTMLInputElement) || this.disabled() || this.readonly()) return;
    this.inputs.expanded.set(true);
    this.value.set(target.value);
    this.isDeleting.set(event instanceof InputEvent && !!event.inputType.match(/^delete/));
  }
  highlightEffect() {
    const value = this.value();
    const inlineSuggestion = this.inlineSuggestion();
    const isDeleting = untracked(() => this.isDeleting());
    const isFocused = untracked(() => this.isFocused());
    const isExpanded = this.isExpanded();
    if (!inlineSuggestion || !isFocused || !isExpanded || isDeleting || this.readonly()) return;
    const inputEl = this.element();
    const isHighlightable = inlineSuggestion.toLowerCase().startsWith(value.toLowerCase());
    if (isHighlightable) {
      inputEl.value = value + inlineSuggestion.slice(value.length);
      inputEl.setSelectionRange(value.length, inlineSuggestion.length);
    }
  }
  keyboardEventRelayEffect() {
    const events = this.keyboardEventRelay();
    if (events.length === 0) return;
    this.isDeleting.set(false);
    if (!untracked(() => this.isExpanded())) {
      this.keyboardEventRelay.set([]);
      return;
    }
    const target = this.inputs.popup()?.controlTarget();
    if (!target) return;
    this.keyboardEventRelay.set([]);
    for (const event of events) {
      target.dispatchEvent(new KeyboardEvent(event.type, event));
    }
  }
}
class ComboboxPopupPattern {
  inputs;
  popupType = () => this.inputs.popupType();
  controlTarget = () => this.inputs.controlTarget();
  activeDescendant = () => this.inputs.activeDescendant();
  popupId = () => this.inputs.popupId();
  combobox = () => this.inputs.combobox();
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
    this.combobox()?.closePopupOnFocusout();
  }
}

export { ComboboxPattern, ComboboxPopupPattern };
//# sourceMappingURL=_combobox-chunk.mjs.map
