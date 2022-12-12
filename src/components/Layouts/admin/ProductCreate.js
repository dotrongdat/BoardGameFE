import React,{useRef,useState,useEffect, useImperativeHandle, forwardRef} from 'react';
import './ProductDetail.css';
import {Button} from 'primereact/button';
import {Editor} from 'primereact/editor';
import {Dropdown} from 'primereact/dropdown';
import OrderImageList from '../../Utils/Views/OrderImagesList';
import FileUpload from '../../Utils/Views/FileUpload';
import productService from '../../../service/product.service';
import statusCode from 'http-status-codes';
import { useSelector } from 'react-redux';
import {InputText} from 'primereact/inputtext';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';

const ProductCreate=(props,ref)=>{
    const [categoryOptions,setCategoryOptions]=useState([]);
    
    const albumRef=useRef();

    const {categories} = useSelector(state=>state);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            detailDescription: [],
            brand: '',
            quantity: undefined,
            price: undefined,
            category: '',
            album: [],
            blog: ''
        },
        initialErrors: {
            detailDescription:[]
        },
        validate: (data)=>{
            let errors = {};
            if (!data.name) errors.name = 'Bắt buộc';
            if (data.name.length < 2 || data.name.length > 350) errors.name = '2-350 chữ cái';
            
            if (!data.category) errors.category = 'Bắt buộc';

            if (!data.brand) errors.brand = 'Bắt buộc';
            if (data.brand.length < 2 || data.brand.length > 50) errors.brand = '2-50 chữ cái';

            if (data.description.length > 2000) errors.description = 'Tối đa 1000 chữ cái';
            

            if (!data.quantity) errors.quantity = 'Bắt buộc';
            
            if (!data.price) errors.price = 'Bắt buộc';

            if (data.album.length === 0) errors.album = 'Bắt buộc';
            return errors;
        },
        onSubmit: async (data)=>{
            global.loading.show(); 
            let submitAlbum = [];
            data.album.forEach(i=>submitAlbum.push(i.name));    
            const createData={
                name: data.name,
                category: data.category,
                brand: data.brand,
                description: data.description,
                detailDescription: data.detailDescription.map(v=>JSON.stringify(v)),
                quantity: data.quantity,
                price: data.price,
                album: submitAlbum,
                albumFile: data.album,
                blog: data.blog
            }                     
                const res= await productService.create(createData);
                switch (res.status){
                    case statusCode.OK:
                        global.toast.show({severity:'success', summary: 'Tạo mới sản phẩm', detail: 'Thành công', life: 1500});
                        reset();
                        break;
                    default:
                }
            global.loading.hide();
        }
    })
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    const reset = ()=>{
        formik.resetForm();
        albumRef.current.clear();
    }
    useImperativeHandle(ref,()=>({
        create: () => formik.submitForm(),
        reset
        }
    ));
    const addDescriptionDetailFieldInput = () => {
        formik.setFieldValue('detailDescription',[...formik.values.detailDescription, {title:'',content: ''}]);
    }
    const removeDescriptionDetailFieldInput = (index) => {
        let updateData = formik.values.detailDescription;
        updateData.splice(index,1);
        formik.setFieldValue('detailDescription',updateData);
    }
    useEffect(()=>{
        setCategoryOptions(prevData =>{
            let categoryDropdownData=[];
            categories.forEach((category)=>{
                category.status && categoryDropdownData.push({
                    name: category.name,
                    value: category._id
                })
            });
            return categoryDropdownData;
        });      
    },[categories])
    return (
        <React.Fragment>       
        <form className="product-detail p-grid p-justify-center" onSubmit={formik.handleSubmit}>
            <div className='p-col-8 p-d-flex p-jc-center'>
                <div className='p-col-6 p-pt-6'>
                    <OrderImageList id = "album" items={formik.values.album} onChange={(value)=>formik.setFieldValue('album',value)}/>  
                </div>
                <div className='p-col-5 p-pt-6'>
                    <FileUpload 
                        id='albumFile'
                        _ref={albumRef} 
                        onChoose={(items)=>formik.setFieldValue('album',formik.values.album.concat(items),true)} 
                        onRemove={(item)=>formik.setFieldValue('album',formik.values.album.filter(i=>i.objectURL!==item), true)}
                        onClear={()=>formik.setFieldValue('album',[],true)}
                        multiple={true}
                        isValidFileHandler={(isValid)=> formik.setFieldError('album',isValid ? '' : 'File không phù hợp')}
                        errorLabel='filesUpload'                   
                    />
                    {getFormErrorMessage('album')}
                </div>
            </div>
            <div className='p-col-6 p-fluid'>
                <div className='p-mt-5'>
                    <span className="p-float-label">
                        <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })}/>
                        <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Tên</label>
                    </span>
                    {getFormErrorMessage('name')}
                </div>
                <div className='p-mt-5'>
                    <span className="p-float-label">
                        <Dropdown id="category" name="category" style={{width:'100%'}} optionLabel="name"  options={categoryOptions} value={formik.values.category} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('category') })}/>
                        {/* <InputText id="category" name="category" value={formik.values.category} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('category') })}/> */}
                        <label htmlFor="category" className={classNames({ 'p-error': isFormFieldValid('category') })}>Danh mục</label>
                    </span>
                    {getFormErrorMessage('category')}
                </div>
                <div className='p-mt-5'>
                    <span className="p-float-label">
                        <InputText id="brand" name="brand" value={formik.values.brand} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('brand') })}/>
                        <label htmlFor="brand" className={classNames({ 'p-error': isFormFieldValid('brand') })}>Thương hiệu</label>
                    </span>
                    {getFormErrorMessage('brand')}
                </div>
                <div className='p-mt-5'>
                    <span className="p-float-label">
                        <InputTextarea aria-multiline={true} id="description" name="description" value={formik.values.description} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('description') })}/>
                        <label htmlFor="description" className={classNames({ 'p-error': isFormFieldValid('description') })}>Mô tả</label>
                    </span>
                    {getFormErrorMessage('description')}
                </div>
                <div className='p-mt-1'>
                    <label htmlFor="detailDescription" >Mô tả chi tiết</label>
                    <div id='detailDescription' className={classNames({ 'p-invalid': isFormFieldValid('description') })}>
                        {formik.values.detailDescription.map((val,index)=>{
                            return (   
                                <div className='p-d-flex p-jc-between p-mt-1' key={index}>
                                    <InputText placeholder='Công dụng/xuất xứ/bảo quản/...' value={val.title} 
                                        onChange={e => {
                                            let updateData = formik.values.detailDescription;
                                            updateData[index].title = e.target.value;
                                            formik.setFieldValue('detailDescription', updateData);
                                        }} 
                                        autoFocus />
                                    <InputText placeholder='Nội dung' value={val.content} 
                                        onChange={e => {
                                            let updateData = formik.values.detailDescription;
                                            updateData[index].content = e.target.value;
                                            formik.setFieldValue('detailDescription', updateData);
                                        }} 
                                        autoFocus />
                                    <Button style={{width: '10rem'}} icon='pi pi-trash' className='p-button-warning' type='button' onClick={()=>removeDescriptionDetailFieldInput(index)}/>
                                </div>)
                            
                        })}
                        <Button style={{width: '5rem'}} icon='pi pi-plus-circle' type='button' className="p-button-sm p-mt-1 p-button-secondary" label='Thêm' onClick={addDescriptionDetailFieldInput}/>
                    </div>
                </div>
                <div className='p-mt-5'>
                    <span className="p-float-label">
                        <InputNumber id="quantity" name="quantity" min={1} mode="decimal" showButtons value={formik.values.quantity} onValueChange={(e)=>formik.setFieldValue('quantity',e.value)} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('quantity') })}/>
                        <label htmlFor="quantity" className={classNames({ 'p-error': isFormFieldValid('quantity') })}>Số lượng</label>
                    </span>
                    {getFormErrorMessage('quantity')}
                </div>
                <div className='p-mt-5'>
                    <span className="p-float-label">
                        <InputNumber id="price" name="price" min={1} mode="decimal" showButtons value={formik.values.price} onValueChange={(e)=>formik.setFieldValue('price',e.value)} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('price') })}/>
                        <label htmlFor="price" className={classNames({ 'p-error': isFormFieldValid('price') })}>Giá</label>
                    </span>
                    {getFormErrorMessage('price')}
                </div>
                <div className='p-mt-2'>
                    <label htmlFor="blog" placeholder='Blog'>Bài viết về sản phẩm</label>
                    <Editor id='blog' style={{ height: '320px' }} value={formik.values.blog} onTextChange={(e) => formik.setFieldValue('blog',e.htmlValue)}/>
                </div>
            </div>
        </form>
        </React.Fragment>
    );    
}

export default forwardRef(ProductCreate);