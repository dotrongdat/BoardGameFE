import React, { useEffect, useState, useCallback } from 'react'
import './ProductDetail.css'
import { Form } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { useParams, useHistory, Link } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import Galleria from '../Utils/Views/Galleria'
import { InputNumber } from 'primereact/inputnumber'
import 'primereact/editor/editor.min.css'
import { Divider } from 'primereact/divider'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import userService from '../../service/user.service'
import { TabPanel, TabView } from 'primereact/tabview'
import {
	AHAMOVE_LOGO,
	CASH_ON_DELIVERY_LOGO,
	GHN_LOGO,
	SHIPPING_LOGO,
	VNPAY_LOGO,
} from '../Constant/OrderConstant'
import { Carousel } from 'primereact/carousel'
import Product from './Product'
import { BUTTON_STYLE_2, PRIMARY_COLOR } from '../Constant'

const ProductDetail = () => {
	const [product, setProduct] = useState()
	const [quantity, setQuantity] = useState()

	const { allProducts } = useSelector((state) => state)
	//const [categoryOptions,setCategoryOptions]=useState();
	const [availableQuantity, setAvailableQuantity] = useState()
	const [isInitialize, setIsInitialize] = useState(true)

	//const quantityCustomerInput=useRef();

	const _useHistory = useHistory()

	const { user, categories } = useSelector((state) => state)
	const { _id } = useParams()

	// useEffect(()=>{
	//     setCategoryOptions(prevData => {
	//         let categoryDropdownData=[];
	//         categories.forEach((category)=>{
	//             categoryDropdownData.push({
	//                 name: category.name,
	//                 value: category._id
	//             })
	//         });
	//         return categoryDropdownData;
	//     });
	// },[categories]);
	const calculateAvailableQuantity = (productQuantity) => {
		const productInCart = user.cart.find((p) => p._id === _id)
		const quantityInCart = productInCart ? productInCart.quantity : 0
		setAvailableQuantity(productQuantity - quantityInCart)
	}
	const productCarouselTemplate = (item) => {
		return (
			<div style={{ margin: '1.5vh' }}>
				<Product product={item} />
			</div>
		)
	}
	useEffect(() => {
		product && calculateAvailableQuantity(product.quantity)
	}, [JSON.stringify(user.cart)])
	useEffect(() => {
		window.scrollTo(0, 0)
		const _product = allProducts.find((p) => p._id === _id)
		if (_product) {
			setProduct(_product)
			calculateAvailableQuantity(_product.quantity)
			global.breadcrumb.pullAll()
			global.breadcrumb.push(
				categories.find((category) => category._id === _product.category).name,
				`/category?cate_id=${_product.category}`
			)
		}
		setIsInitialize(true)
	}, [allProducts, categories, _id])

	const customerView = useCallback(() => {
		const onClickBuyNowHandler = () => {
			//const quantity = quantityCustomerInput.current.inputRef.current.value;
			userService.addToCart(_id, quantity)
			_useHistory.push('/cart')
		}
		const onSubmitCustomerHandler = (e) => {
			e.preventDefault()
			//const quantity = quantityCustomerInput.current.inputRef.current.value;
			userService.addToCart(_id, quantity)
			global.toast.show({
				severity: 'success',
				summary: 'Thêm sản phẩm vào giỏ hàng',
				detail: 'Sản phẩm đã được thêm vào giỏ hàng',
				life: 1500,
			})
		}
		return (
			<React.Fragment>
				<Form className="product-detail" onSubmit={onSubmitCustomerHandler}>
					<div className="p-grid p-mt-2 p-justify-center">
						<div className="p-col-12 p-mt-6 p-mb-6 p-pb-6 p-grid p-justify-end">
							<div className="p-col-4 p-mr-3">
								<Galleria items={product.album} />
							</div>
							<div className="p-col-4">
								<div className="p-grid">
									<div className="p-col-10">
										<Form.Group>
											<Form.Text>
												<h2>{product.name}</h2>
											</Form.Text>
										</Form.Group>
									</div>
									<div className="p-col-2">
										<Button
											type="button"
											className="p-button-rounded p-button-text p-button-primary"
											icon="pi pi-share-alt"
										/>
										<Button
											type="button"
											className="p-button-rounded p-button-text p-button-danger"
											icon="pi pi-heart"
										/>
									</div>
								</div>
								<div className="p-col-10">
									{product.description.split('\n').map((line, index) => {
										if (index <= 5) {
											return <p>{line}</p>
										}
										return index <= 5 && <p>{line}</p>
									})}
								</div>

								<h3 style={{ color: 'green', fontWeight: 'bolder' }}>
									{product.price
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
									VND
								</h3>
								<div
									className="p-col-11"
									style={{
										padding: '10px',
										backgroundColor: '#f0f0f0',
										borderRadius: '10px',
									}}
								>
									<Form.Group>
										<Form.Label style={{ fontSize: '80%' }}>
											Số lượng
										</Form.Label>
										<br />
										<InputNumber
											inputId="horizontal"
											value={quantity}
											onValueChange={(e) => setQuantity(e.value)}
											showButtons
											buttonLayout="horizontal"
											step={1}
											style={{
												width: '1rem',
												height: '1.5rem',
												...BUTTON_STYLE_2,
											}}
											decrementButtonClassName="p-button-primary"
											required
											incrementButtonClassName="p-button-primary"
											incrementButtonIcon="pi pi-plus"
											decrementButtonIcon="pi pi-minus"
											max={availableQuantity}
											min={1}
											size={1}
										/>
										<p
											style={{ fontSize: '70%' }}
										>{`(Có sẵn: ${availableQuantity})`}</p>
									</Form.Group>
									<br />
									<Button
										className="p-button-outlined p-mr-5"
										style={{ borderRadius: '6px' }}
										type="button"
										label="Mua ngay"
										onClick={onClickBuyNowHandler}
									/>
									<Button
										disabled={!(availableQuantity > 0)}
										style={{ borderRadius: '6px' }}
										type="submit"
										icon="pi pi-shopping-cart"
										label="Thêm vào giỏ hàng"
									/>
								</div>
							</div>
							<div className="p-col-3">
								<p style={{ fontSize: '12px', fontWeight: 'bolder' }}>
									Loại hình vận chuyển
								</p>
								<img src={SHIPPING_LOGO} width="20px" alt="shipping logo" />{' '}
								<span style={{ fontSize: '13px' }}>Giao hàng tiêu chuẩn</span>
								<br />
								<br />
								<img
									src={CASH_ON_DELIVERY_LOGO}
									width="20px"
									alt="cod logo"
								/>{' '}
								<span style={{ fontSize: '13px' }}>
									Thanh toán khi nhận hàng
								</span>
								<Divider />
								<p style={{ fontSize: '12px', fontWeight: 'bolder' }}>
									{'Return & Warranty'}
								</p>
								<i className="pi pi-check-square" />{' '}
								<span style={{ fontSize: '13px' }}>100% chính hãng</span>
								<br />
								<br />
								<i className="pi pi-shield" />{' '}
								<span style={{ fontSize: '13px' }}>Warranty</span>
								<Divider />
								<div
									style={{
										backgroundColor: '#ffffab',
										borderRadius: '10px',
										padding: '5px',
									}}
								>
									<p style={{ fontSize: '12px', fontWeight: 'bolder' }}>
										Đơn vị vận chuyển
									</p>
									<img src={AHAMOVE_LOGO} width="50px" alt="shipping logo" />{' '}
									<span style={{ fontSize: '13px' }}>Ahamove</span>
									<img
										src={GHN_LOGO}
										width="50px"
										alt="shipping logo"
										style={{ marginLeft: '3vw' }}
									/>{' '}
									<span style={{ fontSize: '13px' }}>GHN</span>
								</div>
								<Divider />
								<div
									style={{
										backgroundColor: '#fedeff',
										borderRadius: '10px',
										padding: '5px',
									}}
								>
									<p style={{ fontSize: '12px', fontWeight: 'bolder' }}>
										Phương thức thanh toán
									</p>
									<img src={VNPAY_LOGO} width="50px" alt="shipping logo" />{' '}
									<span style={{ fontSize: '13px' }}>VN Pay</span>
									<br />
									<img
										src={CASH_ON_DELIVERY_LOGO}
										width="20px"
										alt="shipping logo"
										style={{ marginLeft: '0.7vw', marginRight: '0.9vw' }}
									/>{' '}
									<span style={{ fontSize: '13px' }}>
										Thanh toán khi nhận hàng
									</span>
								</div>
							</div>
						</div>
					</div>
				</Form>
				<div className="product-detail-description">
					<div className=" p-grid p-mt-6 p-pt-6 p-justify-center">
						<div className="p-col-10 p-mt-1">
							<TabView>
								<TabPanel header="Description">
									{product.description.split('\n').map((v) => (
										<p>{v}</p>
									))}
								</TabPanel>
								<TabPanel header="More Information">
									{product.detailDescription.map((v, index) => {
										return (
											<div
												className="p-grid"
												key={index}
												style={{
													backgroundColor:
														index % 2 === 0 ? 'white' : 'whitesmoke',
												}}
											>
												<div className="p-col-4">
													<h6 style={{ fontWeight: 'bolder' }}>{v.title}</h6>
												</div>
												<div className="p-col-8">
													<p>{v.content}</p>
												</div>
											</div>
										)
									})}
								</TabPanel>
								<TabPanel header="Brand">{product.brand}</TabPanel>
							</TabView>
						</div>
					</div>
				</div>
				{product.blog && (
					<div className="product-detail">
						<div className=" p-grid p-mt-6 p-pt-6 p-justify-center">
							<div className="p-col-11 p-mt-6 p-mb-6">
								<Divider align="left" type="solid">
									<h1>{product.name}</h1>
								</Divider>
							</div>
							<div className="p-col-10 p-mt-1">
								<div className="ql-editor blog_image">
									{ReactHtmlParser(product.blog)}
								</div>
							</div>
						</div>
					</div>
				)}
				<div
					class="p-mt-4"
					style={{
						boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
						borderRadius: '10px',
					}}
				>
					<div
						className="p-col-12"
						style={{
							backgroundColor: PRIMARY_COLOR,
							position: 'relative',
							borderRadius: '10px',
						}}
					>
						<h3
							style={{
								fontFamily: 'cursive',
								fontWeight: 'lighter',
								color: 'white',
								margin: '1vh',
							}}
						>
							Sản phẩm liên quan
						</h3>
						<Link
							style={{
								position: 'absolute',
								right: '10px',
								top: '30%',
								textDecoration: 'none',
								fontFamily: 'cursive',
								color: 'white',
							}}
						>
							{'Xem thêm >'}
						</Link>
					</div>
					<Carousel
						style={{ margin: '10px' }}
						value={allProducts.slice(0, 8)}
						numVisible={4}
						numScroll={4}
						itemTemplate={productCarouselTemplate}
					/>
				</div>
			</React.Fragment>
		)
	}, [availableQuantity, product, user.role, quantity])
	const emptyView = () => {
		return (
			<div className="product-detail p-grid p-align-center vertical-container p-justify-center p-mt-3">
				<img src="/noResult.png" alt="noProductFound" />
			</div>
		)
	}
	return (
		<React.Fragment>
			{/* {user.role === roles.ADMIN && <InputSwitch checked={isAdminView} onChange={onSwitchChangeHandler} style={{position:'absolute',top:'2vh',left:'2vw'}}/>} */}
			{/* {isInitialize && isAdminView && !isEmpty(product) && adminView()} */}
			{isInitialize && isEmpty(product) ? emptyView() : customerView()}
			{/* {isInitialize && isEmpty(product) && emptyView()} */}
		</React.Fragment>
	)
}

export default ProductDetail
