import React, { ChangeEvent, DragEvent, useRef, useState } from "react";

interface ImageDropzoneProps {
  onImageSelect?: (file: File) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect?.(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect?.(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `2px dashed ${isDragging ? "#1976d2" : "#ccc"}`,
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragging ? "#f0f8ff" : "#fafafa",
          transition: "0.3s",
        }}
      >
        <p>이미지를 드래그 앤 드롭하거나 클릭해서 업로드하세요</p>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="미리보기"
            style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default ImageDropzone;
