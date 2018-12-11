import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, Chip, Typography } from '@material-ui/core';

const RenderChips = ({
  input: { value, onChange, ...inputRest },
  label,
  trueLabel,
  falseLabel,
  labelPlacement = 'start',
  ...rest
}) => {
  return (
    <React.Fragment>
      {value &&
        value.map(chip => (
          <Chip
            key={chip.id}
            label={chip.name}
            onDelete={() => {
              onChange(value.filter(node => node.id !== chip.id));
            }}
            style={{
              marginRight: '1rem',
              marginTop: '1rem'
            }}
          />
        ))}
    </React.Fragment>
  );
};

RenderChips.propTypes = {
  label: PropTypes.string, // 不设置trueLabel和falseLabel时显示的文本
  trueLabel: PropTypes.string, // switch为true的时候显示的文本
  falseLabel: PropTypes.string
};

export default RenderChips;
