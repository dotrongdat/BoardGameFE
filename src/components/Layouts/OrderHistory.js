import React,{useState,useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {useSelector} from 'react-redux';
import {useHistory,Link} from 'react-router-dom';
import { routeResource } from '../Constant/ResourceConstant';
import { Tag } from 'primereact/tag';
import {orderStatus,productOrderStatus} from '../Constant/OrderConstant'
import orderService from '../../service/order.service';
import statusCode from 'http-status-codes';
import {moment} from '../Utils/Function.util.js';
import './Cart.css';

const OrderHistory = () =>{
    const categories=JSON.parse(sessionStorage.getItem('categories'));
    const {user} = useSelector(state=>state);
    const _useHistory = useHistory();

    const [data,setData]=useState();
    const [expandedRow,setExpandedRow] = useState();
    const productBodyTemplate = (rowData)=>{
        return (
            <div>
                <Link to={`/product/${rowData.product._id}`}>
                    <img src={routeResource.image+'/'+rowData.product.album[0]} alt={rowData.product.name} style={{height:'10vh',width:'10vw'}}/>
                </Link>               
                <p>{rowData.product.name}</p>
            </div>
        );    
    }
    const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.product.category).name}</p>
    const priceBodyTemplate = (rowData) => <p>${` ${rowData.price}`}</p>
    const productStatusBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.status === productOrderStatus.PROCESSING && <Tag severity='info' value='Processing'/>}
                {rowData.status === productOrderStatus.CANCEL && <Tag severity='error' value='Canceled'/>}
                {rowData.status === productOrderStatus.COMPLETE && <Tag severity='success' value='Delivered'/>}
            </React.Fragment>
        );
    }
    const orderBodyTemplate = (rowData) => <p>{rowData._id}</p>
    const orderStatusBodyTemplate = (rowData) => {
        return (
            <div>
                {rowData.status === orderStatus.PROCESSING && <Tag severity='info' value='Processing'/>}
                {rowData.status === orderStatus.CANCEL && <Tag severity='error' value='Canceled'/>}
                {rowData.status === orderStatus.COMPLETE && <Tag severity='success' value='Delivered'/>}
            </div>
        );
    }
    const dateBodyTemplate = (rowData) => <p>{moment(rowData.created_at).format('MMMM Do YYYY, h:mm:ss a')}</p>
    const totalBodyTemplate = (rowData) => <p>${` ${rowData.total}`}</p>
    const rowExpansionTemplate  = (data)=>{
       return (
        <div className='orders-subtable'>
                <DataTable value={data.products}>
                    <Column header='Product' body={productBodyTemplate}/>
                    <Column header='Brand' body={brandBodyTemplate}/>
                    <Column header='Price' body={priceBodyTemplate}/>
                    <Column header='Quantity' field='quantity'/>
                    <Column header='Status' body={productStatusBodyTemplate}/>
                </DataTable>
        </div>
       );
    }
    const rowClassName = () =>{
        return {
            'enable': true
        }
    }
    useEffect(()=>{
        const getData = async ()=>{
            global.loading.show();
            const res=await orderService.get();
            switch(res.status){
                case statusCode.OK:
                    setData(res.data.payload.order);
                    break;
                case statusCode.UNAUTHORIZED:  
                    _useHistory.replace('/signin');
                    break;
                default:
            }
            global.loading.hide();
        }
        getData();
    },[user.order]);
    return (
        <div>
            <div className='p-grid p-justify-center p-mt-6'>
                <DataTable className='cart p-col-10' value={data} expandedRows={expandedRow} rowExpansionTemplate={rowExpansionTemplate}
                    onRowToggle={e=>setExpandedRow(e.data)} showGridlines stripedRows rowClassName={rowClassName}
                > 
                    <Column expander style={{width:'3em'}}/> 
                    <Column header='Order' body={orderBodyTemplate}/>
                    <Column header='Date' sortable sortField='created_at' body={dateBodyTemplate}/>
                    <Column header='Total' sortable sortField='total' body={totalBodyTemplate}/>
                    <Column header='Status' sortable sortField='status' body={orderStatusBodyTemplate}/>
                </DataTable>
            </div>
        </div>
    );
}

export default OrderHistory;