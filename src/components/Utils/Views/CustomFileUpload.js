import React from 'react';
import {FileUpload} from 'primereact/fileupload';

const CustomFileUpload = (props)=>{
    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};
    
    const headerTemplate = options =>{
        const {className, chooseButton, cancelButton} = options;
        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {cancelButton}               
            </div>
        );
    }
    const emptyTemplate = () => <p className="p-m-0">Drag and drop files to here to upload.</p> ;
    return (
        <div>
            <FileUpload headerTemplate={headerTemplate} emptyTemplate={emptyTemplate} 
            chooseOptions={chooseOptions} cancelOptions={cancelOptions} 
            onSelect={e=>console.log(e.files)}
            ref={props.ref} multiple accept=".jpg,.png" maxFileSize={1000000}/>
        </div>
    );
}

export default CustomFileUpload;