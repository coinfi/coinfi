type Coordinates = [number, number, number]

/***
 * Uses rgb values from 0-1
 * Returns hsv values from 0-360, 0-1, 0-1
 */
export function rgbToHsv(r: number, g: number, b: number): Coordinates {
  if (r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1) {
    throw new Error('Inputs must be between 0-1')
  }

  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  const width = max - min

  let h
  if (max === min) {
    h = 0
  } else if (max === r) {
    h = 60 * (0 + (g - b) / width)
  } else if (max === g) {
    h = 60 * (2 + (b - r) / width)
  } else {
    h = 60 * (4 + (r - g) / width)
  }
  while (h < 0) {
    h += 360
  }

  const s = max === 0 ? 0 : width / max
  const v = max

  return [h, s, v]
}

function componentToHex(c: number) {
  const hex = Math.round(c).toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

/***
 * Uses rgb values from 0-255
 * Returns full-length hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

/***
 * Uses hsv values from 0-360, 0-1, 0-1
 * Returns rgb values from 0-1
 */
export function hsvToRgb(h: number, s: number, v: number): Coordinates {
  const c = v * s
  const hPrime = h / 60
  const x = c * (1 - Math.abs((hPrime % 2) - 1))
  const m = v - c

  let r1
  let g1
  let b1
  if (0 <= hPrime && hPrime <= 1) {
    r1 = c
    g1 = x
    b1 = 0
  } else if (1 < hPrime && hPrime <= 2) {
    r1 = x
    g1 = c
    b1 = 0
  } else if (2 < hPrime && hPrime <= 3) {
    r1 = 0
    g1 = c
    b1 = x
  } else if (3 < hPrime && hPrime <= 4) {
    r1 = 0
    g1 = x
    b1 = c
  } else if (4 < hPrime && hPrime <= 5) {
    r1 = x
    g1 = 0
    b1 = c
  } else if (5 < hPrime && hPrime <= 6) {
    r1 = c
    g1 = 0
    b1 = x
  } else {
    r1 = 0
    g1 = 0
    b1 = 0
  }

  return [r1 + m, g1 + m, b1 + m]
}

/***
 * Uses hsv values from 0-360, 0-1, 0-1
 * Returns full-length hex string
 */
export function hsvToHex(h: number, s: number, v: number): string {
  const rgb = hsvToRgb(h, s, v).map((value) => value * 255) as Coordinates
  return rgbToHex(...rgb)
}

export function interpolate<T>(
  [x1, y1, z1]: Coordinates,
  [x2, y2, z2]: Coordinates,
  steps = 1,
  fn?: (x: number, y: number, z: number) => T,
): Array<Coordinates | T> {
  if (steps <= 0) {
    if (!!fn) {
      return [fn(x1, y1, z1)]
    } else {
      return [[x1, y1, z1]]
    }
  }

  const xD = (x2 - x1) / steps
  const yD = (y2 - y1) / steps
  const zD = (z2 - z1) / steps

  return Array(steps + 1)
    .fill([x1, y1, z1])
    .map(([x, y, z], i) => {
      const values: Coordinates = [x + xD * i, y + yD * i, z + zD * i]

      if (!!fn) {
        return fn(...values)
      } else {
        return values
      }
    })
}
