import React,{useEffect,useState,useRef,useImperativeHandle,forwardRef, useCallback} from 'react';
import {Form} from 'react-bootstrap';
import {Button} from 'primereact/button';
import {ScrollPanel} from 'primereact/scrollpanel';
import Scroll from '../Scroll.util';
import {useSelector} from 'react-redux';
import './Message.css';
import './Notification.css';
import {InputTextarea} from 'primereact/inputtextarea';
import {moment} from '../Function.util.js';
import messageService from '../../../service/message.service';
import statusCode from 'http-status-codes';
import { useHistory } from 'react-router';
import { Tooltip } from 'primereact/tooltip';
import {ProgressSpinner} from 'primereact/progressspinner';
import _ from 'lodash';
import { Badge } from 'primereact/badge';
import { classNames } from 'primereact/utils';

const Message = (props,ref)=>{
    const [users,setUsers] = useState([]);
    const [data,setData]=useState();
    const [inputText,setInputText]=useState([]);
    const [status,setStatus] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [allowOnBottomPositionEvent,setAllowOnBottomPositionEvent]=useState(false);
    const [lastSeenMessage,setLastSeenMessage] = useState();
    //const onBottomPositionEventRef = useRef();
    const scrollRef = useRef();
    const _useHistory=useHistory();
    const {user} = useSelector(state=>state);
    const [existUnreadMessage,setExistUnreadMessage] = useState(false);
    const messageTemplate = (message,prevMessage,nextMessage)=>{
        const otherTemplate = ()=>{
            return (<div className='p-grid p-mt-2 p-mb-3 p-justify-start'>
                {prevMessage && prevMessage.user !== message.user && <p style={{fontFamily: 'cursive', fontSize: '1rem'}} className='p-col-12'>{users[message.user].name}</p>}
                {!prevMessage && <p style={{fontFamily: 'cursive', fontSize: '1rem'}} className='p-col-12'>{users[message.user].name}</p>}
                <div className='message other p-align-center vertical-container p-justify-center'>
                    <div className={`p-col message_content-${message._id}`}>
                        {message.message}
                    </div>
                </div>
                
            </div>)
        }
        const myTemplate = ()=>{
            return (<div className='p-grid p-mt-2 p-mb-3 p-justify-end'>
                {lastSeenMessage === message._id &&
                    <div style={{position:'relative',width:'15px'}}>
                        <i className='pi pi-eye' style={{fontSize:'0.7rem',position:'absolute',bottom:'0px'}}/>
                    </div> 
                }
                <div className='message my p-align-center vertical-container p-justify-center'>
                    <div className={`p-col message_content-${message._id}`}>
                        {message.message}
                    </div>
                </div>              
            </div>)
        }
        return (
            <React.Fragment>
                <Tooltip style={{fontSize:'70%'}} target={`.message_content-${message._id}`} content={moment(message.time).format('LLL')} position={(message.user === user._id) ? 'left':'right'}/>
                {message.user !== user._id ? otherTemplate() : myTemplate()}
            </React.Fragment>
        );
    }

    useImperativeHandle(ref,()=>({
        show : () => setStatus(true),
        hide : () => setStatus(false)
    }));
    const onInputTextHandler = (e)=>{
        setInputText(e.target.value);
    }
    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        if(!_.isEmpty(inputText.trim())){
            if(!data.isEmptyMessageInbox){
                const res = await messageService.send({
                    _id : data._id,
                    message : inputText
                });
                switch (res.status) {
                    case statusCode.OK:
                        setInputText('');
                        break;
                    default:
                        break;
                }
            }else{
                const res = await messageService.create({
                    _id : data._id,
                    message : inputText,
                    users: data.users.map(i=>i._id)
                });
                switch (res.status) {
                    case statusCode.OK:
                        setInputText('');
                        break;
                    default:
                        break;
                }
            }
        }else setInputText('');       
    }
    const renderMessageInboxLabel = (users) =>{
        let _users = users;
        _users = _users.filter(i=> i._id !== user._id);
        _users = _users.map(i=> i.name);
        return _users.join();
    }
    const loadMessage = useCallback(async () =>{
        const length = data.data.length;
        if(length < data.total){
            setIsLoading(true);
            await props.onLoad(data._id,length);
            setIsLoading(false);
        }
    },[data]);
    const markRead = useCallback(async ()=>{  
        //const lastMessage = data.data[data.data.length-1];
        if(existUnreadMessage){
            const res = await messageService.markRead({messageId:data._id});
            switch(res.status){
                case statusCode.OK:
                    // let _data = _.cloneDeep(data);
                    // _data.data[_data.data.length - 1].checkedUser.push(user._id);
                    // props.updateMessage(_data);
                    setExistUnreadMessage(false);
                    break;
                case statusCode.UNAUTHORIZED:
                    _useHistory.replace('/signin');
                    break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Server Error', detail: 'Error', life: 1500});
                    break; 
                default: break;
            }
        }
    },[data,user,existUnreadMessage])
    const onBottomPositionEventHandler = useCallback (async ()=>{
        if(allowOnBottomPositionEvent){
            markRead();
            setAllowOnBottomPositionEvent(false);
        }
    },[allowOnBottomPositionEvent,markRead])
    useEffect(()=>{
            status && scrollRef.current.scrollToBottom();    
    },[status]);
    useEffect(()=>{
        const _prevData = (data) ? [...data.data] : [];
        const _data = _.cloneDeep([...props.data.data]);
        if(_.isEmpty(_prevData) || ((_prevData[_prevData.length-1]._id !== _data[_data.length-1]._id))){
            setStatus(prevStatus => {
                if (!_.isEmpty(_data)){
                    const eq =_data[_data.length-1].user === user._id;                
                    if(prevStatus) { 
                        if(_data.length>0 && (eq || scrollRef.current.isAtTheBottom())){
                                scrollRef.current.scrollToBottom();
                        }                        
                    }
                    if(!_data[_data.length-1].checkedUser.includes(user._id) && !eq) {
                        setExistUnreadMessage(true);
                        setTimeout(()=>setAllowOnBottomPositionEvent(true),[200]);
                    }
                }                
                return props.data.isShow;
            });
        }
        if(props.data !== undefined){            
            const updateData = _.cloneDeep(props.data);
            let usersInfo = {};
            updateData.users.forEach(i=> usersInfo = {...usersInfo,[i._id]:i});
            setUsers(usersInfo);
            setData(updateData);
            // let index =_data.length-1;
            _data.reverse().every(msg => {
                if(msg.user === user._id && msg.checkedUser.length > 1){
                    setLastSeenMessage(msg._id);
                    return false;
                }else if (msg.user !== user._id) {
                    setLastSeenMessage(undefined);
                    return false;
                }
                return true;
            })
            // while (index>=0) {
            //     if(_data[index].user === user._id && _data[index].checkedUser.length>1){                    
            //         setLastSeenMessage(_data[index]._id);
            //         index = -1;
            //     }else index--;
            // }
        }
        return ()=> setAllowOnBottomPositionEvent(false);               
    },[JSON.stringify(props.data)]);
    return (
        <Form onSubmit={onSubmitHandler}>
            {status && <div className='p-col-11' style={{border:'2px solid black',borderRadius:'10px',backgroundColor:'lightblue'}}>
                <div className='p-grid p-justify-end' style={{paddingTop:'0.5rem'}}>
                    <Button icon="pi pi-minus" type='button' onClick={()=>props.onChange(data._id,false)} className="p-button-sm p-button-rounded p-button-info p-col-3 p-mr-1"/>
                    {(props.allowClose === 'true' || props.allowClose === undefined) && <Button icon="pi pi-times" type='button' onClick={() => props.close()} className="p-button-sm p-button-rounded p-button-danger p-col-3 p-mr-1"/>}  
                </div>
                <ScrollPanel style={{ width: '100%',height: '40vh',position:'relative'}}>
                    {existUnreadMessage && scrollRef.current && !scrollRef.current.isAtTheBottom()  && <div style={{position:'sticky',top:'3px',width:'100%',opacity:'0.8',justifyItems:'center',borderRadius:'2px'}}>
                        <Button type='button' style={{backgroundColor:'lightblue',color:'black',width:'105%',fontSize:'70%'}} icon='pi pi-chevron-circle-down' label='New Message' onClick={()=>{scrollRef.current.scrollToBottom({behavior:'smooth'})}}/>
                    </div>}
                    <div style={{ padding: '1em', lineHeight: '1.5'}}>
                        {isLoading && <div className='p-grid p-mt-1 p-mb-1 p-justify-center'>
                            <ProgressSpinner className='p-col-5' style={{width: '35px', height: '35px'}} strokeWidth='6' animationDuration='0.5s'/>
                        </div>}
                        {data && data.data.map((i,index) =>
                            <React.Fragment key={index}>
                                {messageTemplate(i,data.data[index-1])}
                            </React.Fragment>
                        )}   
                    </div>
                <Scroll id={`ref_${data._id}`} ref={scrollRef} onTopPosition={loadMessage} onBottomPosition={onBottomPositionEventHandler}/>
                </ScrollPanel>
                <div className="p-inputgroup">
                    <InputTextarea  spellCheck={false} value={inputText} onChange={onInputTextHandler} onFocus={markRead} style={{borderRadius:'20px'}} rows={1} cols={30} multiple={true} placeholder="..."/>
                    <Button icon='pi pi-send' className="p-button-rounded p-button-lg p-button-info p-button-text" style={{transform:'rotate(45deg)'}}/>
                </div>
            </div>}
            {data && <Button className={`p-col-11 p-mt-2 p-button-rounded ${classNames(existUnreadMessage ? 'p-button-danger':'p-button-info')}`} icon={props.icon} iconPos={props.iconPos}  type='button' label={props.label || data.name || renderMessageInboxLabel(data.users)} onClick={()=>props.onChange(data._id,!status)}>{existUnreadMessage && <Badge severity={'error'} value={'!'}/>}</Button>}
        </Form>
    );
};
export default forwardRef(Message);