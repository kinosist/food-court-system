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
    // 環境変数が設定されていればそれを使用し、なければ相対パスで接続
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || '';
    socket = io(socketUrl);

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

  const moveToWaiting = (number) => {
    socket.emit('moveToWaiting', number);
  };

  const addNumber = (number) => {
    socket.emit('addNumber', number);
  };

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
        moveToWaiting,
        addNumber,
        deleteNumber,
        error,
      }}
    >
      {children}
    </NumberContext.Provider>
  );
};
