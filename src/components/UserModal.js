import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, RadioGroup, Radio, Grid, Button, TextField, Checkbox, FormLabel, FormControl, FormControlLabel,Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import UploadUsers from './UploadUsers'
const useStyles = makeStyles(theme => ({
    dialog: {
        minHeight: 600
    },
    dialogTitle: {
        background: theme.palette.primary.main
    },
    margin: {
        margin: theme.spacing(1)
    },
    link:{
        color:'#000'
    }
}))
function UserModal(props) {
    const classes = useStyles();
    const initialState = {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password:'password',
        location:'0',
        isStaff: false,
        isAdmin: false,
        selfRegister:false
    }

    const [user, setUser] = useState(initialState);
    const [UserUpload, setUserUpload] = useState(false)
    
    const resetDialog=()=>{
        setUser(initialState)
    }

    const handleChange = prop => event => {
        if(prop==='isAdmin'||prop==='isStaff'){
            setUser({...user,[prop]:event.target.checked})
        }else{
            setUser({ ...user, [prop]: event.target.value });
        }
    };

    const cancel = () => {
        props.dialogClose()
    }
    const saveUser = () => {
       props.dialogSaveUser(user);
    }
    const uploadUsers = () => {
        setUserUpload(true);
    }
    const closeUserUpload = () => {
        setUserUpload(false)
    }

    return (
        <Dialog open={props.open} onEnter={resetDialog} onClose={props.dialogClose} className={classes.dialog} >
            <DialogTitle className={classes.dialogTitle}>Fill in all fields and click save to add a user. 
            Alternatively, you can upload users in a .csv by clicking <Link href="#" onClick={uploadUsers} className={classes.link}>here</Link>.</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}><FormControl fullWidth className={classes.margin}><TextField required id="firstName" label="First Name" value={user.first_name} onChange={handleChange('first_name')} /></FormControl></Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}><FormControl fullWidth className={classes.margin}><TextField required id="lastName" label="Last Name" value={user.last_name} onChange={handleChange('last_name')} ></TextField></FormControl></Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}><FormControl fullWidth className={classes.margin}><TextField required value={user.userName} label="Username" onChange={handleChange('username')} ></TextField></FormControl></Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FormControl fullWidth className={classes.margin}>
                                    <TextField id="email" value={user.email} required label="Email address" onChange={handleChange('email')} ></TextField>
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormLabel component="legend">Default Location</FormLabel>
                                    <RadioGroup aria-label="location" name="location" value={user.location} onChange={handleChange('location')}>
                                        <FormControlLabel value="0" control={<Radio />} label="St. Johns" />
                                        <FormControlLabel value="1" control={<Radio />} label="Good Neightbours" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox onChange={handleChange('isStaff')} value={user.isStaff} />
                                    }
                                    label="Staff"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox onChange={handleChange('isAdmin')} value={user.isAdmin} />
                                    }
                                    label="Admin"
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
                <UploadUsers open={UserUpload} dialogClose={closeUserUpload}></UploadUsers>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel}>Cancel</Button>
                <Button onClick={saveUser}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
export default UserModal;
