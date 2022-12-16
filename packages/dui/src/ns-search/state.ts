import { State, property } from '@lit-app/state'
export { StateController } from '@lit-app/state'

class SearchStore extends State {
  @property({ value: '' }) enterKey!: string

  get address(): string {
    return `${this.enterKey}`
  }

  get doidAddr(): string {
    return ''
  }
}

export const searchStore = new SearchStore()
