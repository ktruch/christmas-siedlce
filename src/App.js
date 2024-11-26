import React, { useEffect, useState } from 'react';
import santa from './santa.jpg';
import './App.css';

function App() {
  // const initialNames = [
  //   { id: 0, name: "Kasia", draw: null , nice_name: "Droga Kasiu" },
  //   { id: 1, name: "Hubert", draw: null , nice_name: "Drogi Hubercie" },
  //   { id: 2, name: "Ola T", draw: null , nice_name: "Droga Olu" },
  //   { id: 3, name: "Aleksandra", draw: null , nice_name: "Droga Olu" },
  //   { id: 4, name: "Michał", draw: null , nice_name: "Drogi Michale" },
  //   { id: 5, name: "Aneta", draw: null , nice_name: "Droga Anetko" },
  //   { id: 6, name: "Iwona", draw: null , nice_name: "Droga Iwonko" },
  //   { id: 7, name: "Andrzej", draw: null , nice_name: "Drogi Andrzeju" },
  //   { id: 8, name: "Jula", draw: null , nice_name: "Droga Juleczko" },
  // ];

  // const initialNamesLeft = [
  //   { id: 0, name: "Kasia"},
  //   { id: 1, name: "Hubert"},
  //   { id: 2, name: "Ola T"},
  //   { id: 3, name: "Aleksandra"},
  //   { id: 4, name: "Michał"},
  //   { id: 5, name: "Aneta"},
  //   { id: 6, name: "Iwona"},
  //   { id: 7, name: "Andrzej"},
  //   { id: 8, name: "Jula"},
  // ];

  const [names, setNames] = useState([]);
  const [namesLeft, setNamesLeft] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [drawnName, setDrawnName] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/names')
      .then(response => response.json())
      .then(data => setNames(data));

    fetch('http://localhost:3000/people_left')
      .then(response => response.json())
      .then(data => setNamesLeft(data));
  }, [reload]);

  const handleSelectChange = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    const selected = names.find(name => name.id === selectedId);
    setSelectedName(selected ? selected.name : null);
  };

  const saveNames = (nameId, drawnNameId) => {
    console.log(nameId, drawnNameId);
    fetch('http://localhost:3000/draw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({nameId, drawnNameId}),
    })
      .then(response => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const draw = () => {
    if (selectedName) {
      const remainingNames = namesLeft.filter(name => name.name !== selectedName);
      const randomIndex = Math.floor(Math.random() * remainingNames.length);
      const justDrawnName = remainingNames[randomIndex].name;

      const drawnNameId = names.find(name => name.name === justDrawnName).id;
      const nameId = names.find(name => name.name === selectedName).id;

      setDrawnName(justDrawnName);
      saveNames(nameId, drawnNameId);
    } else {
      alert("Wybierz imię z listy");
    }
    setSelectedName(null);
    setShowResult(true);
    setReload(!reload);
  };

  return (
    <div className="App">
      <header className="App-header">
        {showResult ?
          <div className="result">
            <div className="drawn-name">{drawnName}</div>
            <div>To osoba której zrobisz prezent!!</div>
            <h3>ZAPAMIĘTAJ</h3>
            <p>I widzimy się w Siedlach</p>
          </div>
          :
          <div className="App-header">
            <img src={santa} className="App-logo" alt="logo" />
            <div className="list-label">Wybierz swoje imię z listy</div>
            <select className="select" value={selectedName ? selectedName.id : ""} onChange={handleSelectChange}>
              <option value="">-- Imię --</option>
              {names.filter(name => name.draw === null).map((name, index) => (
                <option key={index} value={name.id}>{name.name}</option>
              ))}
            </select>
            <button className="button" onClick={draw}>Losuj</button>
          </div>
        }
      </header>
    </div>
  );
}

export default App;