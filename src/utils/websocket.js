import Sockette from "sockette";

let ws = null;
let isManuallyClosed = false;
const config = {
    //api: "http://localhost:4000"
    api: "wss://a3h6ckqjv9.execute-api.ap-south-1.amazonaws.com/test",
};

export const websocket = (handleOnConnect, handleReceivedMessage) => {

    ws = new Sockette(config.api, {
        timeout: 5e3,
        //maxAttempts: 10,
        onopen: (e) => {
            console.log("Connect!", e)
            handleOnConnect(e)
        },
        onmessage: (e) => handleReceivedMessage(e),
        onreconnect: (e) => {
            console.log("Reconnecting...", e)
            handleOnConnect(e)
        },
        onmaximum: (e) => {
            console.log("Stop Attempting!", e)
        },
        onclose: (e) => {
            console.log("Closed!", e)
            if (!isManuallyClosed && (e.code === 1000 || e.code === 1001 || e.code === 1005)) {
                ws.open()
            } 
            // else {
            //     ws.close()
            // }
        },
        onerror: (e) => console.log("Error:", e),
    });
    return ws;
}

export const closeSocket = () => {
    isManuallyClosed = true;
    if (ws !== null) {
        ws.close();
    }
}