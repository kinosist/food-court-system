// pages/display.js
import React, { useContext } from 'react';
import { NumberContext } from '../context/NumberContext';
import NumberCard from '../components/NumberCard';
import { useDrop } from 'react-dnd';

const ItemTypes = {
  NUMBER: 'number',
};

const DisplayScreen = () => {
  const { waitingNumbers, receivedNumbers, moveToReceived } = useContext(NumberContext);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.NUMBER,
    drop: (item) => {
      moveToReceived(item.number);
    },
    canDrop: () => false, // ドロップ自体は許可しない場合
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div className="display-container">
      {/* 待ち番号 */}
      <div className="waiting-numbers">
        <h2>待ち番号</h2>
        <div className="numbers-grid">
          {waitingNumbers.map((number) => (
            <NumberCard
              key={number}
              number={number}
              status="waiting"
              showDelete={false} // 削除ボタンを非表示
              draggable={false}  // ドラッグを無効化
            />
          ))}
        </div>
      </div>

      {/* 受け取り可能！ */}
      <div
        ref={drop}
        className={`received-numbers ${isOver && canDrop ? 'highlight' : ''}`}
        style={{ pointerEvents: 'none' }} // ユーザーからの操作を無効化
      >
        <h2>受け取り可能！</h2>
        <div className="numbers-grid">
          {receivedNumbers.map((number) => (
            <NumberCard
              key={number}
              number={number}
              status="received"
              showDelete={false} // 削除ボタンを非表示
              draggable={false}  // ドラッグを無効化
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Display() {
  return <DisplayScreen />;
}
