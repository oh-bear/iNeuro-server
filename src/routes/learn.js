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

  const { token, uid, timestamp } = req.query
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    let ids = []
    for (let i = 0; i < 20; i++) {
      ids.push(Math.floor(Math.random() * (1326 - 63 + 1) + 63))
    }
    const data = await Resource.findAll({ where: { id: ids } })
    return res.json({ ...MESSAGE.OK, data })
  }
  response()
})

// 随机出题接口
// 前端请求用于获取1道题目
router.get('/get_learn', (req, res) => {

  const { token, uid, timestamp } = req.query
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

  const pickId = () => {
    let id = Math.floor(Math.random() * (1326 - 63 + 1) + 63)
    if ((id < 1051 && id > 945) || (id < 386 && id > 219)) {
      Math.random() > 0.5
        ? id = Math.floor(Math.random() * (1326 - 1051 + 1) + 1051)
        : id = Math.floor(Math.random() * (944 - 386 + 1) + 386)
      return id
    } else {
      return id
    }
  }

  const response = async () => {
    const data = await Resource.findOne({ where: { id: pickId() } })
    const resources = await Resource.findAll({ where: { id: [pickId(), pickId(), pickId()] } })

    let resources_name = await resources.map(r => r.name)
    await resources_name.push(data.dataValues.name)

    const options = shuffle(resources_name)
    return res.json({ ...MESSAGE.OK, data, options })
  }
  response()
})

router.post('/wrong', (req, res) => {

  const { token, uid, timestamp, resource_id } = req.body
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const resource = await Resource.findById(resource_id)
    await resource.increment(['total_time', 'wrong_time'])
    const record = await Record.findOne({ where: { user_id: uid, resource_id } })
    if (!record) {
      await Record.create({ user_id: uid, resource_id, result: -5 })
    } else {
      record.decrement('result')
    }
    return res.json(MESSAGE.OK)
  }
  response()
})

router.post('/right', (req, res) => {

  const { token, uid, timestamp, resource_id } = req.body
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const resource = await Resource.findById(resource_id)
    await resource.increment('total_time')
    const record = await Record.findOne({ where: { user_id: uid, resource_id } })
    if (!record) {
      await Record.create({ user_id: uid, resource_id, result: 1 })
    } else {
      record.increment('result')
    }
    return res.json(MESSAGE.OK)
  }
  response()
})

router.post('/get_review', (req, res) => {

  const { token, uid, timestamp } = req.body
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const records = await Record.findAll({where: {user_id: uid, result: {'lt': 0}}, include: [Resource]})
    if (records.length !== 0) {
      const idx = Math.floor(Math.random() * (records.length + 1))
      const data = records[idx].dataValues.resource
      return res.json({...MESSAGE.OK, data})
    }

    return res.json(MESSAGE.REVIEW_NOT_EXIST)
  }
  response()
})

module.exports = router
