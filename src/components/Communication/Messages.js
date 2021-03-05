import React from 'react';
import Message from './Message';
import { connect } from "react-redux";
import * as actions from '../../redux/actions/index'
import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/core";
import config from "../../config";

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasMoreItems: true,
      pageCounter: 2
    }
  }


  componentDidUpdate(prevProps) {
    let lenDiff = this.props.communication.messages.length - prevProps.communication.messages.length
    if (prevProps.communication.messages.length !== this.props.communication.messages.length &&
      (prevProps.communication.messages.length === 0 || lenDiff === 1)) {
      // There is a new message OR there are history message on first load in the state, scroll to bottom of list
      const objDiv = document.getElementById('messageList');
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    // If total message count is equal to search result count, just scroll a bit down to hide the loader
    if (prevProps.communication.selectedRowDetail.product_base === this.props.communication.selectedRowDetail.product_base && prevProps.communication.filterDrawer !== this.props.communication.filterDrawer) {
      const objDiv = document.getElementById('messageList');
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    //If the selectedRow is changed, reset the state
    if (prevProps.communication.selectedRowDetail && (prevProps.communication.selectedRowDetail.product_base !== this.props.communication.selectedRowDetail.product_base || prevProps.communication.totalMessages !== this.props.communication.totalMessages || prevProps.communication.filterDrawer !== this.props.communication.filterDrawer)) {
      this.setState({ hasMoreItems: true, pageCounter: 2 })
    }
  }

  onScrollHandler = (e) => {
    e.preventDefault();
    const { selectedRowDetail, filterDrawer, } = this.props.communication
    const objDiv = document.getElementById('messageList');
    if (objDiv.scrollTop === 0) {
      const totalItem = this.props.communication.totalMessages
      const totalPage = Math.ceil(totalItem / config.MESSAGE_PER_PAGE)

      if (this.state.pageCounter <= totalPage) {
        if (this.state.pageCounter > 1) {
          const payload = {
            "pageNo": `${this.state.pageCounter}`,
            "perPage": `${config.MESSAGE_PER_PAGE}`,
            "persId": "",
            "commentedOnId": selectedRowDetail.product_base,
            "text": filterDrawer.text || "",
            "tags": filterDrawer.checkedListTag,
            "priority": "",
            "userGroups": filterDrawer.checkedListGroup,
            "emails": filterDrawer.emails,
            "endDate": filterDrawer.endDate,
            "startDate": filterDrawer.startDate,
          }
          this.props.searchMessageRequest(payload)
          //Waiting time added to get the new data added into the list
          setTimeout(() => { objDiv.scrollTop = objDiv.scrollHeight / (this.state.pageCounter - 1) }, 500)
        }
        this.setState({ pageCounter: this.state.pageCounter + 1 })
      } else {
        this.setState({ hasMoreItems: false })
      }
    }
  }

  render() {
    const override = css`display: flex;`;
    const objDiv = document.getElementById('messageList');
    // Loop through all the messages in the state and create a Message component
    const messages = this.props.messages.map((message, i) => {
      return (
        <Message
          key={i}
          users={this.props.users}
          message={message}
          broadcastChild={this.props.broadcastChild}
          handleThreadClose={this.props.handleThreadClose}
        />
      );
    });

    return (
      <div className='messagesList' id='messageList' onScroll={(e) => { if (messages.length) { this.onScrollHandler(e) } }}>
        {
          messages.length ?
            (<div className="loader" key={0} style={{ display: 'flex', justifyContent: 'center', margin: 5 }}>
              {
                this.state.hasMoreItems ?
                  <PulseLoader css={override} size={12} color={"#777777"} loading={objDiv && objDiv.scrollTop == 0 ? true : false} /> : <span>You've seen all...</span>
              }
            </div>) : null
        }
        {messages}
      </div>
    );
  }
}

Messages.defaultProps = {
  messages: []
};

const mapStateToProps = (state) => {
  return {
    communication: state.communication,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    searchMessageRequest: (payload, isFilter) => dispatch(actions.searchMessageRequest(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);