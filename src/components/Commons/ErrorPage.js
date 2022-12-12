import { Button } from 'primereact/button';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { BACKGROUND_COLOR } from '../Constant';

const Template = (props) => {
    const _useHistory = useHistory();
    return(
        <div className='p-grid p-justify-center' style={{marginRight: '1px',backgroundColor: BACKGROUND_COLOR}}>
            <div className='p-mt-2 p-col-8 p-mb-2 p-jc-center p-grid vertical-container'  style={{backgroundImage: `url(${props.src})`, backgroundSize: '100% 100%', height:'83vh',borderRadius:'10px', position: 'relative'}}>
                <Button className='p-mb-4 p-col-1 p-as-end p-button-outlined' icon='pi pi-home' onClick={()=>_useHistory.replace('/')} label='Home'/>
            </div>
        </div> 
    )         
}
const ServerInternalError = () => {
    return <Template src='/serverInternalError.jpg'/>
}
const PageNotFound = () => {
    return <Template src='/pageNotFound.jpg'/>
}
const DenyPage = () => {
    return <Template src='/denyPage.jpg'/>
}
export {
    PageNotFound,
    ServerInternalError,
    DenyPage
}