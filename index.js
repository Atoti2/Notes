require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
morgan.token('body', req => {
    return JSON.stringify(req.body)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {    
        return response.status(400).json({ error: error.message })
      }
  
    next(error)
  }

const Person = require('./models/phone')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url - :total-time ms :body '))
app.use(cors())


app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(people => {
        response.json(people);
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number is missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(newPerson => {
        response.json(newPerson)
    }).catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
 
    Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: "query" })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({}).then(count => {
        response.send(`Phonebook has info for ${count} people<br>${new Date()}`)
    }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))

