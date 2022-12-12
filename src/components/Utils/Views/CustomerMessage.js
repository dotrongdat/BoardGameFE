import React, { useCallback, useEffect, useRef, useState } from 'react';
import messageService from '../../../service/message.service';
import Message from './Message';
import statusCode from 'http-status-codes';
import { useSelector } from 'react-redux';

const CustomerMessage = () => {
    const {user} = useSelector(state=>state);
    const messageRef = useRef();
    const [data,setData] = useState(
        {
            _id: global.admin._id,
            users:[global.admin, user],
            data : [],
            isEmptyMessageInbox: true,
            status : false,
            isShow : false,
            total : 0
        }
    );
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
                setData(prevData=>{
                    prevData.data = message.data.concat(prevData.data);
                    return prevData;
                })
                break;
            default:
                break;
        }
    },[]);
    const addNewMessage = (message)=>{
        setData(prevData => {
            let updateData = {...message};
            updateData.data = prevData.data.concat(updateData.data[0]);
            updateData.isShow = true;
            updateData.status = true;
            updateData.total = 1;
            return updateData;
        })
    };
    const checkedUser = (userId) => {
        setData(prevData => {
            let updateData = {...prevData};
            const {length} = updateData.data;
            updateData.data[length-1].checkedUser.push(userId);
            return updateData;
        })
    }
    useEffect(()=>{
        const initializeMessage = async () => {
            const res = await messageService.getByUserId({userId: global.admin._id});
            switch (res.status){
                case statusCode.OK:
                    const {message,total} = res.data.payload;
                    if(message) setData({...message,status:false,isShow:false,total});
                    break;
                default:
            }
        }
        global.socket.on('message',(message)=>{
            addNewMessage(message);           
        });
        global.socket.on('checkedUser',({messageId,userId})=>{
            checkedUser(userId);     
        })
        initializeMessage();
        return ()=>{
            global.socket.off('message');
            global.socket.off('checkedUser');
        }
    },[]);
    return (
        <div style={{width:'20vw',minWidth:'20rem',position:'fixed',bottom:'1vh',right:'0px'}}>
            <Message 
                allowClose={false} ref={messageRef} data={data} 
                onChange = {(_id,status)=> {status ? messageRef.current.show() : messageRef.current.hide()}} 
                onLoad = {onLoadHistoryMessageData}
                icon='pi pi-comments' 
                iconPos={'left'}
                label='Chat cùng Navita' 
            />                                
        </div>
    )
}

export default CustomerMessage;