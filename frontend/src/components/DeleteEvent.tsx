import React from 'react';
import { Modal, Box, Typography, Button, Fade, Backdrop } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import type { eventType } from '../types/eventType';
import { useState } from 'react';
import { useDeleteEvent } from '../hooks/eventHooks';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#FFFFFF', // Hard-coded white background
  borderRadius: 4,
  boxShadow: '0px 10px 40px rgba(0,0,0,0.12)',
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
  eventName: string;
  userId: string;
  eventId: string;
};

const DeleteEventModal: React.FC<Props> = ({
  open,
  onClose,
  events,
  setTitleError,
  setSubTitleError,
  setIsErrorOpen,
  eventName,
  userId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteEvent = useDeleteEvent(
    eventName,
    events,
    userId,
    setIsLoading,
    setTitleError,
    setSubTitleError,
    setIsErrorOpen,
  );

  const handleDelete = async () => {
    deleteEvent.mutate();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Header Section */}
          <Box
            sx={{
              backgroundColor: '#585289',
              px: 3,
              py: 2.5,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: '700' }}>
              Delete Event
            </Typography>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 1, color: '#5f6368', fontWeight: 500 }}>
              Are you sure you want to delete
            </Typography>

            <Typography variant="h6" sx={{ mb: 3, color: '#1a1a1a', fontWeight: '700' }}>
              "{eventName || 'this event'}"?
            </Typography>

            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 4, color: '#d32f2f', fontWeight: 600 }}
            >
              This action cannot be undone.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#585289',
                  color: '#585289',
                  '&:hover': {
                    backgroundColor: '#f3f2f8',
                    borderColor: '#585289',
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
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: '#d32f2f', // Red for danger
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#b71c1c',
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteEventModal;
