// init express
const express = require('express')
const app = express()
//Import dotenv
require('dotenv').config()
//Import mongoDB
const mongoose = require('mongoose')
//Import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

//Connect mongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },() => {
    console.log('db is connected')
})

//App Middlewares
app.use(express.json())

//Route Middlewares (app use)
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

//Server conf
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`server running... ${port}`)
})