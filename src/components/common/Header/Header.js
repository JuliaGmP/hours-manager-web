import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import "./header.scss";

const HeaderComponent = (props) => {
    const { updateUser } = props;

    const logout = () => {
        updateUser({});
        localStorage.clear();
        props.history.push("/");
    };

    return (
        <div className="header-component">
            <div className="titleContainer">
                <div className="titleBold">HOURS MANAGER</div>
            </div>
            <div className="logout">
                <div className="userName" onClick={()=>props.history.push("/user-profile")}>{props.user.name}</div>
                <div className="userName" onClick={() => logout()}>Cerrar sesión</div>
            </div>
        </div>
    );
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderComponent));
