const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://toti2:${password}@cluster0.wrqmzw9.mongodb.net/people?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if(person.name && person.number){
    person.save().then(result => { 
        console.log(`Added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close()
    })
}else{
    Person
    .find({})
    .then(persons => {
        console.log(persons)
        mongoose.connection.close()
    })}
