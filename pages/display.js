// pages/display.js
import { useContext } from 'react';
import { NumberContext } from '../context/NumberContext';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  NUMBER: 'number',
};

const NumberCard = ({ number, status }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NUMBER,
    item: { number },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`number-card ${status}`}
      style={{
        opacity: isDragging ? 0.7 : 1,
      }}
    >
      {/* アイコンを追加する場合は以下の行のコメントを外してください */}
      {/* <img src="/icons/number-icon.png" alt="番号アイコン" className="number-icon" /> */}
      番号 {number}
    </div>
  );
};

const DisplayScreen = () => {
  const { waitingNumbers, receivedNumbers, moveToReceived } = useContext(NumberContext);

  const [, drop] = useDrop({
    accept: ItemTypes.NUMBER,
    drop: (item) => {
      moveToReceived(item.number);
    },
  });

  return (
    <div className="display-container">
      {/* 待機中の番号 */}
      <div className="waiting-numbers">
        <h2>お待ちのお客様</h2>
        <div className="numbers-grid">
          {waitingNumbers.map((number) => (
            <NumberCard key={number} number={number} status="waiting" />
          ))}
        </div>
      </div>

      {/* 受け取る番号 */}
      <div
        ref={drop}
        className="received-numbers"
      >
        <h2>受取り可能！</h2>
        <div className="numbers-grid">
          {receivedNumbers.map((number) => (
            <NumberCard key={number} number={number} status="received" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Display() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DisplayScreen />
    </DndProvider>
  );
}
