import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const VeripassActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'customTheme',
})(({ theme, customTheme }) => ({
  backgroundColor: customTheme?.brandPrimary || '#000000',
  color: customTheme?.brandPrimaryForeground || '#ffffff',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: customTheme?.brandPrimary ? `${customTheme.brandPrimary}CC` : '#333333',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
  },
}));
