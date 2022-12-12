import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Tag } from 'primereact/tag'
import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import blogService from '../../../service/blog.service'
import './Blog.css'
import statusCode from 'http-status-codes'
import CustomConfirmDialog from '../../Notifications/CustomConfirmDialog'
import { Column } from 'primereact/column'
import BlogDetail from './BlogDetail'
import BlogCreate from './BlogCreate'

const Blog = (props) => {
	const { blogs } = useSelector((state) => state)
	const [isDialogDetailBlogVisible, setIsDialogDetailBlogVisible] =
		useState(false)
	const [isDialogCreateBlogVisible, setIsDialogCreateBlogVisible] =
		useState(false)
	const [selectedBlog, setSelectedBlog] = useState()
	const [selectedRow, setSelectedRow] = useState([])

	const blogDetailRef = useRef()
	const blogCreateRef = useRef()

	const onClickCloseDetailBlogHandler = () => {
		setIsDialogDetailBlogVisible(false)
		// setSelectedBlog(undefined);
	}
	const onClickResetDetailBlogHandler = () => blogDetailRef.current.reset()
	const onClickSaveHandler = () => blogDetailRef.current.update()
	const onClickCloseCreateBlogHandler = () =>
		setIsDialogCreateBlogVisible(false)
	const onClickResetCreateBlogHandler = () => blogCreateRef.current.reset()
	const onClickCreateHandler = () => blogCreateRef.current.create()
	const onClickAddBlogHandler = () => setIsDialogCreateBlogVisible(true)
	const onClickDeleteListBlogHandler = () => {
		const reject = () => {}
		const accept = async () => {
			const res = await blogService._delete({
				_id: selectedRow.map((v) => v._id),
			})
			switch (res.status) {
				case statusCode.OK:
					global.toast.show({
						severity: 'success',
						summary: 'Xóa bài viết',
						detail: 'Thành công',
						life: 1500,
					})
					break
				default:
					break
			}
		}
		CustomConfirmDialog(
			'Bạn muốn xóa tất cả bài viết đã chọn ?',
			'Xóa bài viết',
			accept,
			reject
		)
	}
	const onClickDeleteBlogHandler = (_id) => {
		const reject = () => {}
		const accept = async () => {
			const res = await blogService._delete([_id])
			switch (res.status) {
				case statusCode.OK:
					global.toast.show({
						severity: 'success',
						summary: 'Xóa bài viết',
						detail: 'Thành công',
						life: 1500,
					})
					break
				default:
					break
			}
		}
		CustomConfirmDialog(
			'Bạn muốn xóa bài viết này ?',
			'Xóa bài viết',
			accept,
			reject
		)
	}
	const onClickBlogDetailHandler = (data) => {
		setSelectedBlog(data)
		setIsDialogDetailBlogVisible(true)
	}
	const renderDialogDetailProductFooter = () => {
		return (
			<div>
				<Button
					label="Đóng"
					icon="pi pi-times"
					onClick={onClickCloseDetailBlogHandler}
					className="p-button-text"
				/>
				<Button
					label="Hoàn tác"
					icon="pi pi-refresh"
					onClick={onClickResetDetailBlogHandler}
					className="p-button-text"
				/>
				<Button
					label="Cập nhật"
					type="button"
					icon="pi pi-check"
					onClick={onClickSaveHandler}
					autoFocus
				/>
			</div>
		)
	}
	const renderDialogCreateBlogFooter = () => {
		return (
			<div>
				<Button
					label="Đóng"
					icon="pi pi-times"
					onClick={onClickCloseCreateBlogHandler}
					className="p-button-text"
				/>
				<Button
					label="Hoàn tác"
					icon="pi pi-refresh"
					onClick={onClickResetCreateBlogHandler}
					className="p-button-text"
				/>
				<Button
					label="Tạo mới"
					icon="pi pi-check"
					onClick={onClickCreateHandler}
					autoFocus
				/>
			</div>
		)
	}
	const renderHeader = () => (
		<div className="p-d-flex p-jc-between">
			<div>
				<Button
					className="p-mr-1"
					type="button"
					icon="pi pi-plus-circle"
					label="Thêm bài viết"
					onClick={onClickAddBlogHandler}
				/>
				<Button
					className="p-button-danger"
					type="button"
					icon="pi pi-trash"
					label="Xóa"
					onClick={onClickDeleteListBlogHandler}
					disabled={!selectedRow || !selectedRow.length}
				/>
			</div>
		</div>
	)
	const actionBodyTemplate = (rowData) => {
		return (
			<div className="p-d-flex p-jc-content">
				<Button
					className="p-button-rounded p-mr-1"
					tooltip="Chi tiết bài viết"
					type="button"
					icon="pi pi-pencil"
					onClick={() => onClickBlogDetailHandler(rowData)}
				/>
				<Button
					className="p-button-rounded p-button-warning"
					tooltip="Xóa"
					type="button"
					icon="pi pi-trash"
					onClick={() => onClickDeleteBlogHandler(rowData._id)}
				/>
			</div>
		)
	}
	return (
		<Fragment>
			<Dialog
				maximizable
				modal
				header="Chi tiết bài viết"
				visible={isDialogDetailBlogVisible}
				style={{ width: '50vw' }}
				footer={renderDialogDetailProductFooter}
				onHide={onClickCloseDetailBlogHandler}
			>
				<BlogDetail data={selectedBlog} ref={blogDetailRef} />
			</Dialog>
			<Dialog
				maximizable
				modal
				header="Tạo mới bài viết"
				visible={isDialogCreateBlogVisible}
				style={{ width: '50vw' }}
				footer={renderDialogCreateBlogFooter}
				onHide={onClickCloseCreateBlogHandler}
			>
				<BlogCreate ref={blogCreateRef} />
			</Dialog>
			<Tag value="Danh sách bài viết" style={{ backgroundColor: '#7a7a7a' }} />
			<div
				className="p-grid p-justify-center p-pt-6 p-pb-6"
				style={{
					backgroundColor: 'white',
					boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
				}}
			>
				<div
					className="p-col-12 p-jc-center"
					style={{
						boxShadow:
							'0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)',
					}}
				>
					<div className="datatable-filter-demo">
						<div className="card">
							<DataTable
								value={blogs}
								paginator
								className="p-datatable-customers"
								showGridlines
								rows={10}
								dataKey="_id"
								responsiveLayout="scroll"
								header={renderHeader}
								emptyMessage="Không có bài viết."
								selection={selectedRow}
								onSelectionChange={(e) => setSelectedRow(e.value)}
							>
								<Column
									selectionMode="multiple"
									headerStyle={{ width: '3rem' }}
									exportable={false}
								></Column>
								<Column
									field="title"
									header="Bài viết"
									style={{ minWidth: '12rem' }}
								/>
								<Column header="" body={actionBodyTemplate} />
							</DataTable>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default Blog
