export default function closest(element: Element, predicate: (element: Element) => boolean): Element | null {
  for (
    let current: Node | null = element;
    current !== null;
    current = current.parentNode
  ) {
    if (current instanceof Element && predicate(current)) {
      return current
    }
  }

  return null
}