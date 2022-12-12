import React from 'react';
import {OrderList} from 'primereact/orderlist';
import {routeResource} from '../../Constant/ResourceConstant';
import { Button } from 'primereact/button';
const OrderImage = (props) =>{
    const itemTemplate = (item) =>{
        return (
            <div className="p-grid">
                <div className="p-justify-start p-col-11">
                    <img style={{height:'10vh',width:'10vw', maxHeight:'50px', maxWidth:'80px'}} src={(item.objectURL?item.objectURL:item)} alt={'itemImg'}/>
                </div>
                {(!item.objectURL && props.allowRemove)?
                <div className="p-col-1">
                    <Button type='button' onClick={()=>props.onRemove(item)} icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" />
                </div>:null
                }
                
            </div>
        );
    }
    return (
            <OrderList id={props.id} value={props.items} dragdrop listStyle={{height:'auto'}} header={'Album'}
            itemTemplate={itemTemplate} onChange={e => props.onChange(e.value)}
            />
    );
}

export default OrderImage;