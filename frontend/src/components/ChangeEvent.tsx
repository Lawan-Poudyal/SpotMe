import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Fade, Backdrop, TextField } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import type { eventType } from '../types/eventType';
import { handleNonUniqueEventNames } from '../utility/eventUtils';
import { useUpdateEvent } from '../hooks/eventHooks';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#111111', // Matches your exact background theme
  border: '1px solid #2a2a2a', // Clean slate border lines
  borderRadius: '16px', // 2xl rounding
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
  currentName: string;
  userId: string;
  eventId: string;
};

const EditNameModal: React.FC<Props> = ({
  open,
  onClose,
  events,
  setTitleError,
  setSubTitleError,
  setIsErrorOpen,
  currentName,
  userId,
  eventId,
}) => {
  const [newName, setNewName] = useState(currentName);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateEvent = useUpdateEvent(
    currentName,
    eventId,
    events,
    userId,
    setIsLoading,
    setTitleError,
    setSubTitleError,
    setIsErrorOpen,
  );

  // Sync state cleanly when the modal snaps open
  useEffect(() => {
    if (open) {
      setNewName(currentName);
    }
  }, [open, currentName]);

  const handleSave = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const conflictExists = handleNonUniqueEventNames(
      trimmed,
      events,
      setTitleError,
      setSubTitleError,
      setIsErrorOpen,
    );

    if (!conflictExists) return;

    updateEvent.mutate(trimmed);
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
          timeout: 300,
          style: { backgroundColor: 'rgba(0, 0, 0, 0.7)' }, // Consistent dark backdrop
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Header Panel */}
          <Box sx={{ px: 4, pt: 4, pb: 2 }}>
            <Typography
              variant="h2"
              sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '1.25rem' }}
            >
              Rename Item
            </Typography>
          </Box>

          {/* Form Context Content */}
          <Box sx={{ px: 4, pb: 4, pt: 1 }}>
            <Typography variant="body2" sx={{ mb: 1.5, color: '#888888', fontSize: '0.875rem' }}>
              Enter a new name:
            </Typography>

            {/* Custom Dark Form Field input styling */}
            <TextField
              fullWidth
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              autoComplete="off"
              disabled={isLoading}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                  '& fieldset': { borderColor: '#2a2a2a' },
                  '&:hover fieldset': { borderColor: '#3a3a3a' },
                  '&.Mui-focused fieldset': { borderColor: '#E8572A' },
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  py: 1.5,
                },
              }}
            />

            {/* Actions Footer Grid Layout */}
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
                  borderColor: '#2a2a2a',
                  color: '#888888',
                  '&:hover': {
                    borderColor: '#3a3a3a',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isLoading}
                disableElevation
                sx={{
                  flex: 1,
                  height: '38px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  backgroundColor: '#E8572A',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#d14e25',
                  },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditNameModal;
