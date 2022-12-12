import {domain} from './APIConstant';

export const messageRouteApi = {
    main: domain+'/api/message',
    getById: domain+'/api/message/id',
    getByUserId: domain+'/api/message/user',
    markRead: domain+'/api/message/checkedUser',
    sendToAdmin: domain+'/api/message/sendToAdmin' 
}
export const MESSAGE_STATUS ={
    READ: 1,
    UN_READ:0
}