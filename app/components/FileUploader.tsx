import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/format";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024; // 20 MB

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });

  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-x-4">
                <img
                  src="/images/pdf.png"
                  alt="pdf icon"
                  className="size-10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  className="p-2 cursor-pointer shrink-0"
                  onClick={() => onFileSelect?.(null)}
                >
                  <img
                    src="/icons/cross.svg"
                    alt="remove"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                Click to Upload{" "}
                <span className="font-semibold">or drag and drop</span>
              </p>
              <p className="text-lg text-gray-500">
                PDF {formatSize(maxFileSize)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FileUploader;
