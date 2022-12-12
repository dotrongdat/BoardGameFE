import React, { useState } from 'react';
import {FileUpload as FileUploadP} from 'primereact/fileupload';
import path from 'path';
import {validFileExtension, validFileType} from '../../Constant/ResourceConstant';

const FileUpload =(props) => {
    const [files,setFiles] = useState([]);
    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly:true, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly:true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};
    
    const onSelectMultipleTemplate = (e) =>{
        let valid=true;
        //const _refItems=Object.values(props._ref.current.files);
        //const _chooseItems=e.files;
        const chooseItems=[];
        Array.from(e.files).forEach((file)=>{
            if(file.type.startsWith("image/",0)){
                // if(_chooseItems.includes(file)) 
                chooseItems.push(file);
            }else valid=false;
        })
        props.isValidFileHandler(valid);
        props.onChoose(chooseItems);
        setFiles(e.files);
    }
    const onSelectSingleTemplate = (e) => {
        let valid=true;
        if(e.files.length > 0){
            //const _refItem= props._ref.current.files[0];
            //const _chooseItem=e.files[0];
            let chooseItem = {};
            if(e.files[0].type.startsWith("image/",0)){
                chooseItem = e.files[0];
            } else valid = false;
            props.isValidFileHandler(valid);
            props.onChoose(chooseItem);
        } 
        setFiles(e.files);     
    }
    const onRemoveTemplate = (e)=>{
        let valid=true;
        Array.from(files).map((file)=>{
            if(!(file.type.startsWith("image/",0) && file!==e.file)) 
            valid=false;
        })
        props.isValidFileHandler(valid);
        props.onRemove(e.file.objectURL);
    }
    const onClearTemplate = (e) =>{
        props.onClear();
    }
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
            <FileUploadP id={props.id} style={{fontSize:'70%'}} headerTemplate={headerTemplate} emptyTemplate={emptyTemplate} 
            chooseOptions={chooseOptions} cancelOptions={cancelOptions} 
            onSelect={props.multiple?onSelectMultipleTemplate:onSelectSingleTemplate} onRemove={onRemoveTemplate} onClear={onClearTemplate}
            ref={props._ref} multiple={props.multiple} accept="image/*" maxFileSize={1000000}/>
    );
}

export default FileUpload;