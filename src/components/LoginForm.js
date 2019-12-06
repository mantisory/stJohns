import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation,
  useHistory
} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import propTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import dataMethods from "../utils/data";
import Axios from "axios";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
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
      userName: "",
      password: "",
      isLoading: false,
      errorMessage: "",
      redirectToReferrer:false
    };
  }

  // signup = (res, type) => {
  //     switch(type){
  //         case "facebook":
  //         //    dataMethods.signUp()
  //             break;
  //         case 'google':
  //            console.log(res)
  //         //    const {body} = res.w3;
  //         //    console.log(body)
  //             dataMethods.signUpOrLogin(res.w3.ig, res.w3.U3,'google',res.w3.Eea, res.w3.Paa, res.tokenObj.id_token);
  //             break;

  //     }
  // }
  handleRegister(event) {
    // const apiBaseUrl = "http://localhost:5000/";
  }
  handleClick(event) {
    const apiBaseUrl = "http://localhost:5000/";

    const payload = {
      userName: this.state.userName,
      password: this.state.password
    };

    dataMethods.userLogin(payload).then(result => {
        console.log(result)
      switch(result){
          case 200:
           
              this.setState({redirectToReferrer:true})
              break;
        case 204:
                console.log('whoops')
                break;
                case "default":
                    console.log('default')
      }
    });
  }

  setValue(event, value) {
    this.setState({ [value]: event.target.value });
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    // console.log(this.state.redirectToReferrer, from)
    if (this.state.redirectToReferrer === true) {
        return <Redirect to={from} />
      }
    return (
      <div>
        <div>
          <AppBar title="Login"></AppBar>
          <Grid container spacing={3}>
            <Grid item xs />
            <Grid item xs={6}>
              <TextField
                label="UserName:"
                onChange={event => this.setValue(event, "userName")}
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
                <Button
                  label="Submit"
                  onClick={event => this.handleRegister(event)}
                >
                  Register
                </Button>
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
  classes: propTypes.object.isRequired
};
export default withStyles(styles)(LoginForm);
