import React, { useState, useEffect, Fragment, useRef } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import './Product.css';
import { useSelector } from 'react-redux';
import productService from '../../../service/product.service';
import { Tag } from 'primereact/tag';
import ProductCreate from './ProductCreate';
import statusCode from 'http-status-codes';
import {Dialog} from 'primereact/dialog';
import ProductDetail from './ProductDetail';
import CustomConfirmDialog from '../../Notifications/CustomConfirmDialog';

const Product = () => {
    const {categories,allProducts} = useSelector(state=>state);
    const [productList,setProductList] = useState([]);
    const [filters,setFilters] = useState(null);
    const [selectedProduct,setSelectedProduct] = useState();
    const [isDialogDetailProductVisible,setIsDialogDetailProductVisible] = useState(false);
    const [isDialogCreateProductVisible,setIsDialogCreateProductVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    
    const productDetailRef = useRef();
    const productCreateRef = useRef();

    useEffect(() => {
        initFilters();
    }, []);
    useEffect(()=>{
        setProductList(allProducts);
        if (selectedProduct){
            const index = allProducts.findIndex(product => product._id === selectedProduct._id);
            if(index>-1) setSelectedProduct(allProducts[index]);
        }
    },[allProducts]);

    const onClickProductDetailHandler = (data) =>{
        setSelectedProduct(data);
        setIsDialogDetailProductVisible(true);
    }
    const onClickDeleteProductHandler = (_id) => {
        const reject = () => {};
        const accept = async () => {
            const res = await productService._delete({_id});
            switch (res.status) {
                case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Xóa sản phẩm', detail: 'Thành công', life: 1500});
                    break;
                default:
                    break;
            }
        } 
        CustomConfirmDialog("Bạn muốn xóa sản phẩm này ?", "Xóa sản phẩm",accept,reject);
    }
    const onClickDeleteListProductHandler = () => {
        const reject = () => {};
        const accept = async () => {
            const res = await productService._delete({_id:selectedRow.map(v=>v._id)});
            switch (res.status) {
                case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Xóa sản phẩm', detail: 'Thành công', life: 1500});
                    break;
                default:
                    break;
            }
        } 
        CustomConfirmDialog("Bạn muốn xóa các sản phẩm này ?", "Xóa sản phẩm",accept,reject);
    }

    const clearFilters = () => {initFilters()}
    const onClickAddProductHandler = () => {
        setIsDialogCreateProductVisible(true);
    }

    const initFilters = () => {
        setFilters({
            'name': {operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
            'category': { value: null, matchMode: FilterMatchMode.IN },
            'price': { value: null, matchMode: FilterMatchMode.BETWEEN },
            'brand' : {operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
            'created_at': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]},
            'status': { value: null, matchMode: FilterMatchMode.EQUALS }
        });
    } 

    const renderHeader = () => {
        return (
            <div className="p-d-flex p-jc-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilters} />
                <div>
                    <Button className='p-mr-1' type="button" icon="pi pi-plus-circle" label="Thêm sản phẩm" onClick={onClickAddProductHandler}/> 
                    <Button className='p-button-danger' type="button" icon="pi pi-trash" label="Xóa" onClick={onClickDeleteListProductHandler} disabled={!selectedRow || !selectedRow.length}/> 
                </div>                              
            </div>
        );
    }

    const productNameBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <img alt="flag" src={rowData.album[0]} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${rowData._id}`} width={30} style={{marginRight: '7px'}}/>
                <span className="image-text">{rowData.name}</span>
            </React.Fragment>
        );
    }

    const categoryBodyTemplate = (rowData) => {
        const index = categories.findIndex(v=>v._id === rowData.category);
        const severity = ['primary','success','info','warning','danger'].at(index%5);
        return (
            <Tag severity={severity} value={categories[index].name}/>
        );
    }
    const categoryFilterTemplate = (options) => {
        return <MultiSelect value={options.value} options={categories} itemTemplate={categoryItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" optionValue="_id" placeholder="Any" className="p-column-filter" />;
    }

    const categoryItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <span className="image-text">{option.name}</span>
            </div>
        );
    }

    const productPriceBodyTemplate = (rowData) =>{
        return <div style={{textAlign: 'end'}}><h6>{rowData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND</h6></div>
    }

    const priceFilterTemplate = (options) => {
        return (
            <React.Fragment>
                <Slider min={0} max={10000000} step={500} value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 10000000}</span>
                </div>
            </React.Fragment>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='p-d-flex p-jc-content'>
                <Button className='p-button-rounded p-mr-1' tooltip='Chi tiết' type='button' icon="pi pi-pencil" onClick={()=>onClickProductDetailHandler(rowData)}/>
                <Button className='p-button-rounded p-button-warning' tooltip='Xóa' type='button' icon="pi pi-trash" onClick={()=>onClickDeleteProductHandler(rowData._id)}/>
            </div>
        );
    }

    const header = renderHeader();
    const renderDialogDetailProductFooter = () => {
        return (
            <div>
                <Button label="Đóng" icon="pi pi-times" onClick={onClickCloseDetailProductHandler} className="p-button-text" />
                <Button label="Hoàn tác" icon="pi pi-refresh" onClick={onClickResetDetailProductHandler} className="p-button-text" />
                <Button label="Cập nhật" type='button' icon="pi pi-check" onClick={onClickSaveHandler} autoFocus />
            </div>
        );
    }
    const renderDialogCreateProductFooter = () => {
        return (
            <div>
                <Button label="Đóng" icon="pi pi-times" onClick={onClickCloseCreateProductHandler} className="p-button-text" />
                <Button label="Hoàn tác" icon="pi pi-refresh" onClick={onClickResetCreateProductHandler} className="p-button-text" />
                <Button label="Tạo mới" icon="pi pi-check" onClick={onClickCreateHandler} autoFocus />
            </div>
        );
    }
    const onClickResetDetailProductHandler = () => {
        productDetailRef.current.reset();
    }
    const onClickResetCreateProductHandler = () => {
        productCreateRef.current.reset();
    }
    const onClickCloseDetailProductHandler = () => {
        setIsDialogDetailProductVisible(false);
    }
    const onClickCloseCreateProductHandler = () => {
        setIsDialogCreateProductVisible(false);
    }
    const onClickSaveHandler = () => {
        productDetailRef.current.update();
    }
    const onClickCreateHandler = () => {
        productCreateRef.current.create();
    }
    return (
        <Fragment>
            <Dialog maximizable modal header="Chi tiết sản phẩm" visible={isDialogDetailProductVisible} style={{ width: '50vw' }} h footer={renderDialogDetailProductFooter} onHide={onClickCloseDetailProductHandler}>
                <ProductDetail data={selectedProduct} ref={productDetailRef}/>
            </Dialog>
            <Dialog maximizable modal header="Tạo mới sản phẩm" visible={isDialogCreateProductVisible} style={{ width: '50vw' }} footer={renderDialogCreateProductFooter} onHide={onClickCloseCreateProductHandler}>
                <ProductCreate ref={productCreateRef}/>
            </Dialog>
            <Tag value="Tất cả sản phẩm" style={{backgroundColor:'#7a7a7a'}}/>
            <div className='p-grid p-justify-center p-pt-6 p-pb-6' style={{backgroundColor:"white",boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}>
                <div className='p-col-12 p-jc-center' style={{boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)'}}>
                    <div className="datatable-filter-demo">
                        <div className="card">
                            <DataTable value={productList} paginator className="p-datatable-customers" showGridlines rows={10}
                                dataKey="_id" filters={filters} filterDisplay="menu" responsiveLayout="scroll"
                                header={header} emptyMessage="Không có sản phẩm." selection={selectedRow} onSelectionChange={(e) =>setSelectedRow(e.value)}>
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                                <Column field="name" header="Tên" filter body={productNameBodyTemplate} filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                                <Column header="Danh mục" filterField="category" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem'}} style={{ minWidth: '14rem' }} body={categoryBodyTemplate} 
                                    filter filterElement={categoryFilterTemplate} />
                                <Column header="Số lượng" field='quantity'/>
                                <Column header="Giá" field="price" showFilterMatchModes={false} style={{ minWidth: '12rem' }} filter filterElement={priceFilterTemplate} body={productPriceBodyTemplate}/>
                                <Column header="Thương hiệu" field="brand" filter filterPlaceholder="Search by brand" style={{ minWidth: '12rem' }} />
                                <Column header="" body={actionBodyTemplate} />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Product;