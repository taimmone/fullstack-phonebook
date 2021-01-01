const PersonForm = ({ newPerson, addPerson, handleInput }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input name="name" value={newPerson.name} onChange={handleInput} required />
      </div>
      <div>
        number: <input name="number" value={newPerson.number} onChange={handleInput} required />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
