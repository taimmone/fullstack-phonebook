const Filter = ({ filter, handleInput }) => {
  return <input name="filter" value={filter} onChange={handleInput} />;
};

export default Filter;
