import React from 'react';
// import {Route} from 'react-router';
import {BrowserRouter, Route} from 'react-router-dom';
import App from './App';
// import SignUpPage from './components/SignUpPage'
// import hello from './components/Hello'
import LoginPage from './components/LoginPage'

export default(
    <BrowserRouter>
        <div>
            <Route  path="/" component={App}/>
        {/* <Route path={SignUpPage} component={SignUpPage}/> */}
            <Route path={"/LoginPage"} component={LoginPage}/>
        </div>
        {/* <IndexRoute component={hello}></IndexRoute> */}
       
    </BrowserRouter>
)