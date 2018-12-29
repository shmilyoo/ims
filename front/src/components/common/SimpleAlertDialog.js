import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from '@material-ui/core';

const SimpleAlertDialog = ({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = '确定',
  cancelText = '取消'
}) => {
  return (
    <Dialog open={open} style={{ top: '-20rem' }}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {content && <DialogContent>{content}</DialogContent>}
      <DialogActions style={{ padding: '1.5rem' }}>
        <Button variant="contained" color="secondary" onClick={onConfirm}>
          {confirmText}
        </Button>
        <Button variant="contained" onClick={onCancel}>
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SimpleAlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string
};

export default SimpleAlertDialog;
