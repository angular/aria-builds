function sortDirectives(a, b) {
  return (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}

export { sortDirectives };
//# sourceMappingURL=_element-chunk.mjs.map
