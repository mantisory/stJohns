import React, { Component, createRef } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";
import addDays from "date-fns/addDays";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfWeek from "date-fns/endOfWeek";
import getDay from "date-fns/getDay";
import { isSameDay, parseISO, isAfter, getMonth, isBefore, startOfDay } from "date-fns";
import classNames from "classnames";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import PersonIcon from '@material-ui/icons/Person';
import NoMeetingRoomIcon from '@material-ui/icons/NoMeetingRoom';
import Button from "@material-ui/core/Button";
import { Redirect, withRouter } from "react-router-dom";
import propTypes from "prop-types";
import { endOfMonth } from "date-fns/esm";
import dataMethods from "../utils/data";
import { connect } from "react-redux";
import { saveUserShifts, removeUserShift, getUserData } from "../actions/getUserData";
import UserProfileDialog from "./UserProfileDialog";
import { Breakpoint, BreakpointProvider } from 'react-socks';
import DesktopCalendar from './DesktopCalendar'
import MobileCalendar from './MobileCalendar'
import { IconButton } from "material-ui";

const styles = theme => ({
    content: {
        boxSizing: "border-box"
    },
    root: {
        flexGrow: 1,
        boxSizing: "border-box"
    },
    header: {
        background: theme.palette.primary.main,
        width: "100%",
        padding: "1em 0 0 0",
    },
    headerText: {
        color: theme.palette.primary.contrastText,
        fontWeight: 'bold',
        fontSize: '1.3em',
        [theme.breakpoints.down('sm')]: {
            fontSize: '.8em',
            fontWeight: 300
        }
    },
    instructions: {
        paddingTop: 70,
        fontSize: "1.3em"
    },
    footerVisible: {
        right: 6,
        bottom: 0,
        position: 'fixed',
        transition: 'bottom .5s',
        width: 300,
        background: theme.palette.primary.main,
        height: 85,
        border: '1px solid black',
        borderRadius: '5px 5px 0 0',
        zIndex: 10
    },
    footerHidden: {
        // height: auto;
        /* top: 100px; */
        position: 'fixed',
        bottom: '-90px',
        right: 0
    },
    chevLeft: {
        textAlign: "right",
        fontWeight: 'bold',
        fontSize: '1.3em'
    },
    chevRight: {
        textAlign: "left",
        fontWeight: 'bold',
        fontSize: '1.3em'
    },
    calendarBody: {
        position: "relative",
        top: 10,
        width: "90%",
        margin: "0 auto"
    },
    dayColumn: {
        flexGrow: 0,
        flexBasis: "calc(100%/7)",
        width: "calc(100%/7)"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: "8em",
        width: "100%"
    },
    titlerow: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: "1em",
        width: "100%"
    },
    titleCell: {
        background: theme.palette.primary.main,
        minHeight: "2em",
        paddingTop: ".7em",
        marginRight: "-2px",
        borderBottom: "1px solid #000",
        marginLeft: "0px"
    },
    cell: {
        // borderRight: "1px solid #ddd",
        borderBottom: "1px solid #ddd",
        marginRight: "-2px",
        boxSizing: "border-box",
        position: "relative",
        height: "auto",
        overflow: "hidden",
        zIndex: 1,
        "& :nth-child(1)": {
            borderLeft: "1px solid #ddd"
        }
    },
    bg: {
        fontWeight: "700",
        lineHeight: "1",
        color: theme.palette.primary.main,
        opacity: "0",
        fontSize: "14em",
        position: "relative",
        transition: ".25s ease-out",
        letterSpacing: "-.07em",
        top: "-.2em",
        left: "-.05em"
    },
    bgSelected: {
        opacity: 0.05
    },
    number: {
        fontSize: "82.5%",
        lineHeight: "1",
        top: ".75em",
        right: ".75em",
        fontWeight: "700",
        position: "absolute"
    },
    disabled: {
        color: theme.palette.error.dark,
        pointerEvents: "none",
        background: "#f6f6f6"
    },
    selected: {
        borderLeft: "10px solid transparent",
        borderImage:
            "linear-gradient(45deg, rgba(70, 53, 31,1) 0%, rgba(200, 159, 112, 1) 40%)",
        borderImageSlice: 1,
        borderBottom: '2px solid black'
    },
    signUp: {
        zIndex: 10,
        position: "absolute",
        bottom: 15,
        right: 15
    },
    nosignUp: {
        visibility: "hidden"
    },
    modalStyle: {
        position: "absolute",
        width: 400,
        backgroundColor: "white",
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    },
    extraContent: {
        position: "absolute",
        top: '40%',
        left: -2,
        // transition: "top .2s",
        width: "100%",
        background: '#fff'
    },
    hiddenContent: { visibility: "hidden", top: "150px", transition: "top .2s" },
    cellContent: {
        top: "0px",
        height: "100%",
        width: "100%",
        position: "relative",
        transition: "top .2s"
    },
    cellTextContent: {
        top: "40%",
        position: "relative"
    },
    cellContentHidden: {
        top: "-150px",
        transition: "top .2s"
    },
    cancelButton: {
        position: "absolute",
        bottom: 20,
        right: 180,
        zIndex: 10
    },
    saveButton: {
        background: 'white',
        position: "absolute",
        bottom: 20,
        right: 20,
        zIndex: 10,
        color: '#900'
    },
    radio: {
        fontSize: ".9rem",
        display: "block"
    },
    formControl: {
        display: "block", width: '100%'
    },
    formControlLabel: {
        display: "block"
    },
    selectControl: {
        width: '100%'
    },
    hidden: {
        display: "none"
    },
    adminMode: {
        color: "white",
        background: theme.palette.secondary.main,
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    profileButton: {
        [theme.breakpoints.down('sm')]: {
            width: 50,
            marginRight: 10
        }
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #000',
        padding: theme.spacing(2, 4, 3),
        top: '30vh',
        left: '35vw'
    },
});

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date(),
            daySelected: 0,
            shiftValue: "",
            selectedShifts: [],
            calendarClean: true,
            isLoading: true,
            scheduledShiftDays: [],
            adminMode: false,
            shiftCounts: [],
            shiftWorkers: [],
            loggedOut: false,
            userDataRetrieved: false,
            modalShifts: [],
            shiftModalOpen: false,
            userProfileOpen: false
        };
    }

    logout = () => {
        dataMethods.userLogout();
        this.setState({ loggedOut: true });
    };
    userProfile = () => {
        this.setState({ userProfileOpen: true })

    }
    handleUserProfileClose = () => {
        this.setState({ userProfileOpen: false });
    }
    routeChange = () => {
        let path = `/Admin`;
        this.props.history.push(path);
    };

    getScheduledShiftsForAllUsers = () => {
        dataMethods
            .getScheduledShiftsForAllUsers(
                format(this.state.currentMonth, "yyyy-MM-dd")
            )
            .then(results => {
                this.setState({
                    shiftCounts: [...results.data.shiftCounts],
                    shiftWorkers: [...results.data.userData]
                });
            });
    };

    renderHeader() {
        const dateFormat = "MMMM yyyy";

        return (
            <Grid container>
                <Grid container className={this.props.classes.header}>
                    <Grid item xs={2} >
                        <Typography className={this.props.classes.headerText}>Hello, {this.props.user.first_name}</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        onClick={this.prevMonth}
                        className={this.props.classes.chevLeft}
                    >
                        <ChevronLeft />
                    </Grid>
                    <Grid item xs={2}>
                        <span className={this.props.classes.headerText}>{format(this.state.currentMonth, dateFormat)}</span>
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        onClick={this.nextMonth}
                        className={this.props.classes.chevRight}
                    >
                        <ChevronRight />
                    </Grid>

                    <Grid item xs={2}>
                        {this.props.user.isAdmin === 1 && (
                            <Button
                                onClick={this.routeChange}
                                className={this.props.classes.adminMode}
                            >
                                Administration
                            </Button>
                        )}
                    </Grid>
                    <Grid item xs={2}>
                        <MuiThemeProvider><IconButton onClick={this.userProfile} ><PersonIcon /></IconButton></MuiThemeProvider>
                        {/* <Button onClick={this.userProfile} className={this.props.classes.profileButton}>Profile</Button> */}
                    </Grid>
                    <Grid item xs={2}>
                        <MuiThemeProvider><IconButton onClick={this.logout} ><NoMeetingRoomIcon /></IconButton></MuiThemeProvider>
                        {/* <Button onClick={this.logout}>Logout</Button> */}
                    </Grid>
                </Grid>

                <Grid container className={this.props.classes.instructions}>
                    <Grid item xs={12}>
                        Please select shifts for days in the calendar below. Click on the
                        day you can volunteer to bring up the selection control.
          </Grid>
                </Grid>
            </Grid >
        );
    }

    renderFooter() {
        const classes = this.props.classes;

        return (
            <div className={this.state.calendarClean ? classes.footerHidden : classes.footerVisible}>
                <Button
                    variant="contained"
                    className={classes.cancelButton}
                    onClick={this.cancel}
                >
                    Cancel
          </Button>
                <Button
                    variant="contained"
                    className={classes.saveButton}
                    onClick={this.saveUserShifts}
                >
                    Save Changes
          </Button>
            </div>
        );

    }

    handleOpen = (day, thedate) => e => {
        let today = new Date();

        let shifts = [...this.props.shifts].filter(shift => isSameDay(parseISO(shift.scheduled_date), thedate));

        if (getDay(thedate) !== 0 && getDay(thedate) !== 1 && (isSameDay(today, thedate) || isAfter(thedate, today))) {
            this.setState({ selectedDate: thedate, daySelected: day, modalShifts: shifts },
                this.setState({ shiftModalOpen: true }));
        }
    };

    getShiftValue = day => {
        let shifts = [...this.props.shifts];

        const shiftIndex = shifts.findIndex(shift =>
            isSameDay(parseISO(shift.scheduled_date), day)
        );
        if (shiftIndex > -1) {
            return shifts[shiftIndex].scheduled_shift;
        } else {
            return null;
        }
    };

    handleShiftChange = day => e => {
        const shiftValue = e.target.value;
        let isClean = true;

        let shifts = [...this.state.selectedShifts];

        const shiftIndex = shifts.findIndex(shift =>
            isSameDay(parse(shift.scheduled_date, "yyyy-MM-dd", new Date()), day)
        );

        if (shiftIndex > -1) {
            isClean = false;
            if (shiftValue == 0) {
                shifts.splice(shiftIndex, 1);
                this.setState({ selectedShifts: shifts })
                if (shifts.length === 0) isClean = true;
            }
            else {
                this.setState(state => {
                    this.state.selectedShifts.map((shift, index) => {
                        if (index === shiftIndex) {
                            shift.scheduled_shift = shiftValue;
                            return shift;
                        } else {
                            return shift;
                        }
                    });
                });
            }

        } else {
            isClean = false;
            this.setState(state => {
                const selectedShifts = state.selectedShifts.concat([
                    {
                        scheduled_date: format(day, "yyyy-MM-dd"),
                        scheduled_shift: shiftValue
                    }
                ]);
                return {
                    selectedShifts: selectedShifts
                };
            });
        }

        this.setState({ daySelected: 0, calendarClean: isClean });
    };

    cancelShift = shiftID => {
        this.props.removeUserShift(shiftID, this.props.user.UID)
            .then(this.loadUserData())
        // this.setState({ calendarClean: true })
    }

    saveShifts = shiftData => {
        let shiftsToSave = []
        shiftData.shifts.map(shift => {
            if (!shift.scheduled) { this.cancelShift(shift.scheduled_shift_ID) }
            else {
                shiftsToSave.push(shift)
            }
        })
        if (shiftsToSave.length > 0) {
            this.props.saveUserShifts(shiftsToSave, shiftData.scheduledDate, shiftData.locationID, this.props.user.UID)
                .then(
                    setTimeout(() => {
                        this.loadUserData()
                    }, 1500)
                )
        }
    }

    // saveUserShifts = () => {
    //     this.state.selectedShifts.forEach(shift => {
    //         const scheduledShiftIndex = this.props.shifts.findIndex(
    //             scheduledShift => {
    //                 return scheduledShift.scheduled_date === shift.scheduled_date;
    //             }
    //         );
    //         if (scheduledShiftIndex > -1) {
    //             shift.scheduled_shift_ID = this.props.shifts[
    //                 scheduledShiftIndex
    //             ].scheduled_shift_ID;
    //         }
    //     });
    //     this.props.saveUserShifts(this.state.selectedShifts, this.props.user.UID);
    //     this.setState({ calendarClean: true });
    // };

    cancel = () => {
        this.setState({ selectedShifts: [], calendarClean: true });
    };

    checkShifts(selectedDay, day, shiftNumber, equal) {
        let returnClass = "";

        const classes = this.props.classes;
        if ((getDay(selectedDay) === day) !== equal) returnClass = classes.hidden;

        const theShift = this.state.scheduledShiftDays.findIndex(theShift => {
            return (
                isSameDay(new Date(theShift.scheduled_date), selectedDay) &&
                theShift.shift === shiftNumber &&
                theShift.scheduled >= 2
            );
        });
        returnClass = theShift > -1 ? classes.hidden : returnClass;
        return returnClass;
    }

    getShiftLabel = shift => {
        let shiftName = "";

        switch (shift) {
            case "1":
                shiftName = "5am - 10am";
                break;
            case "2":
                shiftName = "10am - 2pm";
                break;
            case "3":
                shiftName = "2pm - 4pm";
                break;
            case "4":
                shiftName = "4pm - 7pm";
                break;
            case "5":
                shiftName = "8am - 4pm";
                break;
            default:
                break;
        }
        return shiftName;
    };

    renderCells() {

        const classes = this.props.classes;
        const { currentMonth, selectedDate } = this.state;
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const dateFormat = "d";
        const monthFormat = "MM"
        const dayFormat = "yyyy-MM-dd";
        const dateToday = new Date();
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "", formattedMonth = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                formattedMonth = format(day, monthFormat)
                const cloneDay = day;
                let volunteered = [];


                const dayShifts = this.props.shifts.filter(shift => {
                    return isSameDay(parseISO(shift.scheduled_date), day)
                })

                let isClosedDay = getDay(day) === 0 || getDay(day) === 1;
                let isDayInCurrentMonth =
                    getMonth(day) === getMonth(this.state.currentMonth);
                days.push(
                    <div
                        className={classNames(
                            classes.dayColumn,
                            classes.cell,
                            isSameDay(day, selectedDate) && !isClosedDay
                                ? classes.selected
                                : (isBefore(day, dateToday) && !isSameDay(day, dateToday)) ||
                                    isClosedDay ||
                                    !isDayInCurrentMonth
                                    ? classes.disabled
                                    : ""
                        )}
                        key={day}
                        onClick={this.handleOpen(formattedDate, cloneDay)}
                    >
                        <div
                            className={classNames(
                                classes.cellContent,
                                this.state.daySelected === formattedDate && formattedMonth === currentMonth
                                    ? classes.cellContentHidden
                                    : ""
                            )}
                        >
                            <span className={classes.number}>{formattedDate}</span>
                            {dayShifts.map(shift => {
                                return (
                                    <div className={classes.cellTextContent} key={shift.scheduled_shift_ID}>
                                        {shift.shift_text}{shift.location === 1 ? '(St.J.)' : '(GN)'}
                                    </div>
                                )
                            })}


                            <div
                                className={classNames(
                                    classes.cellTextContent,
                                    getDay(day) === 0 || getDay(day) === 1 ? "" : classes.hidden
                                )}
                            >
                                Closed
                            </div>
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }

            rows.push(
                <div className={classes.row} key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return (
            <div className={classes.calendarBody}>
                <div className={classes.titlerow}>
                    <div className={classNames(classes.dayColumn, classes.titleCell)}>
                        Sunday
          </div>
                    <div className={classNames(classes.dayColumn, classes.titleCell)}>
                        Monday
          </div>
                    <div className={classNames(classes.dayColumn, classes.titleCell)}>
                        Tuesday
          </div>
                    <div className={classNames(classes.dayColumn, classes.titleCell)}>
                        Wednesday
          </div>
                    <div className={classNames(classes.dayColumn, classes.titleCell)}>
                        Thursday
          </div>
                    <div className={classNames(classes.dayColumn, classes.titleCell)}>
                        Friday
          </div>
                    <div className={classNames(classes.dayColumn, classes.titleCell)}>
                        Saturday
          </div>
                </div>

                {rows}
            </div>
        );
    }

    renderDays = () => {
        // const dateFormat = "dddd";
        const days = [];

        // let startDate = startOfWeek(this.state.currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(<div key={i}>format(addDays(startDate,i),dateFormat)</div>);
        }
        return <div>{days}</div>;
    };

    onDateClick = day => {
        this.setState({
            selectedDate: day
        });
    };

    loadUserData = () => {
        this.props.getUserData(
            format(this.state.currentMonth, "yyyy-MM-dd"),
            this.props.user.UID
        );
    };

    nextMonth = () => {
        let nextMonth = addMonths(this.state.currentMonth, 1);

        this.setState(
            {
                currentMonth: nextMonth,
                isLoading: true
            },
            this.loadUserData
        );
    };

    prevMonth = () => {
        let prevMonth = addMonths(this.state.currentMonth, -1);
        this.setState(
            {
                currentMonth: prevMonth,
                isLoading: true
            },
            this.loadUserData
        );

    };

    handleShiftSelectionClose = () => {
        this.setState({ shiftModalOpen: false })
    }


    render() {

        if (this.state.loggedOut) {
            return <Redirect to="/LoginForm" push={true} />;
        }
        if (this.props.user) {
            return (
                <div className={this.props.classes.content}>
                    {this.renderHeader()}
                    <Breakpoint customQuery="(max-width: 700px)">
                        <MobileCalendar currentMonth={this.state.currentMonth} saveShifts={this.saveShifts} />
                    </Breakpoint>
                    <Breakpoint customQuery="(min-width: 700px)">
                        {<DesktopCalendar currentMonth={this.state.currentMonth} saveShifts={this.saveShifts} />}
                    </Breakpoint>

                    {this.renderFooter()}

                    {this.state.userProfileOpen &&
                        <UserProfileDialog dialogOpen={this.state.userProfileOpen} dialogClose={this.handleUserProfileClose} />
                    }

                </div>
            );
        } else {
            return <div className={this.props.classes.content}></div>;
        }
    }
}
Calendar.propTypes = {
    classes: propTypes.object.isRequired,
    saveUserShifts: propTypes.func.isRequired,
    removeUserShift: propTypes.func.isRequired,
    getUserData: propTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        shifts: state.shifts.shifts,
        error: state.auth.error
    };
};

export default connect(mapStateToProps, { saveUserShifts, removeUserShift, getUserData })(
    withRouter(withStyles(styles)(Calendar))
);
