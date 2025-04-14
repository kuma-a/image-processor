import { Box } from "@mui/material";
import ImageProcessor from "./ImageProcessor/ImageProcessor";

function App() {
  return (
    <Box
      id="main-container"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        id="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80vw",
          height: "80vh",
        }}
      >
        <ImageProcessor />
      </Box>
    </Box>
  );
}

export default App;
