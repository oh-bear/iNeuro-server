import express from 'express'

import {
  Resource,
  Record
} from '../models'

import {
  MESSAGE,
  validate
} from '../config'

const router = express.Router()

// 随机出题接口
// 前端请求用于获取20条数据作为一组题目
router.get('/get_learn', (req, res) => {

  const {token, uid, timestamp} = req.query
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    let ids = []
    for (let i = 0; i < 20; i ++) {
      ids.push(Math.floor(Math.random() * (1326 - 63 + 1) + 63))
    }
    const data = await Resource.findAll({where: {id: ids}})
    return res.json({...MESSAGE.OK, data})
  }
  response()
})

router.post('/wrong', (req, res) => {
  
  const {token, uid, timestamp, resource_id} = req.body
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const resource = await Resource.findById(resource_id)
    await resource.increment(['total_time', 'wrong_time'])
    const record = await Record.findOne({where: {user_id: uid, resource_id}})
    if (!record) {
      await Record.create({user_id: uid, resource_id, result: -1})
    } else {
      record.decrement('result')
    }
    return res.json(MESSAGE.OK)
  }
  response()
})

router.post('/right', (req, res) => {

  const {token, uid, timestamp, resource_id} = req.body
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const resource = await Resource.findById(resource_id)
    await resource.increment('total_time')
    const record = await Record.findOne({where: {user_id: uid, resource_id}})
    if (!record) {
      await Record.create({user_id: uid, resource_id, result: 1})
    } else {
      record.increment('result')
    }
    return res.json(MESSAGE.OK)
  }
  response()
})

module.exports = router
