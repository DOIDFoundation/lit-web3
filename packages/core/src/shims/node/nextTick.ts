import './process'
// import nexTickArgs from 'process-nextick-args'
const nextTick = (fn: Function, ...args: any) => setTimeout(() => fn(...args))
if (typeof process.nextTick === 'undefined') Object.defineProperty(process, 'nextTick', { value: nextTick })
export default nextTick
