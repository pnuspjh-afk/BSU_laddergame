export interface Bar {
  lineIndex: number; // Starting line index (0 to playerCount-2)
  height: number;    // Height percentage (0 to 100)
}

export interface Point {
  x: number;
  y: number;
}

export const generateLadder = (playerCount: number, rows: number = 10): Bar[] => {
  const bars: Bar[] = [];
  // Each 'row' is a potential horizontal slot
  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < playerCount - 1; i++) {
      // 50% chance to create a bar if it doesn't conflict with left neighbor
      if (Math.random() > 0.5) {
        const hasLeftBar = bars.find(b => b.lineIndex === i - 1 && b.height === r);
        if (!hasLeftBar) {
          bars.push({ lineIndex: i, height: r });
        }
      }
    }
  }
  return bars;
};

export const calculatePath = (
  startIndex: number,
  bars: Bar[],
  playerCount: number,
  rows: number
): Point[] => {
  const path: Point[] = [];
  let currentLine = startIndex;
  
  // Start point
  path.push({ x: currentLine, y: -0.5 });

  for (let r = 0; r < rows; r++) {
    // Current vertical segment start
    path.push({ x: currentLine, y: r });
    
    // Check for horizontal move
    const barRight = bars.find(b => b.lineIndex === currentLine && b.height === r);
    const barLeft = bars.find(b => b.lineIndex === currentLine - 1 && b.height === r);
    
    if (barRight) {
      currentLine++;
      path.push({ x: currentLine, y: r });
    } else if (barLeft) {
      currentLine--;
      path.push({ x: currentLine, y: r });
    }
  }
  
  // End point
  path.push({ x: currentLine, y: rows });
  path.push({ x: currentLine, y: rows + 0.5 });
  
  return path;
};
