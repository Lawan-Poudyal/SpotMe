import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import type { popUpBoxType } from '../types/popUpBoxTypes';
import { useEffect } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#585289',
  color : 'white',
  borderRadius :"12px", 
  boxShadow: 24,
  p: 4,
};

export default function PopUpBox({title , subTitle , open , setOpen}:popUpBoxType) {
  const handleClose = () => setOpen(false);
  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
	    {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
	    {subTitle}
          </Typography>
        </Box>
      </Modal>
  );
}
