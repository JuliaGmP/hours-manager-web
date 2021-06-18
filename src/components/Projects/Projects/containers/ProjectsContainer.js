import React, { useState, useEffect } from "react";
import ProjectsComponent from "../components/ProjectsComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import {getClients} from "../../../../services/clients"
import { getProjects, getProjectHours, deleteProject, getStatus} from "../../../../services/projects"
import { deleteProjectHours } from "../../../../services/hours";
import {  getUserName } from "../../../../services/users"

const ProjectsContainer = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [clients, setClients] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(undefined);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [createProjectPageVisible, setCreateProjectPageVisible] = useState(false);

    useEffect(() => {
        getAllProjects()
    }, []);

    useEffect(() => {
        getAllProjects()
    }, [createProjectPageVisible]);

    useEffect(() => {
        if(!loading) {
            getProjectUsers()
        }
    }, [loading]);

    const getProjectUsers = async () =>{
        setLoadingUsers(true)
        const dataCopy = data;
        for(const item of dataCopy) {
            if(item.userIDs !== undefined){
                item.userNames = []
                for (const userId of item.userIDs){
                    try{
                        const userResponse = await getUserName(userId, props.user.token)
                        if(userResponse.error) throw new Error(userResponse.error)
                        item.userNames.push(userResponse.name)
                    } catch (e){
                        console.log(e)
                    }
                }
            }
        }
        setData(dataCopy)
        setLoadingUsers(false)

    }

    const getAllProjects = async () =>{
        setLoading(true)
        try{
            const clientsResponse = await getClients(props.user.token)
            setClients(clientsResponse)
            let response;
            if( props.user.admin ) 
                response = await getProjects(clientsResponse, props.user.token); 
            else    
                response = await getProjects(clientsResponse, props.user.token, props.user.id); 
            for(const item of response) {
                const hours = await getProjectHours(item.id, props.user.token);
                item.hours = hours
            }
            setData(response)
        }
        catch(e){
            console.log('error', e);
            return;
        }
        setLoading(false)
    }

    const deleteProjectByID = async (client) => {
        setLoadingDelete(true)
        try{
            const responseDeleteUser = await deleteProject(client.id, props.user.token)
            const responseDeleteHours = await deleteProjectHours(client.id, props.user.token)
            if (responseDeleteUser.status === 204) {
                setData(data.filter((item) => item.id !== client.id))
                setProjectToDelete(undefined)
            }
        } 
        catch(e){
            console.log('error', e);
            return;
        }
        setLoadingDelete(false)
    }

    return <ProjectsComponent 
                history={props.history}
                user={props.user} 
                isAdmin={props.user.admin}
                loading={loading}
                loadingUsers={loadingUsers}
                clients={clients}
                projectToDelete={projectToDelete}
                setProjectToDelete={setProjectToDelete}
                deleteProjectByID={deleteProjectByID}
                loadingDelete={loadingDelete}
                data={data}
                createProjectPageVisible={createProjectPageVisible}
                setCreateProjectPageVisible={setCreateProjectPageVisible}
            />;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectsContainer));
