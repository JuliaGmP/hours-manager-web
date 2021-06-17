import React, { useState, useEffect } from "react";
import HomeComponent from "../components/HomeComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";

const HomeContainer = (props) => {


    return <HomeComponent 
        token={props.user.token}
        userId={props.user.id}
        userCalendarID={props.user.userCalendarID}
        isAdmin={props.user.admin}/>;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeContainer));
