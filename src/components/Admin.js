import React, { Component } from 'react'
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import DataMethods from '../utils/data'

 class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRedirecting:false
        }
    }
    
    componentDidUpdate(){
        if(this.props.user.username !== 'Admin'){
            this.setState({isRedirecting : true})
        }else{
            
        }
    }
    render() {
      if(this.state.isRedirecting){
        return <Redirect to="/" />;
      }
        return (
            <div>
                Admin screen
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
      user: state.auth.user
    };
  };
export default connect(mapStateToProps)(Admin)
    