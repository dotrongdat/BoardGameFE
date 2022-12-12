import { isArray } from 'lodash'
import { createStore } from 'redux'
import { roles } from '../components/Constant/CredentialConstant'

const DEFAULT_STATE = {
	isSignIn: false,
	isInitialize: false,
	user: {
		role: roles.NO_AUTH,
		cart: [],
		// ip: null
	},
	categories: [],
	allProducts: [],
	searchProducts: [],
	orders: undefined,
	blogs: [],
}
const reducer = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		// eslint-disable-next-line no-lone-blocks
		// case 'syncSignIn':{
		//     const {user} = action.user;
		//     global.socket.emit('SignIn',user);
		//     return {...state,isSignIn:true,user};
		// }
		// case 'syncSignOut':{
		//     const {user} = action.user;
		//     global.socket.emit('SignOut',user);
		//     return {...state,isSignIn:true,user};
		// }
		case 'initialize': {
			return { ...state, isInitialize: true }
		}
		// case 'setIPAddress': {
		//     return {...state, user : {...state.user, ip: action.ip}}
		// }
		case 'findProductByCategory': {
			return { ...state, searchProducts: action.searchProducts }
		}
		case 'initProduct': {
			return { ...state, allProducts: action.products }
		}
		case 'addProduct': {
			return { ...state, allProducts: [...state.allProducts, action.product] }
		}
		case 'updateProduct': {
			let products = [...state.allProducts]
			const index = products.findIndex(
				(product) => product._id === action.product._id
			)
			products[index] = action.product
			return { ...state, allProducts: products }
		}
		case 'deleteProduct': {
			let products = [...state.allProducts]
			if (isArray(action._id)) {
				products = products.filter(
					(product) => !action._id.includes(product._id)
				)
			} else products = products.filter((product) => action._id !== product._id)
			return { ...state, allProducts: products }
		}
		case 'sync': {
			//console.log(action.user);
			return { ...state, user: action.user }
		}
		case 'signin': {
			let user = { ...(action.user || state.user) }
			user.cart = state.user.cart
			action.token && localStorage.setItem('token', action.token)
			action.refresh && localStorage.setItem('refresh', action.refresh)
			localStorage.setItem('user', JSON.stringify(user))
			;(!state.user || state.user._id !== user._id) &&
				global.socket.emit('signIn', user)
			return { ...state, isSignIn: true, user }
		}
		case 'signout': {
			global.admin = undefined
			localStorage.removeItem('token')
			localStorage.removeItem('refresh')
			localStorage.removeItem('user')
			global.socket.emit(
				'signOut',
				state.user,
				JSON.parse(localStorage.getItem('socketID'))
			)
			return {
				...DEFAULT_STATE,
				categories: state.categories,
				allProducts: state.allProducts,
				isInitialize: true,
				user: { ...DEFAULT_STATE.user, cart: state.user.cart },
			}
		}
		case 'refreshToken': {
			localStorage.setItem('token', action.token)
			localStorage.setItem('refresh', action.refresh)
			return state
		}
		case 'initializeCategories': {
			return { ...state, categories: action.categories }
		}
		case 'addCategory': {
			return { ...state, categories: [...state.categories, action.category] }
		}
		case 'updateCategory': {
			let categories = [...state.categories]
			const index = categories.findIndex(
				(category) => category._id === action.category._id
			)
			categories[index] = action.category
			return { ...state, categories }
		}
		case 'enableCategory': {
			let categories = [...state.categories]
			const index = categories.findIndex(
				(category) => category._id === action._id
			)
			categories[index].status = true
			return { ...state, categories }
		}
		case 'disableCategory': {
			let categories = [...state.categories]
			const index = categories.findIndex(
				(category) => category._id === action._id
			)
			categories[index].status = false
			return { ...state, categories }
		}
		case 'updateCart': {
			localStorage.setItem('cart', JSON.stringify(action.cart))
			return { ...state, user: { ...state.user, cart: action.cart } }
		}
		case 'addToCart': {
			const index = state.user.cart.findIndex(
				(v) => v._id === action.product._id
			)
			let cart = state.user.cart
			if (index !== -1) cart[index].quantity += action.product.quantity
			else cart.push(action.product)
			localStorage.setItem('cart', JSON.stringify(cart))
			return { ...state, user: { ...state.user, cart } }
		}
		case 'initBlog': {
			return { ...state, blogs: action.blogs }
		}
		case 'addBlog': {
			return { ...state, blogs: [...state.blogs, action.blog] }
		}
		case 'updateBlog': {
			let blogs = [...state.blogs]
			const index = blogs.findIndex((blog) => blog._id === action.blog._id)
			blogs[index] = action.blog
			return { ...state, blogs }
		}
		case 'deleteBlog': {
			let blogs = [...state.blogs]
			blogs = blogs.filter((blog) => !action._id.includes(blog._id))
			return { ...state, blogs }
		}
		case 'initOrder': {
			return { ...state, orders: action.orders }
		}
		case 'addOrder': {
			let { orders } = state
			const { order } = action
			orders[String(order.status)].unshift(order)
			return { ...state, orders }
		}
		case 'updateOrder': {
			let orders = { ...state.orders }
			const { prevStatus, order } = action
			orders[String(prevStatus)] = orders[String(prevStatus)].filter(
				(_order) => _order._id !== order._id
			)
			orders[String(order.status)].unshift(order)
			return { ...state, orders }
		}
		default:
			return state
	}
}
const store = createStore(reducer)
export default store
