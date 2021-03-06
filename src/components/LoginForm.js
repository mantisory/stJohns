import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import propTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { login } from "../actions/login";
const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    content: {
        margin: "0 auto",
        paddingTop: 50,
        position: "relative"
    },
    instructions: {
        fontWeight: 500,
        marginBottom:30,
        textAlign:'left'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
    },
    dense: {
        marginTop: 19
    },
    menu: {
        width: 200
    },
    header: {
        background: theme.palette.primary.main,
        height: 50
    },
    errorHidden: {
        visibility: 'hidden'
    },
    errorVisible: {
        color: 'red',
        visibility: 'visible'
    },
    buttonContainer:{
        marginTop:30
    },
    link:{textDecoration:'none'}
});

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            isLoading: false,
            errorMessage: "",
            userNameError: false,
            passwordError: false,
            emailUnvalidatedError: false,
            redirectToReferrer: false
        };
    }

    handleClick(event) {
        event.preventDefault();

        const payload = {
            username: this.state.username,
            password: this.state.password
        };

        this.props.login(payload).then(result => {
            switch (result) {
                case 200:
                    this.setState({ redirectToReferrer: true });
                    break;
                case 309:
                    this.setState({ userNameError: true, emailUnvalidatedError: false, passwordError: false, errorMessage: this.props.error.error })
                    break;
                case 308:
                    this.setState({ userNameError: false, emailUnvalidatedError: true, passwordError: false, errorMessage: this.props.error.error })
                    break;
                case 307:
                    this.setState({ userNameError: false, emailUnvalidatedError: false, passwordError: true, errorMessage: this.props.error.error })
                    break;
                default:
                    break;
            }
        });
    }

    setValue(event, value) {
        this.setState({ [value]: event.target.value });
    }
    render() {
        const classes = this.props.classes;
        const { from } = this.props.location.state || { from: { pathname: "/" } };

        if (this.state.redirectToReferrer === true) {
            return <Redirect to={from} />;
        }
        return (
            <div>
                <Grid container className={classes.header}>

                </Grid>
                <div className={classes.content}>
                    {/* <AppBar title="Login"></AppBar> */}
                    <Grid container>
                        <Grid item xs={4}/>
                        
                        <Grid item xs={4}>
                            <Typography variant="h6" className={classes.instructions}>
                                Please enter your username and password, and click the "Login" button below. 
                                If you do not have an account, please contact St. John's directly.
                            </Typography>
                        </Grid>
                        <Grid item xs={4}/>
                    </Grid>
                    <form onSubmit={event => this.handleClick(event)}>
                        <Grid container spacing={3}>
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    label="UserName:"
                                    onChange={event => this.setValue(event, "username")}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Typography className={this.state.userNameError ? classes.errorVisible : classes.errorHidden}>{this.state.errorMessage}</Typography>
                            </Grid>
                            <Grid item xs={2} />
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <TextField fullWidth
                                    label="Password:"
                                    type="password"
                                    onChange={event => this.setValue(event, "password")}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Typography className={this.state.passwordError ? classes.errorVisible : classes.errorHidden}>{this.state.errorMessage}. Click <Link to="/passwordReset">here</Link>  to reset it.</Typography>
                            </Grid>
                            <Grid item xs={2} />
                        </Grid>
                        <Grid container>
                            <Grid item xs={4} />
                            <Grid item xs={4}><Typography className={this.state.emailUnvalidatedError ? classes.errorVisible : classes.errorHidden}>{this.state.errorMessage}</Typography></Grid>
                            <Grid item xs={4} />
                        </Grid>
                        <Grid container spacing={3} className={classes.buttonContainer}>
                            <Grid item xs={7}/>
                            
                            <Grid item xs={1}>
                                <Button label="Submit" type="submit">
                                    Log In
                                </Button>
                            </Grid>
                            {/* <Grid item xs={1} >
                                <Link to="/Register" className={classes.link}>
                                    <Button>Register</Button>
                                </Link>
                            </Grid> */}
                            <Grid item xs={4}/>
                        </Grid>
                    </form>
                </div>
            </div>
        );
    }
}
LoginForm.propTypes = {
    classes: propTypes.object.isRequired,
    login: propTypes.func.isRequired
};
const mapStateToProps = state => {
    return {
        error: state.auth.error
    };
};
export default connect(mapStateToProps, { login })(withStyles(styles)(LoginForm));
