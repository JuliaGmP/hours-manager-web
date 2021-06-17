import React, { useState, useEffect } from "react";
import {addProject, editProject, getStatusList, getProjectTypeList} from "../../../../services/projects"
import { getUser, getUserRole } from "../../../../services/users"
import { getClients } from "../../../../services/clients"

import _ from "lodash";
import CreateProjectComponet from "../components/CreateProjectComponet";

const CreateProjectContainer = (props) =>{
    const {user, createProjectPageVisible, setCreateProjectPageVisible, projectToEdit, setProjectToEdit} = props;
    const [loading, setLoading] = useState(false);
    const [projectUsers, setProjectUsers] = useState([])
    const [projectGestor, setProjectGestor] = useState([])

    const [clients, setClients] = useState([]);

    useEffect(() => {
        getAllClients()
    }, [])

    useEffect(() => {
        if(projectToEdit && projectToEdit.userIDs && projectToEdit.userIDs.length !== 0) {
            getUsers()
        }
    }, [projectToEdit])

    const getUsers = async () =>{
        setProjectUsers(await getUsersByIds(projectToEdit.userIDs))
        setProjectGestor(await getUsersByIds([projectToEdit.gestorId]))
    }

    const getAllClients = async () => {
        try{
            const response = await getClients(user.token);
            if(response.error) throw new Error('Error');
            setClients(response)
        }
        catch(e){
            console.log('error', e);
            return;
        }
    }


    const getUsersByIds = async (userIds) =>{
        let users = []
        try{
            for (const userId of userIds){
                const response = await getUser(userId, props.user.token)
                const roles = await getUserRoleName(response.rolesID)
                response.roles = roles
                if(response.error) throw new Error(response.error)
                users.push(response)
            }
        } catch (e) {
            console.log(e)
        }
        return users;
    }

    const getUserRoleName = async (rolesIDs) => {
        let roles = []
        for (const roleId of rolesIDs){
            const response= await getUserRole(roleId, props.user.token)
            if(!response.error) roles.push(response.role)
        }
        return roles;
    }

    const submit = async ({ name, client, estimatedHours, endDate, initialDate, users}) => {
        setLoading(true)
        try {
            const projectData = {
                name: name,
                idClient: client.id,
                estimatedHours: parseInt(estimatedHours),
                endDate: endDate,
                initialDate: initialDate,
                userIDs: users.map(user => user.id),
              };
            let response;
            if(projectToEdit !== undefined){
                response = await editProject(projectToEdit.id, projectData, user.token);
            } else{
                response = await addProject(projectData, user.token);
            }
            if (response.error) {
                throw response.error;
            } else {
                setCreateProjectPageVisible(false);
            }
        } catch (e) {
            console.log("error", e);
        }
        setLoading(false)
    };

    return (
        <CreateProjectComponet 
            user = {user}
            submit = {submit}
            clients = {clients} 
            loading = {loading}
            projectUsers = {projectUsers}
            createProjectPageVisible = {createProjectPageVisible}
            setCreateProjectPageVisible = {setCreateProjectPageVisible}
            projectToEdit = {projectToEdit} 
            setProjectToEdit = {setProjectToEdit}
        />
    )
}

export default CreateProjectContainer;
