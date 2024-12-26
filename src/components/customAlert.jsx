import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';

const CustomAlert = ({ message, severity, open, duration = 5000, onClose }) => {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration]);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) {
            onClose();
        }
    };

    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={isOpen}
            onClose={handleClose}
            autoHideDuration={duration}>
            <Alert onClose={handleClose} severity={severity} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

CustomAlert.propTypes = {
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']).isRequired,
    open: PropTypes.bool.isRequired,
    duration: PropTypes.number,
    onClose: PropTypes.func,
  };
  
export default CustomAlert;