import deepFill from './deepFill';

/**
 * 深度去首尾空格
 * @param {Object|Array|String} source // 来源对象;
 * @param {Object} option
 * @param {Array} option.include       // 需赋值的属性; 优先于exclude; 元素: path;
 * @param {Array} option.exclude       // 需赋值的属性; 元素: path;
 * @returns {Object|Array|String}
 */
function deepTrim (source, { include, exclude } = {}) {
  return deepFill(
    source,
    null,
    (value) => typeof value === 'string' ? value.trim() : value,
    { include, exclude },
  );
}

export default deepTrim;
