import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { roles } from '../Constant/CredentialConstant'
import './Footer.css'

const Footer = () => {
	const { user } = useSelector((state) => state)
	return (
		<Fragment>
			{/* {user.role !== roles.ADMIN && <footer className="footer p-grid p-jc-center" style={{backgroundImage: 'url("FakeFooter.PNG")', backgroundSize: '100% 100%', height: '800px', borderRadius:'10px'}}></footer>} */}
			{/* {user.role === roles.ADMIN && (
				<footer style={{ backgroundColor: 'GrayText', height: '6vh' }}></footer>
			)} */}
			<footer
				style={{
					backgroundImage:
						'linear-gradient( 94.3deg,  rgba(26,33,64,1) 10.9%, rgba(81,84,115,1) 87.1% )',
					height: '6vh',
				}}
			></footer>
			{/* <div className='p-col-8 p-grid p-mt-2'>
                <div className='p-col-3 p-grid'>
                    <h5 className='p-col-12'>Contact</h5>
                    <div className='p-grid'>
                        <div className='p-col-2'>
                            <i className="pi pi-home"/>
                        </div>
                        <div className='p-col-8 p-ml-1'>
                            <h6>CÔNG TY TRÁCH NHIỆM HỮU HẠN THƯƠNG MẠI NAVITA VIỆT NAM</h6>
                        </div>
                    </div>
                    <div className='p-grid'>
                        <div className='p-col-2'>
                            <i className="pi pi-building"/>
                        </div>
                        <div className='p-col-8 p-ml-1'>
                            <strong>MST: 0107423047 | Cấp ngày 05/05/2016</strong>
                            <h6>Số 302 Kim Ngưu, Phường Minh Khai, Quận Hai Bà Trưng, Thành phố Hà Nội, Việt Nam</h6>
                        </div>
                    </div>
                    <div className='p-grid'>
                        <div className='p-col-2'>
                            <i className="pi pi-building"/>
                        </div>
                        <div className='p-col-8 p-ml-1'>
                            <strong>Showroom tại Việt Nam: </strong>
                            <h6>302 Kim Ngưu, Quận Hai Bà Trưng, Hà Nội</h6>
                        </div>
                    </div>
                    <div className='p-grid'>
                        <div className='p-col-2'>
                            <i className="pi pi-envelope"/>
                        </div>
                        <div className='p-col-8 p-ml-1'>
                            <h6><strong>Email:</strong> info@navitavietnam.com</h6>
                        </div>
                    </div>
                    <div className='p-grid'>
                        <div className='p-col-2'>
                            <i className="pi pi-phone"/>
                        </div>
                        <div className='p-col-8 p-ml-1'>
                            <h6><strong>Hotline:</strong>+84.888.355.655</h6>
                        </div>
                    </div>
                </div>
                <div className='p-col-3'>
                    <h5>Category</h5>
                    <p>Giới thiệu NAVITA</p>
                    <p>Giấy phép kinh doanh</p>
                    <p>Sản phẩm của NAVITA</p>
                    <p>Cảm nhận của khách hàng</p>
                    <p>Hệ thống nhà phân phối</p>
                    <p>Tin tức NAVITA</p>
                    <p>Liên hệ</p>
                </div>
                <div className='p-col-3'>
                    <h5>Guideline</h5>
                    <p>Hướng dẫn mua hàng</p>
                    <p>Hướng dẫn thanh toán</p>
                    <p>Hướng dẫn vận chuyển</p>
                    <p>Hướng dẫn đổi/trả hàng</p>
                    <p>Hướng dẫn đăng ký</p>
                    <p>Chính sách Kiểm hàng</p>
                    <p>Chính sách bảo mật</p>
                </div>
                <div className='p-col-3 p-grid'>
                    <h5 className='p-col-12'>Facebook</h5>
                </div>
            </div> */}
		</Fragment>
	)
}
export default Footer
