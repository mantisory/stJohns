import React from 'react';
import logo from './logo.svg';
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

function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          fakeAuth.isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/LoginForm",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
  
  const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
      fakeAuth.isAuthenticated = true;
      setTimeout(cb, 100); // fake async
    },
    signout(cb) {
      fakeAuth.isAuthenticated = false;
      setTimeout(cb, 100);
    }
  };
  
function App() {
  return (
    <MuiThemeProvider theme={theme}>
       {/* <PrivateRoute path="/"> */}
       <div className="App">
       
         
               <Dashboard/>
                             
          
          
        </div>
       {/* </PrivateRoute> */}
       
    </MuiThemeProvider>
  );
}

export default App;
