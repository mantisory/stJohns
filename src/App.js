import React, { useEffect } from 'react';
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
import ChangePassword from './components/ChangePassword';
import Admin from './components/Admin';
import dataMethods from './utils/data'
import { connect } from 'react-redux';
import { renewSession } from './actions/login'

const theme = createMuiTheme({
    typography: {
        fontFamily: ['garamond-premier-pro', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
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
            light: '#ffffff',
            main: '#e2d8ce',
            dark: '#b0a79d',
            contrastText: '#000',
            background: 'red'
        },
        secondary: {
            light: '#ffedec',
            main: '#963d30',
            dark: '#630e08',
            contrastText: '#000'
        },
        error: {
            light: '#f7acac',
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
                width: '100%',
            },
        },
        MuiButton: {
            root: {
                border: '1px solid #630e09'
            },
            textPrimary: {
                background: '#e2d8ce',
                color: '#00363a'
            }
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
const AdminRoute = ({ component: Component, User, ...rest }) => (
    <Route {...rest} render={(props) => (
        dataMethods.isAuthenticated() && User.isAdmin
            ? <Component {...props} />
            : <Redirect to='/LoginForm' />
    )} />
)
function App(props) {
    useEffect(() => {
        const userCookie = Cookies.get('stJohnsCookie');
        if (userCookie) {
            props.renewSession(JSON.parse(userCookie))
        }
    }, [props.auth])

    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <Router>
                    <PrivateRoute exact path="/" component={Dashboard} />
                    {props.state.auth.user &&
                        <AdminRoute exact path="/Admin" component={Admin} User={props.state.auth.user} />
                    }

                    <Route path="/LoginForm" component={LoginForm} />
                    <Route path="/Register" component={Register} />
                    <Route path="/Validate" component={Validate} />
                    <Route path="/PasswordReset" component={PasswordReset} />
                    <Route path="/ChangePassword" component={ChangePassword} />
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

export default connect(mapStateToProps, { renewSession })(App);
