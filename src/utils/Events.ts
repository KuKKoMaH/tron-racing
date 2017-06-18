type EventCallback = ( event: string, options: any ) => void;

interface EventsListeners {
  [eventName: string]: Array<EventCallback>
}

abstract class Events {
  private events: EventsListeners;

  constructor() {
    this.events = {
      all: [],
    };
  }

  public emit( event: string, options?: any ): void {
    if (Array.isArray(this.events[event])) {
      this.events[event].forEach(cb => cb.call(this, event, options));
    }
    if (event !== 'all') this.events.all.forEach(cb => cb.call(this, event, options));
  }

  public on( event = 'all', cb: EventCallback ): void {
    if (!Array.isArray(this.events[event])) this.events[event] = [];
    this.events[event].push(cb);
  }

  public off( event: string ): void {
    this.events[event] = [];
  }
}

export default Events;
