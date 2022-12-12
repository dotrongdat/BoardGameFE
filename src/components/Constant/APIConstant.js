import 'dotenv/config'
const info = {
	//hostname :"10.88.221.138",
	hostname: 'localhost',
	port: '3001',
}
const domain = process.env.DOMAIN || `http://${info.hostname}:${info.port}`
//const domain = 'https://nameless-chamber-84459.herokuapp.com'
export { info, domain }
