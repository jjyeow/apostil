import React from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import CoverPage from './pages/CoverPage'
import SignUpPage from './pages/SignUpPage'


function App() {
  return (
      <div>
        <Route exact path="/" component={CoverPage} />
        <Route exact path="/signup" component={SignUpPage} />
      </div>
  );
}

export default App;
