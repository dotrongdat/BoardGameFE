import {roles, routeCredentialAPI} from '../components/Constant/CredentialConstant';
import {encrypt} from '../components/Utils/Crypto.util';
import store from '../store/index';
import statusCode from 'http-status-codes';
import {nonAuthRequest, authRequest} from '../components/Utils/Request.util';

const signin = async (model)=>{
    model.username=encrypt(model.username);
    model.password=encrypt(model.password);
    const res = await nonAuthRequest.postRequest(routeCredentialAPI.signin,model);
    switch (res.status){
        case statusCode.OK: 
            const {user,token,refresh} = res.data.payload;
            if(user.role === roles.CUSTOMER) {
                global.admin = res.data.payload.admin;
            }
            store.dispatch({type:'signin',user,token,refresh});          
            break;
        // case statusCode.UNAUTHORIZED:
        //     store.dispatch({type:'signout'});
        //     break;
        default:
    }
    return res;
}

const signout = () => {
    //const {user} = store.getState();
    store.dispatch({type: 'signout'});
}

// const signup = async (model)=>{
//     model.username=encrypt(model.username);
//     model.password=encrypt(model.password);
//     const res = await nonAuthRequest.postRequest(routeCredentialAPI.signup,model);                
//     switch (res.status){
//         case statusCode.OK: 
//             const {user,token,refresh} = res.data.payload;
//             store.dispatch({type:'signin',user,token,refresh});
//             break;
//         default:
//     }
//     return res;
// }
const signup = async (model) => {
    model.password=encrypt(model.password);
    const res = await nonAuthRequest.postRequest(routeCredentialAPI.signup,model);
    switch (res.status){
        case statusCode.OK: 
            // const {user,token,refresh} = res.data.payload;
            // store.dispatch({type:'signin',user,token,refresh});
            break;
        default:
    }
    return res;
}

const refreshVerifyCode = async (model) => {
    const res = await nonAuthRequest.getRequest(routeCredentialAPI.refreshVerifyCode,model);
    switch (res.status){
        case statusCode.OK:
            break;
        default:
    }
    return res;
}

const verifyCode = async (model) => {
    if(model.newPassword) model.newPassword = encrypt(model.newPassword);
    const res = await nonAuthRequest.postRequest(routeCredentialAPI.verifyCode,model);
    switch (res.status){
        case statusCode.OK: 
            break;
        default:
    }
    return res;
}

const forgotPassword = async (model) => {
    const res = await nonAuthRequest.postRequest(routeCredentialAPI.forgotPassword,model);
    switch (res.status){
        case statusCode.OK:
            break;
        default:
    }
    return res;
}

const verifyForgotPasswordCode = async (model) => {
    const res = await nonAuthRequest.postRequest(routeCredentialAPI.verifyForgotPasswordCode,model);
    switch (res.status){
        case statusCode.OK:
            break;
        default:
    }
    return res;
}

const refreshVerifyForgotPasswordCode = async (model) => {
    const res = await nonAuthRequest.getRequest(routeCredentialAPI.refreshVerifyForgotPasswordCode,model);
    switch (res.status){
        case statusCode.OK:
            break;
        default:
    }
    return res;
}

const resetPassword = async (model) => {
    model.newPassword = encrypt(model.newPassword);
    const res = await authRequest.postRequest(routeCredentialAPI.resetPassword,model);
    switch (res.status){
        case statusCode.OK:
            break;
        default:
    }
    return res;
}

const signinToken = async () =>{
    // const lToken = localStorage.getItem('token');
    // const lRefresh = localStorage.getItem('refresh');
    //     if(lToken && lRefresh){
        const res = await authRequest.postRequest(routeCredentialAPI.signinToken,{});    
        switch (res.status){
            case statusCode.OK:
                const {user} =res.data.payload;
                // const token =res.data.payload.token || lToken;
                if(user.role === roles.CUSTOMER) global.admin = res.data.payload.admin;
                store.dispatch({type:'signin',user});
                break;
            case statusCode.UNAUTHORIZED:
                store.dispatch({type:'signout'}); 
                break;
            default:
        }
        // }else store.dispatch({type:'signout'});        
}
const refreshToken = async (model) => {
    const res = await nonAuthRequest.postRequest(routeCredentialAPI.refreshToken,model);
    switch (res.status){
        case statusCode.OK:
            const {token,refreshToken} = res.data.payload;
            store.dispatch({type:'refreshToken',token,refreshToken});
            break;
        case statusCode.METHOD_FAILURE:
            store.dispatch({type: 'signout'});
        default:
    }
    return res;
}
const findByUsername = async (params) =>{
    return await nonAuthRequest.getRequest(routeCredentialAPI.findByUsername,params);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    signin,
    signout,
    signup,
    signinToken,
    findByUsername,
    refreshVerifyCode,
    verifyCode,
    forgotPassword,
    verifyForgotPasswordCode,
    refreshVerifyForgotPasswordCode,
    resetPassword,
    refreshToken
}