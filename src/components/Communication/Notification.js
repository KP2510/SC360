import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';
import { Avatar, Collapse, Input, Radio } from 'antd';
import { ExclamationCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, SendOutlined, LikeFilled, SettingFilled, CheckCircleFilled, ArrowRightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
class Notification extends React.Component {

    render() {
        return (
            <div className="notification" style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid' }}>
                <div className="username" >
                    <b>{this.props.notification.userName}</b> mentioned you on a {!this.props.notification.child ? <span>comment</span> : <span>sub-comment</span>} : <b>{this.props.notification.commentedOnId}</b>
                </div>
                <div className="time" style={{ fontSize: 10 }}>
                    <Moment format={'MMM Do, YYYY, HH:mm'} local>
                        {this.props.notification.time}
                    </Moment>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        communication: state.communication
    };
}

const mapDispatchToProps = dispatch => {
    return {
        //logout: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Notification));