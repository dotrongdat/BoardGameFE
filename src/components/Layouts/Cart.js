import React,{useEffect,useState,useCallback} from 'react';
import './Cart.css';
import {useSelector} from 'react-redux';
import {DataTable} from 'primereact/datatable';
import userService from '../../service/user.service';
import statusCode from 'http-status-codes';
import {useHistory,Link} from 'react-router-dom';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import orderService from '../../service/order.service';
import {Sidebar} from 'primereact/sidebar';
import CheckOut from './CheckOut';
import CustomConfirmDialog from '../Notifications/CustomConfirmDialog';
import { toVNDCurrencyFormat } from '../Utils/Function.util';
import InputNumber from '../Utils/Views/InputNumber';
import { BACKGROUND_COLOR } from '../Constant';

const Cart = () =>{
    const _useHistory = useHistory();

    const {user,categories,allProducts} = useSelector(state=>state);
    const [selectedProduct,setSelectedProduct] = useState([]);
    const [quantityInputValue,setQuantityInputValue] = useState();
    const [total,setTotal]=useState(0);
    const [checkoutSideBar,setCheckoutSideBar]=useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [cart,setCart] = useState([]);
    
    const onChangeQuantityInputHandler = (value,_id) =>{
        let func = () => {
            if(value || value === 0){
                const updateCart =  ()=>{
                    if(quantityInputValue[_id].available >= value){
                        let {cart} = user;
                        const index = cart.findIndex(i=>i._id===_id);
                        cart[index].quantity = value;
                        userService.updateCart(cart);
                        return true;
                    } return false;                        
                }
                const remove = ()=>{
                    let {cart} = user;
                    cart = cart.filter(i=> i._id!==_id);
                    userService.updateCart(cart);
                }
                const reject = ()=>{}
                if(value === 0){
                    CustomConfirmDialog("B???n mu???n x??a s???n ph???m n??y kh???i gi??? h??ng ?","Gi??? h??ng",()=>{
                        remove();
                        global.toast.show({severity:'success', summary: 'Gi??? h??ng', detail: 'S???n ph???m ???? ???????c x??a kh???i gi??? h??ng', life: 1500});
                    },reject);
                }else {
                    if(updateCart()) global.toast.show({severity:'success', summary: 'Gi??? h??ng', detail: 'Gi??? h??ng ???? ???????c c???p nh???t', life: 1500});
                }
            }
        }
        func();
    };
    const onClickConfirmCartHandler = useCallback(async() => {
        global.loading.show();
        const res = await orderService.validate({cart:user.cart});
        switch (res.status){
            case statusCode.OK:
                setCheckoutSideBar(true);
                break;
            case statusCode.BAD_REQUEST:
                global.toast.show({severity:'error', summary: 'L???i', detail: 'S???n ph???m kh??ng h???p l??? trong gi??? h??ng, vui l??ng ki???m tra l???i!', life: 1500});               
                break;
            case statusCode.UNAUTHORIZED:  
                _useHistory.replace('/signin');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'L???i h??? th???ng', detail: res.data.message, life: 1500});
                break;
            default:
        }
        global.loading.hide();
    },[]);
    const onClickDeleteAllHandler = ()=>{
        CustomConfirmDialog('B???n mu???n x??a s???n ph???m n??y kh???i gi??? h??ng?','Gi??? h??ng',()=>{
            let {cart} = user;
            const _id = selectedRow.map(i=>i.product._id);
            cart = cart.filter(i=>!_id.includes(i._id));
            userService.updateCart(cart);
            global.toast.show({severity:'success', summary: 'Gi??? h??ng', detail: 'S???n ph???m ???? ???????c x??a kh???i gi??? h??ng', life: 1500});               
        });        
    }
    const onClickDeleteItemHandler = (_id) => {
        CustomConfirmDialog('B???n mu???n x??a s???n ph???m n??y kh???i gi??? h??ng ?','Gi??? h??ng',()=>{
            userService.updateCart(user.cart.filter(i=>i._id !== _id));
            global.toast.show({severity:'success', summary: 'Cart', detail: 'S???n ph???m ???? ???????c x??a kh???i gi??? h??ng', life: 1500});               
        });
    }
    const onHideSideBarHandler = useCallback(() => setCheckoutSideBar(false),[]);
    const header = (
        <div className="p-d-flex p-jc-end">
                    <Button className='p-button-danger' type="button" icon="pi pi-trash" label="X??a" onClick={onClickDeleteAllHandler} disabled={!selectedRow || !selectedRow.length}/>                          
            </div>
    );
    const footer = `Hi???n c?? ${user.cart.length} s???n ph???m trong gi??? h??ng.`;
    const onSelectionChange = (e)=>{
        setSelectedRow(e.value);
    }
    const nameBodyTemplate = (rowData) => {
        return (
            <div className=''>
                <Link to={`/product/${rowData.product._id}`}  style={{textDecoration:'none'}}>
                    <img className='' src={rowData.product.album[0]} alt={rowData.product.name} style={{height:'5vw',width:'5vw'}}/>
                    <span style={{marginLeft: '2px'}}>{rowData.product.name}</span>    
                </Link>               
            </div>
        );        
    }
    const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.product.category).name}</p>
    const priceBodyTemplate = (rowData) => <p>{toVNDCurrencyFormat(rowData.product.price)} VND</p>
    const quantityBodyTemplate = (rowData) => {
        return (
            <InputNumber value={quantityInputValue[rowData.product._id].quantity} beforeValueChange={(value)=>onChangeQuantityInputHandler(value,rowData.product._id)} 
                size={3} min={0} max={rowData.product.quantity} 
                tooltip={`C?? s???n: ${rowData.product.quantity}`}
            />
        );
    }
    const actionBodyTemplate = (rowData) => {
        return <Button className='p-button-warning' type='button' icon='pi pi-trash' onClick={()=>onClickDeleteItemHandler(rowData.product._id)}/>
    }
    const rowClass = (rowData) =>{
        return {
            'disable':rowData.product.status === false,
            'enable':rowData.product.status === true
        }
    }
    useEffect(()=>{
        setSelectedProduct(selectedRow.map(i=>{
            return {...i.product, quantity: i.quantity}
        }))
    },[selectedRow])
    useEffect(()=>{
        let _cart = [];
        let _quantityInputValue = {};
        let _selectedRow = [];
        let _cartMap = {};
        if(allProducts.length > 0) {
            user.cart.forEach(i=>_cartMap={..._cartMap,[i._id]:  parseInt(i.quantity)});
            _selectedRow = selectedRow.filter(row=> _cartMap[row.product._id] !== undefined);
            Object.keys(_cartMap).forEach(_id=>{
                const product = allProducts.find(p=>p._id === _id);
                _cart.push({quantity: _cartMap[_id], product});
                _quantityInputValue = {..._quantityInputValue, 
                    [_id]:{
                        quantity: _cartMap[_id],
                        available: product.quantity
                    }
                }
            });
            _selectedRow.forEach(row=> row.quantity = _cartMap[row.product._id]);
        }       
        setSelectedRow(_selectedRow);
        setCart(_cart);
        setCheckoutSideBar(false);
        setQuantityInputValue(_quantityInputValue);
    },[allProducts, user]);
    useEffect(()=>{
        setTotal(()=>{
            let _total = 0;
            selectedRow.forEach(v=> _total += v.quantity * v.product.price);
            return _total;
        })
    },[JSON.stringify(selectedRow)])
    return (
        <React.Fragment>
            <Sidebar visible={checkoutSideBar} fullScreen onHide={onHideSideBarHandler}>
                <CheckOut hide={onHideSideBarHandler} items={selectedProduct} total={total}/>
            </Sidebar>
            <div className='p-d-flex p-mt-5'>
                <div className='cart p-justify-center p-col-8' style={{backgroundColor: BACKGROUND_COLOR}}>
                    <div className='p-col-12' style={{backgroundColor: '#F5F4BC', borderRadius: '10px'}}>
                        <DataTable emptyMessage="Kh??ng c?? s???n ph???m n??o trong gi??? h??ng c???a b???n" className='p-col-12' responsiveLayout="scroll" dataKey='product._id'
                            value={cart} header={header} footer={footer} rowClassName={rowClass} showGridlines
                            selection={selectedRow} onSelectionChange={onSelectionChange}>
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                            <Column header='T??n' body={nameBodyTemplate}/>
                            <Column header='Th????ng hi???u' body={brandBodyTemplate}/>
                            <Column header='Gi??' body={priceBodyTemplate}/>
                            <Column header='S??? l?????ng' field='quantity' body={quantityBodyTemplate}/>
                            <Column body={actionBodyTemplate}/>
                        </DataTable>   
                    </div>
                </div>      
                <div className='p-col-4' style={{backgroundColor: BACKGROUND_COLOR}}>
                    <div className='p-col-11 p-ml-2 p-p-5' style={{backgroundColor: '#F5F4BC', borderRadius: '10px'}}>
                        <h4 style={{fontFamily: 'cursive', fontWeight: 'bolder'}}>T???ng</h4>
                        <div className='p-d-flex p-jc-between'>
                            <p>T???m t??nh</p>
                            <p style={{fontSize:'1.1rem', fontWeight:'bolder'}}>{toVNDCurrencyFormat(total)} VND</p>
                        </div>
                        <div className='p-d-flex p-jc-around'>
                            <Button className='p-col-6' style={{color: 'green', fontWeight: 'bolder', borderColor: 'green', backgroundColor: BACKGROUND_COLOR}}  label='S???n ph???m kh??c' onClick={e=> _useHistory.replace('/')}/> 
                            <Button className='p-col-5 p-button-warning' style={{color: 'white', borderRadius: '20px'}} disabled={total === 0} label='Thanh to??n' onClick={onClickConfirmCartHandler}/>
                        </div>
                    </div>   
                </div>      
            </div>
        </React.Fragment>
    );
}

export default Cart;