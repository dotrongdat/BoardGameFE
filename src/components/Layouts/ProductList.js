import React, { useEffect, useState } from 'react';
import Product from './Product';
import './Product.css';
import './ProductList.css';
import {cloneDeep, isEmpty } from 'lodash';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomPagination from '../Utils/Views/CustomPagination';

const ProductList=(props)=>{
    const [productList,setProductList]=useState([]);
    const [pagingProductList,setPagingProductList] = useState([]);
    const {search} = useLocation();
    const {allProducts,categories,isInitialize} = useSelector(state=>state);
    const [page,setPage] = useState();
    const [totalPage,setTotalPage] = useState();

    const paging = (page,data=undefined)=>{
        setPage(page);
        const start = (page-1)*12;
        const end = page*12;
        if(data!==undefined){
            setPagingProductList(data.slice(start,end));
        }else{
            setPagingProductList(productList.slice(start,end));
        }        
    }
    useEffect(()=>{
        if(isInitialize){
            let keyValueArray = search.split("&");
            let _allProduct = cloneDeep(allProducts);
            if(keyValueArray.length !== 0){
                keyValueArray[0]=keyValueArray[0].slice(1);
                keyValueArray.forEach(val=>{
                    const kv = val.split("=") ;
                    const key = kv[0];
                    const value = kv[1];
                    switch (key) {
                        case 'key':
                            _allProduct = _allProduct.filter(p=>p.name.includes(value));
                            global.breadcrumb.pullAll();
                            break;
                        case 'cate_id':
                            _allProduct = _allProduct.filter(p=>p.category===value);
                            const category = categories.find(c=>c._id === value);
                            global.breadcrumb.pullAll();
                            global.breadcrumb.push(category.name,`/category?cate_id=${category._id}`)
                            break;
                        default:
                            break;
                    }
                })
            }
            setProductList(_allProduct);
            setTotalPage(Math.ceil(_allProduct.length/12));
            paging(1,_allProduct);
        }
    },[search, isInitialize]);
    const view = ()=>{
        return (
            <div style={{paddingBottom: '5px'}}>
                <div className="p-grid p-formgrid p-fluid p-justify-right product-list">
                    {pagingProductList.map((product,index)=>(                    
                        <div key={index} className='p-col-3  p-p-4'>
                            <Product key={product._id} product={product}/>
                        </div>
                    ))}
                </div>
                <CustomPagination page={page} totalPage={totalPage}  onClickPageBtn={paging}/>
            </div>
        );
    }
    const emptyView = ()=> {
        return (
            <div className="product-list p-grid p-align-center vertical-container p-justify-center p-mt-2">
                <img src='/noResult.png' alt='noProductFound'/>
            </div>
        )};  
    return (
        <React.Fragment> 
            {(isInitialize && isEmpty(pagingProductList)) ? emptyView() : view()}
        </React.Fragment>
    );                
}

export default ProductList