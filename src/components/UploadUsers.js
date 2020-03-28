import React, { useState } from 'react'
import { Dialog, DialogActions, DialogContent, Grid, Input, FormControl, Typography, Button, IconButton, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { parse } from 'papaparse'
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { saveUserBatch } from '../actions/getUserData';
import DataMethods from '../utils/data'

const useStyles = makeStyles(theme => ({
    dialog: {
        minHeight: 300,
    },
    contentContainer: { minWidth: 500, width: 'auto', padding: '30px 10px 50px 10px' },
    inputFile: {
        width: 160,
        "&:-webkit-file-upload-button": {
            visibility: 'hidden'
        },
        "&:before": {
            content: '"Select users .csv file"',
            display: 'inline-block',
            textAlign: 'center',
            // background: 'linear-gradient(top, #f9f9f9, #e3e3e3)',
            background: '#fff',
            border: '1px solid #000',
            borderRadius: 5,
            padding: '5px 8px',
            outline: 'none',
            whiteSpace: 'nowrap',
            '-webkit-user-select': 'none',
            cursor: 'pointer'
        },
        marginBottom: 20

    },
    userTable: { border: '1px solid black', padding: '0 10px', background: theme.palette.primary.main, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
    heading: {
        background: theme.palette.primary.main,
        fontWeight: 'bold'
    },
    information: { fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
    userCell: {
        borderLeft: '1px solid black',
        borderBottom: '1px solid black',
        textAlign: 'left',
        padding: 3,
        "&:last-child": {
            borderRight: '1px solid black'
        }
    },
    buttonRow: { marginTop: 10, marginBottom: 10 },
    lastRowLeft: { borderBottomLeftRadius: 5 },
    lastRowRight: { borderBottomRightRadius: 5 }

}))
function UploadUsers(props) {

    const classes = useStyles();
    const [newUsers, setNewUsers] = useState([]);
    const [existingUsers, setExistingUsers] = useState([])
    const dispatch = useDispatch();



    const handleFile = event => {
        const userData = parse(event.target.result, { header: true, dynamicTyping: true })

        DataMethods.checkUsersExist(userData.data).then(res => {
            setNewUsers(res.newUsers);
            setExistingUsers(res.existingUsers);
        })

    }

    const fileSelected = file => {
        const fileData = new FileReader();
        fileData.onloadend = handleFile;
        fileData.readAsText(file)
    }
    const cancel = () => {
        setNewUsers([]);
        setExistingUsers([])
        props.dialogClose();
    }
    const saveAll = () => {
        dispatch(saveUserBatch(newUsers)).then(console.log('done'))
    }
    return (
        <Dialog open={props.open} onClose={props.dialogClose} className={classes.dialog} maxWidth={'md'} >
            <Grid container className={classes.contentContainer}>
                <Grid item xs={12}>
                    <FormControl>
                        <Input type="file" onChange={e => fileSelected(e.target.files[0])} className={classes.inputFile} />
                    </FormControl>
                </Grid>

                {newUsers.length > 0 &&
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography className={classes.information} variant="body2">The following users will be imported</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container className={classes.userTable}>
                                <Grid item xs={1} ><Typography className={classes.heading}>First </Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Last </Typography></Grid>
                                <Grid item xs={2} ><Typography className={classes.heading}>Username</Typography></Grid>
                                <Grid item xs={4} ><Typography className={classes.heading}>Email</Typography></Grid>
                                <Grid item xs={1}><Typography className={classes.heading}>Phone</Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Loc.</Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Staff</Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Admin</Typography></Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                }
                {newUsers.map((user, i) => {
                    return (
                        <Grid item xs={12} key={user.username}>
                            <Grid container>
                                <Grid item xs={1} className={classNames(classes.userCell, i === newUsers.length - 1 ? classes.lastRowLeft : '')}>{user.first_name}</Grid>
                                <Grid item xs={1} className={classes.userCell}>{user.last_name}</Grid>
                                <Grid item xs={2} className={classes.userCell}>{user.username}</Grid>
                                <Grid item xs={4} className={classes.userCell}>{user.email}</Grid>
                                <Grid item xs={1} className={classes.userCell}>{user.phone}</Grid>
                                <Grid item xs={1} className={classes.userCell}>{user.location === 1 ? "StJ" : 'GN'}</Grid>
                                <Grid item xs={1} className={classes.userCell}>{user.isStaff === 1 ? "Yes" : "No"}</Grid>
                                <Grid item xs={1} className={classNames(classes.userCell, i === newUsers.length - 1 ? classes.lastRowRight : '')}>{user.isAdmin === 1 ? "Yes" : "No"}</Grid>
                            </Grid>
                        </Grid>
                    )

                })}
                {existingUsers.length > 0 &&
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography className={classes.information} variant="body2">The following users already exist, and will NOT be added.</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container className={classes.userTable}>
                                <Grid item xs={1} ><Typography className={classes.heading}>First </Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Last </Typography></Grid>
                                <Grid item xs={2} ><Typography className={classes.heading}>Username</Typography></Grid>
                                <Grid item xs={4} ><Typography className={classes.heading}>Email</Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Phone</Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Loc.</Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Staff</Typography></Grid>
                                <Grid item xs={1} ><Typography className={classes.heading}>Admin</Typography></Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                }
                {existingUsers.map((user, i) => {
                    return (
                        <Grid item xs={12} key={user.username}>
                            <Grid container>
                                <Grid item xs={1} className={classNames(classes.userCell, i === existingUsers.length - 1 ? classes.lastRowLeft : '')}>{user.first_name}</Grid>
                                <Grid item xs={1} className={classes.userCell}>{user.last_name}</Grid>
                                <Grid item xs={2} className={classes.userCell}>{user.username}</Grid>
                                <Grid item xs={4} className={classes.userCell}>{user.email}</Grid>
                                <Grid item xs={1} className={classes.userCell}>{user.phone}</Grid>
                                <Grid item xs={1} className={classes.userCell}>{user.location === 1 ? "StJ" : 'GN'}</Grid>
                                <Grid item xs={1} className={classes.userCell}>{user.isStaff === 1 ? "Yes" : "No"}</Grid>
                                <Grid item xs={1} className={classNames(classes.userCell, i === existingUsers.length - 1 ? classes.lastRowRight : '')}>{user.isAdmin === 1 ? "Yes" : "No"}</Grid>
                            </Grid>
                        </Grid>
                    )

                })}

            </Grid>
            <Grid item xs={12}>
                <Grid container className={classes.buttonRow}>
                    <Grid item xs={8}></Grid>
                    <Grid item xs={2}><Button onClick={cancel}>Cancel</Button></Grid>
                    <Grid item xs={2}>
                        {newUsers.length > 0 &&
                            <Button onClick={saveAll}>Save</Button>
                        }

                    </Grid>
                </Grid>
            </Grid>
        </Dialog>
    )
}

export default UploadUsers