import React, { useState, useEffect } from "react";
import PageLayout from "../../../../layouts/PageLayout/PageLayout";
import {formatHour, toHex} from "../../../../services/utils"
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
    const {
        history,
        user,
        isAdmin,
        loading,
        loadingUsers,
        clients,
        projectToDelete,
        setProjectToDelete,
        deleteProjectByID,
        loadingDelete,
        data,
        createProjectPageVisible,
        setCreateProjectPageVisible
    } = props;
    const [projectToEdit, setProjectToEdit] = useState(undefined);

    return (
        createProjectPageVisible ? 
        <CreateProjectContainer user={user} projectToEdit={projectToEdit} setProjectToEdit={setProjectToEdit} createProjectPageVisible={createProjectPageVisible} setCreateProjectPageVisible={setCreateProjectPageVisible}/>
        :
        <PageLayout title={"Proyectos"} isAdmin={isAdmin} addButton onPress={()=>{setCreateProjectPageVisible(!createProjectPageVisible); setProjectToEdit(undefined)}} >
            <div className="ProjectsComponent">
                <ProjectList 
                isAdmin={isAdmin} 
                data={data} 
                loading={loading} 
                loadingUsers={loadingUsers} 
                clients={clients} 
                projectToDelete={projectToDelete} 
                user={user} 
                history={history} 
                token={user.token} 
                setProjectToEdit={setProjectToEdit} 
                setCreateProjectPageVisible={setCreateProjectPageVisible} 
                setProjectToDelete={setProjectToDelete}
                deleteProjectByID={deleteProjectByID}
                loadingDelete={loadingDelete}
                />
            </div> 
        </PageLayout>
    );
};


const ProjectList = (props) =>{
    const {
        isAdmin,
        data,
        loading,
        loadingUsers, 
        clients,
        projectToDelete, 
        user, 
        history,
        token, 
        setProjectToEdit,
        setCreateProjectPageVisible,
        setProjectToDelete,
        deleteProjectByID,
        loadingDelete
    } = props;

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
