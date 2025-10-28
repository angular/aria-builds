import { signal, computed } from '@angular/core';
import { KeyboardEventManager, PointerEventManager, Modifier } from './_widget-chunk.mjs';
export { GridCellPattern, GridCellWidgetPattern, GridPattern, GridRowPattern } from './_widget-chunk.mjs';

/** Controls the state of a combobox. */
class ComboboxPattern {
    inputs;
    /** Whether the combobox is expanded. */
    expanded = signal(false);
    /** The ID of the active item in the combobox. */
    activedescendant = computed(() => this.inputs.popupControls()?.activeId() ?? null);
    /** The currently highlighted item in the combobox. */
    highlightedItem = signal(undefined);
    /** Whether the most recent input event was a deletion. */
    isDeleting = false;
    /** Whether the combobox is focused. */
    isFocused = signal(false);
    /** The key used to navigate to the previous item in the list. */
    expandKey = computed(() => (this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight'));
    /** The key used to navigate to the next item in the list. */
    collapseKey = computed(() => this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
    /** The ID of the popup associated with the combobox. */
    popupId = computed(() => this.inputs.popupControls()?.id() || null);
    /** The autocomplete behavior of the combobox. */
    autocomplete = computed(() => (this.inputs.filterMode() === 'highlight' ? 'both' : 'list'));
    /** The ARIA role of the popup associated with the combobox. */
    hasPopup = computed(() => this.inputs.popupControls()?.role() || null);
    /** Whether the combobox is interactive. */
    isInteractive = computed(() => !this.inputs.disabled() && !this.inputs.readonly());
    /** The keydown event manager for the combobox. */
    keydown = computed(() => {
        if (!this.expanded()) {
            return new KeyboardEventManager()
                .on('ArrowDown', () => this.open({ first: true }))
                .on('ArrowUp', () => this.open({ last: true }));
        }
        const popupControls = this.inputs.popupControls();
        if (!popupControls) {
            return new KeyboardEventManager();
        }
        const manager = new KeyboardEventManager()
            .on('ArrowDown', () => this.next())
            .on('ArrowUp', () => this.prev())
            .on('Home', () => this.first())
            .on('End', () => this.last())
            .on('Escape', () => {
            // TODO(wagnermaciel): We may want to fold this logic into the close() method.
            if (this.inputs.filterMode() === 'highlight' && popupControls.activeId()) {
                popupControls.unfocus();
                popupControls.clearSelection();
                const inputEl = this.inputs.inputEl();
                if (inputEl) {
                    inputEl.value = this.inputs.inputValue();
                }
            }
            else {
                this.close();
                this.inputs.popupControls()?.clearSelection();
            }
        }) // TODO: When filter mode is 'highlight', escape should revert to the last committed value.
            .on('Enter', () => this.select({ commit: true, close: true }));
        if (popupControls.role() === 'tree') {
            const treeControls = popupControls;
            if (treeControls.isItemExpandable() || treeControls.isItemCollapsible()) {
                manager.on(this.collapseKey(), () => this.collapseItem());
            }
            if (treeControls.isItemExpandable()) {
                manager.on(this.expandKey(), () => this.expandItem());
            }
        }
        return manager;
    });
    /** The pointerup event manager for the combobox. */
    pointerup = computed(() => new PointerEventManager().on(e => {
        const item = this.inputs.popupControls()?.getItem(e);
        if (item) {
            this.select({ item, commit: true, close: true });
            this.inputs.inputEl()?.focus(); // Return focus to the input after selecting.
        }
        if (e.target === this.inputs.inputEl()) {
            this.open();
        }
    }));
    constructor(inputs) {
        this.inputs = inputs;
    }
    /** Handles keydown events for the combobox. */
    onKeydown(event) {
        if (this.isInteractive()) {
            this.keydown().handle(event);
        }
    }
    /** Handles pointerup events for the combobox. */
    onPointerup(event) {
        if (this.isInteractive()) {
            this.pointerup().handle(event);
        }
    }
    /** Handles input events for the combobox. */
    onInput(event) {
        if (!this.isInteractive()) {
            return;
        }
        const inputEl = this.inputs.inputEl();
        if (!inputEl) {
            return;
        }
        this.open();
        this.inputs.inputValue?.set(inputEl.value);
        this.isDeleting = event instanceof InputEvent && !!event.inputType.match(/^delete/);
        if (this.inputs.filterMode() === 'manual') {
            const searchTerm = this.inputs.popupControls()?.getSelectedItem()?.searchTerm();
            if (searchTerm && this.inputs.inputValue() !== searchTerm) {
                this.inputs.popupControls()?.clearSelection();
            }
        }
    }
    /** Handles focus in events for the combobox. */
    onFocusIn() {
        this.isFocused.set(true);
    }
    /** Handles focus out events for the combobox. */
    onFocusOut(event) {
        if (this.inputs.disabled() || this.inputs.readonly()) {
            return;
        }
        if (!(event.relatedTarget instanceof HTMLElement) ||
            !this.inputs.containerEl()?.contains(event.relatedTarget)) {
            this.isFocused.set(false);
            if (this.inputs.filterMode() !== 'manual') {
                this.commit();
            }
            else {
                const item = this.inputs
                    .popupControls()
                    ?.items()
                    .find(i => i.searchTerm() === this.inputs.inputEl()?.value);
                if (item) {
                    this.select({ item });
                }
            }
            this.close();
        }
    }
    /** The first matching item in the combobox. */
    firstMatch = computed(() => {
        // TODO(wagnermaciel): Consider whether we should not provide this default behavior for the
        // listbox. Instead, we may want to allow users to have no match so that typing does not focus
        // any option.
        if (this.inputs.popupControls()?.role() === 'listbox') {
            return this.inputs.popupControls()?.items()[0];
        }
        return this.inputs
            .popupControls()
            ?.items()
            .find(i => i.value() === this.inputs.firstMatch());
    });
    /** Handles filtering logic for the combobox. */
    onFilter() {
        // TODO(wagnermaciel)
        // When the user first interacts with the combobox, the popup will lazily render for the first
        // time. This is a simple way to detect this and avoid auto-focus & selection logic, but this
        // should probably be moved to the component layer instead.
        const isInitialRender = !this.inputs.inputValue?.().length && !this.isDeleting;
        if (isInitialRender) {
            return;
        }
        // Avoid refocusing the input if a filter event occurs after focus has left the combobox.
        if (!this.isFocused()) {
            return;
        }
        if (this.inputs.popupControls()?.role() === 'tree') {
            const treeControls = this.inputs.popupControls();
            this.inputs.inputValue?.().length ? treeControls.expandAll() : treeControls.collapseAll();
        }
        const item = this.firstMatch();
        if (!item) {
            this.inputs.popupControls()?.clearSelection();
            this.inputs.popupControls()?.unfocus();
            return;
        }
        this.inputs.popupControls()?.focus(item);
        if (this.inputs.filterMode() !== 'manual') {
            this.select({ item });
        }
        if (this.inputs.filterMode() === 'highlight' && !this.isDeleting) {
            this.highlight();
        }
    }
    /** Highlights the currently selected item in the combobox. */
    highlight() {
        const inputEl = this.inputs.inputEl();
        const item = this.inputs.popupControls()?.getSelectedItem();
        if (!inputEl || !item) {
            return;
        }
        const isHighlightable = item
            .searchTerm()
            .toLowerCase()
            .startsWith(this.inputs.inputValue().toLowerCase());
        if (isHighlightable) {
            inputEl.value =
                this.inputs.inputValue() + item.searchTerm().slice(this.inputs.inputValue().length);
            inputEl.setSelectionRange(this.inputs.inputValue().length, item.searchTerm().length);
            this.highlightedItem.set(item);
        }
    }
    /** Closes the combobox. */
    close() {
        this.expanded.set(false);
        this.inputs.popupControls()?.unfocus();
    }
    /** Opens the combobox. */
    open(nav) {
        this.expanded.set(true);
        if (nav?.first) {
            this.first();
        }
        if (nav?.last) {
            this.last();
        }
    }
    /** Navigates to the next focusable item in the combobox popup. */
    next() {
        this._navigate(() => this.inputs.popupControls()?.next());
    }
    /** Navigates to the previous focusable item in the combobox popup. */
    prev() {
        this._navigate(() => this.inputs.popupControls()?.prev());
    }
    /** Navigates to the first focusable item in the combobox popup. */
    first() {
        this._navigate(() => this.inputs.popupControls()?.first());
    }
    /** Navigates to the last focusable item in the combobox popup. */
    last() {
        this._navigate(() => this.inputs.popupControls()?.last());
    }
    /** Collapses the currently focused item in the combobox. */
    collapseItem() {
        const controls = this.inputs.popupControls();
        this._navigate(() => controls?.collapseItem());
    }
    /** Expands the currently focused item in the combobox. */
    expandItem() {
        const controls = this.inputs.popupControls();
        this._navigate(() => controls?.expandItem());
    }
    /** Selects an item in the combobox popup. */
    select(opts = {}) {
        this.inputs.popupControls()?.select(opts.item);
        if (opts.commit) {
            this.commit();
        }
        if (opts.close) {
            this.close();
        }
    }
    /** Updates the value of the input based on the currently selected item. */
    commit() {
        const inputEl = this.inputs.inputEl();
        const item = this.inputs.popupControls()?.getSelectedItem();
        if (inputEl && item) {
            inputEl.value = item.searchTerm();
            this.inputs.inputValue?.set(item.searchTerm());
            if (this.inputs.filterMode() === 'highlight') {
                const length = inputEl.value.length;
                inputEl.setSelectionRange(length, length);
            }
        }
    }
    /** Navigates and handles additional actions based on filter mode. */
    _navigate(operation) {
        operation();
        if (this.inputs.filterMode() !== 'manual') {
            this.select();
        }
        if (this.inputs.filterMode() === 'highlight') {
            // This is to handle when the user navigates back to the originally highlighted item.
            // E.g. User types "Al", highlights "Alice", then navigates down and back up to "Alice".
            const selectedItem = this.inputs.popupControls()?.getSelectedItem();
            if (!selectedItem) {
                return;
            }
            if (selectedItem === this.highlightedItem()) {
                this.highlight();
            }
            else {
                const inputEl = this.inputs.inputEl();
                inputEl.value = selectedItem?.searchTerm();
            }
        }
    }
}

/** Controls focus for a list of items. */
class ListFocus {
    inputs;
    /** The last item that was active. */
    prevActiveItem = signal(undefined);
    /** The index of the last item that was active. */
    prevActiveIndex = computed(() => {
        return this.prevActiveItem() ? this.inputs.items().indexOf(this.prevActiveItem()) : -1;
    });
    /** The current active index in the list. */
    activeIndex = computed(() => {
        return this.inputs.activeItem() ? this.inputs.items().indexOf(this.inputs.activeItem()) : -1;
    });
    constructor(inputs) {
        this.inputs = inputs;
    }
    /** Whether the list is in a disabled state. */
    isListDisabled() {
        return this.inputs.disabled() || this.inputs.items().every(i => i.disabled());
    }
    /** The id of the current active item. */
    getActiveDescendant() {
        if (this.isListDisabled()) {
            return undefined;
        }
        if (this.inputs.focusMode() === 'roving') {
            return undefined;
        }
        return this.inputs.activeItem()?.id() ?? undefined;
    }
    /** The tabindex for the list. */
    getListTabindex() {
        if (this.isListDisabled()) {
            return 0;
        }
        return this.inputs.focusMode() === 'activedescendant' ? 0 : -1;
    }
    /** Returns the tabindex for the given item. */
    getItemTabindex(item) {
        if (this.isListDisabled()) {
            return -1;
        }
        if (this.inputs.focusMode() === 'activedescendant') {
            return -1;
        }
        return this.inputs.activeItem() === item ? 0 : -1;
    }
    /** Moves focus to the given item if it is focusable. */
    focus(item, opts) {
        if (this.isListDisabled() || !this.isFocusable(item)) {
            return false;
        }
        this.prevActiveItem.set(this.inputs.activeItem());
        this.inputs.activeItem.set(item);
        if (opts?.focusElement || opts?.focusElement === undefined) {
            this.inputs.focusMode() === 'roving'
                ? item.element().focus()
                : this.inputs.element()?.focus();
        }
        return true;
    }
    /** Returns true if the given item can be navigated to. */
    isFocusable(item) {
        return !item.disabled() || !this.inputs.skipDisabled();
    }
}

/** Controls navigation for a list of items. */
class ListNavigation {
    inputs;
    constructor(inputs) {
        this.inputs = inputs;
    }
    /** Navigates to the given item. */
    goto(item, opts) {
        return item ? this.inputs.focusManager.focus(item, opts) : false;
    }
    /** Navigates to the next item in the list. */
    next(opts) {
        return this._advance(1, opts);
    }
    /** Peeks the next item in the list. */
    peekNext() {
        return this._peek(1);
    }
    /** Navigates to the previous item in the list. */
    prev(opts) {
        return this._advance(-1, opts);
    }
    /** Peeks the previous item in the list. */
    peekPrev() {
        return this._peek(-1);
    }
    /** Navigates to the first item in the list. */
    first(opts) {
        const item = this.inputs.items().find(i => this.inputs.focusManager.isFocusable(i));
        return item ? this.goto(item, opts) : false;
    }
    /** Navigates to the last item in the list. */
    last(opts) {
        const items = this.inputs.items();
        for (let i = items.length - 1; i >= 0; i--) {
            if (this.inputs.focusManager.isFocusable(items[i])) {
                return this.goto(items[i], opts);
            }
        }
        return false;
    }
    /** Advances to the next or previous focusable item in the list based on the given delta. */
    _advance(delta, opts) {
        const item = this._peek(delta);
        return item ? this.goto(item, opts) : false;
    }
    /** Peeks the next or previous focusable item in the list based on the given delta. */
    _peek(delta) {
        const items = this.inputs.items();
        const itemCount = items.length;
        const startIndex = this.inputs.focusManager.activeIndex();
        const step = (i) => this.inputs.wrap() ? (i + delta + itemCount) % itemCount : i + delta;
        // If wrapping is enabled, this loop ultimately terminates when `i` gets back to `startIndex`
        // in the case that all options are disabled. If wrapping is disabled, the loop terminates
        // when the index goes out of bounds.
        for (let i = step(startIndex); i !== startIndex && i < itemCount && i >= 0; i = step(i)) {
            if (this.inputs.focusManager.isFocusable(items[i])) {
                return items[i];
            }
        }
        return;
    }
}

/** Controls selection for a list of items. */
class ListSelection {
    inputs;
    /** The start index to use for range selection. */
    rangeStartIndex = signal(0);
    /** The end index to use for range selection. */
    rangeEndIndex = signal(0);
    /** The currently selected items. */
    selectedItems = computed(() => this.inputs.items().filter(item => this.inputs.value().includes(item.value())));
    constructor(inputs) {
        this.inputs = inputs;
    }
    /** Selects the item at the current active index. */
    select(item, opts = { anchor: true }) {
        item = item ?? this.inputs.focusManager.inputs.activeItem();
        if (!item ||
            item.disabled() ||
            !item.selectable() ||
            this.inputs.value().includes(item.value())) {
            return;
        }
        if (!this.inputs.multi()) {
            this.deselectAll();
        }
        const index = this.inputs.items().findIndex(i => i === item);
        if (opts.anchor) {
            this.beginRangeSelection(index);
        }
        this.inputs.value.update(values => values.concat(item.value()));
    }
    /** Deselects the item at the current active index. */
    deselect(item) {
        item = item ?? this.inputs.focusManager.inputs.activeItem();
        if (item && !item.disabled() && item.selectable()) {
            this.inputs.value.update(values => values.filter(value => value !== item.value()));
        }
    }
    /** Toggles the item at the current active index. */
    toggle() {
        const item = this.inputs.focusManager.inputs.activeItem();
        if (item) {
            this.inputs.value().includes(item.value()) ? this.deselect() : this.select();
        }
    }
    /** Toggles only the item at the current active index. */
    toggleOne() {
        const item = this.inputs.focusManager.inputs.activeItem();
        if (item) {
            this.inputs.value().includes(item.value()) ? this.deselect() : this.selectOne();
        }
    }
    /** Selects all items in the list. */
    selectAll() {
        if (!this.inputs.multi()) {
            return; // Should we log a warning?
        }
        for (const item of this.inputs.items()) {
            this.select(item, { anchor: false });
        }
        this.beginRangeSelection();
    }
    /** Deselects all items in the list. */
    deselectAll() {
        // If an item is not in the list, it forcefully gets deselected.
        // This actually creates a bug for the following edge case:
        //
        // Setup: An item is not in the list (maybe it's lazily loaded), and it is disabled & selected.
        // Expected: If deselectAll() is called, it should NOT get deselected (because it is disabled).
        // Actual: Calling deselectAll() will still deselect the item.
        //
        // Why? Because we can't check if the item is disabled if it's not in the list.
        //
        // Alternatively, we could NOT deselect items that are not in the list, but this has the
        // inverse (and more common) effect of keeping enabled items selected when they aren't in the
        // list.
        for (const value of this.inputs.value()) {
            const item = this.inputs.items().find(i => i.value() === value);
            item
                ? this.deselect(item)
                : this.inputs.value.update(values => values.filter(v => v !== value));
        }
    }
    /**
     * Selects all items in the list or deselects all
     * items in the list if all items are already selected.
     */
    toggleAll() {
        const selectableValues = this.inputs
            .items()
            .filter(i => !i.disabled() && i.selectable())
            .map(i => i.value());
        selectableValues.every(i => this.inputs.value().includes(i))
            ? this.deselectAll()
            : this.selectAll();
    }
    /** Sets the selection to only the current active item. */
    selectOne() {
        const item = this.inputs.focusManager.inputs.activeItem();
        if (item && (item.disabled() || !item.selectable())) {
            return;
        }
        this.deselectAll();
        if (this.inputs.value().length > 0 && !this.inputs.multi()) {
            return;
        }
        this.select();
    }
    /**
     * Selects all items in the list up to the anchor item.
     *
     * Deselects all items that were previously within the
     * selected range that are now outside of the selected range
     */
    selectRange(opts = { anchor: true }) {
        const isStartOfRange = this.inputs.focusManager.prevActiveIndex() === this.rangeStartIndex();
        if (isStartOfRange && opts.anchor) {
            this.beginRangeSelection(this.inputs.focusManager.prevActiveIndex());
        }
        const itemsInRange = this._getItemsFromIndex(this.rangeStartIndex());
        const itemsOutOfRange = this._getItemsFromIndex(this.rangeEndIndex()).filter(i => !itemsInRange.includes(i));
        for (const item of itemsOutOfRange) {
            this.deselect(item);
        }
        for (const item of itemsInRange) {
            this.select(item, { anchor: false });
        }
        if (itemsInRange.length) {
            const item = itemsInRange.pop();
            const index = this.inputs.items().findIndex(i => i === item);
            this.rangeEndIndex.set(index);
        }
    }
    /** Marks the given index as the start of a range selection. */
    beginRangeSelection(index = this.inputs.focusManager.activeIndex()) {
        this.rangeStartIndex.set(index);
        this.rangeEndIndex.set(index);
    }
    /** Returns the items in the list starting from the given index.  */
    _getItemsFromIndex(index) {
        if (index === -1) {
            return [];
        }
        const upper = Math.max(this.inputs.focusManager.activeIndex(), index);
        const lower = Math.min(this.inputs.focusManager.activeIndex(), index);
        const items = [];
        for (let i = lower; i <= upper; i++) {
            items.push(this.inputs.items()[i]);
        }
        if (this.inputs.focusManager.activeIndex() < index) {
            return items.reverse();
        }
        return items;
    }
}

/** Controls typeahead for a list of items. */
class ListTypeahead {
    inputs;
    /** A reference to the timeout for resetting the typeahead search. */
    timeout;
    /** The focus controller of the parent list. */
    focusManager;
    /** Whether the user is actively typing a typeahead search query. */
    isTyping = computed(() => this._query().length > 0);
    /** Keeps track of the characters that typeahead search is being called with. */
    _query = signal('');
    /** The index where that the typeahead search was initiated from. */
    _startIndex = signal(undefined);
    constructor(inputs) {
        this.inputs = inputs;
        this.focusManager = inputs.focusManager;
    }
    /** Performs a typeahead search, appending the given character to the search string. */
    search(char) {
        if (char.length !== 1) {
            return false;
        }
        if (!this.isTyping() && char === ' ') {
            return false;
        }
        if (this._startIndex() === undefined) {
            this._startIndex.set(this.focusManager.activeIndex());
        }
        clearTimeout(this.timeout);
        this._query.update(q => q + char.toLowerCase());
        const item = this._getItem();
        if (item) {
            this.focusManager.focus(item);
        }
        this.timeout = setTimeout(() => {
            this._query.set('');
            this._startIndex.set(undefined);
        }, this.inputs.typeaheadDelay() * 1000);
        return true;
    }
    /**
     * Returns the first item whose search term matches the
     * current query starting from the the current anchor index.
     */
    _getItem() {
        let items = this.focusManager.inputs.items();
        const after = items.slice(this._startIndex() + 1);
        const before = items.slice(0, this._startIndex());
        items = after.concat(before);
        items.push(this.inputs.items()[this._startIndex()]);
        const focusableItems = [];
        for (const item of items) {
            if (this.focusManager.isFocusable(item)) {
                focusableItems.push(item);
            }
        }
        return focusableItems.find(i => i.searchTerm().toLowerCase().startsWith(this._query()));
    }
}

/** Controls the state of a list. */
class List {
    inputs;
    /** Controls navigation for the list. */
    navigationBehavior;
    /** Controls selection for the list. */
    selectionBehavior;
    /** Controls typeahead for the list. */
    typeaheadBehavior;
    /** Controls focus for the list. */
    focusBehavior;
    /** Whether the list is disabled. */
    disabled = computed(() => this.focusBehavior.isListDisabled());
    /** The id of the current active item. */
    activedescendant = computed(() => this.focusBehavior.getActiveDescendant());
    /** The tabindex of the list. */
    tabindex = computed(() => this.focusBehavior.getListTabindex());
    /** The index of the currently active item in the list. */
    activeIndex = computed(() => this.focusBehavior.activeIndex());
    /**
     * The uncommitted index for selecting a range of options.
     *
     * NOTE: This is subtly distinct from the "rangeStartIndex" in the ListSelection behavior.
     * The anchorIndex does not necessarily represent the start of a range, but represents the most
     * recent index where the user showed intent to begin a range selection. Usually, this is wherever
     * the user most recently pressed the "Shift" key, but if the user presses shift + space to select
     * from the anchor, the user is not intending to start a new range from this index.
     *
     * In other words, "rangeStartIndex" is only set when a user commits to starting a range selection
     * while "anchorIndex" is set whenever a user indicates they may be starting a range selection.
     */
    _anchorIndex = signal(0);
    /** Whether the list should wrap. Used to disable wrapping while range selecting. */
    _wrap = signal(true);
    constructor(inputs) {
        this.inputs = inputs;
        this.focusBehavior = new ListFocus(inputs);
        this.selectionBehavior = new ListSelection({ ...inputs, focusManager: this.focusBehavior });
        this.typeaheadBehavior = new ListTypeahead({ ...inputs, focusManager: this.focusBehavior });
        this.navigationBehavior = new ListNavigation({
            ...inputs,
            focusManager: this.focusBehavior,
            wrap: computed(() => this._wrap() && this.inputs.wrap()),
        });
    }
    /** Returns the tabindex for the given item. */
    getItemTabindex(item) {
        return this.focusBehavior.getItemTabindex(item);
    }
    /** Navigates to the first option in the list. */
    first(opts) {
        this._navigate(opts, () => this.navigationBehavior.first(opts));
    }
    /** Navigates to the last option in the list. */
    last(opts) {
        this._navigate(opts, () => this.navigationBehavior.last(opts));
    }
    /** Navigates to the next option in the list. */
    next(opts) {
        this._navigate(opts, () => this.navigationBehavior.next(opts));
    }
    /** Navigates to the previous option in the list. */
    prev(opts) {
        this._navigate(opts, () => this.navigationBehavior.prev(opts));
    }
    /** Navigates to the given item in the list. */
    goto(item, opts) {
        this._navigate(opts, () => this.navigationBehavior.goto(item, opts));
    }
    /** Removes focus from the list. */
    unfocus() {
        this.inputs.activeItem.set(undefined);
    }
    /** Marks the given index as the potential start of a range selection. */
    anchor(index) {
        this._anchorIndex.set(index);
    }
    /** Handles typeahead search navigation for the list. */
    search(char, opts) {
        this._navigate(opts, () => this.typeaheadBehavior.search(char));
    }
    /** Checks if the list is currently typing for typeahead search. */
    isTyping() {
        return this.typeaheadBehavior.isTyping();
    }
    /** Selects the currently active item in the list. */
    select(item) {
        this.selectionBehavior.select(item);
    }
    /** Sets the selection to only the current active item. */
    selectOne() {
        this.selectionBehavior.selectOne();
    }
    /** Deselects the currently active item in the list. */
    deselect() {
        this.selectionBehavior.deselect();
    }
    /** Deselects all items in the list. */
    deselectAll() {
        this.selectionBehavior.deselectAll();
    }
    /** Toggles the currently active item in the list. */
    toggle() {
        this.selectionBehavior.toggle();
    }
    /** Toggles the currently active item in the list, deselecting all other items. */
    toggleOne() {
        this.selectionBehavior.toggleOne();
    }
    /** Toggles the selection of all items in the list. */
    toggleAll() {
        this.selectionBehavior.toggleAll();
    }
    /** Checks if the given item is able to receive focus. */
    isFocusable(item) {
        return this.focusBehavior.isFocusable(item);
    }
    /** Handles updating selection for the list. */
    updateSelection(opts = { anchor: true }) {
        if (opts.toggle) {
            this.selectionBehavior.toggle();
        }
        if (opts.select) {
            this.selectionBehavior.select();
        }
        if (opts.selectOne) {
            this.selectionBehavior.selectOne();
        }
        if (opts.selectRange) {
            this.selectionBehavior.selectRange();
        }
        if (!opts.anchor) {
            this.anchor(this.selectionBehavior.rangeStartIndex());
        }
    }
    /**
     * Safely performs a navigation operation.
     *
     * Handles conditionally disabling wrapping for when a navigation
     * operation is occurring while the user is selecting a range of options.
     *
     * Handles boilerplate calling of focus & selection operations. Also ensures these
     * additional operations are only called if the navigation operation moved focus to a new option.
     */
    _navigate(opts = {}, operation) {
        if (opts?.selectRange) {
            this._wrap.set(false);
            this.selectionBehavior.rangeStartIndex.set(this._anchorIndex());
        }
        const moved = operation();
        if (moved) {
            this.updateSelection(opts);
        }
        this._wrap.set(true);
    }
}

/** Controls the state of a listbox. */
class ListboxPattern {
    inputs;
    listBehavior;
    /** Whether the list is vertically or horizontally oriented. */
    orientation;
    /** Whether the listbox is disabled. */
    disabled = computed(() => this.listBehavior.disabled());
    /** Whether the listbox is readonly. */
    readonly;
    /** The tabindex of the listbox. */
    tabindex = computed(() => this.listBehavior.tabindex());
    /** The id of the current active item. */
    activedescendant = computed(() => this.listBehavior.activedescendant());
    /** Whether multiple items in the list can be selected at once. */
    multi;
    /** The number of items in the listbox. */
    setsize = computed(() => this.inputs.items().length);
    /** Whether the listbox selection follows focus. */
    followFocus = computed(() => this.inputs.selectionMode() === 'follow');
    /** Whether the listbox should wrap. Used to disable wrapping while range selecting. */
    wrap = signal(true);
    /** The key used to navigate to the previous item in the list. */
    prevKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowUp';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** The key used to navigate to the next item in the list. */
    nextKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowDown';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey = computed(() => (this.listBehavior.isTyping() ? '' : ' '));
    /** The regexp used to decide if a key should trigger typeahead. */
    typeaheadRegexp = /^.$/;
    /** The keydown event manager for the listbox. */
    keydown = computed(() => {
        const manager = new KeyboardEventManager();
        if (this.readonly()) {
            return manager
                .on(this.prevKey, () => this.listBehavior.prev())
                .on(this.nextKey, () => this.listBehavior.next())
                .on('Home', () => this.listBehavior.first())
                .on('End', () => this.listBehavior.last())
                .on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
        }
        if (!this.followFocus()) {
            manager
                .on(this.prevKey, () => this.listBehavior.prev())
                .on(this.nextKey, () => this.listBehavior.next())
                .on('Home', () => this.listBehavior.first())
                .on('End', () => this.listBehavior.last())
                .on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
        }
        if (this.followFocus()) {
            manager
                .on(this.prevKey, () => this.listBehavior.prev({ selectOne: true }))
                .on(this.nextKey, () => this.listBehavior.next({ selectOne: true }))
                .on('Home', () => this.listBehavior.first({ selectOne: true }))
                .on('End', () => this.listBehavior.last({ selectOne: true }))
                .on(this.typeaheadRegexp, e => this.listBehavior.search(e.key, { selectOne: true }));
        }
        if (this.inputs.multi()) {
            manager
                .on(Modifier.Any, 'Shift', () => this.listBehavior.anchor(this.listBehavior.activeIndex()))
                .on(Modifier.Shift, this.prevKey, () => this.listBehavior.prev({ selectRange: true }))
                .on(Modifier.Shift, this.nextKey, () => this.listBehavior.next({ selectRange: true }))
                .on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'Home', () => this.listBehavior.first({ selectRange: true, anchor: false }))
                .on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'End', () => this.listBehavior.last({ selectRange: true, anchor: false }))
                .on(Modifier.Shift, 'Enter', () => this.listBehavior.updateSelection({ selectRange: true, anchor: false }))
                .on(Modifier.Shift, this.dynamicSpaceKey, () => this.listBehavior.updateSelection({ selectRange: true, anchor: false }));
        }
        if (!this.followFocus() && this.inputs.multi()) {
            manager
                .on(this.dynamicSpaceKey, () => this.listBehavior.toggle())
                .on('Enter', () => this.listBehavior.toggle())
                .on([Modifier.Ctrl, Modifier.Meta], 'A', () => this.listBehavior.toggleAll());
        }
        if (!this.followFocus() && !this.inputs.multi()) {
            manager.on(this.dynamicSpaceKey, () => this.listBehavior.toggleOne());
            manager.on('Enter', () => this.listBehavior.toggleOne());
        }
        if (this.inputs.multi() && this.followFocus()) {
            manager
                .on([Modifier.Ctrl, Modifier.Meta], this.prevKey, () => this.listBehavior.prev())
                .on([Modifier.Ctrl, Modifier.Meta], this.nextKey, () => this.listBehavior.next())
                .on([Modifier.Ctrl, Modifier.Meta], ' ', () => this.listBehavior.toggle())
                .on([Modifier.Ctrl, Modifier.Meta], 'Enter', () => this.listBehavior.toggle())
                .on([Modifier.Ctrl, Modifier.Meta], 'Home', () => this.listBehavior.first())
                .on([Modifier.Ctrl, Modifier.Meta], 'End', () => this.listBehavior.last())
                .on([Modifier.Ctrl, Modifier.Meta], 'A', () => {
                this.listBehavior.toggleAll();
                this.listBehavior.select(); // Ensure the currect option remains selected.
            });
        }
        return manager;
    });
    /** The pointerdown event manager for the listbox. */
    pointerdown = computed(() => {
        const manager = new PointerEventManager();
        if (this.readonly()) {
            return manager.on(e => this.listBehavior.goto(this._getItem(e)));
        }
        if (this.multi()) {
            manager.on(Modifier.Shift, e => this.listBehavior.goto(this._getItem(e), { selectRange: true }));
        }
        if (!this.multi() && this.followFocus()) {
            return manager.on(e => this.listBehavior.goto(this._getItem(e), { selectOne: true }));
        }
        if (!this.multi() && !this.followFocus()) {
            return manager.on(e => this.listBehavior.goto(this._getItem(e), { toggle: true }));
        }
        if (this.multi() && this.followFocus()) {
            return manager
                .on(e => this.listBehavior.goto(this._getItem(e), { selectOne: true }))
                .on(Modifier.Ctrl, e => this.listBehavior.goto(this._getItem(e), { toggle: true }));
        }
        if (this.multi() && !this.followFocus()) {
            return manager.on(e => this.listBehavior.goto(this._getItem(e), { toggle: true }));
        }
        return manager;
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.readonly = inputs.readonly;
        this.orientation = inputs.orientation;
        this.multi = inputs.multi;
        this.listBehavior = new List(inputs);
    }
    /** Returns a set of violations */
    validate() {
        const violations = [];
        if (!this.inputs.multi() && this.inputs.value().length > 1) {
            violations.push(`A single-select listbox should not have multiple selected options. Selected options: ${this.inputs.value().join(', ')}`);
        }
        return violations;
    }
    /** Handles keydown events for the listbox. */
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
    /**
     * Sets the listbox to it's default initial state.
     *
     * Sets the active index of the listbox to the first focusable selected
     * item if one exists. Otherwise, sets focus to the first focusable item.
     *
     * This method should be called once the listbox and it's options are properly initialized,
     * meaning the ListboxPattern and OptionPatterns should have references to each other before this
     * is called.
     */
    setDefaultState() {
        let firstItem = null;
        for (const item of this.inputs.items()) {
            if (this.listBehavior.isFocusable(item)) {
                if (!firstItem) {
                    firstItem = item;
                }
                if (item.selected()) {
                    this.inputs.activeItem.set(item);
                    return;
                }
            }
        }
        if (firstItem) {
            this.inputs.activeItem.set(firstItem);
        }
    }
    _getItem(e) {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        const element = e.target.closest('[role="option"]');
        return this.inputs.items().find(i => i.element() === element);
    }
}

/** Represents an option in a listbox. */
class OptionPattern {
    /** A unique identifier for the option. */
    id;
    /** The value of the option. */
    value;
    /** The position of the option in the list. */
    index = computed(() => this.listbox()?.inputs.items().indexOf(this) ?? -1);
    /** Whether the option is active. */
    active = computed(() => this.listbox()?.inputs.activeItem() === this);
    /** Whether the option is selected. */
    selected = computed(() => this.listbox()?.inputs.value().includes(this.value()));
    /** Whether the option is selectable. */
    selectable = () => true;
    /** Whether the option is disabled. */
    disabled;
    /** The text used by the typeahead search. */
    searchTerm;
    /** A reference to the parent listbox. */
    listbox;
    /** The tabindex of the option. */
    tabindex = computed(() => this.listbox()?.listBehavior.getItemTabindex(this));
    /** The html element that should receive focus. */
    element;
    constructor(args) {
        this.id = args.id;
        this.value = args.value;
        this.listbox = args.listbox;
        this.element = args.element;
        this.disabled = args.disabled;
        this.searchTerm = args.searchTerm;
    }
}

class ComboboxListboxPattern extends ListboxPattern {
    inputs;
    /** A unique identifier for the popup. */
    id = computed(() => this.inputs.id());
    /** The ARIA role for the listbox. */
    role = computed(() => 'listbox');
    /** The id of the active (focused) item in the listbox. */
    activeId = computed(() => this.listBehavior.activedescendant());
    /** The list of options in the listbox. */
    items = computed(() => this.inputs.items());
    /** The tabindex for the listbox. Always -1 because the combobox handles focus. */
    tabindex = () => -1;
    constructor(inputs) {
        if (inputs.combobox()) {
            inputs.multi = () => false;
            inputs.focusMode = () => 'activedescendant';
            inputs.element = inputs.combobox().inputs.inputEl;
        }
        super(inputs);
        this.inputs = inputs;
    }
    /** Noop. The combobox handles keydown events. */
    onKeydown(_) { }
    /** Noop. The combobox handles pointerdown events. */
    onPointerdown(_) { }
    /** Noop. The combobox controls the open state. */
    setDefaultState() { }
    /** Navigates to the specified item in the listbox. */
    focus = (item) => this.listBehavior.goto(item);
    /** Navigates to the next focusable item in the listbox. */
    next = () => this.listBehavior.next();
    /** Navigates to the previous focusable item in the listbox. */
    prev = () => this.listBehavior.prev();
    /** Navigates to the last focusable item in the listbox. */
    last = () => this.listBehavior.last();
    /** Navigates to the first focusable item in the listbox. */
    first = () => this.listBehavior.first();
    /** Unfocuses the currently focused item in the listbox. */
    unfocus = () => this.listBehavior.unfocus();
    /** Selects the specified item in the listbox. */
    select = (item) => this.listBehavior.select(item);
    /** Clears the selection in the listbox. */
    clearSelection = () => this.listBehavior.deselectAll();
    /** Retrieves the OptionPattern associated with a pointer event. */
    getItem = (e) => this._getItem(e);
    /** Retrieves the currently selected item in the listbox. */
    getSelectedItem = () => this.inputs.items().find(i => i.selected());
    /** Sets the value of the combobox listbox. */
    setValue = (value) => this.inputs.value.set(value ? [value] : []);
}

/** The menu ui pattern class. */
class MenuPattern {
    inputs;
    /** The unique ID of the menu. */
    id;
    /** The role of the menu. */
    role = () => 'menu';
    /** Whether the menu is visible. */
    isVisible = computed(() => (this.inputs.parent() ? !!this.inputs.parent()?.expanded() : true));
    /** Controls list behavior for the menu items. */
    listBehavior;
    /** Whether the menu or any of its child elements are currently focused. */
    isFocused = signal(false);
    /** Whether the menu has received focus. */
    hasBeenFocused = signal(false);
    /** Whether the menu should be focused on mouse over. */
    shouldFocus = computed(() => {
        const root = this.root();
        if (root instanceof MenuTriggerPattern) {
            return true;
        }
        if (root instanceof MenuBarPattern || root instanceof MenuPattern) {
            return root.isFocused();
        }
        return false;
    });
    /** The key used to expand sub-menus. */
    _expandKey = computed(() => {
        return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** The key used to collapse sub-menus. */
    _collapseKey = computed(() => {
        return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey = computed(() => (this.listBehavior.isTyping() ? '' : ' '));
    /** The regexp used to decide if a key should trigger typeahead. */
    typeaheadRegexp = /^.$/;
    /** The root of the menu. */
    root = computed(() => {
        const parent = this.inputs.parent();
        if (!parent) {
            return this;
        }
        if (parent instanceof MenuTriggerPattern) {
            return parent;
        }
        const grandparent = parent.inputs.parent();
        if (grandparent instanceof MenuBarPattern) {
            return grandparent;
        }
        return grandparent?.root();
    });
    /** Handles keyboard events for the menu. */
    keydownManager = computed(() => {
        return new KeyboardEventManager()
            .on('ArrowDown', () => this.next())
            .on('ArrowUp', () => this.prev())
            .on('Home', () => this.first())
            .on('End', () => this.last())
            .on('Enter', () => this.trigger())
            .on('Escape', () => this.closeAll())
            .on(this._expandKey, () => this.expand())
            .on(this._collapseKey, () => this.collapse())
            .on(this.dynamicSpaceKey, () => this.trigger())
            .on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.listBehavior = new List({
            ...inputs,
            value: signal([]),
            disabled: () => false,
        });
    }
    /** Sets the default state for the menu. */
    setDefaultState() {
        if (!this.inputs.parent()) {
            this.inputs.activeItem.set(this.inputs.items()[0]);
        }
    }
    /** Handles keyboard events for the menu. */
    onKeydown(event) {
        this.keydownManager().handle(event);
    }
    /** Handles mouseover events for the menu. */
    onMouseOver(event) {
        if (!this.isVisible()) {
            return;
        }
        const item = this.inputs.items().find(i => i.element()?.contains(event.target));
        if (!item) {
            return;
        }
        const activeItem = this?.inputs.activeItem();
        if (activeItem && activeItem !== item) {
            activeItem.close();
        }
        if (item.expanded() && item.submenu()?.inputs.activeItem()) {
            item.submenu()?.inputs.activeItem()?.close();
            item.submenu()?.listBehavior.unfocus();
        }
        item.open();
        this.listBehavior.goto(item, { focusElement: this.shouldFocus() });
    }
    /** Handles mouseout events for the menu. */
    onMouseOut(event) {
        if (this.isFocused()) {
            return;
        }
        const root = this.root();
        const parent = this.inputs.parent();
        const relatedTarget = event.relatedTarget;
        if (!root || !parent || parent instanceof MenuTriggerPattern) {
            return;
        }
        const grandparent = parent.inputs.parent();
        if (!grandparent || grandparent instanceof MenuBarPattern) {
            return;
        }
        if (!grandparent.inputs.element()?.contains(relatedTarget)) {
            parent.close();
        }
    }
    /** Handles click events for the menu. */
    onClick(event) {
        const relatedTarget = event.target;
        const item = this.inputs.items().find(i => i.element()?.contains(relatedTarget));
        if (item) {
            item.open();
            this.listBehavior.goto(item);
            this.submit(item);
        }
    }
    /** Handles focusin events for the menu. */
    onFocusIn() {
        this.isFocused.set(true);
        this.hasBeenFocused.set(true);
    }
    /** Handles the focusout event for the menu. */
    onFocusOut(event) {
        const parent = this.inputs.parent();
        const parentEl = parent?.inputs.element();
        const relatedTarget = event.relatedTarget;
        if (!relatedTarget) {
            this.isFocused.set(false);
            this.inputs.parent()?.close({ refocus: true });
        }
        if (parent instanceof MenuItemPattern) {
            const grandparent = parent.inputs.parent();
            const siblings = grandparent?.inputs.items().filter(i => i !== parent);
            const item = siblings?.find(i => i.element().contains(relatedTarget));
            if (item) {
                return;
            }
        }
        if (this.isVisible() &&
            !parentEl?.contains(relatedTarget) &&
            !this.inputs.element()?.contains(relatedTarget)) {
            this.isFocused.set(false);
            this.inputs.parent()?.close();
        }
    }
    /** Focuses the previous menu item. */
    prev() {
        this.inputs.activeItem()?.close();
        this.listBehavior.prev();
    }
    /** Focuses the next menu item. */
    next() {
        this.inputs.activeItem()?.close();
        this.listBehavior.next();
    }
    /** Focuses the first menu item. */
    first() {
        this.inputs.activeItem()?.close();
        this.listBehavior.first();
    }
    /** Focuses the last menu item. */
    last() {
        this.inputs.activeItem()?.close();
        this.listBehavior.last();
    }
    /** Triggers the active menu item. */
    trigger() {
        this.inputs.activeItem()?.hasPopup()
            ? this.inputs.activeItem()?.open({ first: true })
            : this.submit();
    }
    /** Submits the menu. */
    submit(item = this.inputs.activeItem()) {
        const root = this.root();
        if (item && !item.disabled()) {
            const isMenu = root instanceof MenuPattern;
            const isMenuBar = root instanceof MenuBarPattern;
            const isMenuTrigger = root instanceof MenuTriggerPattern;
            if (!item.submenu() && (isMenuTrigger || isMenuBar)) {
                root.close({ refocus: true });
                root?.inputs.onSubmit?.(item.value());
            }
            if (!item.submenu() && isMenu) {
                root.inputs.activeItem()?.close({ refocus: true });
                root?.inputs.onSubmit?.(item.value());
            }
        }
    }
    /** Collapses the current menu or focuses the previous item in the menubar. */
    collapse() {
        const root = this.root();
        const parent = this.inputs.parent();
        if (parent instanceof MenuItemPattern && !(parent.inputs.parent() instanceof MenuBarPattern)) {
            parent.close({ refocus: true });
        }
        else if (root instanceof MenuBarPattern) {
            root.prev();
        }
    }
    /** Expands the current menu or focuses the next item in the menubar. */
    expand() {
        const root = this.root();
        const activeItem = this.inputs.activeItem();
        if (activeItem?.submenu()) {
            activeItem.open({ first: true });
        }
        else if (root instanceof MenuBarPattern) {
            root.next();
        }
    }
    /** Closes the menu and all parent menus. */
    closeAll() {
        const root = this.root();
        if (root instanceof MenuTriggerPattern) {
            root.close({ refocus: true });
        }
        if (root instanceof MenuBarPattern) {
            root.close();
        }
        if (root instanceof MenuPattern) {
            root.inputs.activeItem()?.close({ refocus: true });
        }
    }
}
/** The menubar ui pattern class. */
class MenuBarPattern {
    inputs;
    /** Controls list behavior for the menu items. */
    listBehavior;
    /** The key used to navigate to the next item. */
    _nextKey = computed(() => {
        return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** The key used to navigate to the previous item. */
    _previousKey = computed(() => {
        return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey = computed(() => (this.listBehavior.isTyping() ? '' : ' '));
    /** The regexp used to decide if a key should trigger typeahead. */
    typeaheadRegexp = /^.$/;
    /** Whether the menubar or any of its children are currently focused. */
    isFocused = signal(false);
    /** Whether the menubar has been focused. */
    hasBeenFocused = signal(false);
    /** Handles keyboard events for the menu. */
    keydownManager = computed(() => {
        return new KeyboardEventManager()
            .on(this._nextKey, () => this.next())
            .on(this._previousKey, () => this.prev())
            .on('End', () => this.listBehavior.last())
            .on('Home', () => this.listBehavior.first())
            .on('Enter', () => this.inputs.activeItem()?.open({ first: true }))
            .on('ArrowUp', () => this.inputs.activeItem()?.open({ last: true }))
            .on('ArrowDown', () => this.inputs.activeItem()?.open({ first: true }))
            .on(this.dynamicSpaceKey, () => this.inputs.activeItem()?.open({ first: true }))
            .on(this.typeaheadRegexp, e => this.listBehavior.search(e.key));
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.listBehavior = new List({ ...inputs, disabled: () => false });
    }
    /** Sets the default state for the menubar. */
    setDefaultState() {
        this.inputs.activeItem.set(this.inputs.items()[0]);
    }
    /** Handles keyboard events for the menu. */
    onKeydown(event) {
        this.keydownManager().handle(event);
    }
    /** Handles click events for the menu bar. */
    onClick(event) {
        const item = this.inputs.items().find(i => i.element()?.contains(event.target));
        if (!item) {
            return;
        }
        this.goto(item);
        item.expanded() ? item.close() : item.open();
    }
    /** Handles mouseover events for the menu bar. */
    onMouseOver(event) {
        const item = this.inputs.items().find(i => i.element()?.contains(event.target));
        if (item) {
            this.goto(item, { focusElement: this.isFocused() });
        }
    }
    /** Handles focusin events for the menu bar. */
    onFocusIn() {
        this.isFocused.set(true);
        this.hasBeenFocused.set(true);
    }
    /** Handles focusout events for the menu bar. */
    onFocusOut(event) {
        const relatedTarget = event.relatedTarget;
        if (!this.inputs.element()?.contains(relatedTarget)) {
            this.isFocused.set(false);
            this.close();
        }
    }
    /** Goes to and optionally focuses the specified menu item. */
    goto(item, opts) {
        const prevItem = this.inputs.activeItem();
        this.listBehavior.goto(item, opts);
        if (prevItem?.expanded()) {
            prevItem?.close();
            this.inputs.activeItem()?.open();
        }
        if (item === prevItem) {
            if (item.expanded() && item.submenu()?.inputs.activeItem()) {
                item.submenu()?.inputs.activeItem()?.close();
                item.submenu()?.listBehavior.unfocus();
            }
        }
    }
    /** Focuses the next menu item. */
    next() {
        const prevItem = this.inputs.activeItem();
        this.listBehavior.next();
        if (prevItem?.expanded()) {
            prevItem?.close();
            this.inputs.activeItem()?.open({ first: true });
        }
    }
    /** Focuses the previous menu item. */
    prev() {
        const prevItem = this.inputs.activeItem();
        this.listBehavior.prev();
        if (prevItem?.expanded()) {
            prevItem?.close();
            this.inputs.activeItem()?.open({ first: true });
        }
    }
    /** Closes the menubar and refocuses the root menu bar item. */
    close() {
        this.inputs.activeItem()?.close({ refocus: this.isFocused() });
    }
}
/** The menu trigger ui pattern class. */
class MenuTriggerPattern {
    inputs;
    /** Whether the menu is expanded. */
    expanded = signal(false);
    /** The role of the menu trigger. */
    role = () => 'button';
    /** Whether the menu trigger has a popup. */
    hasPopup = () => true;
    /** The submenu associated with the trigger. */
    submenu;
    /** The tabindex of the menu trigger. */
    tabindex = computed(() => (this.expanded() && this.submenu()?.inputs.activeItem() ? -1 : 0));
    /** Handles keyboard events for the menu trigger. */
    keydownManager = computed(() => {
        return new KeyboardEventManager()
            .on(' ', () => this.open({ first: true }))
            .on('Enter', () => this.open({ first: true }))
            .on('ArrowDown', () => this.open({ first: true }))
            .on('ArrowUp', () => this.open({ last: true }))
            .on('Escape', () => this.close({ refocus: true }));
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.submenu = this.inputs.submenu;
    }
    /** Handles keyboard events for the menu trigger. */
    onKeydown(event) {
        this.keydownManager().handle(event);
    }
    /** Handles click events for the menu trigger. */
    onClick() {
        this.expanded() ? this.close() : this.open({ first: true });
    }
    /** Handles focusout events for the menu trigger. */
    onFocusOut(event) {
        const element = this.inputs.element();
        const relatedTarget = event.relatedTarget;
        if (this.expanded() &&
            !element?.contains(relatedTarget) &&
            !this.inputs.submenu()?.inputs.element()?.contains(relatedTarget)) {
            this.close();
        }
    }
    /** Opens the menu. */
    open(opts) {
        this.expanded.set(true);
        if (opts?.first) {
            this.inputs.submenu()?.first();
        }
        else if (opts?.last) {
            this.inputs.submenu()?.last();
        }
    }
    /** Closes the menu. */
    close(opts = {}) {
        this.expanded.set(false);
        this.submenu()?.listBehavior.unfocus();
        if (opts.refocus) {
            this.inputs.element()?.focus();
        }
        let menuitems = this.inputs.submenu()?.inputs.items() ?? [];
        while (menuitems.length) {
            const menuitem = menuitems.pop();
            menuitem?._expanded.set(false);
            menuitem?.inputs.parent()?.listBehavior.unfocus();
            menuitems = menuitems.concat(menuitem?.submenu()?.inputs.items() ?? []);
        }
    }
}
/** The menu item ui pattern class. */
class MenuItemPattern {
    inputs;
    /** The value of the menu item. */
    value;
    /** The unique ID of the menu item. */
    id;
    /** Whether the menu item is disabled. */
    disabled;
    /** The search term for the menu item. */
    searchTerm;
    /** The element of the menu item. */
    element;
    /** Whether the menu item is active. */
    isActive = computed(() => this.inputs.parent()?.inputs.activeItem() === this);
    /** The tabindex of the menu item. */
    tabindex = computed(() => {
        if (this.submenu() && this.submenu()?.inputs.activeItem()) {
            return -1;
        }
        return this.inputs.parent()?.listBehavior.getItemTabindex(this) ?? -1;
    });
    /** The position of the menu item in the menu. */
    index = computed(() => this.inputs.parent()?.inputs.items().indexOf(this) ?? -1);
    /** Whether the menu item is expanded. */
    expanded = computed(() => (this.submenu() ? this._expanded() : null));
    /** Whether the menu item is expanded. */
    _expanded = signal(false);
    /** The ID of the menu that the menu item controls. */
    controls = signal(undefined);
    /** The role of the menu item. */
    role = () => 'menuitem';
    /** Whether the menu item has a popup. */
    hasPopup = computed(() => !!this.submenu());
    /** The submenu associated with the menu item. */
    submenu;
    /** Whether the menu item is selectable. */
    selectable;
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.value = inputs.value;
        this.element = inputs.element;
        this.disabled = inputs.disabled;
        this.submenu = this.inputs.submenu;
        this.searchTerm = inputs.searchTerm;
        this.selectable = computed(() => !this.submenu());
    }
    /** Opens the submenu. */
    open(opts) {
        this._expanded.set(true);
        if (opts?.first) {
            this.submenu()?.first();
        }
        if (opts?.last) {
            this.submenu()?.last();
        }
    }
    /** Closes the submenu. */
    close(opts = {}) {
        this._expanded.set(false);
        if (opts.refocus) {
            this.inputs.parent()?.listBehavior.goto(this);
        }
        let menuitems = this.inputs.submenu()?.inputs.items() ?? [];
        while (menuitems.length) {
            const menuitem = menuitems.pop();
            menuitem?._expanded.set(false);
            menuitem?.inputs.parent()?.listBehavior.unfocus();
            menuitems = menuitems.concat(menuitem?.submenu()?.inputs.items() ?? []);
        }
    }
}

/** Controls the state of a radio group. */
class RadioGroupPattern {
    inputs;
    /** The list behavior for the radio group. */
    listBehavior;
    /** Whether the radio group is vertically or horizontally oriented. */
    orientation;
    /** Whether focus should wrap when navigating. */
    wrap = signal(false);
    /** The selection strategy used by the radio group. */
    selectionMode = signal('follow');
    /** Whether the radio group is disabled. */
    disabled = computed(() => this.inputs.disabled() || this.listBehavior.disabled());
    /** The currently selected radio button. */
    selectedItem = computed(() => this.listBehavior.selectionBehavior.selectedItems()[0]);
    /** Whether the radio group is readonly. */
    readonly = computed(() => this.selectedItem()?.disabled() || this.inputs.readonly());
    /** The tabindex of the radio group. */
    tabindex = computed(() => this.listBehavior.tabindex());
    /** The id of the current active radio button (if using activedescendant). */
    activedescendant = computed(() => this.listBehavior.activedescendant());
    /** The key used to navigate to the previous radio button. */
    _prevKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowUp';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** The key used to navigate to the next radio button. */
    _nextKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowDown';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** The keydown event manager for the radio group. */
    keydown = computed(() => {
        const manager = new KeyboardEventManager();
        // Readonly mode allows navigation but not selection changes.
        if (this.readonly()) {
            return manager
                .on(this._prevKey, () => this.listBehavior.prev())
                .on(this._nextKey, () => this.listBehavior.next())
                .on('Home', () => this.listBehavior.first())
                .on('End', () => this.listBehavior.last());
        }
        // Default behavior: navigate and select on arrow keys, home, end.
        // Space/Enter also select the focused item.
        return manager
            .on(this._prevKey, () => this.listBehavior.prev({ selectOne: true }))
            .on(this._nextKey, () => this.listBehavior.next({ selectOne: true }))
            .on('Home', () => this.listBehavior.first({ selectOne: true }))
            .on('End', () => this.listBehavior.last({ selectOne: true }))
            .on(' ', () => this.listBehavior.selectOne())
            .on('Enter', () => this.listBehavior.selectOne());
    });
    /** The pointerdown event manager for the radio group. */
    pointerdown = computed(() => {
        const manager = new PointerEventManager();
        if (this.readonly()) {
            // Navigate focus only in readonly mode.
            return manager.on(e => this.listBehavior.goto(this.inputs.getItem(e)));
        }
        // Default behavior: navigate and select on click.
        return manager.on(e => this.listBehavior.goto(this.inputs.getItem(e), { selectOne: true }));
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.orientation = inputs.orientation;
        this.listBehavior = new List({
            ...inputs,
            wrap: this.wrap,
            selectionMode: this.selectionMode,
            multi: () => false,
            typeaheadDelay: () => 0, // Radio groups do not support typeahead.
        });
    }
    /** Handles keydown events for the radio group. */
    onKeydown(event) {
        if (!this.disabled()) {
            this.keydown().handle(event);
        }
    }
    /** Handles pointerdown events for the radio group. */
    onPointerdown(event) {
        if (!this.disabled()) {
            this.pointerdown().handle(event);
        }
    }
    /**
     * Sets the radio group to its default initial state.
     *
     * Sets the active index to the selected radio button if one exists and is focusable.
     * Otherwise, sets the active index to the first focusable radio button.
     */
    setDefaultState() {
        let firstItem = null;
        for (const item of this.inputs.items()) {
            if (this.listBehavior.isFocusable(item)) {
                if (!firstItem) {
                    firstItem = item;
                }
                if (item.selected()) {
                    this.inputs.activeItem.set(item);
                    return;
                }
            }
        }
        if (firstItem) {
            this.inputs.activeItem.set(firstItem);
        }
    }
    /** Validates the state of the radio group and returns a list of accessibility violations. */
    validate() {
        const violations = [];
        if (this.selectedItem()?.disabled() && this.inputs.skipDisabled()) {
            violations.push("Accessibility Violation: The selected radio button is disabled while 'skipDisabled' is true, making the selection unreachable via keyboard.");
        }
        return violations;
    }
}

/** Represents a radio button within a radio group. */
class RadioButtonPattern {
    inputs;
    /** A unique identifier for the radio button. */
    id;
    /** The value associated with the radio button. */
    value;
    /** The position of the radio button within the group. */
    index = computed(() => this.group()?.listBehavior.inputs.items().indexOf(this) ?? -1);
    /** Whether the radio button is currently the active one (focused). */
    active = computed(() => this.group()?.listBehavior.inputs.activeItem() === this);
    /** Whether the radio button is selected. */
    selected = computed(() => !!this.group()?.listBehavior.inputs.value().includes(this.value()));
    /** Whether the radio button is selectable. */
    selectable = () => true;
    /** Whether the radio button is disabled. */
    disabled;
    /** A reference to the parent radio group. */
    group;
    /** The tabindex of the radio button. */
    tabindex = computed(() => this.group()?.listBehavior.getItemTabindex(this));
    /** The HTML element associated with the radio button. */
    element;
    /** The search term for typeahead. */
    searchTerm = () => ''; // Radio groups do not support typeahead.
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.value = inputs.value;
        this.group = inputs.group;
        this.element = inputs.element;
        this.disabled = inputs.disabled;
    }
}

/** Controls the state of a radio group in a toolbar. */
class ToolbarRadioGroupPattern extends RadioGroupPattern {
    inputs;
    constructor(inputs) {
        if (!!inputs.toolbar()) {
            inputs.orientation = inputs.toolbar().orientation;
            inputs.skipDisabled = inputs.toolbar().skipDisabled;
        }
        super(inputs);
        this.inputs = inputs;
    }
    /** Noop. The toolbar handles keydown events. */
    onKeydown(_) { }
    /** Noop. The toolbar handles pointerdown events. */
    onPointerdown(_) { }
    /** Whether the radio group is currently on the first item. */
    isOnFirstItem() {
        return this.listBehavior.navigationBehavior.peekPrev() === undefined;
    }
    /** Whether the radio group is currently on the last item. */
    isOnLastItem() {
        return this.listBehavior.navigationBehavior.peekNext() === undefined;
    }
    /** Navigates to the next radio button in the group. */
    next(wrap) {
        this.wrap.set(wrap);
        this.listBehavior.next();
        this.wrap.set(false);
    }
    /** Navigates to the previous radio button in the group. */
    prev(wrap) {
        this.wrap.set(wrap);
        this.listBehavior.prev();
        this.wrap.set(false);
    }
    /** Navigates to the first radio button in the group. */
    first() {
        this.listBehavior.first();
    }
    /** Navigates to the last radio button in the group. */
    last() {
        this.listBehavior.last();
    }
    /** Removes focus from the radio group. */
    unfocus() {
        this.inputs.activeItem.set(undefined);
    }
    /** Triggers the action of the currently active radio button in the group. */
    trigger() {
        if (this.readonly())
            return;
        this.listBehavior.selectOne();
    }
    /** Navigates to the radio button targeted by a pointer event. */
    goto(e) {
        this.listBehavior.goto(this.inputs.getItem(e), {
            selectOne: !this.readonly(),
        });
    }
}

/** Converts a getter setter style signal to a WritableSignalLike. */
function convertGetterSetterToWritableSignalLike(getter, setter) {
    // tslint:disable-next-line:ban Have to use `Object.assign` to preserve the getter function.
    return Object.assign(getter, {
        set: setter,
        update: (updateCallback) => setter(updateCallback(getter())),
    });
}

/**
 * Controls a single item's expansion state and interactions,
 * delegating actual state changes to an Expansion manager.
 */
class ExpansionControl {
    inputs;
    /** Whether this specific item is currently expanded. Derived from the Expansion manager. */
    isExpanded = computed(() => this.inputs.expansionManager.isExpanded(this));
    /** Whether this item can be expanded. */
    isExpandable = computed(() => this.inputs.expansionManager.isExpandable(this));
    constructor(inputs) {
        this.inputs = inputs;
        this.expansionId = inputs.expansionId;
        this.expandable = inputs.expandable;
        this.disabled = inputs.disabled;
    }
    /** Requests the Expansion manager to open this item. */
    open() {
        this.inputs.expansionManager.open(this);
    }
    /** Requests the Expansion manager to close this item. */
    close() {
        this.inputs.expansionManager.close(this);
    }
    /** Requests the Expansion manager to toggle this item. */
    toggle() {
        this.inputs.expansionManager.toggle(this);
    }
}
/** Manages the expansion state of a list of items. */
class ListExpansion {
    inputs;
    /** A signal holding an array of ids of the currently expanded items. */
    expandedIds;
    constructor(inputs) {
        this.inputs = inputs;
        this.expandedIds = inputs.expandedIds;
    }
    /** Opens the specified item. */
    open(item) {
        if (!this.isExpandable(item))
            return;
        if (this.isExpanded(item))
            return;
        if (!this.inputs.multiExpandable()) {
            this.closeAll();
        }
        this.expandedIds.update(ids => ids.concat(item.expansionId()));
    }
    /** Closes the specified item. */
    close(item) {
        if (this.isExpandable(item)) {
            this.expandedIds.update(ids => ids.filter(id => id !== item.expansionId()));
        }
    }
    /** Toggles the expansion state of the specified item. */
    toggle(item) {
        this.expandedIds().includes(item.expansionId()) ? this.close(item) : this.open(item);
    }
    /** Opens all focusable items in the list. */
    openAll() {
        if (this.inputs.multiExpandable()) {
            for (const item of this.inputs.items()) {
                this.open(item);
            }
        }
    }
    /** Closes all focusable items in the list. */
    closeAll() {
        for (const item of this.inputs.items()) {
            this.close(item);
        }
    }
    /** Checks whether the specified item is expandable / collapsible. */
    isExpandable(item) {
        return !this.inputs.disabled() && !item.disabled() && item.expandable();
    }
    /** Checks whether the specified item is currently expanded. */
    isExpanded(item) {
        return this.expandedIds().includes(item.expansionId());
    }
}

/** Controls label and description of an element. */
class LabelControl {
    inputs;
    /** The `aria-label`. */
    label = computed(() => this.inputs.label?.());
    /** The `aria-labelledby` ids. */
    labelledBy = computed(() => {
        const label = this.label();
        const labelledBy = this.inputs.labelledBy?.();
        const defaultLabelledBy = this.inputs.defaultLabelledBy();
        if (labelledBy && labelledBy.length > 0) {
            return labelledBy;
        }
        // If an aria-label is provided by developers, do not set aria-labelledby with the
        // defaultLabelledBy value because if both attributes are set, aria-labelledby will be used.
        if (label) {
            return [];
        }
        return defaultLabelledBy;
    });
    constructor(inputs) {
        this.inputs = inputs;
    }
}

/** A tab in a tablist. */
class TabPattern {
    inputs;
    /** Controls expansion for this tab. */
    expansion;
    /** A global unique identifier for the tab. */
    id;
    /** The index of the tab. */
    index = computed(() => this.inputs.tablist().inputs.items().indexOf(this));
    /** A local unique identifier for the tab. */
    value;
    /** Whether the tab is disabled. */
    disabled;
    /** The html element that should receive focus. */
    element;
    /** Whether the tab is selectable. */
    selectable = () => true;
    /** The text used by the typeahead search. */
    searchTerm = () => ''; // Unused because tabs do not support typeahead.
    /** Whether this tab has expandable content. */
    expandable = computed(() => this.expansion.expandable());
    /** The unique identifier used by the expansion behavior. */
    expansionId = computed(() => this.expansion.expansionId());
    /** Whether the tab is expanded. */
    expanded = computed(() => this.expansion.isExpanded());
    /** Whether the tab is active. */
    active = computed(() => this.inputs.tablist().inputs.activeItem() === this);
    /** Whether the tab is selected. */
    selected = computed(() => !!this.inputs.tablist().inputs.value().includes(this.value()));
    /** The tabindex of the tab. */
    tabindex = computed(() => this.inputs.tablist().listBehavior.getItemTabindex(this));
    /** The id of the tabpanel associated with the tab. */
    controls = computed(() => this.inputs.tabpanel()?.id());
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.value = inputs.value;
        this.disabled = inputs.disabled;
        this.element = inputs.element;
        this.expansion = new ExpansionControl({
            ...inputs,
            expansionId: inputs.value,
            expandable: () => true,
            expansionManager: inputs.tablist().expansionManager,
        });
    }
}
/** A tabpanel associated with a tab. */
class TabPanelPattern {
    inputs;
    /** A global unique identifier for the tabpanel. */
    id;
    /** A local unique identifier for the tabpanel. */
    value;
    /** Controls label for this tabpanel. */
    labelManager;
    /** Whether the tabpanel is hidden. */
    hidden = computed(() => this.inputs.tab()?.expanded() === false);
    /** The tabindex of this tabpanel. */
    tabindex = computed(() => (this.hidden() ? -1 : 0));
    /** The aria-labelledby value for this tabpanel. */
    labelledBy = computed(() => this.labelManager.labelledBy().length > 0
        ? this.labelManager.labelledBy().join(' ')
        : undefined);
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.value = inputs.value;
        this.labelManager = new LabelControl({
            ...inputs,
            defaultLabelledBy: computed(() => (this.inputs.tab() ? [this.inputs.tab().id()] : [])),
        });
    }
}
/** Controls the state of a tablist. */
class TabListPattern {
    inputs;
    /** The list behavior for the tablist. */
    listBehavior;
    /** Controls expansion for the tablist. */
    expansionManager;
    /** Whether the tablist is vertically or horizontally oriented. */
    orientation;
    /** Whether the tablist is disabled. */
    disabled;
    /** The tabindex of the tablist. */
    tabindex = computed(() => this.listBehavior.tabindex());
    /** The id of the current active tab. */
    activedescendant = computed(() => this.listBehavior.activedescendant());
    /** Whether selection should follow focus. */
    followFocus = computed(() => this.inputs.selectionMode() === 'follow');
    /** The key used to navigate to the previous tab in the tablist. */
    prevKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowUp';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** The key used to navigate to the next item in the list. */
    nextKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowDown';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** The keydown event manager for the tablist. */
    keydown = computed(() => {
        return new KeyboardEventManager()
            .on(this.prevKey, () => this.listBehavior.prev({ select: this.followFocus() }))
            .on(this.nextKey, () => this.listBehavior.next({ select: this.followFocus() }))
            .on('Home', () => this.listBehavior.first({ select: this.followFocus() }))
            .on('End', () => this.listBehavior.last({ select: this.followFocus() }))
            .on(' ', () => this.listBehavior.select())
            .on('Enter', () => this.listBehavior.select());
    });
    /** The pointerdown event manager for the tablist. */
    pointerdown = computed(() => {
        return new PointerEventManager().on(e => this.listBehavior.goto(this._getItem(e), { select: true }));
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.disabled = inputs.disabled;
        this.orientation = inputs.orientation;
        this.listBehavior = new List({
            ...inputs,
            multi: () => false,
            typeaheadDelay: () => 0, // Tabs do not support typeahead.
        });
        this.expansionManager = new ListExpansion({
            ...inputs,
            multiExpandable: () => false,
            expandedIds: this.inputs.value,
        });
    }
    /**
     * Sets the tablist to its default initial state.
     *
     * Sets the active index of the tablist to the first focusable selected
     * tab if one exists. Otherwise, sets focus to the first focusable tab.
     *
     * This method should be called once the tablist and its tabs are properly initialized.
     */
    setDefaultState() {
        let firstItem;
        for (const item of this.inputs.items()) {
            if (!this.listBehavior.isFocusable(item))
                continue;
            if (firstItem === undefined) {
                firstItem = item;
            }
            if (item.selected()) {
                this.inputs.activeItem.set(item);
                return;
            }
        }
        if (firstItem !== undefined) {
            this.inputs.activeItem.set(firstItem);
        }
    }
    /** Handles keydown events for the tablist. */
    onKeydown(event) {
        if (!this.disabled()) {
            this.keydown().handle(event);
        }
    }
    /** The pointerdown event manager for the tablist. */
    onPointerdown(event) {
        if (!this.disabled()) {
            this.pointerdown().handle(event);
        }
    }
    /** Returns the tab item associated with the given pointer event. */
    _getItem(e) {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        const element = e.target.closest('[role="tab"]');
        return this.inputs.items().find(i => i.element() === element);
    }
}

class ToolbarWidgetPattern {
    inputs;
    /** A unique identifier for the widget. */
    id;
    /** The html element that should receive focus. */
    element;
    /** Whether the widget is disabled. */
    disabled;
    /** A reference to the parent toolbar. */
    toolbar;
    /** The tabindex of the widgdet. */
    tabindex = computed(() => this.toolbar().listBehavior.getItemTabindex(this));
    /** The text used by the typeahead search. */
    searchTerm = () => ''; // Unused because toolbar does not support typeahead.
    /** The value associated with the widget. */
    value = () => ''; // Unused because toolbar does not support selection.
    /** Whether the widget is selectable. */
    selectable = () => true; // Unused because toolbar does not support selection.
    /** The position of the widget within the toolbar. */
    index = computed(() => this.toolbar().inputs.items().indexOf(this) ?? -1);
    /** Whether the widget is currently the active one (focused). */
    active = computed(() => this.toolbar().inputs.activeItem() === this);
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.element = inputs.element;
        this.disabled = inputs.disabled;
        this.toolbar = inputs.toolbar;
    }
}

/** A group of widgets within a toolbar that provides nested navigation. */
class ToolbarWidgetGroupPattern {
    inputs;
    /** A unique identifier for the widget. */
    id;
    /** The html element that should receive focus. */
    element;
    /** Whether the widget is disabled. */
    disabled;
    /** A reference to the parent toolbar. */
    toolbar;
    /** The text used by the typeahead search. */
    searchTerm = () => ''; // Unused because toolbar does not support typeahead.
    /** The value associated with the widget. */
    value = () => ''; // Unused because toolbar does not support selection.
    /** Whether the widget is selectable. */
    selectable = () => true; // Unused because toolbar does not support selection.
    /** The position of the widget within the toolbar. */
    index = computed(() => this.toolbar()?.inputs.items().indexOf(this) ?? -1);
    /** The actions that can be performed on the widget group. */
    controls = computed(() => this.inputs.controls() ?? this._defaultControls);
    /** Default toolbar widget group controls when no controls provided. */
    _defaultControls = {
        isOnFirstItem: () => true,
        isOnLastItem: () => true,
        next: () => { },
        prev: () => { },
        first: () => { },
        last: () => { },
        unfocus: () => { },
        trigger: () => { },
        goto: () => { },
        setDefaultState: () => { },
    };
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.element = inputs.element;
        this.disabled = inputs.disabled;
        this.toolbar = inputs.toolbar;
    }
}

/** Controls the state of a toolbar. */
class ToolbarPattern {
    inputs;
    /** The list behavior for the toolbar. */
    listBehavior;
    /** Whether the tablist is vertically or horizontally oriented. */
    orientation;
    /** Whether disabled items in the group should be skipped when navigating. */
    skipDisabled;
    /** Whether the toolbar is disabled. */
    disabled = computed(() => this.listBehavior.disabled());
    /** The tabindex of the toolbar (if using activedescendant). */
    tabindex = computed(() => this.listBehavior.tabindex());
    /** The id of the current active widget (if using activedescendant). */
    activedescendant = computed(() => this.listBehavior.activedescendant());
    /** The key used to navigate to the previous widget. */
    _prevKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowUp';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** The key used to navigate to the next widget. */
    _nextKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowDown';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** The alternate key used to navigate to the previous widget. */
    _altPrevKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
        }
        return 'ArrowUp';
    });
    /** The alternate key used to navigate to the next widget. */
    _altNextKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
        }
        return 'ArrowDown';
    });
    /** The keydown event manager for the toolbar. */
    _keydown = computed(() => {
        const manager = new KeyboardEventManager();
        return manager
            .on(this._nextKey, () => this._next())
            .on(this._prevKey, () => this._prev())
            .on(this._altNextKey, () => this._groupNext())
            .on(this._altPrevKey, () => this._groupPrev())
            .on(' ', () => this._trigger())
            .on('Enter', () => this._trigger())
            .on('Home', () => this._first())
            .on('End', () => this._last());
    });
    /** The pointerdown event manager for the toolbar. */
    _pointerdown = computed(() => new PointerEventManager().on(e => this._goto(e)));
    /** Navigates to the next widget in the toolbar. */
    _next() {
        const item = this.inputs.activeItem();
        if (item instanceof ToolbarWidgetGroupPattern) {
            if (!item.disabled() && !item.controls().isOnLastItem()) {
                item.controls().next(false);
                return;
            }
            item.controls().unfocus();
        }
        this.listBehavior.next();
        const newItem = this.inputs.activeItem();
        if (newItem instanceof ToolbarWidgetGroupPattern) {
            newItem.controls().first();
        }
    }
    /** Navigates to the previous widget in the toolbar. */
    _prev() {
        const item = this.inputs.activeItem();
        if (item instanceof ToolbarWidgetGroupPattern) {
            if (!item.disabled() && !item.controls().isOnFirstItem()) {
                item.controls().prev(false);
                return;
            }
            item.controls().unfocus();
        }
        this.listBehavior.prev();
        const newItem = this.inputs.activeItem();
        if (newItem instanceof ToolbarWidgetGroupPattern) {
            newItem.controls().last();
        }
    }
    _groupNext() {
        const item = this.inputs.activeItem();
        if (item instanceof ToolbarWidgetPattern)
            return;
        item?.controls().next(true);
    }
    _groupPrev() {
        const item = this.inputs.activeItem();
        if (item instanceof ToolbarWidgetPattern)
            return;
        item?.controls().prev(true);
    }
    /** Triggers the action of the currently active widget. */
    _trigger() {
        const item = this.inputs.activeItem();
        if (item instanceof ToolbarWidgetGroupPattern) {
            item.controls().trigger();
        }
    }
    /** Navigates to the first widget in the toolbar. */
    _first() {
        const item = this.inputs.activeItem();
        if (item instanceof ToolbarWidgetGroupPattern) {
            item.controls().unfocus();
        }
        this.listBehavior.first();
        const newItem = this.inputs.activeItem();
        if (newItem instanceof ToolbarWidgetGroupPattern) {
            newItem.controls().first();
        }
    }
    /** Navigates to the last widget in the toolbar. */
    _last() {
        const item = this.inputs.activeItem();
        if (item instanceof ToolbarWidgetGroupPattern) {
            item.controls().unfocus();
        }
        this.listBehavior.last();
        const newItem = this.inputs.activeItem();
        if (newItem instanceof ToolbarWidgetGroupPattern) {
            newItem.controls().last();
        }
    }
    /** Navigates to the widget targeted by a pointer event. */
    _goto(e) {
        const item = this.inputs.getItem(e.target);
        if (!item)
            return;
        this.listBehavior.goto(item);
        if (item instanceof ToolbarWidgetGroupPattern) {
            item.controls().goto(e);
        }
    }
    constructor(inputs) {
        this.inputs = inputs;
        this.orientation = inputs.orientation;
        this.skipDisabled = inputs.skipDisabled;
        this.listBehavior = new List({
            ...inputs,
            multi: () => false,
            focusMode: () => 'roving',
            selectionMode: () => 'explicit',
            value: signal([]),
            typeaheadDelay: () => 0, // Toolbar widgets do not support typeahead.
        });
    }
    /** Handles keydown events for the toolbar. */
    onKeydown(event) {
        if (this.disabled())
            return;
        this._keydown().handle(event);
    }
    /** Handles pointerdown events for the toolbar. */
    onPointerdown(event) {
        if (this.disabled())
            return;
        this._pointerdown().handle(event);
    }
    /**
     * Sets the toolbar to its default initial state.
     *
     * Sets the active index to the selected widget if one exists and is focusable.
     * Otherwise, sets the active index to the first focusable widget.
     */
    setDefaultState() {
        let firstItem = null;
        for (const item of this.inputs.items()) {
            if (this.listBehavior.isFocusable(item)) {
                if (!firstItem) {
                    firstItem = item;
                }
            }
        }
        if (firstItem) {
            this.inputs.activeItem.set(firstItem);
        }
        if (firstItem instanceof ToolbarWidgetGroupPattern) {
            firstItem.controls().setDefaultState();
        }
    }
    /** Validates the state of the toolbar and returns a list of accessibility violations. */
    validate() {
        const violations = [];
        return violations;
    }
}

const focusMode = () => 'roving';
/** A pattern controls the nested Accordions. */
class AccordionGroupPattern {
    inputs;
    /** Controls navigation for the group. */
    navigation;
    /** Controls focus for the group. */
    focusManager;
    /** Controls expansion for the group. */
    expansionManager;
    constructor(inputs) {
        this.inputs = inputs;
        this.wrap = inputs.wrap;
        this.orientation = inputs.orientation;
        this.textDirection = inputs.textDirection;
        this.activeItem = inputs.activeItem;
        this.disabled = inputs.disabled;
        this.multiExpandable = inputs.multiExpandable;
        this.items = inputs.items;
        this.expandedIds = inputs.expandedIds;
        this.skipDisabled = inputs.skipDisabled;
        this.focusManager = new ListFocus({
            ...inputs,
            focusMode,
        });
        this.navigation = new ListNavigation({
            ...inputs,
            focusMode,
            focusManager: this.focusManager,
        });
        this.expansionManager = new ListExpansion({
            ...inputs,
        });
    }
}
/** A pattern controls the expansion state of an accordion. */
class AccordionTriggerPattern {
    inputs;
    /** Whether this tab has expandable content. */
    expandable;
    /** The unique identifier used by the expansion behavior. */
    expansionId;
    /** Whether an accordion is expanded. */
    expanded;
    /** Controls the expansion state for the trigger. */
    expansionControl;
    /** Whether the trigger is active. */
    active = computed(() => this.inputs.accordionGroup().activeItem() === this);
    /** Id of the accordion panel controlled by the trigger. */
    controls = computed(() => this.inputs.accordionPanel()?.id());
    /** The tabindex of the trigger. */
    tabindex = computed(() => (this.inputs.accordionGroup().focusManager.isFocusable(this) ? 0 : -1));
    /** Whether the trigger is disabled. Disabling an accordion group disables all the triggers. */
    disabled = computed(() => this.inputs.disabled() || this.inputs.accordionGroup().disabled());
    /** The index of the trigger within its accordion group. */
    index = computed(() => this.inputs.accordionGroup().items().indexOf(this));
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.element = inputs.element;
        this.value = inputs.value;
        this.expansionControl = new ExpansionControl({
            ...inputs,
            expansionId: inputs.value,
            expandable: () => true,
            expansionManager: inputs.accordionGroup().expansionManager,
        });
        this.expandable = this.expansionControl.isExpandable;
        this.expansionId = this.expansionControl.expansionId;
        this.expanded = this.expansionControl.isExpanded;
    }
    /** The key used to navigate to the previous accordion trigger. */
    prevKey = computed(() => {
        if (this.inputs.accordionGroup().orientation() === 'vertical') {
            return 'ArrowUp';
        }
        return this.inputs.accordionGroup().textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** The key used to navigate to the next accordion trigger. */
    nextKey = computed(() => {
        if (this.inputs.accordionGroup().orientation() === 'vertical') {
            return 'ArrowDown';
        }
        return this.inputs.accordionGroup().textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** The keydown event manager for the accordion trigger. */
    keydown = computed(() => {
        return new KeyboardEventManager()
            .on(this.prevKey, () => this.inputs.accordionGroup().navigation.prev())
            .on(this.nextKey, () => this.inputs.accordionGroup().navigation.next())
            .on('Home', () => this.inputs.accordionGroup().navigation.first())
            .on('End', () => this.inputs.accordionGroup().navigation.last())
            .on(' ', () => this.expansionControl.toggle())
            .on('Enter', () => this.expansionControl.toggle());
    });
    /** The pointerdown event manager for the accordion trigger. */
    pointerdown = computed(() => {
        return new PointerEventManager().on(e => {
            const item = this._getItem(e);
            if (item) {
                this.inputs.accordionGroup().navigation.goto(item);
                this.expansionControl.toggle();
            }
        });
    });
    /** Handles keydown events on the trigger, delegating to the group if not disabled. */
    onKeydown(event) {
        this.keydown().handle(event);
    }
    /** Handles pointerdown events on the trigger, delegating to the group if not disabled. */
    onPointerdown(event) {
        this.pointerdown().handle(event);
    }
    /** Handles focus events on the trigger. This ensures the tabbing changes the active index. */
    onFocus(event) {
        const item = this._getItem(event);
        if (item && this.inputs.accordionGroup().focusManager.isFocusable(item)) {
            this.inputs.accordionGroup().focusManager.focus(item);
        }
    }
    _getItem(e) {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        const element = e.target.closest('[role="button"]');
        return this.inputs
            .accordionGroup()
            .items()
            .find(i => i.element() === element);
    }
}
/** Represents an accordion panel. */
class AccordionPanelPattern {
    inputs;
    /** Whether the accordion panel is hidden. True if the associated trigger is not expanded. */
    hidden;
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.value = inputs.value;
        this.accordionTrigger = inputs.accordionTrigger;
        this.hidden = computed(() => inputs.accordionTrigger()?.expanded() === false);
    }
}

/**
 * Represents an item in a Tree.
 */
class TreeItemPattern {
    inputs;
    /** A unique identifier for this item. */
    id;
    /** The value of this item. */
    value;
    /** A reference to the item element. */
    element;
    /** Whether the item is disabled. */
    disabled;
    /** The text used by the typeahead search. */
    searchTerm;
    /** The tree pattern this item belongs to. */
    tree;
    /** The parent item. */
    parent;
    /** The children items. */
    children;
    /** The position of this item among its siblings. */
    index = computed(() => this.tree().visibleItems().indexOf(this));
    /** The unique identifier used by the expansion behavior. */
    expansionId;
    /** Controls expansion for child items. */
    expansionManager;
    /** Controls expansion for this item. */
    expansion;
    /** Whether the item is expandable. It's expandable if children item exist. */
    expandable;
    /** Whether the item is selectable. */
    selectable;
    /** The level of the current item in a tree. */
    level = computed(() => this.parent().level() + 1);
    /** Whether this item is currently expanded. */
    expanded = computed(() => this.expansion.isExpanded());
    /** Whether this item is visible. */
    visible = computed(() => this.parent().expanded());
    /** The number of items under the same parent at the same level. */
    setsize = computed(() => this.parent().children().length);
    /** The position of this item among its siblings (1-based). */
    posinset = computed(() => this.parent().children().indexOf(this) + 1);
    /** Whether the item is active. */
    active = computed(() => this.tree().activeItem() === this);
    /** The tabindex of the item. */
    tabindex = computed(() => this.tree().listBehavior.getItemTabindex(this));
    /** Whether the item is selected. */
    selected = computed(() => {
        if (this.tree().nav()) {
            return undefined;
        }
        if (!this.selectable()) {
            return undefined;
        }
        return this.tree().value().includes(this.value());
    });
    /** The current type of this item. */
    current = computed(() => {
        if (!this.tree().nav()) {
            return undefined;
        }
        if (!this.selectable()) {
            return undefined;
        }
        return this.tree().value().includes(this.value()) ? this.tree().currentType() : undefined;
    });
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.value = inputs.value;
        this.element = inputs.element;
        this.disabled = inputs.disabled;
        this.searchTerm = inputs.searchTerm;
        this.expansionId = inputs.id;
        this.tree = inputs.tree;
        this.parent = inputs.parent;
        this.children = inputs.children;
        this.expandable = inputs.hasChildren;
        this.selectable = inputs.selectable;
        this.expansion = new ExpansionControl({
            ...inputs,
            expandable: this.expandable,
            expansionId: this.expansionId,
            expansionManager: this.parent().expansionManager,
        });
        this.expansionManager = new ListExpansion({
            ...inputs,
            multiExpandable: () => true,
            // TODO(ok7sai): allow pre-expanded tree items.
            expandedIds: signal([]),
            items: this.children,
            disabled: computed(() => this.tree()?.disabled() ?? false),
        });
    }
}
/** Controls the state and interactions of a tree view. */
class TreePattern {
    inputs;
    /** The list behavior for the tree. */
    listBehavior;
    /** Controls expansion for direct children of the tree root (top-level items). */
    expansionManager;
    /** The root level is 0. */
    level = () => 0;
    /** The root is always expanded. */
    expanded = () => true;
    /** The tabindex of the tree. */
    tabindex = computed(() => this.listBehavior.tabindex());
    /** The id of the current active item. */
    activedescendant = computed(() => this.listBehavior.activedescendant());
    /** The direct children of the root (top-level tree items). */
    children = computed(() => this.inputs.allItems().filter(item => item.level() === this.level() + 1));
    /** All currently visible tree items. An item is visible if their parent is expanded. */
    visibleItems = computed(() => this.inputs.allItems().filter(item => item.visible()));
    /** Whether the tree selection follows focus. */
    followFocus = computed(() => this.inputs.selectionMode() === 'follow');
    /** The key for navigating to the previous item. */
    prevKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowUp';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** The key for navigating to the next item. */
    nextKey = computed(() => {
        if (this.inputs.orientation() === 'vertical') {
            return 'ArrowDown';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** The key for collapsing an item or moving to its parent. */
    collapseKey = computed(() => {
        if (this.inputs.orientation() === 'horizontal') {
            return 'ArrowUp';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    });
    /** The key for expanding an item or moving to its first child. */
    expandKey = computed(() => {
        if (this.inputs.orientation() === 'horizontal') {
            return 'ArrowDown';
        }
        return this.inputs.textDirection() === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    });
    /** Represents the space key. Does nothing when the user is actively using typeahead. */
    dynamicSpaceKey = computed(() => (this.listBehavior.isTyping() ? '' : ' '));
    /** Regular expression to match characters for typeahead. */
    typeaheadRegexp = /^.$/;
    /** The keydown event manager for the tree. */
    keydown = computed(() => {
        const manager = new KeyboardEventManager();
        const list = this.listBehavior;
        manager
            .on(this.prevKey, () => list.prev({ selectOne: this.followFocus() }))
            .on(this.nextKey, () => list.next({ selectOne: this.followFocus() }))
            .on('Home', () => list.first({ selectOne: this.followFocus() }))
            .on('End', () => list.last({ selectOne: this.followFocus() }))
            .on(this.typeaheadRegexp, e => list.search(e.key, { selectOne: this.followFocus() }))
            .on(this.expandKey, () => this.expand({ selectOne: this.followFocus() }))
            .on(this.collapseKey, () => this.collapse({ selectOne: this.followFocus() }))
            .on(Modifier.Shift, '*', () => this.expandSiblings());
        if (this.inputs.multi()) {
            manager
                // TODO: Tracking the anchor by index can break if the
                // tree is expanded or collapsed causing the index to change.
                .on(Modifier.Any, 'Shift', () => list.anchor(this.listBehavior.activeIndex()))
                .on(Modifier.Shift, this.prevKey, () => list.prev({ selectRange: true }))
                .on(Modifier.Shift, this.nextKey, () => list.next({ selectRange: true }))
                .on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'Home', () => list.first({ selectRange: true, anchor: false }))
                .on([Modifier.Ctrl | Modifier.Shift, Modifier.Meta | Modifier.Shift], 'End', () => list.last({ selectRange: true, anchor: false }))
                .on(Modifier.Shift, 'Enter', () => list.updateSelection({ selectRange: true, anchor: false }))
                .on(Modifier.Shift, this.dynamicSpaceKey, () => list.updateSelection({ selectRange: true, anchor: false }));
        }
        if (!this.followFocus() && this.inputs.multi()) {
            manager
                .on(this.dynamicSpaceKey, () => list.toggle())
                .on('Enter', () => list.toggle())
                .on([Modifier.Ctrl, Modifier.Meta], 'A', () => list.toggleAll());
        }
        if (!this.followFocus() && !this.inputs.multi()) {
            manager.on(this.dynamicSpaceKey, () => list.selectOne());
            manager.on('Enter', () => list.selectOne());
        }
        if (this.inputs.multi() && this.followFocus()) {
            manager
                .on([Modifier.Ctrl, Modifier.Meta], this.prevKey, () => list.prev())
                .on([Modifier.Ctrl, Modifier.Meta], this.nextKey, () => list.next())
                .on([Modifier.Ctrl, Modifier.Meta], this.expandKey, () => this.expand())
                .on([Modifier.Ctrl, Modifier.Meta], this.collapseKey, () => this.collapse())
                .on([Modifier.Ctrl, Modifier.Meta], ' ', () => list.toggle())
                .on([Modifier.Ctrl, Modifier.Meta], 'Enter', () => list.toggle())
                .on([Modifier.Ctrl, Modifier.Meta], 'Home', () => list.first())
                .on([Modifier.Ctrl, Modifier.Meta], 'End', () => list.last())
                .on([Modifier.Ctrl, Modifier.Meta], 'A', () => {
                list.toggleAll();
                list.select(); // Ensure the currect item remains selected.
            });
        }
        return manager;
    });
    /** The pointerdown event manager for the tree. */
    pointerdown = computed(() => {
        const manager = new PointerEventManager();
        if (this.multi()) {
            manager.on(Modifier.Shift, e => this.goto(e, { selectRange: true }));
        }
        if (!this.multi()) {
            return manager.on(e => this.goto(e, { selectOne: true }));
        }
        if (this.multi() && this.followFocus()) {
            return manager
                .on(e => this.goto(e, { selectOne: true }))
                .on(Modifier.Ctrl, e => this.goto(e, { toggle: true }));
        }
        if (this.multi() && !this.followFocus()) {
            return manager.on(e => this.goto(e, { toggle: true }));
        }
        return manager;
    });
    /** A unique identifier for the tree. */
    id;
    /** Whether the tree is in navigation mode. */
    nav;
    /** The aria-current type. */
    currentType;
    /** All items in the tree, in document order (DFS-like, a flattened list). */
    allItems;
    /** Whether the tree is disabled. */
    disabled;
    /** The currently active item in the tree. */
    activeItem = signal(undefined);
    /** Whether disabled items should be skipped when navigating. */
    skipDisabled;
    /** Whether the focus should wrap when navigating past the first or last item. */
    wrap;
    /** The orientation of the tree. */
    orientation;
    /** The text direction of the tree. */
    textDirection;
    /** Whether multiple items can be selected at the same time. */
    multi;
    /** The selection mode of the tree. */
    selectionMode;
    /** The delay in milliseconds to wait before clearing the typeahead buffer. */
    typeaheadDelay;
    /** The current value of the tree (the selected items). */
    value;
    constructor(inputs) {
        this.inputs = inputs;
        this.id = inputs.id;
        this.nav = inputs.nav;
        this.currentType = inputs.currentType;
        this.allItems = inputs.allItems;
        this.focusMode = inputs.focusMode;
        this.disabled = inputs.disabled;
        this.activeItem = inputs.activeItem;
        this.skipDisabled = inputs.skipDisabled;
        this.wrap = inputs.wrap;
        this.orientation = inputs.orientation;
        this.textDirection = inputs.textDirection;
        this.multi = computed(() => (this.nav() ? false : this.inputs.multi()));
        this.selectionMode = inputs.selectionMode;
        this.typeaheadDelay = inputs.typeaheadDelay;
        this.value = inputs.value;
        this.listBehavior = new List({
            ...inputs,
            items: this.visibleItems,
            multi: this.multi,
        });
        this.expansionManager = new ListExpansion({
            multiExpandable: () => true,
            // TODO(ok7sai): allow pre-expanded tree items.
            expandedIds: signal([]),
            items: this.children,
            disabled: this.disabled,
        });
    }
    /**
     * Sets the tree to it's default initial state.
     *
     * Sets the active index of the tree to the first focusable selected tree item if one exists.
     * Otherwise, sets focus to the first focusable tree item.
     */
    setDefaultState() {
        let firstItem;
        for (const item of this.allItems()) {
            if (!item.visible())
                continue;
            if (!this.listBehavior.isFocusable(item))
                continue;
            if (firstItem === undefined) {
                firstItem = item;
            }
            if (item.selected()) {
                this.activeItem.set(item);
                return;
            }
        }
        if (firstItem !== undefined) {
            this.activeItem.set(firstItem);
        }
    }
    /** Handles keydown events on the tree. */
    onKeydown(event) {
        if (!this.disabled()) {
            this.keydown().handle(event);
        }
    }
    /** Handles pointerdown events on the tree. */
    onPointerdown(event) {
        if (!this.disabled()) {
            this.pointerdown().handle(event);
        }
    }
    /** Navigates to the given tree item in the tree. */
    goto(e, opts) {
        const item = this._getItem(e);
        if (!item)
            return;
        this.listBehavior.goto(item, opts);
        this.toggleExpansion(item);
    }
    /** Toggles to expand or collapse a tree item. */
    toggleExpansion(item) {
        item ??= this.activeItem();
        if (!item || !this.listBehavior.isFocusable(item))
            return;
        if (!item.expandable())
            return;
        if (item.expanded()) {
            this.collapse();
        }
        else {
            item.expansion.open();
        }
    }
    /** Expands a tree item. */
    expand(opts) {
        const item = this.activeItem();
        if (!item || !this.listBehavior.isFocusable(item))
            return;
        if (item.expandable() && !item.expanded()) {
            item.expansion.open();
        }
        else if (item.expanded() &&
            item.children().some(item => this.listBehavior.isFocusable(item))) {
            this.listBehavior.next(opts);
        }
    }
    /** Expands all sibling tree items including itself. */
    expandSiblings(item) {
        item ??= this.activeItem();
        const siblings = item?.parent()?.children();
        siblings?.forEach(item => item.expansion.open());
    }
    /** Collapses a tree item. */
    collapse(opts) {
        const item = this.activeItem();
        if (!item || !this.listBehavior.isFocusable(item))
            return;
        if (item.expandable() && item.expanded()) {
            item.expansion.close();
        }
        else if (item.parent() && item.parent() !== this) {
            const parentItem = item.parent();
            if (parentItem instanceof TreeItemPattern && this.listBehavior.isFocusable(parentItem)) {
                this.listBehavior.goto(parentItem, opts);
            }
        }
    }
    /** Retrieves the TreeItemPattern associated with a DOM event, if any. */
    _getItem(event) {
        if (!(event.target instanceof HTMLElement)) {
            return;
        }
        const element = event.target.closest('[role="treeitem"]');
        return this.inputs.allItems().find(i => i.element() === element);
    }
}

class ComboboxTreePattern extends TreePattern {
    inputs;
    /** Whether the currently focused item is collapsible. */
    isItemCollapsible = () => this.inputs.activeItem()?.parent() instanceof TreeItemPattern;
    /** The ARIA role for the tree. */
    role = () => 'tree';
    /* The id of the active (focused) item in the tree. */
    activeId = computed(() => this.listBehavior.activedescendant());
    /** The list of items in the tree. */
    items = computed(() => this.inputs.allItems());
    /** The tabindex for the tree. Always -1 because the combobox handles focus. */
    tabindex = () => -1;
    constructor(inputs) {
        if (inputs.combobox()) {
            inputs.multi = () => false;
            inputs.focusMode = () => 'activedescendant';
            inputs.element = inputs.combobox().inputs.inputEl;
        }
        super(inputs);
        this.inputs = inputs;
    }
    /** Noop. The combobox handles keydown events. */
    onKeydown(_) { }
    /** Noop. The combobox handles pointerdown events. */
    onPointerdown(_) { }
    /** Noop. The combobox controls the open state. */
    setDefaultState() { }
    /** Navigates to the specified item in the tree. */
    focus = (item) => this.listBehavior.goto(item);
    /** Navigates to the next focusable item in the tree. */
    next = () => this.listBehavior.next();
    /** Navigates to the previous focusable item in the tree. */
    prev = () => this.listBehavior.prev();
    /** Navigates to the last focusable item in the tree. */
    last = () => this.listBehavior.last();
    /** Navigates to the first focusable item in the tree. */
    first = () => this.listBehavior.first();
    /** Unfocuses the currently focused item in the tree. */
    unfocus = () => this.listBehavior.unfocus();
    // TODO: handle non-selectable parent nodes.
    /** Selects the specified item in the tree or the current active item if not provided. */
    select = (item) => this.listBehavior.select(item);
    /** Clears the selection in the tree. */
    clearSelection = () => this.listBehavior.deselectAll();
    /** Retrieves the TreeItemPattern associated with a pointer event. */
    getItem = (e) => this._getItem(e);
    /** Retrieves the currently selected item in the tree */
    getSelectedItem = () => this.inputs.allItems().find(i => i.selected());
    /** Sets the value of the combobox tree. */
    setValue = (value) => this.inputs.value.set(value ? [value] : []);
    /** Expands the currently focused item if it is expandable. */
    expandItem = () => this.expand();
    /** Collapses the currently focused item if it is expandable. */
    collapseItem = () => this.collapse();
    /** Whether the specified item or the currently active item is expandable. */
    isItemExpandable(item = this.inputs.activeItem()) {
        return item ? item.expandable() : false;
    }
    /** Expands all of the tree items. */
    expandAll = () => this.items().forEach(item => item.expansion.open());
    /** Collapses all of the tree items. */
    collapseAll = () => this.items().forEach(item => item.expansion.close());
}

export { AccordionGroupPattern, AccordionPanelPattern, AccordionTriggerPattern, ComboboxListboxPattern, ComboboxPattern, ComboboxTreePattern, ListboxPattern, MenuBarPattern, MenuItemPattern, MenuPattern, MenuTriggerPattern, OptionPattern, RadioButtonPattern, RadioGroupPattern, TabListPattern, TabPanelPattern, TabPattern, ToolbarPattern, ToolbarRadioGroupPattern, ToolbarWidgetGroupPattern, ToolbarWidgetPattern, TreeItemPattern, TreePattern, convertGetterSetterToWritableSignalLike };
//# sourceMappingURL=private.mjs.map
