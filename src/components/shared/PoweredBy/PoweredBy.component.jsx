import React from 'react';
import { Box, Typography } from '@mui/material';
import veripassLogo from '@assets/logos/veripass-logo-dark.svg';

/**
 * Powered by component that shows the Veripass logo.
 *
 * @component
 */
export const PoweredBy = ({ align = 'end', position = 'bottom' }) => (
  <Box
    component="section"
    sx={{
      display: 'flex',
      justifyContent: align,
      mb: position === 'top' ? 2 : 0,
      mt: position === 'bottom' ? 2 : 0,
    }}
  >
    <Typography
      sx={{
        mr: 0.5,
        color: 'text.secondary',
        fontSize: '0.775rem',
        fontWeight: 400,
      }}
    >
      Powered by
    </Typography>
    <Box component="img" src={veripassLogo} alt="Veripass logo" sx={{ height: 15 }} />
  </Box>
);
