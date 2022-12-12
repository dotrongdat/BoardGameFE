import React,{Fragment, useEffect, useRef,useState} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {Form} from 'react-bootstrap';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {Divider} from 'primereact/divider';
import {Image} from 'primereact/image';
import VerifyCodeInput from 'react-verification-code-input';
import credentialService from '../../service/credential.service';
import './Form.css';
import Validation from '../Utils/Validation.utils';
import CredentialValidation from '../Validations/CredentialRequest.validation';
import statusCode from 'http-status-codes';
import { logoURL } from '../Constant/ResourceConstant';

let DEFAULT_ERRORS_STATE = {
    fullName:[],
    phoneNumber:[],
    password:[],
    confirmPassword:[],
    verifyCode: []
}

const ErrorText = (props) => {
    return (
        <p style={{color: 'red', fontSize:'70%'}}>{props.text}</p>
    )
}

let tInterval = null;
let tTimeOut = null;

const ForgotPassword = (props)=>{
    const _useHistory = useHistory();
    const [errors,setErrors] = useState(DEFAULT_ERRORS_STATE);
    const [inputState,setInputState] = useState(0);
    const [verifyCodeInputValue, setVerifyCodeInputValue] = useState([]);
    const [resetPasswordToken,setResetPasswordToken] = useState();
    const [timer,setTimer] = useState(0);


    const phoneNumberRef=useRef();
    const passwordRef=useRef();
    const confirmPasswordRef=useRef();    

    
    const startTimer = (second) => {
        if(tInterval != null) clearInterval(tInterval);
        if(tTimeOut != null) clearTimeout(tTimeOut);
        tInterval = setInterval(()=>{
            setTimer(prevData =>  prevData-1)
        },1000);
        tTimeOut = setTimeout(()=> clearInterval(tInterval),second*1000);
    }

    const stopTimer = () => {
        clearInterval(tInterval);
        clearTimeout(tTimeOut);
    }

    const resendVerifyCode = async () =>{
        const res = await credentialService.refreshVerifyForgotPasswordCode({phoneNumber: phoneNumberRef.current.value});
        switch (res.status){
            case statusCode.OK:
                console.log(res.data.payload.verifyCode);
                global.toast.show({severity:'success', summary: 'Success', detail: "Your verify code has been resent to your phone", life: 1500});
                setTimer(res.data.payload.timer);
                startTimer(res.data.payload.timer);
                break;
            case statusCode.METHOD_FAILURE:
                global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                break;
            default:
        }
    }

    const submitPhoneNumberHandler = async () => {
        const validateReq = Validation(CredentialValidation.sendPhoneNumber({phoneNumber: phoneNumberRef.current.value}));
        if(validateReq.isValid){
            const res = await credentialService.forgotPassword({phoneNumber: phoneNumberRef.current.value});
            switch (res.status){
                case statusCode.OK:
                    setInputState(1);
                    console.log(res.data.payload.verifyCode);
                    setTimer(res.data.payload.timer);
                    startTimer(res.data.payload.timer);
                    break;
                case statusCode.METHOD_FAILURE:
                    global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                    break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                    break;
                default:
            }
        }else setErrors((prevData)=>{ 
            let updateDataState={...prevData};
            for(let property in validateReq.errors){
                updateDataState={...updateDataState,[property]:validateReq.errors[property]}
            }
            return updateDataState; 
        });
    }
    const submitVerifyCodeHandler = async () => {
        const validateReq = Validation(CredentialValidation.sendVerifyCode({verifyCode: verifyCodeInputValue}));
        if(validateReq.isValid){
            stopTimer();
            const res = await credentialService.verifyForgotPasswordCode({phoneNumber: phoneNumberRef.current.value,verifyCode: verifyCodeInputValue});
            switch (res.status){
                case statusCode.OK:
                    setInputState(2);
                    setResetPasswordToken(res.data.payload.resetPasswordToken);
                    break;
                case statusCode.METHOD_FAILURE:
                    global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                    if(res.data.message.includes("expired")){
                        console.log(res.data.payload.verifyCode);
                        setTimer(res.data.payload.timer);
                        startTimer(res.data.payload.timer);
                    }
                    setVerifyCodeInputValue([]);
                    setErrors(DEFAULT_ERRORS_STATE);
                    break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                    break;
                default:
            }
        }else setErrors((prevData)=>{ 
            let updateDataState={...prevData};
            for(let property in validateReq.errors){
                updateDataState={...updateDataState,[property]:validateReq.errors[property]}
            }
            return updateDataState; 
        });
    }

    const submitNewPasswordHandler = async () => {
        const validateReq = Validation(CredentialValidation.forgotPassword({
            password: passwordRef.current.inputRef.current.value,
            confirmPassword: passwordRef.current.inputRef.current.value,
        }));
        if(validateReq.isValid){
            const res = await credentialService.forgotPassword({
                phoneNumber: phoneNumberRef.current.value,
                newPassword: passwordRef.current.inputRef.current.value,
                resetPasswordToken
            });
            switch (res.status){
                case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Success', detail: "Reset password successfully", life: 1500});
                    _useHistory.replace('/signin');
                    break;
                case statusCode.METHOD_FAILURE:
                    global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                     break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                    break;
                default:
            }
        }else setErrors((prevData)=>{ 
            let updateDataState={...prevData};
            for(let property in validateReq.errors){
                updateDataState={...updateDataState,[property]:validateReq.errors[property]}
            }
            return updateDataState; 
        });
    }

    const submitHandler = async (e)=>{
        global.loading.show();
        e.preventDefault();
        switch (inputState){
            case 0: await submitPhoneNumberHandler();
                break;
            case 1: await submitVerifyCodeHandler();
                break;
            default: await submitNewPasswordHandler();
        }
        global.loading.hide();
    }
    
    return (
        <div className='p-grid p-justify-center p-mt-6' style={{height: '80%',boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}>
            {/* <div className='p-col-8 p-grid'
                style={{
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
                }}
            > */}
                <div className='p-col-4' style={{backgroundColor: '#ceffc4'}}>
                    <div className='p-grid p-justify-center p-ai-center vertical-container' style={{height: '100%'}}>
                        <Image src={logoURL} height="350"/>
                    </div>                   
                </div>
                <div className='p-col-8' style={{backgroundColor:'white'}}>
                    <div className='p-grid p-justify-center p-ai-center vertical-container'  style={{height:'95%'}}>
                        <div className='p-col-12 p-grid p-justify-center'>
                            <h3 className='p-col-12 p-mb-6' style={{textAlign:'center'}}>Forgot Password</h3>
                            <Form className='p-col-8' onSubmit={submitHandler}>
                                {inputState === 0 && 
                                    <Fragment>
                                        <Form.Group>
                                            <div className='p-inputgroup'>
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-phone"></i>
                                                </span>
                                                <InputText keyfilter={'num'} ref={phoneNumberRef} placeholder="Phone number" />                                        
                                            </div>
                                            {errors.phoneNumber.map((error,index)=> <ErrorText key={index} text={error}/>)}
                                        </Form.Group>                                                                             
                                    </Fragment>
                                }                            
                                {inputState === 1 && 
                                    <Fragment>
                                        <VerifyCodeInput type='number' onChange={(val)=>setVerifyCodeInputValue(val)} values={verifyCodeInputValue} fields={6}/>                                        
                                            {errors.verifyCode.map((error,index)=> <ErrorText key={index} text={error}/>)}                                    
                                    </Fragment>
                                }
                                {inputState === 2 && 
                                    <Fragment>                                        
                                        <Form.Group>
                                            <div className='p-inputgroup'>
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-shield"></i>
                                                </span>
                                                <Password ref={passwordRef} placeholder="New password" />
                                            </div>
                                            {errors.password.map((error,index)=> <ErrorText key={index} text={error}/>)}
                                        </Form.Group>

                                        <Form.Group>
                                            <div className='p-inputgroup'>
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-undo"></i>
                                                </span>
                                                <Password ref={confirmPasswordRef} placeholder="Confirm Password" />
                                            </div>
                                            {errors.confirmPassword.map((error,index)=> <ErrorText key={index} text={error}/>)}
                                        </Form.Group>
                                    </Fragment>
                                }
                                <Divider/>
                                <div className='p-grid p-justify-center'>                                                                     
                                    {inputState === 0 && <Button className='p-col-12' type='submit' label='Send Verify Code'/>}                                    
                                    {inputState === 1 && 
                                        <Fragment>
                                            <div className='p-col-12 p-mb-1' style={{textAlign:'end'}}>
                                            <p onClick={resendVerifyCode} style={{textDecoration:'none',color:'black',fontWeight:'bolder', cursor: 'pointer'}}>Resend Verify Code</p>
                                            </div>
                                            <div className='p-col-12 p-mb-1' style={{textAlign:'center'}}>
                                                Code expired in {timer} seconds 
                                            </div>
                                            <Button className='p-col-12' type='submit' label='Verify'/>
                                        </Fragment>
                                    }
                                    {inputState === 2 && <Button className='p-col-12' type='submit' label='Reset Password'/>}
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div className='p-col-12' style={{textAlign:'center'}}>
                        <Link to='/signin' style={{textDecoration:'none'}}>You have an account? Sign In</Link>
                    </div>   
                {/* </div> */}
            </div>           
        </div>
    );
}

export default ForgotPassword;