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
import { isSameMonth, isSameDay, parseISO} from "date-fns";
import classNames from "classnames";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
// import ChevronRight from '@material-ui/icons';

import propTypes from "prop-types";
import { endOfMonth } from "date-fns/esm";
import { isAbsolute } from "path";
import { isTSExpressionWithTypeArguments } from "@babel/types";
import { Z_FIXED } from "zlib";
import dataMethods from "../utils/data";
import { connect } from "react-redux";
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
    fontWeight: "normal",
    width: "100%",
    padding: "1em 0 0 0",
    color: theme.palette.primary.contrastText
  },
  chevLeft: {
    textAlign: "right"
  },
  chevRight: {
    textAlign: "left"
  },
  calendarBody: {
    position: "absolute",
    top: 100,
    width: "100%"
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
  cell: {
    borderRight: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
    marginRight: "-2px",
    boxSizing: "border-box",
    position: "relative",
    height: "10em",
    overflow: "hidden",
    zIndex: 1
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
    pointerEvents: "none"
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
  cellContentHidden: {
    top: "-150px",
    transition: "top .2s"
  },
  cancelButton: {
    // background:theme.palette.secondary.main,
    position: "fixed",
    bottom: 20,
    right: 180
  },
  button: {
    background: theme.palette.secondary.main,
    position: "fixed",
    bottom: 20,
    right: 20
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
  selectControl:{
      width:140
  }
});
//   const [open, setOpen] = React.useState(false);
class Calendar extends Component {
  constructor(props) {
    super(props);
    // //console.log(props)
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      modalOpen: false,
      modalX: 0,
      modalY: 0,
      daySelected: 0,
      shiftValue: "",
      selectedShifts: [],
      calendarClean: true,
      isLoading: true,
      full_name: "",
    };
  }


  getScheduledShifts = () => {
    //   if*this.state
    dataMethods
      .getScheduledShifts(format(this.state.currentMonth, "yyyy-MM-d"), this.props.user.UID)
      .then(res => {
        const shifts = [...this.state.selectedShifts];
        res.data.forEach(shift => {
          this.setState(state => {
            const selectedShifts = state.selectedShifts.concat([
              {
                shiftDate: shift.scheduled_date,
                shiftValue: shift.scheduled_shift.toString(),
                shiftID: shift.scheduled_shift_ID
              }
            ]);
            return {
              selectedShifts: selectedShifts
            };
          });
        });
      });
    this.setState({
      full_name: this.props.user.first_name + " " + this.props.user.last_name,
      isLoading: false
    });
  };
  componentDidUpdate() {
    const fullName = this.props.user.first_name;
    if (this.state.isLoading) {
      this.getScheduledShifts();
    }
  }
  
  renderHeader() {
    const dateFormat = "MMMM yyyy";

    return (
      <Grid container className={this.props.classes.header} spacing={3}>
        <Grid item xs={4}>
          Hello, {this.state.full_name}
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
        <Grid item xs={4}></Grid>
      </Grid>
    );
  }
  renderFooter() {
    const classes = this.props.classes;
    if (!this.state.calendarClean) {
      return (
        <div>
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
            onClick={this.saveShifts}
          >
            Save Changes
          </Button>
        </div>
      );
    }
  }

  handleOpen = (day, thedate) => e => {
      //console.log('in handle open')
    this.setState({
      selectedDate: thedate,
      modalOpen: !this.state.modalOpen,
      modalX: e.clientX,
      modalY: e.clientY,
      daySelected: day
    });
   
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };
  getShiftValue = day => {
    
    let shifts = [...this.state.selectedShifts];
    
    const shiftIndex = shifts.findIndex(shift =>
      isSameDay(parseISO(shift.shiftDate), day)
    );

    if (shiftIndex > -1) {
        console.log(shifts[shiftIndex].shiftValue)
      return shifts[shiftIndex].shiftValue;
    } else {
      return null;
    }
  };

  handleShiftChange = day => e => {
     
   
    const shiftValue = e.target.value;
    let shifts = [...this.state.selectedShifts];

    const shiftIndex = shifts.findIndex(shift =>
      isSameDay(parse(shift.shiftDate, "yyyy-MM-d", new Date()), day)
    );

    if (shiftIndex > -1) {
      this.setState(state => {
        const list = this.state.selectedShifts.map((shift, index) => {
          if (index === shiftIndex) {
            shift.shiftValue = shiftValue;
            return shift;
          } else {
            return shift;
          }
        });
      });
    } else {
      this.setState(state => {
        const selectedShifts = state.selectedShifts.concat([
          { shiftDate: format(day, "yyyy-MM-d"), shiftValue: shiftValue }
        ]);
        return {
          selectedShifts: selectedShifts
        };
      });
    }
    this.setState({ daySelected: 0 ,calendarClean:false});
  };
  
  saveShifts = () => {
    dataMethods
      .saveShifts(this.state.selectedShifts, this.props.user.UID)
      .then(res => {
        // //console.log(res)
      });
  };
  cancel = () => {
    this.setState({ selectedShifts: [] });
    this.getScheduledShifts();
  };
  getShiftLabel = shift => {
    let day = "a";
    // //console.log(shift)
    switch (shift) {
      case "1":
        day = "Breakfast";
        break;
      case "2":
        day = "Lunch";
        break;
      case "3":
        day = "Dinner";
        break;
    }
    return day;
  };

  renderCells() {
    const classes = this.props.classes;
    const { currentMonth, selectedDate } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        const shiftIndex = this.state.selectedShifts.findIndex(shift => {
          return isSameDay(
            parse(shift.shiftDate, "yyyy-MM-d", new Date()),
            day
          );
        });

        days.push(
          <div
            className={classNames(
              classes.dayColumn,
              classes.cell,
              !isSameMonth(day, monthStart)
                ? classes.disabled
                : isSameDay(day, selectedDate)
                ? classes.selected
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
              {shiftIndex > -1 && (
                <div>
                  {this.getShiftLabel(
                    this.state.selectedShifts[shiftIndex].shiftValue
                  )}
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
                <InputLabel id="demo-simple-select-label" shrink={false}>Shift</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.getShiftValue(cloneDay) || ""}
                  onChange={this.handleShiftChange(cloneDay)}
                  onClick={e=>e.stopPropagation()}
                  classes={{root:classes.selectControl}}
                >
                  <MenuItem value={"1"}>6am - 9am</MenuItem>
                  <MenuItem value={"2"}>10am - 1pm</MenuItem>
                  <MenuItem value={"3"}>4pm - 7pm</MenuItem>
                </Select>
              </FormControl>
              {/* <FormControl component="fieldset" classes={{root:classes.formControl,label:classes.formControlLabel}}>
                        <RadioGroup aria-label="position" name="position" value={this.getShiftValue(cloneDay)||''} onChange={this.handleShiftChange(cloneDay)} >
                            <FormControlLabel
                            value="1"
                            variant="body2"
                            control={<Radio color="primary" />}
                            label="6am - 9am"
                            labelPlacement="start"
                            classes={{label:classes.radio}}
                            />
                            <FormControlLabel
                            value="2"
                            control={<Radio color="primary" />}
                            label="10am - 1pm"
                            labelPlacement="start"
                            classes={{label:classes.radio}}
                            />
                            <FormControlLabel
                            value="3"
                            control={<Radio color="primary" />}
                            label="4pm - 7pm"
                            labelPlacement="start"
                            classes={{label:classes.radio}}
                            />
                          
                        </RadioGroup>
    </FormControl> */}
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
    return <div className={classes.calendarBody}>{rows}</div>;
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
      isLoading:true
    });
  };
  prevMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, -1),
        isLoading:true
    });
  };

  render() {
    // const classes = t;
    return (
      <div className={this.props.classes.content}>
        {this.renderHeader()}
        {this.renderCells()}
        {this.renderFooter()}
      </div>
    );
  }
}
Calendar.propTypes = {
  classes: propTypes.object.isRequired
  // user:propTypes.object
};

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Calendar));
