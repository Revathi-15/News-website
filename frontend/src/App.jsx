import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/Homepage';
// import WeatherApp from './components/Weather-Forecast/WeatherApp';
import AddNote from './components/Add_note/Note.jsx';
import BotAi from './components/bot/Bot_ai.jsx';

import './App.css';

function App() {
  return (
    <Router> 
      <div className="App">
        <Routes> 
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/weather" element={<WeatherApp />} />  */}
          <Route path="/add-note" element={<AddNote />} />
          <Route path="/bot" element={<BotAi />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;