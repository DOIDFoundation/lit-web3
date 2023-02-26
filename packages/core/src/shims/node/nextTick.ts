import './process'
// import nextTick from 'next-tick'
const nextTick = setTimeout
// import nexTickArgs from 'process-nextick-args'
Object.defineProperty(process, 'nextTick', { value: nextTick })
export default nextTick
