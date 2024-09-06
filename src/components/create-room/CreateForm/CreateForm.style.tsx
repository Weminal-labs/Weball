import { styled } from '@mui/material/styles';
import { Box, Modal, IconButton, Autocomplete, TextField, RadioGroup, Typography, FormControlLabel, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const StyledModal = styled(Modal)(({ theme }) => ({
  backdropFilter: 'blur(8px)',
}));

export const StyledBox = styled(Box)<{ isMobile: boolean }>(({ theme, isMobile }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: isMobile ? theme.spacing(2) : theme.spacing(3),
  width: isMobile ? '90%' : '80%',
  maxWidth: isMobile ? 'none' : '550px',
  height: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2.5),
  border: '2px solid white',
  borderRadius: '8px',
  backgroundColor: 'rgba(68, 97, 108, 0.6)',
  backdropFilter: 'blur(1.5rem)',
  boxShadow: '4px 4px 20px rgba(0, 0, 0.1, 0.2)',
  color: 'white',
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.25),
  right: theme.spacing(1.25),
  zIndex: 1000,
  color: theme.palette.primary.main,
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
}));

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
}));

export const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  justifyContent: 'space-between',
}));
