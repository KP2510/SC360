import React from "react";
import { withCookies } from "react-cookie";
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index';
import Avatar from 'react-avatar-edit';
import axiosInstance from '../../utils/axios-instance';
import { actionType } from '../../shared/actionType'
import EdiText from "react-editext";
import { Tabs, Card, Typography, Switch, Avatar as AvatarIcon } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UserSettings.css';
import AppContainer from "../AppContainer";
import { cloneDeep } from 'lodash';
//import { MoreOutlined } from '@ant-design/icons';
//import Icon from '@ant-design/icons';
const { Text, Title } = Typography;

const { TabPane } = Tabs;

//Component for Dashboard tab
const GridCardLayout = (props) => {
    return (
        <Card
            style={{
                width: 150,
                height: 150,
                margin: 10,
                borderRadius: '5px',
                backgroundSize: 'cover',
                backgroundImage: 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(./userSettingsCardBG.png)'
            }}
            bodyStyle={{ padding: '5px' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', margin: '10%' }}>

                {/* <Title style={{ fontSize: 'small', color: 'white', marginTop: '10px' }}>CARD NAME:</Title> */}
                <Text style={{ fontSize: 'small', color: 'white' }}>{props.cardData.cardName}</Text>

                <div style={{ position: 'absolute', bottom: '20px' }}>
                    <Text style={{ fontSize: '10px', color: 'white', marginTop: '20px' }}>SHOW/HIDE:</Text>
                    <Switch
                        id={props.cardData.cardId}
                        checkedChildren="Visible"
                        unCheckedChildren="Hidden"
                        checked={props.cardData.visibility}
                        onChange={(checked, e) => {
                            const payloadTemp = cloneDeep(props.userSettings)
                            const cardArr = payloadTemp.dashboards.cards.map(i => {
                                if (i.cardID === props.cardData.cardID) {
                                    i.visibility = checked
                                }
                                return i;
                            });
                            const payload = {
                                dashboards: {
                                    cards: cardArr,
                                    layout: {}
                                }
                            }
                            props.dispatch({ type: actionType.USER_SETTINGS_UPDATE_DASHBOARD, payload })
                        }}
                        style={{ width: '70%' }} size="small" />
                </div>


                {/* <button style={{ color: 'orange', marginLeft: '70%', background: 'none', padding: 0, cursor: 'pointer', border: 'none' }}>Details</button> */}
            </div>
        </Card>

    )
}

//Component for Account Settings tab
const AccountSettingsForm = (props) => {
    const { emailNotf, appNotifications, businessUpdates } = props.userSettings.accountSettings;
    const { id, firstName, lastName, email, emailNotification, jobRole, sRole } = props.userInfo;

    //const [image, setImage] = React.useState('./building.jpeg')
    //const [preview, setPreview] = React.useState(null)
    // const [editFName, setEditFName] = React.useState(false);
    // const [editLName, setEditLName] = React.useState(false);
    // const [fname, setFName] = React.useState(firstName);
    // const [lname, setLName] = React.useState(lastName);


    // const onClose = () => {
    //     setPreview(null)
    // }

    // const onCrop = (preview) => {
    //     setPreview(preview)
    // }

    // const onBeforeFileLoad = (elem) => {
    //     if (elem.target.files[0].size > 1000000) { //71680
    //         alert("File is too big!");
    //         elem.target.value = "";
    //     };
    // }

    return (
        <Card className="userDetail"
            style={{
                //display:'inline-block',
                width: '500px',
                height: '600px',
                margin: 10,
                borderRadius: '5px',
                backgroundSize: 'cover',
                boxShadow: '4px 4px 12px 2px #d3d4d6',
                //backgroundImage: 'linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) )'
            }}
            bodyStyle={{ padding: '5px' }}>
            <div className='avatarContainer'>
                <AvatarIcon style={{ backgroundColor: '#a7a7a7', margin: '2px 10px 0px 0px' }} icon={<UserOutlined />} size={200} />
                {/* <Avatar
                    image="http://example.com/initialimage.jpg"
                    // image={<AvatarIcon style={{ backgroundColor: '#595959', margin: '2px 10px 0px 0px' }} icon={<UserOutlined />} size={20} />}
                    width={200}
                    height={200}
                    imageWidth={200}
                    imageHeight={200}
                    onCrop={onCrop}
                    onClose={onClose}
                    onBeforeFileLoad={onBeforeFileLoad}
                    //src={image}
                /> */}
                {/* <img src={preview} alt="Preview" /> */}
            </div>
            <div className="infoContainer">
                <div style={{ display: 'flex', margin: '10px' }}>
                    <Text className="label">First Name: </Text>
                    <Text className="formData">{firstName}
                        {/* <EdiText
                            name="fname"
                            value={fname}
                            type="text"
                            onSave={value => setFName(value)}
                            editing={editFName}
                        /> */}
                    </Text>
                </div>
                <div style={{ display: 'flex', margin: '10px' }}>
                    <Text className="label">Last Name: </Text>
                    <Text className="formData"> {lastName}
                        {/* <EdiText
                            name="lname"
                            value={lname}
                            type="text"
                            onSave={value => setLName(value)}
                            editing={editLName}
                        /> */}
                    </Text>
                </div>
                <div style={{ display: 'flex', margin: '10px' }}>
                    <Text className="label">Email: </Text>
                    <Text className="formData">{email}</Text>
                </div>
                <div style={{ display: 'flex', margin: '10px', alignItems: 'center' }}>
                    <Text className="label">Email Notification:</Text>
                    <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={emailNotf}
                        onChange={(checked, e) => {
                            const payload = { emailNotf: checked }
                            props.dispatch({ type: actionType.USER_SETTINGS_UPDATE_ACCOUNT, payload })
                        }
                        }
                        style={{ margin: '5px 0 0 15px' }} size="big" />
                </div>
                <div style={{ display: 'flex', margin: '10px', alignItems: 'center' }}>
                    <Text className="label">App Notification:</Text>
                    <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={appNotifications}
                        onChange={(checked, e) => {
                            const payload = { appNotifications: checked }
                            props.dispatch({ type: actionType.USER_SETTINGS_UPDATE_ACCOUNT, payload })
                        }}
                        style={{ margin: '5px 0 0 15px' }} size="big" />
                </div>
                <div style={{ display: 'flex', margin: '10px', alignItems: 'center' }}>
                    <Text className="label">Business Updates:</Text>
                    <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={businessUpdates}
                        onChange={(checked, e) => {
                            const payload = { businessUpdates: checked }
                            props.dispatch({ type: actionType.USER_SETTINGS_UPDATE_ACCOUNT, payload })
                        }}
                        style={{ margin: '5px 0 0 15px' }} size="big" />
                </div>

            </div>
        </Card>

    )
}


class UserSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false
        }
    }

    componentDidMount = () => {
        //dispatch action if state (gridItemList) is empty
        if (this.props.responsiveGrid.gridItemList.length === 0) {
            this.props.dispatch({ type: actionType.GRID_ITEM_REQUEST })
        }
    }

    render() {
        const gridCard = this.props.userSettings.dashboards && this.props.userSettings.dashboards.cards
        return (
            <AppContainer>
                <div style={{
                    display: 'flex', flexDirection: 'column', height: '100%',
                    //backgroundColor: 'rgb(244,246,250)' 
                }}>
                    <div className="userSetting">
                        <Tabs tabPosition="left">
                            <TabPane tab="Dashboard Settings" key="Dashboard">
                                <div className="cardHolder" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        gridCard && gridCard.map(card => {
                                            return <GridCardLayout key={card.cardID} cardData={card} userSettings={this.props.userSettings} dispatch={this.props.dispatch} />
                                        })
                                    }
                                </div>
                            </TabPane>
                            <TabPane tab="Report Tiles" key="Report Tiles">
                                Report Tiles
                            </TabPane>
                            <TabPane tab="Account Settings" key="Account Settings">
                                {<AccountSettingsForm userInfo={this.props.login.userInfo} userSettings={this.props.userSettings} dispatch={this.props.dispatch} />}

                            </TabPane>
                        </Tabs>
                    </div>
                </div>

            </AppContainer>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        login: state.login,
        users: state.users.users,
        persona: state.persona,
        responsiveGrid: state.responsiveGrid,
        userSettings: state.userSettings,
    })
}

const mapDispatchToProps = dispatch => {
    return {
        userSettingsRequest: () => dispatch(actions.userSettingsRequest()),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(UserSettings));