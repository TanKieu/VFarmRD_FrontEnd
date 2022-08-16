/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";

const Input = styled.input.attrs((props) => ({
  type: "text",
  size: props.small ? 5 : undefined,
}))`
  height: 32px;
  width: 200px;
  border-radius: 30px;
  border: 1px solid #e5e5e5;
  padding: 0 22px 0 15px;
  font-size: 15px;
  position: relative;
  margin-left: 15px;
`;

const ClearButton = styled.button`
  outline: none;
  border: none;
  background: none;
  font-size: 14px;
  position: absolute;
  right: 20px;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <label style={{ color: "black" }}>Tìm: </label>
    <Input id="search" type="text" value={filterText} onChange={onFilter} />
    <ClearButton onClick={onClear}>X</ClearButton>
  </>
);

export default FilterComponent;
