import { cloneDeep } from 'lodash';
import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState';
import { updateObject } from '../../utils/helper';

const communicationReducer = (state = defaultState.communication, action) => {

  switch (action.type) {
    case actionType.TOGGLE_LOCK:
      return updateObject(state, {
        isLocked: action.payload
      });
    case actionType.SELECT_DROPDOWN:
      return updateObject(state, {
        dropDownValue: action.payload
      });
    case actionType.GET_ROW_DETAIL:
      return updateObject(state, {
        selectedRowDetail: action.payload
      });
    case actionType.REMOVE_ROW_DETAIL:
      return updateObject(state, {
        selectedRowDetail: {}
      });

    case actionType.ADD_MESSAGE_SUCCESS:

      let receivedMessage = action.payload
      if (Array.isArray(receivedMessage)) {
        //For history/search data on connect
        const historyMessage = receivedMessage.sort((a, b) => a.time.localeCompare(b.time))
        return updateObject(state, {
          messages: historyMessage,
          totalMessages: historyMessage.length
        });
      } else if (typeof receivedMessage === "object" && Object.keys(receivedMessage).length) {
        //For parent/child thread
        if (!Object.keys(receivedMessage).includes("child")) {
          //Parent Thread
          const filterMsgLen = state.messages.filter(msg => msg.commentId == receivedMessage.commentId).length
          if (filterMsgLen === 0) {
            let messages = cloneDeep(state.messages)
            messages.push(receivedMessage);
            return updateObject(state, {
              messages: messages,
              //totalMessages: state.totalMessages + 1
            });
          } else {

            let messages = cloneDeep(state).messages
            var messagesUpdated = messages.map(msg => {
              if (msg.commentId == receivedMessage.commentId) {
                msg.statusProgress = receivedMessage.statusProgress
                msg.statusClosed = receivedMessage.statusClosed
              }
              return msg
            })

            messages.push(receivedMessage);
            return updateObject(state, {
              messages: messagesUpdated
            });
          }

        } else {
          //Child Thread
          let messages = cloneDeep(state).messages
          messages.map(item => {
            if (item.commentId == receivedMessage.commentId) {
              item.childThread.push(receivedMessage.childThread)
              item.statusProgress = true
              item.statusClosed = false
            }
          })
          return updateObject(state, {
            messages: messages
          });
        }
      } else {
        return updateObject(state, {
          messages: []
        });
      }

    case actionType.ADD_LAST_MESSAGE_SUCCESS:
      return updateObject(state, {
        lastMessageObj: action.payload
      });
    case actionType.REMOVE_LAST_MESSAGE_SUCCESS:
      return updateObject(state, {
        lastMessageObj: {}
      });

    case actionType.SEARCH_MESSAGE_SUCCESS:
      const messages = cloneDeep(state).messages
      if (action.payload.results.length && action.payload.pageNo !== "1") {
        messages.push(...action.payload.results);
        messages.sort((a, b) => a.time.localeCompare(b.time))
        return updateObject(state, {
          messages,
          totalMessages: action.payload.total
        });

      } else {
        const messages = action.payload.results.sort((a, b) => a.time.localeCompare(b.time))
        return updateObject(state, {
          messages,
          totalMessages: action.payload.total
        });
      }

    case actionType.GET_NOTIFICATION_SUCCESS:
      let sortedNotificationFeed = action.payload.sort((a, b) => a.time.localeCompare(b.time))
      return updateObject(state, {
        notification: sortedNotificationFeed
      });
    case actionType.ADD_NOTIFICATION_SUCCESS:
      const newNotificationList = cloneDeep(state).notification
      newNotificationList.push(action.payload)
      let sortedNotificationInstant = newNotificationList.sort((a, b) => a.time.localeCompare(b.time))
      return updateObject(state, {
        notification: sortedNotificationInstant
      });
    case actionType.ADD_FILTERS:
      return updateObject(state, {
        filterDrawer: action.payload
      });
    default:
      return state
  }
}

export default communicationReducer;