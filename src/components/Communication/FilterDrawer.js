import React from 'react';
import * as actions from '../../redux/actions/index';
import moment from 'moment';
import { MentionsInput, Mention } from 'react-mentions';

import { connect } from 'react-redux';
import { Tabs, Checkbox, Input, DatePicker, Button, message } from 'antd';
import axios from '../../utils/axios-instance';
import { constants } from '../../shared/constant';
import config from '../../config';

const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;

class FilterDrawer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedListTag: [],
            checkedListGroup: [],
            groupOptions: [],
            indeterminateTag: true,
            checkAllTag: false,
            value: '',       //mentionbox value
            mentionData: [], //tagged user in mentionbox 
            emails: [],
            startDate: "",
            endDate: "",
            text: "",

        }
    }


    componentDidMount = () => {
        const groupOption = this.props.userGroups.map(item => item.userGroupID)
        this.setState({ groupOption, })
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { checkedListTag, checkedListGroup, userName, startDate, endDate, text } = this.state
        const currentFilters = { checkedListTag, checkedListGroup, userName, startDate, endDate, text }

        if (prevProps.masterFilter.region !== this.props.masterFilter.region) {
            const checkedGroup = checkedListGroup.filter(value => !["AMS", "APJ", "EMEA", "WW"].includes(value));
            checkedGroup.push(this.props.masterFilter.region)
            this.setState({ checkedListGroup: checkedGroup }, () => {
                this.handleApply()
            })
        }

        // if (prevState !== this.state && currentFilters !== this.props.communication.filterDrawer) {
        //     this.props.addFilters(currentFilters)
        // }
    }

    textChangeHandler = (event, newValue, newPlainTextValue, mentions) => {
        let taggedUser = []
        mentions.length && mentions.map((mention) => taggedUser.push(mention.display))
        this.setState({
            value: newValue,
            mentionData: { newValue, newPlainTextValue, mentions },
            emails: taggedUser
        });
    }

    // onCheckAllTagChange = e => {
    //     this.setState({
    //         checkedListTag: e.target.checked ? this.state.tagOption : [],
    //         indeterminateTag: false,
    //         checkAllTag: e.target.checked,
    //     });
    // };

    onTagChange = checkedListTag => {
        this.setState({
            checkedListTag,
            indeterminateTag: !!checkedListTag.length && checkedListTag.length < constants.TAG_LIST.length,
            checkAllTag: checkedListTag.length === constants.TAG_LIST.length,
        });
    };

    onGroupChange = checkedListGroup => {
        this.setState({ checkedListGroup });
    };

    onChangeStartDate = (date, dateString) => {
        let startDate = ""
        if (date !== null) {
            startDate = new Date(date._d)
            startDate.setUTCHours(0)
            startDate.setUTCMinutes(0)
            startDate.setUTCSeconds(0)
            startDate = startDate.toUTCString()
        } else {
            startDate = ""
        }
        this.setState({ startDate })
    }

    onChangeEndDate = (date, dateString) => {
        let endDate = ""
        if (date !== null) {
            endDate = new Date(date._d)
            endDate.setUTCHours(23)
            endDate.setUTCMinutes(59)
            endDate.setUTCSeconds(59)
            endDate = endDate.toUTCString()
        } else {
            endDate = ""
        }
        this.setState({ endDate })
    }

    disabledDateStart = (current) => {
        // Can not select days before 18 months and after today
        return (moment().subtract(18, "months") >= current || moment().endOf('day') <= current);
    }

    disabledDateEnd = (current) => {
        // Can not select days before 18 months and after today
        return (moment().subtract(18, "months") >= current || moment().endOf('day') <= current);
    }

    handleReset = () => {
        this.setState({
            checkedListTag: [],
            checkedListGroup: [],
            indeterminateTag: true,
            checkAllTag: false,
            emails: "",
            startDate: "",
            endDate: "",
            text: "",
            value: ""
        })
        // const payload = { productLine: "", region: "", planner: "" }
        // this.props.addDropdownRequest(payload)
        const { checkedListTag, checkedListGroup, emails, startDate, endDate, text } = this.state
        const currentFilters = { checkedListTag, checkedListGroup, emails, startDate, endDate, text }
        this.props.addFilters(currentFilters)
    }

    handleApply = () => {
        const { checkedListTag, checkedListGroup, emails, startDate, endDate, text } = this.state
        const currentFilters = { checkedListTag, checkedListGroup, emails, startDate, endDate, text }
        this.props.addFilters(currentFilters)
        const payload = {
            "pageNo": "1",
            "perPage": `${config.MESSAGE_PER_PAGE}`,
            "persId": "",
            "commentedOnId": this.props.communication.selectedRowDetail.product_base || "",
            "text": text,
            "tags": checkedListTag,
            "priority": "",
            "userGroups": checkedListGroup,
            "emails": emails,
            "endDate": endDate,
            "startDate": startDate,
        }

        if (Object.keys(this.props.communication.selectedRowDetail).length) {
            this.props.searchMessageRequest(payload)
            this.props.closeFilterDrawer()
        } else {
            message.error('Please select a SKU to proceed');
        }

    }

    render() {
        const mentionData = this.props.users.map(tagItem => ({
            id: tagItem.userID,
            display: tagItem.Email
        })).sort((a, b) => (a.display.localeCompare(b.display)))

        const { checkedListTag, groupOption, checkedListGroup, text } = this.state
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ overflowY: "auto", height: "210px", borderBottom: "1px solid #d0d0d0" }}>
                    <Tabs tabPosition="left">
                        <TabPane tab="Tags" key="tags">
                            <div style={{ justifyContent: 'center', display: 'flex', color: 'black', fontWeight: 'bold', marginBottom: '10px' }}>Tags</div>
                            {/* <div className="site-checkbox-all-wrapper">
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllTagChange}
                                checked={this.state.checkAll}
                            >
                                Check all
                            </Checkbox>
                        </div> */}
                            <div >
                                <CheckboxGroup
                                    options={constants.TAG_LIST}
                                    value={checkedListTag}
                                    onChange={this.onTagChange}
                                    style={{ display: 'flex', flexDirection: 'column', wordBreak: 'break-all' }}
                                />
                            </div>

                        </TabPane>

                        <TabPane tab="Groups" key="groups">
                            <div style={{ justifyContent: 'center', display: 'flex', color: 'black', fontWeight: 'bold', marginBottom: '10px' }}>Tagged Groups</div>
                            <div >
                                <CheckboxGroup
                                    options={groupOption}
                                    value={checkedListGroup}
                                    onChange={this.onGroupChange}
                                    style={{ display: 'flex', flexDirection: 'column', wordBreak: 'break-all' }}
                                />
                            </div>
                        </TabPane>

                        <TabPane tab="Users" key="users">
                            <div style={{ justifyContent: 'center', display: 'flex', color: 'black', fontWeight: 'bold', marginBottom: '10px' }}>Tagged Users</div>
                            <div style={{ marginTop: '10px' }}>
                                <MentionsInput
                                    value={this.state.value}
                                    onChange={this.textChangeHandler}
                                    allowSpaceInQuery={true}
                                    allowSuggestionsAboveCursor={true}
                                    placeholder="search by @email..."
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
                            </div>
                        </TabPane>

                        <TabPane tab="Date" key="date">
                            <div style={{ justifyContent: 'center', display: 'flex', color: 'black', fontWeight: 'bold', marginBottom: '10px' }}>Comment Date Range</div>
                            <div className="datepicker-range" style={{ marginTop: '10px' }}>
                                <DatePicker
                                    placeholder="select start date"
                                    format="DD-MM-YYYY"
                                    disabledDate={this.disabledDateStart}
                                    onChange={this.onChangeStartDate}
                                />
                                <DatePicker
                                    placeholder="select end date"
                                    format="DD-MM-YYYY"
                                    disabledDate={this.disabledDateEnd}
                                    onChange={this.onChangeEndDate}
                                />
                            </div>
                        </TabPane>

                        <TabPane tab="Comment Search" key="commentSearch">
                            <div style={{ justifyContent: 'center', display: 'flex', color: 'black', fontWeight: 'bold', marginBottom: '10px' }}>Comments and Descriptons</div>
                            <div style={{ marginTop: '10px' }}>
                                <Input
                                    placeholder="search text..."
                                    value={text}
                                    onChange={e => this.setState({ text: e.target.value })}
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}            >
                    <Button type="primary" style={{ background: "white", color: "#eb8125", border: "1px solid #eb8125", margin: "0px 5px 0px 0px", }} onClick={this.handleReset}>Reset</Button>

                    <Button type="primary" style={{ background: "#eb8125", color: "white", border: "none" }} onClick={this.handleApply}> Apply </Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.login.userInfo,
        users: state.users.users,
        userGroups: state.userGroups.userGroups,
        communication: state.communication,
        masterFilter: state.masterFilter
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addDropdownRequest: (payload) => dispatch(actions.addDropdownRequest(payload)),
        searchMessageRequest: (payload) => dispatch(actions.searchMessageRequest(payload, true)),
        addFilters: (payload) => dispatch(actions.addFilters(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterDrawer);