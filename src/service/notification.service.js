import {notificationRouteAPI} from '../components/Constant/NotificationConstant';
import {authRequest} from '../components/Utils/Request.util';

const markRead = async (model)=> await authRequest.putRequest(notificationRouteAPI.main,model);
const get = async (params) =>await authRequest.getRequest(notificationRouteAPI.main,params);

export default {
    markRead,
    get
}