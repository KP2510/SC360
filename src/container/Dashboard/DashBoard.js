import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import AppContainer from '../AppContainer';
import { actionType } from '../../shared/actionType';
import * as actions from '../../redux/actions/index';
import Joyride, { STATUS } from 'react-joyride';
import { Typography, Input, Select, Button, Collapse, Tabs, Skeleton, Tooltip, Dropdown, Menu, Affix } from 'antd';
import { DownOutlined, ArrowRightOutlined, LeftOutlined, MoreOutlined, CodepenOutlined, UserOutlined } from '@ant-design/icons';
import OperationalStatus from '../../components/OperationalStatus/OperationalStatus';
import './DashBoard.css';
import CustomTreeTable from '../../components/Dashboard/CustomTreeTable';
import ResponsiveGrid from '../../components/CustomComponents/ResponsiveGrid';
import axiosInstance from '../../utils/axios-instance';
import axios from 'axios';
import Configuration from '../Configuration/Configuration';
import CustomTable from '../../components/Dashboard/CustomTable'
import CardContainer from '../../components/CustomComponents/CardContainer'
import LineChart from '../../components/CustomComponents/LineChart';
import PieChart from '../../components/CustomComponents/PieChart';
import DonutChart from '../../components/CustomComponents/DonutChart';
import BubbleChart from '../../components/CustomComponents/BubbleChart';
import { getValidRoles, getID } from '../../utils/helper';
import UserConfiguration from '../UserConfiguration/UserConfiguration';
import CardView from './CardView';
import Clock from 'react-live-clock';
import { cloneDeep } from 'lodash';
import { constants } from '../../shared/constant';
import BacklogReport from '../../components/Dashboard/BacklogReport/BacklogReport';
import OpenPO from '../../components/Dashboard/OpenPO/OpenPO';
import ProductDashboard from '../ProductDashboard/ProductDashboard';
import TableToolbar from '../../components/Dashboard/TableToolbar';
import MasterFilter from '../../components/Dashboard/MasterFilter/MasterFilter';
import logout from '../../utils/logout';
import { refreshToken, calculateSessionTimeoutSeconds } from '../../utils/loginHelper';

const { Title, Text } = Typography;
const { Search } = Input;
const Option = Select.Option;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const feedNotificationLoad = localStorage.getItem("feedNotification")
!feedNotificationLoad && localStorage.setItem("feedNotification", JSON.stringify({ feedNotification: false }))


const TabsKey = {
    Home: 'home',
    Reports: 'reports',
    Configuration: 'configuration',
    Accounts: 'accounts',
    Dashboard: 'Dashboard',
    Consol: 'consol',
    SKU: 'SKU',
    WWSummary: 'WWSummary'
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            currentState: 'mainPage',
            selectedTab: TabsKey.Home,
            productDashType: 'user',
            steps: [
                {
                    content: <h2>Let's begin our journey!</h2>,
                    locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
                    placement: 'center',
                    target: 'body',
                },
                {
                    content: 'Search Anything!',
                    target: '.ant-input-search',
                },
                {
                    content: 'This is notification',
                    target: '.notification',
                },


                {
                    content: <h2>Find profile, help, settings..</h2>,
                    floaterProps: {
                        disableAnimation: true,
                    },
                    spotlightPadding: 20,
                    target: '.profile',
                },
                {
                    content: 'These are cards with big tables',
                    //placement: 'right',
                    styles: {
                        options: {
                            width: 300,
                        },
                    },
                    target: '.big-card',
                    title: 'BACKLOG REPORTS',
                },
                {
                    content: (
                        <div>
                            These are cards with big tables
                            <br />
                            <h3>No Variant management</h3>
                        </div>
                    ),
                    //placement: 'left',
                    target: '.small-card',
                    title: 'PAST DUE PURCHASE ORDER',
                },
                {
                    content: (
                        <div>
                            <h3>Line Chart</h3>
                        </div>
                    ),
                    //placement: 'right',
                    target: '.line-chart',
                }
            ],
            userList: [],
            userGroupList: [],
            isPanelActive: false
        }
        this.helpers = ""
    }

    handleTabChange = (selectedTab) => {
        this.setState({
            selectedTab
        })
    }

    componentDidMount = () => {
        this.props.userSettingsRequest();
        this.props.gridItemRequest();
        this.props.personaRequest(this.props.userInfo.id);
        this.props.getUsers();
        this.props.getUserGroups();
        this.props.getTableData(this.props.userInfo);
        this.handleIdleTimeout();
        const { cookies, login } = this.props;
        refreshToken(cookies, calculateSessionTimeoutSeconds(cookies), { encryptedUserName: login.userName, encryptedPassword: login.password })
        if (this.props.userInfo.appNotifications && !JSON.parse(localStorage.getItem("feedNotification")).feedNotification && this.props.communication.notification.length === 0) {
            this.props.getNotificationRequest();
        }
        axios.get('./parentChildTable.json')
            .then(response => {
                this.setState({
                    tableData: response.data.table.parent[0]
                });

            })
            .catch(error => (console.log(error)));
        axiosInstance.get(`/myPersona?userID=${this.props.userInfo.id}`)
            .then(response => {
                this.setState({
                    userList: response.data.data
                })
            })
            .catch(error => console.log(error))
        axiosInstance.get(`/userGroupPersona?userID=${this.props.userInfo.id}`)
            .then(response => {
                this.setState({
                    userGroupList: response.data.data
                })
            })
            .catch(error => console.log(error))
    }

    handleIdleTimeout = () => {
        const { cookies } = this.props;
        if (!window.sessionInterval && cookies.get('idleTime')) {
            const IDLE_TIMEOUT = parseInt(cookies.get('idleTime'));
            let _idleSecondsCounter = 0;
            document.onclick = function () {
                _idleSecondsCounter = 0;
            };
            document.onmousemove = function () {
                _idleSecondsCounter = 0;
            };
            document.onkeypress = function () {
                _idleSecondsCounter = 0;
            };
            window.sessionInterval = window.setInterval(CheckIdleTime.bind(this), 1000);

            function CheckIdleTime() {
                _idleSecondsCounter++;
                if (_idleSecondsCounter >= IDLE_TIMEOUT) {
                    logout(this.props, false);
                }
            }
        }
    }

    // Control react-joyride

    getHelpers = (StoreHelpers) => {
        this.helpers = StoreHelpers;
    };

    handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            this.props.dispatch({ type: actionType.RUN_TOUR, payload: false })
        }
    };

    renderCard = (card, render) => {
        const shouldDisplayCard = card && this.shouldDisplayCard(card.cardID)
        return shouldDisplayCard && card.visibility ? render(card) : <div key={getID()} data-grid={{ w: 0, h: 0, x: 0, y: 0, isResizable: false }} style={{ display: 'none' }} ></div>;
    }

    shouldDisplayCard = (cardID) => {
        const { cards } = (this.props.userSettings && this.props.userSettings.dashboards) || {};
        if (cards) {
            let cardData = cards.find(item => item.cardID === cardID);
            return cardData && cardData.visibility;
        }

        return false;
    }

    getTabContent = (selectedTab) => {
        const { responsiveGrid, userSettings, dispatch } = this.props;
        const { gridItemList } = responsiveGrid;
        const gridCardList = (userSettings.dashboards && userSettings.dashboards.cards) || [];
        // console.log("gridItemList", gridItemList);
        // console.log("gridCardList", gridCardList);
        const menu = (cardID) => (
            <Menu>
                <Menu.Item key="0">
                    <button style={{ background: 'none', border: 'none', outline: 'none' }}
                        //onClick={(e) => dispatch({ type: actionType.SHOW_HIDE_REQUEST, payload: { checked: false, cardID } })}
                        onClick={(checked, e) => {
                            const payloadTemp = cloneDeep(this.props.userSettings)
                            const cardArr = payloadTemp.dashboards.cards.map(i => {
                                if (i.cardID === cardID) {
                                    i.visibility = false
                                }
                                return i;
                            });
                            const payload = {
                                cardsVisible: {
                                    cards: cardArr,
                                    layout: {}
                                }
                            }
                            console.log("payload", payload);
                            //props.dispatch({ type: actionType.USER_SETTINGS_UPDATE_DASHBOARD, payload })
                        }}
                    >Hide Card</button>
                </Menu.Item>
            </Menu>
        );

        switch (selectedTab) {
            case TabsKey.Dashboard:
                return <ProductDashboard type={this.state.productDashType} />
            case TabsKey.Configuration:
                return <Configuration />;
            case TabsKey.Accounts:
                return <UserConfiguration />;
            case TabsKey.WWSummary:
                return <div></div>;
            case TabsKey.Shortage:
                return (
                    <div>
                        <div>
                            <CardContainer>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex' }}>
                                        <Title
                                            color="inherit"
                                            level={3}
                                            style={{ marginBottom: 0 }}
                                            display="block">
                                            Standard
                                        </Title>
                                        <Tooltip title="Show Variants" placement="bottom">
                                            <Button
                                                type="ghost"
                                                shape="circle"
                                                style={{ border: 'none', boxShadow: 'none' }}
                                                icon={<DownOutlined />} />
                                        </Tooltip>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10, alignItems: 'flex-end' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Text strong style={{ marginRight: '5px', color: 'black', flexGrow: 1, marginBottom: 5 }}>
                                                    SKU
                                                </Text>
                                                <DownOutlined />
                                            </div>
                                            <Search
                                                placeholder="search"
                                                style={{ width: 300 }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong style={{ color: 'black', marginBottom: 5 }}>Product Series, Product Family</Text>
                                            <Select
                                                style={{ width: '230px' }}
                                                placeholder="Standard"
                                            >
                                                <Option value="Standard">Standard</Option>
                                            </Select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong style={{ color: 'black', marginBottom: 5 }}>Product Family</Text>
                                            <Select
                                                style={{ width: '230px' }}
                                                placeholder="Standard"
                                            >
                                                <Option value="Standard">Standard</Option>
                                            </Select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong style={{ color: 'black', marginBottom: 5 }}>Region</Text>
                                            <Select
                                                style={{ width: '230px' }}
                                                placeholder="EMEA"
                                            >
                                                <Option value="EMEA">EMEA</Option>
                                            </Select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong style={{ color: 'black', marginBottom: 5 }}>Regional Planner</Text>
                                            <Select
                                                style={{ width: '230px' }}
                                                placeholder="EMEA"
                                            >
                                                <Option value="EMEA">EMEA</Option>
                                            </Select>
                                        </div>
                                        <Button type='primary'>GO</Button>
                                    </div>
                                    <div style={{ display: 'flex', marginTop: 20 }}>
                                        <Text style={{ fontWeight: 'bold', borderBottom: '5px solid rgb(237,153,80)', marginRight: 20, padding: 15 }}>All</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Demand</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Inventory</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Shortages</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Unbooked</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>New Orders</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Aging</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Revenue</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Backlog</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Open PO</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Excess</Text>
                                        <Text style={{ fontWeight: 'bold', padding: 15 }}>Obsolescene</Text>
                                    </div>
                                </div>
                            </CardContainer>
                        </div >
                        <div>
                            <CardContainer>
                                {this.state.tableData.length !== 0 ?
                                    <React.Fragment>
                                        <CustomTable data={this.state.tableData} columnDefs={this.state.columnDefs} tableType="general" />
                                        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                            <Button>Export All</Button>
                                            <Button style={{ marginRight: 20 }}>Export View</Button>
                                        </div>
                                    </React.Fragment> :
                                    <div>
                                        <Skeleton active />
                                        <Skeleton active />
                                    </div>
                                }
                            </CardContainer>
                        </div>
                    </div>
                );
            case TabsKey.Consol:
                return <div></div>;
            case TabsKey.SKU:
                return <div></div>;
            case TabsKey.Reports:
                return <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: '20px 0 0 0' }}>
                    <CardView title="Supply Forecast Analysis" coverImage="" />
                    <CardView title="Demand Forecast Analysis" coverImage="" chart={<LineChart height='400' width='800' dataSet={multiLineChartData} />} />
                    <CardView title="Inventory Velocity" coverImage="logistics.jpg" chart={<PieChart height='300' width='800' />} />
                    <CardView title="Outbound Shipment vs PO Receipts" coverImage="./outbound.jpg" />
                    <CardView title="Inbound Shipment vs Open PO" coverImage="inbound.jpg" />
                    <CardView title="Big Deals" coverImage="./bigDeal.png" chart={<DonutChart height='400' width='800' dataSet={donutChartData} />} />
                    <CardView title="Deal Forecast" coverImage="./bigDeal.png" />
                    <CardView title="Global Supply Chain Analysis" coverImage="globalSupplyChainAnalysis.jpg" />
                </div>;
            case TabsKey.Home:
            default:
                return (
                    <React.Fragment>
                        <BacklogReport />
                        <OpenPO />
                        <div>
                            {
                                this.state.currentState === 'mainPage' ?
                                    <div style={{ overflow: 'hidden', margin: '0px 5px 5px 5px', padding: '5px' }}>
                                        {
                                            this.props.tableData && Object.keys(this.props.tableData).length !== 0 &&
                                                gridItemList && gridItemList.length !== 0 &&
                                                gridCardList && gridCardList.length !== 0 ? (
                                                    <ResponsiveGrid>
                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "BACKLOG REPORT")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 8, h: 3, x: 0, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div className="card-title" style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black', flexGrow: 1 }} className="big-card"> BACKLOG REPORT
                                                                        </Text>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-dropdown" style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}> APJ </Text> <DownOutlined style={{ marginRight: '25px' }} />
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}> SUB REGION </Text> <DownOutlined />

                                                                        <div style={{ display: 'flex', width: '80px', alignItems: 'center', marginLeft: '70%' }}>
                                                                            <div style={{ flexDirection: 'column', width: '70%' }}>
                                                                                <Text
                                                                                    onClick={() => this.setState({ currentState: 'moreDetails' })}
                                                                                    style={{
                                                                                        display: 'inlineBlock', marginRight: '5px', color: 'orange', cursor: 'pointer'
                                                                                    }}> More Details </Text>
                                                                            </div>
                                                                            <div style={{ flexDirection: 'column', color: 'orange', width: '30%' }}>
                                                                                <ArrowRightOutlined />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-title">
                                                                        <Text style={{ fontSize: '20px', marginRight: '5px', color: 'black' }}> BACKLOG </Text>
                                                                    </div>
                                                                    <div className="card-dropdown">
                                                                        <Text style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '30px', color: 'black' }}> 34,955 </Text>
                                                                        <Text style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '5px', color: 'black' }}> $89,354,985 </Text>
                                                                    </div>
                                                                </div>
                                                                <CustomTable key='backlog' data={this.props.tableData} users={this.state.userList} userGroup={this.state.userGroupList} tableType="child" cardType="big" persID={constants.BACKLOG} />
                                                            </div>
                                                            )
                                                        })}

                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "SKU SHORT PO VS BACKLOGS")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 4, h: 2.2, minW: 4, minH: 2, x: 8, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-title" style={{ marginBottom: '30px' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}> SKU SHORT PO VS BACKLOGS </Text>

                                                                        <Text style={{ color: 'black', fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5, marginLeft: '2%' }}>Today</Text>
                                                                        <Text style={{ padding: 5 }}>Next 30 Days</Text>
                                                                        <Text style={{ padding: 5 }}>60 Days</Text>

                                                                    </div>
                                                                    <div className="card-dropdown">
                                                                        <Text style={{ fontSize: '30px', color: 'black' }}>
                                                                            <span style={{ fontSize: '30px', marginRight: '5px', fontWeight: 'bold' }}>22</span>
                                                                            <span style={{ fontSize: '20px', color: 'black' }}>POs</span></Text>
                                                                        <Text style={{ fontSize: '30px', color: 'black' }}>
                                                                            <span style={{ fontSize: '30px', marginLeft: '30%', marginRight: '5px', fontWeight: 'bold' }}>2,987</span>
                                                                            <span style={{ fontSize: '20px', color: 'black' }}>BACKLOG QTY</span></Text>
                                                                    </div>
                                                                </div>
                                                                <CustomTable data={this.props.tableData} tableType="child" cardType="small" height={250} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <Text style={{ display: 'inlineBlock', float: 'right', color: 'orange', fontSize: '12px' }}> Details </Text>
                                                                </div>
                                                            </div>
                                                            )
                                                        })}

                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "OPEN PO")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 8, h: 3, x: 0, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}> OPEN PO </Text>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-dropdown" style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}> APJ </Text> <DownOutlined style={{ marginRight: '25px' }} />

                                                                        <div style={{ display: 'flex', width: '80px', alignItems: 'center', marginLeft: '82%' }}>
                                                                            <div style={{ flexDirection: 'column', width: '70%' }}>
                                                                                <Text style={{
                                                                                    display: 'inlineBlock', marginRight: '5px', color: 'orange'
                                                                                }}> More Details </Text>
                                                                            </div>
                                                                            <div style={{ flexDirection: 'column', color: 'orange', width: '30%' }}>
                                                                                <ArrowRightOutlined />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-title">
                                                                        <Text style={{ fontSize: '20px', marginRight: '5px', color: 'black' }}> OPEN POs </Text>
                                                                    </div>
                                                                    <div className="card-dropdown">
                                                                        <Text style={{ fontSize: '30px', marginRight: '30px', color: 'black' }}>
                                                                            <span style={{ fontSize: '30px', marginRight: '5px', fontWeight: 'bold' }}>013</span>
                                                                            <span style={{ fontSize: '20px', color: 'black' }}>POs</span></Text>
                                                                        <Text style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '5px', color: 'black' }}> $534,985 </Text>
                                                                    </div>
                                                                </div>
                                                                <CustomTable key='openpo' data={this.props.tableData} users={this.state.userList} userGroup={this.state.userGroupList} tableType="child" cardType="big" persID={constants.OPEN_PO} />
                                                            </div>
                                                            )
                                                        })}

                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "PAST DUE PURCHASE ORDERS")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 4, h: 2.2, x: 8, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div className="card-title" style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }} className="small-card"> PAST DUE PURCHASE ORDERS</Text>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-dropdown">
                                                                        <Text style={{ color: 'black' }}>
                                                                            <span style={{ fontSize: '30px', marginRight: '5px', fontWeight: 'bold' }}>20</span>
                                                                        </Text>
                                                                        <Text style={{ color: 'black' }}>
                                                                            <span style={{ fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5, marginLeft: '37%' }}>Today</span>
                                                                            <span style={{ padding: 5 }}>Last 7 Days</span>
                                                                            <span style={{ padding: 5 }}>Last 30 Days</span>
                                                                        </Text>

                                                                    </div>
                                                                </div>
                                                                <CustomTable data={this.props.tableData} tableType="child" cardType="small" height={250} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <Text style={{ display: 'inlineBlock', float: 'right', color: 'orange', fontSize: '12px' }}> Details </Text>
                                                                </div>
                                                            </div>
                                                            )
                                                        })}

                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "SHORTAGES")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 8, h: 3, x: 0, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div className="card-title" style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}> SHORTAGES </Text>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-dropdown" style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}> APJ </Text> <DownOutlined style={{ marginRight: '25px' }} />
                                                                        <DownOutlined /><Text style={{ fontWeight: 'bold', marginLeft: '5px', color: 'black' }}> CUSTOMER ORDERS </Text>

                                                                        <div style={{ display: 'flex', width: '80px', alignItems: 'center', marginLeft: '63%' }}>
                                                                            <div style={{ flexDirection: 'column', width: '70%' }}>
                                                                                <Text style={{
                                                                                    display: 'inlineBlock', marginRight: '5px', color: 'orange'
                                                                                }}> More Details </Text>
                                                                            </div>
                                                                            <div style={{ flexDirection: 'column', color: 'orange', width: '30%' }}>
                                                                                <ArrowRightOutlined />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', marginLeft: '71%' }}>
                                                                        <Text style={{ fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5 }}>This Qtr</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+1</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+2</Text>
                                                                        <Text level={4} style={{ padding: 5 }}>Qtr+3</Text>
                                                                    </div>
                                                                    <div className="card-dropdown">
                                                                        <Text style={{ fontSize: '30px', marginRight: '30px', color: 'black' }}>
                                                                            <span style={{ fontSize: '30px', marginRight: '5px', fontWeight: 'bold' }}>345</span>
                                                                            <span style={{ fontSize: '20px', color: 'black' }}>SKUs</span></Text>
                                                                        <Text style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '5px', color: 'black' }}> $34,985</Text>
                                                                    </div>
                                                                </div>
                                                                <CustomTable key='shortages' data={this.props.tableData} users={this.state.userList} userGroup={this.state.userGroupList} tableType="child" cardType="big" persID={constants.SKU} />
                                                            </div>
                                                            )
                                                        })}

                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "OH VS BACKLOG")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 4, h: 2.2, x: 8, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-title" style={{ marginBottom: '30px' }}>
                                                                        <Text style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}> OH VS BACKLOG </Text>

                                                                        <Text style={{ fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5, marginLeft: '22%' }}>Today</Text>
                                                                        <Text style={{ padding: 5 }}>Next 30 Days</Text>
                                                                        <Text style={{ padding: 5 }}>60 Days</Text>

                                                                    </div>
                                                                    <div className="card-dropdown">
                                                                        <Text style={{ fontSize: '30px', color: 'black' }}>
                                                                            <span style={{ fontSize: '30px', marginRight: '5px', fontWeight: 'bold' }}>22</span>
                                                                            <span style={{ fontSize: '20px', color: 'black' }}>SKUs</span></Text>
                                                                    </div>
                                                                </div>
                                                                <CustomTable data={this.props.tableData} tableType="child" cardType="small" height={250} />
                                                                <div style={{ flexDirection: 'column' }}>
                                                                    <Text style={{ display: 'inlineBlock', float: 'right', color: 'orange', fontSize: '12px' }}> Details </Text>
                                                                </div>
                                                            </div>
                                                            )
                                                        })}

                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "REVENUE RISK TREND")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 8, h: 2, x: 0, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-title">
                                                                        <Text style={{ fontWeight: 'bold', marginLeft: '18px', color: 'black' }} className="line-chart"> REVENUE RISK TREND </Text>
                                                                        <Text style={{ fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5, marginLeft: '56%' }}>This Qtr</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+1</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+2</Text>
                                                                        <Text level={4} style={{ padding: 5 }}>Qtr+3</Text>

                                                                    </div>
                                                                </div>
                                                                <LineChart height='300' width='800' dataSet={singleLineChartData} />
                                                            </div>
                                                            )
                                                        })}

                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "GLOBAL SUPPLY PERFORMANCE")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 8, h: 2, x: 0, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-title">
                                                                        <Text style={{ fontWeight: 'bold', marginLeft: '18px', color: 'black' }} className="bubble-chart"> GLOBAL SUPPLY PERFORMANCE </Text>
                                                                        <Text style={{ fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5, marginLeft: '48%' }}>This Qtr</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+1</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+2</Text>
                                                                        <Text level={4} style={{ padding: 5 }}>Qtr+3</Text>

                                                                    </div>
                                                                </div>
                                                                <BubbleChart height='300' width='800' dataSet={bubbleChartData} />
                                                            </div>
                                                            )
                                                        })}
                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "SUPPLIER PERFORMANCE")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 8, h: 2, x: 0, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-title">
                                                                        <Text style={{ fontWeight: 'bold', marginLeft: '18px', color: 'black' }} className="multiLine-chart"> SUPPLIER PERFORMANCE </Text>
                                                                        <Text style={{ fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5, marginLeft: '53%' }}>This Qtr</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+1</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+2</Text>
                                                                        <Text level={4} style={{ padding: 5 }}>Qtr+3</Text>

                                                                    </div>
                                                                </div>
                                                                <LineChart height='300' width='800' dataSet={multiLineChartData} />
                                                            </div>
                                                            )
                                                        })}
                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "GLOBAL DEMAND DISTRIBUTION")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 4, h: 2.2, x: 8, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-title">
                                                                        <Text style={{ fontWeight: 'bold', marginLeft: '18px', color: 'black' }} className="pie-chart"> GLOBAL DEMAND  DISTRIBUTION </Text>
                                                                        <Text style={{ fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5, marginLeft: '50%' }}>This Qtr</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+1</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+2</Text>
                                                                        <Text level={4} style={{ padding: 5 }}>Qtr+3</Text>

                                                                    </div>
                                                                </div>
                                                                <PieChart height='300' width='800' />
                                                            </div>
                                                            )
                                                        })}
                                                        {this.renderCard(gridCardList.filter(i => i.cardName === "GLOBAL VS. LOCAL SUPPLY")[0], (card) => {
                                                            return (<div key={card.cardID} data-grid={{ w: 4, h: 2.2, x: 8, y: 0, isResizable: false }}>
                                                                <div className="cardHeader" style={{ marginBottom: '10px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <Dropdown overlay={menu(card.cardID)}
                                                                            trigger={['hover']} placement="bottomRight">

                                                                            <MoreOutlined style={{ fontSize: 20 }} />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <div className="card-title">
                                                                        <Text style={{ fontWeight: 'bold', marginLeft: '18px', color: 'black' }} className="donut-chart"> GLOBAL VS. LOCAL SUPPLY </Text>
                                                                        <Text style={{ fontWeight: 'bold', borderBottom: '4px solid rgb(237,153,80)', padding: 5, marginLeft: '50%' }}>This Qtr</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+1</Text>
                                                                        <Text style={{ padding: 5 }}>Qtr+2</Text>
                                                                        <Text level={4} style={{ padding: 5 }}>Qtr+3</Text>

                                                                    </div>
                                                                </div>
                                                                <DonutChart height='300' width='800' dataSet={donutChartData} />
                                                            </div>
                                                            )
                                                        })}
                                                    </ResponsiveGrid>
                                                ) :
                                                (
                                                    <div style={{ display: 'flex' }}>
                                                        <Skeleton active style={{ marginRight: 10 }} />
                                                        <Skeleton active /></div>
                                                )
                                        }
                                    </div>
                                    :
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Tooltip title="Back" placement="bottom">
                                                <Button
                                                    ghost={true}
                                                    shape="circle"
                                                    size='large'
                                                    style={{ color: "rgb(237,154,128)" }}
                                                    onClick={() => this.setState({ currentState: 'mainPage' })}
                                                    icon={<LeftOutlined />} />
                                            </Tooltip>
                                            <div style={{ marginLeft: 20 }}>
                                                <Title level={4}>SKU 7078YB</Title>
                                                <Text>HOME / SKU 7078YB / Forecast</Text>
                                            </div>
                                            <CardContainer>
                                                <Collapse
                                                    expandIconPosition={'right'}
                                                    ghost={true}
                                                    defaultActiveKey={["1"]}
                                                >
                                                    <Panel style={{ fontSize: 24 }} header="FORECAST" key="1">
                                                        <CustomTreeTable />
                                                    </Panel>
                                                </Collapse>
                                            </CardContainer>
                                            <CardContainer>
                                                <Collapse
                                                    expandIconPosition={'right'}
                                                    ghost={true}
                                                >
                                                    <Panel style={{ fontSize: 24 }} header="INVENTORY POSITION" key="1">
                                                        <CustomTreeTable />
                                                    </Panel>
                                                </Collapse>
                                            </CardContainer>
                                        </div>
                                    </div>
                            }
                        </div>

                    </React.Fragment >
                )
        }
    }

    render() {
        const { steps, selectedTab, notification } = this.state;
        const { isAdmin, isSupport } = getValidRoles(this.props.userInfo);

        return (
            <AppContainer
                style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'rgb(244,246,250)' }}
            >
                <Joyride
                    callback={this.handleJoyrideCallback}
                    continuous={true}
                    getHelpers={this.getHelpers}
                    run={this.props.joyRide.runTour}
                    scrollToFirstStep={true}
                    showProgress={true}
                    showSkipButton={true}
                    steps={steps}
                    //disableOverlay={true}
                    styles={{
                        options: {
                            zIndex: 10000,
                        },
                    }}
                />
                <Affix offsetTop={41.1}>
                    <div className="Tabs" style={{ backgroundImage: 'url("./headerBackground.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: '100% 94px', position: 'relative' }}>
                        <Tabs defaultActiveKey={TabsKey.Home} onChange={this.handleTabChange}>
                            <TabPane tab="Home" key={TabsKey.Home} className="homeTab">
                                <div style={{ minHeight: this.state.isPanelActive ? '292px' : '122px', width: '100%', background: '#f4f6fa' }}>
                                    <Collapse
                                        accordion={false}
                                        //defaultActiveKey={['1']}
                                        onChange={() => this.setState({ isPanelActive: !this.state.isPanelActive })}
                                        style={{
                                            zIndex: 10,
                                            borderRadius: '5px 0px',
                                            //boxShadow: '2px 2px 10px 2px #f4f6fa',
                                            backgroundColor: 'white',
                                            margin: '0px 0px 10px 0px',
                                        }}>
                                        <Panel header="OPERATIONAL STATUS" key="1">
                                            <OperationalStatus />
                                        </Panel>
                                    </Collapse>
                                    <div className="master-filter" style={{
                                        padding: '10px',
                                        zIndex: 10, borderRadius: '5px', boxShadow: '2px 2px 10px 2px #dcdee2', backgroundColor: 'white'
                                    }}>
                                        <MasterFilter title='MASTER FILTERS' visibility={{ shouldShowRegion: true, shouldShowSubRegion: true, shouldShowGroup: true }} />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="Dashboard" key={TabsKey.Dashboard}>
                                <div style={{ display: 'flex', minHeight: '60px', width: '100%', background: '#f0f2f5', borderRadius: '5px 0px' }}>
                                    <div className="pd-master-filter" style={{
                                        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '10px 10px 0px 10px', boxShadow: '2px 2px 6px 2px #dcdee2', zIndex: 10, borderRadius: '5px', backgroundColor: 'white'
                                    }}>
                                        <TableToolbar
                                            showProductBase={true}
                                            showProductLine={true}
                                            showPartNumber={true}
                                            showRASLine={true}
                                            showSupplier={true}
                                            showDistributionCenter={true}
                                            showViews={true}
                                            showSetting={true} />
                                    </div>
                                    <div style={{
                                        background: 'white',
                                        borderRadius: 5,
                                        marginLeft: 5,
                                        boxShadow: '2px 2px 6px 2px #dcdee2',
                                        padding: '10px 15px 10px 15px'
                                    }}>
                                        <Button
                                            style={{ width: '100%', height: '100%' }}
                                            icon={this.state.productDashType === 'user' ? <UserOutlined /> : <CodepenOutlined />}
                                            onClick={() => this.setState({ productDashType: this.state.productDashType === 'user' ? 'planner' : 'user' })} />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="Shortage Management" key={TabsKey.Consol}>
                                <div style={{ display: 'flex', background: 'white', padding: 10, borderRadius: 5 }}>
                                    <div style={{
                                        display: 'flex',
                                        borderRadius: 5,
                                        zIndex: 10,
                                        flexGrow: 1
                                    }}>
                                        <TableToolbar
                                            showProductBase={true}
                                            showProductLine={true}
                                            showPartNumber={true}
                                            showRASLine={true}
                                            showSupplier={true}
                                            showDistributionCenter={true}
                                            showViews={true}
                                            showSetting={true} />
                                    </div>
                                    <Button>CLEAR ALL</Button>
                                </div>
                            </TabPane>
                            <TabPane tab="SKU" key={TabsKey.SKU}>
                                <div style={{ display: 'flex', background: 'white', padding: 10, borderRadius: 5, alignItems: 'center' }}>
                                    <div style={{
                                        display: 'flex',
                                        borderRadius: 5,
                                        zIndex: 10,
                                        flexGrow: 1
                                    }}>
                                        <Title level={4}>SKU: J17231</Title>
                                    </div>
                                    <Search
                                        placeholder="search for another SKU"
                                        style={{ width: 300, marginRight: 10 }}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab="WW Summary" key={TabsKey.WWSummary}>
                            </TabPane>
                            {(isAdmin || isSupport) && <TabPane tab="Accounts Management" key={TabsKey.Accounts}>
                            </TabPane>}
                            {isAdmin && <TabPane tab="Application Configuration" key={TabsKey.Configuration}>
                            </TabPane>}
                            <TabPane tab="Reports" key={TabsKey.Reports}>
                            </TabPane>
                        </Tabs>
                        <div style={{ color: 'rgb(240,244,246)', position: 'absolute', top: '10px', right: '15px' }}>
                            Last Refreshed: <Clock format={'MMMM Do, YYYY, h:mm A'} />
                        </div>
                    </div>
                </Affix>

                {this.getTabContent(selectedTab)}
            </AppContainer >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        personaData: state.persona && state.persona.personaData,
        userInfo: state.login.userInfo,
        joyRide: state.joyRide,
        responsiveGrid: state.responsiveGrid,
        tableData: state.tableData,
        users: state.users.users,
        userGroups: state.userGroups.userGroups,
        userSettings: state.userSettings,
        communication: state.communication,
        login: state.login
    };
}

const mapDispatchToProps = dispatch => {
    return {
        userSettingsRequest: () => dispatch(actions.userSettingsRequest()),
        getNotificationRequest: () => dispatch(actions.getNotificationRequest()),
        gridItemRequest: () => dispatch(actions.gridItemRequest()),
        personaRequest: (userId) => dispatch(actions.personaRequest({ userId })),
        getUsers: () => dispatch(actions.getUserRequest()),
        getUserGroups: () => dispatch(actions.getUserGroupRequest()),
        getTableData: (userInfo) => dispatch(actions.getTableDataRequest({ userInfo })),
        logout: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Dashboard));


const singleLineChartData = [
    { date: "2020-05-27", type: "DP POR", qty: "283849" },
    { date: "2020-06-27", type: "DP POR", qty: "304571" },
    { date: "2020-07-27", type: "DP POR", qty: "264563" },
    { date: "2020-08-27", type: "DP POR", qty: "225664" },
    { date: "2020-09-27", type: "DP POR", qty: "217383" },
    { date: "2020-10-27", type: "DP POR", qty: "154939" },
    { date: "2020-11-27", type: "DP POR", qty: "183244" },
    { date: "2020-12-27", type: "DP POR", qty: "287633" }
];
const multiLineChartData = [
    { date: "2020-05-27", type: "DP POR", qty: "283849" },
    { date: "2020-05-27", type: "Available", qty: "183849" },
    { date: "2020-06-27", type: "DP POR", qty: "304571" },
    { date: "2020-06-27", type: "Available", qty: "283849" },
    { date: "2020-07-27", type: "DP POR", qty: "264563" },
    { date: "2020-07-27", type: "Available", qty: "223000" },
    { date: "2020-08-27", type: "DP POR", qty: "225664" },
    { date: "2020-08-27", type: "Available", qty: "103849" },
    { date: "2020-09-27", type: "DP POR", qty: "217383" },
    { date: "2020-09-27", type: "Available", qty: "283849" },
    { date: "2020-10-27", type: "DP POR", qty: "154939" },
    { date: "2020-10-27", type: "Available", qty: "283849" },
    { date: "2020-11-27", type: "DP POR", qty: "183244" },
    { date: "2020-11-27", type: "Available", qty: "283849" },
    { date: "2020-12-27", type: "DP POR", qty: "287633" },
    { date: "2020-12-27", type: "Available", qty: "250927" },
];
const donutChartData = [
    { label: "H12RTA", count: 152681 },
    { label: "RT12AS", count: 151554 },
    { label: "TW846T", count: 55633 },
    { label: "QT234E", count: 156653 },
    { label: "IIWE32", count: 126364 },
    { label: "PQ12WD", count: 127453 },
    { label: "IU1234", count: 126363 },
    { label: "JY7228", count: 127158 },
    { label: "R2H28A", count: 122264 },
    { label: "TREWL2", count: 153876 },
    { label: "WE5621", count: 141266 },
    { label: "JJHDG2", count: 153758 }
];
const bubbleChartData = [
    {
        "country": "Afghanistan",
        "continent": "Asia",
        "lifeExp": 43.828,
        "pop": 31889923,
        "gdpPercap": 974.5803384
    },
    {
        "country": "Algeria",
        "continent": "Africa",
        "lifeExp": 72.301,
        "pop": 33333216,
        "gdpPercap": 6223.367465
    },
    {
        "country": "Angola",
        "continent": "Africa",
        "lifeExp": 42.731,
        "pop": 12420476,
        "gdpPercap": 4797.231267
    },
    {
        "country": "Argentina",
        "continent": "Americas",
        "lifeExp": 75.32,
        "pop": 40301927,
        "gdpPercap": 12779.37964
    },
    {
        "country": "Australia",
        "continent": "Oceania",
        "lifeExp": 81.235,
        "pop": 20434176,
        "gdpPercap": 34435.36744
    },
    {
        "country": "Austria",
        "continent": "Europe",
        "lifeExp": 79.829,
        "pop": 8199783,
        "gdpPercap": 36126.4927
    },
    {
        "country": "Bahrain",
        "continent": "Asia",
        "lifeExp": 75.635,
        "pop": 708573,
        "gdpPercap": 29796.04834
    },
    {
        "country": "Bangladesh",
        "continent": "Asia",
        "lifeExp": 64.062,
        "pop": 150448339,
        "gdpPercap": 1391.253792
    },
    {
        "country": "Belgium",
        "continent": "Europe",
        "lifeExp": 79.441,
        "pop": 10392226,
        "gdpPercap": 33692.60508
    },
    {
        "country": "Bosnia and Herzegovina",
        "continent": "Europe",
        "lifeExp": 74.852,
        "pop": 4552198,
        "gdpPercap": 7446.298803
    },
    {
        "country": "Botswana",
        "continent": "Africa",
        "lifeExp": 50.728,
        "pop": 1639131,
        "gdpPercap": 12569.85177
    },
    {
        "country": "Brazil",
        "continent": "Americas",
        "lifeExp": 72.39,
        "pop": 190010647,
        "gdpPercap": 9065.800825
    },
    {
        "country": "Burkina Faso",
        "continent": "Africa",
        "lifeExp": 52.295,
        "pop": 14326203,
        "gdpPercap": 1217.032994
    },
    {
        "country": "Burundi",
        "continent": "Africa",
        "lifeExp": 49.58,
        "pop": 8390505,
        "gdpPercap": 430.0706916
    },
    {
        "country": "Cambodia",
        "continent": "Asia",
        "lifeExp": 59.723,
        "pop": 14131858,
        "gdpPercap": 1713.778686
    },
    {
        "country": "China",
        "continent": "Asia",
        "lifeExp": 72.961,
        "pop": 1318683096,
        "gdpPercap": 4959.114854
    },
    {
        "country": "Colombia",
        "continent": "Americas",
        "lifeExp": 72.889,
        "pop": 44227550,
        "gdpPercap": 7006.580419
    },
    {
        "country": "Comoros",
        "continent": "Africa",
        "lifeExp": 65.152,
        "pop": 710960,
        "gdpPercap": 986.1478792
    },
    {
        "country": "Congo, Rep.",
        "continent": "Africa",
        "lifeExp": 55.322,
        "pop": 3800610,
        "gdpPercap": 3632.557798
    },
    {
        "country": "Costa Rica",
        "continent": "Americas",
        "lifeExp": 78.782,
        "pop": 4133884,
        "gdpPercap": 9645.06142
    },
    {
        "country": "Cote d'Ivoire",
        "continent": "Africa",
        "lifeExp": 48.328,
        "pop": 18013409,
        "gdpPercap": 1544.750112
    },
    {
        "country": "Croatia",
        "continent": "Europe",
        "lifeExp": 75.748,
        "pop": 4493312,
        "gdpPercap": 14619.22272
    },
    {
        "country": "Czech Republic",
        "continent": "Europe",
        "lifeExp": 76.486,
        "pop": 10228744,
        "gdpPercap": 22833.30851
    },
    {
        "country": "Denmark",
        "continent": "Europe",
        "lifeExp": 78.332,
        "pop": 5468120,
        "gdpPercap": 35278.41874
    },
    {
        "country": "Dominican Republic",
        "continent": "Americas",
        "lifeExp": 72.235,
        "pop": 9319622,
        "gdpPercap": 6025.374752
    },
    {
        "country": "Ecuador",
        "continent": "Americas",
        "lifeExp": 74.994,
        "pop": 13755680,
        "gdpPercap": 6873.262326
    },
    {
        "country": "Egypt",
        "continent": "Africa",
        "lifeExp": 71.338,
        "pop": 80264543,
        "gdpPercap": 5581.180998
    },
    {
        "country": "El Salvador",
        "continent": "Americas",
        "lifeExp": 71.878,
        "pop": 6939688,
        "gdpPercap": 5728.353514
    },
    {
        "country": "Equatorial Guinea",
        "continent": "Africa",
        "lifeExp": 51.579,
        "pop": 551201,
        "gdpPercap": 12154.08975
    },
    {
        "country": "Eritrea",
        "continent": "Africa",
        "lifeExp": 58.04,
        "pop": 4906585,
        "gdpPercap": 641.3695236
    },
    {
        "country": "Ethiopia",
        "continent": "Africa",
        "lifeExp": 52.947,
        "pop": 76511887,
        "gdpPercap": 690.8055759
    },
    {
        "country": "Finland",
        "continent": "Europe",
        "lifeExp": 79.313,
        "pop": 5238460,
        "gdpPercap": 33207.0844
    },
    {
        "country": "France",
        "continent": "Europe",
        "lifeExp": 80.657,
        "pop": 61083916,
        "gdpPercap": 30470.0167
    },
    {
        "country": "Gabon",
        "continent": "Africa",
        "lifeExp": 56.735,
        "pop": 1454867,
        "gdpPercap": 13206.48452
    },
    {
        "country": "Gambia",
        "continent": "Africa",
        "lifeExp": 59.448,
        "pop": 1688359,
        "gdpPercap": 752.7497265
    },
    {
        "country": "Germany",
        "continent": "Europe",
        "lifeExp": 79.406,
        "pop": 82400996,
        "gdpPercap": 32170.37442
    },
    {
        "country": "Ghana",
        "continent": "Africa",
        "lifeExp": 60.022,
        "pop": 22873338,
        "gdpPercap": 1327.60891
    },
    {
        "country": "Greece",
        "continent": "Europe",
        "lifeExp": 79.483,
        "pop": 10706290,
        "gdpPercap": 27538.41188
    },
    {
        "country": "Guatemala",
        "continent": "Americas",
        "lifeExp": 70.259,
        "pop": 12572928,
        "gdpPercap": 5186.050003
    },
    {
        "country": "Guinea",
        "continent": "Africa",
        "lifeExp": 56.007,
        "pop": 9947814,
        "gdpPercap": 942.6542111
    },
    {
        "country": "Guinea-Bissau",
        "continent": "Africa",
        "lifeExp": 46.388,
        "pop": 1472041,
        "gdpPercap": 579.231743
    },
    {
        "country": "Haiti",
        "continent": "Americas",
        "lifeExp": 60.916,
        "pop": 8502814,
        "gdpPercap": 1201.637154
    },
    {
        "country": "Honduras",
        "continent": "Americas",
        "lifeExp": 70.198,
        "pop": 7483763,
        "gdpPercap": 3548.330846
    }
]