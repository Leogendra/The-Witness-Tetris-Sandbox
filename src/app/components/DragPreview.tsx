import React from 'react';
import { createPortal } from 'react-dom';
import { useDragLayer } from 'react-dnd';
import GridContext from './GridContext';
import { TetrisShape } from './TetrisShape';

export const DragPreview: React.FC = () => {
  const { info } = React.useContext(GridContext);
  const { itemType, isDragging, item, clientOffset, initialClientOffset, sourceClientOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
    sourceClientOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !clientOffset || itemType !== 'tetromino' || !info.rect) return null;

  const { rect, cellSize } = info;

  const pointerOffset = (initialClientOffset && sourceClientOffset)
    ? { x: initialClientOffset.x - sourceClientOffset.x, y: initialClientOffset.y - sourceClientOffset.y }
    : { x: 0, y: 0 };

  // Determine which block within the piece the pointer is over (block index)
  const patternCols = item?.pattern?.[0]?.length ?? 1;
  const patternRows = item?.pattern?.length ?? 1;
  let blockIndexX = Math.floor(pointerOffset.x / cellSize);
  let blockIndexY = Math.floor(pointerOffset.y / cellSize);
  // clamp block indices so dragging from edges anchors correctly
  if (blockIndexX < 0) blockIndexX = 0;
  if (blockIndexY < 0) blockIndexY = 0;
  if (blockIndexX >= patternCols) blockIndexX = patternCols - 1;
  if (blockIndexY >= patternRows) blockIndexY = patternRows - 1;

  // Compute the cell the pointer is currently over (floating)
  const pointerCellX = (clientOffset.x - rect.left) / cellSize;
  const pointerCellY = (clientOffset.y - rect.top) / cellSize;

  // Snap so that the block under the pointer maps to the pointer's cell
  let col = Math.round(pointerCellX) - blockIndexX;
  let row = Math.round(pointerCellY) - blockIndexY;

  // Clamp to grid bounds
  const gridCols = Math.floor(rect.width / cellSize);
  const gridRows = Math.floor(rect.height / cellSize);
  const maxCol = Math.max(0, gridCols - patternCols);
  const maxRow = Math.max(0, gridRows - patternRows);
  col = Math.min(Math.max(0, col), maxCol);
  row = Math.min(Math.max(0, row), maxRow);

  const left = rect.left + col * cellSize;
  const top = rect.top + row * cellSize;

  const preview = (
    <div style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <div style={{ position: 'absolute', transform: `translate(${left}px, ${top}px)`, width: 'auto', height: 'auto' }}>
        <TetrisShape type={item.type} color={item.color} pattern={item.pattern} style={{ ['--cell-size' as any]: `${cellSize}px`, opacity: 0.9 }} />
      </div>
    </div>
  );

  return createPortal(preview, document.body);
};

export default DragPreview;
