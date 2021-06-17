import React, { useState, useEffect } from "react";
import TableWrapper from "../TableWrapper/TableWrapper"
import Button from "../Button/Button"
import Circle from "../Circle/Circle"
import ModalLayout from "../../../layouts/ModalLayout/ModalLayout"
import {getUsers} from "../../../services/users"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FaCheck } from 'react-icons/fa';
import { getUserRole } from "../../../services/users";
import { toHex } from "../../../services/utils"
import Lottie from 'react-lottie';
import animationData from '../../../assets/lottie/loading.json'

const UsersField = (props) => {

    const {onChange, value, label, oneOption} = props;
    const [showModal, setShowModal] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [temporaryselectedUsers, setTemporarySelectedUsers] = useState([]);

    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if( value !== null && value.length !== 0) {
            setSelectedUsers(value)
            setTemporarySelectedUsers(value)
        }
    }, [value]);

    useEffect(() => {
        getAllUsers()
    }, []);

    useEffect(() => {
        onChange(selectedUsers)
    }, [selectedUsers]);

    const getAllUsers = async () =>{
        setLoading(true)
        try{
            const response = await getUsers(props.user.token);
            if(response.error) throw new Error('Error');
            for(const item of response) {
                const roles = await getUserRoleName(item.rolesID)
                item.roles = roles
            }
                setAllUsers(response)
                setDataList(response)
            
        }
        catch(e){
            console.log('error', e);
            return;
        }
        setLoading(false)
    }
    
    const searchFilterFunction = text => {
        console.log(text)
        const newData = allUsers.filter(item => {
            const itemData = item.name.toUpperCase()
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setDataList(newData);
    };

    const addUser = (user) =>{
        if(oneOption){
            if (temporaryselectedUsers.find(tempUser => tempUser.name === user.name)) setTemporarySelectedUsers([])
            else setTemporarySelectedUsers([user])
        } else {
            if (temporaryselectedUsers.find(tempUser => tempUser.name === user.name)) setTemporarySelectedUsers(temporaryselectedUsers.filter(item => item.name !== user.name))
            else setTemporarySelectedUsers(temporaryselectedUsers => [...temporaryselectedUsers, user] )
        }
    }

    const getUserRoleName = async (rolesIDs) => {
        let roles = []
        for (const roleId of rolesIDs){
            const response= await getUserRole(roleId, props.user.token)
            if(!response.error) roles.push(response.role)
        }
        return roles;
    }

    const lottieDefaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData
      };


    return(
        <div>
            <ModalLayout show={showModal}>
                <div style={{padding: 25, width: 600}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom: "1px solid #F7F7F7", paddingBottom:20}}>
                    <div style={{fontSize:20}} className="title-input">Miembros</div>
                    <div style={{display:"flex", alignItems:"center"}}>
                        <div style={{display: "flex", height: 40}} className="input-container">
                            <img className="search-icon" src={require("../../../assets/searchIcon.png")} alt="" />
                            <input style={{border:"none"}} placeholder="Buscar usuario" onChange={(value)=>searchFilterFunction(value.target.value)} />
                        </div>
                    </div>
                   
                </div>
                <div className="checkbox-items">
                    {dataList && dataList.length > 0 && !loading
                        ? dataList.map( (item, i) => {
                            console.log(temporaryselectedUsers.indexOf(item))

                            return(
                                <div className="checkbox-item" key={i}>
                                    <div className={temporaryselectedUsers.find(user => user.name === item.name) ? "checkbox checked" : "checkbox"} onClick={() =>addUser(item)}>
                                        {
                                            temporaryselectedUsers.find(user => user.name === item.name) &&
                                            <FaCheck />
                                        }
                                    </div>
                                    <div className="item-name">{item.name}</div>
                                </div>
                          )})
                        : null}
                </div>
                <div className="button-wrapper"> 
                    <Button className="cancel button left-button" text="CANCELAR" onPress={()=>{setShowModal(false)}}/>
                    <Button className="button" text="AÑADIR" onPress={()=>{setShowModal(false); setSelectedUsers(temporaryselectedUsers);}}/>
                </div>
                </div>
            </ModalLayout>
            <div style={{display:"flex", alignItems:"center", paddingBottom: 20}}>
                <div style={{marginBottom: 0}} className="title-input">{label}</div>
                <Button text="Añadir" onPress={()=>setShowModal(true)} style={{marginLeft: 20, padding: 10}} icon={"whiteAdd.png"}/>
            </div>
            {selectedUsers && selectedUsers.length > 0
                ?
                <TableWrapper headers={["","Nombre", "Puesto","Rol"]}> 
                    {selectedUsers.map( (item, i) => {
                        return(
                            <tr key={i}>
                                <td className="element">
                                    <Circle customSize={30} color={toHex(item.name)}><div>{item.name[0]}</div></Circle>
                                </td>
                                <td className="element"><div className="item-name">{item.name}</div></td>
                                <td className="element">{item.name}</td>
                                <td className="element">{item.roles}</td>
                            </tr>
                      )})}
                </TableWrapper>
                :             
                loading && 
                <div className="loading">
                    <Lottie options={lottieDefaultOptions}
                            height={100}
                            width={100}
                    /> 
                </div> 
            }
        </div>
    )
}

const mapStateToProps = (store) => ({
    user: store.userReducer.user
});


export default withRouter(connect(mapStateToProps)(UsersField));

