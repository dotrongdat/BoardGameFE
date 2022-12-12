import React,{useRef,useEffect,useState, Fragment} from 'react';
import {OverlayPanel} from 'primereact/overlaypanel';
import {Badge} from 'primereact/badge';
import {DataScroller} from 'primereact/datascroller';
import {Skeleton} from 'primereact/skeleton';
import {useHistory} from 'react-router-dom';
import {notificationStatus,notificationType} from '../../Constant/NotificationConstant';
import notificationService from '../../../service/notification.service';
import statusCode from 'http-status-codes';
import { isEmpty } from 'lodash';
import {moment} from '../Function.util.js';
import './Notification.css';
import { useSelector } from 'react-redux';

// const NotificationTypeTemplate = {
//     [notificationType.ORDER.WAITING_CONFIRM]: ()=>(

//     )
// }

const Notification = () =>{
    const [data,setData] = useState([]);
    const [total,setTotal] = useState(0);
    const [totalUnread,setTotalUnread] = useState(0);
    //const [totalAdd, setTotalAdd] = useState(0);
    //const [from,setFrom] = useState(0);
    
    const {user} = useSelector(state=>state);

    const loadingRef = useRef(false);    
    const overlayPanelRef = useRef();
    
    const _useHistory = useHistory();
    
    const itemTemplate =  (item,option)=>{
        //let content;
        //content = (item) ? JSON.parse(item.content) : null;
        const onClickHandler = ()=>{
            overlayPanelRef.current.hide();
            !item.checkedReceiver.includes(user._id) && makeReadNotification(item._id);
            switch (item.type){
                case notificationType.ORDER.WAITING_CONFIRM:
                    global.toast.show({severity:'info', summary: 'Xác nhận đơn hàng', detail: `Mã đơn hàng: #${item.data.code}`, life: 1500});
                    break;
                case notificationType.ORDER.CONFIRMED:
                    global.toast.show({severity:'info', summary: 'Xác nhận đơn hàng', detail: `Đơn hàng #${item.data.code} đã được xác nhận`, life: 1500});
                    //_useHistory.push(`/order/${content.order_id}`);
                    break;
                default:
            }
        }
        return (
                <div  style={{height:'auto',minHeight:'10vh',cursor:'pointer'}}>
                    {item && <div onClick={onClickHandler} className={item.checkedReceiver.includes(user._id) ? 'notification-item-read' : 'notification-item-unread'} >
                        <div className='p-grid p-pt-3'>
                            <div className='p-grid p-col-2 vertical-container'>
                                <div className='p-col p-col-align-center p-ml-1'>
                                    <img src={item.image || '/logo.png'} style={{borderRadius: '50%', height: '6vh', width:'6vh'}} alt='notification_img'/>
                                </div>
                            </div>
                            <div className='p-grid p-col-7 p-jc-center'>
                                <h6 style={{fontSize:'90%'}} className='p-col-12'>{item.title}</h6>
                                <p className='p-col-12' style={{fontSize:'90%'}}>{item.content}</p>
                            </div>
                            <div className='p-grid p-col-3 p-ml-5 vertical-container'>
                                <div className='p-col p-col-align-center'>
                                    {!item.checkedReceiver.includes(user._id) && <Fragment><i className='pi pi-circle-fill' style={{color: 'blueviolet'}}></i><br/></Fragment>}
                                    <p style={{fontSize:'60%'}}>{moment(item.created_at).fromNow()}</p>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {!item && <Skeleton style={{padding:'1vh'}} shape='rectangle' width='25vw' height='5vh'></Skeleton>}
                </div>
        );
    }

    const loadingTemplate = ()=>{
        return (
            <div>
                <Skeleton style={{padding:'1vh'}} shape='rectangle' width='28vw' height='5vh'></Skeleton>
                <Skeleton shape='rectangle' width='28vw' height='5vh'></Skeleton>
            </div>
        );
    }
    const loading = (bool)=>{
        bool ? setData(prevData => prevData.concat(Array.from({length:2}))) : setData(prevData=>prevData.filter(i=> !isEmpty(i)));
    }
    const onLazyLoadHandler = (e)=>{ 
        let {first,rows} = e;
        if(first>0 && !loadingRef.current){
            if(data.length<total){ 
                loading(true);
                loadingRef.current=true;
                setTimeout(async()=>{
                    await getNotification(data.length);
                    loading(false);
                    loadingRef.current=false;
                },2000); 
            }
        }else setData((prevData)=>[].concat(prevData))                 
    }
    const makeReadNotification = async (_id)=>{
        const res = await notificationService.markRead({_id});
        if(res.status === statusCode.OK){
            setTotalUnread(prevData=> (prevData>0)?prevData-1:prevData);
            setData(prevData=>{
                let index = prevData.findIndex(i=>i._id===_id);
                let _data = prevData;
                _data[index].checkedReceiver.push(user._id);
                return _data;
            })
        }
    }
    const getNotification = async (from=0,itemPerPage=6)=>{
        const res = await notificationService.get({from,itemPerPage});
        switch (res.status){
            case statusCode.OK:
                const {notification,total,totalUnread} = res.data.payload;
                setTotal(total);
                setTotalUnread(totalUnread);
                setData((prevData)=>prevData.concat(notification));
                break;
            case statusCode.UNAUTHORIZED:
                _useHistory.replace('/signin');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Server Error', detail: 'Error', life: 1500});
                break;
            default:
        }
    }
    useEffect(()=>{
        getNotification();
        global.socket.on('notification',(notification)=>{
            setData((prevData)=> [notification,...prevData]);
            setTotal(prevData=>prevData+1);
            setTotalUnread(prevData=>prevData+1);
            switch (notification.type){
                case notificationType.ORDER.WAITING_CONFIRM:
                    global.toast.show({severity:'info', summary: 'Đơn hàng mới', detail: "Đơn hàng cần được xác nhận", sticky: true});
                    break;
                case notificationType.ORDER.CANCEL_BY_CUSTOMER:
                    global.toast.show({severity:'info', summary: 'Hủy đơn hàng', detail: "Khách hàng vừa hủy một đơn hàng", sticky: true});
                    break;
                default:
            }
        })
        return ()=>global.socket.off('notification');
    },[]);
    return (
        <div>
            <i className="pi pi-bell p-mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '1.6rem',cursor:'pointer' }} onClick={e=>overlayPanelRef.current.toggle(e)}>{totalUnread>0 && <Badge value={totalUnread} severity="danger"></Badge>}</i>
            <OverlayPanel ref={overlayPanelRef} style={{width:'30vw'}}>
                <DataScroller  value={data} itemTemplate={itemTemplate} emptyMessage='Bạn chưa có thông báo' loader rows={6}  inline scrollHeight="60vh" lazy onLazyLoad={onLazyLoadHandler}/>
            </OverlayPanel>
        </div>
    );
}

export default Notification;