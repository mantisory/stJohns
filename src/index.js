import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import {  BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation} from 'react-router-dom';
import LoginForm from './components/LoginForm'
import Register from './components/Register'
import Validate from './components/Validate'
import routes from './Routes';
import DataMethods from './utils/data'
import rootReducer from './rootReducer'

const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
   );
        console.log('in index')

    

    const routing = (
        <Provider store={store}>
        <Router>
          <div>
              <App/>
            {/* <PrivateRoute exact path="/" component={App} />
            <Route path="/LoginForm" component={LoginForm} />
            <Route path="/Register" component={Register} />
            <Route path="/Validate" component={Validate} /> */}
            {/* <Route path="/contact" component={Contact} /> */}
          </div>
        </Router>
        </Provider>
      )
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
