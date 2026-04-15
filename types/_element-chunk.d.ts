interface HasElement {
    element: HTMLElement;
}
/**
 * Sort directives by their document order.
 */
declare function sortDirectives(a: HasElement, b: HasElement): 1 | -1;

export { sortDirectives };
export type { HasElement };
