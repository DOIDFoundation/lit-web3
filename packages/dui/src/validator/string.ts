export const between = (str: string, { min = 8, max = 30 } = {}) => {
  const len = str.length
  if (len < min) return { error: true, msg: `Minimum ${min} characters required` }
  if (len > max) return { error: true, msg: `Maximum ${max} characters required` }
  return { str }
}
