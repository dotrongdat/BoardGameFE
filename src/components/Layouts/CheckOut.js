import React,{useState,useEffect,useRef, Fragment} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {RadioButton } from 'primereact/radiobutton'
import {Link} from  'react-router-dom';
import {ADDRESS_API} from '../Constant/Location.constant';
import {useSelector} from 'react-redux';
import orderService from '../../service/order.service';
import statusCode from 'http-status-codes';
import {PayPalButton} from 'react-paypal-button-v2';
import {emailRegex, paymentMethodType, phoneNumberRegex} from '../Constant/OrderConstant';
import './CheckOut.css';
import {toVNDCurrencyFormat } from '../Utils/Function.util';
import {Dropdown} from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { BACKGROUND_COLOR } from '../Constant';
import { useHistory } from 'react-router-dom';
import {useFormik} from 'formik';
import { classNames } from 'primereact/utils';
import {mdiCashMultiple,mdiCreditCardMultiple,mdiCreditCardOutline} from '@mdi/js';
import Icon from '@mdi/react';
import { Sidebar } from 'primereact/sidebar';
import './CheckOut.css';

const PaymentMethod = (props) => {
    return (
        <div className={'parent ' + classNames(props.checked ? 'container_checked' : 'container_unchecked')} style={{borderRadius: '10px', cursor: 'pointer'}} onClick={()=>props.onClick()}>
            <div className={'p-d-flex ' + classNames(props.checked ? 'child_checked' : 'child_unchecked')} style={{position: 'relative', borderTopRightRadius: '10px', borderTopLeftRadius: '10px'}}>
                <Icon path={props.iconPath} color='green' size={1} style={{marginLeft: '7px', marginTop: '2px',marginRight: '5px'}}/>
                <p style={{fontSize: '1rem'}}>{props.title}</p>
                <RadioButton style={{position: 'absolute', top: '2px', right: '2px'}} checked={props.checked}/>
            </div>
            <p style={{marginLeft: '10px', fontSize: '0.7rem'}}>{props.content}</p>
        </div>
    )
} 
const ShippingAddress = (props) => {
    const [provinceList, setProvinceList] = useState([]);
    const [districtList,setDistrictList] = useState([]);
    const [wardList,setWardList] = useState([]);

    const submitButtonRef = useRef();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            detailAddress: props.data.detailAddress,
            province: props.data.province,
            district: props.data.district,
            ward: props.data.ward,
            receiverName: props.data.receiverName,
            phoneNumber: props.data.phoneNumber,
            email: props.data.email
        },
        validate: (data) => {
            let errors = {};

            if (!data.detailAddress) {
                errors.detailAddress = 'Bắt buộc';
            }
            if (data.detailAddress.length < 2 || data.detailAddress.length > 350) {
                errors.detailAddress = '2 - 350 chữ cái';
            }
            if (!data.province) {
                errors.province = 'Bắt buộc';
            }
            if (!data.district) {
                errors.district = 'Bắt buộc';
            }
            if (!data.ward) {
                errors.ward = 'Bắt buộc';
            }
            if(!data.receiverName){
                errors.receiverName = 'Bắt buộc';
            }
            if(data.receiverName.length < 2 || data.receiverName.length > 50){
                errors.receiverName = '2 - 50 chữ cái';
            }
            if(!data.phoneNumber){
                errors.phoneNumber = 'Bắt buộc';
            }
            if(!phoneNumberRegex.test(data.phoneNumber)){
                errors.phoneNumber = 'Số điện thoại không hợp lệ';
            }
            if(!data.email){
                errors.email = 'Bắt buộc';
            }
            if(!emailRegex.test(data.email)){
                errors.email = 'Email không hợp lệ';
            }
            return errors;
        },
        onSubmit: (data) => {
            // setFormData(data);
            // setShowMessage(true);
            props.onSave(data);
            props.hide();
            //formik.resetForm();
        }
    });
    useEffect(()=>{
        setProvinceList(ADDRESS_API.map(i=>i.name));
    },[]);
    useEffect(()=>{
        if(formik.values.province !== ""){
            const _districtList = ADDRESS_API.find(i=>i.name === formik.values.province).district.map(i=>i.name);
            setDistrictList(_districtList);
            if(!_districtList.includes(formik.values.district)) {
                setWardList([]);
                formik.setFieldValue('ward','');
                formik.setFieldValue('district','');
            }
        }
    },[formik.values.province]);
    useEffect(()=>{
        if(formik.values.district !== ""){
            // const _districtList = 
            const _wardList = ADDRESS_API.find(i=>i.name === formik.values.province).district.find(i=>i.name === formik.values.district).ward.map(i=>i.name);
            setWardList(_wardList);
        }
    },[formik.values.district]);
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    const footer = () => {
        const onClickCloseHandler = () =>{
            props.hide();
            formik.resetForm();
        }
        return (
            <div>
                <Button label="Đóng" icon="pi pi-times" onClick={onClickCloseHandler} className="p-button-text" />
                <Button label="Lưu" type='button' icon="pi pi-check" onClick={()=>submitButtonRef.current.click()} autoFocus />
            </div>
        )
    }
    const onHide = () => {
        props.hide();
        formik.resetForm();
    }
    return (
        <Dialog visible={props.visible} footer={footer} onHide={onHide} style={{minHeight: '92vh', minWidth: '30vw'}} modal>
            <div className="flex justify-content-center">
                <div className="p-m-4" style={{minWidth:'450px'}}>
                    <h5 className="text-center">Shipping Address</h5>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="p-mt-2">
                            <span className="p-float-label">
                                <InputText id="receiverName" name="receiverName" value={formik.values.receiverName} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('receiverName') })}/>
                                <label htmlFor="receiverName" className={classNames({ 'p-error': isFormFieldValid('receiverName') })}>Họ và tên</label>
                            </span>
                            {getFormErrorMessage('receiverName')}
                        </div>
                        <div className="p-mt-5">
                            <span className="p-float-label">
                                <InputText id="phoneNumber" keyfilter='num' name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('phoneNumber') })}/>
                                <label htmlFor="phoneNumber" className={classNames({ 'p-error': isFormFieldValid('phoneNumber') })}>Số điện thoại</label>
                            </span>
                            {getFormErrorMessage('phoneNumber')}
                        </div>
                        <div className="p-mt-5">
                            <span className="p-float-label">
                                <InputText id="email" keyfilter='email' name="email" value={formik.values.email} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('email') })}/>
                                <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="p-mt-4">
                            <span className="p-float-label">
                                <Dropdown id="province" name="province" options={provinceList} value={formik.values.province} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('province') })}/>
                                <label htmlFor="province" className={classNames({ 'p-error': isFormFieldValid('province') })}>Tỉnh/Thành phố</label>
                            </span>
                            {getFormErrorMessage('province')}
                        </div>
                        <div className="p-mt-4">
                            <span className="p-float-label"> 
                                <Dropdown id="district" name="district" disabled={districtList.length === 0} options={districtList} value={formik.values.district} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('district') })} />
                                <label htmlFor="district" className={classNames({ 'p-error': isFormFieldValid('district') })}>Huyện/Quận</label>
                            </span>
                            {getFormErrorMessage('district')}
                        </div>
                        <div className="p-mt-4">
                            <span className="p-float-label">
                                <Dropdown id="ward" name="ward"  disabled={wardList.length === 0} options={wardList} value={formik.values.ward} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('ward') })} />
                                <label htmlFor="ward" className={classNames({ 'p-error': isFormFieldValid('ward') })}>Xã/Phường</label>
                            </span>
                            {getFormErrorMessage('ward')}
                        </div>
                        <div className="p-mt-5">
                            <span className="p-float-label">
                                <InputText id="detailAddress" name="detailAddress" value={formik.values.detailAddress} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('detailAddress') })} />
                                <label htmlFor="detailAddress" className={classNames({ 'p-error': isFormFieldValid('detailAddress')})}>Địa chỉ chi tiết</label>
                            </span>
                            {getFormErrorMessage('detailAddress')}
                        </div>
                        <Button type='submit' hidden ref={submitButtonRef}/>
                    </form>
                </div>
            </div>
        </Dialog>
    );
}
const CheckOut = (props)=>{
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleSidebarPaypal, setIsVisibleSidebarPaypal] = useState(false);
    const [address,setAddress] = useState({province: '',district: '', ward: ''});
    const [detailAddress,setDetailAddress] = useState('');
    const [receiverName,setReceiverName] = useState('');
    const [phoneNumber,setPhoneNumber] = useState('');
    const [email,setEmail] = useState('');

    const {categories,user} = useSelector(state=>state);   

    const [paymentMethod,setPaymentMethod] = useState(paymentMethodType.COD);
    const _useHistory = useHistory();

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues:{
            detailAddress
        },
        validate: () => {
            let errors = {};

            if (!detailAddress) {
                errors.detailAddress = 'Bắt buộc';
            }
            return errors;
        },
        onSubmit: () => {
            if(paymentMethod === paymentMethodType.PAYPAL) setIsVisibleSidebarPaypal(true);
            else checkout();
        }
    });
    
    const nameBodyTemplate = (rowData) => {
        return (
                <Link className='p-grid ' to={`/product/${rowData._id}`} style={{textDecoration: 'none'}}>
                    <img className='p-col-4' src={rowData.album[0]} alt='productImage' style={{height:'5vw',width:'5vw'}}/>
                    <p className='p-col-8' style={{wordWrap: 'break-word'}}>{rowData.name}</p>
                </Link>               
        );        
    }
    const brandBodyTemplate = (rowData) => <p>{categories.find(category=>category._id === rowData.category).name}</p>;
    const priceBodyTemplate = (rowData) => <p>{toVNDCurrencyFormat(rowData.price)} VND</p>;
    const quantityBodyTemplate = (rowData) => <p>Số lượng: {rowData.quantity}</p>;
    const calculateTotalQuantity = (items)=>{
        let quantity = 0;
        items.forEach(i=>quantity +=i.quantity);
        return quantity;
    }
    const checkout = async (paymentInfo) =>{
        let cart={};
        props.items.forEach(i=> cart = {...cart,[i._id]:i.quantity})
        let info = {
            receiverName,
            email : email,
            phone : phoneNumber,
            address : {
                detail: detailAddress,
                province: address.province,
                district: address.district,
                ward: address.ward
            },
            paymentMethod : {
                type : paymentMethod,
                paymentInfo
            }
        }
        global.loading.show();
        const res = await orderService.checkout({
            cart,
            info,
            userId: user._id
        });
        switch (res.status){
            case statusCode.OK:
                if(res.data.payload.url){
                    window.location.href = res.data.payload.url;
                }else {
                    _useHistory.push('/checkoutResult',{order:res.data.payload.order});
                    global.toast.show({severity:'info', summary: 'Đơn hàng', detail: 'Đơn hàng đang chờ được xử lí', life: 1500});
                }                
                break;
            case statusCode.BAD_REQUEST:
                global.toast.show({severity:'error', summary: 'Đơn hàng', detail: 'Tồn tại sản phẩm không phù hợp, vui lòng kiểm tra lại!', life: 1500});
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Đơn hàng', detail: res.data.message, life: 1500});
                break;
            default:
        }
        props.hide();
        global.loading.hide();
    }
    const onSaveShippingAddressHandler = ({province,district,ward,detailAddress,receiverName,phoneNumber,email}) => {
        setAddress({province,district,ward});
        setReceiverName(receiverName);
        setPhoneNumber(phoneNumber);
        setEmail(email);
        setDetailAddress(detailAddress);
    }
    return (
        <div className='p-grid p-justify-center p-mt-2'>
            <ShippingAddress visible={isVisible} hide={()=>setIsVisible(false)} onSave={onSaveShippingAddressHandler} data={{detailAddress,ward: address.ward,district: address.district,province: address.province, receiverName, phoneNumber, email}}/>
            <Sidebar position='right' style={{minWidth: '25vw'}} visible={isVisibleSidebarPaypal} onHide={()=>setIsVisibleSidebarPaypal(false)}>
                <div className='p-grid p-jc-center'>
                    <h3 className='p-col-12' style={{textAlign: 'center'}}>Thêm thẻ</h3>
                    <div className='p-col-12 p-grid p-jc-center p-mb-5' style={{textAlign: 'center', backgroundColor: BACKGROUND_COLOR, padding: '5px'}}>
                        <div className='p-d-flex p-mt-3'>
                            <i className='pi pi-shield' style={{fontSize: '1.5rem'}} color='green'/>
                            <p style={{color: 'green'}}>Covered by Navita Protection</p>
                        </div>
                    </div>
                    <PayPalButton
                        options = {
                            {clientId: 'AZ7lZAzmFzxo9pbrGvgKv_KVNY8qg5bD1ZJZ_Tfr_46Dl_dE_6mjNk_p9ue3BalpjazGRwEouZGjJ6va',
                            currency: 'USD'}
                        }
                        shippingPreference = 'NO_SHIPPING'
                        amount = {props.total}
                        onSuccess = {async (details,data)=>{
                                setIsVisibleSidebarPaypal(false);
                                setPaymentMethod(paymentMethodType.PAYPAL);
                                return checkout(JSON.stringify(details));
                        }}
                    />
                </div>
            </Sidebar>
            <form className='p-col-10 p-grid checkout' onSubmit={formik.handleSubmit}>
                <div className='p-col-7'>
                <span className="p-float-label"> 
                    <div className={'p-mb-2 '}  style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', position:'relative'}}>
                        <p className='p-col-12' style={{backgroundColor: 'whitesmoke'}}>Địa chỉ giao hàng</p>
                        <div style={{paddingLeft: '10px', paddingBottom: '2px'}}>
                            {receiverName && <Fragment>
                                <div className='p-d-flex'>
                                    <p>{receiverName}</p>
                                    <p style={{marginLeft: '10px'}}>{phoneNumber}</p>
                                </div>
                                <p>{email}</p>
                                <p>{`${detailAddress},${address.ward},${address.district},${address.province}`}</p>
                                <p style={{position:'absolute',top:'2px', right: '5px', cursor: 'pointer', color: 'orange'}} onClick={()=>setIsVisible(true)}>Sửa</p>
                            </Fragment>}
                            {!receiverName && <Fragment>
                                <div className='p-d-flex p-jc-center'>
                                    <p onClick={()=>setIsVisible(true)}>Vui lòng nhập địa chỉ giao hàng</p>
                                </div>
                            </Fragment>}
                        </div>                       
                    </div>
                </span>
                {getFormErrorMessage('detailAddress')}
                    <Divider/>
                    <div className='cart'>
                        <DataTable className='p-mt-4' value={props.items} rowClassName='enable'>
                            <Column body={nameBodyTemplate}/>
                            <Column body={brandBodyTemplate}/>
                            <Column body={priceBodyTemplate}/>
                            <Column body={quantityBodyTemplate}/>
                        </DataTable>
                    </div>
                </div>
                <div className='p-col-4 p-ml-1' style={{boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', padding: '10px'}}>
                    <p style={{fontSize: '1rem', fontWeight: 'bolder', marginTop: '10px'}}>Phương thức thanh toán</p>
                    <PaymentMethod title='Cash On Delivery' iconPath={mdiCashMultiple} content='Trả khi nhận hàng' onClick={()=>{setPaymentMethod(paymentMethodType.COD)}} checked={paymentMethod === paymentMethodType.COD}/>
                    <PaymentMethod title='Paypal' iconPath={mdiCreditCardMultiple} content='Thêm thẻ' onClick={()=>{setPaymentMethod(paymentMethodType.PAYPAL)}} checked={paymentMethod === paymentMethodType.PAYPAL}/>
                    <PaymentMethod title='VNPay' iconPath={mdiCreditCardOutline} content='Thanh toán trực tuyến' onClick={()=>{setPaymentMethod(paymentMethodType.VNPAY)}} checked={paymentMethod === paymentMethodType.VNPAY}/>
                    <p className='p-mt-2' style={{fontSize: '1rem', fontWeight: 'bolder'}}>Mã giảm giá</p>
                    <div className='p-d-flex p-jc-between'>
                        <InputText className='p-col-7' placeholder='Nhập mã giảm giá'/>
                        <Button className='p-col-4' type='button' label='Áp dụng'/>
                    </div>
                    <p className='p-mt-2' style={{fontSize: '1rem', fontWeight: 'bolder'}}>Giá trị đơn hàng</p>
                    <div className='p-d-flex p-jc-between'>
                        <p>{`(${calculateTotalQuantity(props.items)} sản phẩm)`}</p>
                        <p>{`${toVNDCurrencyFormat(props.total)} VND`}</p>
                    </div>
                    <div className='p-d-flex p-jc-between'>
                        <p>Phí vận chuyển</p>
                        <p>{`${toVNDCurrencyFormat(50000)} VND`}</p>
                    </div>
                    <div className='p-d-flex p-jc-between'>
                        <p style={{fontSize: '1rem', fontWeight: 'bolder'}}>Tổng</p>
                        <p style={{fontSize: '1rem', fontWeight: 'bolder', color: 'orange'}}>{`${toVNDCurrencyFormat(props.total + 50000)} VND`}</p>
                    </div>
                    <Button style={{backgroundColor:'orange', borderColor: 'orange'}} className='p-col-12' type='submit' label='Đặt hàng'/>
                </div>
            </form>
        </div>
    );
}

export default CheckOut;