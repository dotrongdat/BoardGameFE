import {domain} from './APIConstant';

const notificationRouteAPI = {
    main: domain+'/api/notification'
}
const notificationStatus = {
    READ: 1,
    UN_READ: 0
}
const notificationType = {
    ORDER: {
        WAITING_CONFIRM: 0,
        CONFIRMED : 1,
        WAITING_PICKUP: 2,
        PICK_UP: 3,
        DELIVERING: 4,
        COMPLETE_DELIVERY: 5,
        CANCEL_BY_CUSTOMER: 6,
        CANCEL_BY_STORE: 7,
        WAITING_REFUND: 8,
        COMPLETE_REFUND: 9
    }
}

export {
    notificationRouteAPI,
    notificationType,
    notificationStatus
} 