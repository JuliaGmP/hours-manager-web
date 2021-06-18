import React, { useState, useEffect } from "react";
import ClientsComponent from "../components/ClientsComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import {getClients, deleteClient} from "../../../../services/clients"
import {deleteClientProjects} from "../../../../services/projects"

const ClientsContainer = (props) => {
    const [data, setData] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(undefined);
    const [createClientPageVisible, setCreateClientPageVisible] = useState(false);

    useEffect(() => {
        setLoading(true)
        getAllClients()
    }, []);

    useEffect(() => {
        setLoading(true)
        getAllClients()
    }, [createClientPageVisible]);

    const getAllClients = async () =>{
        try{
            const response = await getClients(props.user.token);
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
            const responseDeleteUser = await deleteClient(client.id, props.user.token)
            const responseDeleteClientProjects = await deleteClientProjects(client.id, props.user.token);
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

    return <ClientsComponent 
            history={props.history}
            loadinig={loading}
            loadingDelete={loadingDelete}
            deleteClientByID={deleteClientByID}
            clientToDelete={clientToDelete}
            setClientToDelete={setClientToDelete}
            data={data}
            user={props.user} 
            isAdmin={props.user.admin}
            createClientPageVisible={createClientPageVisible}
            setCreateClientPageVisible={setCreateClientPageVisible}
            />;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientsContainer));
