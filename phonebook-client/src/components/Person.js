const Person = ({ person: { name, number }, handleClick }) => (
  <li>
    <span>
      {name} {number}
    </span>
    <button onClick={handleClick}>delete</button>
  </li>
);

export default Person;
