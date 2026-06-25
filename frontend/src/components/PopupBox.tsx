import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close'; // Or use your <X /> icon here
import type { popUpBoxType } from '../types/popUpBoxTypes';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '384px', // Tailwind's max-w-sm (24rem)
  backgroundColor: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '16px', // Tailwind's rounded-2xl
  padding: '24px', // Tailwind's p-6
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px', // Tailwind's gap-3
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Tailwind's shadow-2xl
  outline: 'none', // Removes MUI's default modal focus border
};

export default function PopUpBox({
  title,
  subTitle,
  open,
  setOpen,
  buttonText = 'Close',
  onCloseAction,
}: popUpBoxType) {
  const handleClose = () => {
    setOpen(false);
    if (onCloseAction) {
      onCloseAction(); // Triggers the navigation
    }
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      slotProps={{
        backdrop: {
          style: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }, // Exact backdrop match
        },
      }}
    >
      <Box sx={style}>
        {/* Top Right Close Button */}
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: '#555555',
            transition: 'color 0.2s',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: 'transparent',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* Title */}
        <Typography
          id="modal-title"
          variant="h2"
          sx={{
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '1rem', // Tailwind's text-base
            paddingRight: '24px', // Tailwind's pr-6 to avoid close button overlap
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        <Typography
          id="modal-description"
          sx={{
            color: '#888888',
            fontSize: '0.875rem', // Tailwind's text-sm
            lineHeight: 1.625, // Tailwind's leading-relaxed
          }}
        >
          {subTitle}
        </Typography>

        {/* Bottom Close Action Button */}
        <Button
          onClick={handleClose}
          fullWidth
          variant="contained"
          disableElevation
          sx={{
            marginTop: '8px', // Tailwind's mt-2
            height: '36px', // Tailwind's h-9
            borderRadius: '8px', // Tailwind's rounded-lg
            backgroundColor: '#E8572A',
            color: '#ffffff',
            fontSize: '0.875rem', // Tailwind's text-sm
            fontWeight: 600,
            textTransform: 'none', // Prevents MUI default uppercase behavior
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#d14e25',
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Modal>
  );
}
