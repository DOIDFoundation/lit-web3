const key = 'doid.favors'
export const getFavorites = (): FavorName[] => JSON.parse(localStorage.getItem(key) || '[]')
const save = (favors: FavorName[]) => localStorage.setItem(key, JSON.stringify(favors))
export const favor = (name: string) => {
  const exist = exists(name, true)
  const favorName = typeof name === 'string' ? { name } : name
  if (!exist) {
    const favors = getFavorites()
    favors.push(favorName)
    save(favors)
  }
}
export const exists = (name: string, del = false) => {
  const favors = getFavorites()
  const found = favors.some((r, i) => {
    const exist = r.name === name
    if (del && exist) favors.splice(i, 1)
    return exist
  })
  if (del && found) save(favors)
  return found
}
