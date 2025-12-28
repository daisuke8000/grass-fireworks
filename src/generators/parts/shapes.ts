/**
 * Shape Calculation Functions
 * Generates position arrays for various particle patterns
 */

/**
 * Position offset for particle placement
 */
export interface Position {
  dx: number;
  dy: number;
}

/**
 * Calculates circular particle positions (default explosion pattern)
 */
export function getCirclePositions(count: number, radius: number): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    positions.push({
      dx: Math.round(Math.cos(angle) * radius),
      dy: Math.round(Math.sin(angle) * radius),
    });
  }
  return positions;
}

/**
 * Calculates heart-shaped particle positions (Sumida River style)
 * Based on parametric equation: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
 */
export function getHeartPositions(count: number, scale: number): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < count; i++) {
    const t = (2 * Math.PI * i) / count;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    positions.push({
      dx: Math.round(x * scale),
      dy: Math.round(y * scale),
    });
  }
  return positions;
}

/**
 * Calculates star-shaped particle positions (5-pointed star)
 */
export function getStarPositions(count: number, outerRadius: number, innerRadius: number): Position[] {
  const positions: Position[] = [];
  const points = 5;
  const totalPoints = points * 2;

  for (let i = 0; i < count; i++) {
    const pointIndex = i % totalPoints;
    const angle = (2 * Math.PI * pointIndex) / totalPoints - Math.PI / 2;
    const radius = pointIndex % 2 === 0 ? outerRadius : innerRadius;
    positions.push({
      dx: Math.round(Math.cos(angle) * radius),
      dy: Math.round(Math.sin(angle) * radius),
    });
  }
  return positions;
}
