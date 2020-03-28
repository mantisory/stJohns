import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Input, Checkbox, FormControlLabel, Select, MenuItem, Grid } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import dataMethods from '../utils/data'
import { getDay } from 'date-fns'

const useStyles = makeStyles(theme => ({
    dialog: {
        background: 'transparent',
        width: '100%'
    },
    contentContainer: {
        width: '100%',
        minWidth: 500,
        height: 'auto',
        [theme.breakpoints.down('md')]: {
            // background: 'red',
            minWidth: 400,
            minHeight: 200
        }
    },
    formItem: {
        marginBottom: 20
    }
}))

function ShiftSelectDialog(props) {

    const classes = useStyles();
    const [location, changeLocation] = useState('')
    const [availableShifts, setAvailableShifts] = useState([])
    const [shiftsToSave, setShiftsToSave] = useState([])
    const { user } = useSelector(state => ({ user: state.auth.user }));

    const locationChange = (event) => {
        setAvailableShifts([]);
        setShiftsToSave([]);
        changeLocation(event.target.value)
    }

    const yesterday = () => {

    }
    const tomorrow = () => {

    }

    const handleShiftSelected = event => {

        const shifts = availableShifts.map(shift => {
            shift.scheduled = shift.shiftID == event.target.value ? !shift.scheduled : shift.scheduled;
            return shift;
        });
        setAvailableShifts(shifts);

        let saveShifts = [...shiftsToSave]
        let shiftIndex = saveShifts.findIndex(shift => shift.scheduled_shift == event.target.value)
        if (shiftIndex > -1) {
            saveShifts.splice(shiftIndex, 1)
        } else {

            let scheduledShiftIDIndex = availableShifts.findIndex(shift => { return shift.shiftID == event.target.value })
            saveShifts.push({
                scheduled_shift: event.target.value,
                scheduled_shift_ID: scheduledShiftIDIndex > -1 ? availableShifts[scheduledShiftIDIndex].scheduledShiftID : null,
                scheduled: scheduledShiftIDIndex > -1 ? availableShifts[scheduledShiftIDIndex].scheduled : !availableShifts[scheduledShiftIDIndex].scheduled
            })
        }
        setShiftsToSave(saveShifts);
    }
    const clear = () => {
        setAvailableShifts([])
        setShiftsToSave([])
        changeLocation('')
        props.dialogClose()
    }
    const cancel = () => {
        clear()
    }
    const saveShifts = () => {

        props.saveShifts({
            locationID: location,
            scheduledDate: props.dateSelected,
            shifts: [...shiftsToSave]
        });
        clear()

    }

    useEffect(() => {
        changeLocation(user.defaultLocation)
    }, [user])

    useEffect(() => {
        if (props.shifts.length > 0) {
            changeLocation(props.shifts[0].location)
        } else {
            changeLocation(user.defaultLocation)
        }
    }, [props.shifts])

    useEffect(() => {
        if (location !== '') {
            dataMethods.getLocationShifts(location, getDay(new Date(props.dateSelected)))
                .then(results => {
                    let availableShifts = []
                    results.data.map(availableShift => {
                        availableShift.scheduled = false;
                        availableShift.scheduledShiftID = null;
                        const scheduledShiftIndex = props.shifts.findIndex(shift => shift.scheduled_shift === availableShift.shiftID && shift.location === location)
                        if (scheduledShiftIndex > -1) {
                            availableShift.scheduled = true;
                            availableShift.scheduledShiftID = props.shifts[scheduledShiftIndex].scheduled_shift_ID;
                        }
                        availableShifts.push(availableShift);
                    })
                    setAvailableShifts(availableShifts);
                })
        }
    }, [location])

    return (
        <Dialog open={props.dialogOpen} onClose={props.dialogClose} className={classes.dialog} maxWidth={true} maxWidth={'xl'}>
            <DialogTitle >Select shifts for {props.dateSelected}</DialogTitle>
            <DialogContent>
                <Grid container className={classes.contentContainer}>
                    <Grid item xs={12}>
                        <Grid container className={classes.formItem}>
                            <Grid item xs={4}>
                                Select location:
                            </Grid>
                            <Grid item xs={8}>
                                <Select onChange={locationChange} value={location}>
                                    <MenuItem value={1}>St John's</MenuItem>
                                    <MenuItem value={2}>Good Neighbors</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container className={classes.formItem}>
                            <Grid item xs={4}>Select shift(s):</Grid>
                            <Grid item xs={8}>
                                <Grid container>
                                    {availableShifts.map(shift => {
                                        return (
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox onChange={handleShiftSelected} value={shift.shiftID} checked={shift.scheduled} />
                                                    }
                                                    label={shift.shiftText}
                                                    key={shift.shiftID}
                                                />
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={3} md={8} />
                            <Grid item xs={3} md={2}><Button onClick={cancel} color="secondary">Cancel</Button></Grid>
                            <Grid item xs={3} md={2}><Button onClick={saveShifts} color="primary">Save</Button></Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
    )
}
export default ShiftSelectDialog;
