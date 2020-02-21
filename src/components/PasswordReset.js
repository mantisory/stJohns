import React from "react";
import { Link, Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import propTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormLabel from '@material-ui/core/FormLabel'
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
    paddingTop: 100,
    position: "relative"
  },
  instructions: {
    fontWeight: 500,
    marginBottom:50
  },
  header: {
    background: theme.palette.primary.main,
    height: 50
  }
});

function PasswordReset(props) {
     const {classes} = props

  return (
    <div>
      <Grid container className={classes.header}></Grid>
      <div className={classes.content}>
        <Grid container>
          <Grid item xs={12}>
            <Typography className={classes.instructions}>Please enter your email or username below and click the 'Submit' button to receive instructions in your email.</Typography>
          </Grid>
          <Grid item xs={12}>
              <Grid container>
                  <Grid item xs={4}/>
                  <Grid item xs={4}>
                      <Grid container>
                      <Grid item xs={1}><FormLabel>email/username:</FormLabel></Grid>
                      <Grid item xs={11}><TextField></TextField></Grid>
                      </Grid>
                  </Grid>
                  <Grid item xs={4}/>
              </Grid>
          </Grid>
          <Grid item xs={12}>
              <Grid container>
                  <Grid item xs={4}/>
                  <Grid item xs={4}>
                      <Button>Submit</Button>
                  </Grid>
                  <Grid item xs={4}/>
              </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default withStyles(styles)(PasswordReset);
