import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Logbook from './Components/Logbook.jsx';
import Login from './Components/Login.jsx';
import Authenticator from './Components/Authenticator';

function App() {

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/logbook" element={<Logbook />} />
            <Route path="/auth" element={<Authenticator />} />
        </Routes>
    );
}

export default App;