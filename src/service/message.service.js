import {messageRouteApi} from '../components/Constant/MessageConstant';
import {authRequest} from '../components/Utils/Request.util';

const create = async (model)=> await authRequest.postRequest(messageRouteApi.main,model);
const send = async (model)=> await authRequest.putRequest(messageRouteApi.main,model);
const get = async (params)=> await authRequest.getRequest(messageRouteApi.main,params);
const getById = async (params) => await authRequest.getRequest(messageRouteApi.getById,params);
const getByUserId = async (params) => await authRequest.getRequest(messageRouteApi.getByUserId,params);
const markRead = async (model) => await authRequest.putRequest(messageRouteApi.markRead,model);
const sendToAdmin = async (model) => await authRequest.postRequest(messageRouteApi.sendToAdmin,model);

export default {
    create,
    get,
    getById,
    getByUserId,
    send,
    markRead,
    sendToAdmin
}