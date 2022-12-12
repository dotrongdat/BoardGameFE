import React,{useState,useEffect} from 'react';
import {Dropdown} from 'primereact/dropdown';
import {InputNumber} from 'primereact/inputnumber';
import {Button} from 'primereact/button';
import {ToggleButton } from 'primereact/togglebutton';
import './FilterBar.css';

const FilterBar = (props)=>{
    const [priceFrom,setPriceFrom]=useState();
    const [priceTo,setPriceTo]=useState();

    const onClickHandler=()=>{
        props.onSubmit({priceFrom,priceTo,page:1});
    }
    const orderByOptions =[
        {name: 'Name', value: 'name'},
        {name: 'Price', value: 'price'},
        {name: 'Published Year', value: 'publishedYear'}
    ]
    useEffect(()=>{
        const priceFromProps=props.params.priceFrom;
        const priceToProps=props.params.priceTo;
        setPriceFrom((priceFromProps!==0?priceFromProps:null));
        setPriceTo((priceToProps!==Number.MAX_SAFE_INTEGER?priceToProps:null));
    },[props.params.priceFrom,props.params.priceTo])
    return (
        <div className="p-grid p-justify-center">
            <div className="p-col-12 p-md-11 p-sm-11 p-lg-11 filterbar">
            <div className="p-grid p-justify-end">
                <div className="p-col-4">
                <div className="p-inputgroup filterbar_input-group">
                    <span className="p-inputgroup-addon">$</span>    
                        <InputNumber placeholder="from" value={priceFrom} onChange={(e)=>{setPriceFrom(e.value)}}/>
                    <span className="p-inputgroup-addon">-</span>
                        <InputNumber placeholder="to"  value={priceTo} onChange={(e)=>{setPriceTo(e.value)}}/>
                    <Button icon="pi pi-caret-right" className="p-inputgroup-addon" onClick={onClickHandler}></Button>
                </div>
                </div>
                <div className="p-col-2">
                    <div className="p-inputgroup filterbar_input-group" >
                        <span className="p-inputgroup-addon">Sort by</span> 
                        <Dropdown  optionLabel="name" options={orderByOptions} value={props.params.sortBy} onChange={(e)=>{props.onSubmit({sortBy:e.value})}}/>
                        <ToggleButton checked={props.params.inc} onChange={(e)=>{props.onSubmit({inc:e.value})}} onIcon='pi pi-chevron-up' offIcon='pi pi-chevron-down' onLabel='' offLabel=''/>
                    </div>
                    
                </div>
            </div>
            </div>
        </div>
    );
}

export default FilterBar;