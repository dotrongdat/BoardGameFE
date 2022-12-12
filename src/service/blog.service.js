import { routeBlogApi } from "../components/Constant/Blog.constant";
import { authRequest, nonAuthRequest } from "../components/Utils/Request.util";
import statusCode from 'http-status-codes';
import store from "../store";
import { CreateForm } from "../components/Utils/FormData.util";

const getAll = async () => {
    const res = await nonAuthRequest.getRequest(routeBlogApi.main);
    if(res.status === statusCode.OK){
        const {blogs} = res.data.payload;
        store.dispatch({type: 'initBlog',blogs});
    }
    return res;
}
const create = async (model) => {
    const res = await authRequest.postRequest(routeBlogApi.main,CreateForm(model),{
                                                validateStatus: false,
                                                headers: {"Content-Type":'multipart/form-data'}
                                            });
    if(res.status === statusCode.OK){
        const {blog} = res.data.payload;
        store.dispatch({type: 'addBlog',blog});
    }
    return res;
}

const update = async (model) => {
    const res = await authRequest.putRequest(routeBlogApi.main,CreateForm(model),{
                                                validateStatus: false,
                                                headers: {"Content-Type":'multipart/form-data'}
                                            });
    if(res.status === statusCode.OK){
        const {blog} = res.data.payload;
        store.dispatch({type: 'updateBlog',blog});
    }
    return res;
}

const _delete = async (_id) => {
    const res = await authRequest.deleteRequest(routeBlogApi.main,{_id});
    if(res.status === statusCode.OK) store.dispatch({type: 'deleteBlog',_id});
    return res;
}

export default {
    getAll,
    create,
    update,
    _delete
}