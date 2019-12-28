import React from 'react'
import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";
import dataMethods from '../utils/data'
import {makeStyles, withTheme, Grid, Typography} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    emailValidated:{display:'block', textDecoration:'none', color:theme.palette.primary.contrastText, fontWeight:'bold'},
    emailUnvalidated:{display:'none'},
    content:{
        margin: "0 auto",
        paddingTop: 150,
        position: "relative"
    }
}));

function Validate(props) {

    const [message, setMessage] = React.useState(null);
    const [emailValidated, setEmailValidated] = React.useState(false);
    const classes = useStyles();
    let params = new URLSearchParams(useLocation().search);
    
    const payload = {
        email:params.get("email"),
        verificationCode:params.get("code")
    }
   
    dataMethods.emailValidate(payload).then(result=>{
if(result.data.code = 200){
    setEmailValidated(true);
    setMessage('Your email has been validated. Click <a href="/loginForm">here</a> to login.')
}else{
setMessage("Your email has not been validated.")
}
   });
    
    return (
        <div className={classes.content}>
            <Grid>
                <Grid item xs={12}>
                    <Typography className={classes.instructions}>
                        Your email has now been validated. 
                    </Typography>
              </Grid>
          <Grid item xs={12}>
       
            <Link to="/LoginForm" className={emailValidated?classes.emailValidated:classes.emailUnvalidated}>Click here to log in.</Link>
            </Grid>
            </Grid>
        </div>
    )
}
export default withTheme(Validate);
