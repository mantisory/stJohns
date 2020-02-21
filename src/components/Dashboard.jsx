import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import propTypes from 'prop-types';
import Calendar from './Calendar'


    
const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
    //   padding: theme.spacing(2),
    },
  });
class Dashboard extends Component {
    render() {
        return (
           <div>
               <Calendar />
           </div>
        )
    }
}
Dashboard.propTypes = {
    classes: propTypes.object.isRequired
  };

  export default withStyles(styles)(Dashboard);