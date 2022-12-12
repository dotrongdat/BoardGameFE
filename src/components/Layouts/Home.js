import React, { Fragment } from 'react'
import { Carousel } from 'primereact/carousel'
import { useSelector } from 'react-redux'
import Product from './Product'
import { Link } from 'react-router-dom'
import { COVID19_PANEL } from '../Constant/ResourceConstant'
import { Divider } from 'primereact/divider'
import { PRIMARY_COLOR } from '../Constant'
const Home = () => {
	const items = [
		'./fake-product/1.jpeg',
		'./fake-product/2.JPEG',
		'./fake-product/3.JPEG',
		'./fake-product/4.JPEG',
	]
	const panelTemplate = (item) => {
		return (
			<img
				src={item}
				onError={(e) =>
					(e.target.src =
						'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
				}
				alt="imagelogo"
				className="product-image"
				width={'100%'}
			/>
		)
	}
	const productCarouselTemplate = (item) => {
		return (
			<div style={{ margin: '1.5vh' }}>
				<Product product={item} />
			</div>
		)
	}
	const { allProducts, categories } = useSelector((state) => state)

	return (
		<Fragment>
			<div
				className="p-grid p-mt-4 p-jc-center"
				style={{
					boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
					borderRadius: '10px',
				}}
			>
				<div className="p-col-10 p-mt-6">
					<Carousel
						value={items}
						numVisible={1}
						numScroll={1}
						circular
						autoplayInterval={3000}
						itemTemplate={panelTemplate}
					/>
				</div>
			</div>
			<div
				className="p-grid p-mt-6 vertical-container"
				style={{
					backgroundImage: `url("./bg2.png")`,
					backgroundSize: '100% 100%',
					height: '800px',
					borderRadius: '10px',
				}}
			/>
			<div
				className="p-grid p-mt-4"
				style={{
					boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
					borderRadius: '10px',
				}}
			>
				<div className="p-col-12" style={containerTitleStyle}>
					<h3 style={titleStyle}>Sản phẩm mới</h3>
					<Link to={'/'} style={moreDetailStyle}>
						{'Xem thêm >'}
					</Link>
				</div>
				<Carousel
					style={{ margin: '10px', color: 'orange' }}
					value={allProducts.slice(0, 5)}
					numVisible={4}
					numScroll={4}
					itemTemplate={productCarouselTemplate}
				/>
			</div>
		</Fragment>
	)
}
export default Home

const containerTitleStyle = {
	backgroundImage:
		'linear-gradient( 94.3deg,  rgba(26,33,64,1) 10.9%, rgba(81,84,115,1) 87.1% )',
	position: 'relative',
	borderTopLeftRadius: '10px',
	borderTopRightRadius: '10px',
}
const titleStyle = {
	fontFamily: 'cursive',
	fontWeight: 'lighter',
	color: 'white',
	marginLeft: '0.5rem',
}
const moreDetailStyle = {
	position: 'absolute',
	right: '10px',
	top: '30%',
	textDecoration: 'none',
	fontFamily: 'cursive',
	color: 'white',
}
