import {routeProductAPI} from '../components/Constant/ProductConstant';
import {CreateForm} from '../components/Utils/FormData.util';
import {nonAuthRequest,authRequest} from '../components/Utils/Request.util';
import store from '../store';
import statusCode from 'http-status-codes';

const search = async (params)=> await nonAuthRequest.getRequest(routeProductAPI.search,params);
const create = async (model)=>{
    const res = await authRequest.postRequest(routeProductAPI.main,CreateForm(model),{
                                                validateStatus:false,
                                                headers: {"Content-Type":'multipart/form-data'}
                                            });
    switch (res.status) {
        case statusCode.OK:
            store.dispatch({type: "addProduct",product: res.data.payload.product});
            break;    
        default:
            break;
    }
    return res;                                              
} 
const update = async (model)=>{
    const res = await authRequest.putRequest(routeProductAPI.main,CreateForm(model),{
                                                validateStatus:false,
                                                headers: {"Content-Type":'multipart/form-data'}
                                            });
    switch (res.status) {
        case statusCode.OK:
            store.dispatch({type: "updateProduct",product: res.data.payload.product});
            break;    
        default:
            break;
    }
    return res;  
}
const _delete = async (data)=> {
    const res = await authRequest.deleteRequest(routeProductAPI.main,data);
    switch (res.status) {
        case statusCode.OK:
            store.dispatch({type: "deleteProduct",_id: data._id});
            break;    
        default:
            break;
    }
    return res; 
} 
const get = async (_id)=> await nonAuthRequest.getRequest(routeProductAPI.main+'/'+_id);
const getAll = async ()=>{     
    const res = await nonAuthRequest.getRequest(routeProductAPI.main);
    switch (res.status) {
        case statusCode.OK:
            store.dispatch({type: "initProduct",products: res.data.payload.products});
            break;    
        default:
            break;
    }
    return res;
}
const getAllByAdmin = async ()=> {
    const res = await authRequest.getRequest(routeProductAPI.main+'/admin');
    switch (res.status) {
        case statusCode.OK:
            store.dispatch({type: "initProduct",allProducts: res.data.payload.products});
            break;    
        default:
            break;
    }
    return res;
}
const findByCategory = (categoryId)=>{
    const {allProducts} = store.getState();
    store.dispatch({type: "findProductByCategory",searchProducts: allProducts.filter((product)=>product.category === categoryId)})
}

export default {
    search,
    create,
    update,
    _delete,
    get,
    findByCategory,
    getAll,
    getAllByAdmin
}