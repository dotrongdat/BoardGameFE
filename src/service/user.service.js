import axios from 'axios';
import {routeUserAPI} from '../components/Constant/UserConstant';
import {nonAuthRequest,authRequest} from '../components/Utils/Request.util';
import store from '../store';


//const addToCart = async (model)=> await authRequest.putRequest(routeUserAPI.cartAddition,model); 
const addToCart = (_id,quantity) => {
    store.dispatch({type:'addToCart',product: {_id,quantity}});
}
const updateCart = (cart) => {
    store.dispatch({type: 'updateCart', cart});
}
//const updateCart = async (model) =>await authRequest.putRequest(routeUserAPI.cart,model);
const findByUsername = async (params) => await nonAuthRequest.getRequest(routeUserAPI.findByUsername,params);
// const getCart = async () => await authRequest.getRequest(routeUserAPI.cart);
const getCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    store.dispatch({type:'updateCart',cart});
}
const getIPAddress = async () => {
    const res = await axios.get('https://geolocation-db.com/json/')
    store.dispatch({type: 'setIPAddress',ip: res.data.IPv4});
}

export default {
    addToCart,
    updateCart,
    findByUsername,
    getCart,
    getIPAddress
}