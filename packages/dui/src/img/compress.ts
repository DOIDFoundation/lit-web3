export const comporess = async (src: string, { maxW = 400 } = {}): Promise<string> => {
  return new Promise((resolve) => {
    if (!src) return resolve('')
    const cachedBlob = sessionStorage.getItem(`blob.${src}`)
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
    const canvas$ = document.createElement('canvas')
    const ctx: any = canvas$.getContext('2d')
    const setUrl = () => {
      canvas$.toBlob(
        (blob: any) => {
          const blobSrc = URL.createObjectURL(blob)
          sessionStorage.setItem(`blob.${src}`, blobSrc)
          resolve(blobSrc)
        },
        'image/png',
        1
      )
    }
  })
}
export default comporess
