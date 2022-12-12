import React, { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import 'primereact/editor/editor.min.css';
import './Blog.css';
import { isEmpty } from 'lodash';

const Blog = () => {
    const [blog,setBlog] = useState();
    const {_id}=useParams();
    const {blogs,isInitialize} = useSelector(state=>state);
    useEffect(()=>{
        const index = blogs.findIndex(blog=>blog._id === _id);
        if(index > -1) setBlog(blogs[index]);
        window.scrollTo(0,0);   
    },[_id, blogs]);
    const emptyView = ()=>{
        return (
            <div className="blog-detail p-grid p-align-center vertical-container p-justify-center p-mt-3">
                <img src='/noResult.png' alt='noProductFound'/>
            </div>
        );  
    }
    const blogView = ()=>{
        return (
            <div className='p-grid p-col-12 p-jc-center p-mt-2'>
                <img className='p-col-9 p-mb-1' style={{height: '100%'}} src={blog.image} alt='blog_image'/>
                <h3 className='p-col-9 p-grid p-jc-center' style={{marginTop: '10vh'}}>{blog.title}</h3>
                <div className='p-col-9 '>
                    <div className='ql-editor blog_image'>
                        {ReactHtmlParser(blog.content)}
                    </div>
                </div>
                <div className='p-grid p-col-10 p-jc-end'>
                    <h6>Nguồn: {blog.source}</h6>
                </div><br/><br/><br/>
                <div style={{marginLeft: '10vw', wordWrap: 'break-word'}} className='p-col-12'>
                    <h6>Bài viết khác</h6>
                    {blogs.filter(blog=>blog._id !== _id).slice(0,5).map((i,index)=>(
                        <Fragment>
                            <hr style={{height:'0px', visibility:'hidden'}}/>
                            <Link style={{textDecoration: 'none'}} key={index} to={`/blog/${i._id}`} >{i.title}</Link>
                        </Fragment>
                    )
                    )}
                    <hr style={{height:'0px', visibility:'hidden'}}/>
                    <Link to={'/blog'}><h6>Xem thêm...</h6></Link>
                </div>
            </div>
        )
    }
    return (
        <Fragment>
            {(isInitialize && isEmpty(blog))? emptyView() : blogView()}
        </Fragment>
    );
}

const BlogItem = (props) => {
    const _useHistory = useHistory();
    return (
        <div className='blog-detail' style={{cursor: 'pointer'}} onClick={()=>_useHistory.push(`/blog/${props.data._id}`)}>
            <img src={props.data.image} alt='BlogImage' style={{height: '30vh',width: '100%'}}/>
            <h6>{props.data.title}</h6>
        </div>
    );
}

const BlogList = () => {
    const {blogs} = useSelector(state=>state);
    const {isInitialize} = useSelector(state=>state);
    const emptyView = ()=>{
        return (
            <div className="empty-blog p-grid p-align-center vertical-container p-justify-center p-mt-3">
                <img src='/noResult.png' alt='noProductFound'/>
            </div>
        );  
    }
    const blogView = ()=>{
        return (
            <div className='p-grid p-mt-2 p-p-2'>
                {blogs.map((blog,index)=>(
                    <div className='p-col-3' key={index}>
                        <BlogItem data={blog}/>
                    </div>
                ))}
            </div>
        )
    }
    useEffect(()=>{window.scrollTo(0,0);},[])
    return (
        <Fragment>
            {(isInitialize && isEmpty(blogs))? emptyView() : blogView()}
        </Fragment>
    )
};

export {
    Blog,
    BlogItem,
    BlogList
};
