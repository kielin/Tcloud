'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 接口地址配置
  // BASE_URL: '"http://192.168.11.55:9000"',
  //阿里服务器
  BASE_URL: '"http://10.111.22.246"',
  DEV_BASE_URL: '"http://10.111.22.246:9099"',

  // //晓伟
  // BASE_URL: '"http://192.168.11.214"',
  // DEV_BASE_URL: '"http://192.168.11.214:9099"',

  // BASE_URL: '"http://192.168.27.98"',
  // DEV_BASE_URL: '"http://192.168.27.98:9099"',

  //Ekin
  // BASE_URL: '"http://192.168.11.55"',
  // DEV_BASE_URL: '"http://192.168.11.55:9099"',

  // BASE_URL: '"http://192.168.11.129"',
  //ws 服务的地址配置
  WS_BASE_URL: '"ws://xxxx"',
  //cookie 的过期时间
  COOKIE_EXPIRED: 14,
  //cookie 域名
  // COOKIE_DOMAIN: '"http://10.111.22.246"',
  COOKIE_DOMAIN: '"192.168.11.55"',

  //cookie 存储前缀
  COOKIE_SUFFIX: '"_TCLOUD_DEV"',
  //企业微信扫码登录的相关配置
  QYWX_APPID: '"xxxx"',
  QYWX_AGENTID: '"xxxx"',
  QYEX_REDIRECT_URI: '"xxxx"',
  // STF_URL: '"http://192.168.11.207:7100"'
  STF_URL: '"http://192.168.11.232:7100"'

})
