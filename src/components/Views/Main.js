import React,{useState,useEffect} from 'react';
import Header from '../Commons/Header';
import Footer from '../Commons/Footer';
import { Route, Switch} from 'react-router-dom';
import CustomRoute from '../Utils/CustomRoute.util';
import {Toast} from 'primereact/toast';
import categoryService from '../../service/category.service';
import productService from '../../service/product.service';
import credentialService from '../../service/credential.service';
import {useSelector,useDispatch} from 'react-redux';
import {roles} from '../Constant/CredentialConstant';
import Loading from '../Utils/Views/Loading';
import statusCode from 'http-status-codes';
import Admin from '../Layouts/Admin';
import User from '../Layouts/User';
import userService from '../../service/user.service';
import { PageNotFound, ServerInternalError , DenyPage} from '../Commons/ErrorPage';
import blogService from '../../service/blog.service';
import { ConfirmDialogV2 } from '../Notifications/CustomConfirmDialog';
import { ConfirmDialog } from 'primereact/confirmdialog';

const Main=()=>{
    const [isCompleteInitUser, setIsCompleteInitUser] = useState(false);   
    const dispatch = useDispatch();
    const {isInitialize} = useSelector(state=>state); 

    useEffect(()=>{
        const getCategories = () => categoryService.getAll();
        const getUser = ()=>{
            if(localStorage.getItem('token')) credentialService.signinToken();  
        }
        const getAllProduct = () => productService.getAll();
        const getCart = () => userService.getCart();
        const getBlogs = () => blogService.getAll();
        Promise.all([getCategories(),getUser(),getAllProduct(),getCart(),getBlogs()])
        .then(()=>{
            dispatch({type:'initialize'});
            setIsCompleteInitUser(true); 
        });
        global.socket.on('signIn',user=>dispatch({type:'signin',user}));
        global.socket.on('signOut',()=>dispatch({type:'signout'})); 
        global.socket.on('sync',(user)=>dispatch({type:'sync',user})); 
        global.socket.on('updateCart',(cart)=>dispatch({type:'updateCart',cart})); 
        return () => {
            global.socket.off('signIn');
            global.socket.off('signOut');
            global.socket.off('sync');
            global.socket.off('updateCart');
            let _socketID = JSON.parse(localStorage.getItem('socketID'));
            _socketID = _socketID.filter(sk=>sk !== global.socket.id);
            localStorage.setItem('socketID',JSON.stringify(_socketID)); 
        }   
    },[])
    useEffect(()=>{
        if(isInitialize) global.loading.hide();
        else global.loading.show();
    },[isInitialize]);
    return (
        <React.Fragment>
            <Loading ref={(ref)=>global.loading=ref}/>
            <ConfirmDialog/>
            <Header/>        
            <Toast ref={(ref) => global.toast=ref}/>            
            <div style={{minHeight: '84vh',marginRight:'0px', backgroundColor:'white'}}>
                <Switch>
                    <Route path='/internalServerError'>
                        <ServerInternalError/>
                    </Route>
                    <Route path='/notAccept'>
                        <DenyPage/>
                    </Route>
                    <Route path='/pageNotFound'>
                        <PageNotFound/>
                    </Route>
                    <CustomRoute status = {isCompleteInitUser} path='/admin' backPath='/' roles={[roles.ADMIN]}>
                        <Admin isCompleteInitUser={isCompleteInitUser}/>
                    </CustomRoute>
                    <CustomRoute status = {isCompleteInitUser} path='/' backPath='/admin' roles={[roles.CUSTOMER,roles.NO_AUTH]}>
                        <User isCompleteInitUser={isCompleteInitUser}/>
                    </CustomRoute>
                    
                </Switch>
            </div>           
            <Footer/>
        </React.Fragment>
    )
}
export default Main;