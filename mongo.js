const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3] || null;
const number = process.argv[4] || null;

const url =
  `mongodb+srv://manugeo:${password}@cluster0.3adog.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Peson', personSchema);

if ((name === null) || (number === null)) {
  Person.find({}).then(result => {
    if (result) {
      if (result.length === 0) {
        console.log("Phonebook is empty!");
      }
      else {
        console.log("Phonebook");
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`);
        })
      }
    }
    mongoose.connection.close();
  })
}
else {
  const person = new Person({ name, number });

  person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook.`);
    mongoose.connection.close();
  })
}