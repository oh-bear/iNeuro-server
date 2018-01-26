const md5 = require('md5')

export const MESSAGE = {
  OK: {
    code: 0,
    message: '请求成功',
  },
  USER_EXIST: {
    code: 302,
    message: '用户已存在',
  },
  TOKEN_ERROR: {
    code: 403,
    message: 'TOKEN失效',
  },
  USER_NOT_EXIST: {
    code: 404,
    message: '用户不存在',
  },
  CODE_ERROR: {
    code: 405,
    message: '验证码错误',
  },
  PARAMETER_ERROR: {
    code: 422,
    message: '参数错误',
  },
  BUY_ERROR: {
    code: 500,
    message: '购买失败',
  },
  REQUEST_ERROR: {
    code: 501,
    message: '请求失败',
  },
  QUICK_REQUEST: {
    code: 502,
    message: '请求间隔过短',
  },
}

export const KEY = 'airing'
export const YUNPIAN_APIKEY = ''
export const QINIU_ACCESS = ''
export const QINIU_SECRET = ''
export const BUCKET = ''

export const FITBIT_ID = '22CPH2'
export const FITBIT_SECRET = '45daa091599d956626ab248b48500ef8'

export const SQL_ACCOUNT = 'root'
export const SQL_PASSWORD = ''

export const PAGE_LIMIT = 20

export const md5Pwd = (password) => {
  const salt = 'Airing_is_genius_3957x8yza6!@#IUHJh~~'
  return md5(md5(password + salt))
}

export const checkToken = (uid, timestamp, token) => {
  if (uid && timestamp && token) {
    return token === md5Pwd(uid.toString() + timestamp.toString() + KEY)
  }
  return false
}
