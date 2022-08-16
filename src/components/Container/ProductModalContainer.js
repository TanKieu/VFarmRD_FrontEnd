/* eslint-disable react/prop-types */
import React, { Component } from "react";
import ProductModal from "components/Modal/ProductModal";
import TriggerButton from "components/CustomButtons/TriggerButton";
//import Trigger from "components/CustomButtons/TempButton";
export class ProductContainer extends Component {
  state = { isShown: false };
  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
    this.toggleScrollLock();
  };
  closeModal = () => {
    this.setState({ isShown: false });
    this.TriggerButton.focus();
    this.toggleScrollLock();
    window.location.reload();
  };
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };
  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  toggleScrollLock = () => {
    document.querySelector("html").classList.toggle("scroll-lock");
  };
  render() {
    return (
      <React.Fragment>
        <TriggerButton
          showModal={this.showModal}
          buttonRef={(n) => (this.TriggerButton = n)}
          triggertext={this.props.triggertext}
          color="info"
          disabled={this.props.status}
        >
          {this.props.triggertext}
        </TriggerButton>
        {this.state.isShown ? (
          <ProductModal
            onSubmit={this.props.onSubmit}
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
            data={this.props.data}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
export default ProductContainer;
