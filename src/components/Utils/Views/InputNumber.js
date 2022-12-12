import React, { useEffect, useState } from 'react';
import {InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';

const InputNumber = (props) => {
    // const [value,setValue] = useState(props.value || 0);
    // useEffect(()=>{ 
    //     props.value && setValue(props.value);
    // },[props.value]);
    return(
        <div className=''>
            <Button disabled={(props.value-1)<props.min} className='p-col-1 p-button-secondary' icon='pi pi-minus' onClick={()=>props.beforeValueChange(props.value - 1)}/>
            <InputText disabled className={`p-col-${props.size||9}`} keyfilter='num' 
                onChange={(e)=>props.beforeValueChange(e.target.value ? parseInt(e.target.value):undefined)}
                tooltip={props.tooltip || ''} 
                tooltipOptions={{position: 'bottom', disabled: props.tooltip ? false: true}}
                
                value={props.value.toString()}/>
            <Button disabled={(props.value+1)>props.max} className='p-col-1 p-button-secondary' icon='pi pi-plus' onClick={()=>props.beforeValueChange(props.value + 1)}/>
        </div>
    )
}
export default InputNumber;