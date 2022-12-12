import {domain} from './APIConstant';

export const routeUserAPI = {
    main: domain+'/api/user',
    findByUsername: domain+'/api/user/username',
    findById: domain+'/api/user/id',
    cart: domain+'/api/user/cart',
    cartAddition: domain+'/api/user/cart/addition'
}

export const roles={
    NO_AUTH: 0,
    CUSTOMER: 1,
    ADMIN: 2
}