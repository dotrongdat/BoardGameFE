import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

// eslint-disable-next-line import/no-anonymous-default-export
export default (message,title,accept,reject=()=>{})=>{
    const config={
        message,
        header : title,
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept,
        reject
    }
    return confirmDialog(config); 
}

const ConfirmDialogV2 = forwardRef((props,ref) =>{
    const [isVisible,setIsVisible] = useState(false);
    const [message,setMessage] = useState('');
    const [title,setTitle] = useState('');
    const [reject,setReject] = useState(()=>{});
    const [accept,setAccept] = useState(()=>{});

    useImperativeHandle(ref,()=>({
        alert: (message,title,accept=()=>{},reject=()=>{})=>{            
            setMessage(message);
            setTitle(title);
            setAccept(accept);
            setReject(reject);
            setIsVisible(true);
        }
    }))
    return (
        <ConfirmDialog acceptClassName='p-button-danger' icon='pi pi-info-circle'
            message={message} header={title} accept={accept} reject={reject}
            visible={isVisible} onHide={()=>setIsVisible(false)}
        />
    )
})

export {
    ConfirmDialogV2
}