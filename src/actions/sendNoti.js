export const send = (message) => {
  return {
    type: "SEND",
    payload: message,
  };
};
