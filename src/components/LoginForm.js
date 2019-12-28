import React, { Component } from "react";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import propTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import dataMethods from "../utils/data";
import { connect } from "react-redux";
import { login } from "../actions/login";
const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  content: {
    margin: "0 auto",
    paddingTop: 150,
    position: "relative"
  },
  instructions: {
    fontWeight: 500
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
  }
});

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLoading: false,
      errorMessage: "",
      redirectToReferrer: false
    };
  }

  handleClick(event) {
    const payload = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.login(payload).then(result => {
      switch (result) {
        case 200:
          this.setState({ redirectToReferrer: true });
          break;
        case 204:
          break;
        case "default":
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
        <div className={classes.content}>
          {/* <AppBar title="Login"></AppBar> */}
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.instructions}>
                Please enter your username and password.
              </Typography>
              <Typography className={classes.instructions}>
                If you do not have an account, click the 'register' button
                below.
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs />
            <Grid item xs={6}>
              <TextField
                label="UserName:"
                onChange={event => this.setValue(event, "username")}
              />
            </Grid>
            <Grid item xs />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs />
            <Grid item xs={6}>
              <TextField
                label="Password:"
                onChange={event => this.setValue(event, "password")}
              />
            </Grid>
            <Grid item xs />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs />
            <Grid item xs={6}>
              <Button label="Submit" onClick={event => this.handleClick(event)}>
                Log In
              </Button>
            </Grid>
            <Grid item xs />
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs />
            <Grid item xs={6}>
              <Link to="/Register">
                <Button>Register</Button>
              </Link>
            </Grid>
            <Grid item xs />
          </Grid>
        </div>
      </div>
    );
  }
}
LoginForm.propTypes = {
  classes: propTypes.object.isRequired,
  login: propTypes.func.isRequired
};
export default connect(null, { login })(withStyles(styles)(LoginForm));
