//-- Dependencies --//
require('dotenv').config()
const { PORT = 3000, MONGODB_URL } = process.env
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const AuthRouter = require("./controllers/user")
const auth = require("./auth")

//-- DB Connection --//
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log('You are disconnected from mongoose'))
    .on('error', (error) => console.log(error))

//-- Model --//
const WorkoutsSchema = new mongoose.Schema({
    date: String,
    time: String,
    distance: String,
    drag: String
})

const Workouts = mongoose.model('Workouts', WorkoutsSchema)

//-- MiddleWare --//
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

//--- Routers --//
app.use("/auth", AuthRouter)

//-- Routes --//
app.get('/', (req, res) => {
    res.send("Hello Garrett")
})

// Index
app.get('/workouts', async (req, res) => {          //-- , auth
    try {
        res.json(await Workouts.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Create
app.post('/workouts', async (req, res) => {
    try {
        res.json(await Workouts.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Update
app.put('/workouts/:id', async (req, res) => {
    try {
        res.json(await Workouts.findByIdAndUpdate(req.params.id, req.body, { new: true }))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Delete
app.delete('/workouts/:id', async (req, res) => {
    try {
        res.json(await Workouts.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

//-- Listener --//
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))


