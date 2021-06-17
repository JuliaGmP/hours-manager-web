import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

const AuthMiddleware = (props) => {
    const { user, children } = props;
    if (!user.token) {
        return <Redirect to="/login" />;
    }
    return <React.Fragment>{children}</React.Fragment>;
};
const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthMiddleware));
