import React, { useEffect, useState } from 'react';
import santa from './santa.jpg';
import './App.css';

function App() {

  const [names, setNames] = useState([]);
  const [namesLeft, setNamesLeft] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [drawnName, setDrawnName] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [reload, setReload] = useState(false);

  const url = 'https://christmas-backend-23r0xtw46-ktruchs-projects.vercel.app'
  useEffect(() => {
    fetch(`${url}/names`, { mode: 'no-cors' })
      .then(response => response.json())
      .then(data => setNames(data));

    fetch(`${url}/people_left`, { mode: 'no-cors' })
      .then(response => response.json())
      .then(data => setNamesLeft(data));
  }, [reload]);

  const handleSelectChange = (event) => {
    console.log("on select:" , names)
    const selectedId = parseInt(event.target.value, 10);
    const selected = names.find(name => name.id === selectedId);
    setSelectedName(selected ? selected.name : null);
    setReload(!reload);
  };

  const saveNames = (nameId, drawnNameId) => {
    console.log(nameId, drawnNameId);
    fetch(`${url}/draw?id=${nameId}&drawnId=${drawnNameId}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
      },
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
      const drawnNameId = namesLeft.find(name => name.name === justDrawnName).id;
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