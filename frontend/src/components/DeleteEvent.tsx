import React from 'react';
import { Modal, Box, Typography, Button, Fade, Backdrop, CircularProgress } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import type { eventType } from '../types/eventType';
import { useDeleteEvent } from '../hooks/eventHooks';

// Unified modal container styling
const modalContainerStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 }, // Responsive width (accounts for mobile screens!)
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
  events: eventType[];
  setTitleError: Dispatch<SetStateAction<string>>;
  setSubTitleError: Dispatch<SetStateAction<string>>;
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>;
  eventId: string;
  eventName: string;
  userId: string;
};

const DeleteEventModal: React.FC<Props> = ({
  open,
  onClose,
  events,
  setTitleError,
  setSubTitleError,
  setIsErrorOpen,
  eventId,
  eventName,
  userId,
}) => {
  // 1. If useDeleteEvent returns a TanStack/React Query mutation, we can get isLoading directly from it:
  // const deleteEventMutation = useDeleteEvent(...)
  // const isLoading = deleteEventMutation.isLoading // or isPending depending on your version

  // Sticking to local state since your custom hook uses setIsLoading internally:
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const deleteEvent = useDeleteEvent(
    eventName,
    events,
    userId,
    eventId,
    setIsLoading,
    setTitleError,
    setSubTitleError,
    setIsErrorOpen,
  );

  const handleDelete = async () => {
    onClose();

    deleteEvent.mutate();
  };

  return (
    <Modal
      open={open}
      onClose={isLoading ? undefined : onClose} // Prevent accidental close while deleting
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        },
      }}
      aria-labelledby="delete-event-title"
      aria-describedby="delete-event-description"
    >
      <Fade in={open}>
        <Box sx={modalContainerStyle}>
          {/* Header Panel */}
          <Box sx={{ px: 4, pt: 4, pb: 2 }}>
            <Typography
              id="delete-event-title"
              variant="h2"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.25rem',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Delete Event
            </Typography>
          </Box>

          {/* Content Section */}
          <Box id="delete-event-description" sx={{ px: 4, pb: 4, pt: 1 }}>
            {/* Main warning question label */}
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: '#888888',
                fontSize: '0.875rem',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              Are you sure you want to delete
            </Typography>

            {/* Highlighted Event Name String */}
            <Typography
              variant="h6"
              sx={{
                mb: 1.5,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.1rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                wordBreak: 'break-word',
              }}
            >
              "{eventName || 'this event'}"?
            </Typography>

            {/* Warning Subtext */}
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
                onClick={handleDelete}
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

export default DeleteEventModal;
