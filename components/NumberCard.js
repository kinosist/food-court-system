// components/NumberCard.js
import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  NUMBER: 'number',
};

const NumberCard = ({ number, status, onDelete, showDelete = false, draggable = true }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NUMBER,
    item: { number },
    canDrag: draggable,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [draggable, number]);

  return (
    <div
      ref={draggable ? drag : null}
      className={`number-card ${status}`}
      style={{
        opacity: isDragging ? 0.7 : 1,
        cursor: draggable ? 'move' : 'default',
      }}
    >
      {/* 数字のみを表示 */}
      <span>{number}</span>
      
      {/* 削除ボタンは showDelete が true の場合のみ表示 */}
      {showDelete && (
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation(); // ドラッグ操作を防ぐ
            onDelete(number);
          }}
        >
          削除
        </button>
      )}
    </div>
  );
};

export default NumberCard;
