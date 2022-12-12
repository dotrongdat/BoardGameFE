import React from 'react';
import {Route,Redirect,useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {roles as rolesConstant} from '../Constant/CredentialConstant';

const listRoles=[rolesConstant.NO_AUTH,rolesConstant.CUSTOMER,rolesConstant.ADMIN];
const CustomRoute = (props)=>{
    const _useHistory = useHistory();
    let {path,backPath,roles=listRoles,exact} = props;
    let {user} = useSelector(state=>state);
    const isAllow = roles.includes(user.role);
    // if(exact) exact = true;
    // else exact = false;
    return (
        <React.Fragment>
            {!props.status  ?  <Redirect to={_useHistory.location}/> :                      
                        <Route path={path}  exact={exact}>
                            {!isAllow? <Redirect to={backPath}/> : props.children }
                        </Route>}
        </React.Fragment>
    )
}

export default CustomRoute;