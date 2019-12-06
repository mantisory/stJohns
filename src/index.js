import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from "redux";
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


const store = createStore(
    (state = {}) => state,
    applyMiddleware(thunk)
    );
    // console.log('loading')
    const fakeAuth = {isAuthenticated:false}

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            DataMethods.isAuthenticated() === true
                ? <Component {...props} />
            : <Redirect to='/LoginForm' />
    )} />
)
    const routing = (
        <Router>
          <div>
            <PrivateRoute exact path="/" component={App} />
            <Route path="/LoginForm" component={LoginForm} />
            <Route path="/Register" component={Register} />
            <Route path="/Validate" component={Validate} />
            {/* <Route path="/contact" component={Contact} /> */}
          </div>
        </Router>
      )
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
