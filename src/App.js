import React from 'react';
import './App.scss';
import { Provider } from 'react-redux'
import store from './store'
import { HashRouter as Router } from 'react-router-dom'
import routes from './routes'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faUsers, faUser, faPlusSquare, faPlus, faHandPointUp, faHandPointDown, faTrashAlt, faPlusCircle} from '@fortawesome/free-solid-svg-icons'

function App() {
  library.add(faUsers, faUser, faPlusSquare, faPlus, faHandPointUp, faHandPointDown, faTrashAlt, faPlusCircle)
  return (
    <Provider store={store}>
        <Router>
          {routes}
        </Router>
      </Provider>
  );
}

export default App;
