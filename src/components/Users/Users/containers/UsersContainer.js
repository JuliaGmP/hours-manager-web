import React, { useState, useEffect } from "react";
import UsersComponent from "../components/UsersComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import {getAllRoles} from "../../../../services/roles"

const UsersContainer = (props) => {
   
    const getRoles = async () =>{
        try{
            const response = await getAllRoles(props.user.token);
            if(response.error) throw new Error('Error');
            return response;
        }
        catch(e){
            console.log('error', e);
            return;
        }
    }

    return <UsersComponent 
                history={props.history}
                user={props.user}
                isAdmin={props.user.admin}
                getRoles={getRoles}/>;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersContainer));
