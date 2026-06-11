import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import type { Dispatch , SetStateAction } from "react";

type addButtonPropType ={
    setOpen : Dispatch<SetStateAction<boolean>>
}

const AddButton = ({setOpen} : addButtonPropType) => {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={()=>{setOpen(true)}}
      sx={{
	width:"200px",
	backgroundColor : "#585289",
        borderRadius: "999px",
        textTransform: "none",
	fontSize : "20px",
      }}
    >
      Add
    </Button>
  );
};

export default AddButton;
