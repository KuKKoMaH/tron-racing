import Peer from 'peerjs';
import Events from './Events';

export default class Peers extends Events{
  constructor(){
    super();
    this.peer = new Peer({
      host: location.hostname,
      port: location.port,
      path: '/peers',
      debug: 3
    });
    this._id = null;
    this._connect = null;

    this.onDisconnect = this.onDisconnect.bind(this);

    this.idPromise = new Promise((resolve, reject) => {
      this.peer.on('open', id => {
        this._id = id;
        this.peer.listAllPeers(list => console.log(list));
        resolve(id);
      });
    });


    this.peer.on('connection', conn => {
      if(!this._connect) {
        this._connect = conn;
        this._connect.on('close', this.onDisconnect);
        this.emit('connect', [this._connect]);
      }
    });

    this.peer.on('error', err => {
      console.log(err.type);
      console.log(err);
    })
  }

  getId(){ return this.idPromise; }

  connect(id){
    const conn = this.peer.connect(id);
    return new Promise((resolve, reject) => {
      conn.on('open', () => {
        this._connect = conn;
        resolve(conn);
      });
      conn.on('close', this.onDisconnect);
    });
  }

  onDisconnect(){
    this._connect = null;
    this.emit('disconnect');
  }

  disconnect(){
    if(this._connect){
      this._connect.close();
    }
  }
}