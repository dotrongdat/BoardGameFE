import React,{useState,useEffect,useRef} from 'react';
import {TabMenu as TabMenuPrime} from 'primereact/tabmenu';
import { useSelector } from 'react-redux';
import { roles } from '../Constant/UserConstant';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import categoryService from '../../service/category.service';
import _ from 'lodash';
import statusCode from 'http-status-codes';
import { useHistory } from 'react-router';

const HOME_TAB = {
    label:'All', 
    logo:'pi pi-fw pi-home',
    value: 'home'
}
const NEW_CATEGORY = {
    label: 'NEW +',
    logo: 'pi pi-plus-circle',
    value: 'new',
    template : (item,option)=>{
        const onSubmitHandler = async (e)=>{
            e.preventDefault();
            let name = e.target[0].value;
            if (!_.isEmpty(name)){
                global.loading.show();
                const res = await categoryService.create({name});
                switch (res.status){
                    case statusCode.OK:
                        global.toast.show({severity:'success', summary: 'Successfully', detail: '', life: 1500});
                        break;
                    case statusCode.UNAUTHORIZED:
                        break;
                    case statusCode.INTERNAL_SERVER_ERROR:
                        break;
                    default: break;
                }
                global.loading.hide();
            }
        }
        return (
            <form onSubmit={onSubmitHandler}>
                <div className="p-inputgroup">
                    <InputText placeholder='Type name ...' name='categoryName' required/>
                    <Button icon="pi pi-plus-circle" type='submit' className="p-button-success"/>
                </div>
            </form>
        );
    }
}
const TabMenu = (props) =>{
    const [activeIndex,setActiveIndex] = useState();
    const [items,setItems] = useState([]);

    const {categories,user} = useSelector(state=>state);
    const [categoryNameInput,setCategoryNameInput] = useState();
    
    //const setUpItemTemplate
    const onTabChangeHandler=(e)=>{
        const index= e.index;
        setActiveIndex(index);
        switch (e.value.value) {
            case 'home':
                props.onChange({page:1},['category']);
                break;
            case 'new':

                break;
            default:
                props.onChange({category:e.value.value,page: 1});
                break;
        }
    }
    const onSubmitHandler = async e =>{
        e.preventDefault();
    }
    useEffect(()=>{
        if(!props.categoryParam) setActiveIndex(user.role === roles.ADMIN ? 1 : 0);
    },[props.categoryParam,user.role])
    useEffect(()=>{
        const index = items.findIndex(i => i.value === 'new');
        switch (user.role) {
            case roles.ADMIN:
                if(index === -1) setItems(prevData=>[NEW_CATEGORY,...prevData]);
                break;
            case roles.CUSTOMER:
                if(index !== -1) setItems(prevData => prevData.filter((i,_index)=>_index!==index));
                break;
            case roles.NO_AUTH:
                if(index !== -1) setItems(prevData => prevData.filter((i,_index)=>_index!==index));
                break;
            default:
                break;
        }
    },[user.role,items])
    useEffect(()=>{
        let _activeIndex = 0;
        let categoriesTab = [HOME_TAB];
        categories.forEach((category,index)=>{
            const categoryInfo={
                label: category.name,
                logo: category.logo,
                value: category._id
            }
            categoriesTab.push(categoryInfo);
            if(props.categoryParam && props.categoryParam===categoryInfo.value) 
                _activeIndex = index+1;
        });
        setItems(categoriesTab);
        setActiveIndex(_activeIndex);
            
    },[categories]);
    return (
        <div className='p-grid' style={{marginTop : '3vh'}}>
            {user.role === roles.ADMIN && <form className='p-col-3'>
                <div className="p-inputgroup">
                    <InputText placeholder='Type name ...' name='categoryName' required/>
                    <Button icon="pi pi-plus-circle" type='submit' className="p-button-success"/>
                </div>
            </form>}
            <TabMenuPrime className='p-col-9' model={items}  activeIndex={activeIndex} onTabChange={onTabChangeHandler}/>
        </div>
    );
};

export default TabMenu;