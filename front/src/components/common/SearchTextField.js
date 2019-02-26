import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';

const SearchTextField = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      fullWidth
      value={value}
      autoComplete="search"
      onChange={e => {
        onChange(e.target.value);
      }}
      InputProps={
        value
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <Cancel
                    color="action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      onChange('');
                    }}
                  />
                </InputAdornment>
              )
            }
          : null
      }
    />
  );
};

SearchTextField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired, // textfield value
  onChange: PropTypes.func.isRequired // the callback func when text change
};

SearchTextField.defaultProps = {
  label: '搜索输入栏'
};

export default SearchTextField;
