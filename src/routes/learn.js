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

// 随机出题接口，根据模块出题，一次性返回全部题目
router.get('/get_learn_by_resource', (req, res) => {

  const { token, uid, timestamp, system_name } = req.query
  validate(res, true, uid, timestamp, token, system_name)

  const response = async () => {
    let data = await Resource.findAll({ where: { system_name: system_name.split(',') } })

    return res.json({ ...MESSAGE.OK, data })
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
      record.decrement('result', { by: 5 })
    }
    return res.json(MESSAGE.OK)
  }
  response()
})

// TODO
router.post('/forget', (req, res) => {

  const { token, uid, timestamp, resource_id } = req.body
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const resource = await Resource.findById(resource_id)
    await resource.increment(['total_time', 'wrong_time'])
    const record = await Record.findOne({ where: { user_id: uid, resource_id } })
    if (!record) {
      await Record.create({ user_id: uid, resource_id, result: -3 })
    } else {
      record.decrement('result', { by: 3 })
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
      await Record.create({ user_id: uid, resource_id, result: 1 }) // todo: 这里改成100分 @zyktrcn
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
    const records = await Record.findAll({ where: { user_id: uid, result: { 'lt': 0 } }, include: [Resource] })
    if (records.length !== 0) {
      const idx = Math.floor(Math.random() * (records.length + 1)) - 1
      const data = records[idx].dataValues.resource
      return res.json({ ...MESSAGE.OK, data, record: records[idx], length: records.length })
    }

    return res.json(MESSAGE.REVIEW_NOT_EXIST)
  }
  response()
})

router.get('/update_daily', (req, res) => {
  const { password } = req.query;
  const ONEDAY = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const response = async () => {
    if (passward === 'zyktrcnissb') {

      const records = await Record.findAll()
      for (let i = 0; i < records.length; i++) {
        if ((Date.now() - records.last_time) >= ONEDAY && (Date.now() - records.last_time) < 2 * ONEDAY) {
          await Record.update({ result: Math.floor(records[i].result * 0.337)}, { where: { id: records[i].id } })
        } else if ((Date.now() - records.last_time) >= 2 * ONEDAY && (Date.now() - records.last_time) < 3 * ONEDAY) {
          await Record.update({ result: Math.floor(records[i].result * 0.81)}, { where: { id: records[i].id } }) // 27.8
        } else if ((Date.now() - records.last_time) >= 3 * ONEDAY && (Date.now() - records.last_time) < 4 * ONEDAY) {
          await Record.update({ result: Math.floor(records[i].result * 0.91)}, { where: { id: records[i].id } }) // 25.4
        } else {
          await Record.update({ result: Math.floor(records[i].result * 0.95)}, { where: { id: records[i].id } }) // 知识保留率大概为95%
        }
      }
      return res.json(MESSAGE.OK)
    } else {
      return res.json(MESSAGE.PARAMETER_ERROR)
    }
  }

  response()
})

module.exports = router
