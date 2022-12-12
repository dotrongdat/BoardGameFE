import React, { Fragment } from 'react';
import { Route, Switch} from 'react-router-dom';
import ProductList from './ProductList';
import {useSelector} from 'react-redux';
import CustomRoute from '../Utils/CustomRoute.util';
import { roles } from '../Constant/CredentialConstant';
import SignIn from '../Views/SignIn';
import SignUp from '../Views/SignUp';
import ForgotPassword from '../Views/ForgotPassword';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import SearchBar from './SearchBar';
import { Redirect } from 'react-router-dom';
import Breadcrumb from '../Utils/Views/Breadcrumb';
import Home from './Home';
import './User.css';
import { BACKGROUND_COLOR } from '../Constant';
import CheckOutResult from './CheckOutResult';
import CustomerMessage from '../Utils/Views/CustomerMessage';
import {Blog, BlogList} from './Blog';

const User = (props) => {
    const {isSignIn, user} = useSelector(state=>state);
    return (
        <Fragment>  
            <div className='p-grid p-justify-center' style={{marginRight: '1px',backgroundColor: BACKGROUND_COLOR}}>
                <div className='center  p-mt-2 p-col-8' style={{position:'relative',zIndex:'0', minHeight:'83vh',backgroundColor: BACKGROUND_COLOR}}>
                    <SearchBar/>
                    
                    <Switch>
                        <Route path={['/']} exact>
                            <Home/>
                        </Route>
                        <Route path={['/search','/category','/product/:_id']} exact>
                            <Breadcrumb ref={r=>global.breadcrumb = r}/>
                            <Route path={['/search','/category']} exact>
                                <ProductList/>
                            </Route>
                            <Route path={'/product/:_id'} exact>
                                <ProductDetail/>
                            </Route>
                        </Route>
                        <Route path={'/blog/:_id'} exact>
                            <Blog/>
                        </Route>
                        <Route path={'/blog'} exact>
                            <BlogList/>
                        </Route>
                        <CustomRoute status = {props.isCompleteInitUser} path='/signin' backPath='/' roles={[roles.NO_AUTH]} exact>
                            <SignIn/>
                        </CustomRoute>

                        <CustomRoute status = {props.isCompleteInitUser} path='/signup' backPath='/' roles={[roles.NO_AUTH]} exact>
                            <SignUp />
                        </CustomRoute>
                        <CustomRoute status = {props.isCompleteInitUser} path='/forgotpassword' backPath='/' roles={[roles.NO_AUTH]} exact>
                            <ForgotPassword/>
                        </CustomRoute>
                        <CustomRoute status = {props.isCompleteInitUser} path='/cart' backPath='/signin' roles={[roles.NO_AUTH,roles.CUSTOMER]}  exact>
                            <Cart/>
                        </CustomRoute>
                        <CustomRoute status = {props.isCompleteInitUser} path='/order' backPath='/signin' roles={[roles.CUSTOMER]}  exact>
                            <OrderHistory/>
                        </CustomRoute>
                        {/* <CustomRoute status = {props.isCompleteInitUser} path='/order/:_id' backPath='/signin' roles={[roles.ADMIN]}  exact>
                            <Order/>
                        </CustomRoute>    */}
                        <Route path='/checkoutResult' exact>
                            <CheckOutResult/>
                        </Route>                 
                        <Route >
                            <Redirect to={'/pageNotFound'} push/>
                        </Route>
                    </Switch>
                </div>
            </div>
            {(isSignIn && user.role === roles.CUSTOMER) && <CustomerMessage/>}
        </Fragment>
    )
};

export default User;