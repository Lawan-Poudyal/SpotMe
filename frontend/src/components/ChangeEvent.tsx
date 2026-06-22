import React, {useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Fade, Backdrop, TextField } from "@mui/material";
import type {Dispatch , SetStateAction} from 'react'
import type { eventType } from "../types/eventType";
import { onUpdateEvent } from "../utility/eventUtils";
import { handleNonUniqueEventNames } from "../utility/eventUtils";
import { useUpdateEvent } from "../hooks/eventHooks";
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#FFFFFF",
  borderRadius: 4,
  boxShadow: "0px 10px 40px rgba(0,0,0,0.12)",
  outline: "none",
  overflow: "hidden",
};

type Props = {
  open: boolean;
  onClose: () => void;
  events  : eventType[];
  setTitleError : Dispatch<SetStateAction<string>>;
  setSubTitleError : Dispatch<SetStateAction<string>>;
  setIsErrorOpen : Dispatch<SetStateAction<boolean>>;
  setEvents : Dispatch<SetStateAction<eventType[]>>
  currentName : string;
  userId : string;
  eventId : string;
};

const EditNameModal: React.FC<Props> = ({
    open,
    onClose,
    events,
    setTitleError,
    setSubTitleError,
    setIsErrorOpen,
    setEvents,
    currentName,
    userId,
    eventId
}) => {
  const [newName, setNewName] = useState(currentName);
  const [isLoading , setIsLoading] = useState<boolean>(false)
  const updateEvent = useUpdateEvent(currentName , eventId , events, userId , setIsLoading , setTitleError , setSubTitleError , setIsErrorOpen )
  useEffect(()=>{
      setNewName(currentName)
      // it does say this this could create some cascading error but it doesn't
  },[open])
  const handleSave = async () => {
    const trimmed = newName.trim();
    const conflictExists = handleNonUniqueEventNames(
	newName,
	events,
	setTitleError,
	setSubTitleError,
	setIsErrorOpen
    )
    if(!conflictExists) return
    if (trimmed === "") return
	updateEvent.mutate(newName)
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: { timeout: 500, sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" } },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Box sx={{ backgroundColor: "#585289", px: 3, py: 2.5, textAlign: "center" }}>
            <Typography variant="h5" fontWeight="700" sx={{ color: "#FFFFFF" }}>
              Rename Item
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "#5f6368", fontWeight: 500 }}>
              Enter a new name:
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#585289" },
                },
                "& .MuiInputBase-input": { color: "#1a1a1a" },
              }}
            />

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  flex: 1, py: 1.2, borderRadius: 2, textTransform: "none",
                  fontWeight: 600, borderColor: "#585289", color: "#585289"
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
		disabled = {isLoading}
                disableElevation
                sx={{
                  flex: 1, py: 1.2, borderRadius: 2, textTransform: "none",
                  fontWeight: 600, backgroundColor: "#585289"
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
