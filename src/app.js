import http from 'http'

import express from 'express'
import bodyParser from 'body-parser'

import index from './routes/index'
import user from './routes/user'
import lib from './routes/lib'
import learn from './routes/learn'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/', index)
app.use('/users', user)
app.use('/libs', lib)
app.use('/learn', learn)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const server = http.createServer(app)
server.listen('7001')

module.exports = app
