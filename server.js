require('dotenv').config()

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

// ============= DB SETUP ==============
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

const connection = mongoose.connection
connection.on('connected', () => {
  console.log('Mongoose Connected Successfully')    
}) 

// If the connection throws an error
connection.on('error', (err) => {
  console.log('Mongoose default connection error: ' + err)
}) 

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(express.static(__dirname + '/client/build/'))
app.get('/', (req,res) => {
  res.sendFile(__dirname + '/client/build/index.html')
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// CONTROLLERS FOR ROUTES
const GardensController = require('./controllers/gardensController')
app.use('/api/gardens', GardensController)

const UsersController = require('./controllers/usersController')
app.use('/api/gardens/:gardenId/users', UsersController)

const PlantsController = require('./controllers/plantsController')
app.use('/api/gardens/:gardenId/users/:userId/plants', PlantsController)

const APIController = require('./controllers/apiController')
app.use('/api/weather', APIController)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})


module.exports = app
