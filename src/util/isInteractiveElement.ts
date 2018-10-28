const interactiveTags = ['input', 'select', 'textarea', 'button']

export default function isInteractiveElement(element: Element): boolean {
  if (!(element instanceof HTMLElement)) { return false }

  const tagName = element.tagName.toLowerCase()

  if (tagName === 'a' && element.hasAttribute('href')) { return true }
  if (element.hasAttribute('tabindex')) { return true }
  if (element.isContentEditable) { return true }

  return interactiveTags.includes(tagName)
}