import { VNPAY_URL_PAY, vnp_Url_config } from '../Constant/OrderConstant';
import querystring from 'qs';
import crypto from 'crypto';
import dateFormat from 'dateformat';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

function sortObject(obj) {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
export const toVNDCurrencyFormat = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const createVNPayUrl = ({amount,ipAddr}) => {
    //let dateFormat = require('dateformat');
    let date = new Date();

    let createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    
    let {vnp_Command,vnp_CurrCode,vnp_HashSecret,vnp_Locale,vnp_OrderInfo,vnp_OrderType,vnp_ReturnUrl,vnp_TmnCode,vnp_Version} = vnp_Url_config;
    let vnpUrl = VNPAY_URL_PAY;
    //var orderType = req.body.orderType;
    //var locale = req.body.language;
    //if(locale === null || locale === ''){
        //locale = 'vn';
    //}
    //var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = vnp_Version;
    vnp_Params['vnp_Command'] = vnp_Command;
    vnp_Params['vnp_TmnCode'] = vnp_TmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = vnp_Locale;
    vnp_Params['vnp_CurrCode'] = vnp_CurrCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = vnp_OrderInfo;
    vnp_Params['vnp_OrderType'] = vnp_OrderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    // if(bankCode !== null && bankCode !== ''){
    //     vnp_Params['vnp_BankCode'] = bankCode;
    // }

    vnp_Params = sortObject(vnp_Params);

    //var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    //var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", vnp_HashSecret);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
}

export const getKeyValueParamObject = (paramStr) => {
    var arr = paramStr.split('&');
    let paramReturn = {}; 
    arr.forEach(i=>{
        const keyValue = i.split('=');
        paramReturn = {...paramReturn,[keyValue[0]]:keyValue[1]};
    })
}

export const typeOf = (type,value) => Object.prototype.toString.call(value).slice(8,-1) === type;

export {moment};
