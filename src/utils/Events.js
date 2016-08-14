export default class Events{
  constructor(){
    this.events = {};
  }

  emit(event, options){
    if(Array.isArray(this.events[event])){
      this.events[event].forEach(cb => cb.apply(this, options));
    }
  }

  on(event, cb){
    if(!Array.isArray(this.events[event])){
      this.events[event] = [];
    }
    this.events[event].push(cb);
  }

  off(event){
    this.events[event] = [];
  }
}