import express from 'express'

import {
  Resource
} from '../models'

import {
  MESSAGE,
  validate
} from '../config'

const router = express.Router()

// 搜索接口
router.post('/search', (req, res) => {

  const {uid, timestamp, token, content} = req.body
  validate(res, true, uid, timestamp, token, content)

  const response = async () => {
    const data = await Resource.findAll({
      where: {
        structure_name: {
          'like': `%${content}%`
        }
      }
    })
    return res.json({...MESSAGE.OK, data})
  }

  response()
})

// 题库系统列表
router.get('/resource_list', (req, res) => {
  const {uid, timestamp, token, system_name} = req.query
  validate(res, true, uid, timestamp, token, system_name)

  const response = async () => {
    const data = await Resource.findAll({where: {system_name: {'like': `${system_name}%`}}})
    return res.json({...MESSAGE.OK, data})
  }

  response()
})

module.exports = router
