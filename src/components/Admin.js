import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import DataMethods from "../utils/data";
import propTypes from "prop-types";
import { getAllUsers } from "../actions/getUserData";
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
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { getAllShiftsForDate } from "../actions/getUserData";
import PrintIcon from "@material-ui/icons/Print";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
  header: {
    background: theme.palette.primary.main,
    lineHeight: 2.5,
    fontWeight: "bold",
    borderBottom: "1px solid black",
    marginBottom: 20,
    paddingTop:8
  },
  footer:{
    position: 'fixed',
    left: 0,
    bottom: 0,
    background: theme.palette.primary.main,
    borderTop: "1px solid black",
  },
  userContainer:{
      marginBottom:100
  },
  itemContainer: {
    lineHeight: "40px",
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
    alignItems: "center",
    justifyContent: "center"
  },
  shiftCard: {
    maxWidth: 345,
    width: 300,
    height: 250
  },
  emailLink: {
    color: theme.palette.primary.main,
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
  }
});
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inEdit: false,
      editUID: 0,
      users: [],
      editedUsers:[],
      calendarVisible: true,
      usersVisible: false,
      calendarSelectedDate: null,
      shiftsForDay: [],
      sortDirection: "asc",
      sortCriteria: "username",
      userDataClean:true
    };
  }

  compareValues = (key, order) => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
      const comparison = a[key].localeCompare(b[key]);
      return order === "desc" ? comparison * -1 : comparison;
    };
  };

  sortBy = key => {
    this.setState(state => {
      let sortDirection = "asc";
      if (this.state.sortCriteria === key) {
        sortDirection = this.state.sortDirection === "asc" ? "desc" : "asc";
      }

      let sortedUsers = [...this.state.users].sort(
        this.compareValues(key, sortDirection)
      );
      return {
        users: sortedUsers,
        sortDirection: sortDirection,
        sortCriteria: key
      };
    });
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
    }
    return shiftName;
  };
  componentDidMount() {
    this.props.getAllUsers().then(res => {
      this.setState({ users: [...res] });
      this.handleDateChange(new Date());
    });
  }

  setEditMode = UID => {
    this.setState({ inEdit: true, editUID: UID });
  };

  handleChange = UID => {
    let users = [...this.state.users];
    let userIndex = this.state.users.findIndex(user => {
      return user.UID === UID;
    });
    users[userIndex].isAdmin = users[userIndex].isAdmin === 0 ? 1 : 0;
    this.setState({ users });
    this.setState({userDataClean:false})

    let editedUsers = [...this.state.editedUsers]
    let editedUsersIndex = editedUsers.findIndex(user => {
        return user.UID === UID;
    })
    if(editedUsersIndex>-1){
        editedUsers.splice(editedUsersIndex,1 )
    }
    else{
        editedUsers.push({UID:UID, isAdmin:users[userIndex].isAdmin})
    }
    this.setState({editedUsers:editedUsers})
  };

  showUsers = () => {
    this.setState({ usersVisible: true, calendarVisible: false });
  };

  showCalendar = () => {
    this.setState({ usersVisible: false, calendarVisible: true });
  };

  filterUserResults = (e) => {
    if(e.target.value.length>0){
        let filteredUsers = [...this.props.userState.users].filter(user=>{
            return user.username.toLowerCase().indexOf(e.target.value)>-1 ||
            user.first_name.toLowerCase().indexOf(e.target.value)>-1 || 
            user.last_name.toLowerCase().indexOf(e.target.value)>-1 
        })
        // console.log(filteredUsers)
        this.setState({users:filteredUsers})
    }else{
        this.setState({users:[...this.props.userState.users]})
    }
  }

  handleDateChange = date => {
    const dateFns = new DateFnsUtils();
    this.setState({ calendarSelectedDate: format(date, "yyyy-MM-d") });
    this.props.getAllShiftsForDate(format(date, "yyyy-MM-d")).then(res => {
      let sortedShifts = [];
      res.userData.forEach(shift => {
        let shiftIndex = sortedShifts.findIndex(sortedShift => {
          return sortedShift.shiftNumber === shift.scheduled_shift;
        });
        // console.log(shiftIndex)
        if (shiftIndex < 0) {
          sortedShifts.push({
            shiftNumber: shift.scheduled_shift,
            users: [
              {
                firstName: shift.first_name,
                lastName: shift.last_name,
                UID: shift.UID,
                email: shift.email
              }
            ]
          });
        } else {
          sortedShifts[shiftIndex].users.push({
            firstName: shift.first_name,
            lastName: shift.last_name,
            UID: shift.UID,
            email: shift.email
          });
        }
      });
      // console.log(sortedShifts)
      this.setState({ shiftsForDay: sortedShifts });
    });
  };
saveUserData(){

}
  renderHeader() {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.header}>
        <Grid item xs={1}>
          <Button onClick={this.showUsers}>Users</Button>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={this.showCalendar}>Calendar</Button>
        </Grid>
      </Grid>
    );
  }

  renderFooter(){
      const classes = this.props.classes;
      return (
       <Grid container className={classes.footer}>
           <Grid item xs={1}>
               <Button onClick={()=>this.saveUserData} disabled={this.state.userDataClean}>Save</Button>
           </Grid>
       </Grid>
      )
  }
  render() {
    const classes = this.props.classes;
    const selectedDate = new Date();
    if (this.props.userState.loading) {
      return <div>Loading</div>;
    } else {
      return (
        <div>
          {this.renderHeader()}
          {this.state.calendarVisible && (
            <Grid>
              <Grid container className={classes.heading}>
                {/* <Grid item xs={2}>
                  <span>Select a date to see scheduling</span>
                </Grid> */}
                <Grid item xs={2}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      // variant="inline"
                      format="yyyy-MM-dd"
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
              </Grid>
              <Grid container spacing={3} className={classes.shiftCards}>
                {this.state.shiftsForDay.map(shiftGroup => {
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
                                variant="body2"
                                color="primary"
                                key={user.UID}
                              >
                                <a
                                  href={
                                    "mailto:" +
                                    user.email +
                                    "?subject=re: volunteering for " +
                                    this.state.calendarSelectedDate +
                                    "&body=Greetings " +
                                    user.firstName
                                  }
                                  className={classes.emailLink}
                                >
                                  {" "}
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
          )}
          {this.state.usersVisible && (
              <Grid>
            <Grid className={classes.userContainer}>
              <Grid container className={classes.header}>
                <Grid item xs={1} onClick={() => this.sortBy("username")}>
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
                <Grid item xs={4} onClick={() => this.sortBy("email")}>
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
                <Grid item xs={1}>
                  Administrator
                </Grid>
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
              </Grid>
              {this.state.users.map(user => {
                return (
                  <Grid container key={user.UID}>
                    <Grid container className={classes.itemContainer}>
                      <Grid item xs={1} className={classes.gridItem}>
                        {user.username}
                      </Grid>
                      <Grid item xs={4} className={classes.gridItem}>
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
                          onChange={() => this.handleChange(user.UID)}
                        />
                      </Grid>
                      <Grid item xs={2} />
                    </Grid>
                  </Grid>
                );
              })}
               
            </Grid>
            <Grid>
            {this.renderFooter()}
            </Grid>
            </Grid>
          )}
        </div>
      );
    }
  }
}
Admin.propTypes = {
  getAllUsers: propTypes.func.isRequired,
  getAllShiftsForDate: propTypes.func.isRequired,
  classes: propTypes.object.isRequired
};
const mapStateToProps = state => {
  return {
    userState: state.users
  };
};
export default connect(mapStateToProps, { getAllUsers, getAllShiftsForDate })(
  withStyles(styles)(Admin)
);
