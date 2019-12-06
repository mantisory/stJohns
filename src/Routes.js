import React from 'react';
// import {Route} from 'react-router';
import {BrowserRouter, Route} from 'react-router-dom';
import App from './App';
// import SignUpPage from './components/SignUpPage'
// import hello from './components/Hello'
import LoginForm from './components/LoginForm'
import Register from './components/Register'

export default(
    <BrowserRouter>
        <div>
            <Route  path="/" component={App}/>
            <Route path={"/LoginForm"} component={LoginForm}/>
            <Route path={"/Register"} component={Register}/>
        </div>
    </BrowserRouter>
)