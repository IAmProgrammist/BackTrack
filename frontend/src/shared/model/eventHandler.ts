type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export class EventListener<CustomEventMap> {
  events: PartialRecord<keyof CustomEventMap, ((event: CustomEventMap[keyof CustomEventMap]) => void)[]>

  constructor() {
    this.events = {};
  }

  protected eventHandler<K extends keyof CustomEventMap>(event: K, args: CustomEventMap[K]) {
    const events = this.events[event] || []
    for (const registeredEvent of events) {
      registeredEvent(args)
    }
  }

  addEventListener<K extends keyof CustomEventMap>(event: K, listener: (event: CustomEventMap[K]) => void) {
    this.events = { ...this.events, [event]: [...(this.events?.[event] || []), listener] }
  }
  removeEventListener<K extends keyof CustomEventMap>(event: K, listener: (event: CustomEventMap[K]) => void) {
    this.events = {
      ...this.events,
      [event]: this.events?.[event]?.filter((listenerInner) => listenerInner !== listener) || [],
    }
  }
}
