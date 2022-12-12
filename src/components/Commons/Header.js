import React, { Fragment, useEffect, useState } from 'react'
import './Header.css'
import { useHistory } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { useSelector } from 'react-redux'
import credentialService from '../../service/credential.service'
import { roles } from '../Constant/CredentialConstant'
import Notification from '../Utils/Views/Notification'
import MessageNotification from '../Utils/Views/MessageNotification'
import {
	BUTTON_STYLE,
	BUTTON_STYLE_2,
	SECONDARY_COLOR,
	WHITE_COLOR,
} from '../Constant'
import { Chip } from 'primereact/chip'

const Header = () => {
	const _useHistory = useHistory()
	const { isSignIn, user } = useSelector((state) => state)
	const [items, setItems] = useState([])

	// const onClickSignOutHandler = ()=>{
	//     global.loading.show();
	//     setTimeout(()=>{
	//         credentialService.signout();
	//         const _socketID = JSON.parse(localStorage.getItem('socketID')).filter(sk=>sk!==global.socket.id);
	//         global.socket.emit('syncSignOut',_socketID);
	//         _useHistory.replace('/');
	//         global.loading.hide();
	//     },500);
	// }

	useEffect(() => {
		setItems((prevData) => {
			switch (user.role) {
				case roles.ADMIN:
					return adminItems
				case roles.CUSTOMER:
					return customerItems
				default:
					return noAuthItems
			}
		})
	}, [user.role])

	const customerItems = [
		{
			label: 'Blog',
			icon: 'pi pi-pw pi-heart',
			command: () => _useHistory.push('/blog'),
		},
		{
			label: 'Trợ giúp',
			icon: 'pi pi-pw pi-question-circle',
			command: () => {},
		},
		{
			label: 'Ngôn ngữ',
			icon: 'pi pi-pw pi-globe',
			items: [
				{
					label: 'English',
					command: () => {},
				},
				{
					label: 'Vietnamese',
					command: () => {},
				},
			],
		},
		{
			label: user.name,
			icon: 'pi pi-pw pi-user',
			items: [
				{
					label: 'Thông tin cá nhân',
					command: () => {},
				},
				{
					label: 'Quản lý đơn hàng',
					command: () => {},
				},
				{
					label: 'Đăng xuất',
					command: () => {
						credentialService.signout()
					},
				},
			],
		},
	]
	const adminItems = [
		{
			label: 'Trợ giúp',
			icon: 'pi pi-pw pi-question-circle',
			command: () => {},
		},
		{
			label: 'Ngôn ngữ',
			icon: 'pi pi-pw pi-globe',
			items: [
				{
					label: 'English',
					command: () => {},
				},
				{
					label: 'Vietnamese',
					command: () => {},
				},
			],
		},
		{
			label: user.name,
			icon: 'pi pi-pw pi-user',
			items: [
				{
					label: 'Đăng xuất',
					command: () => {
						credentialService.signout()
					},
				},
			],
		},
	]
	const noAuthItems = [
		{
			label: 'Blog',
			icon: 'pi pi-pw pi-heart',
			command: () => _useHistory.push('/blog'),
		},
		{
			label: 'Trợ giúp',
			icon: 'pi pi-pw pi-question-circle',
			command: () => {
				console.log('help')
			},
		},
		{
			label: 'Ngôn ngữ',
			icon: 'pi pi-pw pi-globe',
			items: [
				{
					label: 'Tiếng Anh',
					command: () => {
						console.log('English')
					},
				},
				{
					label: 'Tiếng Việt',
					command: () => {
						console.log('Vietnamese')
					},
				},
			],
		},
		{
			label: 'Đăng kí',
			command: () => {
				_useHistory.push('/signup')
			},
		},
		{
			label: 'Đăng nhập',
			command: () => {
				_useHistory.push('/signin')
			},
		},
	]

	return (
		//<Toolbar className="header" right={content} style={{position:'relative',zIndex:'1'}}/>
		<div
			className="p-grid p-justify-center"
			style={{
				backgroundImage:
					'linear-gradient( 94.3deg,  rgba(26,33,64,1) 10.9%, rgba(81,84,115,1) 87.1% )',
				marginRight: '0.5px',
			}}
		>
			<div className="p-col-8 p-grid p-justify-center">
				<div className="p-col-4 p-grid nest-grid">
					<div className="p-col-4 p-grid p-align-center vertical-container p-mt-1">
						<img
							src="/logo.png"
							onClick={() => _useHistory.push('/')}
							style={{
								height: '9vh',
								marginLeft: '10px',
								marginTop: '10px',
								cursor: 'pointer',
							}}
							alt="logo"
						/>
					</div>
					{user.role !== roles.ADMIN && (
						<div className="p-col-6 p-ml-3">
							<h6
								className="p-col-12"
								style={{
									color: 'white',
								}}
							>
								Liên hệ
							</h6>
							<Chip
								className="p-col"
								label="+84 888355655"
								style={{
									color: 'white',
									marginTop: '-10px',
									...BUTTON_STYLE_2,
								}}
								icon="pi pi-phone"
							/>
						</div>
					)}
				</div>
				<div className="p-col-2">
					<div className="p-grid p-justify-center p-ai-center vertical-container">
						<div
							className="p-col-12 p-mt-3 p-mb-1"
							style={{ textAlign: 'center' }}
						>
							{/* <h1 style={{color: "white", cursor: 'pointer'}} onClick={()=>_useHistory.push('/')}></h1> */}
						</div>
						{/* <div className='p-col-8 p-grid p-jc-between'>
                                <h6 className='p-col' style={{textAlign:'center',color: "white"}}>Home</h6>
                                <h6 className='p-col' style={{textAlign:'center',color: "white"}}>Service</h6>
                                <h6 className='p-col' style={{textAlign:'center',color: "white"}}>Shop</h6>
                                <h6 className='p-col' style={{textAlign:'center',color: "white"}}>Blog</h6>
                            </div> */}
					</div>
				</div>
				<div className="p-col-6 p-grid p-jc-end p-mt-3">
					<div>
						<Menubar
							style={{
								backgroundColor: 'white',
								borderRadius: '20px',
								fontSize: '0.8rem',
							}}
							model={items}
							end={() => {
								return isSignIn ? (
									<div className="p-d-flex p-jc-around">
										{user.role === roles.ADMIN && (
											<MessageNotification
												ref={(ref) => (global.message = ref)}
											/>
										)}
										<Notification />
									</div>
								) : (
									<Fragment></Fragment>
								)
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Header
