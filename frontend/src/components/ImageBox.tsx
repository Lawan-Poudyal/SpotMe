import type { ImageBox ,stylingType} from "../types/ImageBoxTypes";
import { Box } from "@mui/material";

export function ImageBox({imgSrc , autoBalance}:ImageBox) : React.ReactNode {

    const style : stylingType = {
	display : 'block',
	height : (autoBalance === "height") ? 'auto' : "100%" ,
	width : (autoBalance === "width") ? 'auto' : "50%",
    }

    return(
	<>
	    <Box
		component="img"
		src={imgSrc}
		sx={
		    style
		}
		
	    >
	    </Box>
	</>
    )
}
