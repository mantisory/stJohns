import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, FormControl, FormControlLabel, InputAdornment, IconButton, Button, Dialog, InputLabel, Select, MenuItem, Input } from '@material-ui/core'
import MuiPhoneNumber from "material-ui-phone-number";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import DataMethods from '../utils/data'

const useStyles = makeStyles(theme => ({
    dialog: { background: 'transparent', overflowX: 'hidden' },
    container: {
        minHeight: 500,
    },
    header: {
        background: theme.palette.primary.main,
        padding: 10,
        top: 0,
        left: 0,
        maxHeight: 50,
        position: 'absolute',
        width: '100%',
        borderBottom: '1px solid #000'
    },
    formContainer: {
        position: 'absolute',
        top: 70,
        height: '80%',
        alignContent: 'flex-start'
    },
    changePasswordContainer: {
        position: 'relative',
        bottom: 0
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderTop: '1px solid #000',
        width: '100%',
        padding: 10,
        background: theme.palette.primary.main,
        flexFlow: 'row-reverse'
    },
    formControl: {
        minWidth: 300,
        marginBottom: 10,
        paddingLeft: 20,
        "& label": {
            paddingLeft: 20
        }
    },
    error: {
        color: theme.palette.error.main,
        fontSize: 14
    }
}))
export default function UserProfileDialog(props) {
    const classes = useStyles();
    const user = useSelector(state => state.auth.user)
    const [state, setState] = useState({
        defaultLocation: user.defaultLocation,
        email: user.email,
        emailError: false,
        emailErrorText: 'Invalid email address.',
        phone: user.phone,
        oldPassword: '',
        showOldPassword: false,
        oldPasswordError: false,
        oldPasswordErrorText: 'Value does not match our records.',
        newPassword: '',
        newPasswordConfirm: '',
        newPasswordConfirmError: false,
        newPasswordConfirmErrorText: 'Passwords do not match.',
        formInvalid: true,
        formDirty: false
    })
    const handleChange = prop => event => {
        setState({ ...state, [prop]: event.target.value, formDirty: true })
    }
    const testEmail = event => {
        setState({ ...state, emailError: !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(state.email)) })
    }
    const handleClickShowAdornment = prop => event => {
        setState({ ...state, [prop]: !state[prop] })
    }
    const handleMouseDownPassword = event => {
        event.preventDefault();
    };
    const validatePassword = event => {
        const payload = {
            email: user.email,
            password: event.target.value
        }

        DataMethods.checkPassword(payload).then(result => {
            if (result.data[0].passwordCorrect === 1) {
                setState({ ...state, oldPasswordError: false })
            } else {
                setState({ ...state, oldPasswordError: true })
            }
        })
    }
    const validateNewPasswordConfirm = event => {
        if (state.newPassword != state.newPasswordConfirm) {
            setState({ ...state, newPasswordConfirmError: true })
        } else {
            setState({ ...state, newPasswordConfirmError: false })
        }
    }
    const handlePhoneChange = value => {
        setState({ ...state, phone: value })
    }
    useEffect(() => {
        if (state.formDirty) {
            if (state.emailError || state.oldPasswordError || state.newPasswordConfirmError) {
                setState({ ...state, formInvalid: true })
            } else {
                setState({ ...state, formInvalid: false })
            }
        }
    }, [state.emailError, state.oldPasswordError, state.newPasswordConfirmError])
    return (
        <Dialog open={props.dialogOpen} onClose={props.dialogClose} className={classes.dialog} maxWidth={'sm'} fullWidth>
            <Grid container className={classes.container}>
                <Grid item xs={12} className={classes.header}>
                    <Typography variant="h6">User profile for {user.username}</Typography>
                </Grid>
                <Grid container className={classes.formContainer}>
                    <Grid container>
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="default-location-label">Your default location:</InputLabel>
                                <Select
                                    id="default-location-select"
                                    value={state.defaultLocation}
                                    onChange={handleChange('location')}

                                >
                                    <MenuItem value={1}>St. John's Mission</MenuItem>
                                    <MenuItem value={2}>Good Neighbor's Scarborough</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Grid item xs={7}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="email-label">Your email address:</InputLabel>
                            <Input
                                id="email"
                                value={state.email}
                                onChange={handleChange('email')}
                                onBlur={testEmail}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={5}>
                        {state.emailError &&
                            <Typography className={classes.error}>{state.emailErrorText}</Typography>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                            <MuiPhoneNumber name="phone" label="Phone Number" data-cy="user-phone" defaultCountry={"ca"} value={state.phone}
                                onChange={handlePhoneChange} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} className={classes.changePasswordContainer}>
                        <Grid container >
                            <Grid item xs={7}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="oldPassword-label">Old Password:</InputLabel>
                                    <Input
                                        id="oldPassword"
                                        type={state.showOldPassword ? 'text' : 'password'}
                                        value={state.oldPassword}
                                        onChange={handleChange('oldPassword')}
                                        onBlur={validatePassword}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowAdornment('showOldPassword')}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {state.showOldPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                {state.oldPasswordError &&
                                    <Typography className={classes.error}>{state.oldPasswordErrorText}</Typography>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="newPassword-label">New Password:</InputLabel>
                                    <Input
                                        id="newPassword"
                                        type={state.showNewPassword ? 'text' : 'password'}
                                        value={state.newPassword}
                                        onChange={handleChange('newPassword')}
                                        onBlur={validateNewPasswordConfirm}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowAdornment('showNewPassword')}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {state.showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={7}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="newPasswordConfirm-label">Confirm New Password:</InputLabel>
                                    <Input
                                        id="newPasswordConfirm"
                                        type={state.showNewPasswordConfirm ? 'text' : 'password'}
                                        value={state.newPasswordConfirm}
                                        onChange={handleChange('newPasswordConfirm')}
                                        onBlur={validateNewPasswordConfirm}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowAdornment('showNewPasswordConfirm')}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {state.showNewPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                {state.newPasswordConfirmError &&
                                    <Typography className={classes.error}>{state.newPasswordConfirmErrorText}</Typography>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container className={classes.footer}>
                    <Grid item xs={3}>
                        <Button onClick={() => props.dialogClose()}>Close</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => props.dialogClose()} disabled={state.formInvalid}>Save</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    )
}
