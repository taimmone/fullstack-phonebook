const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

morgan.token('person', (req, res) => JSON.stringify(req.body));
app.use(morgan('tiny', { skip: (req, res) => req.method === 'POST' }));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :person', {
    skip: (req, res) => req.method !== 'POST',
  })
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
});

app.get('/info', (request, response) => {
  const info = `Phonebook has info for ${persons.length} people`;
  const time = new Date();
  response.send(`<p>${info}</p><p>${time.toString()}</p>`);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' });
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name already exists' });
  }

  const person = { ...body, id: Math.floor(Math.random() * Math.floor(100000)) };
  response.json(person);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (!person) return response.status(404).end();
  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
