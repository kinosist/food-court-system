// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server, {
    cors: {
      origin: "*", // セキュリティ上、本番環境では適切なオリジンを指定してください
      methods: ["GET", "POST"]
    }
  });

  let waitingNumbers = [];
  let receivedNumbers = [];

  io.on('connection', (socket) => {
    console.log('新しいクライアントが接続しました');

    // 現在の状態を送信
    socket.emit('update', { waitingNumbers, receivedNumbers });

    socket.on('issueNumber', () => {
      const newNumber = waitingNumbers.length + 1;
      waitingNumbers.push(newNumber);
      io.emit('update', { waitingNumbers, receivedNumbers });
    });

    socket.on('addNumber', (number) => {
      if (typeof number !== 'number' || number <= 0) {
        socket.emit('error', '有効な番号を入力してください');
        return;
      }
      if (waitingNumbers.includes(number) || receivedNumbers.includes(number)) {
        socket.emit('error', `番号 ${number} は既に存在します`);
        return;
      }
      waitingNumbers.push(number);
      io.emit('update', { waitingNumbers, receivedNumbers });
    });

    // 新しく追加: deleteNumber イベントのハンドリング
    socket.on('deleteNumber', (number) => {
      let deleted = false;

      if (waitingNumbers.includes(number)) {
        waitingNumbers = waitingNumbers.filter((n) => n !== number);
        deleted = true;
      } else if (receivedNumbers.includes(number)) {
        receivedNumbers = receivedNumbers.filter((n) => n !== number);
        deleted = true;
      }

      if (deleted) {
        io.emit('update', { waitingNumbers, receivedNumbers });
      } else {
        socket.emit('error', `番号 ${number} は存在しません`);
      }
    });

    socket.on('moveToReceived', (number) => {
      if (waitingNumbers.includes(number)) {
        waitingNumbers = waitingNumbers.filter((n) => n !== number);
        receivedNumbers.push(number);
        io.emit('update', { waitingNumbers, receivedNumbers });
      } else {
        socket.emit('error', `番号 ${number} は待機中のリストに存在しません`);
      }
    });

    socket.on('disconnect', () => {
      console.log('クライアントが切断されました');
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
