export interface Image {
  id: string
  alt_description: string
  width: number
  height: number
  urls: Url
}

export interface Url {
  raw: string
  full: string
  regular: string
  small: string
}
