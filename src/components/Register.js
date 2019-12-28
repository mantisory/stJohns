import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { withStyles, useTheme } from "@material-ui/core/styles";
import dataMethods from "../utils/data";
import propTypes from "prop-types";
import classnames from "classnames";
const styles = theme => ({
  error: {
    fontWeight: 400,
    color: "#DC143C",
    marginTop: 5,
    textAlign:'left',
    
  },
  errorGridItem:{
    alignSelf:'center',
    paddingLeft:15
  },
  hidden: {display:'none' },
  visible: { display:'block' },
  success: {
    fontWeight: 400,
    color: "#1ABD3B"
  },
  content: {
    margin: "0 auto",
    paddingTop: 150,
    position: "relative"
  },
  instructions: {
    fontWeight: 500
  },
  formContainer:{
      width:'50%',
    margin:'0 33%'
  }
});
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      username: "",
      errorMessage: "",
      successMessage: "",
      usernameExists: false,
      emailExists: false,
      formInvalid: true,
      emailValid:1
    };
  }
  handleClick = () => {
    const payload = {
      email: this.state.email,
      username: this.state.username,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      password: this.state.password
    };

    dataMethods.userRegister(payload).then(result => {
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
        this.setState({
          errorMessage: "",
          successMessage:
            "Your account has been registered. Please check your email to validate your account."
        });
      }
    });
  };
  setValue(event, value) {
    this.setState({ [value]: event.target.value });
    this.formInvalid();
  }
  setValueBlur(event, value) {
    event.persist();
    dataMethods.checkValueExists(value, event.target.value).then(result => {
      if (result.data[0].count == 1) {
        this.setState({ [value + "Exists"]: true, formInvalid:true});
        event.target.focus();
      } else {
        this.setState({ [value + "Exists"]: false });
      }
    });
    if(value=='email'){
        if(this.validateEmail(event.target.value)){
            this.setState({emailValid:true})
        }else{
            this.setState({emailValid:false, formInvalid:true})
        }

            
    }
  }
  formInvalid = () => {
    if (
      this.state.first_name.length > 0 &&
      this.state.last_name.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.username.length > 0 
    ) {
        if(this.validateEmail(this.state.email)){
            this.setState({ formInvalid: false });
        }else{
            this.setState({formInvalid:true})
        }
        
      
    }
  };
    validateEmail = (mail) => {
       
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    }
  render() {
    //   const classes = useTheme();
    const classes = this.props.classes;
    return (
      <div className={classes.content}>
        <Grid>
          <Grid item xs={12}>
            <Typography className={classes.instructions}>
              Please enter your account details below and click the "Register"
              button. All fields are required.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={classes.formContainer} alignItems="flex-start" justify="flex-end" direction="row">
              <Grid item xs={3}>
                <TextField
                  label="Username"
                  onChange={event => this.setValue(event, "username")}
                  onBlur={event => this.setValueBlur(event, "username")}
                  value={this.state.username}
                  required
                  error={this.state.usernameExists}
                  fullWidth
                />
              </Grid>
              <Grid item xs={9}  className={classes.errorGridItem}>
                <Typography
                  className={classnames(
                    classes.error,
                    this.state.usernameExists ? classes.visible : classes.hidden
                  )}
                >
                  That username already exists. Please choose another.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container className={classes.formContainer}>
              <Grid item xs={3}>
                <TextField
                  helperText="Enter your First Name"
                  label="First Name"
                  onChange={event => this.setValue(event, "first_name")}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container className={classes.formContainer}>
              <Grid item xs={3}>
                <TextField
                  helperText="Enter your Last Name"
                  label="Last Name"
                  onChange={event => this.setValue(event, "last_name")}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container className={classes.formContainer}>
              <Grid item xs={3}>
                <TextField
                  helperText="Enter your Email"
                  type="email"
                  label="Email"
                  onChange={event => this.setValue(event, "email")}
                  onBlur={event => this.setValueBlur(event, "email")}
                  value={this.state.email}
                  required
                  error={this.state.emailExists||!this.state.emailValid}
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} className={classes.errorGridItem}>
                <Typography
                  className={classnames(
                    classes.error,
                    this.state.emailExists ? "" : classes.hidden
                  )}
                >
                  That email already exists. Please choose another.
                </Typography>
                <Typography
                  className={classnames(
                    classes.error,
                    this.state.emailValid ? classes.hidden:""
                  )}
                >
                  Not a valid email address.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container className={classes.formContainer}>
              <Grid item xs={3}>
                <TextField
                  type="password"
                  helperText="Enter your Password"
                  label="Password"
                  onChange={event => this.setValue(event, "password")}
                  required
                  fullWidth
                  type="password"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              onClick={event => this.handleClick(event)}
              disabled={this.state.formInvalid}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={12}>
            <span className={classes.error}>{this.state.errorMessage}</span>
          </Grid>
          <Grid item xs={12}>
            <span className={classes.success}>{this.state.successMessage}</span>
          </Grid>
        </Grid>
      </div>
    );
  }
}
Register.propTypes = {
  classes: propTypes.object.isRequired
};
export default withStyles(styles)(Register);
