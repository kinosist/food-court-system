// context/NumberContext.js
import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const NumberContext = createContext();

let socket;

export const NumberProvider = ({ children }) => {
  const [waitingNumbers, setWaitingNumbers] = useState([]);
  const [receivedNumbers, setReceivedNumbers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Socket.IOサーバーのURLに置き換えてください（例: 'http://localhost:3000'）
    socket = io('http://localhost:3000'); // デプロイ時は適切なURLに変更

    socket.on('update', ({ waitingNumbers, receivedNumbers }) => {
      setWaitingNumbers(waitingNumbers);
      setReceivedNumbers(receivedNumbers);
    });

    socket.on('error', (message) => {
      setError(message);
      setTimeout(() => setError(''), 3000); // エラーメッセージを3秒後にクリア
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const issueNumber = () => {
    socket.emit('issueNumber');
  };

  const moveToReceived = (number) => {
    socket.emit('moveToReceived', number);
  };

  const addNumber = (number) => {
    socket.emit('addNumber', number);
  };

  // 新しく追加: deleteNumber 関数
  const deleteNumber = (number) => {
    socket.emit('deleteNumber', number);
  };

  return (
    <NumberContext.Provider
      value={{
        waitingNumbers,
        receivedNumbers,
        issueNumber,
        moveToReceived,
        addNumber,
        deleteNumber, // 追加
        error,
      }}
    >
      {children}
    </NumberContext.Provider>
  );
};
