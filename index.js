const express = require('express')
const app = express()
const persons = require('./persons')

app.get('/api/persons', (req, res) =>{
  res.json(persons)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server is up on ${PORT}`)
})