/**
 * 空值校验
 * @description 判断表单组件常见绑定值是否为空值
 *
 * @param {Array|Object|String|Boolean} value
 * @returns {Boolean} 返回 true 的值: [ 空对象, 空数组, 空字符串 null, undefined, true ]
 */
export function isFormItemEmpty (value) {
  if (Array.isArray(value)) {
    return !value.length;
  }
  else if (Object.prototype.toString.call(value) === '[object Object]') {
    return !Object.keys(value).length;
  }
  else if ([null, undefined, '', true].includes(value)) {
    return true;
  }

  return false;
}
