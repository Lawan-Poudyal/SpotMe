import React from 'react';
import { Modal, Box, Typography, Button, Fade, Backdrop, CircularProgress } from '@mui/material';

const modalContainerStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  backgroundColor: '#0a0a0a',
  border: '1px solid #2a2a2a',
  borderRadius: '12px',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.5)',
  outline: 'none',
  overflow: 'hidden',
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const SureDeleteComponent: React.FC<Props> = ({ open, onClose, onConfirm, isLoading = false }) => {
  return (
    <Modal
      open={open}
      onClose={isLoading ? undefined : onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        },
      }}
      aria-labelledby="sure-delete-title"
      aria-describedby="sure-delete-description"
      sx={{ zIndex: 99999 }}
    >
      <Fade in={open}>
        <Box sx={modalContainerStyle}>
          {/* Header Panel */}
          <Box sx={{ px: 4, pt: 4, pb: 2 }}>
            <Typography
              id="sure-delete-title"
              variant="h2"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.25rem',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Delete Thumbnail Photo
            </Typography>
          </Box>

          {/* Content Section */}
          <Box id="sure-delete-description" sx={{ px: 4, pb: 4, pt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: '#888888',
                fontSize: '0.875rem',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              This photo is set as the event thumbnail. Do you want to delete the thumbnail photo?
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 4,
                color: '#E8572A',
                fontWeight: 500,
                fontSize: '0.75rem',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              This action cannot be undone.
            </Typography>

            {/* Actions Footer Layout */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={isLoading}
                sx={{
                  flex: 1,
                  height: '38px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  borderColor: '#2a2a2a',
                  color: '#888888',
                  '&:hover': {
                    borderColor: '#3a3a3a',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                  },
                }}
              >
                Keep it
              </Button>

              <Button
                variant="contained"
                onClick={onConfirm}
                disabled={isLoading}
                disableElevation
                startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  flex: 1,
                  height: '38px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  backgroundColor: '#E8572A',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#d14e25',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#d14e25',
                    color: 'rgba(255, 255, 255, 0.6)',
                  },
                }}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SureDeleteComponent;
