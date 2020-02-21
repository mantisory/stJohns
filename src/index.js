import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import {  BrowserRouter as Router} from 'react-router-dom';
import rootReducer from './rootReducer'

const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
   );
    
    const routing = (
        <Provider store={store}>
        <Router>
          <div>
              <App/>
          </div>
        </Router>
        </Provider>
      )
ReactDOM.render(routing, document.getElementById('root'));

serviceWorker.unregister();
