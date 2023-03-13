import './process'
// import nexTickArgs from 'process-nextick-args'
const nextTick = async (fn: Function, ...args: any) => {
  await 0
  fn(...args)
}
if (typeof process.nextTick === 'undefined') Object.defineProperty(process, 'nextTick', { value: nextTick })
export default nextTick
