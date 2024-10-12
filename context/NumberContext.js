// context/NumberContext.js
import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const NumberContext = createContext();

let socket;

export const NumberProvider = ({ children }) => {
  const [waitingNumbers, setWaitingNumbers] = useState([]);
  const [receivedNumbers, setReceivedNumbers] = useState([]);
  const [error, setError] = useState(null); // エラーメッセージを管理

  useEffect(() => {
    socket = io();

    socket.on('update', ({ waitingNumbers, receivedNumbers }) => {
      setWaitingNumbers(waitingNumbers);
      setReceivedNumbers(receivedNumbers);
    });

    socket.on('error', (message) => {
      setError(message);
      setTimeout(() => setError(null), 3000); // 3秒後にエラーメッセージを消去
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

  return (
    <NumberContext.Provider
      value={{
        waitingNumbers,
        receivedNumbers,
        issueNumber,
        moveToReceived,
        addNumber,
        error,
      }}
    >
      {children}
    </NumberContext.Provider>
  );
};
