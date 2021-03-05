import axiosInstance from './axios-instance';
import { closeSocket } from '../utils/websocket';

export default function logout(props, callAPI) {
  const clearCookies = () => {
    const { cookies } = props;
    clearTimeout(window.refreshTimeout);
    window.refreshTimeout = null;
    window.clearInterval(window.sessionInterval);
    window.sessionInterval = null;
    localStorage.setItem("feedNotification", JSON.stringify({ feedNotification: false }))
    cookies.remove("Authorization", { path: "/" });
    cookies.remove("x-api-key");
    cookies.remove("idleTime");
    cookies.remove('sessionTokenExpiryDate');
    closeSocket();
    props.logout();
  }

  if (callAPI) {
    const logoutFlag = JSON.parse(localStorage.getItem("logoutFlag")).logoutFlag
    const logoutTime = JSON.parse(localStorage.getItem("logoutTime")).logoutTime

    if (logoutFlag === false) {
      clearCookies()
    }
    else if (logoutFlag === true && logoutTime === null) {
      axiosInstance.get('/notificationAck')
        .then(res => {
          clearCookies()
        })
        .catch(e => console.log("Error in logout:", e))
    }
    else if (logoutFlag === true && logoutTime !== null) {
      axiosInstance.get('/notificationAck', { params: { logoutTime } })
        .then(res => {
          clearCookies()
        })
        .catch(e => console.log("Error in logout:", e))
    }
    else {
      clearCookies()
    }

  } else {
    clearCookies()
  }
}