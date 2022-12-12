import Validation from '../Cores/Validation';
import  {SpecicalCharacter} from '../Constant/Regex';
// import  {validFileExtension} from '../Constant/ProductConstant';
// import path from 'path';

const checkExistSpecialCharacters=(value)=>{
        return !SpecicalCharacter.test(value);
    }
// const checkInvalidImageFile=(value)=>{
//     return validFileExtension.includes(path.extname(value.name));
// } 

const create=data=>{
    const {name,quantity,description,price,album}=data;
    return [
        Validation({name})
        .notEmpty('Name is empty',{ignore_whitespace:true}),
        // .custom(checkExistSpecialCharacters,'Name contains special characters'),

        Validation({quantity})
        .notEmpty('Quantity is empty',{ignore_whitespace:true})
        .min(0,'Quantity is a negative number')
        .max(10000000,'Quantity is too big (max: 1 000 000)'),

        Validation({description})
        .maxLength(2000,'Description is too long (max: 2000 letters)'),

        Validation({price})
        .notEmpty('Price is empty',{ignore_whitespace:true})
        .gt(0,'Price is not a positive number')
        .max(100000000000,'Price is too big (max: 100 000 000 000)'),

        Validation({album})
        .notEmpty('Image file is empty')
        // .custom(checkInvalidImageFile,'File is invalid (accept: .png/.jpg)')
    ]
}
const search = data=>{
    const {name,priceFrom,priceTo}=data;
    return [
        Validation({name})
        .custom(checkExistSpecialCharacters,'Name contains specials characters'),

        Validation({priceFrom})
        .min(0,'Price is negative number'),

        Validation({priceTo})
        .min(0,'Price is negative number')
        .custom((value)=>value>=priceFrom,'Price from is greater than price to')

    ]
}
const update = data => {
    const {name,quantity,description,price,album}=data;

    return [
        Validation({name})
        .notEmpty('Name is empty',{ignore_whitespace:true})
        .bail(),
        // .custom(checkExistSpecialCharacters,'Name contains specials characters'),

        Validation({album})
        .notEmpty('Album is empty',{ignore_whitespace:true}),

        Validation({quantity})
        .notEmpty('Quantity is empty',{ignore_whitespace:true})
        .min(0,'Quantity is a negative number')
        .max(10000000,'Quantity is too big (max: 1 000 000)'),

        Validation({description})
        .maxLength(2000,'Description is too long (max: 2000 letters)'),

        Validation({price})
        .notEmpty('Price is empty',{ignore_whitespace:true})
        .gt(0,'Price is not a positive number')
        .max(100000000000,'Price is too big (max: 100 000 000 000)'),

    ]
}

const deleteValidation = data => {
    const {_id} = data;
    return [
        Validation({_id})
        .exist('Id is not exist')
        .notEmpty('Id is empty')
    ]
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    create,
    search,
    update,
    deleteValidation
}
































