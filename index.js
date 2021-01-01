require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

const Person = require('./models/person');

morgan.token('person', (req, res) => JSON.stringify(req.body));
app.use(morgan('tiny', { skip: (req, res) => req.method === 'POST' }));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :person', {
    skip: (req, res) => req.method !== 'POST',
  })
);

app.get('/info', (request, response) => {
  const info = `Phonebook has info for ${persons.length} people`;
  const time = new Date();
  response.send(`<p>${info}</p><p>${time.toString()}</p>`);
});

app.get('/api/persons', (request, response) =>
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => console.log(error.message))
);

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  if (!name || !number) return response.status(400).json({ error: 'name or number missing' });

  new Person({ name, number }).save().then(savedPerson => response.json(savedPerson));
});

app.get('/api/persons/:id', (request, response) =>
  Person.findById(request.params.id)
    .then(person => response.json(person))
    .catch(error => console.log(error.message))
);

app.delete('/api/persons/:id', (request, response) =>
  response.status(400).json({ error: 'Deletion not implemented' })
);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
