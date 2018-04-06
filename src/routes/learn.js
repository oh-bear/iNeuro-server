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
router.get('/get_learns', (req, res) => {

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

// 随机出题接口
// 前端请求用于获取1道题目
router.get('/get_learn', (req, res) => {

  const {token, uid, timestamp} = req.query
  validate(res, true, uid, timestamp, token)

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      const itemAtIndex = arr[randomIndex]
      arr[randomIndex] = arr[i]
      arr[i] = itemAtIndex
    }
    return arr
  }

  const response = async () => {
    const data = await Resource.findOne({where: {id: Math.floor(Math.random() * (1326 - 63 + 1) + 63)}})
    const resources = await Resource.findAll({where: {id: [Math.floor(Math.random() * (1326 - 63 + 1) + 63), Math.floor(Math.random() * (1326 - 63 + 1) + 63), Math.floor(Math.random() * (1326 - 63 + 1) + 63)]}})
    let resources_name = await resources.map(r => r.name)
    resources_name[3] = data.name
    
    const options = shuffle(resources_name)
    return res.json({...MESSAGE.OK, data, options})
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
