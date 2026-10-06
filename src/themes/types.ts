export type CreatureType =
  | 'phoenix'
  | 'dragon'
  | 'griffin'
  | 'qirin'
  | 'hippocampus'
  | 'garuda'
  | 'none'

export type WorldType =
  | 'star-sea'
  | 'storm'
  | 'celestial'
  | 'forest'
  | 'deep-sea'
  | 'sky'
  | 'universal'

export interface LetterTheme {
  id: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  atmosphere: {
    fog: number
    glow: number
    particleDensity: number
  }
  world: {
    type: WorldType
    creature: CreatureType
  }
  camera: {
    movement: string
    intensity: number
    speed: number
  }
}
