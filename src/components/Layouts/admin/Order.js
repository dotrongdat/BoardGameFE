import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderStatus, paymentMethodType } from '../../Constant/OrderConstant';
import { toVNDCurrencyFormat, moment } from '../../Utils/Function.util';
import orderService from '../../../service/order.service';
import statusCode from 'http-status-codes';
import _ from 'lodash';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import dateFormat from 'dateformat';
import { Dialog } from 'primereact/dialog';

const ItemTemplate = (props) => {
    return (
        <div style={{minHeight: '20vh'}}>
            <div style={{backgroundColor: '#f7c68d', paddingLeft:'8px'}}><p style={{fontFamily: 'monospace'}}>{props.title}</p></div>
            {props.content}
        </div>
    )
}

const OrderDetail = (props) => {
    const [products,setProducts] = useState([]);
    const [order, setOrder] = useState(props.data);
    const [statusText, setStatusText] = useState('');

    const {allProducts,categories} = useSelector(state=>state);
    
    useEffect(()=>{
        setProducts(props.data.products.map(p=>{
            const product = allProducts.find(i=>i._id === p.product);
            return {...p, product};
        }))
        setOrder(props.data);
        let statusText = '';
        // const lastStatus = props.data.statuses[props.data.statuses.length-1];
        switch (order.status) {
            case orderStatus.WAITING_CONFIRM:
                statusText = 'Chờ xác nhận';
                break;
            case orderStatus.CONFIRMED:
                statusText = 'Đã xác nhận';
                break;
            case orderStatus.WAITING_PICKUP:
                statusText = 'Chờ lấy hàng';
                break;
            case orderStatus.PICK_UP:
                statusText = 'Đã lấy hàng';
                break;
            case orderStatus.DELIVERING:
                statusText = 'Đang vận chuyển';
                break;
            case orderStatus.COMPLETE_DELIVERY:
                statusText = 'Đã hoàn thành';
                break;
            case orderStatus.CANCEL_BY_CUSTOMER:
            case orderStatus.CANCEL_BY_STORE:
                statusText = 'Đã hủy';
                break;
            case orderStatus.WAITING_REFUND:
                statusText = 'Chờ trả hàng/ hoàn tiền';
                break;
            case orderStatus.COMPLETE_REFUND:
                statusText = 'Đã trả hàng/ hoàn tiền';
                break;
            default:
                break;
        }
        setStatusText(statusText);
    },[props.data])

    const nameBodyTemplate = (rowData) => {
        return (
            <div className=''>
                <img className='' src={rowData.product.album[0]} alt={rowData.product.name} style={{height:'5vw',width:'5vw'}}/>
                {/* <div className='p-col-8' style={{width:'50px',whiteSpace:'normal',marginLeft:'5px'}}> */}
                    <span style={{marginLeft: '2px'}}>{rowData.product.name}</span>    
                {/* </div>                        */}              
            </div>
        );        
    }
    const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.product.category).name}</p>
    const priceBodyTemplate = (rowData) => <p>{toVNDCurrencyFormat(rowData.price)} VND</p>
    const quantityBodyTemplate = (rowData) => <p>{rowData.quantity}</p>
    return (
        <Fragment>
            <div className='p-grid p-mt-2' style={{position: 'relative'}}>
                {order.user && <Button style={{position: 'absolute', zIndex: 1, right: '50px', top: '50px'}} type='button' onClick={()=>global.message.addMessageInbox(order.user)} icon='pi pi-comments' className='p-button-rounded p-button-help' tooltip='Gủi tin nhắn' tooltipOptions={{position:'right'}}/>}
                <Divider/>
                <p className='p-col-12' style={{fontWeight: 'bold'}}>Mã đơn hàng: #{order.code}</p>
                <p className='p-col-12'>Ngày đặt: {dateFormat(order.created_at,'HH:mm:ss dd-mm-yyyy')}</p>
                <p className='p-col-12'>Trạng thái: {statusText}</p>
                <div className='p-col-3'>
                    <ItemTemplate title='Địa chỉ giao hàng' content = {
                        <Fragment>
                            <p style={{fontWeight: 'bolder'}}>{order.info.address.province}</p>
                            <p>{order.info.address.detail}, {order.info.address.ward}, {order.info.address.district}, {order.info.address.province}</p>
                        </Fragment>
                    }/>
                    <ItemTemplate title='Thông tin người nhận' content = {
                        <Fragment>
                            <div className='p-d-flex p-jc-between'>
                                <p>Họ và tên</p>
                                <p>{order.info.receiverName}</p>
                            </div>
                            <div className='p-d-flex p-jc-between'>
                                <p>Số điện thoại</p>
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
                    <ItemTemplate title="Phương thức vận chuyển" content={'GHN'}/>
                    <ItemTemplate title="Phương thức thanh toán" content={
                        <Fragment>
                            {(order.info.paymentMethod.type === paymentMethodType.COD) && <p>Thanh toán khi nhận hàng</p>}
                            {(order.info.paymentMethod.type === paymentMethodType.PAYPAL) && <p>Paypal</p>}
                            {(order.info.paymentMethod.type === paymentMethodType.VNPAY) && <p>VNPay</p>}
                        </Fragment>
                    }/>
                </div>
                <div className='p-col-6'>
                    <ItemTemplate title="Chi tiết đơn hàng" content = {
                        <Fragment>
                            <DataTable className='p-col-12' responsiveLayout="scroll" dataKey='product._id' value={products} showGridlines>
                                <Column header='Tên' body={nameBodyTemplate}/>
                                <Column header='Thương hiệu' body={brandBodyTemplate}/>
                                <Column header='Giá' body={priceBodyTemplate}/>
                                <Column header='Số lượng' field='quantity' body={quantityBodyTemplate}/>
                            </DataTable> 
                            <div className='p-d-flex p-jc-between'>
                                <p style={{fontWeight: 'bolder'}}>Tổng phụ</p>
                                <p>{toVNDCurrencyFormat(order.total)}</p>
                            </div>
                            <div className='p-d-flex p-jc-between'>
                                <p>Phí vận chuyển</p>
                                <p>{toVNDCurrencyFormat(50000)}</p>
                            </div>
                            <div className='p-d-flex p-jc-between'>
                                <p>Giảm</p>
                                <p>-{toVNDCurrencyFormat(50000)}</p>
                            </div>
                            <div className='p-d-flex p-jc-between'>
                                <p style={{fontWeight: 'bolder'}}>Tổng</p>
                                <p style={{color: 'orangered'}}>{toVNDCurrencyFormat(order.total)}</p>
                            </div>
                        </Fragment>
                    }/>
                </div>    
            </div>
        </Fragment>
    )
}
// const OrderTemplate = (props) => {
//     const {categories} = useSelector(state=>state);
//     const nameBodyTemplate = (rowData) => {
//         return (
//             <div className=''>
//                 <img className='' src={rowData.product.album[0]} alt={rowData.product.name} style={{height:'5vw',width:'5vw'}}/>
//                 <span style={{marginLeft: '2px'}}>{rowData.product.name}</span>            
//             </div>
//         );        
//     }
//     const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.product.category).name}</p>
//     const priceBodyTemplate = (rowData) => <p>{toVNDCurrencyFormat(rowData.price)} VND</p>
//     const quantityBodyTemplate = (rowData) => <p>{rowData.quantity}</p>
//     return (
//         <DataTable value={props.data}>
//             <Column body={nameBodyTemplate}/>
//             <Column body={brandBodyTemplate}/>
//             <Column body={priceBodyTemplate}/>
//             <Column body={quantityBodyTemplate}/>
//         </DataTable>
//     );
// }
const OrderListTemplate = (props)=>{
    const [data,setData] = useState([]);
    // const [pagingData,setPagingData] = useState([]);
    // const [totalPage,setTotalPage] = useState(0);
    // const [page,setPage] = useState(0);
    const codeBodyTemplate = (rowData)=> <strong>#{rowData.code}</strong>
    const totalBodyTemplate = (rowData)=>{
        let paymentMethodText;
        switch (rowData.info.paymentMethod.type) {
            case paymentMethodType.PAYPAL:
                paymentMethodText = 'Thanh toán bằng Paypal';
                break;
            case paymentMethodType.VNPAY:
                paymentMethodText = 'Thanh toán bằng VNPay';
                break;
            case paymentMethodType.COD:
                paymentMethodText = 'Thanh toán khi nhận hàng';
                break;
            default:
                break;
        }
        return(
            <div className='p-grid p-jc-start'>
                <p className='p-col-12' style={{color: 'coral'}}>{toVNDCurrencyFormat(rowData.total)} VND</p>
                <Tag style={{backgroundColor: 'grey'}} value={paymentMethodText}/>
            </div>
        )
    }
    const statusBodyTemplate = (rowData) => {
        let statusText;
        // const lastStatus = rowData.statuses[rowData.statuses.length-1];
        switch (rowData.status) {
            case orderStatus.WAITING_CONFIRM:
                statusText = 'Chờ xác nhận';
                break;
            case orderStatus.CONFIRMED:
                statusText = 'Đã xác nhận';
                break;
            case orderStatus.WAITING_PICKUP:
                statusText = 'Chờ lấy hàng';
                break;
            case orderStatus.PICK_UP:
                statusText = 'Đã lấy hàng';
                break;
            case orderStatus.DELIVERING:
                statusText = 'Đang vận chuyển';
                break;
            case orderStatus.COMPLETE_DELIVERY:
                statusText = 'Đã hoàn thành';
                break;
            case orderStatus.CANCEL_BY_CUSTOMER:
            case orderStatus.CANCEL_BY_STORE:
                statusText = 'Đã hủy';
                break;
            case orderStatus.WAITING_REFUND:
                statusText = 'Chờ trả hàng/ hoàn tiền';
                break;
            case orderStatus.COMPLETE_REFUND:
                statusText = 'Đã trả hàng/ hoàn tiền';
                break;
            default:
                break;
        }
        const severity = ['danger','primary','success','info','warning'].at(rowData.status%5);
        return (
            <div className='p-grid p-jc-start'>
                <Tag severity={severity} value={statusText}/>
                <div className='p-col-12 p-grid p-jc-start'>
                    <p style={{fontSize: '60%'}}>{moment(rowData.updated_at).format('LLL')}</p>
                </div>
            </div>
        )
    }
    const orderDateBodyTemplate = (rowData) => {
        return <p>{moment(rowData.created_at).format('LLL')}</p>
    }
    const actionTemplate = (rowData) => {
        return (
            <Fragment>
                <div className='p-grid p-jc-between'>
                    <Button type='button' icon="pi pi-search" onClick={()=>props.onClickDetail(rowData)} className="p-button-rounded p-button-warning p-col" aria-label="Search"/>
                    {[orderStatus.WAITING_CONFIRM, orderStatus.WAITING_PICKUP, orderStatus.WAITING_REFUND].includes(rowData.status) && <Button type='button' icon="pi pi-check" onClick={()=>props.onClickCheck(rowData)}  className="p-button-rounded p-button-success p-col p-ml-1"/>}
                    {[orderStatus.WAITING_CONFIRM].includes(rowData.status) && <Button type='button' icon="pi pi-times" onClick={()=>props.onClickDeny(rowData)} className="p-button-rounded p-button-danger p-col p-ml-1"/>}
                </div>
            </Fragment>
        )
    }
    useEffect(()=>{
        setData(_.cloneDeep(props.data));
    },[props.data])
    return (
        <DataTable value={data} emptyMessage="Không có đơn hàng" >
            <Column header='#Code' body={codeBodyTemplate}/>
            <Column header='Tổng' body={totalBodyTemplate}/>
            <Column header='Trạng thái' body={statusBodyTemplate}/>
            <Column header='Thời gian đặt hàng' body={orderDateBodyTemplate}/>
            <Column body={actionTemplate}/>
        </DataTable>
    );
}

const Order = (props) => {
    const dispatch = useDispatch();
    const {orders} = useSelector(state=>state);

    const [selectedOrder,setSelectedOrder] = useState();
    const [isVisibleDetailOrder,setIsVisibleDetailOrder] = useState(false);
    //const [orders,setOrders] = useState();
    const [waitingApproveOrders,setWaitingApproveOrders] = useState([]);
    // const [totalPageWaitingApproveOrders,setTotalPageWaitingApproveOrders] = useState(0);
    // const [pageWaitingApproveOrders,setPageWaitingApproveOrders] = useState(0);

    const [waitingPickupOrders,setWaitingPickupOrders] = useState([]);
    // const [totalPageWaitingPickupOrders,setTotalPageWaitingPickupOrders] = useState(0);
    // const [pageWaitingPickupOrders,setPageWaitingPickupOrders] = useState(0);
    
    const [deliveringOrders,setDeliveringOrders] = useState([]);
    // const [totalPageDeliveringOrders,setTotalPageDeliveringOrders] = useState(0);
    // const [pageDeliveringOrders,setPageDeliveringOrders] = useState(0);
    
    const [completeOrders,setCompleteOrders] = useState([]);
    // const [totalPageCompleteOrders,setTotalPageCompleteOrders] = useState(0);
    // const [pageCompleteOrders,setPageCompleteOrders] = useState(0);
    
    const [cancelOrders,setCancelOrders] = useState([]);
    // const [totalPageCancelOrders,setTotalPageCancelOrders] = useState(0);
    // const [pageCancelOrders,setPageCancelOrders] = useState(0);
    const [refundOrders,setRefundOrders] = useState([]);
    useEffect(()=>{
        if(orders){
            setWaitingApproveOrders(orders[String(orderStatus.WAITING_CONFIRM)].concat(orders[String(orderStatus.CONFIRMED)]));
            setWaitingPickupOrders(orders[String(orderStatus.WAITING_PICKUP)].concat(orders[String(orderStatus.PICK_UP)]));
            setDeliveringOrders(orders[String(orderStatus.DELIVERING)]);
            setCompleteOrders(orders[String(orderStatus.COMPLETE_DELIVERY)]);
            setCancelOrders(orders[String(orderStatus.CANCEL_BY_CUSTOMER)].concat(orders[String(orderStatus.CANCEL_BY_STORE)]));
            setRefundOrders(orders[String(orderStatus.WAITING_REFUND)].concat(orders[String(orderStatus.COMPLETE_REFUND)]));
        }
    },[JSON.stringify(orders)])
    useEffect(()=>{
        const initData = async () => {
            const res = await orderService.getByStatus({
                status: Object.values(orderStatus)
            });
            if(res.status === statusCode.OK) {
                const {orders} = res.data.payload
                dispatch({type: 'initOrder', orders})
            }
        }
        !orders && initData();
        global.socket.on("order",order=> dispatch({type: 'addOrder', order}));

        return ()=>{
            global.socket.off("order");
        }
    },[]);
    const onClickCheckHandler = async (order,statuses) => {
        const res = await orderService.updateStatus({order,statuses});
        if (res.status === statusCode.OK){
            global.toast.show({severity:'success', summary: 'Thao tác đơn hàng', detail: 'Thành công', life: 1500});
            const prevStatus = order.statuses[order.statuses.length-1];
            dispatch({type: 'updateOrder', prevStatus, order: res.data.payload.order });
        }
        
    } 
    const onClickDenyHandler = async (order) => {
        const res = await orderService.updateStatus({order,statuses: orderStatus.CANCEL_BY_STORE});
        if (res.status === statusCode.OK){
            global.toast.show({severity:'success', summary: 'Hủy đơn hàng', detail: 'Đã hủy', life: 1500});
            const prevStatus = order.statuses[order.statuses.length-1];
            dispatch({type: 'updateOrder', prevStatus, order: res.data.payload.order });
        }
    }
    const onClickDetailOrderHandler = (order) => {
        setSelectedOrder(order);
        setIsVisibleDetailOrder(true);
    }
    return (
        <div>
            <Dialog maximizable modal header="Chi tiết đơn hàng" visible={isVisibleDetailOrder} style={{ width: '50vw' }} onHide={()=>setIsVisibleDetailOrder(false)}>
                <OrderDetail data={selectedOrder}/>
            </Dialog>
            <Tag value="Quản lí đơn hàng" style={{backgroundColor:'#7a7a7a'}}/>
            <div>
                <TabView>
                    <TabPanel header='Chờ xác nhận'>
                        <OrderListTemplate data={waitingApproveOrders} 
                            onClickCheck={(order)=>onClickCheckHandler(order,[orderStatus.CONFIRMED,orderStatus.WAITING_PICKUP])} 
                            onClickDeny={(order)=>onClickDenyHandler(order)}
                            onClickDetail={onClickDetailOrderHandler}
                        />
                    </TabPanel>
                    <TabPanel header='Chờ lấy hàng'>
                        <OrderListTemplate data={waitingPickupOrders} 
                            onClickCheck={(order)=>onClickCheckHandler(order,[orderStatus.PICK_UP,orderStatus.DELIVERING])}
                            onClickDetail={onClickDetailOrderHandler}
                        />
                    </TabPanel>
                    <TabPanel header='Đang vận chuyển'>
                        <OrderListTemplate data={deliveringOrders} 
                            onClickCheck={(order)=>onClickCheckHandler(order,[orderStatus.COMPLETE_DELIVERY])}
                            onClickDetail={onClickDetailOrderHandler}
                        />
                    </TabPanel>
                    <TabPanel header='Đã hoàn thành'>
                        <OrderListTemplate data={completeOrders}
                            onClickDetail={onClickDetailOrderHandler}
                        />
                    </TabPanel>
                    <TabPanel header='Đã hủy'>
                        <OrderListTemplate data={cancelOrders}
                            onClickDetail={onClickDetailOrderHandler}
                        />
                    </TabPanel>
                    <TabPanel header='Trả hàng/ Hoàn tiền'>
                        <OrderListTemplate data={refundOrders} 
                            onClickCheck={(order)=>onClickCheckHandler(order,[orderStatus.COMPLETE_REFUND])}
                            onClickDetail={onClickDetailOrderHandler}
                        />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    )
};

export default Order;