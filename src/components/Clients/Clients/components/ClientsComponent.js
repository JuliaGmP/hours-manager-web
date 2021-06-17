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
    const [createClientPageVisible, setCreateClientPageVisible] = useState(false);
    const {history, isAdmin , user} = props;
    const [clientToEdit, setClientToEdit] = useState(undefined);

    return (
        createClientPageVisible ? 
        <CreateClientContainer user={user} setClientToEdit={setClientToEdit} clientToEdit={clientToEdit} createClientPageVisible={createClientPageVisible} setCreateClientPageVisible={setCreateClientPageVisible}/>
        :
        <PageLayout title={"Clientes"} isAdmin={isAdmin} addButton onPress={()=>{setCreateClientPageVisible(!createClientPageVisible); setClientToEdit(undefined)}} >
            <div className="ClientsComponent">
               <ClientList history={history} token={user.token} setClientToEdit={setClientToEdit} setCreateClientPageVisible={setCreateClientPageVisible}/>
            </div> 
        </PageLayout>
    );
};

const ClientList = (props) =>{
    const {history, setClientToEdit, token, setCreateClientPageVisible} = props;
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(undefined);
    const [loadingDelete, setLoadingDelete] = useState(false);

    useEffect(() => {
        setLoading(true)
        getAllClients()
    }, []);

    const getAllClients = async () =>{
        try{
            const response = await getClients(token);
            if(response.error) throw new Error('Error');
            setData(response)
            setLoading(false)
        }
        catch(e){
            console.log('error', e);
            return;
        }
    }

    const deleteClientByID = async (client) => {
        setLoadingDelete(true)
        try{
            const responseDeleteUser = await deleteClient(client.id, token)
            const responseDeleteClientProjects = await deleteClientProjects(client.id, token);
            if (responseDeleteUser.status === 204) {
                setData(data.filter((item) => item.id !== client.id))
                setClientToDelete(undefined)
            }
        } 
        catch(e){
            console.log('error', e);
            return;
        }
        setLoadingDelete(false)
    }

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
