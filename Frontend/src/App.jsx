import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactChangeTracker from './utils/ReactChangeTracker.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import ProjectView from './pages/ProjectView.jsx';

function App() {
  return (
    <Router>
    <ReactChangeTracker />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectView />} />
    </Routes>
    </Router>
  );
}

export default App
