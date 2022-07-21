const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = require('./persons')


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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const pluralCheck = persons.length === 1 ? 'person' : 'people'
  const info = `<p>Phonebook has info for ${persons.length} ${pluralCheck} </p>`
  res.send(info + new Date())
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person){
    res.json(person)
  }
  else {
    res.statusMessage = "Person was not found"
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})


app.post('/api/persons', (req, res) => {

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
  if (persons.map(person => person.name).includes(data.name)){
    return res.status(400).json({
      error: "The name must be unique"
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 100000),
    name: data.name,
    number: data.number,
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is up on ${PORT}`)
})