import React from 'react';
import {Button} from 'primereact/button';
import {useHistory} from 'react-router-dom';
import './BackBtn.css'

const BackBtn=(props)=>{    
    const _useHistory=useHistory();
    const onClickHandler=()=>{
        _useHistory.goBack();
    }
    return (
            <Button type='button' onClick={onClickHandler} label='Back'/>
    );
}
export default BackBtn;