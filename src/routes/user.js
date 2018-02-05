import express from 'express'

import {
  User,
  Code
} from '../models'

import https from 'https'
import querystring from 'querystring'
import qiniu from 'qiniu'

import {
  MESSAGE,
  KEY,
  YUNPIAN_APIKEY,
  md5Pwd,
  validate,
  QINIU_ACCESS,
  QINIU_SECRET,
  BUCKET
} from '../config'

const router = express.Router()

qiniu.conf.ACCESS_KEY = QINIU_ACCESS
qiniu.conf.SECRET_KEY = QINIU_SECRET

// 获取七牛 Token
router.get('/qiniu_token', (req, res) => {

  const {token, uid, timestamp, filename} = req.query

  validate(res, true, uid, timestamp, token, filename)

  let putPolicy = new qiniu.rs.PutPolicy(BUCKET + ':' + filename)
  let data = putPolicy.token()

  return res.json({...MESSAGE.OK, data})
})

router.post('/code', (req, res) => {

  const {account} = req.body

  validate(res, false, account)

  const now = new Date().getTime()

  const code = Math.floor(Math.random() * 8999 + 1000)

  const postData = {
    mobile: account,
    text: '【iNeuro】您的验证码是' + code,
    apikey: YUNPIAN_APIKEY
  }

  const postContent = querystring.stringify(postData)

  const options = {
    host: 'sms.yunpian.com',
    path: '/v2/sms/single_send.json',
    method: 'POST',
    agent: false,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postContent.length
    }
  }

  const model = {
    account,
    code,
    time: now,
    used: false
  }

  const sendMsg = async () => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
    })
    req.write(postContent)
    req.end()
    return true
  }

  const response = async () => {
    const results = await Code.findAll({where: {account, used: false}})
    if (results[0] !== undefined) {
      if (now - results[0].time < 600000) {
        return res.json(MESSAGE.QUICK_REQUEST)
      }
    }
    await Code.create(model)
    await sendMsg()
    return res.json({...MESSAGE.OK, data: now})
  }

  response()
})

router.post('/login', (req, res) => {

  const {account, password} = req.body

  validate(res, false, account, password)

  const response = async () => {
    const user = await User.findOne({where: {account}})
    if (!user) {
      return res.json(MESSAGE.USER_NOT_EXIST)
    } else {
      if (user.password === md5Pwd(password)) {
        const timestamp = new Date().getTime()
        const token = md5Pwd((user.id).toString() + timestamp.toString() + KEY)
        user.password = 0
        return res.json({
          ...MESSAGE.OK,
          data: {
            user,
            key: {token, timestamp, uid: user.id}
          }
        })
      } else {
        return res.json(MESSAGE.PASSWORD_ERROR)
      }
    }
  }

  response()
})

router.post('/register', (req, res) => {

  const {account, password, code, time} = req.body

  validate(res, false, account, password, code, time)

  const findCode = async () => {
    return await Code.findOne({where: {account, code, time, used: false}})
  }

  const response = async () => {
    const code = await findCode()
    if (code) {
      const user = await User.findOne({where: {account}})
      if (user) {
        return res.json(MESSAGE.USER_EXIST)
      } else {
        const userinfo = {
          account,
          password: md5Pwd(password),
          name: account,
        }
        await User.create(userinfo)
        return res.json(MESSAGE.OK)
      }
    }
    return res.json(MESSAGE.CODE_ERROR)
  }

  response()
})

module.exports = router
