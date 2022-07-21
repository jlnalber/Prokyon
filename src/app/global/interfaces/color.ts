export interface Color {
  r: number,
  g: number,
  b: number,
  a?: number
}

export function getColorAsRgbFunction(color: Color): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function getColorAsRgbaFunction(color: Color): string {
  if (color.a) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
  return `rgba(${color.r}, ${color.g}, ${color.b})`;
}

