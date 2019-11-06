import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {ChevronLeft,ChevronRight} from '@material-ui/icons';
import format from 'date-fns/format';
import addMonths from 'date-fns/addMonths';
import addDays from 'date-fns/addDays';
import startOfWeek from 'date-fns/startOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfWeek from 'date-fns/endOfWeek';
import {isSameMonth, isSameDay} from 'date-fns';
import classNames from 'classnames';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
// import ChevronRight from '@material-ui/icons';

import propTypes from 'prop-types';
import { endOfMonth } from 'date-fns/esm';
import { isAbsolute } from 'path';
import { isTSExpressionWithTypeArguments } from '@babel/types';

const styles = theme => ({
    content:{
        boxSizing:'border-box'
    },
    root:{
        flexGrow:1,
        boxSizing: 'border-box'
    },
    header:{
        background:theme.palette.primary.light,
        fontWeight:'bold',
        width: '100%',
        padding: '1em 0 0 0',
    },
    chevLeft:{
       textAlign:'right'
    },
    chevRight:{
        textAlign:'left'
    },
    calendarBody:{
        position:'absolute',
        top:100,
        width:'100%'

    },
    dayColumn:{
        flexGrow: 0,
        flexBasis: 'calc(100%/7)',
        width: 'calc(100%/7)'
    },
    row:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap:'wrap',
        minHeight:'6em',
        width:'100%'
    },
    cell:{
        borderRight:'1px solid #ddd',
        borderBottom:'1px solid #ddd',
        marginRight:'-2px',
        boxSizing:'border-box',
        position:'relative',
        height:'10em',
        overflow:'hidden',
        zIndex:1
    },
    bg:{
        fontWeight: '700',
        lineHeight: '1',
        color: theme.palette.primary.main,
        opacity: '0',
        fontSize: '14em',
        position: 'relative',
        transition: '.25s ease-out',
        letterSpacing: '-.07em',
        top:'-.2em',
        left:'-.05em'
    },
    bgSelected:{
        opacity:.05,
    },
    number:{
        fontSize: '82.5%',
        lineHeight: '1',
        top: '.75em',
        right: '.75em',
        fontWeight: '700',
        position:'absolute'
    },
    disabled:{
        color: theme.palette.primary.light,
        pointerEvents: 'none'
    },
    selected:{
        borderLeft: '10px solid transparent',
        borderImage: 'linear-gradient(45deg, rgba(84, 110, 122, 1) 0%, rgba(129, 156, 169, 1) 40%)',
        borderImageSlice: 1,
    },
    signUp:{
        zIndex:10,
        position:'absolute',
        bottom:15,
        right:15
    },
    nosignUp:{
        visibility:'hidden'
    },
    modalStyle:{
        position: 'absolute',
        width: 400,
        backgroundColor: 'white',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    extraContent:{
        position:'absolute',top:'0px', transition:'top 500ms'
    },
    hiddenContent:{visibility:'hidden',top:'150px', transition:'top 500ms'},
    cellContent:{
        top: '0px',
        height: '100%',
        width: '100%',
        position: 'relative',
        transition:'top 500ms'
    },
    cellContentHidden:{
        top:'-150px',
        transition:'top 500ms'
    }
  });
//   const [open, setOpen] = React.useState(false);
class Calendar extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentMonth : new Date(),
            selectedDate:new Date(),
            modalOpen:false,
            modalX:0,
            modalY:0,
            daySelected:"0",
            shiftValue:""
        }
    }

    renderHeader(){
        const dateFormat = 'MMMM yyyy';
        return (
            <Grid container className={this.props.classes.header} spacing={3}>
                <Grid item xs={5} onClick={this.prevMonth} className={this.props.classes.chevLeft}><ChevronLeft/></Grid>
                <Grid item  xs={2} ><span>{format(this.state.currentMonth,dateFormat)}</span></Grid>
                <Grid item  xs={5}  onClick={this.nextMonth} className={this.props.classes.chevRight}><ChevronRight/></Grid>
            </Grid>
        )
    }
    renderFooter(){

    }

    signUp(day){
        // console.log(day)
        this.handleOpen();
    }
    handleOpen = day => (e)  => {
        
        this.setState({modalOpen:true,modalX:e.clientX,modalY:e.clientY, daySelected:day});
        this.renderCells();
        // this.renderModal();
      };
    
    handleClose = () => {
        this.setState({modalOpen:false})
      };
    getModalStyle = () =>{
    //     const top = this.state.modalY;
    //     const left = this.state.modalX;
    //   console.log('test')
    //     return {
    //       top: `${top}%`,
    //       left: `${left}%`,
    //       transform: `translate(-${top}%, -${left}%)`,
    //     };
      }
      handleShiftChange = day => (e) =>{
          console.log(day)
          this.setState({shiftValue:e.target.value})
      }
    renderCells(){
        const classes = this.props.classes;
        const {currentMonth,selectedDate} = this.state;
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

            //   console.log(" " + classes.cell + " " + !isSameMonth(day,monthStart)?classes.disabled:isSameDay(day,selectedDate)?classes.selected:'')
              days.push(
                <div
                  className={classNames(classes.dayColumn , classes.cell, !isSameMonth(day,monthStart)?classes.disabled:isSameDay(day,selectedDate)?classes.selected:'')}
                  key={day}
                  onClick={() => this.onDateClick(cloneDay)}
                >
                 <div className={classNames(classes.cellContent,this.state.daySelected==formattedDate?classes.cellContentHidden:'')}>
                    <span className={classNames(classes.signUp, isSameMonth(day, monthStart)?'':classes.nosignUp)} onClick={this.handleOpen(formattedDate)}>Sign up</span>          
                    <span className={classes.number}>{formattedDate}</span>
                  </div>
                  <div className={classNames(classes.extraContent,this.state.daySelected==formattedDate?'':classes.hiddenContent)} >
                      Please select a time...
                      <FormControl component="fieldset">
                        <RadioGroup aria-label="position" name="position" value={this.state.shiftValue} onChange={this.handleShiftChange(cloneDay)} row>
                            <FormControlLabel
                            value="breakfast"
                            control={<Radio color="primary" />}
                            label="6am - 9am"
                            labelPlacement="top"
                            />
                            <FormControlLabel
                            value="lunch"
                            control={<Radio color="primary" />}
                            label="10am - 1pm"
                            labelPlacement="top"
                            />
                            <FormControlLabel
                            value="dinner"
                            control={<Radio color="primary" />}
                            label="4pm - 7pm"
                            labelPlacement="top"
                            />
                          
                        </RadioGroup>
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
          return <div className={classes.calendarBody}>{rows}</div>;
    }

    renderDays = () => {
        const dateFormat = 'dddd';
        const days = [];

        let startDate = startOfWeek(this.state.currentMonth);

        for(let i=0;i<7;i++){
            days.push(
                <div key={i}>
                    format(addDays(startDate,i),dateFormat)
                </div>
            )
        }
        return <div>{days}</div>
    }

    onDateClick = day => {
        // console.log(day)
        // console.log(this.state.selectedDate)
        this.setState({
            selectedDate: day
          });
    }

    nextMonth = () => {
        this.setState({
            currentMonth:addMonths(this.state.currentMonth,1)
        })
    }
    prevMonth = () => {
        this.setState({
            currentMonth:addMonths(this.state.currentMonth,-1)
        })
    }

    render() {
        // const classes = t;
        return (
            <div className={this.props.classes.content}>
                {this.renderHeader()}
                {this.renderCells()}
                {this.renderFooter()}
            </div>
        )
    }
}
Calendar.propTypes = {
    classes: propTypes.object.isRequired
  };
export default withStyles(styles)(Calendar)