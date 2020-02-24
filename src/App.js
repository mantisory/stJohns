import React,{useEffect} from 'react';
import Cookies from "js-cookie";
import propTypes from 'prop-types'
import './App.css';
import Dashboard from './components/Dashboard.jsx';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
    BrowserRouter as Router,
  Route, 
  Redirect,
  } from "react-router-dom";
  import LoginForm from './components/LoginForm'
  import Register from './components/Register'
  import Validate from './components/Validate'
  import PasswordReset from './components/PasswordReset';
  import Admin from './components/Admin';
  import dataMethods from './utils/data'
  import {connect} from 'react-redux';
  import {renewSession} from './actions/login'
import passwordReset from './components/PasswordReset';

const theme = createMuiTheme({
    typography:{
        fontFamily:['garamond-premier-pro', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
    },
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
        main: '#c89f70',
        dark: '#00363a',
        contrastText: '#000'
      },
      secondary: {
        light: '#ffb04c',
        main: '#f57f17',
        dark: '#bc5100',
        contrastText: '#000'
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
      },
    },
    overrides: {
        MuiInput: {
            root: {
                width:'100%',
            },
        }
    } 
});

const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            dataMethods.isAuthenticated() === true
                ? <Component {...props} />
            : <Redirect to='/LoginForm' />
    )} />
)
const AdminRoute = ({ component: Component,User, ...rest }) => (
    <Route {...rest} render={(props) => (
        dataMethods.isAuthenticated() && User.isAdmin
            ? <Component {...props} />
        : <Redirect to='/LoginForm' />
)} />
)
function App(props) {
   useEffect(() => {
    const userCookie = Cookies.get('stJohnsCookie');
    console.log(dataMethods.isAuthenticated())
    if(userCookie){
        props.renewSession(JSON.parse(userCookie))
    }
   }, [props.auth])

  return (
    <MuiThemeProvider theme={theme}>
       <div className="App"> 
            <Router>
                <PrivateRoute exact path="/" component={Dashboard}/>
                {props.state.auth.user && 
                    <AdminRoute exact path="/Admin" component={Admin} User={props.state.auth.user}/>
                }

                <Route path="/LoginForm" component={LoginForm} />
                <Route path="/Register" component={Register} />
                <Route path="/Validate" component={Validate} />
                <Route path="/PasswordReset" component={PasswordReset} />
            </Router>
        </div>

    </MuiThemeProvider>
  );
}
App.propTypes = {
    renewSession: propTypes.func.isRequired
}
const mapStateToProps = state => {
    return {
      state: state
    };
  };

export default connect(mapStateToProps, {renewSession}) (App);
