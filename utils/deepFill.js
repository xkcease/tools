/**
 * 深度填充
 * 只能对原结构进行填充，不可改变原结构;
 * @param {Object|Array|String|Number|Boolean} source
 * @param {Any} value
 * @param {Function} setter       // 赋值方法; 优先于 value; 参数:(value, key, path);
 * @param {Object} option
 * @param {Array} option.include  // 需赋值的属性; 优先于exclude; 元素: path;
 * @param {Array} option.exclude  // 需赋值的属性; 元素: path;
 * @returns {Object|Array|String|Number|Boolean}
 *
 * @example
 * const obj = { a: 404, b: [45, 9, 416, 11], c: { d: 16, f: 15 } };
 *
 * path: 属性路径;
 * 例: ['a', 'b.0', 'c'] 支持
 *
 * deepFill(obj, 0, null, { include: ['b', 'c.d'] });
 * => { a: 404, b: [0, 0, 0, 0], c: { d: 0, f: 15 } };
 *
 * deepFill(obj, null, (v) => v + 100, { exclude: ['b.2', 'c.d'] });
 * => { a: 504, b: [145, 109, 416, 111], c: { d: 16, f: 115 } };
 */
function deepFill (source, value, setter, { include, exclude, _key, _path = '', } = {}) {
  if (typeof source === 'object') {
    for (const key in source) {
      source[key] = deepFill(source[key], value, setter, {
        include,
        exclude,
        _key: key,
        _path: _path ? `${_path}.${key}` : key,
      });
    }
    return source;
  }
  else {
    if (include) {
      if (!include.find(v => _path.startsWith(v))){
        return source;
      }
    }
    else if (exclude) {
      if (exclude.find(v => _path.startsWith(v))) {
        return source;
      }
    }

    return setter ? setter(source, _key, _path) : value;
  }
}

export default deepFill;
