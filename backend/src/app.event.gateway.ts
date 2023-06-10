import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

// 실제로 소켓의 동작을 담당하는 부분
@WebSocketGateway({
  namespace: 'chat', // 네임스페이스 지정
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class ChatEventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() nameSpace: Namespace;
  // 현재 네임스페이스를 지정했기 때문에 @WebSocketServer 데코레이터가 반환하는 값은
  // 서버 인스턴스가 아닌 네임스페이스 인스턴스이다.
  // 만약 네임스페이스를 설정하지 않았다면 @WebSocketServer 데코레이터가 반환하는 값은
  // 서버 인스턴스가 되고, 그 때는 타입을 다음과 같이 서버 타입으로 설정해야 한다.
  // @WebSocketServer() server: Socket;

  // 초기화 이후 실행
  afterInit() {
    // create-room, join-room 등의 이벤트 이름은 이미 내장된 이벤트명이다.
    this.nameSpace.adapter.on('create-room', (room) => {
      console.log(`Room: ${room} is created.`);
    });

    this.nameSpace.adapter.on('join-room', (room, id) => {
      console.log(`Socket: ${id} join Room: ${room}.`);
    });

    this.nameSpace.adapter.on('leave-room', (room, id) => {
      console.log(`Socket: ${id} leave Room: ${room}.`);
    });

    this.nameSpace.adapter.on('delete-room', (room) => {
      console.log(`Room: ${room} is deleted.`);
    });
  }

  // 소켓이 연결되면 실행
  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} is connected!`);
  }

  // 소켓 연결이 끊기면 실행
  // 브라우저와 서버 간 웹 소켓 연결이 끊기면 각 소켓은 자신의 아이디를 갖는 room에서 나가게 된다.
  // room의 크기가 0이 되면 자동으로 room이 삭제된다.
  // 즉, 방의 인원이 0명이면 자동으로 방이 사라진다.
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`${socket.id} is disconnected!`);
  }

  @SubscribeMessage('sendMessage') // 이벤트 리스너를 설정한다. (socket.on)
  handleSendedMessage(@ConnectedSocket() socket: Socket, @MessageBody() message: string) {
    // @ConnectedSocket: 연결된 소켓 인스턴스를 반환
    // @MessageBody: 브라우저 측에서 보낸 데이터를 반환
    socket.broadcast.emit('sendMessage', { user: socket, message });
    // broadcast는 데이터를 보낸 socket을 제외한 모든 socket들에게 이벤트를 보낸다.
  }
}
