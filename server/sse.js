import EventEmitter from 'events';

export class SSEEmitter extends EventEmitter {
  constructor (events) {
    super();

    this.events = events.map(v => ({ id: 0, event: v }));
    this.init = this.init.bind(this);
  }

  init (req, res) {
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');

    for (const e of this.events) {
      this.on(e.event, ({ id, event, data, retry }) => {
        res.write(
          `id: ${id || ++e.id}\n` +
          `event: ${String(event)}\n` +
          `${retry ? `retry: ${retry}\n` : ''}` +
          `data: ${JSON.stringify(data)}\n\n`
        );
      });
    }
  }

  send (e, { id, event, data, retry }) {
    this.emit(e, { id, event, data, retry });
  }

  sendAll ({ id, event, data, retry }) {
    for (const e of this.events) {
      this.send(e, { id, event, data, retry });
    }
  }
}

export class SSEModule {
  constructor (namespace, emitters = []) {
    this.namespace = namespace;
    this.emitter_map = new Map(emitters.map(v => [v.key, new SSEEmitter(v.events)]));
  }

  set (key, events) {
    const eittmer = new SSEEmitter(events);
    this.emitter_map.set(key, eittmer);
    return eittmer;
  }

  get (key) {
    return this.emitter_map.get(key);
  }

  has (key) {
    return this.emitter_map.has(key);
  }

  remove (key) {
    const emitter = this.get(key);
    this.emitter_map.delete(key);
    return emitter;
  }

  getEmitterInit (key, events) {
    if(this.has(key)) {
      return this.get(key).init;
    }
    return this.set(key, events).init;
  }

  send (key, e, { id, event, data, retry }) {
    if (this.has(key)) {
      this.get(key).send(e, { id, event, data, retry });
    }
  }
}

export class SSE {
  constructor () {
    this.sse_module_map = new Map();
  }

  get (namespace) {
    if (this.sse_module_map.has(namespace)) {
      return this.sse_module_map.get(namespace);
    }

    const sse_module = new SSEModule(namespace);
    this.sse_module_map.set(namespace, sse_module);
    return sse_module;
  }
}

export default new SSE();