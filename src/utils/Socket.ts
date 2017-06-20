import io from 'socket.io-client'

export default class Socket {
  constructor() {
    const client = io();
  }
}
