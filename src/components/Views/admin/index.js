import React,{useState,useEffect} from 'react';
import Header from '../../Commons/Header';
import Footer from '../../Commons/Footer';
import SearchBar from '../../Layouts/SearchBar';
import {routeProductAPI,defaultParamValue} from '../../Constant/ProductConstant';
import { Switch} from 'react-router-dom';
import CustomRoute from '../../Utils/CustomRoute.util';
import {Toast} from 'primereact/toast';
import categoryService from '../../../service/category.service';
import productService from '../../../service/product.service';
import credentialService from '../../../service/credential.service';
import {useSelector,useDispatch} from 'react-redux';
import {roles} from '../../Constant/CredentialConstant';
import Loading from '../../Utils/Views/Loading';
import statusCode from 'http-status-codes';
import Admin from '../../Layouts/Admin';
import CustomerGuest from '../../Layouts/CustomerGuest';

const Main=()=>{
    const [isCompleteInitUser, setIsCompleteInitUser] = useState(false);
    // const [productUrl,setProductUrl]=useState(routeProductAPI.search);
    // const [params,setParams]=useState(defaultParamValue);
    // const [page,setPage]=useState('0');
    // const [totalPage,setTotalPage]=useState('0');
    // const [searchData,setSearchData]=useState('');
    // const [updateDataAction,setUpdateDataAction]=useState('');
    //const [updateCategoryAction,setUpdateCategoryAction]=useState(false);
    
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state); 

    const onChangeQueryValue= async (_params,deleteParams=[])=>{
        // let updateData={};
        // await setParams((prevData)=>{
        //     updateData={...prevData};
        //     for(let param in _params){
        //         updateData={...updateData,[param]:_params[param]};
        //     }
        //     for(let param of deleteParams){
        //         delete updateData[param];
        //     }
        //     return updateData;
        // });
        // await getSearchData(updateData);
    }
    // const onUpdateDataHandler=()=>{
    //     setUpdateDataAction(!updateDataAction);
    // }
    // const getSearchData = async (_params) => {
    //     global.loading.show();
    //     const res =await productService.search(_params);
    //     const products=res.data.payload.products;
    //     const totalPage=res.data.payload.total;
    //     const page=_params.page;
    //     if(page) setPage(page)
    //     else{
    //         if(totalPage>0) setPage(1);
    //         else setPage(0);
    //     }
    //     setSearchData(products);
    //     setTotalPage(totalPage);
    //     global.loading.hide();
    // }
    useEffect(()=>{
        // const getCategories = async () =>{
        //     const res = await categoryService.getAll();
        //     switch (res.status){
        //         case statusCode.INTERNAL_SERVER_ERROR:
        //             global.toast.show({severity:'error', summary: 'Load data', detail: 'Fail to load category', life: 1500});
        //             break;
        //         default:
        //     }
        // }
        // const getUser = async ()=>{
        //     await credentialService.signinToken();  
        //     setIsCompleteInitUser(true); 
        // }
        // const getAllProduct = async () => {
        //     const res = await productService.getAll();
        //     switch (res.status){
        //         case statusCode.INTERNAL_SERVER_ERROR:
        //             global.toast.show({severity:'error', summary: 'Load data', detail: 'Fail to load product', life: 1500});
        //             break;
        //         default:
        //     }
        // }
        // getCategories();
        // getUser();
        // getAllProduct();
        // global.socket.on('signIn',user=>dispatch({type:'signin',user}));
        // global.socket.on('signOut',()=>dispatch({type:'signout'})); 
        // global.socket.on('sync',(user)=>dispatch({type:'sync',user})); 
        // global.socket.on('updateCart',(cart)=>dispatch({type:'updateCart',cart})); 
        return () => {
            console.log('Reload');
            // global.socket.off('signIn');
            // global.socket.off('signOut');
            // global.socket.off('sync');
            // global.socket.off('updateCart');
            // let _socketID = JSON.parse(localStorage.getItem('socketID'));
            // _socketID = _socketID.filter(sk=>sk !== global.socket.id);
            // console.log('_socketID:'+_socketID);
            // localStorage.setItem('socketID',JSON.stringify(_socketID)); 
        }   
    },[])
    // useEffect(()=>{
    //     const itv = setInterval(()=>{
    //         const lUser = localStorage.getItem('user');
    //         const cUser = (user.role === roles.NO_AUTH) ? null : JSON.stringify(user);
    //         if(cUser !== lUser){
    //             (lUser) ? dispatch({type:'signin',user : JSON.parse(lUser)}) : dispatch({type:'signout'});
    //         }
    //     },5000);
    //     return ()=>{
    //         clearInterval(itv);
    //     }
    // },[user])
    // useEffect(()=>{
    //         window.scrollTo(0,0);
    //         //getSearchData(params);
    //         // productService.
    // },[updateDataAction]);
    return (
        <React.Fragment>
            <Loading ref={(ref)=>global.loading=ref}/>
            <Header/>
            <SearchBar onSubmit={onChangeQueryValue}/>           
            <Toast ref={(ref) => global.toast=ref}/>            
            <div style={{minHeight: '82.3vh',marginRight:'0px', backgroundColor:'whitesmoke'}}>
                <Switch>
                    <CustomRoute status = {isCompleteInitUser} path='/admin' backPath='/' roles={[roles.ADMIN]}>
                        <Admin isCompleteInitUser={isCompleteInitUser}/>
                    </CustomRoute>
                    <CustomRoute status = {isCompleteInitUser} path='/' backPath='/admin' roles={[roles.CUSTOMER,roles.NO_AUTH]}>
                        <CustomerGuest isCompleteInitUser={isCompleteInitUser}/>
                    </CustomRoute>
                </Switch>
                {/* {user.role === roles.ADMIN ? <Admin>

                </Admin>
                :
                <div className='p-col-10' style={{position:'relative',zIndex:'0'}}>
                        <Switch>
                        <Route path='/' exact>
                            {user.role === roles.ADMIN && <AddNewProductButton/>}
                            <TabMenu onChange={onChangeQueryValue} categoryParam={params.category}/>
                            <FilterBar onSubmit={onChangeQueryValue} params={params}/>  
                            <ProductList products={searchData}/>
                            <CustomPagination url={productUrl} params={params} page={page} totalPage={totalPage}  onClickPageBtn={onChangeQueryValue}/>
                        </Route>
                        <CustomRoute status = {isCompleteInitUser} path='/signin' backPath='/' roles={[roles.NO_AUTH]} exact>
                            <SignIn/>
                        </CustomRoute>

                        <CustomRoute status = {isCompleteInitUser} path='/signup' backPath='/' roles={[roles.NO_AUTH]} exact>
                            <SignUp />
                        </CustomRoute>
                        <CustomRoute status = {isCompleteInitUser} path='/forgotpassword' backPath='/' roles={[roles.NO_AUTH]} exact>
                            <ForgotPassword/>
                        </CustomRoute>
                        <Route path={'/product/:_id'}>
                            <ProductDetail onUpdate={onUpdateDataHandler}/>
                        </Route>
                        <CustomRoute status = {isCompleteInitUser} path='/product' backPath='/signin' roles={[roles.ADMIN]} exact>
                            <ProductDetailCreate onUpdate={onUpdateDataHandler}/>
                        </CustomRoute>
                        <CustomRoute status = {isCompleteInitUser} path='/cart' backPath='/signin' roles={[roles.CUSTOMER]}  exact>
                            <Cart/>
                        </CustomRoute>
                        <CustomRoute status = {isCompleteInitUser} path='/order' backPath='/signin' roles={[roles.CUSTOMER]}  exact>
                            <OrderHistory/>
                        </CustomRoute>
                        <CustomRoute status = {isCompleteInitUser} path='/order/:_id' backPath='/signin' roles={[roles.ADMIN]}  exact>
                            <Order/>
                        </CustomRoute>
                        
                        <Route>
                            <div style={{minHeight:'79vh'}}>
                                <h1>Not found</h1>
                            </div>   
                        </Route>
                    </Switch>                  
                </div>
                } */}
            </div>           
            <Footer/>
        </React.Fragment>
    )
}
export default Main;