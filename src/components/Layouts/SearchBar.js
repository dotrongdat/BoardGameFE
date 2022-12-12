import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import './SearchBar.css'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { useSelector } from 'react-redux'
import { roles } from '../Constant/CredentialConstant'
import { TieredMenu } from 'primereact/tieredmenu'
import productService from '../../service/product.service'
import { BACKGROUND_COLOR, PRIMARY_COLOR, BUTTON_STYLE } from '../Constant'

const SearchBar = (props) => {
	const _useHistory = useHistory()
	const inputText = useRef()
	const menuRef = useRef(null)
	const { user, categories } = useSelector((state) => state)
	const [categoryItems, setCategoryItems] = useState([])
	const [totalInCart, setTotalInCart] = useState(0)
	const onSubmitHandler = async (e) => {
		e.preventDefault()
		// const params={
		//     name:inputText.current.value,
		//     page:1,
		//     sortBy:'name',
		//     priceFrom: 0,
		//     priceTo:Number.MAX_SAFE_INTEGER,
		//     inc: true
		// }
		// await props.onSubmit(params,['category']);
		// if(global.breadcrumb) global.breadcrumb.pullAll();
		_useHistory.push(`/search?key=${inputText.current.value}`)
	}
	const onClickShoppingCartHandler = (e) => {
		_useHistory.push('/cart')
	}
	// const onClickHomeHandler = async ()=> {
	//     await props.onSubmit({
	//         name:'',
	//         page:1,
	//         sortBy:'name',
	//         priceFrom: 0,
	//         priceTo:Number.MAX_SAFE_INTEGER,
	//         inc: true
	//     },['category']);
	//     _useHistory.replace('/');
	// };
	const aboutButton = () => {
		return (
			<Button
				type="button"
				style={{ borderColor: 'white', ...BUTTON_STYLE }}
				label="Trang chủ"
				icon="pi pi-home"
				onClick={() => _useHistory.push('/')}
			/>
		)
	}
	const cartButton = () => {
		return (
			<i
				className="pi pi-shopping-cart p-text-secondary p-overlay-badge"
				style={{
					marginLeft: '2vw',
					marginTop: '0.4vh',
					cursor: 'pointer',
					fontSize: '2rem',
				}}
				onClick={onClickShoppingCartHandler}
			>
				{totalInCart > 0 && <Badge value={totalInCart} severity="info"></Badge>}
			</i>
		)
	}
	// const homeButton = () => <Button className='p-button-rounded p-button-secondary' type='button' icon='pi pi-home' style={{marginRight:'2vw'}} onClick={onClickHomeHandler}/>
	const searchInput = () => {
		return (
			<React.Fragment>
				<InputText placeholder="Nhập tên sản phẩm ..." ref={inputText} />
				<Button
					type="submit"
					icon="pi pi-search"
					className="p-button-warning"
				/>
			</React.Fragment>
		)
	}
	const overlayMenu = () => {
		return (
			<React.Fragment>
				<TieredMenu
					id="overlay_menu"
					model={categoryItems}
					ref={menuRef}
					popup
				/>
				<Button
					type="button"
					style={{ borderColor: 'white', ...BUTTON_STYLE }}
					label="Sản phẩm"
					icon="pi pi-bars"
					onClick={(event) => menuRef.current.toggle(event)}
					aria-haspopup
					aria-controls="overlay_menu"
				/>
			</React.Fragment>
		)
	}
	useEffect(() => {
		setCategoryItems((prevData) => {
			let updateData = [
				{
					label: 'Tất cả sản phẩm',
					command: () => {
						_useHistory.push(`/search?key=`)
						inputText.current.value = ''
					},
				},
			]
			categories.forEach((category) => {
				if (category.status) {
					updateData.push({
						label: category.name,
						command: () => {
							productService.findByCategory(category._id)
							_useHistory.push(`/category?cate_id=${category._id}`)
							inputText.current.value = ''
							// global.breadcrumb.pullAll();
							// global.breadcrumb.push(category.name,`/category?cate_id=${category._id}`)
						},
					})
				}
			})
			return updateData
		})
	}, [categories])
	useEffect(() => {
		let _total = 0
		user.cart.forEach((i) => (_total += parseInt(i.quantity)))
		setTotalInCart(_total)
	}, [user])
	return (
		<div className="search-bar">
			<form onSubmit={onSubmitHandler}>
				<div
					className="p-grid p-mt-1 p-justify-center"
					style={{ backgroundColor: BACKGROUND_COLOR }}
				>
					<div className="p-col-12 p-inputgroup">
						{aboutButton()}
						{overlayMenu()}
						{searchInput()}
						{user.role !== roles.ADMIN && cartButton()}
					</div>
				</div>
			</form>
		</div>
	)
}
export default SearchBar
