import React,{forwardRef,useImperativeHandle,useEffect,useState} from 'react';

const Scroll = (props,ref)=>{
    const [element,setElement] = useState();
    const [oldScrollHeight,setOldScrollHeight] = useState();
    const scrollToBottom = (options)=>{
        const pEle = document.querySelector(`#${props.id}`).parentElement;
        setTimeout(()=>{
            pEle.scroll({top:1000000,behavior:options.behavior});
        }) 
    };
    const checkAtTheBottom = ()=>{
        const pEle = document.querySelector(`#${props.id}`).parentElement;
        return (pEle.scrollHeight - pEle.scrollTop) <= (pEle.clientHeight+20);
    }
    useImperativeHandle(ref,()=>({
        scrollToBottom : (options={behavior:'auto'}) => scrollToBottom(options),
        isAtTheBottom : ()=> checkAtTheBottom()
    }));
    useEffect(()=>{
        const parentElement = (element) ? element.parentElement : {};
        const fn = (e)=>{
            if(e.target.scrollTop === 0) {
                setOldScrollHeight(e.target.scrollHeight);
                props.onTopPosition();
            }
        }
        if(oldScrollHeight !== undefined && parentElement.scrollHeight > oldScrollHeight){
            const top = parentElement.scrollHeight - oldScrollHeight;
            parentElement.scroll({top:top,behavior:'auto'});
            setOldScrollHeight(undefined);
        }
        if(element) {
            parentElement.addEventListener('scroll',fn,true);
        }
        return () =>{
            if(element) {
                parentElement.removeEventListener('scroll',fn,true);
            }
        }
    },[element,oldScrollHeight,props.onTopPosition]);
    useEffect(()=>{
        const parentElement = (element) ? element.parentElement : {};
        const fn = (e)=>{
            if(e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight) {
                //setOldScrollHeight(e.target.scrollHeight);
                props.onBottomPosition();
            }
        }
        if(element) {
            parentElement.addEventListener('scroll',fn,true);
        }
        return () =>{
            if(element) {
                parentElement.removeEventListener('scroll',fn,true);
            }
        }
    },[element,props.onBottomPosition])
    useEffect(()=>{
        setElement(document.querySelector(`#${props.id}`));
    },[])
    return <div id={props.id}></div>
}
export default forwardRef(Scroll);
