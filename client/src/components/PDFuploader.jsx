import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const PDFUploader = ({ onExtractedText }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      handleUpload(acceptedFiles[0]);
    },
  });

  const handleUpload = async (pdfFile) => {
    setUploading(true);
    setProgress(10);
    setError(null);

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    try {
      const { data } = await axios.post(
        "https://mock-mate-api.vercel.app/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      setProgress(100);
      setTimeout(() => setUploading(false), 500);
      onExtractedText(data.text);
    } catch (err) {
      setError("Failed to upload PDF. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-6 w-full text-center rounded-lg cursor-pointer hover:border-blue-500 transition-all"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg
            className="w-10 h-10 text-gray-400 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V12m0 4V9a4 4 0 014-4h2a4 4 0 014 4v7m-8 0h8m-8 0a4 4 0 01-4-4m12 4a4 4 0 004-4"
            />
          </svg>
          {file ? (
            <p className="mt-2 text-gray-700 font-semibold">{file.name}</p>
          ) : (
            <p className="text-gray-500">
              Drag & drop a PDF file or click to upload
            </p>
          )}
        </div>
      </div>

      {/* Uploading Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Upload Error Message */}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-600 rounded-md text-sm">
          ❌ {error}
        </div>
      )}

      {/* Upload Button */}
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition-all"
        onClick={() => document.querySelector("input[type='file']").click()}
      >
        Choose File
      </button>
    </div>
  );
};

export default PDFUploader;
