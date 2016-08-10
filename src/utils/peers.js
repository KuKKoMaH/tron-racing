import Peer from 'peerjs';

const key = '7o1bq8h0nuqv9529';

export default class Peers {
  constructor(){
    this.peer = new Peer({key});
    this._id = null;
    this._connect = null;
    this.onConnectCb = () => {};

    this.idPromise = new Promise((resolve, reject) => {
      this.peer.on('open', id => {
        this._id = id;
        resolve(id);
      });
    });

    this.peer.on('connection', conn => {
      if(!this._connect) {
        this._connect = conn;
        this.onConnectCb(conn);
      }
    });
  }

  onConnect(cb){
    this.onConnectCb = cb;
  }

  getId(){ return this.idPromise; }

  connect(id){
    const conn = this.peer.connect(id);
    return new Promise((resolve, reject) => {
      conn.on('open', function(){
        this._connect = conn;
        resolve(conn);
      });
    })
  }
}

//
// const conn = peer.connect('another-peers-id');
// conn.on('open', function(){
//   conn.send('hi!');
// });
//
// peer.on('connection', function(conn) {
//   conn.on('data', function(data){
//     // Will print 'hi!'
//     console.log(data);
//   });
// });