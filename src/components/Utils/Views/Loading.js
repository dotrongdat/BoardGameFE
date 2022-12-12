import React,{useState,useImperativeHandle, forwardRef} from 'react';
import {ProgressSpinner} from 'primereact/progressspinner';

const Loading = (props,ref)=>{
    const [isLoading,setIsLoading] = useState(false);
    useImperativeHandle(ref,()=>({
        isLoading,
        show : () => setIsLoading(true),
        hide : () => setIsLoading(false)
    }))
    return (
        <React.Fragment>
            {isLoading && <div style={{height:'100vh',width:'100vw',position:'fixed',zIndex:'1',backgroundColor:'white',opacity:'0.6'}}>
                <div className='p-grid p-align-center vertical-container' style={{height:'100vh'}}>
                    <ProgressSpinner className='p-col' style={{width: '80px', height: '80px'}} strokeWidth="8" animationDuration=".5s"/>
                </div>
            </div>}  
        </React.Fragment>            
    );
}

export default forwardRef(Loading);