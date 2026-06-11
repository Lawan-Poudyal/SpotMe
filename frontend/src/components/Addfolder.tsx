import React, { useState, type Dispatch, type SetStateAction } from "react";
import { Modal, Box, Typography, TextField, Button, Fade, Backdrop } from "@mui/material";
import type { eventType } from "../types/eventType";
import { onAddEvent } from "../utility/eventUtils";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 4, // Softer corners
  boxShadow: "0px 10px 40px rgba(0,0,0,0.12)",
  outline: "none",
  overflow: "hidden", // Ensures header corners match modal corners
};

type Props = {
  open: boolean;
  onClose: () => void;
  events  : eventType[];
  setTitleError : Dispatch<SetStateAction<string>>;
  setSubTitleError : Dispatch<SetStateAction<string>>;
  setIsErrorOpen : Dispatch<SetStateAction<boolean>>;
  setEvents : Dispatch<SetStateAction<eventType[]>>
  userId : string;
};

const AddEvent: React.FC<Props> = ({ open, onClose , events, setTitleError , setSubTitleError , setIsErrorOpen , setEvents , userId}) => {
  const [eventName, setEventName] = useState<string>("");
  const [isLoading , setIsLoading] = useState<boolean>(false)

  const handleAdd = async () => {
    if (!eventName.trim()) return;
    await onAddEvent(eventName , events, setTitleError , setSubTitleError , setIsErrorOpen , setEvents , setIsLoading, userId);
    setEventName("");
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
          sx: { backgroundColor: "rgba(88, 82, 137, 0.2)" }, // Themed tint
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Header Section */}
          <Box
            sx={{
              backgroundColor: "#585289",
              px: 3,
              py: 2.5,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight="700" color="white" sx={{ letterSpacing: -0.5 }}>
              Create New Event
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              autoFocus
              label="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Birthday Party"
              variant="outlined"
              onKeyDown={async (e) => e.key === 'Enter' && await handleAdd()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": {
                    borderColor: "#585289",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#585289",
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  flex: 1,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#585289",
                  color: "#585289",
                  "&:hover": {
                    backgroundColor: "#f3f2f8",
                    borderColor: "#585289",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAdd}
		disabled = {isLoading}
                disableElevation
                sx={{
                  flex: 2, // Primary action is wider
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#585289",
                  "&:hover": {
                    backgroundColor: "#474172",
                  },
                }}
              >
                Add Event
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddEvent;
