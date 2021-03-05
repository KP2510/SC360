import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import Stepper from 'react-stepper-horizontal';
import { MentionsInput, Mention } from 'react-mentions';
import { Avatar, Collapse, Tooltip, Steps, Button, Popconfirm, message } from 'antd';
import { ExclamationCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, SendOutlined, LikeFilled, CloseOutlined, CheckCircleFilled, ArrowRightOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axios-instance';
import * as actions from "../../redux/actions/index";
import { constants } from '../../shared/constant';
import Highlighter from "react-highlight-words";

const { Panel } = Collapse;
const { Step } = Steps;

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            panelActive: undefined,
            value: '',
            mentionData: [],
            steps: [{
                title: 'Open'
            }, {
                title: 'In-Progress'
            }, {
                title: 'Closed'
            }],
            disabled: false,
        }
    }

    componentDidMount = () => {
        if (this.props.message.statusAck && this.props.message.statusProgress && this.props.message.statusClosed) {
            this.setState({
                currentStep: 2,
                disabled: true
            })
        } else if (this.props.message.statusAck && this.props.message.statusProgress) {
            this.setState({
                currentStep: 1,
                disabled: false
            })
        } else {
            this.setState({
                currentStep: 0,
                disabled: false
            })
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.message !== this.props.message) {
            if (this.props.message.statusAck && this.props.message.statusProgress && this.props.message.statusClosed) {
                this.setState({
                    currentStep: 2,
                    disabled: true
                })
            } else if (this.props.message.statusAck && this.props.message.statusProgress) {
                this.setState({
                    currentStep: 1,
                    disabled: false
                })
            } else {
                this.setState({
                    currentStep: 0,
                    disabled: false
                })
            }
        }

    }

    //Chat component handling
    textChangeHandler = (event, newValue, newPlainTextValue, mentions) => {
        this.setState({
            value: newValue,
            mentionData: { newValue, newPlainTextValue, mentions }
        });
    }
    sendReply = (e) => {
        const { value, mentionData } = this.state;
        if (value !== "") {
            const mentionList = {
                email: [],
                userGroups: [],
            };
            const tagList = []
            mentionData.mentions && mentionData.mentions.length > 0 &&
                mentionData.mentions.map((mention) =>
                    isNaN(mention.id)
                        ? (mention.id.includes('#') ? tagList.push(mention.display) : mentionList.userGroups.push(mention.display))
                        : mentionList.email.push(mention.display)
                );
            const recipientList = [];
            mentionData.mentions && mentionData.mentions.length > 0 &&
                mentionData.mentions.map((mention) =>
                    //!mention.id.includes('#') && 
                    recipientList.push(mention.display)
                );
            const sendReplyPayload = {
                //child: true,
                commentId: this.props.message.commentId,
                lastReactedBy: this.props.message.lastReactedBy,
                childThread: {
                    time: new Date().toUTCString(),
                    comment: mentionData.newPlainTextValue,
                    //commentedOnId: this.props.message.commentedOnId,
                    mention: mentionList,
                    tags: tagList,
                    recipient: recipientList
                }
            }

            const broadcastReplyPayload = {
                child: true,
                commentId: this.props.message.commentId,
                lastReactedBy: this.props.message.lastReactedBy,
                statusProgress: true,
                childThread: {
                    userName: this.props.userInfo.name,
                    jobRole: this.props.userInfo.jobRole.jobRole,
                    userGroups: this.props.userInfo.userGroupID,
                    time: new Date().toUTCString(),
                    comment: mentionData.newPlainTextValue,
                    commentedOnId: this.props.message.commentedOnId,
                    mention: mentionList,
                    tags: tagList,
                    recipient: recipientList
                }
            };
            this.props.broadcastChild(sendReplyPayload, broadcastReplyPayload)
            this.setState({
                value: '',
                mentionData: [],
                currentStep: 1
            })

            if (this.props.message.statusAck && this.props.message.statusProgress && this.props.message.statusClosed) {
                const payload = {
                    commentId: this.props.message.commentId,
                    statusClosed: false,
                    //statusClosedAt: new Date().toUTCString()
                }
                axiosInstance.post('/comments/childThread', payload)
                    .then(res => {
                        this.setState({ currentStep: 1 })
                    }
                    )
                    .catch(e => console.log("Error:", e))
            }
        } else {
            message.error("Please enter comment to send")
        }

    }


    render() {
        const { steps, currentStep, disabled } = this.state;

        const mergedArr = [...this.props.users, ...this.props.userGroups]
        const mentionData = mergedArr.map(tagItem => ({
            id: tagItem.userID || tagItem.userGroupID,
            display: tagItem.Email ? tagItem.Email : tagItem.userGroupID
        })).sort((a, b) => (a.display.localeCompare(b.display))).filter(e => e.id !== this.props.userInfo.id)

        const mentionDataTag = constants.TAG_LIST.map(tagItem => ({
            id: tagItem,
            display: tagItem
        })).sort()

        // Was the message sent by the current user. If so, add a css class
        //const fromMe = this.props.message.fromMe ? 'from-me' : '';
        const prioritySymbol = (p) => {
            //let case = this.props.message.priority;
            switch (p) {
                case 'LOW':
                    return (<ArrowDownOutlined style={{ height: '15px', width: '15px', color: '#fafafa', borderRadius: '15px', backgroundColor: 'orange', fontSize: '9px', lineHeight: '16px', margin: '0px' }} />);
                case 'MEDIUM':
                    return (<ExclamationCircleOutlined style={{ height: '15px', width: '15px', color: '#fafafa', borderRadius: '15px', backgroundColor: 'orange', fontSize: '9px', lineHeight: '16px', margin: '0px' }} />)
                case 'HIGH':
                    return (<ExclamationCircleOutlined style={{ height: '15px', width: '15px', color: '#fafafa', borderRadius: '15px', backgroundColor: 'red', fontSize: '9px', lineHeight: '16px', margin: '0px' }} />)
                case 'CRITICAL':
                    return (<ArrowUpOutlined
                        style={{ height: '15px', width: '15px', color: '#fafafa', borderRadius: '15px', backgroundColor: 'red', fontSize: '9px', lineHeight: '16px', margin: '0px' }}
                    />)
                default:
                    return null

            }
        }
        return (
            // <div className={`message ${fromMe}`} >
            <div className={`message`} >
                <div className='main-thread' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', padding: '15px 15px 0px 15px' }}>
                    <div className='message-header'>
                        <div className='priority-tags' style={{ display: 'flex' }}>
                            {prioritySymbol(this.props.message.priority)}
                            {this.props.message.tags && this.props.message.tags.map((i, key) => <span key={key} style={{ padding: '0px 4px', margin: '0px 0px 0px 5px', fontSize: '10px', border: '1px solid gray', color: 'gray', borderRadius: '16px' }}>{i} </span>)}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                            <div className='title'>
                                {this.props.message.title}
                            </div>
                            <div className='message-time'>
                                <Moment format={'MMM Do, YYYY, HH:mm'} local>
                                    {this.props.message.time}
                                </Moment>
                            </div>
                        </div>
                        <div className='username'>
                            {this.props.message.userName}, {this.props.message.jobRole} - {this.props.message.userGroups.filter(usergroups => usergroups == "APJ" || usergroups == "AMS" || usergroups == "EMEA" || usergroups == "WW").toString().replace(/[^[]']/gi, '').replace(/[,]/gi, ', ')}
                        </div>
                    </div>

                    <div className='message-body'>
                        {this.props.message.comment}
                    </div>

                    <div className='message-footer' style={{ color: 'orange', paddingBottom: '10px', borderBottom: '1px solid #9c9c9c' }}>
                        {
                            this.props.message.recipient && this.props.message.recipient.map((tagItem, key) => <span key={key}>@{tagItem} </span>)
                        }
                    </div>

                </div>

                <div className="child-thread" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    {
                        <Collapse
                            expandIconPosition={"right"}
                            accordion={true}
                            expandIcon={() => (this.state.panelActive === undefined ? <span className="show-thread">Show Thread <ArrowRightOutlined /></span> : <span className="collapse">Collapse</span>)}
                            onChange={e => this.setState({ panelActive: e })}
                            ghost
                        >
                            <Panel key={this.props.message.commentID}
                                header={this.props.message.childThread.length > 0 ? (`${this.props.message.childThread.length} Responses`) : <div style={{ padding: '8px 16px' }}></div>}>
                                {
                                    this.props.message.childThread && this.props.message.childThread.length !== 0 ? (
                                        <div>
                                            {
                                                this.props.message.childThread.map((item, key) => {
                                                    return (
                                                        <div className='child-thread-item' key={key}>
                                                            <div className='message-header'>
                                                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                                                    <div>
                                                                        <div className='username'>
                                                                            {item.userName}
                                                                        </div>
                                                                        <div className='userdetail'>
                                                                            {item.jobRole} - {item.userGroups.filter(usergroups => usergroups == "APJ" || usergroups == "AMS" || usergroups == "EMEA" || usergroups == "WW").toString().replace(/[^[]']/gi, '').replace(/[,]/gi, ', ')}
                                                                        </div>
                                                                    </div>
                                                                    <div className='message-time'>
                                                                        <Moment format={'MMM Do, YYYY, HH:mm'} local>
                                                                            {item.time}
                                                                        </Moment>
                                                                    </div>
                                                                </div>
                                                                <div className='user-role'>
                                                                    {item.role}
                                                                </div>
                                                            </div>

                                                            <div className='message-body'>
                                                                <Highlighter
                                                                    highlightClassName="YourHighlightClass"
                                                                    searchWords={item.recipient}
                                                                    autoEscape={true}
                                                                    textToHighlight={`${item.comment}`}
                                                                    //highlightStyle={{background: "#8bbce4" }}
                                                                    highlightTag={({ children, highlightIndex }) => (
                                                                        <strong className="highlighted-text" style={{ color: 'orange', paddingBottom: '10px' }}>{children}</strong>
                                                                    )}
                                                                />
                                                            </div>
                                                            <hr />
                                                            <div className='message-footer'>

                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    ) : <div></div>
                                }
                                <div style={{ padding: "5px 0px" }}>{this.props.message.lastReactedBy !== '' ? <span>Last reacted by: {this.props.message.lastReactedBy}</span> : <span>Nobody reacted</span>}</div>

                                <div className="reaction" style={{ display: 'flex', borderTop: '1px solid #9c9c9c', padding: '0px 0px 10px 0px' }}>

                                    <Stepper
                                        steps={steps}
                                        activeStep={currentStep}
                                        activeColor="#1890ff"
                                        completeColor="#06712c"
                                        size={24}
                                        circleFontSize={12}
                                        titleFontSize={12}
                                        circleTop={5}
                                        titleTop={0}
                                    />
                                    {
                                        this.props.userInfo.id === this.props.message.userId ? (
                                            <div className="close-thread">
                                                <Popconfirm placement="topRight"
                                                    title='Are you sure to close this thread?'
                                                    okText="Yes"
                                                    cancelText="No"
                                                    getPopupContainer={() => document.getElementsByClassName("close-thread")[0]}
                                                    onConfirm={(e) => {
                                                        const sendObject = {
                                                            commentedOnId: this.props.communication.selectedRowDetail.product_base,
                                                            persId: this.props.communication.selectedRowDetail.persId,
                                                            time: new Date().toUTCString(),
                                                            statusProgress: true,
                                                            statusClosed: true,
                                                        };
                                                        const payload = {
                                                            commentId: this.props.message.commentId,
                                                            statusClosed: true
                                                        }
                                                        axiosInstance.post('/comments/childThread', payload)
                                                            .then(res => {
                                                                let payload = res.data.data
                                                                //this.props.handleThreadClose(sendObject)
                                                                this.props.addMessageRequest(payload)
                                                            }
                                                            )
                                                            .catch(e => console.log("Error:", e))
                                                    }}
                                                >
                                                    <Tooltip placement="topRight" title="Close thread"
                                                        getPopupContainer={() => document.getElementsByClassName("close-thread")[0]}
                                                    >
                                                        <Button type="primary" shape="circle" icon={<CloseOutlined />} disabled={disabled} style={{ margin: '5px 0px', height: '25px', minWidth: '25px', maxWidth: '25px', fontSize: '12px' }} danger />
                                                    </Tooltip>
                                                </Popconfirm>
                                            </div>
                                        ) : null
                                    }

                                </div>

                                <div style={{ display: 'flex' }}>
                                    <MentionsInput
                                        value={this.state.value}
                                        onChange={this.textChangeHandler}
                                        allowSpaceInQuery={true}
                                        allowSuggestionsAboveCursor={true}
                                        placeholder="Start typing..."
                                        className="mentions"
                                    >
                                        <Mention
                                            type="user"
                                            trigger="@"
                                            data={mentionData}
                                            markup="@{{__display__||__id__}}"
                                            className="mentions__mention"
                                            displayTransform={(id, display) => (display)}
                                        />
                                        <Mention
                                            type="tag"
                                            trigger="#"
                                            data={mentionDataTag}
                                            markup="@{{__display__||__id__}}"
                                            className="mentions__mention"
                                            displayTransform={(id, display) => (display)}
                                        />
                                    </MentionsInput>
                                    <div style={{ height: '45px', width: '35px', padding: '10px 8px', border: '1px solid #d9d9d9', cursor: 'pointer' }} onClick={(e) => this.sendReply(e)} >
                                        <SendOutlined style={{ fontSize: 20 }} />
                                    </div>
                                </div>


                                {/* <Input
                                    size="large"
                                    placeholder="Start typing..."
                                    suffix={<SendOutlined onClick={(e) => this.sendReply(e)} />}
                                /> */}
                            </Panel>
                        </Collapse>
                    }
                </div>

            </div >
        );
    }
}


const mapStateToProps = (state) => {
    return {
        userInfo: state.login.userInfo,
        users: state.users.users,
        userGroups: state.userGroups.userGroups,
        communication: state.communication,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleLockStatus: (payload) => dispatch(actions.toggleLock(payload)),
        clickDropDown: (value) => dispatch(actions.selectDropdown(value)),
        addMessageRequest: (payload) => dispatch(actions.addMessageRequest(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);