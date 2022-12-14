import React, { Fragment, useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import orderService from '../../service/order.service';
import { getKeyValueParamObject, toVNDCurrencyFormat } from '../Utils/Function.util';
import statusCode from 'http-status-codes';
import dateFormat from 'dateformat';
import { paymentMethodType } from '../Constant/OrderConstant';
import { DataTable } from 'primereact/datatable';
import { useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { PRIMARY_COLOR } from '../Constant';
import Product from './Product';
import { Divider } from 'primereact/divider';

const ItemTemplate = (props) => {
    return (
        <div style={{minHeight: '20vh'}}>
            <div style={{backgroundColor: '#f7c68d', paddingLeft:'8px'}}><p style={{fontFamily: 'monospace'}}>{props.title}</p></div>
            {props.content}
        </div>
    )
}
const productCarouselTemplate = (item) => {
    return (
        <div style={{margin: '1.5vh'}}>
            <Product product={item}/>
        </div>
            
                        
    )}
const CheckOutResult = () => {
    const {search, state} = useLocation();

    const {allProducts,categories} = useSelector(state=>state);

    const [isInitialize,setIsInitialize] = useState(state.order ? true : false);
    const [isSuccess,setIsSuccess] = useState(false);
    const [products,setProducts] = useState([]);
    const [order, setOrder] = useState(state.order);

    const _useHistory = useHistory();

    //const dateFormat = dateFormat('HH:mm:ss yyyy-mm-dd');
    useEffect(()=>{
        if(search){
            const paramObject = getKeyValueParamObject(search.substring(1));
            if (paramObject.vnp_ResponseCode === '00'){
                orderService.checkoutVNPay(paramObject)
                .then((res)=>{
                    switch (res.status) {
                        case statusCode.OK:
                            setIsSuccess(true);
                            setOrder(res.data.order);
                            break;
                        case statusCode.METHOD_FAILURE:
                            setIsSuccess(false);
                            break;
                        case statusCode.NOT_ACCEPTABLE:
                            _useHistory.replace('/notAccept');
                            break;
                        default:
                            break;
                    }
                    setIsInitialize(true);
                })
                .catch(()=>{
                    _useHistory.replace('/internalServerError');
                    setIsInitialize(true);
                })
            }else {
                setIsSuccess(false);
                setIsInitialize(true);
            }           
        }
    },[search]);
    useEffect(()=>{
        isInitialize ? global.loading.hide() : global.loading.show();
    },[isInitialize]);
    useEffect(()=>{
        if(state.order){
            const _products = order.products.map(p=>{
                const product = allProducts.find(i=>i._id === p.product);
                return {...p, product};
            });
            setProducts(_products);
            setOrder(state.order);
            setIsSuccess(true);
        }
    },[]);
    const success = () => {
        // const footer = `In total there are ${user.cart.length} products.`;
        const nameBodyTemplate = (rowData) => {
            return (
                <div className=''>
                    <Link to={`/product/${rowData.product._id}`}  style={{textDecoration:'none'}}>
                        <img className='' src={rowData.product.album[0]} alt={rowData.product.name} style={{height:'5vw',width:'5vw'}}/>
                        {/* <div className='p-col-8' style={{width:'50px',whiteSpace:'normal',marginLeft:'5px'}}> */}
                            <span style={{marginLeft: '2px'}}>{rowData.product.name}</span>    
                        {/* </div>                        */}
                    </Link>               
                </div>
            );        
        }
        const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.product.category).name}</p>
        const priceBodyTemplate = (rowData) => <p>{toVNDCurrencyFormat(rowData.price)} VND</p>
        const quantityBodyTemplate = (rowData) => <p>{rowData.quantity}</p>
        return (
            <Fragment>
                <div className='p-grid p-mt-2' style={{}}>
                    <Divider/>
                    <h3 className='p-col-12'>C???m ??n qu?? kh??ch</h3>
                    <p className='p-col-12' style={{fontWeight: 'bold'}}>M?? ????n h??ng: #{order.code}</p>
                    <p className='p-col-12'>Ng??y ?????t: {dateFormat(order.created_at,'HH:mm:ss dd-mm-yyyy')}</p>
                    <div className='p-col-3'>
                        <ItemTemplate title='?????a ch??? giao h??ng' content = {
                            <Fragment>
                                <p style={{fontWeight: 'bolder'}}>{order.info.address.province}</p>
                                <p>{order.info.address.detail}, {order.info.address.ward}, {order.info.address.district}, {order.info.address.province}</p>
                            </Fragment>
                        }/>
                        <ItemTemplate title='Th??ng tin ng?????i nh???n' content = {
                            <Fragment>
                                <div className='p-d-flex p-jc-between'>
                                    <p>Name</p>
                                    <p>{order.info.receiverName}</p>
                                </div>
                                <div className='p-d-flex p-jc-between'>
                                    <p>Tel</p>
                                    <p>{order.info.phone}</p>
                                </div>
                                <div className='p-d-flex p-jc-between'>
                                    <p>Email</p>
                                    <p>{order.info.email}</p>
                                </div>
                            </Fragment>
                        }/>
                    </div>
                    <div className='p-col-3'>
                        <ItemTemplate title="Ph????ng th???c v???n chuy???n" content={'GHN'}/>
                        <ItemTemplate title="Ph????ng th???c thanh to??n" content={
                            <Fragment>
                                {(order.info.paymentMethod.type === paymentMethodType.COD) && <p>Thanh to??n khi nh???n h??ng</p>}
                                {(order.info.paymentMethod.type === paymentMethodType.PAYPAL) && <p>Paypal</p>}
                                {(order.info.paymentMethod.type === paymentMethodType.VNPAY) && <p>VNPay</p>}
                            </Fragment>
                        }/>
                    </div>
                    <div className='p-col-6'>
                        <ItemTemplate title="Chi ti???t ????n h??ng" content = {
                            <Fragment>
                                <DataTable className='p-col-12' responsiveLayout="scroll" dataKey='product._id' value={products} showGridlines>
                                    <Column header='T??n' body={nameBodyTemplate}/>
                                    <Column header='Th????ng hi???u' body={brandBodyTemplate}/>
                                    <Column header='Gi??' body={priceBodyTemplate}/>
                                    <Column header='S??? l?????ng' field='quantity' body={quantityBodyTemplate}/>
                                </DataTable> 
                                <div className='p-d-flex p-jc-between'>
                                    <p style={{fontWeight: 'bolder'}}>T???ng ph???</p>
                                    <p>{toVNDCurrencyFormat(order.total)}</p>
                                </div>
                                <div className='p-d-flex p-jc-between'>
                                    <p>Ph?? v???n chuy???n</p>
                                    <p>{toVNDCurrencyFormat(50000)}</p>
                                </div>
                                <div className='p-d-flex p-jc-between'>
                                    <p>Gi???m</p>
                                    <p>-{toVNDCurrencyFormat(50000)}</p>
                                </div>
                                <div className='p-d-flex p-jc-between'>
                                    <p style={{fontWeight: 'bolder'}}>T???ng</p>
                                    <p style={{color: 'orangered'}}>{toVNDCurrencyFormat(order.total)}</p>
                                </div>
                            </Fragment>
                        }/>
                        {/* <div className='p-d-flex p-jc-end'>
                            <Button type='button' onClick={()=>_useHistory.push('/')} label='S???n ph???m kh??c'/>
                        </div> */}
                    </div>    
                </div>
                <Divider/>
                <div class="p-mt-4" style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', borderRadius: '10px'}}>
                    <div className='p-col-12' style={{backgroundColor: PRIMARY_COLOR, position: 'relative', borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}>
                        <h3 style={{fontFamily: 'cursive', fontWeight: 'lighter',color: 'white', margin: '1vh'}}>S???n ph???m li??n quan</h3>
                        <Link style={{position: 'absolute', right: '10px', top: '30%',textDecoration: 'none',fontFamily: 'cursive',color: 'white'}}>{'Xem th??m >'}</Link>                    
                    </div>
                    <Carousel style={{margin: '10px'}} value={allProducts.slice(0,8)} numVisible={4} numScroll={4} itemTemplate={productCarouselTemplate}/>
                </div>
            </Fragment>
        )
    }
    const fail = () => {
        return (
            <div className='p-mt-2 p-p-4'  style={{backgroundImage: `url('/checkoutFailPage.png')`, backgroundSize: '100% 100%', width: '100%', height: '70vh',borderRadius:'10px'}}>
                <Button  type='button' onClick={()=>_useHistory.replace('/cart')} label='Gi??? h??ng'/>
            </div>
        )
    }
    return (
        <Fragment>
            {isInitialize && (isSuccess ? success() : fail())}
        </Fragment>
    )
};

export default CheckOutResult;