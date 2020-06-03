export interface WordPosition {
  x: number
  y: number
  height: number
  width: number
}

export interface WordState {
  id: number
  text: string
  position: WordPosition
}
