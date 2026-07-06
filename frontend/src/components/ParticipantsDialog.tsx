import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    CircularProgress,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@tanstack/react-query';
import { participantApi } from '../api/participantApi';

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
        enabled: open, // only fetch once the dialog is actually opened
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                style: { backgroundColor: '#1C1C1E', color: '#fff', borderRadius: 12 },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Participants
                <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                        <CircularProgress size={24} sx={{ color: '#F97316' }} />
                    </div>
                )}

                {isError && (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 3 }}>
                        Failed to load participants.
                    </Typography>
                )}

                {!isLoading && !isError && data?.participants.length === 0 && (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 3 }}>
                        No participants yet.
                    </Typography>
                )}

                {!isLoading && !isError && data && data.participants.length > 0 && (
                    <List sx={{ py: 0 }}>
                        {data.participants.map((p, idx) => (
                            <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemAvatar>
                                    <Avatar src={p.profilePic ?? undefined} alt={p.name}>
                                        {p.name?.[0]?.toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={p.name}
                                    secondary={p.userName ? `@${p.userName}` : undefined}
                                    primaryTypographyProps={{ sx: { color: '#fff' } }}
                                    secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
}