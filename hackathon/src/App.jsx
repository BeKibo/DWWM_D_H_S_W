import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router';
import Home from './pages/Home';
import Detection from './pages/detection';
import Header from './components/header';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detection" element={<Detection />} />
      </Routes>
       <Footer />
    </BrowserRouter>
  );
};

export default App;