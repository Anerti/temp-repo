import './App.css'
import React, { useEffect, useState } from 'react';

export default function GetCharacters() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/characters')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/characters/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData(prev => prev.filter(char => char.id !== id));
      } else {
        console.error('Failed to delete character');
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };
  return (
    <div className='container'>
      <SearchById />
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Real name</th>
            <th>Universe</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((character, index) => (
              <tr key={index}>
                <td>{character.id}</td>
                <td>{character.name}</td>
                <td>{character.realName}</td>
                <td>{character.universe}</td>
                <td className='option'>
                  <button className='delete' onClick={() => handleDelete(character.id)}>Delete</button> <button className='edit'>Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


function SearchById() {
  const [value, setValue] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  fetch(`http://localhost:8080/characters/${value}`)
    .then((res) => {
      setStatus(res.status); 
      if (!res.ok) {
        throw new Error(`Erreur HTTP : ${res.status}`);
      }
      return res.json();
    })
    .then((data) => setData(data))
    .catch((error) => {
      console.error("Error fetching data:", error);
      setData(null);
    });
};


  return (
    <div>
      <form onSubmit={handleSubmit} className="search">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Search by ID..."
          id="user-input"
        />
        <button type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" fill="#242424">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99 L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"/>
          </svg>

        </button>
      </form>
      {status === 200 && data ? ( 
        <div className="result">
          <p>{data.name}</p>
          <p>{data.realName}</p>
          <p>{data.universe}</p>
        </div>
      ) : status && status !== 200 ? (
        <p>Id invalide</p>
      ): null}
    </div>
  );
}





