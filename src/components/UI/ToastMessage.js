// import React from 'react';
import { message } from 'antd';

export function showMessage(toastMessage, type) {
    switch (type) {
        case 'Success':
            message.success({content: toastMessage, zIndex: 1400});
            break;
        case 'Error':
            message.error({content: toastMessage, zIndex: 1400});
            break;
        case 'Warning':
            message.warning({content: toastMessage, zIndex: 1400});
            break;
        default:
            message.info({content: toastMessage, zIndex: 1400});
    }
}

// export default function ToastMessage(props) {

//     return (
//         <div>
//             {
//                 displayToast(props.message, props.type)
//             }
//         </div>
//     )
// }
