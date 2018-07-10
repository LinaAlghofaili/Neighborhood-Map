import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import Screen from './Screen';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Screen} />
      </div>
    );
  }
}

export default App;