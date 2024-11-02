import React, { useState, useEffect } from "react";
import { Modal } from "../BellMazeh/Modal";
import DashboardButton from "../ui/Button/DashboardButton";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import { getCookie } from "cookies-next";
import { CheckCircle2, Upload, X } from "lucide-react";

export interface FileData {
  _id: string;
  name: string;
  size: string;
  type: string;
  location: string;
  createdAt: string;
}

interface ApiResponse {
  data?: FileData[];
  error?: boolean;
  message?: string | string[];
  status?: string;
}

export default function FileUploaderComponent({
  isOpenModal,
  setIsOpenModal,
  onFileSelect,
  initialSelectedFiles = [],
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onFileSelect?: (files: FileData[]) => void;
  initialSelectedFiles?: FileData[];
}) {
  const authenticatedFetch = useAuthenticatedFetch();

  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const showError = (message: string) => {
    console.error(message);
  };

  const formatErrorMessage = (message: string | string[] | any): string => {
    if (Array.isArray(message)) {
      return message.join(" ");
    }
    return message?.toString() || "خطای ناشناخته رخ داده است";
  };

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const { data, error, message } = await authenticatedFetch<ApiResponse>("/store", {
        method: "GET",
      });

      if (error) {
        throw new Error(formatErrorMessage(message));
      }

      if (Array.isArray(data)) {
        setFiles(data);
        if (initialSelectedFiles.length > 0) {
          const validSelectedFiles = initialSelectedFiles.filter((selectedFile) =>
            data.some((file) => file._id === selectedFile._id)
          );
          setSelectedFiles(validSelectedFiles);
        } else {
          setSelectedFiles([]);
        }
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      showError("فقط فایل‌های JPG و PNG مجاز هستند");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    const token = getCookie("auth_token");
    if (!token) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/store`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در آپلود فایل");
      }

      if (result.status === "success") {
        setIsUploadModalOpen(false);
        resetUploadState();
        await fetchFiles();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "خطا در آپلود فایل");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFileSelection = (file: FileData) => {
    setSelectedFiles((prev) => {
      const isSelected = prev.some((f) => f._id === file._id);
      if (isSelected) {
        return prev.filter((f) => f._id !== file._id);
      } else {
        return [...prev, file];
      }
    });
  };

  const handleConfirmSelection = () => {
    onFileSelect?.(selectedFiles);
    setIsOpenModal(false);
  };

  useEffect(() => {
    if (isOpenModal) {
      fetchFiles();
    }
  }, [isOpenModal]);

  useEffect(() => {
    // Cleanup preview URL when component unmounts or new file is selected
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const UploadModal = () => (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={() => {
        setIsUploadModalOpen(false);
        resetUploadState();
      }}
      title="آپلود فایل جدید"
    >
      <div className="p-6">
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
              ${previewUrl ? "border-blue-500" : "border-gray-300 hover:border-blue-500"}`}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {previewUrl ? (
              <div className="relative group">
                <img src={previewUrl} alt="پیش نمایش" className="max-h-64 mx-auto rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    تغییر تصویر
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">
                  برای انتخاب تصویر کلیک کنید یا فایل را اینجا رها کنید
                </p>
                <p className="text-sm text-gray-400 mt-2">فرمت‌های مجاز: JPG، PNG</p>
              </div>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
          {selectedFile && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <span className="text-xs text-gray-400 mr-2">
                  ({Math.round(selectedFile.size / 1024)} KB)
                </span>
              </div>
              <button
                onClick={resetUploadState}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 space-x-reverse">
          <DashboardButton
            type="button"
            variant="tertiary"
            onXsIsText
            onClick={() => {
              setIsUploadModalOpen(false);
              resetUploadState();
            }}
          >
            انصراف
          </DashboardButton>
          {selectedFile && (
            <DashboardButton
              type="button"
              onXsIsText
              onClick={uploadFile}
              disabled={isLoading}
              className="relative"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  در حال آپلود...
                </>
              ) : (
                "آپلود"
              )}
            </DashboardButton>
          )}
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} title="گالری تصاویر">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <DashboardButton type="button" onXsIsText onClick={() => setIsUploadModalOpen(true)}>
              آپلود فایل جدید
            </DashboardButton>

            {selectedFiles.length > 0 && (
              <DashboardButton type="button" onXsIsText onClick={handleConfirmSelection}>
                انتخاب ({selectedFiles.length} فایل)
              </DashboardButton>
            )}
          </div>

          {isLoading && !selectedFile ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="mr-2">در حال بارگذاری...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {files.map((file) => {
                const isSelected = selectedFiles.some((f) => f._id === file._id);
                return (
                  <div
                    key={file._id}
                    className={`relative group cursor-pointer border rounded-lg p-2 ${
                      isSelected ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => toggleFileSelection(file)}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${file.location}`}
                      alt={file.name}
                      className="w-32 h-32 object-cover rounded"
                    />
                    <div
                      className={`absolute inset-0 bg-black ${
                        isSelected ? "bg-opacity-20" : "bg-opacity-0 group-hover:bg-opacity-40"
                      } transition-all duration-300 rounded`}
                    >
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="text-blue-500 w-8 h-8 bg-white rounded-full" />
                        ) : (
                          <span className="text-white text-sm">انتخاب</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs mt-2 truncate">{file.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      <UploadModal />
    </>
  );
}
