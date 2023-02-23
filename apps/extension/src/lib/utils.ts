export const chkPwdValid = (pwd: string, { min = 8, max = 30 } = {}) => {
  const len = pwd.length
  if (len < min) return { error: true, msg: `Minimum ${min} characters required` }
  return { pwd }
}
