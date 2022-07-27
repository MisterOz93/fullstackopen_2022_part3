const mongoose = require('mongoose')

const pw = process.argv[2]

const url = `mongodb+srv://MisterOz93:${pw}@cluster0.oldzd.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = new mongoose.model('Person', personSchema)

mongoose.connect(url).then(() => {
  console.log('mongodb connected')
  if (process.argv.length === 5){
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4]
    })
    return person.save().then( () => {
      console.log(`Added ${person.name} number ${person.number} to phonebook.`)
      mongoose.connection.close()
    })
  }
  if (process.argv.length === 3){
    console.log('Phonebook:')
    Person.find({}).then(res => {
      res.forEach(person => console.log(`${person.name} ${person.number}`))
      mongoose.connection.close()
    })
  }

})
