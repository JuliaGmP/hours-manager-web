import React, { useState, useEffect } from "react";
import ClientsComponent from "../components/ClientsComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";

const ClientsContainer = (props) => {
    
    return <ClientsComponent 
            history={props.history}
            user={props.user} 
            isAdmin={props.user.admin}
            />;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientsContainer));
