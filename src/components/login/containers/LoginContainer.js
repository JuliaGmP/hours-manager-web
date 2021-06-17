import React, { useState } from "react";
import LoginComponent from "../components/LoginComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import { login, getUserProfile } from "../../../services/auth";
import { getUserRole } from "../../../services/users";
import { getTenant } from "../../../services/tenants";

const LoginContainer = (props) => {
    const { updateUser } = props;
    const [error, setError] = useState(undefined);
    const [companiesSelector, setCompaniesSelector] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async ({email, password}) => {
        setLoading(true)
        try{
            const response = await login(email, password);
            if(response.error) throw new Error('Error en las credenciales');
            const userProfile = await getUserProfile(response.token);
            const user = {
                email: email,
                token: response.token,
                name: userProfile.name,
                id: userProfile.id,
                userCalendarID: userProfile.userCalendarID,
                rolesID: userProfile.rolesID
            };
            const roles = await getUserRoleName(user.rolesID, user.token)
            if(roles.includes("Admin")){
                user.admin = true;
                updateUser(user);
                localStorage.setItem('user', JSON.stringify(user));
            }
            else{
                user.admin = false;
                updateUser(user);
                localStorage.setItem('user', JSON.stringify(user));
            }
            props.history.push("/home");

        }
        catch(e){
            console.log('error', e);
            setError("Error en las credenciales.");
        }
        setLoading(false)
    };

    const getUserRoleName = async (rolesIDs, token) => {
        let roles = []
        for (const roleId of rolesIDs){
            const response= await getUserRole(roleId, token)
            console.log(token)
            if(!response.error) roles.push(response.role)
        }
        return roles;
    }

    return <LoginComponent {...props} loading={loading} submit={submit} error={error}/>;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginContainer));
