import axios from "axios";
import config from "../config";
import { convertToSeconds } from "./helper";


export const login = async (cookies, payload) => {
    const loginRes = await axios.post(`${config.BASE_URL}/login`, payload);
    const { userGroupID, token, sessionInfo, id, name, firstName, lastName, emailNotification, appNotifications, businessUpdates, email, role, jobRole, jobRoleID, sRole, sRoleID } = loginRes.data.data;
    const loginDetails = { userGroupID, token, sessionInfo, id, name, firstName, lastName, emailNotification, appNotifications, businessUpdates, email, role, jobRole, jobRoleID, sRole, sRoleID };
    const maxAge = convertToSeconds(sessionInfo.JWT_Expiry.toLowerCase());
    cookies.set('Authorization', token, { path: '/', expires: new Date(), maxAge });
    cookies.set('x-api-key', id, { path: '/', expires: new Date(), maxAge });
    cookies.set('idleTime', sessionInfo.IDLE_TIMEOUT, { path: '/', expires: new Date(), maxAge: 10000 })
    cookies.set('sessionTokenExpiryDate', getTokenExpiryDetails(maxAge), { maxAge })
    refreshToken(cookies, maxAge, payload);
    return loginDetails;
}

export const calculateSessionTimeoutSeconds = (cookies) => {
    const sessionTokenExpiryDate = cookies.get('sessionTokenExpiryDate');
    if (sessionTokenExpiryDate) {
        const timeDiff = new Date(sessionTokenExpiryDate).getTime() - new Date().getTime();
        const secondsDiff = Math.round(timeDiff / 1000 / 60) * 60;
        return secondsDiff;
    }
}

export const refreshToken = (cookies, sessionTimeOut, payload) => {
    if (!window.refreshTimeout) {
        window.refreshTimeout = setTimeout(() => {
            window.refreshTimeout = null;
            login(cookies, payload)
        }, (sessionTimeOut <= 60 ? 0 : sessionTimeOut - 60) * 1000)
    }
}

const getTokenExpiryDetails = (maxAge) => {
    let currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + maxAge);
    return currentDate;
}