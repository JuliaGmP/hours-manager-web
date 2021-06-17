import React, { useState, useEffect } from "react";
import CreateUserComponent from "../components/CreateUserComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import { getUserRole, addUser, editUser } from "../../../../services/users";
import { getCalendar } from "../../../../services/userCalendar";
import { getAllRoles } from "../../../../services/roles";


const CreateUserContainer = (props) => {
    const {user, createUserPageVisible, setCreateUserPageVisible, userToEdit, setUserToEdit} = props;
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState(null);
    const [userRole, setUserRole] = useState();

    useEffect(() => {
        getAvailableRoles()
    }, []);

    useEffect(() => {
        if(userToEdit !== undefined) getUserRoleById()
    }, [userToEdit]);

    const getUserRoleById = async () =>{
        const response= await getUserRole(userToEdit.rolesID[0], user.token)
        setUserRole(response)
    }

    const submit = async ({ name, email, rol, schedule}) => {
        setLoading(true)
        try {
            const userCalendarID = await getCalendar(schedule, user.token);
            let response;
            console.log(rol)
            if(userToEdit !== undefined){
                const userData = {
                    name: name,
                    email: email,
                    userCalendarID: userCalendarID,
                    rolesID: [rol.id]
                  };
                response = await editUser(userToEdit.id, userData, user.token);
            } else {
                const userData = {
                    name: name,
                    email: email,
                    password: "12345678",
                    userCalendarID: userCalendarID,
                    rolesID: [rol.id]
                  };
                response = await addUser(userData, user.token);
            }
            if (response.error) {
                throw response.error;
            } else {
                setCreateUserPageVisible(false);
            }
        } catch (e) {
            console.log("error", e);
        }
        setLoading(false)
    };

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

    const getAvailableRoles = async () => {
        let availableRoles = await getRoles(user.token);
        setRoles(availableRoles)
    };
    
    return <CreateUserComponent 
                getRoles
                loading={loading}
                roles={roles}
                createUserPageVisible={createUserPageVisible} 
                setCreateUserPageVisible={setCreateUserPageVisible} 
                userToEdit={userToEdit}
                setUserToEdit={setUserToEdit} 
                userRole={userRole}
            />;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateUserContainer));
