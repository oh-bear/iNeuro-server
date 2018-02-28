import express from 'express'

import {
  User
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

  const {account, password, name} = req.body

  validate(res, false, account, password, name)

  const response = async () => {
  
    const user = await User.findOne({where: {account}})
    if (user) {
      return res.json(MESSAGE.USER_EXIST)
    } else {
      const userinfo = {
        account,
        password: md5Pwd(password),
        name,
        face: 'https://airing.ursb.me/image/avatar/40.png'
      }
      await User.create(userinfo)
      return res.json(MESSAGE.OK)
    }
  }

  response()
})

module.exports = router
