import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import propTypes from "prop-types";
// import { makeStyles } from "@material-ui/core/styles";
import { getAllUsers, saveUserIsAdmin,saveNewUser, deleteUsers } from "../actions/getUserData";
import {
    Grid,
    Checkbox,
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Input,
    InputAdornment
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import DateFnsUtils from "@date-io/date-fns";
import { format, addDays, subDays, startOfWeek, isSameDay, parseISO, addWeeks, getMonth, isThisMonth, getDay, isAfter} from "date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import { getAllShiftsForDate, getAllShiftsForMonth } from "../actions/getUserData";
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SearchIcon from "@material-ui/icons/Search";
import classNames from 'classnames';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@material-ui/core";
import UserModal from './UserModal'
import AddShifts from './AddShifts'

// import { blue } from "@material-ui/core/colors";
// const useStyles = makeStyles({
//   dialog: {
//     height: 200,
//     width: 200,
//     backgroundColor: blue[100],
//     color: blue[600]
//   },
//   dialogTitle: {
//     background: "#c89f70",
//     width: 300
//   }
// });
const styles = theme => ({
    header: {
        background: theme.palette.primary.main,
        lineHeight: 2.5,
        fontWeight: "bold",
        borderBottom: "1px solid black",
        marginBottom: 20,
        paddingTop: 8,
        paddingBottom: 10
    },
    footer: {
        position: "fixed",
        left: 0,
        bottom: 0,
        background: theme.palette.primary.main,
        borderTop: "1px solid black",
        padding: 15
    },
    titleContainer: {
        marginBottom: 20
    },
    userContainer: {
        marginBottom: 100
    },
    itemContainer: {
        lineHeight: "40px"
    },
    gridItem: {
        paddingTop: 5
    },
    heading: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 100
    },
    shiftCards: {
        display: "flex",
        alignItems: "left",
        justifyContent: "left"
    },
    shiftCard: {
        maxWidth: 345,
        width: 'auto',
        height: 'auto'
    },
    emailLink: {
        color: theme.palette.primary.dark,
        textDecoration: "none"
    },
    cardHeader: {
        background: theme.palette.primary.main,
        lineHeight: 2.5,
        fontWeight: "bold",
        borderBottom: "1px solid black",
        marginBottom: 20
    },
    arrow: {
        top: 5,
        position: "relative",
        marginLeft: 5
    },
    searchField: {
        background: "#fff"
    },
    active: {
        background: "#9d774e"
    },
    pagination: {
        display: 'inline-block',
        bottom: 0,
        position: 'relative',
        left: '40%',
        '& a': {
            color: 'black',
            float: 'left',
            padding: '8px 16px',
            textDecoration: 'none',

        },
        '& a:hover:not(.Admin-activePagination-15)': {
            backgroundColor: '#ddd',
            borderRadius: 5,
            cursor: 'pointer'
        }
    },
    activePagination: {
        background: theme.palette.secondary.main,
        borderRadius: 5,
        color: '#fff !important'
    },
    shiftsForDay: {
        display: 'none'
    },
    noShiftsForDay: {
        display: 'block'
    },
    dayCell: {
        borderTop: '1px solid black',
        borderBottom: '1px solid black',
        borderRight: '1px solid black',
        minHeight: '25vh',
        // height:'100%',
        maxWidth: '14.28%',
        flexBasis: '14.28%',
        minWidth: 190,
        display: 'inline-block',
        "&:first-child": {
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            borderLeft: '1px solid black'
        },
        "&:last-child": {
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10
        }
    },
    dayHeading: {
        background: theme.palette.primary.main,
        borderBottom: '1px solid black',
        height: 40,
        paddingTop: 12,
        fontWeight: 'bold'
    },
    dayHeadingFirst: {
        borderTopLeftRadius: 10
    },
    dayHeadingLast: {
        borderTopRightRadius: 10,
        // borderRight:'1px solid black'
    },
    timeSlot: {
        background: theme.palette.primary.main,
        // border:'1px solid black',
        marginRight: -1,
        borderBottom: '1px solid black',
        maxHeight: 30,
        minHeight: 30,
        paddingTop: 5
    },
    shiftUser: {
        maxHeight: 30,
        minHeight: 30,
        paddingTop: 5,
        textDecoration: 'none',
        color: '#000'
    },
    staffUser: {
        color: theme.palette.secondary.dark,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    calendarButton: {
        top: '50%',
        border:'none'
    },
    weeklyCalendar: {
        top: 10,
        position: 'relative'
    },
    locationWeek: {
        marginBottom: 20
    },
    leftAlign: {
        textAlign: 'left',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    dailyShiftContainer:{
        marginBottom:20,
    }
});
function DialogBox(props) {
    const { onClose, open } = props;
    const handleClose = () => {
        onClose();
    };
    return (
        <Dialog open={open}>
            <DialogTitle id="simple-dialog-title">Success</DialogTitle>
            <DialogContent>
                <DialogContentText>The user changes have been saved.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose} color="primary" autoFocus>
                    OK
        </Button>
            </DialogActions>
        </Dialog>
    );
}

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inEdit: false,
            editUID: 0,
            users: [],
            pageUsers: [],
            editedUsers: [],
            deletedUsers: [],
            calendarVisible: false,
            usersVisible: true,
            calendarSelectedDate: null,
            shiftsForDay: [],
            sortDirection: "asc",
            sortCriteria: "username",
            userDataClean: true,
            currentUserPageNumber: 0,
            pageSize: 10,
            numberOfPages: 0,
            pages: [],
            userAdminSaved: false,
            usersDeleted: false,
            goHome: false,
            calendarView: 'weekly',
            currentDay: new Date(),
            addUserDialogOpen:false,
            addShiftsDialogOpen:false,
            addShiftsUser:null
        };
    }

    paginateUsers = () => {
        let pages = [];
        for (let i = 0; i < this.state.numberOfPages; i++) {
            pages.push(i);
        }
        this.setState({
            pageUsers: this.state.users.slice(
                this.state.currentUserPageNumber * this.state.pageSize,
                (this.state.currentUserPageNumber + 1) * this.state.pageSize
            ),
            pages: pages
        });
    };

    previousUserPage = () => {
        let currPageNumber = this.state.currentUserPageNumber;
        if (currPageNumber > 0) {
            this.setState(
                { currentUserPageNumber: --currPageNumber },
                () => this.paginateUsers()
            );
        }
    };

    nextUserPage = () => {
        let currPageNumber = this.state.currentUserPageNumber;
        if (currPageNumber + 1 < this.state.numberOfPages) {
            this.setState(
                { currentUserPageNumber: ++currPageNumber },
                () => this.paginateUsers()
            );
        }
    };
    setPage = page => {
        this.setState({ currentUserPageNumber: page }, () => this.paginateUsers());
    };
    addShiftsClose = ()=>{
        this.setState({addShiftsOpen:false})
    }
    addShiftsForUser = user =>{
        this.setState({addShiftsOpen:true,addShiftsUser:user})
    }
    compareValues = (key, order) => {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
            const comparison = a[key].localeCompare(b[key]);
            return order === "desc" ? comparison * -1 : comparison;
        };
    };
    compareCheckboxValues = (key, order) => {
        let multiplier = order === 'desc' ? 1 : -1
        return (a, b) => {

            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
            return (a === b) ? 0 : a ? multiplier * -1 : multiplier;
        }
    }
    sortBy = key => {
        this.setState(
            state => {
                let sortDirection = "asc";
                if (this.state.sortCriteria === key) {
                    sortDirection = this.state.sortDirection === "asc" ? "desc" : "asc";
                }
                let sortedUsers;
                if (key == 'isAdmin' || key === 'isStaff') {
                    sortedUsers = [...this.state.users].sort(this.compareCheckboxValues(key, sortDirection))
                } else {
                    sortedUsers = [...this.state.users].sort(
                        this.compareValues(key, sortDirection)
                    );
                }
                return {
                    users: sortedUsers,
                    sortDirection: sortDirection,
                    sortCriteria: key
                };
            },
            () => this.paginateUsers()
        );
    };
    getShiftLabel = shift => {
        let shiftName = "";

        switch (shift.toString()) {
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
    getUsers = () => {
        this.props.getAllUsers().then(res => {
            this.setState(
                {
                    users: [...res],
                    numberOfPages: Math.ceil([...res].length / this.state.pageSize)
                },
                () => this.paginateUsers()
            );
            this.handleDateChange(new Date());
        });
    }
    componentDidMount() {
        this.getUsers();

        this.props.getAllShiftsForMonth(format(new Date(), "yyyy-MM-dd")).then(res => {
            //   console.log(res)
            // this.setState({
            //     shiftsForMonth:[...res.userData]
            // })
        })
    }

    setEditMode = UID => {
        this.setState({ inEdit: true, editUID: UID });
    };
    handleDelete = UID => {

        this.setState({ userDataClean: false });

        let deletedUsers = [...this.state.deletedUsers];
        let deletedUserIndex = deletedUsers.findIndex(user => {
            return user.UID === UID;
        });
        if (deletedUserIndex > -1) {
            deletedUsers.splice(deletedUserIndex, 1)
        } else {
            deletedUsers.push({ UID: UID });
        }
        this.setState({ deletedUsers: deletedUsers });
    }
    handleChange = (UID, mode) => {
        let users = [...this.state.users];
        let userIndex = this.state.users.findIndex(user => {
            return user.UID === UID;
        });
        if (mode === 'admin') {
            users[userIndex].isAdmin = users[userIndex].isAdmin === 0 ? 1 : 0;
        } else {
            users[userIndex].isStaff = users[userIndex].isStaff === 0 ? 1 : 0;
        }


        this.setState({ users });
        this.setState({ userDataClean: false });

        let editedUsers = [...this.state.editedUsers];
        let editedUsersIndex = editedUsers.findIndex(user => {
            return user.UID === UID;
        });
        if (editedUsersIndex > -1) {
            editedUsers[editedUsersIndex] = { UID: UID, isAdmin: users[userIndex].isAdmin, isStaff: users[userIndex].isStaff };
        } else {
            editedUsers.push({ UID: UID, isAdmin: users[userIndex].isAdmin, isStaff: users[userIndex].isStaff });
        }
        this.setState({ editedUsers: editedUsers });
    };

    showUsers = () => {
        this.setState({ usersVisible: true, calendarVisible: false });
    };

    showCalendar = () => {
        this.setState({ usersVisible: false, calendarVisible: true });
    };

    filterUserResults = e => {
        if (e.target.value.length > 0) {
            let filteredUsers = [...this.props.userState.users].filter(user => {
                return (
                    user.username.toLowerCase().indexOf(e.target.value) > -1 ||
                    user.first_name.toLowerCase().indexOf(e.target.value) > -1 ||
                    user.last_name.toLowerCase().indexOf(e.target.value) > -1
                );
            });
            this.setState({ users: filteredUsers }, () => this.paginateUsers());
        } else {
            this.setState({ users: [...this.props.userState.users] }, () =>
                this.paginateUsers()
            );
        }
    };

    previousDay = () => {
        const newDate = subDays(this.state.calendarSelectedDate, 1);
        this.handleDateChange(newDate)

    }

    nextDay = () => {
        const newDate = addDays(this.state.calendarSelectedDate, 1);
        this.handleDateChange(newDate)
    }
    handleDateChange = date => {
        this.setState({ calendarSelectedDate: date });
        this.props.getAllShiftsForDate(format(date, "yyyy-MM-dd")).then(res => {
            let sortedShifts = [];
            res.userData.forEach(shift => {
                let shiftIndex = sortedShifts.findIndex(sortedShift => {
                    return sortedShift.shiftNumber === shift.scheduled_shift;
                });
                if (shiftIndex < 0) {
                    sortedShifts.push({
                        shiftNumber: shift.scheduled_shift,
                        location:shift.locationID,
                        users: [
                            {
                                firstName: shift.first_name,
                                lastName: shift.last_name,
                                UID: shift.UID,
                                email: shift.email,
                                isStaff: shift.isStaff
                            }
                        ]
                    });
                } else {
                    sortedShifts[shiftIndex].users.push({
                        firstName: shift.first_name,
                        lastName: shift.last_name,
                        UID: shift.UID,
                        email: shift.email,
                        isStaff: shift.isStaff
                    });
                }
            });

            this.setState({ shiftsForDay: sortedShifts });
        });
    };
    goHome = () => {
        this.props.history.push("/");
    };
    saveUserData = () => {
        this.props.saveUserIsAdmin(this.state.editedUsers).then(res => {
            if (this.props.userState.userSaveSuccess) {
                this.setState({ userAdminSaved: true });
            }
        });
    };
    deleteUsers = () => {
        this.props.deleteUsers(this.state.deletedUsers).then(res => {
            if (this.props.userState.deleteSuccess) {
                this.setState({ usersDeleted: true, deletedUsers: [] });
                this.getUsers();
            }
        })
    }
    addUsers = () => {
        this.setState({addUserDialogOpen:true})
    }

    cancelAddUserList=()=>{
        this.setState({addUserDialogOpen:false})
    }
    
    saveUser = (user) => {
        this.props.saveNewUser(user).then(result=>{
            this.setState({addUserDialogOpen:false})
        })
    }
    
    renderHeader() {
        const classes = this.props.classes;
        if (this.state.goGome) {
            return <Redirect to="/" push={true} />;
        }
        return (
            <Grid container className={classes.header}>
                <Grid item xs={1}>
                    <Button variant="outlined"
                        onClick={this.showUsers}
                        className={this.state.usersVisible ? classes.active : ""}
                    >
                        Users
          </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="outlined"
                        onClick={this.showCalendar}
                        className={this.state.calendarVisible ? classes.active : ""}
                    >
                        Calendar
          </Button>
                </Grid>
                <Grid item xs={9} />
                <Grid item xs={1}>
                    <Button variant="outlined" onClick={this.goHome}>Home</Button>
                </Grid>
            </Grid>
        );
    }

    renderFooter() {
        const classes = this.props.classes;

        return (
            <Grid container className={classes.footer}>
                <Grid item xs={2}>
                    <Input
                        id="search"
                        startAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        onChange={this.filterUserResults}
                    />
                </Grid>
                <Grid item xs={4} />
                <Grid item xs={2}>
                    <Button variant="outlined" onClick={this.addUsers}>Add Users</Button>
                    {this.state.addUserDialogOpen &&
                    <UserModal open={this.state.addUserDialogOpen} dialogSaveUser={this.saveUser} dialogClose={this.cancelAddUserList}/>
                    }
                    
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined"
                        onClick={this.deleteUsers}
                        disabled={this.state.deletedUsers.length < 1 ? true : false}
                    >
                        Delete Selected
          </Button></Grid>
                <Grid item xs={2}>
                    <Button variant="outlined"
                        onClick={this.saveUserData}
                        disabled={this.state.userDataClean}
                    >
                        Save
          </Button>
                </Grid>

                <DialogBox
                    open={this.state.userAdminSaved}
                    onClose={() => this.handleDialogClose()}
                    type="save"
                />
                <DialogBox
                    open={this.state.usersDeleted}
                    onClose={() => this.handleDialogClose()}
                    type="delete"
                />
            </Grid>
        );
    }
    handleDialogClose() {
        this.setState({ userAdminSaved: false, userDataClean: true, usersDeleted: false });
    }
    changeView = (view) => {
        this.setState({ calendarView: view })
    }
    expandCell = (dateClicked) => {
        console.log(dateClicked)
    }
    getDailyShifts = dailyShifts => {
        const timeSlots = ["5am - 10am", "10am - 2pm", "2pm - 4pm", "4pm - 7pm", "8am - 4pm"];
        const classes = this.props.classes;
        let shiftTimeSlot = 0;
        let timeSlotAdded = false;
        if (dailyShifts.length === 0) return <Grid item xs={12} className={classes.shiftUser}></Grid>
        return (
            dailyShifts.map(shift => {

                if (shift.scheduled_shift === shiftTimeSlot) {
                    if (timeSlotAdded === false) {
                        timeSlotAdded = true;
                        return (
                            <Grid container key={'timeSlot' + shiftTimeSlot}>
                                <Grid item xs={12} className={classes.timeSlot}>{timeSlots[shiftTimeSlot]}</Grid>
                                <Grid item xs={12} key={shift.scheduled_shift_ID}>
                                    <a href={
                                        "mailto:" +
                                        shift.email
                                        + "?subject=re: volunteering for " +
                                        shift.scheduled_date +
                                        "&body=Greetings " +
                                        shift.first_name + ", "
                                    }
                                        target="_blank"
                                        className={classNames(classes.shiftUser, shift.isStaff === 1 ? classes.staffUser : '')}
                                    >
                                        {shift.first_name + " " + shift.last_name}

                                    </a>
                                </Grid>
                            </Grid>
                        )
                    } else {
                        return (
                            <Grid container key={'timeSlot' + shiftTimeSlot + shift.scheduled_shift_ID}>
                                <Grid item xs={12} className={classNames(classes.shiftUser, shift.isStaff === 1 ? classes.staffUser : '')} key={shift.scheduled_shift_ID}>
                                    <a href={
                                        "mailto:" +
                                        shift.email
                                        + "?subject=re: volunteering for " +
                                        shift.scheduled_date +
                                        "&body=Greetings " +
                                        shift.first_name + ", "
                                    }
                                        target="_blank"
                                        className={classNames(classes.shiftUser, shift.isStaff === 1 ? classes.staffUser : '')}
                                    >
                                        {shift.first_name + " " + shift.last_name}
                                    </a>
                                </Grid>
                            </Grid>
                        )
                    }

                } else {
                    shiftTimeSlot = shift.scheduled_shift;
                    timeSlotAdded = true;
                    return (
                        <Grid container key={'timeSlot' + shiftTimeSlot + shift.scheduled_shift_ID}>
                            <Grid item xs={12} className={classes.timeSlot} key={'timeSlot' + shiftTimeSlot}>{timeSlots[shiftTimeSlot]}</Grid>
                            <Grid item xs={12} className={classNames(classes.shiftUser, shift.isStaff === 1 ? classes.staffUser : '')} key={shift.scheduled_shift_ID}>
                                <a href={
                                    "mailto:" +
                                    shift.email
                                    + "?subject=re: volunteering for " +
                                    shift.scheduled_date +
                                    "&body=Greetings " +
                                    shift.first_name + ", "
                                }
                                    target="_blank"
                                    className={classNames(classes.shiftUser, shift.isStaff === 1 ? classes.staffUser : '')}
                                >
                                    {shift.first_name + " " + shift.last_name}
                                </a>
                            </Grid>
                        </Grid>
                    )
                }

            })


        )
    }
    previousWeek = () => {
        let mondayThisWeek = startOfWeek(this.state.currentDay, { weekStartsOn: 1 })
        if (getMonth(addWeeks(mondayThisWeek, -1)) != getMonth(mondayThisWeek)) {
            this.props.getAllShiftsForMonth(format(addWeeks(mondayThisWeek, -1), 'yyyy-MM-dd'))
        }
        this.setState({ currentDay: addWeeks(mondayThisWeek, -1) })
    }
    nextWeek = () => {
        let mondayThisWeek = startOfWeek(this.state.currentDay, { weekStartsOn: 1 })
        if (getMonth(addWeeks(mondayThisWeek, 1)) != getMonth(mondayThisWeek)) {
            this.props.getAllShiftsForMonth(format(addWeeks(mondayThisWeek, 1), 'yyyy-MM-dd'))
        }
        this.setState({ currentDay: addWeeks(mondayThisWeek, 1) })
    }
    renderWeekly(locationID) {
        const classes = this.props.classes;
        const weekStart = startOfWeek(this.state.currentDay, { weekStartsOn: 1 })
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        let days = [];
        for (let i = 1; i < 6; i++) {
            let theDate = addDays(weekStart, i-1);
            let dailyShifts = this.props.monthlyShiftData.filter(shift => {
                return isSameDay(new Date(shift.scheduled_date), theDate) && shift.locationID === locationID
            })

            days.push(

                <Grid item xs={1} className={classes.dayCell} key={'cell' + i} >
                    <Grid container style={{ position: 'inherit' }}>
                        <Grid item xs={12} className={classNames(classes.dayHeading, i === 0 ? classes.dayHeadingFirst : i === 6 ? classes.dayHeadingLast : '')}>{format(addDays(theDate,1), 'EEE, MMM do')} </Grid>
                        {this.getDailyShifts(dailyShifts)}

                    </Grid>
                </Grid>
            )

        }

        return (
            <Grid container className={classes.locationWeek}>
                {days}
            </Grid>

        )
    }

    renderDaily(locationID) {
        const classes = this.props.classes;
        const locationDailyShifts = [...this.state.shiftsForDay].filter(shift=> {return shift.location===locationID})
        console.log(locationDailyShifts)
        return (
            <Grid container className={classes.dailyShiftContainer} justify="flex-start">
                <Grid container spacing={3} className={locationDailyShifts.length > 0 ? classes.shiftsForDay : classes.noShiftsForDay}>
                    <Grid item xs={12}> 
                    <Typography variant="h5">There are no shifts scheduled for the selected date.</Typography></Grid>
                </Grid>
                <Grid container spacing={3} className={classes.shiftCards} justify="flex-start" direction="row" alignItems="flex-start">
                    <Grid item xs={1}></Grid>
                    {locationDailyShifts.map(shiftGroup => {
                        return (
                            
                            <Grid item xs={2} key={shiftGroup.shiftNumber}>
                                <Card className={classes.shiftCard}>
                                    <CardHeader
                                        title={this.getShiftLabel(shiftGroup.shiftNumber)}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        {shiftGroup.users.map(user => {
                                            return (
                                                <Typography
                                                    color="primary"
                                                    key={user.UID+locationID}
                                                >
                                                    <a
                                                        href={
                                                            "mailto:" +
                                                            user.email +
                                                            "?subject=re: volunteering  for " +
                                                            this.state.calendarSelectedDate +
                                                            "&body=Greetings " +
                                                            user.firstName + ", " + user.isStaff
                                                        }
                                                        target="_blank"

                                                        className={classNames(classes.emailLink, user.isStaff === 1 ? classes.staffUser : '')}
                                                    >
                                                        {user.firstName + " " + user.lastName}
                                                    </a>
                                                </Typography>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        )
    }

    render() {
        const classes = this.props.classes;
        if (this.props.userState.loading) {
            return <div>Loading</div>;
        } else {
            return (
                <div>
                    {this.renderHeader()}
                    {this.state.calendarVisible && (
                        <Grid container>
                            <Grid item xs={1}><Button onClick={() => this.changeView('daily')}>Daily</Button></Grid>
                            <Grid item xs={1}><Button onClick={() => this.changeView('weekly')}>Weekly</Button></Grid>
                        </Grid>
                    )}
                    {this.state.calendarVisible && this.state.calendarView == 'daily' && (
                        <Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h5">Select a day below, using the calendar or arrows, to see the list of scheduled volunteers for each shift.</Typography>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.heading}>
                                <Grid item xs={1}><ChevronLeft onClick={this.previousDay} /></Grid>
                                <Grid item xs={2}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            // variant=
                                            format="eee, MMM dd, yyyy"
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Select a date"
                                            value={this.state.calendarSelectedDate}
                                            onChange={this.handleDateChange}
                                            KeyboardButtonProps={{
                                                "aria-label": "change date"
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={1}><ChevronRight onClick={this.nextDay} /></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={2} className={classes.leftAlign}>St. John's Mission</Grid>
                                <Grid item xs={9}></Grid>
                            </Grid>
                            {this.renderDaily(1)}
                            <Grid container>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={2} className={classes.leftAlign}>Good Neighbors Scarborough</Grid>
                                <Grid item xs={9}></Grid>
                            </Grid>
                            {this.renderDaily(2)}
                        </Grid>
                    )}
                    {this.state.calendarVisible && this.state.calendarView == 'weekly' && (
                        <Grid container className={classes.weeklyCalendar}>
                            <Grid container>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={2} className={classes.leftAlign}>St. John's Mission</Grid>
                                <Grid item xs={9}></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={2}>
                                    <Button onClick={() => this.previousWeek()} className={classes.calendarButton}>
                                        <ChevronLeft style={{ fontSize: 48 }} />Previous Week
                                </Button>
                                </Grid>
                                <Grid item xs={8} style={{textAlign:'center'}}>
                                    {this.renderWeekly(1)}
                                </Grid>
                                <Grid item xs={2}>
                                    <Button onClick={() => this.nextWeek()} className={classes.calendarButton}>
                                        Next Week<ChevronRight style={{ fontSize: 48 }} />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={2} className={classes.leftAlign}>Good Neightbors Scarborough</Grid>
                                <Grid item xs={9}></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={2}>

                                </Grid>
                                <Grid item xs={8}>
                                    {this.renderWeekly(2)}
                                </Grid>
                                <Grid item xs={2}>

                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    {this.state.usersVisible && (
                        <Grid>
                            <Grid container className={classes.titleContainer}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Below is a list of all volunteers. You can set them to be administrators and/or staff by clicking the checkbox and clicking save at the bottom right.</Typography>
                                </Grid>
                            </Grid>
                            <Grid className={classes.userContainer}>
                                <Grid container className={classes.header}>
                                    <Grid item xs={2} onClick={() => this.sortBy("username")}>
                                        Username
                    {this.state.sortCriteria === "username" &&
                                            this.state.sortDirection === "asc" && (
                                                <ArrowUpwardIcon className={classes.arrow} />
                                            )}
                                        {this.state.sortCriteria === "username" &&
                                            this.state.sortDirection === "desc" && (
                                                <ArrowDownwardIcon className={classes.arrow} />
                                            )}
                                    </Grid>
                                    <Grid item xs={3} onClick={() => this.sortBy("email")}>
                                        Email address
                    {this.state.sortCriteria === "email" &&
                                            this.state.sortDirection === "asc" && (
                                                <ArrowUpwardIcon className={classes.arrow} />
                                            )}
                                        {this.state.sortCriteria === "email" &&
                                            this.state.sortDirection === "desc" && (
                                                <ArrowDownwardIcon className={classes.arrow} />
                                            )}
                                    </Grid>
                                    <Grid item xs={2} onClick={() => this.sortBy("first_name")}>
                                        First Name
                    {this.state.sortCriteria === "first_name" &&
                                            this.state.sortDirection === "asc" && (
                                                <ArrowUpwardIcon className={classes.arrow} />
                                            )}
                                        {this.state.sortCriteria === "first_name" &&
                                            this.state.sortDirection === "desc" && (
                                                <ArrowDownwardIcon className={classes.arrow} />
                                            )}
                                    </Grid>
                                    <Grid item xs={2} onClick={() => this.sortBy("last_name")}>
                                        Last Name
                    {this.state.sortCriteria === "last_name" &&
                                            this.state.sortDirection === "asc" && (
                                                <ArrowUpwardIcon className={classes.arrow} />
                                            )}
                                        {this.state.sortCriteria === "last_name" &&
                                            this.state.sortDirection === "desc" && (
                                                <ArrowDownwardIcon className={classes.arrow} />
                                            )}
                                    </Grid>
                                    <Grid item xs={1}
                                    // onClick={() => this.sortBy("isAdmin")}
                                    >
                                        Administrator
                  </Grid>
                                    <Grid item xs={1}
                                    // onClick={()=>this.sortBy('isStaff')}
                                    >Staff</Grid>
                                    <Grid item xs={1}>Delete</Grid>

                                </Grid>
                                {this.state.pageUsers.map(user => {
                                    return (
                                        <Grid container key={user.UID}>
                                            <Grid container className={classes.itemContainer}>
                                                <Grid item xs={2} className={classes.gridItem}>
                                                    <Typography onClick={()=>this.addShiftsForUser(user)}>{user.username}</Typography>
                                                </Grid>
                                                <Grid item xs={3} className={classes.gridItem}>
                                                    {user.email}
                                                </Grid>
                                                <Grid item xs={2} className={classes.gridItem}>
                                                    {user.first_name}
                                                </Grid>
                                                <Grid item xs={2} className={classes.gridItem}>
                                                    {user.last_name}
                                                </Grid>

                                                <Grid item xs={1} className={classes.gridItem}>
                                                    <Checkbox
                                                        label="Admin"
                                                        checked={user.isAdmin === 1 ? true : false}
                                                        onChange={() => this.handleChange(user.UID, 'admin')}
                                                    />
                                                </Grid>
                                                <Grid item xs={1} className={classes.gridItem}>
                                                    <Checkbox
                                                        label="Staff"
                                                        checked={user.isStaff === 1 ? true : false}
                                                        onChange={() => this.handleChange(user.UID, 'staff')}
                                                    />
                                                </Grid>
                                                <Grid item xs={1} className={classes.gridItem}>
                                                    <Checkbox
                                                        label="Delete"
                                                        onChange={() => this.handleDelete(user.UID)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                                <Grid container>
                                    <div className={classes.pagination}>
                                        <a onClick={this.previousUserPage}><ChevronLeft /></a>

                                        {this.state.pages.map(page => {
                                            return (
                                                <a onClick={() => this.setPage(page)} key={page} className={this.state.currentUserPageNumber == page ? classes.activePagination : ''}>
                                                    {page + 1}
                                                </a>
                                            );
                                        })}


                                        <a onClick={this.nextUserPage}><ChevronRight /></a>
                                    </div>
                                </Grid>
                                {this.state.addShiftsOpen &&
                                <AddShifts dialogOpen={this.state.addShiftsOpen} addShiftsDialogClose={this.addShiftsClose} user={this.state.addShiftsUser}/>
                                }
                                
                            </Grid>
                            <Grid>{this.renderFooter()}</Grid>
                        </Grid>
                    
                    )}
                </div>
            );
        }
    }
}
DialogBox.propTypes = {
    open: propTypes.bool.isRequired
};

Admin.propTypes = {
    getAllUsers: propTypes.func.isRequired,
    getAllShiftsForDate: propTypes.func.isRequired,
    getAllShiftsForMonth: propTypes.func.isRequired,
    saveUserIsAdmin: propTypes.func.isRequired,
    saveNewUser:propTypes.func.isRequired,
    deleteUsers: propTypes.func.isRequired,
    classes: propTypes.object.isRequired
};
const mapStateToProps = state => {
    return {
        userState: state.users,
        monthlyShiftData: state.shifts.allShiftsForMonth
    };
};
export default connect(mapStateToProps, {
    getAllUsers,
    getAllShiftsForDate,
    getAllShiftsForMonth,
    saveNewUser,
    saveUserIsAdmin,
    deleteUsers
})(withRouter(withStyles(styles)(Admin)));
