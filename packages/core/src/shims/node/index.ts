import nextTick from './nextTick'
import shimBuffer from './buffer'
import './stream'

shimBuffer()

export { nextTick, shimBuffer }
