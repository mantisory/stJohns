import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

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
        light: 'rgba(129, 156, 169, 1)',
        main: 'rgba(84, 110, 122, 1)',
        dark: 'rgba(41, 67, 78, 1)',
        contrastText: '#fff'
      },
      secondary: {
        light: '#efefef',
        main: '#bdbdbd',
        dark: '#8d8d8d',
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
function App() {
  return (
    <MuiThemeProvider theme={theme}>
       
        <div className="App">
            <Dashboard/>
        </div>
    </MuiThemeProvider>
  );
}

export default App;
