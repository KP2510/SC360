import React, { useState } from 'react';
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';
import { actionType } from '../shared/actionType';
import * as actions from '../redux/actions/index';
import config from '../config';
import { Input, Modal, Button, Menu, Dropdown, message, Typography, Avatar, Badge } from 'antd';
import { QuestionCircleOutlined, LogoutOutlined, SettingOutlined, FullscreenOutlined, FullscreenExitOutlined, UserOutlined, AppstoreFilled, BellFilled, MessageFilled, ArrowLeftOutlined } from '@ant-design/icons';
import FileViewer from 'react-file-viewer';
import { UndoOutlined } from '@ant-design/icons';
import './HeaderBar.css';
import logout from '../utils/logout';
import Notification from '../components/Communication/Notification';

const { Title } = Typography;

const HeaderBar = (props) => {
    const [aboutModalState, setAboutModalState] = useState(false);
    const [aboutFullScreenModal, setAboutFullScreenModal] = useState(false);
    const [countNotification, setCountNotification] = useState(0);
    const [viewedNotification, setViewedNotification] = useState(0);

    React.useEffect(() => {
        setCountNotification(props.notification.length - viewedNotification)
    }, [props.notification.length])

    const onClickMenuItem = ({ key }) => {
        switch (key) {
            case 'User Settings':
                props.history.push('/userSettings')
                break;
            case 'Escalate the Query':
                message.info(`Click on ${key}`);
                break;
            case 'Help?':
                // props.startTour(key)
                props.dispatch({ type: actionType.RUN_TOUR, payload: true })
                break;
            case 'About':
                setAboutModalState(true);
                break;
            case 'Help documentation':
                message.info(`Click on ${key}`);
                break;
            case 'Logout':
                logout(props, true);
                break;
            default:
                message.info(`Welcome to SC360`);
        }
    };

    const menu = (
        <Menu onClick={onClickMenuItem}>
            <Menu.Item key="UserName">Hello, <span style={{ fontSize: 12 }}><b>{props.login.userInfo.firstName} {props.login.userInfo.lastName}</b></span><hr /></Menu.Item>
            <Menu.Item key="User Settings">User Settings <SettingOutlined spin={false} style={{ fontSize: 15 }} /></Menu.Item>
            <Menu.Item key="Help?">Help <QuestionCircleOutlined style={{ fontSize: 15 }} /></Menu.Item>
            <Menu.Item key="About">About</Menu.Item>
            {/* <Menu.Item key="Help documentation">Help documentation</Menu.Item> */}
            <Menu.Item key="Logout">Logout <LogoutOutlined style={{ fontSize: 15 }} /></Menu.Item>
        </Menu>
    );

    const notificationList = (
        <Menu onClick={() => console.log(`Clicked on notification`)}>
            <Menu.Item><h3>Notification</h3><hr /></Menu.Item>
            {
                props.notification.length !== 0 ? props.notification.sort((a, b) => (b.time.localeCompare(a.time))).map((item, key) => <Menu.Item key={key}><Notification key={item.commentID} notification={item} /></Menu.Item>) : <Menu.Item>No New Notification...</Menu.Item>
            }
        </Menu>
    );

    const aboutModal = <Modal
        width={aboutFullScreenModal ? window.innerWidth : 800}
        style={aboutFullScreenModal ? { top: '0px', paddingBottom: '0px' } : { top: '0px', paddingBottom: '24px' }}
        title={<div style={{ display: 'flex', marginRight: '40px' }}>
            <Title style={{ flex: 8 }} level={4}>About</Title>
            <Button onClick={() => setAboutFullScreenModal(!aboutFullScreenModal)}
                icon={aboutFullScreenModal ? <FullscreenExitOutlined /> : <FullscreenOutlined />}>
            </Button>
        </div>}
        centered={!aboutFullScreenModal}
        visible={aboutModalState}
        footer={null}
        onCancel={() => { setAboutModalState(false); setAboutFullScreenModal(false) }}
    >
        <div className="about-modal-container" style={{ height: aboutFullScreenModal ? (window.innerHeight - 120) + 'px' : '400px' }}>
            <FileViewer
                fileType={'docx'}
                filePath={window.location.origin + '/Brillio_Aruba_About.docx'}
                errorComponent={() => <div>error</div>}
                onError={(e) => console.error('File => ', e)} />
        </div>
    </Modal>;

    return (
        <div className="headerbar" >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src='./flashNew.png' alt='aruba logo' style={{ height: 28, padding: '0px 7px 0px 10px' }} className="logo" />
                <span style={{ fontSize: 17, fontWeight: 'bold', marginRight: 5 }}>SC360°</span>
                {
                    props.history.location.pathname !== "/dashboard" ?
                        (<span style={{ cursor: 'pointer' }} onClick={() => props.history.goBack()}><ArrowLeftOutlined style={{ fontFize: 12 }} />Back</span>) : null
                }

            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>

                <MessageFilled style={{ fontSize: 20, margin: '0px 15px 0px 0px' }}
                    onClick={() => props.toggleCommunication()}
                />

                <span style={{ display: 'inline-block', margin: '5px 15px 0px 0px' }}>
                    <Badge count={countNotification} overflowCount={config.NOTIFICATION_OVERFLOW_COUNT} size="small" style={{ fontSize: '10px', padding: '0px 5px' }}>
                        <Dropdown overlayClassName="notification-dropdown" overlay={notificationList} trigger="click" onVisibleChange={(visible) => {
                            setViewedNotification(countNotification + viewedNotification)
                            setCountNotification(0)
                            localStorage.setItem("feedNotification", JSON.stringify({ feedNotification: true }))
                            localStorage.setItem("logoutFlag", JSON.stringify({ logoutFlag: true }))
                            localStorage.setItem("logoutTime", JSON.stringify({ logoutTime: null }))
                            props.notification.map(item => item.isRead = true)
                        }}
                        >
                            <BellFilled style={{ fontSize: 20 }} />
                        </Dropdown>
                    </Badge>
                </span>

                <Dropdown overlayClassName="profile-dropdown" overlay={menu} trigger="click">
                    {/* <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> */}
                    <Avatar style={{ backgroundColor: '#595959', margin: '2px 10px 0px 0px' }} icon={<UserOutlined />} size={20} />
                </Dropdown>
                {/* <span style={{ fontSize: 15, margin: '0px 15px 0px 0px' }}> Hello, <b>{props.login.userInfo.firstName} {props.login.userInfo.lastName}</b></span> */}
            </div>
            {aboutModal}
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        login: state.login,
        runTour: state.runtour,
        notification: state.communication.notification,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(HeaderBar));