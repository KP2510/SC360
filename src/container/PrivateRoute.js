import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';


const PrivateRoute = ({ component: Component, ...rest }) => {
    const [cookies] = useCookies();
    const isCookie = cookies['Authorization'];
    return (
        <Route {...rest} render={props => {
            return (
                isCookie
                    ? <Component {...props} />
                    : <Redirect to={{ pathname: '/'}} />
            )
        }} />
    )
}

export default PrivateRoute;