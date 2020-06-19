import echarts from 'echarts'

var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding(s, len) {
  var len = len - (s + '').length
  for (var i = 0; i < len; i++) { s = '0' + s }
  return s
}

export default {


  PRODUCTLIST: [
    { key: "bixin", name: "比心" },
    { key: "xxq", name: "鱼耳直播" },
    { key: "yuer", name: "鱼耳" },
    { key: "common", name: "公共" },
    { key: "payment", name: "支付" },
    { key: "h5", name: "活动" },
    { key: "推荐算法", name: "推荐算法" }
  ],

  REPORTTYPELIST: [
    { key: 'week', name: '周' },
    { key: 'day', name: '天' }
  ],

  PLATFORMLIST: [
    { key: 1, name: 'Android' },
    { key: 2, name: 'iOS' },
    { key: 3, name: 'PC' }

  ],
  TCTYPELIST: [
    { key: 0, name: '来自性能平台' },
    { key: 1, name: '手动插入用例' },
  ],

  displayCNProdName(prodName) {
    if (prodName) {
      switch (prodName) {
        case 'bx': return '比心'
        case 'bixin': return '比心'
        case 'yuer': return '鱼耳'
        case 'xxq': return '鱼耳直播'
        case 'h5': return '活动'
        case 'common': return '公共服务'
        case 'pay-trade': return '支付中心'
        case 'payment': return '支付'
        case 'bigdata': return '大数据'
        case 'middleware': return '中间件'
        case 'activity': return '活动'
        default: return prodName
      }
    }
  },
  displayCNStatus(stausCode) {
    switch (stausCode) {
      case '0': return '新建'
      case '1': return '处理中...'
      case '2': return '完成'
    }
  },

  getQueryStringByName: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) { context = r[2] }
    reg = null
    r = null
    return context == null || context == '' || context == 'undefined' ? '' : context
  },
  generateUUID: function () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    var reg = new RegExp('-', 'g')
    return uuid.replace(reg, '')
  },
  // 根据测试环境来决定调用哪个server
  getUJTestServer(env) {
    const uatUrl = ''
    const testUrl = 'http://192.168.11.190:9011'
    // const testUrl = "http://192.168.11.173:9000";
    switch (env) {
      case 'uat': return uatUrl
      case 'test':
      default: return testUrl
    }
  },
  getCatDataServer() {
    // server
    return 'http://10.111.3.51:9001'
    // local
    //    return  "http://192.168.11.72:9000";
  },
  // 链接：https://www.jianshu.com/p/04127d74d88c
  syntaxHighlight: function (json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2)
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    })
  },

  format(txt, compress/* 是否为压缩模式*/) { /* 格式化JSON源码(对象转换为JSON文本) */
    var indentChar = '    '
    if (/^\s*$/.test(txt)) {
      alert('数据为空,无法格式化! ')
      return
    }
    try { var data = eval('(' + txt + ')') } catch (e) {
      alert('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err')
      return
    }
    var draw = []; var last = false; var This = this; var line = compress ? '' : '\n'; var nodeCount = 0; var maxDepth = 0

    var notify = function (name, value, isLast, indent/* 缩进*/, formObj) {
      nodeCount++/* 节点计数*/
      for (var i = 0, tab = ''; i < indent; i++)tab += indentChar/* 缩进HTML */
      tab = compress ? '' : tab/* 压缩模式忽略缩进*/
      maxDepth = ++indent/* 缩进递增并记录*/
      if (value && value.constructor == Array) { /* 处理数组*/
        draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line)/* 缩进'[' 然后换行*/
        for (var i = 0; i < value.length; i++) { notify(i, value[i], i == value.length - 1, indent, false) }
        draw.push(tab + ']' + (isLast ? line : (',' + line)))/* 缩进']'换行,若非尾元素则添加逗号*/
      } else if (value && typeof value === 'object') { /* 处理对象*/
        draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line)/* 缩进'{' 然后换行*/
        var len = 0; var i = 0
        for (var key in value) len++
        for (var key in value) notify(key, value[key], ++i == len, indent, true)
        draw.push(tab + '}' + (isLast ? line : (',' + line)))/* 缩进'}'换行,若非尾元素则添加逗号*/
      } else {
        if (typeof value === 'string') value = '"' + value + '"'
        draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line)
      }
    }
    var isLast = true; var indent = 0
    notify('', data, isLast, indent, false)
    return draw.join('')
  },
  unique: function (arr) {
    return [...new Set(arr)]
  },
  /**
     * 对一个数组对象去重
     */
  uniqueArrObj: function (arr) {
    const unique = {}
    arr.forEach(function (item) {
      unique[JSON.stringify(item)] = item// 键名不会重复
    })
    arr = Object.keys(unique).map(function (u) {
      // Object.keys()返回对象的所有键值组成的数组，map方法是一个遍历方法，返回遍历结果组成的数组.将unique对象的键名还原成对象数组
      return JSON.parse(u)
    })
    return arr
  },

  /**
     * sortBy数组对象按某个属性排序
     */
  sortBy: function (name) {
    return function (o, p) {
      var a, b
      if (typeof o === 'object' && typeof p === 'object' && o && p) {
        a = o[name]
        b = p[name]
        if (a === b) {
          return 0
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1
        }
        return typeof a < typeof b ? -1 : 1
      } else {
        throw ('error')
      }
    }
  },

  formatDate: {
    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y': return padding(date.getFullYear(), $0.length)
          case 'M': return padding(date.getMonth() + 1, $0.length)
          case 'd': return padding(date.getDate(), $0.length)
          case 'w': return date.getDay() + 1
          case 'h': return padding(date.getHours(), $0.length)
          case 'm': return padding(date.getMinutes(), $0.length)
          case 's': return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function (dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP)
      var matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length == matchs2.length) {
        var _date = new Date(1970, 0, 1)
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i])
          var sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y': _date.setFullYear(_int); break
            case 'M': _date.setMonth(_int - 1); break
            case 'd': _date.setDate(_int); break
            case 'h': _date.setHours(_int); break
            case 'm': _date.setMinutes(_int); break
            case 's': _date.setSeconds(_int); break
          }
        }
        return _date
      }
      return null
    }
  },
  /**
   * 
   * @param {*} dateString like  '2017-10-10 19:00:00.123'
   */
  parseStringtoDate(dateString) {
    let s = dateString
    s = s.replace(/-/g, "/");
    s = s.replace(/(\.\d+)?/g, "");
    return new Date(s);
  },

  initDateFormat() {
    var me = this
    Date.prototype.Format = function (fmt) {
      var o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds() // 毫秒
      }

      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }

      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return fmt
    }
  },

  formatDate(date, formatStr) {
    var newDate = new Date()
    newDate.setTime(date.getTime())
    return newDate.Format(formatStr)
  },

  // 生成echart一个series的item对象
  /**
   *
   * @param {String} name
   * @param {Array} data
   */
  generateSeriesItem(name, data, type = 'line') {
    return {
      name: name,
      data: data,
      smooth: true,
      symbolSize: 3,
      showSymbol: false,
      type: type,
      stack: '',
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(137, 189, 27, 0.3)'
          }, {
            offset: 0.8,
            color: 'rgba(137, 189, 27, 0)'
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        }
      },
      itemStyle: {
        normal: {
          // color: 'rgb(137,189,27)',
          // borderColor: 'rgba(137,189,2,0.27)',
          borderWidth: 3

        }
      },
      // markLine: {
      //   data: [
      //     { type: 'average', name: '平均值' }
      //   ]
      // }
    }
  },

}
