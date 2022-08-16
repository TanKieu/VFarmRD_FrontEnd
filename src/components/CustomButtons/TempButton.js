/* eslint-disable react/prop-types */
import React from "react";
const Trigger = ({ triggertext, buttonRef, showModal }) => {
  return (
    <button
      className="btn btn-lg btn-danger center modal-button"
      ref={buttonRef}
      onClick={showModal}
    >
      {triggertext}
    </button>
  );
};
export default Trigger;
