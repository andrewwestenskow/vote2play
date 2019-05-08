import React from 'react';
import './App.scss';
import Header from './Components/Header/Header'
import { Provider } from 'react-redux'
import store from './store'
import { HashRouter as Router } from 'react-router-dom'
import routes from './routes'

function App() {
  return (
    <Provider store={store}>
        <Router>
          <Header />
          {routes}
        </Router>
      </Provider>
  );
}

export default App;
