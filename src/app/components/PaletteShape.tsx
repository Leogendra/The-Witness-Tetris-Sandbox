import { useState } from 'react';
import { TetrisShape, TetrominoType } from './TetrisShape';

interface PaletteShapeProps {
  type: TetrominoType;
  color: string;
  initialPattern: number[][];
}

export const PaletteShape: React.FC<PaletteShapeProps> = ({ type, color, initialPattern }) => {
  const [pattern, setPattern] = useState(initialPattern);

  const rotatePattern = (pattern: number[][]): number[][] => {
    const rows = pattern.length;
    const cols = pattern[0].length;
    const rotated: number[][] = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = pattern[i][j];
      }
    }
    
    return rotated;
  };

  const handleRotate = () => {
    setPattern(prev => rotatePattern(prev));
  };

  return (
    <TetrisShape
      type={type}
      color={color}
      pattern={pattern}
      onRotate={handleRotate}
    />
  );
};
