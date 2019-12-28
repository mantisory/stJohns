import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";
import addDays from "date-fns/addDays";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfWeek from "date-fns/endOfWeek";
import getDay from "date-fns/getDay";
import { isSameDay, parseISO, isAfter, getMonth, isBefore} from "date-fns";
import classNames from "classnames";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import propTypes from "prop-types";
import { endOfMonth } from "date-fns/esm";
import dataMethods from "../utils/data";
import { connect } from "react-redux";
import { saveUserShifts } from "../actions/getUserData";
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
    fontWeight: "bold",
    width: "100%",
    padding: "1em 0 0 0",
    color: theme.palette.primary.contrastText,
    fontSize: "1.3em"
  },
  instructions: {
    paddingTop: 70,
    fontSize: "1.3em"
  },
  footer: {
    position: "absolute",
    bottom: 0,
    height: 100,
    width: "100%"
  },
  chevLeft: {
    textAlign: "right"
  },
  chevRight: {
    textAlign: "left"
  },
  calendarBody: {
    position: "relative",
    top: 80,
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
    minHeight: "6em",
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
    borderRight: "1px solid #ddd",
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
    color: theme.palette.primary.light,
    pointerEvents: "none",
    background: "#f6f6f6"
  },
  selected: {
    borderLeft: "10px solid transparent",
    borderImage:
      "linear-gradient(45deg, rgba(70, 53, 31,1) 0%, rgba(200, 159, 112, 1) 40%)",
    borderImageSlice: 1
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
    top: "0px",
    transition: "top .2s",
    width: "100%"
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
  button: {
    background: theme.palette.secondary.main,
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10
  },
  radio: {
    fontSize: ".9rem",
    display: "block"
  },
  formControl: {
    display: "block"
  },
  formControlLabel: {
    display: "block"
  },
  selectControl: {
    width: 140
  },
  hidden: {
    display: "none"
  },
  adminMode: {
    color: "white",
    background: "black"
  }
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
      userDataRetrieved: false
    };
  }

  logout = () => {
    dataMethods.userLogout();
    this.setState({ loggedOut: true });
  };

  adminScreen = () => {
    this.setState({ adminMode: !this.state.adminMode });
    if (this.state.adminMode) {
      this.getScheduledShiftsForAllUsers();
    }
  };

  getScheduledShiftsForAllUsers = () => {
    dataMethods
      .getScheduledShiftsForAllUsers(
        format(this.state.currentMonth, "yyyy-MM-d")
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
        <Grid container className={this.props.classes.header} spacing={3}>
          <Grid item xs={4}>
            Hello, {this.props.user.first_name}
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
            <span>{format(this.state.currentMonth, dateFormat)}</span>
          </Grid>
          <Grid
            item
            xs={1}
            onClick={this.nextMonth}
            className={this.props.classes.chevRight}
          >
            <ChevronRight />
          </Grid>
          {this.props.user.username.toLowerCase() == "admin" && (
            <Grid item xs={2}>
              <Button
                onClick={this.adminScreen}
                className={
                  this.state.adminMode ? this.props.classes.adminMode : ""
                }
              >
                Administration
              </Button>
            </Grid>
          )}
          <Grid item xs={2}>
            <Button onClick={this.logout}>Logout</Button>
          </Grid>
        </Grid>

        <Grid container className={this.props.classes.instructions}>
          <Grid item xs={12}>
            Please select shifts for days in the calendar below. Click on the
            day you can volunteer to bring up the selection control.
          </Grid>
        </Grid>
      </Grid>
    );
  }
  renderFooter() {
    const classes = this.props.classes;
    if (!this.state.calendarClean) {
      return (
        <div className={classes.footer}>
          <Button
            variant="contained"
            className={classes.cancelButton}
            onClick={this.cancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            onClick={this.saveUserShifts}
          >
            Save Changes
          </Button>
        </div>
      );
    }
  }

  handleOpen = (day, thedate) => e => {
    let today = new Date();
    if (
      getDay(thedate) !== 0 &&
      getDay(thedate) !== 1 &&
      (isSameDay(today, thedate) || isAfter(thedate, today))
    ) {
      this.setState({
        selectedDate: thedate,

        daySelected: day
      });
    }
  };

  getShiftValue = day => {
    let shifts = [...this.state.selectedShifts];

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
    if (shiftValue == "0") {
      return;
    }
    let shifts = [...this.state.selectedShifts];

    const shiftIndex = shifts.findIndex(shift =>
      isSameDay(parse(shift.scheduled_date, "yyyy-MM-d", new Date()), day)
    );

    if (shiftIndex > -1) {
      this.setState(state => {
        const list = this.state.selectedShifts.map((shift, index) => {
          if (index === shiftIndex) {
            shift.scheduled_shift = shiftValue;
            return shift;
          } else {
            return shift;
          }
        });
      });
    } else {
      this.setState(state => {
        const selectedShifts = state.selectedShifts.concat([
          {
            scheduled_date: format(day, "yyyy-MM-d"),
            scheduled_shift: shiftValue
          }
        ]);
        return {
          selectedShifts: selectedShifts
        };
      });
    }
    this.setState({ daySelected: 0, calendarClean: false });
  };

  saveUserShifts = () => {
    this.state.selectedShifts.forEach(shift => {
      const scheduledShiftIndex = this.props.shifts.findIndex(
        scheduledShift => {
          return scheduledShift.scheduled_date == shift.scheduled_date;
        }
      );
      if (scheduledShiftIndex > -1) {
        shift.scheduled_shift_ID = this.props.shifts[
          scheduledShiftIndex
        ].scheduled_shift_ID;
      }
    });
    this.props.saveUserShifts(this.state.selectedShifts, this.props.user.UID);
  };

  cancel = () => {
    this.setState({ selectedShifts: [], calendarClean: true });
  };

  checkShifts(selectedDay, day, shiftNumber, equal) {
    let returnClass = "";

    const classes = this.props.classes;
    if ((getDay(selectedDay) == day) != equal) returnClass = classes.hidden;

    const theShift = this.state.scheduledShiftDays.findIndex(theShift => {
      return (
        isSameDay(new Date(theShift.scheduled_date), selectedDay) &&
        theShift.shift == shiftNumber &&
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
    const dayFormat = "yyyy-MM-d";
    const dateToday = new Date();
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        let shiftCounts = null;
        let volunteered = [];

        const shiftIndex = this.props.shifts.findIndex(shift => {
          return isSameDay(
            parse(shift.scheduled_date, dayFormat, new Date()),
            day
          );
        });

        const selectedShiftIndex = this.state.selectedShifts.findIndex(
          shift => {
            return isSameDay(
              parse(shift.scheduled_date, dayFormat, new Date()),
              day
            );
          }
        );

        if (this.state.adminMode) {
          volunteered = this.state.shiftCounts.filter(shift => {
            return isSameDay(
              parse(shift.scheduled_date, dayFormat, new Date()),
              day
            );
          });
          if (volunteered.length > 0) console.log(volunteered);
        }

        let isClosedDay = getDay(day) == 0 || getDay(day) == 1;
        let isDayInCurrentMonth = getMonth(day) == getMonth(this.state.currentMonth);
        days.push(
          <div
            className={classNames(
              classes.dayColumn,
              classes.cell,
              isSameDay(day, selectedDate) && !isClosedDay
                ? classes.selected
                : (isBefore(day,dateToday) && !isSameDay(day,dateToday))||isClosedDay || !isDayInCurrentMonth
                ? classes.disabled
                : ""
            )}
            key={day}
            onClick={this.handleOpen(formattedDate, cloneDay)}
          >
            <div
              className={classNames(
                classes.cellContent,
                this.state.daySelected == formattedDate
                  ? classes.cellContentHidden
                  : ""
              )}
            >
              <span className={classes.number}>{formattedDate}</span>
              {shiftIndex > -1 && selectedShiftIndex == -1 && (
                <div
                  className={
                    !this.state.adminMode
                      ? classes.cellTextContent
                      : classes.hidden
                  }
                >
                  {this.getShiftLabel(
                    this.props.shifts[shiftIndex].scheduled_shift.toString()
                  )}
                </div>
              )}
              {selectedShiftIndex > -1 && (
                <div
                  className={
                    !this.state.adminMode
                      ? classes.cellTextContent
                      : classes.hidden
                  }
                >
                  {this.getShiftLabel(
                    this.state.selectedShifts[
                      selectedShiftIndex
                    ].scheduled_shift.toString()
                  )}
                </div>
              )}
              <div
                className={classNames(
                  classes.cellTextContent,
                  getDay(day) == 0 || getDay(day) == 1 ? "" : classes.hidden
                )}
              >
                Closed
              </div>
              {this.state.adminMode && volunteered.length > 0 && (
                <div>
                  <div
                    className={
                      volunteered.findIndex(shift => {
                        return shift.scheduled_shift == 1;
                      }) < 0
                        ? classes.hidden
                        : ""
                    }
                  >
                    5am - 10am:{" "}
                    {volunteered.findIndex(shift => {
                      return shift.scheduled_shift == 1;
                    }) > -1
                      ? volunteered[
                          volunteered.findIndex(shift => {
                            return (shift.scheduled_shift = 1);
                          })
                        ].scheduled
                      : ""}
                  </div>
                  <div
                    className={
                      volunteered.findIndex(shift => {
                        return shift.scheduled_shift == 2;
                      }) < 0
                        ? classes.hidden
                        : ""
                    }
                  >
                    10am - 2pm:{" "}
                    {volunteered.findIndex(shift => {
                      return shift.scheduled_shift == 2;
                    }) > -1
                      ? volunteered[
                          volunteered.findIndex(shift => {
                            return (shift.scheduled_shift = 2);
                          })
                        ].scheduled
                      : ""}
                  </div>
                  <div
                    className={
                      volunteered.findIndex(shift => {
                        return shift.scheduled_shift == 3;
                      }) < 0
                        ? classes.hidden
                        : ""
                    }
                  >
                    2pm - 4pm:{" "}
                    {volunteered.findIndex(shift => {
                      return shift.scheduled_shift == 3;
                    }) > -1
                      ? volunteered[
                          volunteered.findIndex(shift => {
                            return (shift.scheduled_shift = 3);
                          })
                        ].scheduled
                      : ""}
                  </div>
                  <div
                    className={
                      volunteered.findIndex(shift => {
                        return shift.scheduled_shift == 4;
                      }) < 0
                        ? classes.hidden
                        : ""
                    }
                  >
                    4pm - 7pm:{" "}
                    {volunteered.findIndex(shift => {
                      return shift.scheduled_shift == 4;
                    }) > -1
                      ? volunteered[
                          volunteered.findIndex(shift => {
                            return (shift.scheduled_shift = 4);
                          })
                        ].scheduled
                      : ""}
                  </div>
                  <div
                    className={
                      volunteered.findIndex(shift => {
                        return shift.scheduled_shift == 5;
                      }) < 0
                        ? classes.hidden
                        : ""
                    }
                  >
                    8am - 4pm:{" "}
                    {volunteered.findIndex(shift => {
                      return shift.scheduled_shift == 5;
                    }) > -1
                      ? volunteered[
                          volunteered.findIndex(shift => {
                            return (shift.scheduled_shift = 5);
                          })
                        ].scheduled
                      : ""}
                  </div>
                </div>
              )}
            </div>

            <div
              className={classNames(
                classes.extraContent,
                this.state.daySelected == formattedDate
                  ? ""
                  : classes.hiddenContent
              )}
            >
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label" shrink={false}>
                  Shift
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.getShiftValue(cloneDay) || ""}
                  onChange={this.handleShiftChange(cloneDay)}
                  onClick={e => e.stopPropagation()}
                  classes={{ root: classes.selectControl }}
                >
                  <MenuItem value="0">Select a shift</MenuItem>
                  <MenuItem
                    value={"1"}
                    className={this.checkShifts(cloneDay, 6, 1, false)}
                  >
                    5am - 10am
                  </MenuItem>
                  <MenuItem
                    value={"2"}
                    className={this.checkShifts(cloneDay, 6, 2, false)}
                  >
                    10am - 2pm
                  </MenuItem>
                  <MenuItem
                    value={"3"}
                    className={this.checkShifts(cloneDay, 6, 3, false)}
                  >
                    2pm - 4pm
                  </MenuItem>
                  <MenuItem
                    value={"4"}
                    className={this.checkShifts(cloneDay, 3, 4, true)}
                  >
                    4pm - 7pm
                  </MenuItem>
                  <MenuItem
                    value={"5"}
                    className={this.checkShifts(cloneDay, 6, 5, true)}
                  >
                    8am - 4pm
                  </MenuItem>
                </Select>
              </FormControl>
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
    const dateFormat = "dddd";
    const days = [];

    let startDate = startOfWeek(this.state.currentMonth);

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

  nextMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1),
      isLoading: true
    });
  };
  prevMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, -1),
      isLoading: true
    });
  };

  render() {
    if (this.state.loggedOut) {
      return <Redirect to="/LoginForm" push={true} />;
    }
    if (this.props.user) {
      //todo
      return (
        <div className={this.props.classes.content}>
          {this.renderHeader()}
          {this.renderCells()}
          {this.renderFooter()}
        </div>
      );
    } else {
      return <div className={this.props.classes.content}></div>;
    }
  }
}
Calendar.propTypes = {
  classes: propTypes.object.isRequired,
  saveUserShifts: propTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    shifts: state.shifts.shifts
  };
};

export default connect(mapStateToProps, { saveUserShifts })(
  withStyles(styles)(Calendar)
);
