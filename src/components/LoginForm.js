import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import {connect} from 'react-redux';
import login from '../actions/login.js'
const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  });

class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            userName:'',
            password:'',
            isLoading:false,
            errors:{}
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    handleChange = event => {
        this.setState({[event.target.name]:event.target.value})
    }

    onSubmit = (e) =>{
        e.preventDefault();
        this.setState({isLoading:true});
        this.props.login(this.state).then(
            (res)=>{ this.context.router.push('/')},
            (err)=>{this.setState({errors:err.data.errors,isLoading:false})}
        );
    }
    render() {
        return (
            <form>
                <Grid item xs={12}><h1>Login</h1></Grid>
                <Grid item xs={12}><TextField id="username" name="userName" label="User Name" value={this.state.firstName} required onChange={this.handleChange}/></Grid>
                <Grid item xs={12}><TextField id="password" name="password" label="Password" value={this.state.firstName} required onChange={this.handleChange}/></Grid>
                <Grid item xs={12}><Button disabled={this.state.isLoading}>Login</Button></Grid>
            </form>
        )
    }
}
LoginForm.propTypes = {
    classes: propTypes.object.isRequired,
    login:propTypes.func.isRequired
  };
LoginForm.contextTypes = {
      router:propTypes.object.isRequired
  }
  export default connect(null,{login})(withStyles(styles)(LoginForm));