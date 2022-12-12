import React, { useEffect, useState } from 'react';
import {Galleria as GalleriaP} from 'primereact/galleria';
import { NO_IMAGE } from '../../Constant';
const Galleria = (props)=>{
    const [activeIndex,setActiveIndex] = useState(0);
    const itemTemplate = (item) => <img src={item? item.objectURL || item : ''} onError={e=> e.currentTarget.src = NO_IMAGE} alt='itemTemp' style={{ width: '100%',height: '45vh', borderRadius: '5px', borderColor: 'green', borderStyle:'solid', borderWidth: 'medium'}}/>;
    const thumbnailTemplate = (item) => <img src={item ? item.objectURL || item : ''} onError={e=> e.currentTarget.src = NO_IMAGE} style={{width:'3vw',height:'3vw', marginRight:'0.1vh',borderRadius: '5px', borderColor: 'white', borderStyle:'solid', borderWidth: 'thin'}} alt='thumbnailTemplate'/>
    useEffect(()=>{
        setActiveIndex(0);
    },[props.items])
    return (
        <GalleriaP activeIndex={activeIndex} value={props.items} numVisible={5} onItemChange={(e)=>setActiveIndex(e.index)} item={itemTemplate} thumbnail={thumbnailTemplate}/>
    );
};
export default Galleria;