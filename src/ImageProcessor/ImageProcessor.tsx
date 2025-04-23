import { Box } from "@mui/material";
import { useState } from "react";
import Filter from "./Filter";
import ImagePropzone from "./ImagePropzone";

const ImageProcessor = () => {
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [sharpen, setSharpen] = useState(0);
  const handleImageSelect = (file: File) => {
    console.log("선택된 이미지 파일:", file);
    if (file) {
      setIsImageUploaded(true);
    }
  };
  return (
    <Box id="image-processor">
      {isImageUploaded && <Filter sharpen={sharpen} setSharpen={setSharpen} />}
      <ImagePropzone onImageSelect={handleImageSelect} sharpen={sharpen} />
    </Box>
  );
};

export default ImageProcessor;
