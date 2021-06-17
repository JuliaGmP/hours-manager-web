import React, { useState, useEffect } from "react";
import PageLayout from "../../../../layouts/PageLayout/PageLayout";
import {getClients} from "../../../../services/clients"
import { getProjects, getProjectHours, deleteProject, getStatus} from "../../../../services/projects"
import { deleteProjectHours } from "../../../../services/hours";
import {formatHour, toHex} from "../../../../services/utils"
import {  getUserName } from "../../../../services/users"
import Circle from "../../../common/Circle/Circle"
import CreateProjectContainer from "../../CreateProject/container/CreateProjectContainer"

import "./ProjectsComponent.scss";

import TableWrapper from "../../../common/TableWrapper/TableWrapper";

import Lottie from 'react-lottie';
import animationData from '../../../../assets/lottie/loading.json'
import ModalLayout from "../../../../layouts/ModalLayout/ModalLayout"
import _ from "lodash";
import ReactTooltip from 'react-tooltip';

const ProjectsComponent = (props) => {
    const [createProjectPageVisible, setCreateProjectPageVisible] = useState(false);
    const {history, user, isAdmin} = props;
    const [projectToEdit, setProjectToEdit] = useState(undefined);
    const [disabledSelector, setDisabledSelector] = useState(undefined);

    return (
        createProjectPageVisible ? 
        <CreateProjectContainer user={user} projectToEdit={projectToEdit} setProjectToEdit={setProjectToEdit} createProjectPageVisible={createProjectPageVisible} setCreateProjectPageVisible={setCreateProjectPageVisible}/>
        :
        <PageLayout title={"Proyectos"} isAdmin={isAdmin} addButton onPress={()=>{setCreateProjectPageVisible(!createProjectPageVisible); setProjectToEdit(undefined)}} >
            <div className="ProjectsComponent">
                <ProjectList isAdmin={isAdmin} user={user} history={history} token={user.token} setProjectToEdit={setProjectToEdit} setCreateProjectPageVisible={setCreateProjectPageVisible} setDisabledSelector={setDisabledSelector}/>
            </div> 
        </PageLayout>
    );
};


const ProjectList = (props) =>{
    const {history, token, setProjectToEdit, setCreateProjectPageVisible, setDisabledSelector, isAdmin, user} = props;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [clients, setClients] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(undefined);
    const [loadingDelete, setLoadingDelete] = useState(false);

    useEffect(() => {
        getAllProjects()
    }, []);

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
                        const userResponse = await getUserName(userId, token)
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
        setDisabledSelector(undefined)

    }

    const getAllProjects = async () =>{
        setLoading(true)
        setDisabledSelector(true)
        try{
            const clientsResponse = await getClients(token)
            setClients(clientsResponse)
            let response;
            if( isAdmin ) 
                response = await getProjects(clientsResponse, token); 
            else    
                response = await getProjects(clientsResponse, token, user.id); 
            for(const item of response) {
                const hours = await getProjectHours(item.id, token);
                item.hours = hours
            }
            if(response.length === 0) setDisabledSelector(undefined)
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
            const responseDeleteUser = await deleteProject(client.id, token)
            const responseDeleteHours = await deleteProjectHours(client.id, token)
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

    const handleEditProject = (project) =>{
        setCreateProjectPageVisible(true)
        setProjectToEdit(project)
    }

    const lottieDefaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData
      };

    return(
        
        <div style={{paddingRight:20, paddingLeft:20}}>
            <TableWrapper headers={["Nombre", "Cliente asociado", "Usuarios", "Progreso", "", ""]}>
            {data && data.length && !loading > 0
                    ? data.map( (item, i) => {
                        const progressWidth = Math.round(((item.hours/item.estimatedHours)*100 + Number.EPSILON) * 100) / 100
                        console.log(progressWidth)
                        return(
                            <tr key={i}>
                                <td className="element clickable" onClick={()=>{history.push("/proyectos-graficas", { project: item });}}>{item.name}</td>
                                <td className="element">{clients.length !== 0 ? clients.find((itemFilter) => itemFilter.id === item.idClient).name : null}</td>
                                <td className="element">
                                    <div className="users-container">
                                    {!loadingUsers && item.userNames !== undefined && item.userNames.length !== 0 ?
                                     item.userNames.map((item)=>{
                                        return (
                                            <div data-tip={item} >
                                                <ReactTooltip />
                                                <Circle customSize={30} color={toHex(item)}><div>{item[0]}</div></Circle>
                                            </div>
                                        )
                                     })
                                     : 
                                     loadingUsers ?  
                                     <div className="loading-users">          
                                        <Lottie options={lottieDefaultOptions}
                                                height={30}
                                                width={30}
                                        /> 
                                     </div>
                                     :
                                     null
                                    }
                                    </div>
                                </td>
                                <td className="element">{item.estimatedHours + " h"}</td>
                                <td className="element">
                                    <Progress 
                                        onWarningClick={()=>{history.push("/proyectos-graficas", { project: item });}} 
                                        width={progressWidth} 
                                        estimatedHours={item.estimatedHours} 
                                        hours={item.hours}
                                        />
                                </td>
                                <td className="element"><img className="delete-icon" onClick={()=>{setProjectToDelete(item)}} src={require("../../../../assets/bin.png")} alt="" /></td>
                                <td className="element"><img className="delete-icon" onClick={()=>{handleEditProject(item)}} src={require("../../../../assets/editPencilIcon.png")} alt="" /></td>
                            </tr>
                      )})
                    : null}
            </TableWrapper>
            {loading ?
            <div className="loading">
                <Lottie options={lottieDefaultOptions}
                        height={100}
                        width={100}
                /> 
            </div> 
            : 
            data.length === 0 && <div className="loading">Sin datos</div>
            }
            <ModalLayout loading={loadingDelete} show={projectToDelete !== undefined} handleClose={()=>setProjectToDelete(undefined)} submit={()=>{deleteProjectByID(projectToDelete)}}>
                <div className="text">¿Estás seguro que quieres borrar el proyecto {projectToDelete && projectToDelete.name} y sus horas asignadas?</div>
            </ModalLayout>   
        </div>

    )
}

const Progress = (props) =>{
    const {width, estimatedHours, hours,} = props;
    return (
        <div className="progress-container">
            <div className="progress-bar-container">
                <div className="progress-bar">
                    <div className="progress-bar-green" style={{width:width+"%", backgroundColor: width>100 ?  "#FF3C3C": "#BBE28A" }}></div>
                </div>
                <div style={{color: width>100 ?  "#FF3C3C": null, marginTop: 10 }}>{`${formatHour(hours)}h de ${estimatedHours}h (${width}%)`}</div>
            </div>
        </div>

    )
}

export default ProjectsComponent;
