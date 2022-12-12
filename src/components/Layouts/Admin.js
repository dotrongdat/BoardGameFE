import React from 'react';
import {PanelMenu} from 'primereact/panelmenu';
import {Redirect, Route, useHistory} from 'react-router-dom';
import {Switch} from 'react-router-dom';
import CustomRoute from '../Utils/CustomRoute.util';
import { roles } from '../Constant/CredentialConstant';
import Category from './admin/Category';
import Product from './admin/Product';
import Order from './admin/Order';
import Blog  from './admin/Blog';


const Admin = (props) => {
    const _useHistory = useHistory();
    const items = [
        {
            label: "Quản lí đơn hàng",
            icon: "pi pi-pw pi-envelope",
            items: [
                {
                    label: "Tất cả đơn hàng",
                    command: ()=>{_useHistory.push('/admin/order')}
                },
                {
                    label: "Đơn hàng đang xử lí"
                }
            ]
        },
        {
            label: "Quản lí sản phẩm",
            icon: "pi pi-pw pi-tag",
            items: [
                {
                    label: "Tất cả sản phẩm",
                    command: ()=> {_useHistory.push('/admin/product')}
                },
                {
                    label: "Quản lí danh mục",
                    command: ()=> {_useHistory.push('/admin/category')}
                }
            ]
        },
        {
            label: "Quản lí bài đăng",
            icon: "pi pi-pw pi-book",
            command: () => {_useHistory.push('/admin/blog')},
            items: []
        },
        {
            label: "Tài chính",
            icon: "pi pi-pw pi-wallet",
            items: [
                {
                    label: "Doanh thu",
                    command: ()=>{}
                },
                {
                    label: "Ví điện tử",
                    command: ()=>{}
                },
                {
                    label: "Tài khoản ngân hàng",
                    command: ()=>{}
                }
            ]
        }
    ]
    return (
        <div className='p-grid p-justify-center p-mt-1' style={{marginRight: '1px'}}>
            <PanelMenu multiple={true} model={items} style={{width: "16v", position: 'absolute', left: 0}}/>            
            <div className='p-col-7' style={{minHeight:'82.3vh', backgroundColor: "whitesmoke"}}>
                <Switch>
                    {/* <CustomRoute status = {props.isCompleteInitUser} path='/product' backPath='/' roles={[roles.ADMIN]} exact>
                        <ProductDetail_Create onUpdate={onUpdateDataHandler}/>
                    </CustomRoute> */}
                    <Route path={'/admin'} exact>
                        <Redirect to={'/admin/order'}/>
                        {/* {_useHistory.replace('/admin/order')} */}
                    </Route>
                    <CustomRoute status = {props.isCompleteInitUser} path='/admin/category' backPath='/' roles={[roles.ADMIN]}  exact>
                        <Category/>
                    </CustomRoute>
                    <CustomRoute status = {props.isCompleteInitUser} path='/admin/product' backPath='/' roles={[roles.ADMIN]}  exact>
                        <Product/>
                    </CustomRoute>
                    <CustomRoute status = {props.isCompleteInitUser} path='/admin/order' backPath='/' roles={[roles.ADMIN]}  exact>
                        <Order/>
                    </CustomRoute>
                    <CustomRoute status = {props.isCompleteInitUser} path='/admin/blog' backPath='/' roles={[roles.ADMIN]}  exact>
                        <Blog/>
                    </CustomRoute>
                </Switch>
            </div>
        </div>
    )
}

export default Admin;