import { TailwindElement, html } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
// Components
import '@lit-web3/dui/src/doid-symbol'

import style from './help.css?inline'

@customElement('view-help')
export class ViewHelp extends TailwindElement(style) {
  links = [
    { name: 'Twitter', icon: 'twitter', uri: import.meta.env.VITE_APP_TWITTER },
    { name: 'Discord', icon: 'discord', uri: import.meta.env.VITE_APP_DISCORD }
  ]
  render() {
    return html`<div class="app-help py-4 ">
      <div class="dui-container text-center mx-auto">
        <doid-symbol>
          <span slot="h1">How to get an invitation code</span>
        </doid-symbol>
        <ul class="text-base m-8">
          <li>· Get it from a friend.</li>
          <li>· Join our give-away events.</li>
        </ul>
        <p class="help-links m-4 flex justify-center items-center gap-6 text-center">
          ${repeat(
            this.links,
            (link) =>
              html`<a class="!text-black text-3xl" href="${link.uri}" target="_blank" rel="noopener"
                ><i class="mdi mdi-${link.icon}"></i
              ></a>`
          )}
        </p>
      </div>
    </div>`
  }
}
