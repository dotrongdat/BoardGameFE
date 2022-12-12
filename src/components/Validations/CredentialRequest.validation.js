import userService from '../../service/user.service';
import Validation from '../Cores/Validation';

const checkExistUsername = async (username)=>{
    const res = await userService.findByUsername({username});
    return res.data.payload.user == null;
}
const signIn=data=>{
    const {phoneNumber,password} = data;
    return [
        Validation({phoneNumber})
        .notEmpty('Phone number is empty',{ignore_whitespace:true})
        .maxLength(10,'Phone number must have 10 numbers')
        .minLength(10, 'Phone number must have 10 numbers'),
        Validation({password})
        .notEmpty('Password is empty',{ignore_whitespace:true})
    ]
}

const sendPhoneNumber = data =>{
    const {phoneNumber} = data;
    return [
        Validation({phoneNumber})
        .notEmpty('Phone number is empty',{ignore_whitespace:true})
        .maxLength(10,'Phone number must have 10 numbers')
        .minLength(10, 'Phone number must have 10 numbers')
    ]
}
const sendVerifyCode = data => {
    const {verifyCode} = data;
    return [
        Validation({verifyCode})
        .notEmpty('Verify code is empty',{ignore_whitespace:true})
        .maxLength(6,'Verify code must have 6 numbers')
        .minLength(6, 'Verify code must have 6 numbers')
    ]
}

const signUp= data=>{
    const {fullName,password,confirmPassword} = data;
    return [
        Validation({fullName})
        .notEmpty('Name is empty',{ignore_whitespace:true}),
        // Validation({username})
        // .notEmpty('Username is empty',{ignore_whitespace:true})
        // .bail()
        // .customAsync((checkExistUsername),'Username is exist')
        Validation({password})
        .notEmpty('Password is empty',{ignore_whitespace:true}),
        Validation({confirmPassword})
        .notEmpty('Confirm is empty',{ignore_whitespace:true})
        .bail()
        .custom((confirm)=>confirm === password,'Confirm is not equal')
    ]
}

const forgotPassword = data => {
    const {password,confirmPassword} = data;
    return [
        Validation({password})
        .notEmpty('Password is empty',{ignore_whitespace:true}),
        Validation({confirmPassword})
        .notEmpty('Confirm is empty',{ignore_whitespace:true})
        .bail()
        .custom((confirm)=>confirm === password,'Confirm is not equal')
    ]
}

export default {
    signIn,
    signUp,
    sendPhoneNumber,
    sendVerifyCode,
    forgotPassword
}