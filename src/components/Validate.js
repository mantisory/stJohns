import React from 'react'
import {
    BrowserRouter as Router,
    Link,
    useLocation
  } from "react-router-dom";
import DataMethods from '../utils/data'
import {makeStyles, withTheme} from '@material-ui/core'

const useStyles = makeStyles(theme=>({
    emailValidated:{display:'block'},
    emailUnvalidated:{display:'none'}
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
   
    DataMethods.emailValidate(payload).then(result=>{
if(result.data.code = 200){
    setEmailValidated(true);
    setMessage('Your email has been validated. Click <a href="/loginForm">here</a> to login.')
}else{
setMessage("Your email has not been validated.")
}
   });
    
    return (
        <div>
            <Link to="/LoginForm" className={emailValidated?classes.emailValidated:classes.emailUnvalidated}>Click here to log in.</Link>
        </div>
    )
}
export default withTheme(Validate);