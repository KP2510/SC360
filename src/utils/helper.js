import React from 'react';

export function compareArrays(first, second) {
    return !(first.every((e) => second.includes(e)) && second.every((e) => first.includes(e)));
}

export function ValidationMessage(props) {
    if (!props.valid) {
        return (
            <div className='error-msg'>{props.message}</div>
        )
    }
    return null;
}

export const getValidRoles = (userInfo) => {
    const { sRole } = userInfo.sRole || {};
    const { jobRole } = userInfo.jobRole || {};

    return {
        isAdmin: sRole === 'Admin',
        isSupport: sRole === 'Support',
        isPlanner: sRole === 'Planner',
        isSupplyPlanner: jobRole === 'SP',
        isDemandPlanner: jobRole === 'DP'
    };
}

export const updateObject = (oldObject, updatedValues) => {
    return {
        ...oldObject,
        ...updatedValues
    }
}

export const convertToSeconds = (jwtTime) => {
    if (jwtTime.indexOf('s') > -1) {
        return parseInt(jwtTime.split('s')[0]);
    } else if (jwtTime.indexOf('m') > -1) {
        return parseInt(jwtTime.split('m')[0]) * 60;
    } else if (jwtTime.indexOf('h') > -1) {
        return parseInt(jwtTime.split('h')[0]) * 3600;
    } else if (jwtTime.indexOf('d') > -1) {
        return parseInt(jwtTime.split('d')[0]) * 86400;
    }
}

export const getID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}

export const numberFormatter = (number, decimal) => {
    let x = ('' + number).length,
        p = Math.pow;
    decimal = p(10, decimal);
    x -= x % 3;
    return Math.round(number * decimal / p(10, x)) / decimal + " kMGTPE"[x / 3]
}
