import Person from './Person';

const Persons = ({ persons, filter, deletePerson }) => {
  function filterPersons() {
    return persons.filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase()));
  }

  const listPersons = () =>
    filterPersons(persons).map(person => (
      <Person key={person.id} person={person} handleClick={() => deletePerson(person.id)} />
    ));
  return <ul>{listPersons()}</ul>;
};

export default Persons;
