import React,{useEffect} from 'react';
import logo from './logo.svg';
import Cookies from "js-cookie";
import propTypes from 'prop-types'
import './App.css';
import Dashboard from './components/Dashboard.jsx';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
    BrowserRouter as Router,
  Switch,
  Route, 
  Redirect,
  } from "react-router-dom";
  import LoginForm from './components/LoginForm'
  import Register from './components/Register'
  import Validate from './components/Validate'
  import DataMethods from './utils/data'
  import {connect} from 'react-redux';
  import {renewSession} from './actions/login'

const theme = createMuiTheme({
    palette: {
      common: {
        black: '#000',
        white: '#fff'
      },
      background: {
        paper: '#fff',
        'default': '#fafafa'
      },
      primary: {
        light: '#428e92',
        main: '#006064',
        dark: '#00363a',
        contrastText: '#fff'
      },
      secondary: {
        light: '#ffb04c',
        main: '#f57f17',
        dark: '#bc5100',
        contrastText: '#fff'
      },
      error: {
        light: '#e57373',
        main: '#f44336',
        dark: '#d32f2f',
        contrastText: '#fff'
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)'
      }
    }
});

const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            DataMethods.isAuthenticated() === true
                ? <Component {...props} />
            : <Redirect to='/LoginForm' />
    )} />
)
  
function App(props) {
  
   useEffect(() => {
    
    const userCookie = Cookies.get('stJohnsCookie');
    // console.log(userCookie)
    if(userCookie){
        DataMethods.setIsAuthenticated(true);
        props.renewSession(JSON.parse(userCookie))
    }
       
   }, [])

  return (
    <MuiThemeProvider theme={theme}>
       {/* <PrivateRoute path="/"> */}
       <div className="App"> 
<Router>
               <PrivateRoute exact path="/" component={Dashboard}/>
               <Route path="/LoginForm" component={LoginForm} />
            <Route path="/Register" component={Register} />
            <Route path="/Validate" component={Validate} />
            </Router>
        </div>
       {/* </PrivateRoute> */}
       
    </MuiThemeProvider>
  );
}
App.propTypes = {
    renewSession: propTypes.func.isRequired
}

export default connect(null, {renewSession}) (App);
