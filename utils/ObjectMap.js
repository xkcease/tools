import ObjectTool from './ObjectTool';

/**
 * 简易对象映射表
 */
class ObjectMap extends Object {
  constructor (source = {}) {
    super();
    this.source = source;
  }

  /**
   * 深度获取值
   * @param {string} path 键路径; '.'分割;
   * @returns {Any}
   */
  get (path) {
    return ObjectTool.get(this.source, path);
  }

  /**
   * 获取原对象
   * @returns {Object}
   */
  getSource () {
    return this.source;
  }

  /**
   * 深度设置
   * @param {string} path 键路径; '.'分割;
   * @param {Any} value
   * @returns {ObjectMap}
   */
  set (path, value) {
    ObjectTool.set(this.source, path, value);
    return this;
  }

  /**
   * 深度数组添加元素
   * @param {string} path 键路径; '.'分割;
   * @param {Any} value
   * @returns {ObjectMap}
   */
  setToPush (path, value) {
    ObjectTool.setToPush(this.source, path, value);
    return this;
  }

  keys () {
    return Object.keys(this.source);
  }

  values () {
    return Object.values(this.source);
  }
}

export default ObjectMap;
