import { Box, Button, Popover, Slider, Typography } from "@mui/material";
import { useState } from "react";

interface FilterProps {
  sharpen: number;
  setSharpen: React.Dispatch<React.SetStateAction<number>>;
}

const Filter = ({ sharpen, setSharpen }: FilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openPopover = Boolean(anchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  const handleSharpenChange = (event: Event, value: number | number[]) => {
    setSharpen(value as number);
  };

  return (
    <>
      <Button
        sx={{ m: 2 }}
        variant="contained"
        onClick={(e) => handleFilterClick(e)}
      >
        FILTER
      </Button>
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ m: 4 }}>
          <Typography>Sharpning</Typography>
          <Slider
            sx={{ width: "200px" }}
            value={sharpen}
            min={0}
            max={3}
            step={0.1}
            onChange={(e, value) => handleSharpenChange(e, value)}
          />
        </Box>
      </Popover>
    </>
  );
};

export default Filter;
