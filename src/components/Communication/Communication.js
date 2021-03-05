import React from "react";
import { withCookies } from 'react-cookie';
import { connect } from "react-redux";
import * as actions from "../../redux/actions/index";
import { Input, Select, Tabs, Drawer, Button, message, Modal } from "antd";
import { LockFilled, UnlockFilled, FilterOutlined } from "@ant-design/icons";
import Messages from "./Messages";
import FilterDrawer from "./FilterDrawer";
import NewThread from "./NewThread";
import "./Communication.css";
import axios from "../../utils/axios-instance";
import { websocket, closeSocket } from '../../utils/websocket';

const { TabPane } = Tabs;
const { Option } = Select;


class Communication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleNewThreadDrawer: false,
      visibleFilterDrawer: false
    }
    this.ws = null
    this.ws = websocket(this.handleOnConnect, this.handleReceivedMessage)
  }


  handleOnConnect = (e) => {
    if (this.ws && this.ws !== null) {
      this.ws.json({
        action: "onConnect",
        message: {
          authorization: {
            "x-api-key": this.props.allCookies["x-api-key"],
            token: `Bearer ${this.props.allCookies.Authorization}`,
          },
          //data: { "pageNo": "3", "perPage": "1" },
        },
      });
    }

  };

  handleReceivedMessage = e => {
    if (e !== "undefined" && typeof (JSON.parse(e.data)) === "object" && JSON.parse(e.data).data && JSON.parse(e.data).data.results) {
      const getData = JSON.parse(e.data).data.results;
      let getDataObj = {};
      getDataObj = Object.keys(getData).includes("child") ? getData.childThread : getData
      if (Object.keys(getData).includes("child")) {
        getDataObj.child = true
      }
      if (Object.keys(this.props.communication.selectedRowDetail).length &&
        this.props.communication.selectedRowDetail.product_base == getDataObj.commentedOnId) {

        this.props.addMessageRequest(getData)
      }

      if (typeof (getData) === "object" && !Array.isArray(getData)) {
        //Check if one of mentioned emails or mentioned userGroups match with user's email/userGroup(s)
        const matchEmail = getDataObj.mention.email.some(item =>
          [this.props.userInfo.email].includes(item)
        );
        const matchUserGroups = getDataObj.mention.userGroups.some(item =>
          this.props.userInfo.userGroupID.includes(item)
        );

        if (matchEmail || matchUserGroups && this.props.userInfo.appNotifications) {

          this.props.addNotificationRequest(getDataObj);
          if (getDataObj.time !== null && JSON.parse(localStorage.getItem("logoutTime")).logoutTime === null) {
            localStorage.setItem("logoutTime", JSON.stringify({ logoutTime: new Date(getDataObj.time).toUTCString() }))
          }
        }
        if (!getData.broadcast) {
          this.emailNotifyUsers(getDataObj);
        }
        //For broadcasting parent thread
        if (!getData.child && !getData.broadcast) {
          getData.broadcast = true;
          this.ws.json({
            action: "messageBroadcaster",
            message: getData
          });
        }
        this.props.addLastMessageRequest(getData)

      }
    } else {
      const error = JSON.parse(e.data).data || JSON.parse(e.data).message
      console.log("Into outer else::", error);
    }
  };

  emailNotifyUsers = (receivedObj) => {
    const payload = {
      mention: receivedObj.mention,
      //message: `${receivedObj.userName} mentioned you in a comment id: ${receivedObj.commentedOnId}`,
      message: `${receivedObj.userName} mentioned you on a ${!receivedObj.child ? `comment` : `sub-comment`} : ${receivedObj.commentedOnId}`,
      comment: `${receivedObj.comment}`
    };
    axios.post("/notify/user", payload)
      .then(response => {
        //console.log("email trigger res:", response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  submitHandler = (message, props) => {
    this.props.removeLastMessageRequest()

    const structuredMentionList = (() => {
      let mentionList = {
        email: [],
        userGroups: [],
      };
      message.mentionData && message.mentionData.mentions && message.mentionData.mentions.map((mention) => isNaN(mention.id) ? mentionList.userGroups.push(mention.display) : mentionList.email.push(mention.display));
      return mentionList;
    })();
    const recipient = (() => {
      let recipientList = [];
      message.mentionData && message.mentionData.mentions && message.mentionData.mentions.map((mention) => recipientList.push(mention.display));
      return recipientList;
    })();


    const sendMessageObject = {
      commentedOnId: props.communication.selectedRowDetail.product_base,
      persId: props.communication.selectedRowDetail.persId, //"skuID"
      //userName: props.userInfo.name,
      //jobRole: props.userInfo.jobRole.jobRole,
      //userGroups: props.userInfo.userGroupID,
      time: new Date().toUTCString(),
      tags: message.tags,
      title: message.title,
      comment: message.comment,
      priority: message.priority,
      mention: structuredMentionList,
      recipient,
      //status: "",
      //lastReactedBy: '',
      //childThread: []
    };

    //Send Message
    this.ws.json({
      action: "sendMessage",
      message: {
        authorization: {
          "x-api-key": this.props.allCookies["x-api-key"],
          token: `Bearer ${this.props.allCookies.Authorization}`,
        },
        data: sendMessageObject,
      },
    });
  };

  handleBroadcastChild = (sendReplyPayload, broadcastReplyPayload) => {
    this.props.removeLastMessageRequest()
    //Send Message
    this.ws.json({
      action: "sendMessageReply",
      message: {
        authorization: {
          "x-api-key": this.props.allCookies["x-api-key"],
          token: `Bearer ${this.props.allCookies.Authorization}`,
        },
        data: sendReplyPayload,
      },
    });
    //For broadcasting child thread

    if (!broadcastReplyPayload.broadcast) {
      broadcastReplyPayload.broadcast = true;
      this.ws.json({
        action: "messageBroadcaster",
        message: broadcastReplyPayload,
      });
    }

  }

  // handleThreadClose = (sendObject) => {
  //   //Send Message
  //   this.ws.json({
  //     action: "sendMessage",
  //     message: {
  //     authorization: {
  //     "x-api-key": this.props.allCookies["x-api-key"],
  //     token: `Bearer ${this.props.allCookies.Authorization}`,
  //      },
  //       data: sendObject,
  //     },
  //   });
  // }


  handleLock = () => {
    const lockStatus = this.props.communication.isLocked;
    this.props.handleLockStatus(!lockStatus);
  };

  render() {
    const { visibleNewThreadDrawer, visibleFilterDrawer } = this.state;
    const { isLocked, dropDownValue, selectedRowDetail } = this.props.communication;
    return (
      <div className="communication">
        <Input.Group compact>
          <span style={{ border: "1px solid #d9d9d9", padding: "4px 15px", fontWeight: 700 }}>SKU</span>
          <Input
            style={{ width: "60%", color: "#3296ed" }}
            placeholder="Click row"
            value={selectedRowDetail && selectedRowDetail[dropDownValue]}
          />
          <span onClick={this.handleLock}>
            {isLocked ? (
              <LockFilled
                style={{
                  border: "1px solid #d9d9d9",
                  padding: 5,
                  fontSize: 20,
                  color: "#595959",
                  margin: "0px 0px 0px 5px",
                }}
              />
            ) : (
                <UnlockFilled
                  style={{
                    border: "1px solid #d9d9d9",
                    padding: 5,
                    fontSize: 20,
                    color: " #d9d9d9",
                    margin: "0px 0px 0px 5px",
                    transform: "rotateY(-180deg)",
                  }}
                />
              )}
          </span>
        </Input.Group>
        <Tabs tabPosition="top">
          <TabPane tab="COMMUNICATION" key="communication">
            {this.props.users && this.props.userGroups ? (
              <div className="drawer-wrapper">
                <FilterOutlined style={{
                  position: "absolute",
                  top: 10,
                  right: 22,
                  padding: "5px",
                  background: "white",
                  color: "orange",
                  border: "none",
                  boxShadow: "rgb(146, 146, 146) 0px 2px 8px 1px",
                  zIndex: 1,
                }}
                  onClick={(e) => {
                    //e.preventDefault()
                    this.setState({ visibleFilterDrawer: true });
                  }}
                />
                <Drawer
                  title={
                    <div>
                      <FilterOutlined style={{ padding: "5px", background: "white", color: "orange", border: "0px 0px 1px 0px solid #d9d9d9" }} /> Filter Threads </div>
                  }
                  placement="top"
                  onClose={() => this.setState({ visibleFilterDrawer: false })}
                  visible={visibleFilterDrawer}
                  getContainer={false}
                  closable={true}
                  mask={false}
                  height={300}
                  style={{
                    position: "absolute",
                    boxShadow: "rgb(146, 146, 146) 0px 2px 8px 1px",
                  }}
                  headerStyle={{ borderBottom: "1px solid rgb(208, 208, 208)" }}
                >
                  <FilterDrawer closeFilterDrawer={() => this.setState({ visibleFilterDrawer: false })} />
                </Drawer>

                <Button
                  type="primary"
                  style={{
                    position: "absolute",
                    //top: 440,
                    bottom: 65,
                    right: 20,
                    background: "#eb8125",
                    color: "white",
                    border: "none",
                    zIndex: 1,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ visibleNewThreadDrawer: true });
                  }}
                >
                  New Thread
                </Button>

                <div className="chat-container">
                  <Messages messages={this.props.communication.messages} users={this.props.users} broadcastChild={this.handleBroadcastChild} handleThreadClose={this.handleThreadClose} />
                </div>

                <Drawer
                  title="New Thread"
                  placement="bottom"
                  onClose={() =>
                    this.setState({ visibleNewThreadDrawer: false })
                  }
                  visible={visibleNewThreadDrawer}
                  getContainer={false}
                  closable={true}
                  height={335}
                  style={{ position: "absolute" }}
                >
                  <NewThread
                    socket={this.socket}
                    submitHandler={this.submitHandler}
                    closeNewThreadDrawer={() =>
                      this.setState({ visibleNewThreadDrawer: false })
                    }
                  />
                </Drawer>
              </div>
            ) : null}
          </TabPane>
          <TabPane tab="UPDATES" key="updates"></TabPane>
        </Tabs>
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
    addLastMessageRequest: (payload) => dispatch(actions.addLastMessageRequest(payload)),
    removeLastMessageRequest: () => dispatch(actions.removeLastMessageRequest()),
    addNotificationRequest: (payload) => dispatch(actions.addNotificationRequest(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withCookies(Communication));
