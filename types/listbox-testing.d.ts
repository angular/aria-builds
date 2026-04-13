import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Filters for locating a `ListboxOptionHarness`. */
interface ListboxOptionHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
    /** Only find instances whose selected state matches the given value. */
    selected?: boolean;
    /** Only find instances whose disabled state matches the given value. */
    disabled?: boolean;
}
/** Filters for locating a `ListboxHarness`. */
interface ListboxHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose disabled state matches the given value. */
    disabled?: boolean;
}

declare class ListboxOptionHarness extends ComponentHarness {
    static hostSelector: string;
    static with(options?: ListboxOptionHarnessFilters): HarnessPredicate<ListboxOptionHarness>;
    isSelected(): Promise<boolean>;
    isDisabled(): Promise<boolean>;
    getText(): Promise<string>;
    click(): Promise<void>;
}
declare class ListboxHarness extends ComponentHarness {
    static hostSelector: string;
    static with(options?: ListboxHarnessFilters): HarnessPredicate<ListboxHarness>;
    getOrientation(): Promise<'vertical' | 'horizontal'>;
    isMulti(): Promise<boolean>;
    isDisabled(): Promise<boolean>;
    getOptions(filters?: ListboxOptionHarnessFilters): Promise<ListboxOptionHarness[]>;
    focus(): Promise<void>;
    /** Blurs the listbox container. */
    blur(): Promise<void>;
}

export { ListboxHarness, ListboxOptionHarness };
export type { ListboxHarnessFilters, ListboxOptionHarnessFilters };
