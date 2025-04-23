import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface ImageDropzoneProps {
  onImageSelect?: (file: File) => void;
  sharpen?: number; // 0이면 샤프닝 없음, 1 이상이면 점점 더 선명
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImageSelect,
  sharpen = 0,
}) => {
  const [originalImageBase64, setOriginalImageBase64] = useState<string | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const applySharpen = async (imageSrc: string, sharpenFactor: number) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        if (sharpenFactor > 0) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const w = canvas.width;
          const h = canvas.height;

          const weights = [0, -1, 0, -1, 5 + sharpenFactor, -1, 0, -1, 0];
          const side = 3;
          const halfSide = Math.floor(side / 2);

          const output = ctx.createImageData(w, h);
          const dst = output.data;

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              let r = 0,
                g = 0,
                b = 0;
              for (let ky = 0; ky < side; ky++) {
                for (let kx = 0; kx < side; kx++) {
                  const px = x + kx - halfSide;
                  const py = y + ky - halfSide;
                  if (px >= 0 && px < w && py >= 0 && py < h) {
                    const pos = (py * w + px) * 4;
                    const wt = weights[ky * side + kx];
                    r += data[pos] * wt;
                    g += data[pos + 1] * wt;
                    b += data[pos + 2] * wt;
                  }
                }
              }
              const i = (y * w + x) * 4;
              dst[i] = Math.min(255, Math.max(0, r));
              dst[i + 1] = Math.min(255, Math.max(0, g));
              dst[i + 2] = Math.min(255, Math.max(0, b));
              dst[i + 3] = data[i + 3];
            }
          }

          ctx.putImageData(output, 0, 0);
        }

        resolve(canvas.toDataURL());
      };
      img.src = imageSrc;
    });
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setOriginalImageBase64(base64); // 원본 저장
      onImageSelect?.(file);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const updateSharpenedPreview = async () => {
      if (originalImageBase64) {
        const sharpened = await applySharpen(originalImageBase64, sharpen);
        setPreviewUrl(sharpened);
      }
    };
    updateSharpenedPreview();
  }, [originalImageBase64, sharpen]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImageFile(file);
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
      processImageFile(file);
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
