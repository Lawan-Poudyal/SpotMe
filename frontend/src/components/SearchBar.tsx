import React from "react";
import TextField from "@mui/material/TextField";
import type { SetStateAction , Dispatch } from "react";

type searchBarType = {
    setQuery : Dispatch<SetStateAction<string>>
    query : string
}

const SearchBar: React.FC<searchBarType> = ({setQuery, query} : searchBarType) => {

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search your events..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      sx={{
        maxWidth: 700,
        backgroundColor: "white",
      }}
    />
  );
};

export default SearchBar;
