const saveCache = (src: string, blobSrc?: string) =>
  !blobSrc || src === blobSrc
    ? sessionStorage.setItem(`err.${src}`, src)
    : sessionStorage.setItem(`blob.${src}`, blobSrc)
const fromCache = (src: string) => sessionStorage.getItem(`blob.${src}`) || sessionStorage.getItem(`err.${src}`)
export const compress = async (src: string, { maxW = 400 } = {}): Promise<string> => {
  return new Promise((resolve) => {
    if (!src) return resolve('')
    const cachedBlob = fromCache(src)
    if (cachedBlob) return resolve(cachedBlob)
    const img = new Image()
    img.src = src
    img.crossOrigin = 'anonymous'
    img.onload = async () => {
      let [width, height] = [img.width, img.height]
      let [sx, sy, sw, sh] = [0, 0, width, height]
      if (width > maxW) {
        height = maxW * (height / width)
        width = maxW
      }
      if (height > maxW) {
        width = maxW * (width / height)
        height = maxW
      }
      const aspectRatio = img.height / img.width
      canvas$.width = width
      canvas$.height = height
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height)
      setUrl()
    }
    img.onerror = () => {
      saveCache(src)
      resolve(src)
    }
    const canvas$ = document.createElement('canvas')
    const ctx: any = canvas$.getContext('2d')
    const setUrl = () => {
      try {
        canvas$.toBlob(
          (blob: any) => {
            const blobSrc = URL.createObjectURL(blob)
            saveCache(src, blobSrc)
            resolve(blobSrc)
          },
          'image/png',
          1
        )
      } catch {
        saveCache(src)
        resolve(src)
      }
    }
  })
}
export default compress
