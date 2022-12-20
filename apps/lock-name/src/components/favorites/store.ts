const key = 'doidFavors'
export const getFavorites = () => {
  const saved = localStorage.getItem(key) || '[]'
  return JSON.parse(saved)
}
const save = (favors: []) => localStorage.setItem(key, JSON.stringify(favors))
export const favor = (name: unknown) => {
  const exist = exists(name, true)
  if (typeof name === 'string') {
    name = { name }
  }
  if (!exist) {
    const favors = getFavorites()
    favors.push(name)
    save(favors)
  }
}
export const exists = (name: unknown, del = false) => {
  const favors = getFavorites()
  const found = favors.some((r: Record<string, unknown>, i: number) => {
    const exist = r.name === name
    if (del && exist) favors.splice(i, 1)
    return exist
  })
  if (del && found) save(favors)
  return found
}
