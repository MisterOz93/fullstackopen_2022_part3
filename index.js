const express = require('express')
const app = express()
const persons = require('./persons')

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const pluralCheck = persons.length === 1 ? 'person' : 'people'
  const info = `<p>Phonebook has info for ${persons.length} ${pluralCheck} </p>`
  res.send(info + new Date())
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server is up on ${PORT}`)
})