const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
.then(result => {
    console.log('connected to MONGODB');
}).catch(error => {
    console.log('failed to connect to server: ' + error.message);
})

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: function(v) {
          return /\d{3}-/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
    },
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