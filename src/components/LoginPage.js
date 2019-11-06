import React, { Component } from 'react';
import propTypes from 'prop-types';
import LoginForm from './LoginForm';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
    //   padding: theme.spacing(2),
    },
  });

 class LoginPage extends Component {
    render() {
        const classes = styles();
        console.log(classes.root)
        return (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LoginForm/>
                    </Grid>
                </Grid>
        )
    }
}
LoginPage.propTypes = {
    classes: propTypes.object.isRequired
  };
  export default withStyles(styles)(LoginPage);