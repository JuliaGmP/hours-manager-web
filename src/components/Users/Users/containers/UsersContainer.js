import React, { useState, useEffect } from "react";
import UsersComponent from "../components/UsersComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import {getAllRoles} from "../../../../services/roles"

import { getUserCalendar, getUserRole, deleteUser, getUsers } from "../../../../services/users";
import { deleteUserHours } from "../../../../services/hours";

const UsersContainer = (props) => {
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userToDelete, setUserToDelete] = useState(undefined);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [createUserPageVisible, setCreateUserPageVisible] = useState(false);

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

    
    useEffect(() => {
        setLoading(true)
        getAllUsers()
    }, []);

        
    useEffect(() => {
        setLoading(true)
        getAllUsers()
    }, [createUserPageVisible]);

    const getAllUsers = async () =>{
        try{
            const response = await getUsers(props.user.token);
            console.log(response)
            if(response.error) throw new Error('Error');
            for(const item of response) {
                const calendar = await getUserCalendarContainer(item.userCalendarID)
                item.calendar = calendar.schedule
                const roles = await getUserRoleName(item.rolesID)
                item.roles = roles
            }
            setData(response)
            setLoading(false)
        }
        catch(e){
            console.log('error', e);
            return;
        }
    }

    const getUserCalendarContainer = async (userCalendarID) => {
        const response = await getUserCalendar(props.user.token, userCalendarID);
        if(!response.error) return response;
    }

    
    const getUserRoleName = async (rolesIDs) => {
        let roles = []
        for (const roleId of rolesIDs){
            const response= await getUserRole(roleId, props.user.token)
            if(!response.error) roles.push(response.role)
        }
        return roles;
    }

    const deleteUserByID = async (user) => {
        setLoadingDelete(true)
        try{
            const responseDeleteUser = await deleteUser(user.id, props.user.token)
            const responseDeleteHours = await deleteUserHours(user.id, props.user.token)
            if (responseDeleteUser.status === 204) {
                setData(data.filter((item) => item.id !== user.id))
                setUserToDelete(undefined)
            }
        } 
        catch(e){
            console.log('error', e);
            return;
        }
        setLoadingDelete(false)
    }

    return <UsersComponent 
                history={props.history}
                user={props.user}
                isAdmin={props.user.admin}
                getRoles={getRoles}
                data={data}
                loading={loading}
                userToDelete={userToDelete}
                setUserToDelete={setUserToDelete}
                loadingDelete={loadingDelete}
                setLoadingDelete={setLoadingDelete}
                deleteUserByID={deleteUserByID}
                createUserPageVisible={createUserPageVisible}
                setCreateUserPageVisible={setCreateUserPageVisible}
                />;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersContainer));
