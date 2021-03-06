const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
morgan.token('content', (req, res) =>  JSON.stringify(req.body || null));
morgan.token("custom", ":method :url :status :res[content-length] - :response-time ms :content");
app.use(morgan('custom'));

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

const getRandomNineDigitInteger = () => {
  return Math.floor(100000000 + (Math.random() * 900000000));
};

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const count = persons.length;
  const time = new Date().toString();
  response.send(`<p>Phonebook has info for ${count} people.</p><p>${time}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    response.json(person);
  }
  else {
    response.statusMessage = `Can't find a person with id ${id}.`;
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => (p.id !== id));
  console.log(`Deleted person with id: ${id}.`);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name) return response.status(400).json({ error: "Name is required."});
  if (!body.number) return response.status(400).json({ error: "Number is required."});
  if (persons.some(person => person.name === body.name)) return response.status(400).json({ error: "Name must be unique."});
  const person = {
    "id": getRandomNineDigitInteger(),
    "name": body.name,
    "number": body.number
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});