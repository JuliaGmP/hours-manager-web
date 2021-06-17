import React, { useState, useEffect } from "react";
import UserProfileComponent from "../components/UserProfileComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import { resetUserPassword, editUser } from "../../../services/users"

const UserProfileContainer = (props) => {
    const {updateUser} = props;
    
    const [error, setError] = useState(undefined);
    const [loading, setLoading] = useState(undefined);
    const [editProfile, setEditProfile] = useState(false);

    console.log(props.user)

    const submitChangePassword = async (currentPassword, newPassword) => {
        const bodyReq={
            "oldPassword": currentPassword,
            "newPassword": newPassword
        }
        const response = await resetUserPassword(bodyReq, props.user.token)
        if(response.error) throw new Error()
        console.log(response)
    }

    const submit = async (userName,userEmail) => {
        setLoading(true)
        try{
            const userData = {
                name: userName,
                email: userEmail
              };
            const response = await editUser(props.user.id, userData, props.user.token);
            if(response.error) throw new Error()
            const user = {
                ...props.user,
                email: userEmail,
                name: userName
            };
            updateUser(user);
            setEditProfile(false)
            console.log(response)
        } catch (e) {
            setError("No se puedo actualizar la información de usuario.")
            console.log(e)
        }
        setLoading(false)
    }

    return <UserProfileComponent
                submitChangePassword={submitChangePassword} 
                submit={submit}
                loading={loading}
                user={props.user}
                tenants={(props.user.allTenants || [props.user.tenant])}
                error={error}
                setError={setError}
                editProfile={editProfile}
                setEditProfile={setEditProfile}
            />;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer));
