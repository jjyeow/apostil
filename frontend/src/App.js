import React from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import CoverPage from './pages/CoverPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import AddSubs from './pages/AddSubs'
import { ToastContainer } from 'react-toastify'


function App() {
  return (
      <div>
        <ToastContainer closeButton={false} autoClose={5000} style={{marginTop: '54px'}} />
        <Route exact path="/" component={CoverPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/add" component={AddSubs} />
      </div>
  );
}

export default App;
