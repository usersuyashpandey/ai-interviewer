import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "../lib/utils";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileChange: (file: File) => void;
  label: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  value?: File | null;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  label,
  accept = {
    "text/plain": [".txt"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  },
  maxSize = 5242880,
  className,
  value,
  error,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-blue-400",
          isDragReject && "border-red-500 bg-red-50",
          error && "border-red-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          {value ? (
            <>
              <FileText className="h-10 w-10 text-blue-500" />
              <p className="text-sm font-medium text-slate-900">{value.name}</p>
              <p className="text-xs text-slate-500">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">
                Drag & drop your file here, or{" "}
                <span className="text-blue-500">browse</span>
              </p>
              <p className="text-xs text-slate-500">
                Supports: PDF, DOC, DOCX, TXT (max {maxSize / 1024 / 1024}MB)
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <div className="flex items-center mt-1 text-red-500 text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
