import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs, Typography, Divider, Box } from '@mui/material';

const CustomBreadcrumbs = ({ items }) => {
  return (
    <Box sx={{ padding: 2, marginBottom: 2 }}>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => (
          <Typography key={index} color={index === items.length - 1 ? "text.primary" : "inherit"}>
            {item}
          </Typography>
        ))}
      </Breadcrumbs>
      <Divider />
    </Box>

  );
};

CustomBreadcrumbs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default React.memo(CustomBreadcrumbs);