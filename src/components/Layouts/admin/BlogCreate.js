import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useFormik } from "formik";
import blogService from "../../../service/blog.service";
import statusCode from 'http-status-codes';
import { NO_IMAGE } from "../../Constant";
import FileUpload from "../../Utils/Views/FileUpload";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";

const BlogCreate = (props,ref) => {
    const uploadRef = useRef();
    const reset = ()=>{
        formik.resetForm();
        uploadRef.current.clear();
    }
    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            source: '',
            image: '',
        },
        // initialErrors: {
        //     detailDescription:[]
        // },
        validate: (data)=>{
            let errors = {};
            if (!data.title) errors.title = 'Bắt buộc';
            if (data.title.length < 2 || data.title.length > 350) errors.title = 'Tiêu đề từ 2 - 350 chữ cái';
            
            if (!data.content) errors.category = 'Bắt buộc';
            
            if (!data.source) errors.source = 'Bắt buộc';

            if (!data.image) errors.image = 'Bắt buộc';
            return errors;
        },
        onSubmit: async (data)=>{
            global.loading.show();   
            const createData={
                title: data.title,
                content: data.content,
                source: data.source,
                image: data.image,
            }                     
                const res= await blogService.create(createData);
                switch (res.status){
                    case statusCode.OK:
                        global.toast.show({severity:'success', summary: 'Tạo mới bài viết', detail: 'Thành công', life: 1500});
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
    useImperativeHandle(ref,()=>({
        create: () => formik.submitForm(),
        reset
        }
    ));
    return (
        <React.Fragment>       
            <form className="product-detail p-grid p-justify-center" onSubmit={formik.handleSubmit}>
                <div className='p-col-7 p-d-flex p-jc-center'>
                    <div className='p-col-6 p-pt-6'>
                        <img src={(formik.values.image.objectURL?formik.values.image.objectURL:NO_IMAGE)} alt={'itemImg'} style={{height: '60%', width: '60%'}}/>  
                    </div>
                    <div className='p-col-5 p-pt-6'>
                        <FileUpload 
                            id='albumFile'
                            _ref={uploadRef} 
                            onChoose={(item)=>formik.setFieldValue('image',item)} 
                            onRemove={()=>formik.setFieldValue('image','', true)}
                            onClear={()=>formik.setFieldValue('image','',true)}
                            multiple={false}
                            isValidFileHandler={(isValid)=> formik.setFieldError('image',isValid ? '' : 'File không hợp lệ')}
                            errorLabel='filesUpload'                   
                        />
                        {getFormErrorMessage('image')}
                    </div>
                </div>
                <div className='p-col-6 p-fluid'>
                    <div className='p-mt-5'>
                        <span className="p-float-label">
                            <InputText id="title" name="title" value={formik.values.title} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('title') })}/>
                            <label htmlFor="title" className={classNames({ 'p-error': isFormFieldValid('title') })}>Tiêu đề</label>
                        </span>
                        {getFormErrorMessage('title')}
                    </div>
                    <div className='p-mt-5'>
                        <span className="p-float-label">
                            <InputText id="source" name="source" value={formik.values.source} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('source') })}/>
                            <label htmlFor="source" className={classNames({ 'p-error': isFormFieldValid('source') })}>Nguồn</label>
                        </span>
                        {getFormErrorMessage('source')}
                    </div>
                    <div className='p-mt-2'>
                        <label htmlFor="content" placeholder='content'>Nội dung</label>
                        <Editor id='content' style={{ height: '320px' }} value={formik.values.content} onTextChange={(e) => formik.setFieldValue('content',e.htmlValue)}/>
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}

export default forwardRef(BlogCreate);