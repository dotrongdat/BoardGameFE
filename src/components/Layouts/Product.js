import React, { useState } from 'react'
import './Product.css'
import { Button } from 'primereact/button'
import { useHistory } from 'react-router-dom'
import userService from '../../service/user.service'
import { BUTTON_STYLE, BUTTON_STYLE_2 } from '../Constant'

const Product = (props) => {
	const { product } = props
	const _useHistory = useHistory()
	const [style, setStyle] = useState({ cursor: 'pointer' })
	const onMouseOver = () => {
		setStyle((prevData) => {
			return {
				...prevData,
				borderColor: 'green',
				borderStyle: 'solid',
				borderWidth: 'thin',
			}
		})
	}
	const onMouseLeave = () => {
		setStyle({ cursor: 'pointer' })
	}
	const onClickAddToCartHandler = () => {
		userService.addToCart(product._id, 1)
		global.toast.show({
			severity: 'success',
			summary: 'Thêm sản phẩm vào giỏ hàng',
			detail: 'Sản phẩm đã được thêm vào giỏ hàng',
			life: 1500,
		})
	}
	return (
		<div className="p-grid p-jc-center" style={{ textAlign: 'center' }}>
			<div
				onClick={() => _useHistory.push('/product/' + product._id)}
				className="product p-col-11"
				style={style}
				onMouseOver={onMouseOver}
				onMouseLeave={onMouseLeave}
			>
				<img
					className="product_image"
					src={product.album[0]}
					alt={product.name}
				/>
				<div className="p-mt-3">
					<p className="product_name">{product.name}</p>
					<p className="product_price ">
						{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND
					</p>
				</div>
			</div>
			<div
				className="p-col-11"
				style={{ marginTop: '-5.5vh' }}
				onMouseOver={onMouseOver}
				onMouseLeave={onMouseLeave}
			>
				<Button
					style={{ borderRadius: '7px', width: '100%', ...BUTTON_STYLE_2 }}
					type="button"
					label="Thêm vào giỏ hàng"
					onClick={onClickAddToCartHandler}
				/>
			</div>
		</div>
	)
}

export default Product
