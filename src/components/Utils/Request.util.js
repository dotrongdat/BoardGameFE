import axios from 'axios';
import statusCode from 'http-status-codes';
import QueryString from 'qs';
import credentialService from '../../service/credential.service';
import store from '../../store/index';

// const getRequest = (url,params,config)=>{
     
// }
// const postRequest = (url,model,config)=>{

// }
// const putRequest = (url,model,config)=>{

// }
// const deleteRequest = (url,model,)
const DEFAULT_CONFIG = {
    validateStatus:false
}
const handleAuthResponse = async (req,res)=>{
    switch (res.status) {
        // case statusCode.OK:
        //     const {token} = res.data.payload;
        //     if(token) store.dispatch({type:'signin',token});
        //     return res;
        case statusCode.UNAUTHORIZED:
            if(res.data.message === "access-token expired"){
                const refreshTokenResponse = await credentialService.refreshToken({
                    token: localStorage.getItem('token'),
                    refreshToken: localStorage.getItem('refresh')
                })
                switch (refreshTokenResponse.status) {
                    case statusCode.OK:
                        return await req();
                    case statusCode.METHOD_FAILURE:
                        store.dispatch({type:'signout'});
                        window.location.href = '/signin';
                        global.toast.show({severity:'error', summary: 'Xác thực đăng nhập', detail: "Phiên đăng nhập của bạn đã kết thúc. Vui lòng đăng nhập lại !", life: 5000});
                        break;
                    case statusCode.INTERNAL_SERVER_ERROR:
                        window.location.href = '/internalServerError';
                        global.toast.show({severity:'error', summary: 'Lỗi', detail: res.data.message, life: 5000});
                        //store.dispatch({type:'signout'});
                        break;
                    default:
                        break;
                }
            } 
            else {
                store.dispatch({type:'signout'});
                window.location.href = '/signin';
                global.toast.show({severity:'error', summary: 'Xác thực đăng nhập', detail: "Phiên đăng nhập của bạn đã kết thúc. Vui lòng đăng nhập lại!", life: 5000});
            }
            break;
        case statusCode.FORBIDDEN:
            window.location.href='/notAccept';
            break;
        case statusCode.INTERNAL_SERVER_ERROR:
            window.location.href = '/internalServerError';
            global.toast.show({severity:'error', summary: 'Lỗi', detail: res.data.message, life: 5000});
            //store.dispatch({type:'signout'});
            break;
        default:
            break;
    }
    return res;
}
const authRequest = {
    getRequest: async (url,params,config = DEFAULT_CONFIG)=>{
        const req = () => axios.get(url,{
            ...config,
            params,
            paramsSerializer: params => {
                return QueryString.stringify(params)
            },
            headers:{
                //...config.headers, 
                token: localStorage.getItem('token')
            }
        });
        const res = await req();
        return await handleAuthResponse(req,res);
    },
    postRequest: async (url,model,config = DEFAULT_CONFIG)=>{
        const req= () => axios.post(url,model,{
            ...config,
            headers:{
                //...config.headers, 
                token: localStorage.getItem('token')
            }
        });
        const res = await req();
        return await handleAuthResponse(req,res);
    },
    putRequest: async (url,model,config = DEFAULT_CONFIG)=>{
        const req= () => axios.put(url,model,{
            ...config,
            headers:{
                //...config.headers, 
                token: localStorage.getItem('token')
            }
        });
        const res = await req();
        return await handleAuthResponse(req,res);
    },
    deleteRequest: async (url,data,config = DEFAULT_CONFIG)=>{
        const req= () => axios.delete(url,{
            ...config,
            data,
            headers:{
                //...config.headers, 
                token: localStorage.getItem('token')
            }
        });
        const res = await req();
        return await handleAuthResponse(req,res);
    }
}

const handleNonAuthResponse = (res)=> {
    switch (res.status) {
        case statusCode.INTERNAL_SERVER_ERROR:
            window.location.href = '/internalServerError';
            global.toast.show({severity:'error', summary: 'Lỗi', detail: res.data.message, life: 1500});
            break;    
        default:
            break;
    }
    return res;
};
const nonAuthRequest = {
    getRequest: async (url,params,config = DEFAULT_CONFIG)=>{
        const res = await axios.get(url,{
            ...config,
            params,
            paramsSerializer: params => {
                return QueryString.stringify(params)
            },
        });
        return handleNonAuthResponse(res);
    },
    postRequest: async (url,model,config = DEFAULT_CONFIG)=>{
        const res = await axios.post(url,model,{
            ...config
        });
        handleNonAuthResponse(res);
        return handleNonAuthResponse(res);
    },
    putRequest: async (url,model,config = DEFAULT_CONFIG)=>{
        const res = await axios.put(url,model,{
            ...config
        });
        handleNonAuthResponse(res);
        return handleNonAuthResponse(res);
    },
    deleteRequest: async (url,data,config = DEFAULT_CONFIG)=>{
        const res = await axios.delete(url,{
            ...config,
            data
        });
        handleNonAuthResponse(res);
        return handleNonAuthResponse(res);
    }
}

export {
    authRequest,
    nonAuthRequest
}