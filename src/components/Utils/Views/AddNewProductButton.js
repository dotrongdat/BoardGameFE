import React from 'react';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './AddNewProductButton.css';

const AddNewProductButton=()=>{
    return (
        <Link to='/product'><Button className="new-button">Create</Button></Link>
    );
}
export default AddNewProductButton;