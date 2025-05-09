import { useEffect, useState } from 'react';
import './css/App.css';
import { Routes, Route } from 'react-router-dom';
import Logbook from './Components/Logbook.jsx';
import Login from './Components/Login.jsx';
import Auth from './Components/Auth.jsx';
import MobileGraphView from './Components/Visualisations/MobileGraphView.jsx';
import DummyLogIn from './Components/DummyLogIn.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/logbook" element={<Logbook />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dummylogin" element={<DummyLogIn />} />
            <Route path="/graph" element={<MobileGraphView/>}/>
        </Routes>
    );
}

export default App;