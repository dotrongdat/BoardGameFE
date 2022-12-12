import {routeCategoryAPI} from '../components/Constant/CategoryConstant';
import statusCode from 'http-status-codes';
import store from '../store/index';
import {authRequest, nonAuthRequest} from '../components/Utils/Request.util';

const getAll = async () =>{
    const res = await nonAuthRequest.getRequest(routeCategoryAPI.main);
    switch (res.status){
        case statusCode.OK:
            const {categories} = res.data.payload;
            store.dispatch({type:'initializeCategories',categories});
            break;
        default:
    }
    return res;
}
const create = async (model) => {
    const res = await authRequest.postRequest(routeCategoryAPI.main,model);
    switch (res.status){
        case statusCode.OK:
            const {category} = res.data.payload;
            store.dispatch({type:'addCategory',category});
            break;
        default:
            break;
    }
    return res;
}

const update = async (model) => {
    const res = await authRequest.putRequest(routeCategoryAPI.main,model);
    switch (res.status){
        case statusCode.OK:
            const {category} = res.data.payload;
            store.dispatch({type:'updateCategory',category});
            break;
        default:
            break;
    }
    return res;
}

const enable = async (model) => {
    const res = await authRequest.putRequest(routeCategoryAPI.enable,model);
    switch (res.status){
        case statusCode.OK:
            store.dispatch({type:'enableCategory', _id: model._id});
            break;
        default:
            break;
    }
    return res;
}

const disable = async (model) => {
    const res = await authRequest.putRequest(routeCategoryAPI.disable,model);
    switch (res.status){
        case statusCode.OK:
            store.dispatch({type:'disableCategory',_id: model._id});
            break;
        default:
            break;
    }
    return res;
}


export default {
    getAll,
    create,
    update,
    enable,
    disable
}