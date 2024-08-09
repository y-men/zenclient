// import Dropdown from "react-dropdown";
// import "react-dropdown/style.css";
'use client';
import React, { useState } from 'react';
import Select from 'react-select';


export default function DropDownSelector({
  options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ],
  selected,
  onChange,
}: any) {
  return (
    <Select
      options={options}
      onChange={onChange}
      value={options.find((option: { value: any; }) => option.value === selected)}
      placeholder="Select an option"
    />
  );
}
