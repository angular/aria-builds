type SignalLike<T> = () => T;
interface WritableSignalLike<T> extends SignalLike<T> {
    set(value: T): void;
    update(updateFn: (value: T) => T): void;
    asReadonly(): SignalLike<T>;
}
/** Converts a getter setter style signal to a WritableSignalLike. */
declare function convertGetterSetterToWritableSignalLike<T>(getter: () => T, setter: (v: T) => void): WritableSignalLike<T>;
declare function computed<T>(computation: () => T): SignalLike<T>;
declare function signal<T>(initialValue: T): WritableSignalLike<T>;
declare function linkedSignal<T>(sourceFn: () => T): WritableSignalLike<T>;

export { computed, convertGetterSetterToWritableSignalLike, linkedSignal, signal };
export type { SignalLike, WritableSignalLike };
