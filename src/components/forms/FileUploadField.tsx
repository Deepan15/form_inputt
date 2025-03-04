'use client';

import React, { useState, useRef } from 'react';

interface FileUploadFieldProps {
  id: string;
  label: string;
  required: boolean;
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
  onChange: (fieldId: string, file: File | null) => void;
  error?: string;
}

export default function FileUploadField({
  id,
  label,
  required,
  maxFileSize = 5, // Default 5MB
  allowedFileTypes = [],
  onChange,
  error,
}: FileUploadFieldProps) {
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (maxFileSize && fileSizeInMB > maxFileSize) {
      setFileError(`File size exceeds the maximum limit of ${maxFileSize}MB`);
      return false;
    }
    
    // Check file type if restrictions are set
    if (allowedFileTypes.length > 0) {
      const fileType = file.type;
      const isAllowed = allowedFileTypes.some(type => {
        // Handle wildcard types like image/*
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(`${category}/`);
        }
        return type === fileType;
      });
      
      if (!isAllowed) {
        setFileError('File type not allowed');
        return false;
      }
    }
    
    setFileError('');
    return true;
  };

  const handleFile = (file: File | null) => {
    if (!file) {
      setFileName('');
      setFileSize('');
      onChange(id, null);
      return;
    }
    
    if (validateFile(file)) {
      setFileName(file.name);
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${fileSizeInMB} MB`);
      onChange(id, file);
    } else {
      setFileName('');
      setFileSize('');
      onChange(id, null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileSize('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onChange(id, null);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          {!fileName ? (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor={id}
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id={id}
                    name={id}
                    type="file"
                    className="sr-only"
                    ref={inputRef}
                    onChange={handleChange}
                    required={required}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {allowedFileTypes.length > 0 
                  ? `Allowed: ${allowedFileTypes.map(type => 
                      type === 'image/*' ? 'Images' : 
                      type === 'application/pdf' ? 'PDF' :
                      type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'Word Docs' :
                      type === 'text/plain' ? 'Text Files' :
                      type === 'application/zip' ? 'ZIP Archives' : type
                    ).join(', ')}`
                  : 'Any file type'
                }
                {maxFileSize && ` up to ${maxFileSize}MB`}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-900">{fileName}</p>
                    <p className="text-xs text-gray-500">{fileSize}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {(fileError || error) && (
        <p className="mt-2 text-sm text-red-600">{fileError || error}</p>
      )}
    </div>
  );
} 