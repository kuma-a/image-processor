import { Box } from "@mui/material";
import ImagePropzone from "./ImagePropzone";

const ImageProcessor = () => {
  const handleImageSelect = (file: File) => {
    console.log("선택된 이미지 파일:", file);
  };
  return (
    <Box id="image-processor">
      <ImagePropzone onImageSelect={handleImageSelect} />
    </Box>
  );
};

export default ImageProcessor;
