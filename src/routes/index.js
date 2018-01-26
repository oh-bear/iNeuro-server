import express from 'express'

const router = express.Router()

router.get('/', function (req, res) {
  return res.json({title: 'Express'})
})

module.exports = router
