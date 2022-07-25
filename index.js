require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.use(morgan('tiny', {
  skip: function (req, res) {return req.method === 'POST'}
}))

morgan.token('data', (req, res) => {return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
  skip: function (req, res) {return req.method !== 'POST'}
}))

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => res.json(persons))
  .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    const pluralCheck = persons.length === 1 ? 'person' : 'people'
    const info = `<p>Phonebook has info for ${persons.length} ${pluralCheck} </p>`
    res.send(info + new Date())
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(result => {
    console.log(result)
    res.json(result)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => res.status(204).end())
  .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {

  const data = req.body

  if (!data.name) {
    return res.status(400).json({
      error: "You must include a name for the entry."
    })
  } 
  if (!data.number){
    return res.status(400).json({
      error: "You must include a number for the entry."
    })
  }

  const newPerson = new Person({
    name: data.name,
    number: data.number,
  })
  newPerson.save().then(savedPerson => res.json(savedPerson))
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    content: req.body.content,
    number: req.body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true})
  .then(result => res.json(result))
  .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: "Unknown Endpoint"})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is up on ${PORT}`)
})