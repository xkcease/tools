import ObjectMap from './ObjectMap';

/**
 * 简易映射对象表数组
 */
class ObjectMapArray {
  constructor (list = []) {
    this.list = list;
  }

  /**
   *
   * @param {number} index
   * @returns {ObjectMap}
   */
  get (index) {
    return this.list[index];
  }

  /**
   * 获取原对象
   * @param {number} index
   * @returns {Object}
   */
  getSource (index) {
    return this.list[index]?.getSource();
  }

  /**
   * 获取对象映射表并设置
   * @param {number} index
   * @param {string} path
   * @param {Any} value
   * @returns {ObjectMap}
   */
  getAndSet (index, path, value) {
    const objectMap = this.get(index);
    if (objectMap) {
      objectMap.set(path, value);
    }
    return objectMap;
  }

  /**
   * 获取对象映射表并数组添加元素
   * @param {number} index
   * @param {string} path
   * @param {Any} value
   * @returns {ObjectMap}
   */
   getAndSetToPush (index, path, value) {
    const objectMap = this.get(index);
    if (objectMap) {
      objectMap.setToPush(path, value);
    }
    return objectMap;
  }

  /**
   *
   * @param {number} index
   * @param {Object} value
   * @returns
   */
  set (index, value) {
    this.list[index] = new ObjectMap(value);
    return this;
  }

  /**
   *
   * @param  {...Object} value
   */
  push (...value) {
    this.list.push(...value.map(v => new ObjectMap(v)));
    return this;
  }

  /**
   *
   * @returns {ObjectMap}
   */
  pop () {
    return this.list.pop();
  }

  /**
   *
   * @returns {Object}
   */
  popSource () {
    return this.pop()?.getSource();
  }

  map (callback) {
    return this.list.map(callback);
  }

  /**
   *
   * @param  {number} start
   * @param  {number} end
   * @returns {ObjectMap[]}
   */
  slice (...arg) {
    return this.list.slice(...arg);
  }

  /**
   *
   * @param  {number} start
   * @param  {number} end
   * @returns {Object[]}
   */
  sliceSource (...arg) {
    return this.slice(...arg)?.map(v => v.getSource());
  }

  /**
   *
   * @param {number} start
   * @param {number} count
   * @param  {...Object} values
   * @returns
   */
  splice (start, count, ...values) {
    return this.list.splice(start, count, ...values.map(v => new ObjectMap(v)));
  }

  /**
   *
   * @returns {Number[]}
   */
  keys () {
    return this.list.map((v, i) => i);
  }

  /**
   *
   * @returns {ObjectMap[]}
   */
  values () {
    return this.list.map(v => v);
  }

  /**
   *
   * @returns {Object[]}
   */
  valuesSource () {
    return this.list.map(v => v.getSource());
  }

  /**
   *
   * @returns {[ [number, ObjectMap] ]}
   */
  entries () {
    return this.list.map((v, i) => [i, v]);
  }

  /**
   *
   * @returns {[ [number, Object] ]}
   */
  entriesSource () {
    return this.list.map((v, i) => [i, v.getSource()]);
  }

  [Symbol.iterator] () {
    return this.list[Symbol.iterator].call(this.list);
  }
}

export default ObjectMapArray;
