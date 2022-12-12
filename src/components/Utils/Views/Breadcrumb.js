import React,{forwardRef, Fragment, useImperativeHandle, useState} from 'react';
import {BreadCrumb as PBreadcrumb} from 'primereact/breadcrumb';
import { useHistory } from 'react-router-dom';
import { BACKGROUND_COLOR } from '../../Constant';

const Breadcrumb = (props,ref) => {
    const [items,setItems] = useState([]);
    const _useHistory = useHistory();
    const home = { icon: 'pi pi-home', command: () => _useHistory.push('/')}

    useImperativeHandle(ref,()=>({
        push: (label='',url='/') => setItems(prevData=>[...prevData,{label,command: ()=> _useHistory.push(url)}]),
        pullAll: () => setItems([])
    }))

    return (
        <Fragment>
            {items.length > 0 && <PBreadcrumb style={{backgroundColor: BACKGROUND_COLOR, borderColor: BACKGROUND_COLOR}} home={home} model={items}/>}
        </Fragment>
    )
}

export default forwardRef(Breadcrumb);