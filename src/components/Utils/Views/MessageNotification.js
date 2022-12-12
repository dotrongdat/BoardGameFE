import React,{useState,useRef,useEffect,createRef,useImperativeHandle,forwardRef,useCallback, Fragment} from 'react';
import {useSelector} from 'react-redux';
import {OverlayPanel} from 'primereact/overlaypanel';
import {DataScroller} from 'primereact/datascroller';
import {Badge} from 'primereact/badge';
import {Skeleton} from 'primereact/skeleton';
import {moment} from '../Function.util.js';
import Message from './Message';
import {useHistory} from 'react-router-dom';
import messageService from '../../../service/message.service';
import statusCode from 'http-status-codes';
import _ from 'lodash';
import './MessageNotification.css';

const MessageNotification = (props,ref) =>{
    const [data,setData]=useState([]);
    const [messageInbox,setMessageInbox]=useState([]);
    const [messageInboxRef,setMessageInboxRef] = useState();
    const [messageIdUnread,setMessageIdUnread] = useState([]);
    const [total,setTotal] = useState(0);
    const overlayPanelRef=useRef();
    const loadingRef = useRef(false); 
    const {user} = useSelector(state=>state);
    const _useHistory = useHistory();

    const renderMessageNotificationLabel = (users)=>{
        let _users = _.cloneDeep(users);
        _users = _users.filter(i=> i._id !== user._id);
        _users = _users.map(i=> i.name);
        return _users.join();
    }
    const renderMessageNotificationContent = (data) =>{
        return (data.user._id === user._id) ? `You: ${data.message}` : `${data.user.name}: ${data.message}`;
    }
    const itemTemplate = (item)=>{
        const lastIndex = item.data.length-1;
        const lastMessage = (lastIndex>-1) ? {...item.data[lastIndex],user: item.users.find(i => i._id === item.data[lastIndex].user)} : {};
        const onClickHandler = async ()=>{
            overlayPanelRef.current.hide();
            const index = messageInbox.findIndex(i=>i._id === item._id);
            if(index === -1){
                const res = await messageService.getById({messageId:item._id});
                switch (res.status) {
                    case statusCode.OK:
                        let {message,total} = res.data.payload;
                        setMessageInboxRef(prevData =>{
                            return {...prevData,[item._id]:createRef()}
                        });
                        message = {...message,status:true,isShow:true,total};
                        setMessageInbox(prevData=>[...prevData,message]);
                        break;
                    case statusCode.UNAUTHORIZED:
                        _useHistory.replace('/signin');
                        break;
                    case statusCode.INTERNAL_SERVER_ERROR:
                        global.toast.show({severity:'error', summary: 'Server Error', detail: 'Error', life: 1500});
                        break;
                    default:
                        break;
                }
            }else{
                if(messageInbox[index].status) messageInboxRef[item._id].current.show();
                else{
                    setMessageInbox(prevData =>{
                        let updateData = [...prevData];
                        const copyData = {...updateData[index],status:true,isShow:true};
                        updateData=updateData.filter((i,_index)=>_index!==index);
                        updateData.push(copyData);
                        return updateData;
                    });
                }               
            } 
        }
        const otherUser = item.users.find(_user=>_user._id !== user._id);
        return (
            <div  style={{height:'auto',minHeight:'10vh',cursor:'pointer'}}>
            {item && <div onClick={onClickHandler} className={!messageIdUnread.includes(item._id) ? 'notification-item-read' : 'notification-item-unread'} >
                <div className='p-grid p-pt-3'>
                    <div className='p-grid p-col-2 vertical-container'>
                        <div className='p-col p-col-align-center p-ml-1'>
                            <img src={otherUser.image || '/user.png'} style={{borderRadius: '50%', height: '6vh', width:'6vh'}} alt='notification_img'/>
                        </div>
                    </div>
                    <div className='p-grid p-col-7 p-jc-center'>
                        <h6 style={{fontSize:'90%'}} className='p-col-12'>{item.name || renderMessageNotificationLabel(item.users)}</h6>
                        <p className='p-col-12' style={{fontSize:'90%'}}>{renderMessageNotificationContent(lastMessage)}</p>
                    </div>
                    <div className='p-grid p-col-3 p-ml-5 vertical-container p-jc-center'>
                        <div className='p-col p-col-align-center' style={{textAlign: 'center'}}>
                            {messageIdUnread.includes(item._id) && <div><i className='pi pi-circle-fill' style={{color: 'red', fontSize: '60%'}}></i><br/></div>}
                            <p style={{fontSize:'60%'}}>{moment(lastMessage.time).fromNow()}</p>
                        </div>
                    </div>
                </div>
            </div>}
            {!item && <Skeleton style={{padding:'1vh'}} shape='rectangle' width='25vw' height='5vh'></Skeleton>}
        </div>
                // <div  style={{height:'auto',minHeight:'10vh',cursor:'pointer'}}>
                // {item && <div onClick={onClickHandler} className={!messageIdUnread.includes(item._id) ? 'notification-item-read':'notification-item-unread'} >
                //     <p style={{fontSize:'70%'}}>{moment(lastMessage.time).format('MMMM Do YYYY, h:mm:ss a')}</p>
                //     <h3>{item.name || renderMessageNotificationLabel(item.users)}</h3>
                //     <div className='p-grid p-justify-start'>
                //         <p className='p-col-11 p-text-secondary p-text-bold'>{renderMessageNotificationContent(lastMessage)}</p>
                //     </div>                   
                // </div>}
                // {!item && <Skeleton style={{padding:'1vh'}} shape='rectangle' width='25vw' height='5vh'></Skeleton>}
                // </div>
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
        bool ? setData(prevData => prevData.concat(Array.from({length:2}))) : setData(prevData=>prevData.filter(i=> !_.isEmpty(i)));
    }
    const onLazyLoadHandler = async (e)=>{
        let {first,rows} = e;
        if(first>0 && !loadingRef.current){
            if(data.length<total){ 
                loading(true);
                loadingRef.current=true;
                setTimeout(async()=>{
                    await getMessageNotification(data.length);
                    loading(false);
                    loadingRef.current=false;
                },2000); 
            }
        }else setData((prevData)=>[].concat(prevData))
    }
    const closeMessageInboxHandler = useCallback((index)=>{
        setMessageInbox(prevData=>{
            let updateMessageInboxData = [...prevData];
            updateMessageInboxData.unshift({...updateMessageInboxData[index],status:false,isShow:false});
            updateMessageInboxData.splice(index+1,1);
            return updateMessageInboxData;
        });
    },[]);
    const onChangeMessageInboxStatusHandler = useCallback((_id,status)=>{
        setMessageInbox(prevData=>{
            let updateMessageInboxData = [...prevData];
            const index = updateMessageInboxData.findIndex(i=>i._id === _id);
            (status) ? messageInboxRef[updateMessageInboxData[index]._id].current.show() : messageInboxRef[updateMessageInboxData[index]._id].current.hide();
            updateMessageInboxData[index].isShow=status;         
            return updateMessageInboxData;
        });
    },[messageInboxRef])
    const onLoadHistoryMessageData = useCallback(async (_id,from)=>{
        const fakeDelay = new Promise((resolve,reject)=>{
            setTimeout(()=>{resolve()},1500);
        })
        const getAPIPromise = messageService.getById({messageId:_id, from})
        const rs = await Promise.all([fakeDelay,getAPIPromise]);
        const res = rs[1];
        switch (res.status) {
            case statusCode.OK:
                const {message} = res.data.payload;
                setMessageInbox(prevData=>{
                    let updateMessageInboxData = [...prevData];
                    const index = updateMessageInboxData.findIndex(i=>i._id === _id);
                    updateMessageInboxData[index].data = message.data.concat(updateMessageInboxData[index].data);
                    return updateMessageInboxData;
                })
                break;
            case statusCode.UNAUTHORIZED:
                _useHistory.replace('/signin');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Server Error', detail: 'Error', life: 1500});
                break;
            default:
                break;
        }
    },[])
    const updateMessage = useCallback((message)=>{
        setMessageInbox(prevData => {
            let updateMessageInboxData = _.cloneDeep(prevData);
            const index = updateMessageInboxData.findIndex(i => i._id === message._id);
            updateMessageInboxData[index] = message;
            return updateMessageInboxData;
        });
        setData(prevData=>{
            const index = prevData.findIndex(i => i._id === message._id);
            let updateData = _.cloneDeep(prevData);
            updateData[index] = message;
            return updateData;
        })
    },[])
    const getMessageNotification = async (from=0,itemPerPage=6) =>{
        const res = await messageService.get({from,itemPerPage});
        switch (res.status) {
            case statusCode.OK:
                const {messages,total,messageIdUnread} = res.data.payload;
                setTotal(total);
                setData((prevData)=>prevData.concat(messages));
                setMessageIdUnread(messageIdUnread);
                break;
            case statusCode.UNAUTHORIZED:
                _useHistory.replace('/signin');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                global.toast.show({severity:'error', summary: 'Server Error', detail: 'Error', life: 1500});
                break;
            default:
                break;
        }
    }
    useImperativeHandle(ref,()=>({
        addNewMessage : (message) => addNewMessage(message),
        addMessageInbox: (user) =>  addMessageInbox(user)
    }));
    const addMessageInbox = useCallback(async (_user) => {
        const index = messageInbox.findIndex(item=>item.users.every(i=>[_user._id,user._id].includes(i._id)));
        if(index>=0){
            if (messageInbox[index].status) messageInboxRef[messageInbox[index]._id].current.show();
            else {
                let updateMessageInboxData = [...messageInbox];
                const backupData = {...updateMessageInboxData[index],status:true,isShow:true};
                updateMessageInboxData=updateMessageInboxData.filter((i,_index)=>_index!==index);
                updateMessageInboxData.push(backupData);
                setMessageInbox(updateMessageInboxData);
            }
        }else{
            const res = await messageService.getByUserId({userId:_user._id});
            switch(res.status){
                case statusCode.OK:
                    const {message,total} = res.data.payload;
                    if (message) {
                        setMessageInboxRef(prevData =>{
                            return {...prevData,[message._id]:createRef()}
                        });
                        setMessageInbox(prevData=>[...prevData,{...message,status:true,isShow:true,total}]);
                    }else {
                        setMessageInboxRef(prevData=>{
                            return {...prevData,[_user._id]:createRef()};
                        })
                        setMessageInbox(prevData=>{
                            const emptyData = {
                                _id: _user._id,
                                users:[_user,user],
                                data : [],
                                isEmptyMessageInbox: true,
                                status : true,
                                isShow : true,
                                total : 0
                            }
                            return [...prevData,emptyData];
                        });
                    }          
                    break;
                default:
        }}  
    },[messageInbox, messageInboxRef, user]);
    const addNewMessage = useCallback(async  (message)=>{
        const messageUserId = message.data[0].user;
        const index = messageInbox.findIndex(i => i._id === message._id);
        const updateData = [message].concat(data.filter(i=>i._id !== message._id));
        setData(updateData);
        if(index>=0){
            let updateMessageInboxData = [...messageInbox];
            updateMessageInboxData[index].data.push(message.data[0]);
            updateMessageInboxData[index].status = updateMessageInboxData[index].status || (messageUserId !== user._id);
            updateMessageInboxData[index].isShow = updateMessageInboxData[index].isShow || (messageUserId !== user._id);
            setMessageInbox(updateMessageInboxData);
        }else {
            const inboxUser = message.users.filter(i=>i._id !== user._id);
            let isExistMessageInbox = false;
            if(inboxUser && inboxUser.length===1){
                const _index = messageInbox.findIndex(i=>i._id === inboxUser[0]._id);
                if(_index>=0){
                    isExistMessageInbox=true;
                    let updateMessageInboxData = [...messageInbox];
                    updateMessageInboxData[_index]={
                        ...message,
                        status: true,
                        isShow: true,
                        total:1
                    };
                    setMessageInbox(updateMessageInboxData);
                }
            }
            if(!isExistMessageInbox){
                const res = await messageService.getById({messageId:message._id});
                switch (res.status) {
                    case statusCode.OK:
                        let _message = res.data.payload.message;
                        const {total} = res.data.payload;
                        setMessageInboxRef(prevData =>{
                            return {...prevData,[_message._id]:createRef()}
                        });
                        _message = {
                            ..._message,
                            status:messageUserId !== user._id,
                            isShow:messageUserId !== user._id,
                            total
                        };
                        setMessageInbox(prevData =>[...prevData,_message]);
                        setTotal(prevData=>prevData+1);
                        break;
                    case statusCode.UNAUTHORIZED:
                        _useHistory.replace('/signin');
                        break;
                    case statusCode.INTERNAL_SERVER_ERROR:
                        global.toast.show({severity:'error', summary: 'Server Error', detail: 'Error', life: 1500});
                        break;
                    default:
                        break;
                }
            }                
        }
    },[data,messageInbox,messageInboxRef]);
    useEffect(()=>{
        let _messageIdUnread = [];
        let _messageIdRead = [];
        data.forEach(i=>{
            const indexLastMessage = i.data.length - 1;
            (!i.data[indexLastMessage].checkedUser.includes(user._id)) ? _messageIdUnread.push(i._id) : _messageIdRead.push(i._id);
        })
        setMessageIdUnread(prevData=> {
            let updateData = [...prevData];
            updateData = updateData.filter(i=>!_messageIdRead.includes(i));
            updateData = [...new Set(updateData.concat(_messageIdUnread))];
            return updateData;
        });
    },[data,user]);
    useEffect(()=>{
        global.socket.on('message',(message)=>{
            addNewMessage(message);           
        });
        global.socket.on('checkedUser',({messageId,userId})=>{
            let _messageInbox = [...messageInbox];
            const index = _messageInbox.findIndex(i => i._id === messageId);
            _messageInbox[index].data[_messageInbox[index].data.length -1].checkedUser.push(userId); 
            updateMessage(_messageInbox[index]);         
        })
        return ()=>{
            global.socket.off('message');
            global.socket.off('checkedUser');
        }
    },[addNewMessage,updateMessage,messageInbox])
    useEffect(()=>{
        getMessageNotification();        
    },[])
    return (
        <React.Fragment>
            <i className="pi pi-comment p-mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '1.6rem',cursor:'pointer' }} onClick={e=>overlayPanelRef.current.toggle(e)}>{messageIdUnread.length>0 && <Badge value={messageIdUnread.length} severity="success"></Badge>}</i>
            <OverlayPanel ref={overlayPanelRef} style={{width:'30vw'}}>
                <DataScroller  value={data} itemTemplate={itemTemplate} emptyMessage='Bạn chưa có tin nhắn' loadingTemplate={loadingTemplate} showLoader rows={6}  inline scrollHeight="60vh"  onLazyLoad={onLazyLoadHandler}/>
            </OverlayPanel>
            {messageInbox.length > 0 && <div className='p-grid p-justify-end' >
                {
                    messageInbox.map((i,index) =>
                        <React.Fragment key={i._id}>
                            {i.status &&  <div style={{width:'20vw',minWidth:'20rem',position:'fixed',bottom:'1vh',right:(messageInbox.length - index -1)*20+'vw'}}>
                                <Message ref={messageInboxRef[i._id]} data={messageInbox[index]} 
                                    close={()=>closeMessageInboxHandler(index)} 
                                    onChange = {onChangeMessageInboxStatusHandler} 
                                    onLoad = {onLoadHistoryMessageData}
                                    updateMessage = {updateMessage}
                                />                                
                            </div>}
                        </React.Fragment>    
                    )
                }
            </div>}
        </React.Fragment>
    );
}

export default forwardRef(MessageNotification);
