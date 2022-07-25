require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGO_URI

mongoose.connect(url).then(console.log('Connected to Mongo'))
.catch((error) => console.log('Error connecting to Mongo:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3 
  },
  number:{
    type: String,
    required: true
  } 
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

