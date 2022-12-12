import React,{useEffect,useState,useRef} from 'react';
import {Link,useParams,useHistory} from 'react-router-dom';
import orderService from '../../service/order.service';
import statusCode from 'http-status-codes';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { routeResource } from '../Constant/ResourceConstant';
import { orderStatus, productOrderStatus , paymentMethodType} from '../Constant/OrderConstant';
import {SelectButton } from 'primereact/selectbutton';
import {InputText} from 'primereact/inputtext';
import {Form} from 'react-bootstrap'; 
import {Button} from 'primereact/button';
import {Tag} from 'primereact/tag';
import BackButton from '../Utils/Views/BackBtn';
import {Card} from 'primereact/card';
import { useSelector } from 'react-redux';

const Order = ()=>{
    const [data,setData] = useState();
    const [messageFeedBack,setMessageFeedBack] = useState();
    const [productStatus,setProductStatus] = useState();
    const [orderedUser,setOrderedUser] = useState();

    const messageRef = useRef();
    
    const {_id}=useParams();
    
    const {categories} = useSelector(state=>state);

    const _useHistory = useHistory();
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
        const options = [
            {icon: 'pi pi-ban',value: productOrderStatus.CANCEL},
            {icon: 'pi pi-check',value: productOrderStatus.APPROVED}
        ] 
        const itemTemplate = (option)=>{
            return (
                <i className={`${option.icon}  ${(options.value === productOrderStatus.CANCEL)?'p-text-error':'p-text-success'}`}/>
            )
        }
        const onChangeHandler = (e) =>{
            setProductStatus(prevData =>{
                return {...prevData,[rowData._id]:e.value}
            })
        }
        return (
            <SelectButton unselectable={false} disabled={data.status===orderStatus.APPROVED} value={productStatus[rowData._id]} itemTemplate={itemTemplate} options={options} onChange={onChangeHandler}/>
        );
    }
    const messageBodyTemplate = (rowData) => {
        const onChangeHandler = (e)=>{
            setMessageFeedBack(prevData=>{
                return {...prevData,[rowData._id]:e.target.value};
            })
        }
        return (
            <div>
                <InputText onChange={onChangeHandler} ref={messageRef} placeholder='Lời nhắn ...'/>
            </div>
        );
    }
    const userInfoTemplate = () =>{
        return (
            <React.Fragment>
                {/* <h6>{`User: ${orderedUser.name}`}</h6> */}
                <h6>{`Người nhận hàng: ${data.info.receiverName}`}</h6>
                <h6>{`Email: ${data.info.email}`}</h6>
                <h6>{`Địa chỉ: ${data.info.address}`}</h6>
                <h6>{`Số điện thoại: ${data.info.phone}`}</h6>
                <h6>{`Phương thức thanh toán: ${renderPaymentMethod(data.info.paymentMethod.type)}`}</h6>
                <Button type='button' onClick={onClickMessageButtonHandler} icon='pi pi-comments' className='p-button-rounded p-button-help' tooltip='Gủi tin nhắn' tooltipOptions={{position:'right'}}/>
            </React.Fragment>
        );
    }
    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        if(data.status===orderStatus.PROCESSING){
            let order = {...data};       
            order.products = order.products.map(i=>{
                return {...i,product:i.product._id}
            }) 
            order.products.forEach((product,index)=>{
                order.products[index].status=productStatus[product._id];
                order.products[index].message=messageFeedBack[product._id];
            });
            order.message = messageRef.current.value;
            
            const res = await orderService.approve({order});
            switch (res.status) {
                case statusCode.OK:
                    setData(prevData=>{
                        return {...prevData,status:orderStatus.APPROVED};
                    })
                    global.toast.show({severity:'success', summary: 'Approve Order', detail: 'Successfully', life: 1500});
                    break;
                case statusCode.UNAUTHORIZED:
                    _useHistory.replace('/signin');
                    break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Server Error', detail: 'Error', life: 1500});
                    break;
                default:
            }
        }
        
    }
    useEffect(()=>{
        const getData = async ()=>{
            const res = await orderService.get({_id});
            switch (res.status) {
                case statusCode.OK:
                    const {order,orderedUser} = res.data.payload;
                    let message = {};
                    let _productStatus = {};
                    order.products.forEach(product=>{
                        message={...message,[product._id]:''};
                        _productStatus= {..._productStatus,[product._id]:product.status};
                    })
                    setMessageFeedBack(message);
                    setProductStatus(_productStatus);
                    setData(order);
                    setOrderedUser(orderedUser);
                    break;
                case statusCode.UNAUTHORIZED:
                    _useHistory.replace('/signin');
                    break;
                default:
            }
        };
        getData();
    },[_id])
    const headerTemplate = () => <h3>{`#${data._id}`}</h3>
    const onClickMessageButtonHandler = ()=>{
        global.message.addMessageInbox(orderedUser);
    }
    const renderPaymentMethod = (type)=>{
        switch (type) {
            case paymentMethodType.COD:
                return 'COD';
            case paymentMethodType.PAYPAL:
                return 'Paypal';
            default:
                return 'Unknown';
        }
    }
    const view = ()=>{
        return (
            <React.Fragment>
                {data.status===orderStatus.APPROVED && <Tag className='p-col-4 p-mb-2' icon="pi pi-info-circle" severity="info" value="This order has been approved"/>}
                <Card className='p-col-11' header={headerTemplate}>
                    {userInfoTemplate()}
                </Card>
                <Form className='p-col-10' onSubmit={onSubmitHandler}>
                    <DataTable value={(data) ? data.products : []}>
                        <Column header='Product' body={productBodyTemplate}/>
                        <Column header='Brand' body={brandBodyTemplate}/>
                        <Column header='Quantity' field='quantity'/>
                        <Column header='Price' body={priceBodyTemplate}/>
                        <Column header='' body={productStatusBodyTemplate}/>
                        <Column header='Message' body={messageBodyTemplate}/>
                    </DataTable>   
                <Button type='submit' disabled={data.status===orderStatus.APPROVED} className='p-mr-4' icon='pi pi-check-square' label='Approve'/>
                <BackButton/>
            </Form>
            </React.Fragment>
        );
    }
    return (
        <div className='p-grid p-justify-center p-mt-4'>
            {data && orderedUser && view()}
        </div>
    );
}

export default Order;