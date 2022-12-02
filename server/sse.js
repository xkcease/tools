import EventEmitter from 'events';

/**
 * SSE 消息发送器
 */
export class SSEEmitter extends EventEmitter {
  /**
   * @param {string[]} events 事件
   * @param {string} [route] 路由
   */
  constructor (route = 'common', events = []) {
    super();

    this.route = route;
    this.eventModules = events.map(v => ({ id: 0, event: v }));
    this.init = this.init.bind(this);
  }

  /**
   * SSE 路由初始化句柄
   * @param {*} req request
   * @param {*} res response
   *
   * @example
   * router.get ('/sse', sseEmitter.init);
   */
  init (req, res) {
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');

    for (const eventModule of this.eventModules) {
      this.on(eventModule.event, ({ id, event = 'sse', data = {}, retry }) => {
        res.write(
          `id: ${id || ++eventModule.id}\n` +
          `event: ${String(event)}\n` +
          `${retry ? `retry: ${retry}\n` : ''}` +
          `data: ${JSON.stringify(data)}\n\n`
        );
      });
    }
  }

  /**
   * @typedef SSEMessage SSE 消息
   * @property {number} [params.id] 事件 ID
   * @property {string} params.event 事件
   * @property {any} params.data 数据
   * @property {number} [params.retry] 重连
   */
  /**
   * 单事件消息发送
   * @param {string} emitterEvent Emitter 事件
   * @param {SSEMessage} params SSE 消息体
   * @returns {SSEEmitter}
   *
   */
  send (emitterEvent, { id, event, data, retry }) {
    this.emit(emitterEvent, { id, event, data, retry });
    return this;
  }

  /**
   * 全事件消息发送
   * @param {SSEMessage} params SSE 消息体
   * @returns {SSEEmitter}
   */
  sendAll ({ id, event, data, retry }) {
    for (const emitterEvent of this.eventModules) {
      this.send(emitterEvent, { id, event, data, retry });
    }
    return this;
  }
}

/**
 * SSE 模块
 */
export class SSEModule {
  /**
   * @param {string} namespace 命名空间
   * @param {[{
   *   route: string,
   *   events: string[],
   * }]} routers 路由模块
   */
  constructor (namespace = 'sse', routers = []) {
    this.namespace = namespace;
    this.emitterMap = new Map(routers.map(v => [v.route, new SSEEmitter(v.route, v.events)]));
  }

  /**
   * 路由模块设置
   * @param {string} route 路由
   * @param {string[]} events 事件
   * @returns {SSEEmitter}
   */
  set (route, events) {
    const eittmer = new SSEEmitter(route, events);
    this.emitterMap.set(route, eittmer);
    return eittmer;
  }

  /**
   * 获取 SSE 消息发送器
   * @param {string} route 路由
   * @returns {SSEEmitter}
   */
  get (route) {
    return this.emitterMap.get(route);
  }

  /**
   * 路由模块校验
   * @param {string} route 路由
   * @returns {boolean}
   */
  has (route) {
    return this.emitterMap.has(route);
  }

  /**
   * 路由模块移除
   * @param {string} route  路由
   * @returns {SSEEmitter}
   */
  remove (route) {
    const emitter = this.get(route);
    this.emitterMap.delete(route);
    return emitter;
  }

  /**
   * 获取 SSE 路由初始化句柄
   * @description route 不存在时, 按 events 新建路由模块
   * @param {string} route 路由
   * @param {string[]} [emitterEvents] Emitter 事件
   * @returns {Function} SSEEmitter#init
   */
  getEmitterInit (route, emitterEvents) {
    if(this.has(route)) {
      return this.get(route).init;
    }
    return this.set(route, emitterEvents).init;
  }

  /**
   * 单路由单事件消息发送
   * @param {string} route 路由
   * @param {string} emitterEvent Emitter 事件
   * @param {SSEMessage} params SSE 消息体
   * @returns {SSEModule}
   */
  send (route, emitterEvent, { id, event, data, retry }) {
    if (this.has(route)) {
      this.get(route).send(emitterEvent, { id, event, data, retry });
    }
    return this;
  }
}

/**
 * SSE 工具
 */
export class SSE {
  constructor () {
    this.sseModuleMap = new Map();
  }

  /**
   * 获取 SSE 模块
   * @param {string} namespace 命名空间
   * @returns {SSEModule}
   */
  get (namespace) {
    if (this.sseModuleMap.has(namespace)) {
      return this.sseModuleMap.get(namespace);
    }

    const sseModule = new SSEModule(namespace);
    this.sseModuleMap.set(namespace, sseModule);
    return sseModule;
  }
}

export default new SSE();
