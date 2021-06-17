import React from "react";
import Button from "../../components/common/Button/Button";
import "./ModalLayout.scss";

const ModalFormLayout = (props) => {
    const { children, show, handleClose, submit, loading } = props;

    return (
        <div className="modal" style={{display: show? "flex": "none"}}>
            <div className="modal-main" style={{padding: handleClose && submit && 20}}>
                {children}
                { handleClose && submit &&
                <div style={{float:"right"}}>
                    <div className="buttonsContainer">
                        <div style={{marginRight: 10}}>
                            <Button text="Cancelar" onPress={()=>handleClose()} className='cancel'/>
                        </div>
                        <Button loading={loading} type='submit' text="Borrar" onPress={()=>submit()}/>
                    </div>
                </div>
                }
            </div>

        </div>
    );
};
export default ModalFormLayout;
