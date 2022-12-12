import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import credentialService from '../../service/credential.service'
import './Form.css'
import Validation from '../Utils/Validation.utils'
import CredentialValidation from '../Validations/CredentialRequest.validation'
import statusCode from 'http-status-codes'
import { BUTTON_STYLE_2, PRIMARY_COLOR } from '../Constant'

let DEFAULT_ERRORS_STATE = {
	phoneNumber: [],
	password: [],
}

const SignIn = (props) => {
	const [phoneNumber, setPhoneNumber] = useState()
	const [password, setPassword] = useState()

	const _useHistory = useHistory()
	const [errors, setErrors] = useState(DEFAULT_ERRORS_STATE)

	const submitHandler = async (e) => {
		global.loading.show()
		e.preventDefault()

		const submitData = {
			phoneNumber,
			password,
		}
		const validateReq = Validation(CredentialValidation.signIn(submitData))
		if (validateReq.isValid) {
			const res = await credentialService.signin(submitData)
			switch (res.status) {
				case statusCode.OK:
					const _socketID = JSON.parse(localStorage.getItem('socketID')).filter(
						(sk) => sk !== global.socket.id
					)
					global.socket.emit('syncSignIn', {
						user: res.data.payload.user,
						socketID: _socketID,
					})
					_useHistory.replace('/')
					break
				case statusCode.UNAUTHORIZED:
					global.toast.show({
						severity: 'error',
						summary: 'Đăng nhập',
						detail: 'Số điện thoại không tồn tại hoặc sai mật khẩu mật khẩu',
						life: 1500,
					})
					break
				case statusCode.INTERNAL_SERVER_ERROR:
					global.toast.show({
						severity: 'error',
						summary: 'Lỗi hệ thống',
						detail: res.data.message,
						life: 1500,
					})
					break
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
			<div className="p-col-8" style={{ backgroundColor: 'white' }}>
				<div
					className="p-grid p-justify-center p-ai-center vertical-container"
					style={{ height: '95%' }}
				>
					<div className="p-col-12 p-grid p-justify-center">
						<h3 className="p-col-12 p-mb-6" style={{ textAlign: 'center' }}>
							Đăng nhập
						</h3>
						<Form className="p-col-8" onSubmit={submitHandler}>
							<Form.Group>
								<div className="p-inputgroup">
									<span className="p-inputgroup-addon">
										<i className="pi pi-phone"></i>
									</span>
									<InputText
										keyfilter={'num'}
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value)}
										placeholder="Số điện thoại"
									/>
								</div>
								{errors.phoneNumber.map((error, index) => (
									<p key={index}>{error}</p>
								))}
							</Form.Group>
							<br />
							<div className="p-inputgroup">
								<span className="p-inputgroup-addon">
									<i className="pi pi-shield"></i>
								</span>
								<Password
									feedback={false}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Mật khẩu"
									toggleMask
								/>
							</div>
							{errors.password.map((error, index) => (
								<p key={index}>{error}</p>
							))}
							<Divider />
							<div className="p-grid p-justify-center">
								<div className="p-col-12 p-mb-6" style={{ textAlign: 'end' }}>
									<Link
										to="/forgotpassword"
										style={{
											textDecoration: 'none',
											color: 'black',
											fontWeight: 'bolder',
										}}
									>
										Quên mật khẩu?
									</Link>
								</div>
								<Button
									className="p-col-12"
									style={BUTTON_STYLE_2}
									type="submit"
									label="Đăng nhập"
								/>
							</div>
						</Form>
					</div>
				</div>
				<div className="p-col-12" style={{ textAlign: 'center' }}>
					<Link to="/signup" style={{ textDecoration: 'none' }}>
						Bạn chưa có tài khoản? Đăng kí
					</Link>
				</div>
			</div>
		</div>
	)
}

export default SignIn
