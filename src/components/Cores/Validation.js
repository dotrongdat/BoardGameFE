import validator from 'validator';
import {toString} from 'lodash';
class Validation {
    constructor(data) {
        this.param = Object.keys(data)[0];
        this.isValid = true;
        this.allowContinueValidation = true;
        this.str = toString(data[this.param]);
        this.errors = [];
    }
}

function assignValues(obj, values) {
    for (let property in values) {
        const value=values[property];
        if (value !== undefined) {
            if (Array.isArray(obj[property]) && !validator.isEmpty(value,{ignore_whitespace:true}))
                obj[property] = [...obj[property], value];
            else obj[property] = value;
        }
    }
}

function assignError(obj, errors) {
    const values = {
        isValid: false,
        errors
    };
    assignValues(obj, values)
}
Validation.prototype.notEmpty = function (error,optional={ignore_whitespace:false}) {
    if (this.allowContinueValidation && validator.isEmpty(this.str,optional)) {
        assignError(this, error);
    }
    return this;
}
Validation.prototype.exist=function (error){
    if (this.allowContinueValidation && this.str === undefined) {
        assignError(this, error);
        this.bail();
    }
    return this;
}
Validation.prototype.min = function (value,error){
    if(this.allowContinueValidation){
        if(validator.isNumeric(this.str) && this.str < value) assignError(this,error);
    }
    return this;
}
Validation.prototype.max = function (value,error){
    if(this.allowContinueValidation){
        if(validator.isNumeric(this.str) && this.str > value) assignError(this,error);
    }
    return this;
}
Validation.prototype.maxLength= function(value,error){
    if(this.allowContinueValidation && this.str.length > value) assignError(this,error);
    return this;
}
Validation.prototype.minLength= function(value,error){
    if(this.allowContinueValidation && this.str.length < value) assignError(this,error);
    return this;
}

Validation.prototype.gt = function (value,error){
    if(this.allowContinueValidation){
        if(validator.isNumeric(this.str) && this.str <= value) assignError(this,error);
    }
    return this;
}
Validation.prototype.lt = function (value,error){
    if(this.allowContinueValidation){
        if(validator.isNumeric(this.str) && this.str >= value) assignError(this,error);
    }
    return this;
}
// Validation.prototype.withMessage=function (message){

// }
Validation.prototype.bail = function () {
    this.allowContinueValidation = this.isValid;
    return this;
}

Validation.prototype.custom = function (fn,error) {
    if (this.allowContinueValidation && fn(this.str) === false) {
        assignError(this, error);
    }
    return this;
}

Validation.prototype.customAsync = async function (fn,error) {
    const rs = await fn(this.str);
    if(this.allowContinueValidation && rs===false) {
        assignError(this,error);
    }
    return this;
}
Validation.prototype.validate= function (obj){
        const objIsValidValue= (obj.isValid !== undefined) ? obj.isValid : true;

        obj.isValid = objIsValidValue && this.isValid;
        obj.errors= {...obj.errors,[this.param]:this.errors}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (str) {
    return new Validation(str);
};