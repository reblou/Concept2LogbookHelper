import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Logbook from './Components/Logbook.jsx';
import Login from './Components/Login.jsx';

function App() {

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/logbook" element={<Logbook />} />
        </Routes>
    );
}

export default App;