import {routeOrderAPI} from '../components/Constant/OrderConstant';
import {authRequest, nonAuthRequest} from '../components/Utils/Request.util';
import statusCode from 'http-status-codes';
import store from '../store';

const checkout = async (model)=> {
    const res = await authRequest.postRequest(routeOrderAPI.main,model);
    switch (res.status) {
        case statusCode.OK:            
            if(res.data.payload.order){
                const productCheckout = res.data.payload.order.products.map(p=>p.product);
                let {cart} = store.getState().user;
                store.dispatch({type: 'updateCart', cart: cart.filter(i=> !productCheckout.includes(i._id))});
            }
            break;
    
        default:
            break;
    }
    return res;
}
const getByStatus = async (params = {status:[],page:1,itemPerPage:10,date:undefined}) => await authRequest.getRequest(routeOrderAPI.getByStatus,params);

const updateStatus = async (model) => await authRequest.putRequest(routeOrderAPI.updateStatus,model);

const cancelByCustomer = async (model) => await authRequest.putRequest(routeOrderAPI.cancelByCustomer,model);

const validate = async (model) => await nonAuthRequest.postRequest(routeOrderAPI.validation,model);

const get = async (params={}) => await authRequest.getRequest(routeOrderAPI.main,params);
//const approve = async (model) => await authRequest.putRequest(routeOrderAPI.main,model);

const checkoutVNPay = async (params) =>{
    const res = await nonAuthRequest.getRequest(routeOrderAPI.checkoutVNPay,params);
    switch (res.status) {
        case statusCode.OK:
            if(res.data.payload.order){
                const productCheckout = res.data.payload.order.products.map(p=>p.product);
                let {cart} = store.getState().user;
                store.dispatch({type: 'updateCart', cart: cart.filter(i=> !productCheckout.includes(i._id))});
            }
            break;
    
        default:
            break;
    }
    return res;
};

export default {
    checkout,
    validate,
//    approve,
    get,
    checkoutVNPay,
    getByStatus,
    updateStatus,
    cancelByCustomer
}