/**
 * EventSource 监听器
 */
export class EventSourceListener {
  constructor (route) {
    this.route = route;
    this._handlerMap = new Map();
    this.eventSource = new EventSource(route);
  }

  /**
   * 监听
   * @param {string} event 事件
   * @param  {...Function} handlers 回调
   * @returns {EventSourceListener}
   */
  listen (event, ...handlers) {
    for (const handler of  handlers) {
      const responseHandler = this._eventReponse(handler);

      if (this._handlerMap.has(event)) {
        this._handlerMap.get(event).push({
          origin: handler,
          response: responseHandler,
        });
      }
      else {
        this._handlerMap.set(event, [{
          origin: handler,
          response: responseHandler,
        }]);
      }

      this.eventSource.addEventListener(event, responseHandler, false);
    }

    return this;
  }

  /**
   * 移除
   * @param {string} event 事件
   * @param  {...Function} [handlers] 回调; 不填则移除该事件;
   * @returns {EventSourceListener}
   */
  remove (event, ...handlers) {
    const originHandlers = this._handlerMap.get(event);

    if (!handlers.length) {
      handlers = originHandlers.map(v => v.origin) || [];
    }

    // 移除监听
    for (const handler of handlers) {
      this.eventSource.removeEventListener(event, handler.response, false);
    }

    // 移除备份
    const newHandlers = originHandlers.filter(originHandler => !handlers.includes(originHandler.origin));
    if (newHandlers.length) {
      this._handlerMap.set(event, newHandlers);
    }
    else {
      this._handlerMap.delete(event);
    }

    return this;
  }

  /**
   * 清空
   */
  clear () {
    for (const event of this._handlerMap.keys()) {
      this.remove(event);
    }
  }

  /**
   * 为空
   * @returns {boolean}
   */
  isClear () {
    return Boolean(!this._handlerMap.size);
  }

  /**
   * 关闭连接
   */
  close () {
    this.eventSource.close();
  }

  _eventReponse (handler) {
    return function responseHandler (event){
      const data = JSON.parse(event.data);
      return handler(data, event);
    };
  }
}

/**
 * EventSource 模块
 */
export class EventSourceModule {
  constructor (namespace = 'default') {
    this.namespace = namespace;
    this.listenerMap = new Map();
  }

  /**
   * 监听
   * @param {string} route 路由
   * @param {string} event 事件
   * @param  {...Function} handlers 回调
   * @returns {EventSourceModule}
   */
  listen (route, event, ...handlers) {
    let listener = this.listenerMap.get(route);
    if (!listener) {
      listener = new EventSourceListener(route);
      this.listenerMap.set(route, listener);
    }

    listener.listen(event, ...handlers);

    return this;
  }

  /**
   * 移除
   * @param {string} route 路由
   * @param {string} [event] 事件 不填则移除该路由;
   * @param  {...Function} [handlers] 回调; 不填则移除该事件;
   * @returns {EventSourceModule}
   */
  remove (route, event, ...handlers) {
    const listener = this.listenerMap.get(route);
    if (!listener) {
      return this;
    }

    if (event) {
      listener.remove(event, ...handlers);
    }
    else {
      listener.clear();
    }

    if (listener.isClear()) {
      listener.close();
      this.listenerMap.delete(route);
    }

    return this;
  }

  /**
   * 设置路由
   * @param {string} route
   * @returns {EventSourceModule}
   */
  set (route) {
    if (!this.has(route)) {
      this.listenerMap.set(route, new EventSourceListener(route));
    }

    return this;
  }

  /**
   * 获取监听器
   * @param {string} route
   * @returns {EventSourceListener}
   */
  get (route) {
    return this.listenerMap.get(route);
  }

  /**
   * 路由存在校验
   * @param {string} route
   * @returns {boolean}
   */
  has (route) {
    return this.listenerMap.has(route);
  }

  /**
   * 清空
   */
  clear () {
    for (const route of this.listenerMap.keys()) {
      this.remove(route);
    }

    return this;
  }
}

/**
 * EventSource 管理器
 */
export class EventSourceManager {
  constructor () {
    this.moduleMap = new Map();
  }

  /**
   * 获取 EventSource 模块
   * @description 若模块不存在则会创建该模块
   * @param {string} namespace 命名空间
   * @returns {EventSourceModule}
   */
  get (namespace) {
    if (this.has(namespace)) {
      return this.moduleMap.get(namespace);
    }

    const module = new EventSourceModule(namespace);
    this.moduleMap.set(namespace, module);
    return module;
  }

  /**
   * EventSource 模块存在校验
   * @param {string} namespace 命名空间
   * @returns {boolean}
   */
  has (namespace) {
    return this.moduleMap.has(namespace);
  }

  /**
   * 移除
   * @param {string} namespace 命名空间
   * @returns {EventSourceManager}
   */
  remove (namespace) {
    if (this.has(namespace)) {
      this.get(namespace).clear();
      this.moduleMap.delete(namespace);
    }

    return this;
  }
}

export default new EventSourceManager();
