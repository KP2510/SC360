import React from 'react';
import Auxilary from './Auxilary';
import Modal from '../components/UI/Modal/Modal';
import { withCookies } from 'react-cookie';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import * as actions from '../redux/actions/index';
import logout from '../utils/logout';
import axiosInstance from '../utils/axios-instance';
export const history = createBrowserHistory();

class withErrorHandler extends React.Component {
    state = {
        error: null
    };

    componentDidMount() {
        const { cookies } = this.props;

        axiosInstance.interceptors.request.use(async request => {
            this.setState({
                error: null
            })
            if (cookies.get('Authorization')) {
                request.headers['Authorization'] = `Bearer ${cookies.get('Authorization')}`;
                request.headers['x-api-key'] = cookies.get('x-api-key');
                return request;
            } 
        })
        axiosInstance.interceptors.response.use(res => res, error => {
            this.setState({
                error: error
            })
            return Promise.reject(error);
        })
    };

    errorConfirmedHandler = () => {
        if (this.state.error && this.state.error.response && this.state.error.response.status === 401) {
            logout(this.props, false);
        }
        this.setState({
            error: null
        })
    }

    render() {
        return (
            <Auxilary>
                <Modal
                    show={this.state.error}
                    modalClosed={this.errorConfirmedHandler}>
                    {
                        this.state.error && this.state.error.response ?
                            (this.state.error.response.data.message ? this.state.error.response.data.message : this.state.error.message)
                            : null
                    }
                </Modal>
            </Auxilary>
        )
    }
}

const mapStateToProps = (state) => {
    return { login: state.login };
}
const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(withErrorHandler));