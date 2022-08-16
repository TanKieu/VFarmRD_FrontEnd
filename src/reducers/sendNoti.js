import { w3cwebsocket as W3CWebSocket } from "websocket";

export const sendNotiReducer = (
  state = new W3CWebSocket(`ws://54.176.129.42:8000`),
  action
) => {
  switch (action.type) {
    case "SEND":
      return state.send(JSON.stringify(action.payload));
    default:
      return state;
  }
};

export default sendNotiReducer;
