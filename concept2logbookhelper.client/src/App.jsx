import { useEffect, useState } from 'react';
import './css/App.css';
import { Routes, Route } from 'react-router-dom';
import Logbook from './Components/Logbook.jsx';
import Login from './Components/Login.jsx';
import Auth from './Components/Auth';

function App() {

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/logbook" element={<Logbook />} />
            <Route path="/auth" element={<Auth />} />
        </Routes>
    );
}

export default App;