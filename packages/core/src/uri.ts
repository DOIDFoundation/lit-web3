import safeDecodeURIComponent from 'safe-decode-uri-component'
export { safeDecodeURIComponent }

// Just encode reserved characters
export const safeEncodeURIComponent = (s: string) => s.replaceAll(/[;/?:@&=+$,#]/g, (r) => encodeURIComponent(r))
