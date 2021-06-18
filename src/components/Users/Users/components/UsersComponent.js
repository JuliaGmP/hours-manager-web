import React, { useState, useEffect } from "react";
import PageLayout from "../../../../layouts/PageLayout/PageLayout";
import "./UsersComponent.scss";
import CreateUserContainer from "../../CreateUser/containers/CreateUserContainer"

import TableWrapper from "../../../common/TableWrapper/TableWrapper";
import {getStringSchedule} from "../../../../services/utils";
import Lottie from 'react-lottie';
import animationData from '../../../../assets/lottie/loading.json'
import ModalLayout from "../../../../layouts/ModalLayout/ModalLayout"
import _ from "lodash";

const UsersComponent = (props) => {
    const {
        history,
        user,
        isAdmin,
        getRoles,
        loading,
        userToDelete,
        setUserToDelete,
        loadingDelete,
        data,
        deleteUserByID,
        createUserPageVisible,
        setCreateUserPageVisible
    } = props;
    const [userToEdit, setUserToEdit] = useState(undefined);


    return (
        createUserPageVisible ? 
        <CreateUserContainer user={user} userToEdit={userToEdit} setUserToEdit={setUserToEdit} getRoles={getRoles} createUserPageVisible={createUserPageVisible} setCreateUserPageVisible={setCreateUserPageVisible}/>
        :
        <PageLayout title={"Usuarios"} isAdmin={isAdmin} addButton onPress={()=>{setCreateUserPageVisible(!createUserPageVisible); setUserToEdit(undefined)}} >
            <div className="UsersComponent">
                <UsersList 
                history={history} 
                token={user.token} 
                setCreateUserPageVisible={setCreateUserPageVisible} 
                setUserToEdit={setUserToEdit}
                loading={loading}
                userToDelete={userToDelete}
                setUserToDelete={setUserToDelete}
                loadingDelete={loadingDelete}
                deleteUserByID={deleteUserByID}
                data={data}
                />
            </div> 
        </PageLayout>
    );
};

const UsersList = (props) =>{
    const {
        history,
        token,
        setCreateUserPageVisible,
        setUserToEdit,
        loading,
        userToDelete,
        setUserToDelete,
        loadingDelete,
        deleteUserByID,
        data
    } = props;


    const handleEditUser = (user) =>{
        setCreateUserPageVisible(true)
        setUserToEdit(user)
    }

    const lottieDefaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData
      };

    return(
        <div style={{paddingRight:20, paddingLeft:20}}>
            <TableWrapper headers={["Nombre", "Puesto", "Horario", "Rol", "", ""]}>
            {data && data.length > 0 && !loading
                    ? data.map( (item, i) => {
                        return(
                            <tr key={i}>
                                <td className="element clickable" onClick={()=>{history.push("/usuarios-graficas", { user: item });}}>{item.name}</td>
                                <td className="element">{item.name}</td>
                                <td className="element">{getStringSchedule(item.calendar)}</td>
                                <td className="element">{item.roles}</td>
                                <td className="element"><img className="delete-icon" onClick={()=>{setUserToDelete(item)}} src={require("../../../../assets/bin.png")} alt="" /></td>
                                <td className="element"><img className="delete-icon" onClick={()=>{handleEditUser(item)}} src={require("../../../../assets/editPencilIcon.png")} alt="" /></td>
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
            <ModalLayout loading={loadingDelete} show={userToDelete !== undefined} handleClose={()=>setUserToDelete(undefined)} submit={()=>{deleteUserByID(userToDelete)}}>
                <div className="text">¿Estás seguro que quieres borrar a {userToDelete && userToDelete.name}?</div>
            </ModalLayout>     
        </div>

    )
}
export default UsersComponent;
