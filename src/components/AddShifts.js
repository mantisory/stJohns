import React, { useState, useEffect } from 'react'
import {
    Dialog, Grid, Typography, Card, CardContent, Button, InputLabel, FormControl, FormGroup, Select,
    MenuItem, Radio, RadioGroup, Checkbox, FormLabel, FormControlLabel
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import {
    addDays, eachDayOfInterval, startOfMonth, endOfMonth, startOfDay, isSunday, format, isBefore, getMonth, getDay,
    isMonday
} from 'date-fns'
import { useSelector, useDispatch } from 'react-redux'
import { saveUserShifts, saveUserShiftsInRange } from '../actions/getUserData';



const useStyles = makeStyles(theme => ({
    container: {
        minHeight: 650,
        width: '100%',
        overflowX: 'hidden'
    },
    formContainer: {
        paddingLeft: 20,
        paddingRight: 20
    },
    formLine: {
    },
    instructions: {

    },
    buttonContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        flexDirection: 'row-reverse',
        "& button": {
            marginRight: 10
        }
    },
    positionedText: {
        position: 'relative',
        top: 35
    },
    header: {
        background: theme.palette.primary.main,
        padding: 10,
        maxHeight: 50,
        // height:50,
        borderBottom: '1px solid #000'
    },
    footer: {
        position: 'absolute',
        bottom: 15,
        right: 15
    },
    formControl: {
        minWidth: 180,
        margin: theme.spacing(1)
    },
    dayCard: {
        marginRight: 15,
        width: 220
    }
}))
function AddShifts(props) {
    const classes = useStyles();
    const availableShifts = useSelector(state => state.shifts.availableShifts);
    const dispatch = useDispatch();
    const [state, setState] = useState({
        location: 1,
        shiftsBy: 'day',
        dateRange: [],
        shifts: [],
        selectedDate: new Date(),
        selectedStartDate: new Date(),
        selectedEndDate: addDays(new Date(), 1),
        selectedDays: {
            tuesday: { selected: false, selectedShifts: [] },
            wednesday: { selected: false, selectedShifts: [] },
            thursday: { selected: false, selectedShifts: [] },
            friday: { selected: false, selectedShifts: [] },
            saturday: { selected: false, selectedShifts: [] },
        },
        selectedDaysChanged: false,
        singleDaySelectedShifts: [],
        rangeSelectedShifts: [],
        currentMonth: getMonth(new Date()),
        disabledDatesInMonthRange: [],
        saveShifts: false
    });
    useEffect(() => {
        const daysInWeek = ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        if (state.selectedDaysChanged) {
            const { selectedDays } = { ...state };
            const currentSelectedDays = selectedDays;

            let allSelectedShiftsInInterval = [];

            Object.keys(currentSelectedDays).forEach(selectedDay => {

                if (currentSelectedDays[selectedDay].selected && currentSelectedDays[selectedDay].selectedShifts.length > 0) {
                    const dayOfWeek = daysInWeek.indexOf(selectedDay) + 2;
                    eachDayOfInterval({ start: state.selectedStartDate, end: state.selectedEndDate }).map(intervalDay => {
                        if (getDay(intervalDay) === dayOfWeek) {
                            currentSelectedDays[selectedDay].selectedShifts.forEach(selectedShift => {
                                allSelectedShiftsInInterval.push({ scheduledDate: format(intervalDay, 'yyyy-MM-dd'), scheduled_shift: selectedShift, locationID: state.location, UID: props.user.UID });
                                return;
                            })
                        }
                        return null;
                    })
                }
                return;
            })
            // console.log(allSelectedShiftsInInterval)
            setState({ ...state, selectedDaysChanged: false, rangeSelectedShifts: allSelectedShiftsInInterval })
        }
    }, [state.selectedDaysChanged])
    useEffect(() => {
        let dateForTheMonth = new Date().setMonth(state.currentMonth)
        const today = startOfDay(new Date());
        let invalidDates = eachDayOfInterval({ start: startOfMonth(dateForTheMonth), end: endOfMonth(dateForTheMonth) })
            .filter(day => (isBefore(day, today)))
            .map(day => format(day, 'yyyy-MM-dd'))
        setState({ ...state, disabledDatesInMonthRange: invalidDates })
    }, [state.currentMonth])

    useEffect(() => {
        if (state.saveShifts) {
            console.log('true')
        }
    }, [state.saveShifts])

    const shouldDisableEndDate = day => {
        if (state.disabledDatesInMonthRange.includes(day) || isBefore(day, state.selectedStartDate)) {
            return true;
        } else {
            return false;
        }
    }
    const shouldDisableTheDate = (day) => {

        let formattedDay = format(day, 'yyyy-MM-dd')
        return state.disabledDatesInMonthRange.includes(formattedDay) || isSunday(day) || isMonday(day);

    }
    const changeMonth = date => {
        setState({ ...state, currentMonth: getMonth(date) })
    }
    const handleChange = prop => event => {
        setState({ ...state, [prop]: event.target.value })
    }
    const handleDateChange = prop => date => {
        setState({ ...state, [prop]: date })
    }
    const handleDaysChange = event => {
        const { selectedDays } = { ...state }
        const currentSelectedDays = selectedDays
        currentSelectedDays[event.target.name].selected = event.target.checked;
        setState({ ...state, selectedDays: currentSelectedDays });
    }
    const handleSingleDayShiftSelection = event => {
        const { singleDaySelectedShifts } = { ...state }
        const currentSelectedShifts = singleDaySelectedShifts
        const shiftIndex = currentSelectedShifts.map(shift => shift.scheduled_shift).indexOf(parseInt(event.target.value));
        if (shiftIndex > -1) {
            currentSelectedShifts.splice(shiftIndex, 1)
        } else {
            currentSelectedShifts.push({ scheduled_shift: parseInt(event.target.value) })
        }
        setState({ ...state, singleDaySelectedShifts: currentSelectedShifts })
    }
    // const generateDays = daysOfWeek =>{}
    const handleRangeShiftSelection = day => event => {
        const { selectedDays } = { ...state };
        const currentSelectedDays = selectedDays;

        const shiftIndex = currentSelectedDays[day].selectedShifts.indexOf(parseInt(event.target.value))

        if (shiftIndex > -1) {
            currentSelectedDays[day].selectedShifts.splice(shiftIndex, 1)
        } else {
            currentSelectedDays[day].selectedShifts.push(parseInt(event.target.value))
        }
        if (currentSelectedDays[day].selectedShifts.length > 0) {
            currentSelectedDays[day].selected = true;
        } else {
            currentSelectedDays[day].selected = false;
        }

        setState({ ...state, selectedDays: currentSelectedDays, selectedDaysChanged: true })

    }


    return (
        <Dialog open={props.dialogOpen} onClose={props.addShiftsDialogClose} maxWidth={'lg'} >
            <div className={classes.container}>
                <div className={classes.header}>
                    <Typography variant="h6">Adding shifts for {props.user.username}</Typography>
                </div>
                <Grid container className={classes.formContainer}>
                    <Grid container className={classes.formLine}>
                        <Grid item xs={2} />
                        <Grid item xs={8} >
                            <Typography className={classes.instructions}>In this screen you can add multiple shifts for a selected user. Please select shifts either by a single day, or a date range. Select the days you'd like to schedule and click 'Save'.
                            Please note - this will add shifts for that user regardless of whether they already have shifts scheduled...
                            </Typography>
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                    <Grid container spacing={3} className={classes.formLine}>
                        <Grid item xs={2} />
                        <Grid item xs={3}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Location</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={state.location}
                                    onChange={handleChange('location')}
                                >
                                    <MenuItem value={1}>St. John's Mission</MenuItem>
                                    <MenuItem value={2}>Good Neighbor's Scarborough</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={4}>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormLabel component="legend">Add shifts by</FormLabel>
                                <RadioGroup row aria-label="Add shifts by" name="shiftSelect" value={state.shiftsBy} onChange={handleChange('shiftsBy')}>
                                    <FormControlLabel value="day" control={<Radio />} label="Day" labelPlacement="start" />
                                    <FormControlLabel value="range" control={<Radio />} label="Range of dates" labelPlacement="start" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                    <Grid container item xs={12}>
                        {state.shiftsBy === 'day' &&
                            <Grid container>
                                <Grid item xs={2} />
                                <Grid item xs={3}>

                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="yyyy/MM/dd"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Date"
                                            value={state.selectedDate}
                                            onChange={handleDateChange('selectedDate')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            shouldDisableDate={day => shouldDisableTheDate(day)}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={2} />
                                <Grid item xs={3}>
                                    <Card variant="outlined" className={classes.dayCard}>
                                        <CardContent>
                                            {availableShifts
                                                .filter(shift => shift.locationID === state.location && shift.shiftDay === (getDay(state.selectedDate) - 1))
                                                .map(shift => {
                                                    return (
                                                        <FormControlLabel key={shift.shiftID}
                                                            control={<Checkbox
                                                                // checked={state.selectedDays.tuesday.selectedShifts.includes(shift.shiftID)}
                                                                // checked={false} 
                                                                checked={state.singleDaySelectedShifts.map(shift => shift.scheduled_shift).includes(shift.shiftID)}
                                                                onChange={handleSingleDayShiftSelection}
                                                                name={shift.shiftText}
                                                                value={shift.shiftID}
                                                            />}
                                                            label={shift.shiftText}
                                                        />
                                                    )
                                                })}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={2} />
                            </Grid>
                        }
                        {state.shiftsBy === 'range' &&
                            <Grid container>
                                <Grid item xs={2} />
                                <Grid item xs={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="yyyy/MM/dd"
                                            margin="normal"
                                            id="start-date-picker-inline"
                                            label="Start Date"
                                            value={state.selectedStartDate}
                                            onChange={handleDateChange('selectedStartDate')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            onMonthChange={changeMonth}
                                            shouldDisableDate={day => shouldDisableTheDate(day)}
                                        />

                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={2} className={classes.positionedText}>to</Grid>
                                <Grid item xs={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="yyyy/MM/dd"
                                            margin="normal"
                                            id="start-date-picker-inline"
                                            label="End Date"
                                            value={state.selectedEndDate}
                                            onChange={handleDateChange('selectedEndDate')}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            onMonthChange={changeMonth}
                                            shouldDisableDate={day => shouldDisableEndDate(day)}

                                        />
                                        <Grid item xs={2} />
                                    </MuiPickersUtilsProvider>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl component="fieldset" className={classes.formControl}>
                                        <FormLabel component="legend">Select days</FormLabel>
                                        <FormGroup row>
                                            <Card variant="outlined" className={classes.dayCard}>
                                                <CardContent>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.selectedDays.tuesday.selected} onChange={handleDaysChange} name="tuesday" />}
                                                        label="Tuesday"
                                                    />
                                                    {availableShifts.filter(shift => shift.locationID === state.location && shift.shiftDay === 1).map(shift => {
                                                        return (
                                                            <FormControlLabel key={'tuesday' + shift.shiftID}
                                                                control={<Checkbox
                                                                    checked={state.selectedDays.tuesday.selectedShifts.includes(shift.shiftID)}
                                                                    // checked={false} 
                                                                    onChange={handleRangeShiftSelection('tuesday')}
                                                                    name={shift.shiftText}
                                                                    value={shift.shiftID}
                                                                />}
                                                                label={shift.shiftText}
                                                            />
                                                        )
                                                    })}
                                                </CardContent>
                                            </Card>
                                            <Card variant="outlined" className={classes.dayCard}>
                                                <CardContent>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.selectedDays.wednesday.selected} onChange={handleDaysChange} name="wednesday" />}
                                                        label="Wednesday"
                                                    />
                                                    {availableShifts.filter(shift => shift.locationID === state.location && shift.shiftDay === 2).map(shift => {
                                                        return (
                                                            <FormControlLabel key={'wednesday' + shift.shiftID}
                                                                control={<Checkbox
                                                                    checked={state.selectedDays.wednesday.selectedShifts.includes(shift.shiftID)}
                                                                    // checked={false} 
                                                                    onChange={handleRangeShiftSelection('wednesday')}
                                                                    name={shift.shiftText}
                                                                    value={shift.shiftID}
                                                                />}
                                                                label={shift.shiftText}
                                                            />
                                                        )
                                                    })}
                                                </CardContent>
                                            </Card>
                                            <Card variant="outlined" className={classes.dayCard}>
                                                <CardContent>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.selectedDays.thursday.selected} onChange={handleDaysChange} name="thursday" />}
                                                        label="Thursday"
                                                    />
                                                    {availableShifts.filter(shift => shift.locationID === state.location && shift.shiftDay === 3).map(shift => {
                                                        return (
                                                            <FormControlLabel key={'thursday' + shift.shiftID}
                                                                control={<Checkbox
                                                                    checked={state.selectedDays.thursday.selectedShifts.includes(shift.shiftID)}
                                                                    // checked={false} 
                                                                    onChange={handleRangeShiftSelection('thursday')}
                                                                    name={shift.shiftText}
                                                                    value={shift.shiftID}
                                                                />}
                                                                label={shift.shiftText}
                                                            />
                                                        )
                                                    })}
                                                </CardContent>
                                            </Card>
                                            <Card variant="outlined" className={classes.dayCard}>
                                                <CardContent>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.selectedDays.friday.selected} onChange={handleDaysChange} name="friday" />}
                                                        label="Friday"
                                                    />
                                                    {availableShifts.filter(shift => shift.locationID === state.location && shift.shiftDay === 4).map(shift => {
                                                        return (
                                                            <FormControlLabel key={'friday' + shift.shiftID}
                                                                control={<Checkbox
                                                                    checked={state.selectedDays.friday.selectedShifts.includes(shift.shiftID)}
                                                                    onChange={handleRangeShiftSelection('friday')}
                                                                    name={shift.shiftText}
                                                                    value={shift.shiftID}
                                                                />}
                                                                label={shift.shiftText}
                                                            />
                                                        )
                                                    })}
                                                </CardContent>
                                            </Card>
                                            <Card variant="outlined" className={classes.dayCard}>
                                                <CardContent>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={state.selectedDays.saturday.selected} onChange={handleDaysChange} name="saturday" />}
                                                        label="Saturday"
                                                    />
                                                    {availableShifts.filter(shift => shift.locationID === state.location && shift.shiftDay === 5).map(shift => {
                                                        return (
                                                            <FormControlLabel key={'saturday' + shift.shiftID}
                                                                control={<Checkbox
                                                                    checked={state.selectedDays.saturday.selectedShifts.includes(shift.shiftID)}
                                                                    // checked={false} 
                                                                    onChange={handleRangeShiftSelection('saturday')}
                                                                    name={shift.shiftText}
                                                                    value={shift.shiftID}
                                                                />}
                                                                label={shift.shiftText}
                                                            />
                                                        )
                                                    })}
                                                </CardContent>
                                            </Card>
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        }

                    </Grid>

                    <Grid container className={classes.buttonContainer}>
                        <Button onClick={() => props.addShiftsDialogClose()}>Close</Button>
                        {state.shiftsBy === 'day' &&
                            <Button onClick={() => { dispatch(saveUserShifts(state.singleDaySelectedShifts, format(state.selectedDate, 'yyyy-MM-dd'), state.location, props.user.UID)); props.addShiftsDialogClose() }}>Save</Button>
                        }
                        {state.shiftsBy === 'range' &&
                            <Button onClick={() => { dispatch(saveUserShiftsInRange(state.rangeSelectedShifts)); props.addShiftsDialogClose() }}>Save</Button>
                        }


                    </Grid>

                </Grid>
            </div>
        </Dialog>
    )
}

export default AddShifts;