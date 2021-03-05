import React from 'react';
import { connect } from 'react-redux';
import { MentionsInput, Mention } from 'react-mentions';
import { Input, Tooltip, Button, Tag, Radio, Avatar, message, Popover } from 'antd';
import { ExclamationCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axios from '../../utils/axios-instance';
import { cloneDeep } from 'lodash';
import { constants } from '../../shared/constant';

//const tagList = ['#general', '#cancelbacklog', '#escalate', '#excess', '#forecast', '#rebalance', '#requestForInformation', '#ringfence', '#shortage-raisePO', '#shortage-repackageBTS', '#shortage-reconfigureLM']

class NewThread extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            comment: '',
            priority: 'LOW',
            value: '',
            mentionData: [],
            tags: ['#general'],
            tagListPopoverOpen: false
        };

    }

    //Chat component handling
    textChangeHandler = (event, newValue, newPlainTextValue, mentions) => {
        this.setState({
            value: newValue,
            mentionData: { newValue, newPlainTextValue, mentions }
        });
    }

    createHandler = (event) => {
        // Stop the form from refreshing the page on submit
        event.preventDefault();
        const { tags, title, comment, priority, mentionData } = this.state
        const messageObj = { tags, title, comment, priority, mentionData }

        // this.props.closeNewThreadDrawer()
        // this.props.submitHandler(messageObj, this.props)

        if (Object.keys(this.props.communication.selectedRowDetail).length !== 0) {
            this.props.closeNewThreadDrawer()
            this.props.submitHandler(messageObj, this.props)
            this.setState({
                title: '',
                comment: '',
                priority: 'LOW',
                value: '',
                mentionData: [],
            })
        } else {
            message.error('Please select a SKU to proceed');
        }

    }

    //Taglist popover handle
    hide = () => {
        this.setState({
            tagListPopoverOpen: false,
        });
    };

    handleVisibleChange = visible => {
        this.setState({ tagListPopoverOpen: visible });
    };

    tagOnClick = (e) => {
        this.setState({ tags: [...this.state.tags, e.target.innerText] })
        this.hide()
    }

    removeTag = (e, tag) => {
        const modifiedTaglist = cloneDeep(this.state.tags).filter(i => i !== tag)
        this.setState({ tags: modifiedTaglist })
    }

    render() {
        const { tags, title, comment, priority, tagListPopoverOpen } = this.state;
        const contentPopover = (
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '110px', height: 'auto', overflowY: 'auto' }}>
                {constants.TAG_LIST.filter(f => !tags.includes(f)).map((tag, key) => <div key={key} style={{ cursor: 'pointer' }} onClick={e => this.tagOnClick(e)}>{tag}</div>)}
            </div>
        );

        const mergedArr = [...this.props.users, ...this.props.userGroups]
        const mentionData = mergedArr.map(tagItem => ({
            id: tagItem.userID || tagItem.userGroupID,
            display: tagItem.Email ? tagItem.Email : tagItem.userGroupID
        })).sort((a, b) => (a.display.localeCompare(b.display))).filter(e => e.id !== this.props.userInfo.id)

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <form action='#' id='thread-form' style={{ padding: '5px', marginBottom: '15px' }}>
                    <Input.Group compact >
                        <div style={{ margin: '0px 0px 10px 0px' }}>
                            {
                                tags.length > 0 && tags.map((tag, key) => <Tag key={key} style={{ borderRadius: '16px', margin: '2px' }}>{tag}<span onClick={(e) => this.removeTag(e, tag)} style={{ fontSize: 10, margin: '0px 0px 0px 5px' }} ><CloseOutlined /></span></Tag>)
                            }
                            <Popover
                                content={contentPopover}
                                //title="Tag List"
                                trigger="click"
                                placement="bottomRight"
                                visible={tagListPopoverOpen}
                                onVisibleChange={this.handleVisibleChange}
                            >
                                <Tag className="site-tag-plus">
                                    <PlusOutlined className="add-tag-icon" /> New Tag
                                </Tag>
                            </Popover>
                        </div>
                        <Input
                            placeholder="Title"
                            maxLength={200}
                            style={{ border: '2px solid #d9d9d9', margin: '0px 0px 10px 0px', height: '30px' }}
                            value={title} onChange={(e) => this.setState({ title: e.target.value })}
                        />
                        {title.length > 199 ? (<div style={{ color: 'red', fontSize: '10px' }}>You've reached maximum character limit of 200</div>) : null}
                        <Input.TextArea
                            placeholder="Start typing..."
                            maxLength={1000}
                            style={{ border: '2px solid #d9d9d9', margin: '0px 0px 10px 0px', height: 80 }}
                            value={comment} onChange={(e) => this.setState({ comment: e.target.value })}
                        />
                        {comment.length > 999 ? (<div style={{ color: 'red', fontSize: '10px' }}>You've reached maximum character limit of 1000</div>) : null}
                        <MentionsInput
                            value={this.state.value}
                            onChange={this.textChangeHandler}
                            allowSpaceInQuery={true}
                            allowSuggestionsAboveCursor={true}
                            placeholder="Recipient"
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
                        </MentionsInput>
                        <div style={{ width: '100%', margin: '0px 0px 10px 0px', display: 'flex' }}>
                            <div className="priority" style={{ width: '100%', display: 'flex', height: '30px', border: '2px solid rgb(217, 217, 217)', zIndex: 0 }}>
                                <div style={{ padding: '0px 6px', marginRight: '20px' }}>Priority</div>
                                <Radio.Group value={priority} onChange={(e) => {
                                    this.setState({ priority: e.target.value })
                                }} optionType="button" buttonStyle="solid" >
                                    <Tooltip placement="top" title="Low" getPopupContainer={() => document.getElementsByClassName("priority")[0]} >
                                        <Radio.Button value="LOW">
                                            <ArrowDownOutlined style={{ height: '15px', width: '15px', color: '#fafafa', borderRadius: '15px', backgroundColor: 'orange', fontSize: '9px', lineHeight: '16px', margin: '0px' }} />
                                        </Radio.Button>
                                    </Tooltip>
                                    <Tooltip placement="top" title="Medium" getPopupContainer={() => document.getElementsByClassName("priority")[0]} >
                                        <Radio.Button value="MEDIUM">
                                            <ExclamationCircleOutlined style={{ height: '15px', width: '15px', color: '#fafafa', borderRadius: '15px', backgroundColor: 'orange', fontSize: '9px', lineHeight: '16px', margin: '0px' }} />
                                        </Radio.Button>
                                    </Tooltip>
                                    <Tooltip placement="top" title="High" getPopupContainer={() => document.getElementsByClassName("priority")[0]}>
                                        <Radio.Button value="HIGH">
                                            <ExclamationCircleOutlined style={{ height: '15px', width: '15px', color: '#fafafa', borderRadius: '15px', backgroundColor: 'red', fontSize: '9px', lineHeight: '16px', margin: '0px' }} />
                                        </Radio.Button>
                                    </Tooltip>
                                    <Tooltip placement="top" title="Critical" getPopupContainer={() => document.getElementsByClassName("priority")[0]}>
                                        <Radio.Button value="CRITICAL">
                                            <ArrowUpOutlined
                                                style={{ height: '15px', width: '15px', color: '#fafafa', borderRadius: '15px', backgroundColor: 'red', fontSize: '9px', lineHeight: '16px', margin: '0px' }}
                                            />
                                        </Radio.Button>
                                    </Tooltip>
                                </Radio.Group>

                            </div>
                            <Button onClick={this.createHandler} users={this.state.users} style={{ padding: '5px', margin: '0px 0px 0px 5px', background: '#eb8125', color: 'white', width: '32%', height: '30px', fontSize: '12px' }}>CREATE</Button>
                        </div>

                    </Input.Group>
                    {/* <SendOutlined onClick={this.submitHandler} style={{ fontSize: '30px' }} /> */}
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.login.userInfo,
        users: state.users.users,
        userGroups: state.userGroups.userGroups,
        communication: state.communication
    }
}

export default connect(mapStateToProps)(NewThread);