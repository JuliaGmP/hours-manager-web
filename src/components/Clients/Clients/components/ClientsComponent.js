import React, { useState, useEffect } from "react";
import PageLayout from "../../../../layouts/PageLayout/PageLayout";
import {getClients, deleteClient} from "../../../../services/clients"
import {deleteClientProjects} from "../../../../services/projects"

import "./ClientsComponent.scss";

import TableWrapper from "../../../common/TableWrapper/TableWrapper";
import Lottie from 'react-lottie';
import animationData from '../../../../assets/lottie/loading.json'
import ModalLayout from "../../../../layouts/ModalLayout/ModalLayout"
import CreateClientContainer from "../../CreateClient/containers/CreateClientContainer"

const ClientsComponent = (props) => {
    const {history, isAdmin , user, data, loading, deleteClientByID, loadingDelete, setClientToDelete, clientToDelete} = props;
    const [clientToEdit, setClientToEdit] = useState(undefined);
    const [createClientPageVisible, setCreateClientPageVisible] = useState(false);

    return (
        createClientPageVisible ? 
        <CreateClientContainer user={user} setClientToEdit={setClientToEdit} clientToEdit={clientToEdit} createClientPageVisible={createClientPageVisible} setCreateClientPageVisible={setCreateClientPageVisible}/>
        :
        <PageLayout title={"Clientes"} isAdmin={isAdmin} addButton onPress={()=>{setCreateClientPageVisible(!createClientPageVisible); setClientToEdit(undefined)}} >
            <div className="ClientsComponent">
               <ClientList 
                data={data} 
                loading={loading} 
                loadingDelete={loadingDelete}
                deleteClientByID={deleteClientByID}
                history={history} 
                token={user.token} 
                setClientToEdit={setClientToEdit} 
                setCreateClientPageVisible={setCreateClientPageVisible}
                setClientToDelete={setClientToDelete}
                clientToDelete={clientToDelete}
                />
            </div> 
        </PageLayout>
    );
};

const ClientList = (props) =>{
    const {history, setClientToEdit, token, setCreateClientPageVisible, data, loading, loadingDelete, deleteClientByID, setClientToDelete, clientToDelete} = props;

    const handleEditClient = (client) =>{
        setCreateClientPageVisible(true)
        setClientToEdit(client)
    }

    const lottieDefaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData
      };

    return(
        <div style={{paddingRight:20, paddingLeft:20}}>
            <TableWrapper headers={["Nombre", "Web", "Correo", "Teléfono", "", ""]}>
            {data && data.length > 0 && !loading
                    ? data.map( (item, i) => {
                        return(
                            <tr key={i}>
                                <td className="element clickable" onClick={()=>{history.push("/clientes-graficas", { client: item });}}>{item.name}</td>
                                <td className="element">{item.web}</td>
                                <td className="element">{item.email}</td>
                                <td className="element">{item.phone}</td>
                                <td className="element"><img className="delete-icon" onClick={()=>{setClientToDelete(item)}} src={require("../../../../assets/bin.png")} alt="" /></td>
                                <td className="element"><img className="delete-icon" onClick={()=>{handleEditClient(item)}} src={require("../../../../assets/editPencilIcon.png")} alt="" /></td>
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
            <ModalLayout loading={loadingDelete} show={clientToDelete !== undefined} handleClose={()=>setClientToDelete(undefined)} submit={()=>{deleteClientByID(clientToDelete)}}>
                <div className="text">¿Estás seguro que quieres borrar a {clientToDelete && clientToDelete.name} y sus proyectos asignados?</div>
            </ModalLayout>  
        </div>

    )
}
export default ClientsComponent;
