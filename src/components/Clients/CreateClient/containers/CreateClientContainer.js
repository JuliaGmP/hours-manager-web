import React, { useState, useEffect } from "react";
import CreateClientComponent from "../components/CreateClientComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateUser } from "../../../../redux/actions/userActions";
import { withRouter } from "react-router-dom";
import { editClient , addClient} from "../../../../services/clients"

const CreateClientContainer = (props) => {
    const {tenants, user, tenantsSelected, createClientPageVisible,setCreateClientPageVisible, clientToEdit, setClientToEdit} = props;
    const [loading, setLoading] = useState(false);

    const submit = async ({ name, web, email, phone}) => {
        setLoading(true)
        try {
            const clientData = {
                name: name,
                email: email,
                web: web,
                phone: phone.toString(),
              };
            let response;
            if(clientToEdit !== undefined){
              response = await editClient(clientToEdit.id, clientData, user.token);
            } else{
              response = await addClient(clientData, user.token);
            }
            if (response.error) {
                throw response.error;
            } else {
                setCreateClientPageVisible(false);
            }
        } catch (e) {
            console.log("error", e);
        }
        setLoading(false)
    };
    
    return <CreateClientComponent 
                loading={loading}
                submit={submit}
                tenants={tenants} 
                user={user}
                tenantsSelected={tenantsSelected}
                createClientPageVisible={createClientPageVisible}
                setCreateClientPageVisible={setCreateClientPageVisible}
                clientToEdit={clientToEdit} 
            />;
};

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateUser }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateClientContainer));
