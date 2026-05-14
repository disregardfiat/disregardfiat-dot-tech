import katex from 'katex'

export function renderDisplay(el: HTMLElement | null, tex: string): void {
  if (!el) return
  katex.render(tex, el, { displayMode: true, throwOnError: false, strict: 'ignore' })
}

export function renderInline(tex: string): string {
  return katex.renderToString(tex, { displayMode: false, throwOnError: false, strict: 'ignore' })
}
