import {Toast} from 'primereact/toast';
import React,{useRef} from 'react';

const CustomToast = ()=>{
    const toast=useRef();
    
    return (
        <Toast ref={toast}/>
    );
}