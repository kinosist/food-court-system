// pages/admin.js
import { useContext, useState } from 'react';
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

const AdminScreen = () => {
  const { waitingNumbers, receivedNumbers, issueNumber, moveToReceived, addNumber, error } = useContext(NumberContext);
  const [manualNumber, setManualNumber] = useState('');

  const [, drop] = useDrop({
    accept: ItemTypes.NUMBER,
    drop: (item) => {
      moveToReceived(item.number);
    },
  });

  const handleIssue = () => {
    issueNumber();
  };

  const handleAdd = () => {
    const number = parseInt(manualNumber, 10);
    if (isNaN(number) || number <= 0) {
      alert('有効な番号を入力してください');
      return;
    }
    addNumber(number);
    setManualNumber('');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>管理インターフェース</h1>
        <div className="admin-controls">
          <button onClick={handleIssue} className="btn issue-btn">
            番号を発行
          </button>
          <input
            type="number"
            placeholder="番号を入力"
            value={manualNumber}
            onChange={(e) => setManualNumber(e.target.value)}
            className="number-input"
          />
          <button onClick={handleAdd} className="btn add-btn">
            追加
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="admin-numbers">
        {/* 待機中の番号 */}
        <div className="waiting-numbers">
          <h2>待っている番号</h2>
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
          <h2>食事が受け取れる番号</h2>
          <div className="numbers-grid">
            {receivedNumbers.map((number) => (
              <NumberCard key={number} number={number} status="received" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Admin() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AdminScreen />
    </DndProvider>
  );
}
