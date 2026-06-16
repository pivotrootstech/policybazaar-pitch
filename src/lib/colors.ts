export const C = {
  pb:       '#0B6EFF',
  pbBright: '#1483FF',
  cyan:     '#2DD4E8',
  amber:    '#F4A62A',
  violet:   '#7C5CFF',
  green:    '#28C38A',
  red:      '#F04444',
  pink:     '#E6539A',
  ink:      '#162238',
  muted:    '#7B8798',
  line:     '#E7ECF3',
} as const;

export type ColorKey = keyof typeof C;
