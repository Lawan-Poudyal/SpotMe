import {
  Modal,
  Box,
  Typography,
  Fade,
  Backdrop,
  IconButton,
  Avatar,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@tanstack/react-query';
import { participantApi } from '../api/participantApi';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '400px',
  maxHeight: '80vh',
  backgroundColor: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  outline: 'none',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column' as const,
};

interface ParticipantsDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  ownerId: string;
}

export default function ParticipantsDialog({
  open,
  onClose,
  eventId,
  ownerId,
}: ParticipantsDialogProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['participants', eventId],
    queryFn: () => participantApi.getParticipants(eventId, ownerId),
    enabled: open,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)', // Safari
          },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Header */}
          <Box
            sx={{
              px: 4,
              pt: 4,
              pb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="h2"
              sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '1.25rem' }}
            >
              Participants
            </Typography>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: '#888888', '&:hover': { color: '#ffffff' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              px: 4,
              pb: 4,
              pt: 1,
              overflowY: 'auto',
            }}
          >
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={24} sx={{ color: '#E8572A' }} />
              </Box>
            )}

            {isError && (
              <Typography
                variant="body2"
                sx={{ color: '#888888', textAlign: 'center', py: 4, fontSize: '0.875rem' }}
              >
                Failed to load participants.
              </Typography>
            )}

            {!isLoading && !isError && data?.participants.length === 0 && (
              <Typography
                variant="body2"
                sx={{ color: '#888888', textAlign: 'center', py: 4, fontSize: '0.875rem' }}
              >
                No participants yet.
              </Typography>
            )}

            {!isLoading && !isError && data && data.participants.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.participants.map((p, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: '8px',
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                    }}
                  >
                    <Avatar
                      src={p.profilePic ?? undefined}
                      alt={p.name}
                      sx={{ width: 36, height: 36, backgroundColor: '#E8572A', fontSize: '0.9rem' }}
                    >
                      {p.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.name}
                      </Typography>
                      {p.userName && (
                        <Typography variant="body2" sx={{ color: '#888888', fontSize: '0.78rem' }}>
                          @{p.userName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

