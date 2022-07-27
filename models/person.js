require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGO_URI

mongoose.connect(url).then(console.log('Connected to Mongo'))
  .catch((error) => console.log('Error connecting to Mongo:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number:{
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function(v) {
        const checkFormat = (phoneNumber) => {
          const hyphenCheck = phoneNumber.split('').filter(digit => digit === '-')
          if (hyphenCheck.length === 1){
            const parts = phoneNumber.split('-')
            if (parts[0].length < 2 || parts[0].length > 3){
              return false
            }
            if (parts[1].split('').filter(p => !isNaN(p)).length !== parts[1].split('').length){
              return false
            }
          }
          if (hyphenCheck.length > 1){
            return false
          }
          return true
        }

        return checkFormat(v)
      },
      message: () => 'Phone numbers may only include 1 hyphen and must have either 2 or 3 digits before the hyphen.'
    }
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

