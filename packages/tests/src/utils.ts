export const html = async (component: string) => {
  document.body.innerHTML = component
  await 0
}
export const el = (compSelector: string) => document.body.querySelector(compSelector)!
export const elInside = (compSelector: string, selector = ':first-child'): HTMLElement =>
  document.body.querySelector(compSelector)!.shadowRoot!.querySelector(selector)!

export const mockApi = 'http://localhost/mocks'
