require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
morgan.token('person', req => JSON.stringify(req.body));
app.use(morgan('tiny', { skip: req => req.method === 'POST' || req.method === 'PUT' }));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :person', {
    skip: req => req.method !== 'POST' && req.method !== 'PUT',
  })
);

const Person = require('./models/person');
app.use(express.static('build'));

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const info = `Phonebook has info for ${persons.length} people`;
    const time = new Date();
    res.send(`<p>${info}</p><p>${time.toString()}</p>`);
  });
});

app.get('/api/persons', (req, res, next) =>
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
);

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) return res.status(400).json({ err: 'name or number missing' });

  new Person({ name, number })
    .save()
    .then(savedPerson => res.json(savedPerson))
    .catch(err => next(err));
});

app.get('/api/persons/:id', (req, res, next) =>
  Person.findById(req.params.id)
    .then(person => res.json(person))
    .catch(err => next(err))
);

app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body;
  Person.findByIdAndUpdate(req.params.id, { number }, { new: true, runValidators: true })
    .then(result => res.status(200).json(result))
    .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res, next) =>
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
);

app.use((req, res) => res.status(404).send({ err: 'unknown endpoint' }));

app.use((err, req, res, next) => {
  console.log(err.message);
  if (err.name === 'CastError') return res.status(400).send({ err: 'malformatted id' });
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
  next(err);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
