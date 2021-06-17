import React from "react";
import Header from "../components/common/Header/Header";
import SideNav from "../components/common/SideNav/SideNav";
import "./layout.scss";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const Layout = (props) => {
    const { children } = props;
    return (
        <div className="layout-component">
            <header>
                <Header />
            </header>
            <div className="sidenav">
                <SideNav {...props.location} 
                    isAdmin={props.user.admin} 
                />
            </div>
            <div className="content">{children}</div>
        </div>
    );
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});


export default withRouter(connect(mapStateToProps)(Layout));