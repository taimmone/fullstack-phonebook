import React, { useEffect, useState } from 'react';

import phonebookService from './services/phonebookService';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: '', number: '' });
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then(data => setPersons(data));
  }, []);

  const createNotification = (message, error = false) => {
    setNotification({ message, error });
    setTimeout(() => setNotification(null), 5000);
  };

  const addPerson = event => {
    event.preventDefault();
    const existingPerson = persons.find(({ name }) => name === newPerson.name);

    if (existingPerson && existingPerson.number !== newPerson.number) {
      window.alert(`${newPerson.name} is already added to phonebook`);
      // TODO: Requires backend functionality for updating persons
      // window.confirm(
      //   `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
      // ) &&
      //   phonebookService
      //     .update(existingPerson.id, newPerson)
      //     .then(updatedPerson => {
      //       setPersons(
      //         persons.map(person => (person.id !== existingPerson.id ? person : updatedPerson))
      //       );
      //       createNotification(`Updated ${newPerson.name}`);
      //     })
      //     .catch(err => {
      //       createNotification(
      //         `Information of ${newPerson.name} has already been removed from server`,
      //         true
      //       );
      //       setPersons(persons.filter(person => person.id !== existingPerson.id));;
      //     });
    } else {
      phonebookService.create(newPerson).then(createdPerson => {
        setPersons([...persons, createdPerson]);
        createNotification(`Added ${newPerson.name}`);
      });
    }

    setNewPerson({ name: '', number: '' });
  };

  const deletePerson = id => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id)?.name}?`))
      phonebookService.remove(id).then(setPersons(persons.filter(person => person.id !== id)));
  };

  const handleFilterInput = event => setFilter(event.target.value);
  const handlePersonInput = ({ target: { name, value } }) =>
    setNewPerson({ ...newPerson, [name]: value });

  return (
    <div>
      <h1>Phonebook</h1>
      {notification && <Notification message={notification?.message} error={notification?.error} />}
      <h2>Filter numbers</h2>
      <Filter filter={filter} handleInput={handleFilterInput} />
      <h2>Add a new</h2>
      <PersonForm newPerson={newPerson} handleInput={handlePersonInput} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
