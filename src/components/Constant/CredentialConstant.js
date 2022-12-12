import {domain} from './APIConstant';

export const routeCredentialAPI={
    signin: domain+'/api/credential/signin',
    signout: domain+'/api/credential/signout',
    signup: domain+'/api/credential/signup',
    signinToken: domain+'/api/credential/signinToken',
    refreshToken: domain+'/api/credential/refreshToken',
    refreshVerifyCode: domain+'/api/credential/refreshVerifyCode',
    verifyCode: domain+ '/api/credential/verifyCode',
    forgotPassword: domain + '/api/credential/forgotPassword',
    verifyForgotPasswordCode: domain + '/api/credential/verifyForgotPasswordCode',
    refreshVerifyForgotPasswordCode: domain + '/api/credential/refreshVerifyForgotPasswordCode',
    resetPassword: domain + 'api/credential/resetPassword'
}
export const roles={
    NO_AUTH: 0,
    CUSTOMER: 1,
    ADMIN: 2
}