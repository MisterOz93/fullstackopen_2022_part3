require('dotenv').config()
const mongoose = require('mongoose')
const persons = require('../persons')
const url = process.env.MONGO_URI

mongoose.connect(url).then(console.log('Connected to Mongo'))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

