// pages/admin.js
import React, { useContext, useState } from 'react';
import { NumberContext } from '../context/NumberContext';
import NumberCard from '../components/NumberCard';
import { useDrop } from 'react-dnd';

const ItemTypes = {
  NUMBER: 'number',
};

const AdminScreen = () => {
  const {
    waitingNumbers,
    receivedNumbers,
    issueNumber,
    moveToReceived,
    moveToWaiting,
    addNumber,
    deleteNumber,
    error,
  } = useContext(NumberContext);
  const [manualNumber, setManualNumber] = useState('');

  // 「受け取り可能！」エリアへのドロップ設定
  const [{ isOverReceived, canDropReceived }, dropReceived] = useDrop({
    accept: ItemTypes.NUMBER,
    drop: (item) => {
      moveToReceived(item.number);
    },
    collect: (monitor) => ({
      isOverReceived: !!monitor.isOver(),
      canDropReceived: !!monitor.canDrop(),
    }),
  });

  // 「待ち番号」エリアへのドロップ設定
  const [{ isOverWaiting, canDropWaiting }, dropWaiting] = useDrop({
    accept: ItemTypes.NUMBER,
    drop: (item) => {
      moveToWaiting(item.number);
    },
    collect: (monitor) => ({
      isOverWaiting: !!monitor.isOver(),
      canDropWaiting: !!monitor.canDrop(),
    }),
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

  const handleDelete = (number) => {
    if (window.confirm(`番号 ${number} を削除してもよろしいですか？`)) {
      deleteNumber(number);
    }
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
        {/* 待ち番号 */}
        <div ref={dropWaiting} className={`waiting-numbers ${isOverWaiting && canDropWaiting ? 'highlight' : ''}`}>
          <h2>待ち番号</h2>
          <div className="numbers-grid">
            {waitingNumbers.map((number) => (
              <NumberCard
                key={number}
                number={number}
                status="waiting"
                onDelete={handleDelete}
                showDelete={true} // 削除ボタンを表示
              />
            ))}
          </div>
        </div>

        {/* 受け取り可能！ */}
        <div ref={dropReceived} className={`received-numbers ${isOverReceived && canDropReceived ? 'highlight' : ''}`}>
          <h2>受け取り可能！</h2>
          <div className="numbers-grid">
            {receivedNumbers.map((number) => (
              <NumberCard
                key={number}
                number={number}
                status="received"
                onDelete={handleDelete}
                showDelete={true} // 削除ボタンを表示
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Admin() {
  return <AdminScreen />;
}
