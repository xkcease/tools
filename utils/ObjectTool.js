/**
 * 简易对象工具
 */
const ObjectTool = {
  _path (path) {
    switch (typeof path) {
      case 'number':
        return [String(path)];
      case 'string':
        return path.split('.');
      default:
        return [];
    }
  },

  isObject (source) {
    return Object.prototype.toString.call(source) === '[object Object]';
  },

  isArray (source) {
    return Object.prototype.toString.call(source) === '[object Array]';
  },

  isObjectOrArray (source) {
    return ObjectTool.isObject(source) || ObjectTool.isArray(source);
  },

  /**
   * 深度获取值
   * @param {Object} source
   * @param {string} path 键路径; '.'分割;
   * @returns {Any}
   */
   get (source, path) {
    if (!ObjectTool.isObject(source)) {
      return undefined;
    }

    const keys = ObjectTool._path(path);
    if (!keys.length) {
      return undefined;
    }

    let value = source;
    while (keys.length > 1) {
      value = value[keys.shift()];
      if (!value || !ObjectTool.isObjectOrArray(value)) {
        return undefined;
      }
    }

    return value[keys.shift()];
  },

  /**
   * 深度设置
   * @param {Object} source
   * @param {string} path 键路径; '.'分割;
   * @param {Any} value
   * @returns {Boolean}
   */
   set (source, path, value) {
    if (!ObjectTool.isObject(source)) {
      return false;
    }

    const keys = ObjectTool._path(path);
    if (!keys.length) {
      return false;
    }

    let target = source;
    while (keys.length > 1) {
      const key = keys.shift();

      if (target[key] === undefined) {
        target[key] = {};
      }
      else if (!ObjectTool.isObjectOrArray(target[key])) {
        return false;
      }

      target = target[key];
    }

    target[keys.shift()] = value;

    return true;
  },

  /**
   * 深度数组添加元素
   * @param {Object} source
   * @param {string} path
   * @param {Any} value
   * @returns {Boolean}
   */
   setToPush (source, path, value) {
    if (!ObjectTool.isObject(source)) {
      return false;
    }

    let target = ObjectTool.get(source, path);

    if (!target || !ObjectTool.isArray(target)) {
      target = [];
      ObjectTool.set(source, path, target);
    }

    target.push(value);

    return true;
  }
};

export default ObjectTool;
