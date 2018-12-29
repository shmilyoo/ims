import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import Select from 'react-select';

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}
const Control = props => (
  <TextField
    fullWidth
    value="bbb"
    inputProps={{
      // className: props.selectProps.classes.input,
      inputRef: props.innerRef,
      children: props.children,
      ...props.innerProps
    }}
    InputProps={{
      inputComponent
    }}
    {...props.selectProps.textFieldProps}
  />
);

class DeptWorkChannelPicker extends PureComponent {
  render() {
    return (
      <div>
        {/* <TextField fullWidth label='' */}
        <Select
          // defaultValue={colourOptions[0]}
          isClearable
          components={{ Control: Control }}
          isSearchable
          value="aaa"
          name="color"
          // options={colourOptions}
        />
      </div>
    );
  }
}

DeptWorkChannelPicker.propTypes = {};

export default DeptWorkChannelPicker;
