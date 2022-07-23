/**
 * URL 处理器
 * @description
 * 应由 UrlParser 实例调用 getResolver() 生成
 */
 class UrlResolver {
  constructor ({
    urlSep, querySep, equalSep,
    originUrl, url, protocol, host, hostname, port, hash,
    pathname, paramSequence, params,
    queryname, querySequence, query,
  }) {
    Object.assign(this, {
      urlSep, querySep, equalSep,
      originUrl, url, protocol, host, hostname, port, hash,
      pathname, paramSequence, params,
      querySequence, queryname, query,
    });
  }

  /**
   * 查找在序列中的索引
   * @param {Array} sequence 序列
   * @param {string} search 搜索键名
   * @param {number} [order] 次序
   * @returns {number} 索引
   */
  _getIndexInSequenceBySearch (sequence, search, order = 0) {
    const indexs = [];
    let index = sequence.indexOf(search);

    while (index !== -1) {
      indexs.push(index);
      index = sequence.indexOf(search, index + 1);
    }

    return indexs[order] !== undefined ? indexs[order] : -1;
  }

  /**
   * 往后添加 param
   *
   * @param {string} param 参数;
   * @param {string} [search] 搜索键名; 往 search 后面添加 param;
   * @param {number} [order] 次序; 当 search 有多个时, 作为 search 结果的下标;
   * @returns {UrlResolver}
   */
  appendParam (param, search, order = 0) {
    // 入列
    if (search) {
      const index = this._getIndexInSequenceBySearch(this.paramSequence, search, order);
      if (index === -1) {
        return this;
      }

      this.paramSequence.splice(index + 1, 0, param);
    }
    else {
      this.paramSequence.push(param);
    }

    // 增数
    if (this.params[param]) {
      this.params[param]++;
    }
    else {
      this.params[param] = 1;
    }

    // 重组
    this.pathname = this.getPathname();
    this.url = this.getUrl();

    return this;
  }

  /**
   * 往前添加 param
   *
   * @param {string} param 参数;
   * @param {string} [search] 搜索键名; 往 search 前面添加 param;
   * @param {number} [order] 次序; 当 search 有多个时, 作为 search 结果的下标;
   * @returns {UrlResolver}
   */
  prependParam (param, search, order = 0) {
    // 入列
    if (search) {
      const index = this._getIndexInSequenceBySearch(this.paramSequence, search, order);
      if (index === -1) {
        return this;
      }

      this.paramSequence.splice(index, 0, param);
    }
    else {
      this.paramSequence.unshift(param);
    }

    // 增数
    if (this.params[param]) {
      this.params[param]++;
    }
    else {
      this.params[param] = 1;
    }

    // 重组
    this.pathname = this.getPathname();
    this.url = this.getUrl();

    return this;
  }

  /**
   * 移除 param
   *
   * @param {string} param 参数;
   * @param {number} [order] 次序; 当 param 有多个时, 作为查找结果的下标;
   * @returns {UrlResolver}
   */
  removeParam (param, order = 0) {
    const index = this._getIndexInSequenceBySearch(this.paramSequence, param, order);
    if (index === -1) {
      return this;
    }

    // 出列
    this.paramSequence.splice(index, 1);

    // 删除
    this.params[param]--;
    if (!this.params[param]) {
      Reflect.deleteProperty(this.params, param);
    }

    // 重组
    this.pathname = this.getPathname();
    this.url = this.getUrl();

    return this;
  }

  /**
   * 移除全部 param
   * @param {string} param
   * @returns {UrlResolver}
   */
  removeAllParam (param) {
    let index = this.paramSequence.indexOf(param);
    if (index === -1) {
      return this;
    }

    // 出列
    while (index !== -1) {
      this.paramSequence.splice(index, 1);
      index = this.paramSequence.indexOf(param);
    }

    // 删除
    Reflect.deleteProperty(this.params, param);

    // 重组
    this.pathname = this.getPathname();
    this.url = this.getUrl();

    return this;
  }

  /**
   * 往后添加 query
   *
   * @param {string} name 键名;
   * @param {string} value 键值;
   * @param {string} [search] 搜索键名; 往 search 后面添加 query;
   * @param {number} [order] 次序; 当 search 有多个时, 作为 search 结果的下标;
   * @returns {UrlResolver}
   */
  appendQuery (name, value, search, order = 0) {
    // 入列
    if (search) {
      const index = this._getIndexInSequenceBySearch(this.querySequence, search, order);
      if (index === -1) {
        return this;
      }

      this.querySequence.splice(index + 1, 0, name);
    }
    else {
      this.querySequence.push(name);
    }

    // 赋值
    if (this.query[name]) {
      this.query[name].splice(order + 1, 0, value);
    }
    else {
      this.query[name] = [value];
    }

    // 重组
    this.queryname = this.getQueryname();
    this.url = this.getUrl();

    return this;
  }

  /**
   * 往前添加 query
   *
   * @param {string} name 键名;
   * @param {string} value 键值;
   * @param {string} [search] 搜索键名; 往 search 前面添加 query;
   * @param {number} [order] 次序; 当 search 有多个时, 作为 search 结果的下标;
   * @returns {UrlResolver}
   */
  prependQuery (name, value, search, order = 0) {
    // 入列
    if (search) {
      const index = this._getIndexInSequenceBySearch(this.querySequence, search, order);
      if (index === -1) {
        return this;
      }

      this.querySequence.splice(index, 0, name);
    }
    else {
      this.querySequence.unshift(name);
    }

    // 赋值
    if (this.query[name]) {
      this.query[name].splice(order, 0, value);
    }
    else {
      this.query[name] = [value];
    }

    // 重组
    this.queryname = this.getQueryname();
    this.url = this.getUrl();

    return this;
  }

  /**
   * 移除 query
   *
   * @param {string} name 键名;
   * @param {number} [order] 次序; 当 query 有多个时, 作为查找结果的下标;
   * @returns {UrlResolver}
   */
  removeQuery (name, order = 0) {
    // 查找
    const index = this._getIndexInSequenceBySearch(this.querySequence, name, order);
    if (index === -1) {
        return this;
    }

    // 出列
    this.querySequence.splice(index, 1);

    // 删除
    this.query[name].splice(order, 1);
    if (!this.query[name].length) {
      Reflect.deleteProperty(this.query, name);
    }

    // 重组
    this.queryname = this.getQueryname();
    this.url = this.getUrl();

    return this;
  }

  /**
   * 移除全部 query
   * @param {string} name
   * @returns {UrlResolver}
   */
  removeAllQuery (name) {
    let index = this.querySequence.indexOf(name);
    if (index === -1) {
      return this;
    }

    // 出列
    while (index !== -1) {
      this.querySequence.splice(index, 1);
      index = this.querySequence.indexOf(name);
    }

    // 删除
    Reflect.deleteProperty(this.query, name);

    // 重组
    this.queryname = this.getQueryname();
    this.url = this.getUrl();

    return this;
  }

  /**
   * 获取 pathname
   * @returns {string}
   */
  getPathname () {
    return '/' + this.paramSequence.join('/');
  }

  /**
   * 获取 queyrname
   * @returns {string}
   */
  getQueryname () {
    const nextIndexMapping = {};
    const queryList = [];

    for (const name of this.querySequence) {
      const values = this.query[name];
      if (values) {
        const index = nextIndexMapping[name] || 0;
        queryList.push(name + this.equalSep + values[index]);
        nextIndexMapping[name] = index + 1;
      }
    }

    return this.urlSep + queryList.join(this.querySep);
  }

  /**
   * 获取 url
   * @returns {string}
   */
  getUrl () {
    return `${this.protocol}://${this.host}${this.pathname}${this.queryname}${this.hash}`;
  }
}

/**
 * Url 解析器
 * @description
 * 提供自定义解析逻辑
 */
export class UrlParser {
  constructor ({
    urlSeps = ['?'],     // path和query分割符
    querySep = '&',      // query分割符
    queryValueSep = '&', // query值分割符; 作为query值的url的分隔符;
    equalSep = '=',      // query键值对分割符
    hashExtractor,       // hash 提取器
    urlSlicer,           // pathname, queryname 切分器
    paramExtractor,      // param 提取器
    queryExtractor,      // query 提取器
  } = {}) {
    this.parseHistory = [];

    Object.assign(this, { urlSeps, querySep, queryValueSep, equalSep });
    this.setHashExtractor(hashExtractor);
    this.setUrlSlicer(urlSlicer);
    this.setParamsExtractor(paramExtractor);
    this.setQueryExtractor(queryExtractor);
  }

  /**
   * @typedef UrlParserConfig
   * @property {Array} urlSeps path和query分割符
   * @property {string} querySep query分割符
   * @property {string} queryValueSep query值分割符; 作为query值的url的分隔符;
   * @property {string} equalSep query键值对分割符
   */
  /**
   * 获取解析器配置
   * @returns {UrlParserConfig}
   */
  getConfig () {
    return {
      urlSeps: this.urlSeps,
      querySep: this.querySep,
      queryValueSep: this.queryValueSep,
      equalSep: this.equalSep,
    };
  }

  /**
   * 基础信息提取器
   * @param {string} url
   * @returns {{
   *   protocol: string,
   *   host: string,
   *   hostname: string,
   *   port: string,
   * }}
   */
  static basicExtractor (url) {
    let protocol = '';
    let host = '';
    let hostname = '';
    let port = '';

    const protocolIndex = url.indexOf('://');
    if (protocolIndex !== -1 && protocolIndex < 10) {
      // 提取 protocol
      const [tempProtocol, path] = url.split('://');
      if (/^[a-zA-Z]*$/.test(tempProtocol)) {
        protocol = tempProtocol;

        // 提取 host
        const hostTail = path.indexOf('/');
        if (hostTail === -1) {
          host = path;
        }
        else {
          host = path.slice(0, hostTail);
        }

        // 提取 hostname
        const hostSplit = host.split(':');
        hostname = hostSplit[0] || '';

        // 提取 port
        port = hostSplit[1] || '';
        if (!port) {
          switch (protocol) {
            case 'ftp':
              port = '21';
              break;
            case 'http':
            case 'ws':
              port = '80';
              break;
            case 'https':
            case 'wss':
              port = '443';
              break;
            default:
              break;
          }
        }
      }
    }

    return {
      protocol,
      host,
      hostname,
      port,
    };
  }

  /**
   * hash 提取器
   * @param {string} url
   * @returns {string} hash
   */
  hashExtractor (url) {
    const index = url.indexOf('#');
    return index != -1 ? url.slice(index) : '';
  }

  /**
   * pathname, queryname 切分器
   * @param {string} url
   * @returns {Array} [pathname, queryname]
   */
  urlSlicer (url, { _host = UrlParser.basicExtractor(url).host } = {}) {
    const index = url.indexOf(this.equalSep);

    for (let i = index; i >= 0; i--) {
      if (this.urlSeps.includes(url[i])) {
        return [
          url.slice(0, i).split(_host)[1],
          url.slice(i).split(this.hashExtractor(url) || '#').shift(),
        ];
      }
    }

    return [url, ''];
  }

  /**
   * param 提取器
   * @param {string} url
   * @returns {{
   *   pathname: string,
   *   params: Object,
   * }} { pathname, params: { key: count } }
   */
  paramExtractor (url, { _pathname = this.urlSlicer(url)[0] } = {}) {
    // params参数提取;
    const params = {};
    const paramSequence = [];
    for (const param of _pathname.split('/')) {
      if (param) {
        paramSequence.push (param);

        if (Reflect.has(params, param)) {
          params[param]++;
        }
        else {
          params[param] = 1;
        }
      }
    }
    return {
      pathname: _pathname,
      paramSequence,
      params,
    };
  }

  /**
   * query 提取器
   * @param {string} url
   * @returns {{
   *   queryname: string,
   *   query: Object,
   * }} { queryname, query: { key: [value] } }
   */
  queryExtractor (url, { _queryname = this.urlSlicer(url)[1] } = {}) {
    const query = {};
    const querySequence = [];
    let head = 0;

    while (head !== -1) {
      // 查找键位置
      while (_queryname[head + 1] === this.querySep) {
        head++;
      }

      let equalIndex = _queryname.indexOf(this.equalSep, head);
      if (equalIndex === -1) {
        break;
      }

      let tail = -1;
      let value = '';

      tail = _queryname.indexOf(this.querySep, equalIndex);
      let name = _queryname.slice(head + 1, equalIndex);

      if (tail !== -1) {
        // 值为url
        if (this.querySep === this.queryValueSep && /^[a-zA-Z]+:\/\/.+$/.test(_queryname.slice(equalIndex + 1))) {
          value = _queryname.slice(equalIndex + 1);
          head = -1;
        }
        else {
          value = _queryname.slice(equalIndex + 1, tail);
          head = tail;
        }
      }
      else {
        // 末尾
        if (equalIndex !== _queryname.length - 1) {
          value = _queryname.slice(equalIndex + 1);
        }
        head = -1;
      }

      querySequence.push(name);
      if (query[name]) {
        query[name].push(value);
      }
      else {
        query[name] = [value];
      }
    }

    return {
      queryname: _queryname,
      querySequence,
      query,
    };
  }

  /**
   * @typedef UrlParserResult
   * @property {originUrl}
   * @property {url}
   * @property {protocol}
   * @property {host}
   * @property {hostname}
   * @property {port}
   * @property {hash}
   * @property {pathname}
   * @property {paramSequence}
   * @property {params}
   * @property {queryname}
   * @property {querySequence}
   * @property {query}
   */
  /**
   * 解析 URL
   * @param {string} url
   * @returns {UrlParserResult}
   */
  parse (url) {
    const { protocol, host, hostname, port } = UrlParser.basicExtractor(url);
    const hash = this.hashExtractor(url);
    const [pathname, queryname] = this.urlSlicer(url);
    const { params, paramSequence } = this.paramExtractor(url, { _host: host, _pathname: pathname });
    const { query, querySequence } = this.queryExtractor(url, { _queryname: queryname });

    this.parseHistory.push({
      originUrl: url,
      url, protocol, host, hostname, port, hash,
      pathname, paramSequence, params,
      queryname, querySequence, query,
    });

    return {
      originUrl: url,
      url, protocol, host, hostname, port, hash,
      pathname, paramSequence, params,
      queryname, querySequence, query,
    };
  }

  setHashExtractor (hashExtractor) {
    if (hashExtractor && typeof hashExtractor === 'function') {
      this.hashExtractor = hashExtractor;
    }
  }

  setUrlSlicer (urlSlicer) {
    if (urlSlicer && typeof urlSlicer === 'function') {
      this.urlSlicer = urlSlicer;
    }
  }

  setParamsExtractor (paramExtractor) {
    if (paramExtractor && typeof paramExtractor === 'function') {
      this.paramExtractor = paramExtractor;
    }
  }

  setQueryExtractor (queryExtractor) {
    if (queryExtractor && typeof queryExtractor === 'function') {
      this.queryExtractor = queryExtractor;
    }
  }

  /**
   * 获取解析历史
   * @param {number} [index] 索引; 不填可返回全部;
   * @returns {UrlParserResult|UrlParserResult[]}
   */
  getParseHistory (index) {
    if (index !== undefined) {
      return this.parseHistory[index];
    }
    return this.parseHistory;
  }

  /**
     * 获取最新解析记录
     * @returns {UrlParserResult}
     */
  getLastParseHistory () {
    return this.parseHistory[this.parseHistory.length - 1];
  }

  /**
   * 获取 UrlReslover 实例;
   * @description
   * - 默认使用上一次解析结果来生成处理器;
   * - 可自行提供解析结果或url来生成处理器;
   * @param {Object} [options]
   * @param {Object} [options.parseResult] 自定义解析结果
   * @param {string} [options.url] url
   * @returns {UrlResolver}
   */
  getResolver ({ parseResult, url } = {}) {
    const { urlSeps, querySep, equalSep } = this.getConfig();
    let rs = {};

    if (parseResult) {
      rs = parseResult;
    }
    else if (url) {
      rs = this.parse(url);
    }
    else {
      rs = this.getLastParseHistory();
    }

    return new UrlResolver({
      ...rs,
      urlSep: urlSeps.find(v => rs.queryname.startsWith(v)),
      querySep,
      equalSep,
    });
  }
}
