import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
    format, addMonths, addDays, parse, startOfWeek, startOfMonth,
    endOfWeek, getDay, isSameDay, parseISO, isAfter, getMonth, isBefore,
    endOfMonth
} from "date-fns";
import classNames from 'classnames';
import { useSelector } from 'react-redux'
import ShiftSelectDialog from './ShiftSelectDialog';
import PersonIcon from '@material-ui/icons/Person';
import NoMeetingRoomIcon from '@material-ui/icons/NoMeetingRoom';

const useStyles = makeStyles(theme => ({
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
        // minHeight: "6em",
        width: "100%",
        "& :nth-child(7)": {
            borderRight: '1px solid #ddd'
        }
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
    selected: {
        borderLeft: "10px solid transparent",
        borderImage:
            "linear-gradient(45deg, rgba(70, 53, 31,1) 0%, rgba(200, 159, 112, 1) 40%)",
        borderImageSlice: 1,
        borderBottom: '2px solid black'
    }, bg: {
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
        fontWeight: "700",
        borderLeft: 'none !important',
        textAlign: 'center'
    },
    numberWithShifts: {
        fontSize: "82.5%",
        lineHeight: "1",
        fontWeight: "700",
        color: theme.palette.error.dark,
        borderLeft: 'none !important',
        textAlign: 'center'
    },
    disabled: {
        color: theme.palette.error.light,
        pointerEvents: "none",
        background: "#f6f6f6"
    },
    hiddenContent: { visibility: "hidden", top: "150px", transition: "top .2s" },
    hidden: {
        display: "none"
    },
    cellContent: {
        top: "0px",
        height: 50,
        width: "100%",
        position: "relative",
        transition: "top .2s",
        display: 'table-cell',
        verticalAlign: 'middle',
        paddingLeft: '40%'
    },
    cellTextContent: {
        top: "40%",
        position: "relative"
    },
    cellContentHidden: {
        top: "-150px",
        transition: "top .2s"
    },
}))
function MobileCalendar(props) {


    const classes = useStyles();
    const stateShifts = useSelector(state => state.shifts);
    const [state, setState] = useState({
        currentMonth: props.currentMonth,
        selectedDate: new Date(),
        daySelected: 0,
        modalShifts: [],
        shiftModalOpen: false
    })
    const monthStart = startOfMonth(state.currentMonth);
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

    useEffect(() => {
        setState({ ...state, currentMonth: props.currentMonth })
    }, [props.currentMonth])

    const handleShiftSelectionClose = () => {
        setState({ ...state, shiftModalOpen: false })
    }
    const saveShifts = shiftData => {
        props.saveShifts(shiftData)
    }
    const handleOpen = (day, thedate) => e => {
        console.log('click')
        let today = new Date();

        let shifts = [...stateShifts.shifts].filter(shift => isSameDay(parseISO(shift.scheduled_date), thedate));

        if (getDay(thedate) !== 0 && getDay(thedate) !== 1 && (isSameDay(today, thedate) || isAfter(thedate, today))) {
            setState({ ...state, selectedDate: thedate, daySelected: day, modalShifts: shifts, shiftModalOpen: true })
        }

    };

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat);
            formattedMonth = format(day, monthFormat)
            const cloneDay = day;
            let volunteered = [];

            const dayShifts = stateShifts.shifts.filter(shift => {
                return isSameDay(parseISO(shift.scheduled_date), day)
            });

            let isClosedDay = getDay(day) === 0 || getDay(day) === 1;
            let isDayInCurrentMonth =
                getMonth(day) === getMonth(state.currentMonth);
            days.push(
                <div
                    className={classNames(
                        classes.dayColumn,
                        classes.cell,
                        isSameDay(day, state.selectedDate) && !isClosedDay
                            ? classes.selected
                            : (isBefore(day, dateToday) && !isSameDay(day, dateToday)) ||
                                isClosedDay ||
                                !isDayInCurrentMonth
                                ? classes.disabled
                                : ""
                    )}
                    key={day}
                    onClick={handleOpen(formattedDate, cloneDay)}
                >
                    <div
                        className={classNames(
                            classes.cellContent,
                            state.daySelected === formattedDate && formattedMonth === state.currentMonth
                                ? classes.cellContentHidden
                                : ""
                        )}
                    >

                        <span className={dayShifts.length > 0 ? isBefore(day, dateToday) && !isSameDay(day, dateToday) ? classes.number : classes.numberWithShifts : classes.number}>{formattedDate}</span>
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }

        rows.push(
            <div className={classes.row} key={day}>
                {days}
                {state.shiftModalOpen &&
                    <ShiftSelectDialog dialogOpen={state.shiftModalOpen} dialogClose={handleShiftSelectionClose} saveShifts={saveShifts} dateSelected={format(state.selectedDate, 'yyyy-MM-dd')} shifts={state.modalShifts} />

                }
            </div>
        );
        days = [];
    }
    return (
        <div className={classes.calendarBody}>
            <div className={classes.titlerow}>
                <div className={classNames(classes.dayColumn, classes.titleCell)}>
                    S
      </div>
                <div className={classNames(classes.dayColumn, classes.titleCell)}>
                    M
      </div>
                <div className={classNames(classes.dayColumn, classes.titleCell)}>
                    T
      </div>
                <div className={classNames(classes.dayColumn, classes.titleCell)}>
                    W
      </div>
                <div className={classNames(classes.dayColumn, classes.titleCell)}>
                    Th
      </div>
                <div className={classNames(classes.dayColumn, classes.titleCell)}>
                    F
      </div>
                <div className={classNames(classes.dayColumn, classes.titleCell)}>
                    S
      </div>
            </div>

            {rows}
        </div>
    );
}
export default MobileCalendar;