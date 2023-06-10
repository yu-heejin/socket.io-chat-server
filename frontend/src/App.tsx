import React, { useEffect } from 'react';
import './App.css';
import { io } from 'socket.io-client';

function App() {
  const socket = io('http://localhost:4000/chat');
  // 웹소켓 연결 및 소켓 인스턴스 생성, chat은 네임스페이스
  // io의 첫번째 인수로는 연결할 서버의 주소를 적고, 
  // 두번째 인수에는 쿠키를 보낼 때 설정해야하는 credentials와 같은 옵션들을 설정한다.

  useEffect(() => {

  })

  return (
    <div className="App">
      <h3>랜덤 채팅방에 오신 것을 환영합니다 🗣</h3>
      <hr/>
      <p>이곳에서는 자유롭게 채팅을 즐기실 수 있습니다.</p>
    </div>
  );
}

export default App;
