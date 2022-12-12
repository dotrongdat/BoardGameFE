import React,{useRef,useState,useEffect} from 'react';
import './ProductDetail.css';
import {Form} from 'react-bootstrap';
import {Button} from 'primereact/button';
import Validation from '../Utils/Validation.utils';
import ProductRequestValidation from '../Validations/ProductRequest.validation';
import BackButton from '../Utils/Views/BackBtn';
import {Editor} from 'primereact/editor';
import {Dropdown} from 'primereact/dropdown';
import OrderImageList from '../Utils/Views/OrderImagesList';
import FileUpload from '../Utils/Views/FileUpload';
import productService from '../../service/product.service';
import statusCode from 'http-status-codes';
import {useHistory} from 'react-router-dom';
import { useSelector } from 'react-redux';


const DEFAULT_ERRORS_STATE={
    'name' : [],
    'description' : [],
    'publishedYear': [],
    'quantity': [],
    'price':[],
    'imageFile':[],
    'filesUpload':[]
}
const ProductDetail_Create=(props)=>{
    const [errors,setErrors]=useState(DEFAULT_ERRORS_STATE);
    const [blog, setBlog] = useState('');
    const [categoryOptions,setCategoryOptions]=useState([]);
    const [categoryDropdownValue,setCategoryDropdownValue]=useState(null);
    const [album,setAlbum]=useState([]);
    
    const albumRef=useRef();
    const nameInput=useRef();
    const descriptionInput=useRef();
    const publishedYearInput=useRef();
    const quantityInput=useRef();
    const priceInput=useRef();
    const _useHistory = useHistory();

    const {categories} = useSelector(state=>state);

    const addErrors=(comp,errorMsg)=>{
        setErrors((prevData)=>{
            return {
                ...prevData,
                [comp]: errorMsg
            }
        })
    }
    const onSubmitHandler=async (e)=>{
        global.loading.show(); 
        e.preventDefault();
        let submitAlbum = [];
        album.map(i=>submitAlbum.push(i.name));    
        const createData={
            name: nameInput.current.value,
            category: categoryDropdownValue,
            description: descriptionInput.current.value,
            publishedYear: publishedYearInput.current.value,
            quantity: quantityInput.current.value,
            price: priceInput.current.value,
            album: submitAlbum,
            albumFile: albumRef.current.files,
            blog: blog
        }
        const validateReq = Validation(ProductRequestValidation.create(createData));
        if(validateReq.isValid){                           
            const res= await productService.create(createData);
            switch (res.status){
                case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Create new product', detail: 'Successfully', life: 1500});
                    props.onUpdate();
                    _useHistory.replace(`/product/${res.data.payload._id}`);
                    break;
                case statusCode.UNAUTHORIZED:
                    _useHistory.replace('/signin');
                    break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                    break;
                default:
            }
        } else {
            setErrors((prevData)=>{
                let updateData={...prevData};
                for(let property in validateReq.errors){
                    updateData={...updateData,[property]:validateReq.errors[property]}
                }
                return updateData;
            });
        }
        global.loading.hide();
    }
    useEffect(()=>{
        window.scrollTo(0,0);
        setCategoryOptions(prevData =>{
            let categoryDropdownData=[];
            categories.forEach((category)=>{
                categoryDropdownData.push({
                    name: category.name,
                    value: category._id
                })
            });
            return categoryDropdownData;
        });
        setCategoryDropdownValue(categories[0]._id);       
    },[categories])
    return (
        <React.Fragment>       
        <Form className="product-detail" onSubmit={onSubmitHandler}>
        <div className="p-grid p-justify-center">
            <div className='p-col-6 p-ml-6 p-mt-6 p-pt-6'>
                <OrderImageList items={album} onChange={setAlbum}/>
            </div>
            <div className='p-col-5 p-mt-6 p-pt-6'>
                <FileUpload _ref={albumRef} 
                    onChoose={(items)=>{setAlbum(album.concat(items))}} 
                    onRemove={(item)=>setAlbum(album.filter((i)=>i.objectURL!==item))}
                    onClear={()=>setAlbum(album.filter((i)=>i.objectURL===undefined))}
                    multiple={true}
                    invalidFileHandler={addErrors}
                    errorLabel='filesUpload'
                />
                <Form.Text >
                    {errors.filesUpload.map((error,index)=>
                        <p key={index}>{error}</p>
                    )}                            
                </Form.Text>
            </div>
            <div className='product-detail_content p-col-10 p-mt-6'>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control ref={nameInput}/>
                        <Form.Text >
                        {errors.name.map((error,index)=>
                            <p key={index}>{error}</p>
                        )}                            
                        </Form.Text> 
                    </Form.Group>
                    <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Group>
                            <Dropdown style={{width:'100%'}} optionLabel="name"  options={categoryOptions} value={categoryDropdownValue} onChange={e=>{setCategoryDropdownValue(e.value)}}/>
                            </Form.Group>                            
                    </Form.Group>                     
                    <Form.Group> 
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" aria-multiline='true' ref={descriptionInput}/>
                        <Form.Text >
                        {errors.description.map((error,index)=>
                            <p key={index}>{error}</p>
                        )}                            
                        </Form.Text>
                    </Form.Group>  
                    <Form.Group>  
                        <Form.Label>Published Year</Form.Label>
                        <Form.Control type="number" step="1" ref={publishedYearInput}/>
                        <Form.Text >
                        {errors.publishedYear.map((error,index)=>
                            <p key={index}>{error}</p>
                        )}                            
                        </Form.Text>
                    </Form.Group>      
                    <Form.Group>  
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" step="1" ref={quantityInput} min="0"/>
                        <Form.Text >
                        {errors.quantity.map((error,index)=>
                            <p key={index}>{error}</p>
                    )}                            
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" className="product-detail_price" step="1" ref={priceInput} />
                        <Form.Text >
                        {errors.price.map((error,index)=>
                            <p key={index}>{error}</p>
                        )}                            
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Blog</Form.Label>
                        <Editor style={{ height: '320px' }} value={blog} onTextChange={(e) => setBlog(e.htmlValue)}/>
                    </Form.Group>
                        <br/><Button type="submit" className='p-mr-4' icon='pi pi-save' label='Create' />
                        <BackButton/>
                </div>
            </div>                           
        </Form>
        </React.Fragment>
    );    
}

export default ProductDetail_Create;