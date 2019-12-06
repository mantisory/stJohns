import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles, useTheme } from "@material-ui/core/styles";
import DataMethods from "../utils/data";
import propTypes from 'prop-types';

const styles = theme => ({
    error:{
        fontWeight:400,
        color:'#DC143C'
    },
    success:{
        fontWeight:400,
        color:'#1ABD3B'
    }
})
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      errorMessage: "",
      successMessage:""
    };
  }
  handleClick = () => {
    const payload = {
      email: this.state.email,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      password: this.state.password
    };

    DataMethods.userRegister(payload).then(result => {
      if (result.data.code == 301) {
        this.setState({
          errorMessage:
            "This email already exists in the system, but the email is unvalidated "
        });
      } else if (result.data.code == 302) {
        this.setState({
            errorMessage:
              "This email already exists in the system. Would you like to reset your password? "
          });
      } else if (result.data.code == 303) {
          this.setState({errorMessage:"", successMessage:"Your account has been registered. Please check your email to validate your account."})
      }
    });
  };
  setValue(event, value) {
    this.setState({ [value]: event.target.value });
  }
  render() {
    //   const classes = useTheme();
    const classes = this.props.classes;
    return (
      <div>
        <TextField
          helperText="Enter your First Name"
          label="First Name"
          onChange={event => this.setValue(event, "first_name")}
        />
        <br />
        <TextField
          helperText="Enter your Last Name"
          label="Last Name"
          onChange={event => this.setValue(event, "last_name")}
        />
        <br />
        <TextField
          helperText="Enter your Email"
          type="email"
          label="Email"
          onChange={event => this.setValue(event, "email")}
        />
        <br />
        <TextField
          type="password"
          helperText="Enter your Password"
          label="Password"
          onChange={event => this.setValue(event, "password")}
        />
        <br />
        <Button onClick={event => this.handleClick(event)}>Submit</Button>
        <span className={classes.error}>{this.state.errorMessage}</span>
        <span className={classes.success}>{this.state.successMessage}</span>
      </div>
    );
  }
}
Register.propTypes = {
    classes: propTypes.object.isRequired
  };
export default withStyles(styles)(Register);