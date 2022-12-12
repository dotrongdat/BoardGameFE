import React, { Fragment, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import VerifyCodeInput from 'react-verification-code-input'
import credentialService from '../../service/credential.service'
import './Form.css'
import Validation from '../Utils/Validation.utils'
import CredentialValidation from '../Validations/CredentialRequest.validation'
import statusCode from 'http-status-codes'
import { logoURL } from '../Constant/ResourceConstant'
import { BUTTON_STYLE_2 } from '../Constant'

let DEFAULT_ERRORS_STATE = {
	fullName: [],
	phoneNumber: [],
	password: [],
	confirmPassword: [],
	verifyCode: [],
}

const ErrorText = (props) => {
	return <p style={{ color: 'red', fontSize: '70%' }}>{props.text}</p>
}

let tInterval = null
let tTimeOut = null

const SignUp = (props) => {
	const _useHistory = useHistory()
	const [errors, setErrors] = useState(DEFAULT_ERRORS_STATE)
	const [inputState, setInputState] = useState(0) // 0 input phonenumber, 1 input verify code, 2 input name and password
	const [verifyCodeInputValue, setVerifyCodeInputValue] = useState([])
	const [signUpToken, setSignUpToken] = useState()
	const [timer, setTimer] = useState(0)
	const [timerState, setTimerState] = useState(0) //0 not start, 1 start

	const [phoneNumber, setPhoneNumber] = useState()
	const [fullName, setFullName] = useState()
	const [password, setPassword] = useState()
	const [confirmPassword, setConfirmPassword] = useState()

	const startTimer = (second) => {
		if (tInterval != null) clearInterval(tInterval)
		if (tTimeOut != null) clearTimeout(tTimeOut)
		tInterval = setInterval(() => {
			setTimer((prevData) => prevData - 1)
		}, 1000)
		tTimeOut = setTimeout(() => clearInterval(tInterval), second * 1000)
	}

	const stopTimer = () => {
		clearInterval(tInterval)
		clearTimeout(tTimeOut)
	}

	const resendVerifyCode = async () => {
		const res = await credentialService.refreshVerifyCode({ phoneNumber })
		switch (res.status) {
			case statusCode.OK:
				console.log(res.data.payload.verifyCode)
				global.toast.show({
					severity: 'success',
					summary: 'Gửi lại OTP',
					detail: 'Mã OTP đã được gửi đến số điện thoại đăng kí',
					life: 1500,
				})
				setTimer(res.data.payload.timer)
				startTimer(res.data.payload.timer)
				break
			case statusCode.METHOD_FAILURE:
				global.toast.show({
					severity: 'error',
					summary: 'Đã có lỗi',
					detail: res.data.message,
					life: 1500,
				})
				break
			// case statusCode.INTERNAL_SERVER_ERROR:
			//     global.toast.show({severity:'error', summary: 'Lỗi hệ thống', detail: res.data.message, life: 1500});
			//     break;
			default:
		}
	}
	const submitPhoneNumberHandler = async () => {
		const validateReq = Validation(
			CredentialValidation.sendPhoneNumber({ phoneNumber })
		)
		if (validateReq.isValid) {
			const res = await credentialService.signup({ phoneNumber })
			switch (res.status) {
				case statusCode.OK:
					setInputState(1)
					console.log(res.data.payload.verifyCode)
					setTimer(res.data.payload.timer)
					startTimer(res.data.payload.timer)
					break
				case statusCode.METHOD_FAILURE:
					global.toast.show({
						severity: 'error',
						summary: 'Đã có lỗi',
						detail: res.data.message,
						life: 1500,
					})
					break
				// case statusCode.INTERNAL_SERVER_ERROR:
				//     global.toast.show({severity:'error', summary: 'Lỗi hệ thống', detail: res.data.message, life: 1500});
				//     break;
				default:
			}
		} else
			setErrors((prevData) => {
				let updateDataState = { ...prevData }
				for (let property in validateReq.errors) {
					updateDataState = {
						...updateDataState,
						[property]: validateReq.errors[property],
					}
				}
				return updateDataState
			})
	}
	const submitVerifyCodeHandler = async () => {
		const validateReq = Validation(
			CredentialValidation.sendVerifyCode({ verifyCode: verifyCodeInputValue })
		)
		if (validateReq.isValid) {
			stopTimer()
			const res = await credentialService.verifyCode({
				phoneNumber,
				verifyCode: verifyCodeInputValue,
			})
			switch (res.status) {
				case statusCode.OK:
					setInputState(2)
					setSignUpToken(res.data.payload.signUpToken)
					break
				case statusCode.METHOD_FAILURE:
					global.toast.show({
						severity: 'error',
						summary: 'Đã có lỗi',
						detail: res.data.message,
						life: 1500,
					})
					if (res.data.message.includes('expired')) {
						console.log(res.data.payload.verifyCode)
						setTimer(res.data.payload.timer)
						startTimer(res.data.payload.timer)
					}
					setErrors(DEFAULT_ERRORS_STATE)
					setVerifyCodeInputValue([])
					break
				// case statusCode.INTERNAL_SERVER_ERROR:
				//     global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
				//     break;
				default:
			}
		} else
			setErrors((prevData) => {
				let updateDataState = { ...prevData }
				for (let property in validateReq.errors) {
					updateDataState = {
						...updateDataState,
						[property]: validateReq.errors[property],
					}
				}
				return updateDataState
			})
	}

	const submitPasswordFullNameHandler = async () => {
		const validateReq = Validation(
			CredentialValidation.signUp({
				fullName,
				password,
				confirmPassword,
			})
		)
		if (validateReq.isValid) {
			const res = await credentialService.signup({
				phoneNumber,
				password,
				name: fullName,
				signUpToken,
			})
			switch (res.status) {
				case statusCode.OK:
					global.toast.show({
						severity: 'success',
						summary: 'Đăng kí tài khoản',
						detail: 'Thành công',
						life: 1500,
					})
					_useHistory.replace('/signin')
					break
				case statusCode.METHOD_FAILURE:
					global.toast.show({
						severity: 'error',
						summary: 'Đã có lỗi',
						detail: res.data.message,
						life: 1500,
					})
					break
				// case statusCode.INTERNAL_SERVER_ERROR:
				//     global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
				//     break;
				default:
			}
		} else
			setErrors((prevData) => {
				let updateDataState = { ...prevData }
				for (let property in validateReq.errors) {
					updateDataState = {
						...updateDataState,
						[property]: validateReq.errors[property],
					}
				}
				return updateDataState
			})
	}

	const submitHandler = async (e) => {
		global.loading.show()
		e.preventDefault()
		switch (inputState) {
			case 0:
				await submitPhoneNumberHandler()
				break
			case 1:
				await submitVerifyCodeHandler()
				break
			default:
				await submitPasswordFullNameHandler()
		}
		global.loading.hide()
	}

	return (
		<div
			className="p-grid p-justify-center p-mt-6"
			style={{
				height: '80%',
				boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
			}}
		>
			{/* <div className='p-col-8 p-grid'
                style={{
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
                }}
            > */}
			{/* <div className='p-col-4' style={{backgroundColor: WHITE_COLOR}}>
                    <div className='p-grid p-justify-center p-ai-center vertical-container' style={{height: '100%'}}>
                        <Image src={logoURL} height="350"/>
                    </div>                   
                </div> */}
			<div className="p-col-8" style={{ backgroundColor: 'white' }}>
				<div
					className="p-grid p-justify-center p-ai-center vertical-container"
					style={{ height: '95%' }}
				>
					<div className="p-col-12 p-grid p-justify-center">
						<h3 className="p-col-12 p-mb-6" style={{ textAlign: 'center' }}>
							Đăng kí tài khoản
						</h3>
						<Form className="p-col-8" onSubmit={submitHandler}>
							{inputState === 0 && (
								<Fragment>
									<Form.Group>
										<div className="p-inputgroup">
											<span className="p-inputgroup-addon">
												<i className="pi pi-phone"></i>
											</span>
											<InputText
												keyfilter={'num'}
												value={phoneNumber}
												onChange={(e) => setPhoneNumber(e.target.value)}
												placeholder="Phone number"
											/>
										</div>
										{errors.phoneNumber.map((error, index) => (
											<ErrorText key={index} text={error} />
										))}
									</Form.Group>
								</Fragment>
							)}
							{inputState === 1 && (
								<Fragment>
									<VerifyCodeInput
										type="number"
										onChange={(val) => setVerifyCodeInputValue(val)}
										values={verifyCodeInputValue}
										fields={6}
									/>
									{errors.verifyCode.map((error, index) => (
										<ErrorText key={index} text={error} />
									))}
								</Fragment>
							)}
							{inputState === 2 && (
								<Fragment>
									<Form.Group>
										<div className="p-inputgroup">
											<span className="p-inputgroup-addon">
												<i className="pi pi-user"></i>
											</span>
											<InputText
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												placeholder="Tên"
											/>
										</div>
										{errors.fullName.map((error, index) => (
											<ErrorText key={index} text={error} />
										))}
									</Form.Group>

									<Form.Group>
										<div className="p-inputgroup">
											<span className="p-inputgroup-addon">
												<i className="pi pi-shield"></i>
											</span>
											<Password
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												placeholder="Mật khẩu"
											/>
										</div>
										{errors.password.map((error, index) => (
											<ErrorText key={index} text={error} />
										))}
									</Form.Group>

									<Form.Group>
										<div className="p-inputgroup">
											<span className="p-inputgroup-addon">
												<i className="pi pi-undo"></i>
											</span>
											<Password
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												placeholder="Nhập lại mật khẩu"
											/>
										</div>
										{errors.confirmPassword.map((error, index) => (
											<ErrorText key={index} text={error} />
										))}
									</Form.Group>
								</Fragment>
							)}
							<Divider />
							<div className="p-grid p-justify-center">
								{inputState === 0 && (
									<Button
										style={BUTTON_STYLE_2}
										className="p-col-12"
										type="submit"
										label="Gửi mã xác thực"
									/>
								)}
								{inputState === 1 && (
									<Fragment>
										<div
											className="p-col-12 p-mb-1"
											style={{ textAlign: 'end' }}
										>
											<p
												onClick={resendVerifyCode}
												style={{
													textDecoration: 'none',
													color: 'black',
													fontWeight: 'bolder',
													cursor: 'pointer',
												}}
											>
												Gửi lại mã OTP
											</p>
										</div>
										<div
											className="p-col-12 p-mb-1"
											style={{ textAlign: 'center' }}
										>
											Mã còn hiệu lực trong {timer} giây
										</div>
										<Button
											className="p-col-12"
											style={BUTTON_STYLE_2}
											type="submit"
											label="Xác thực"
										/>
									</Fragment>
								)}
								{inputState === 2 && (
									<Button
										className="p-col-12"
										style={BUTTON_STYLE_2}
										type="submit"
										label="Đăng kí"
									/>
								)}
							</div>
						</Form>
					</div>
				</div>
				<div className="p-col-12" style={{ textAlign: 'center' }}>
					<Link to="/signin" style={{ textDecoration: 'none' }}>
						Bạn đã có tài khoản? Đăng nhập
					</Link>
				</div>
				{/* </div> */}
			</div>
		</div>
	)
}

export default SignUp
