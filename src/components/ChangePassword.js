import React, { useState, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, FormControl, Typography, TextField } from '@material-ui/core'
import DataMethods from '../utils/data';
import classNames from 'classnames'

const useStyles = makeStyles(theme => ({

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
        marginBottom: 50
    },
    header: {
        background: theme.palette.primary.main,
        height: 50
    },
    error: {
        color: theme.palette.error.dark
    },
    formElementContainer: {
        alignItems: 'flex-end'
    },
    submitButtonContainer: {
        marginTop: 50
    },
    passwordChanged:{
        color: theme.palette.primary.contrastText,
        textAlign:'left',
        marginTop:30
    }
}))

function ChangePassword() {
    const classes = useStyles();
    const [state, setState] = useState({
        oldPassword: '',
        oldPasswordError: false,
        newPassword: '',
        newPasswordConfirm: '',
        passwordTooShort: false,
        passwordsDontMatch: false,
        email: '',
        emailDoesntExist: false,
        emailInvalid: false,
        formInvalid: true,
        passwordChangeSuccess:false,
        stateSwitch:false
    });
    const oldPasswordEL = useRef()
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const handleChange = prop => event => {
        setState({ ...state, [prop]: event.target.value});
    };
   
    const blurNewPassword = () => {
        if (state.newPassword.length < 8 && state.newPassword.length > 0) {
            setState({ ...state, passwordTooShort: true,stateSwitch:!state.stateSwitch });
        } else {
            setState({ ...state, passwordTooShort: false,stateSwitch:!state.stateSwitch })
        }
        if(state.newPasswordConfirm.length>0){
            if (state.newPassword != state.newPasswordConfirm) {
                setState({ ...state, passwordsDontMatch: true,stateSwitch:!state.stateSwitch})
            }
        }
    }
    const blurNewPasswordConfirm = () => {
        if (state.newPassword != state.newPasswordConfirm) {
            setState({ ...state, passwordsDontMatch: true,stateSwitch:!state.stateSwitch})
        } else {
            setState({ ...state, passwordsDontMatch: false,stateSwitch:!state.stateSwitch})
        }
    }
    const blurEmail = () => {
        if (state.email.length > 0 && emailRegex.test(state.email) == false) {
            setState({ ...state, emailInvalid: true,stateSwitch:!state.stateSwitch});
            return;
        } else if (state.email.length > 0) setState({ ...state, emailInvalid: false,stateSwitch:!state.stateSwitch});
    }

    useEffect(() => {
        
            if (state.emailInvalid || state.passwordTooShort || state.passwordsDontMatch || state.emailDoesntExist) {
                setState({ ...state, formInvalid: true })
            }else if(state.email.length>0 && state.newPassword.length>7 && state.newPasswordConfirm.length>7){
                setState({ ...state, formInvalid: false })
            }
    }, [state.stateSwitch])

    // useEffect(()=>{

    // })
    const saveNewPassword = () => {
        DataMethods.changePassword({ password: state.newPassword, email: state.email })
            .then(results => {
                if (results.data.code == 202) {
                    setState({...state, passwordChangeSuccess:true})
                }
            })
    }
    return (
        <div>
            <Grid container className={classes.header}></Grid>
            <Grid container className={classes.content}>
                <Grid item xs={12} >
                    <Typography className={classes.instructions}>Please enter all fields below and click sumbit to change your password.</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={4} />
                        <Grid item xs={7} >
                            <form>
                                <Grid container className={classes.formElementContainer}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth className={classes.margin}>
                                            <TextField id="email" value={state.email} onBlur={blurEmail} required label="Email address" onChange={handleChange('email')} ></TextField>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {state.emailInvalid &&
                                            <Typography className={classes.error}>email invalid</Typography>
                                        }
                                        {state.emailDoesntExist &&
                                            <Typography className={classes.error}>email doesn't exist</Typography>
                                        }
                                    </Grid>
                                </Grid>

                                {/* <Grid container className={classes.formElementContainer}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth className={classes.margin}>
                                            <TextField id="oldPassword" type="password" ref={oldPasswordEL} onBlur={blurNewPassword} error={state.oldPasswordError} value={state.oldPassword} required label="Old password" onBlur={checkOldPassword} onChange={handleChange('oldPassword')} ></TextField>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {state.oldPasswordError &&
                                            <Typography className={classes.error}>Old password incorrect</Typography>
                                        }
                                    </Grid>
                                </Grid> */}
                                <Grid container className={classes.formElementContainer}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth className={classes.margin}>
                                            <TextField id="newPassword" type="password" value={state.newPassword} onBlur={blurNewPassword} required label="New password" onChange={handleChange('newPassword')} ></TextField>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {state.passwordTooShort &&
                                            <Typography className={classes.error}>Password must be at least 8 characters.</Typography>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.formElementContainer}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth className={classes.margin}>
                                            <TextField id="newPasswordConfirm" type="password" value={state.newPasswordConfirm} onBlur={blurNewPasswordConfirm} required label="Confirm new password" onChange={handleChange('newPasswordConfirm')} ></TextField>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {state.passwordsDontMatch &&
                                            <Typography className={classes.error}>Passwords don't match.</Typography>
                                        }
                                    </Grid>
                                </Grid>


                                <Grid container className={classes.formElementContainer}>
                                    <Grid item xs={12}>
                                        {state.passwordChangeSuccess &&
                                        <Typography className={classes.passwordChanged}>
                                            Your password has been changed. Click <a href="/LoginForm">here</a> to log in
                                        </Typography>
                                        }
                                         
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.formElementContainer}>
                                    <Grid item xs={6} className={classes.submitButtonContainer}>
                                        <Button color="secondary" disabled={state.formInvalid} onClick={saveNewPassword}>Save Password</Button>
                                    </Grid>
                                    <Grid item xs={6}/>
                                </Grid>

                            </form>
                        </Grid>

                        <Grid item xs={1} />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default ChangePassword;